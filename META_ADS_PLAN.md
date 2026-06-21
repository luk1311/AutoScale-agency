# Plan de implementación — Meta Ads + Claude + CRM (AutoScale)

> Objetivo: **medir conversiones** de la landing (Pixel + CAPI), **generar y
> optimizar campañas con IA (Claude)** y **convertir leads en ventas**, todo
> apoyado en el flujo único que ya existe: `Landing → Supabase → DB Webhook → n8n`.

---

## 0. Idea en una frase

El embudo se cierra en tres capas que se retroalimentan:

```
   ANUNCIO (Meta)
        │  clic (guardamos fbclid + UTMs)
        ▼
   LANDING ── Pixel (navegador) ─┐
        │                        ├─ mismo event_id → DEDUPLICACIÓN
        ▼                        │
   SUPABASE (insert lead) ──► DB Webhook ──► n8n ──► CAPI (servidor) ─┘
        │                                       └──► Email + WhatsApp
        ▼
   CRM (/admin) ── Claude ──► copys, públicos, scoring, lookalikes
        │
        └──► Meta optimiza entrega hacia los leads que SÍ se vuelven ventas
```

- **Medir** bien (Pixel + CAPI con deduplicación) es el cimiento: sin datos de
  conversión limpios, la IA de Meta (Advantage+) optimiza a ciegas.
- **Claude** trabaja sobre los leads reales del CRM para producir creativos y
  segmentación, y para puntuar/priorizar leads.
- **Vender**: marcamos en el CRM qué leads se ganan y devolvemos esa señal a Meta
  (evento `Purchase`/conversión de valor) para que optimice hacia ventas, no solo
  hacia formularios enviados.

---

## 1. Capa de medición — Meta Pixel + Conversions API (CAPI)

### 1.1 ¿Por qué las dos?
- **Pixel (navegador):** rápido de instalar, pero lo degradan iOS, bloqueadores y
  el fin de las cookies de terceros.
- **CAPI (servidor):** envía el evento desde tu backend (aquí, n8n), con datos de
  usuario *hasheados*. Mejor calidad de emparejamiento y resiliente al navegador.
- **Juntos + `event_id` compartido:** Meta deduplica (no cuenta doble) y combina
  lo mejor de ambos. Es el estándar recomendado por Meta.

### 1.2 Eventos que vamos a enviar

| Evento        | Dónde se dispara                         | Capa          |
|---------------|------------------------------------------|---------------|
| `PageView`    | Al cargar la landing                     | Pixel         |
| `ViewContent` | Al abrir el `ContactModal`               | Pixel         |
| `Lead`        | Al enviar el formulario (insert OK)      | Pixel + CAPI  |
| `Purchase`*   | Al marcar un lead como **ganado** en CRM | CAPI          |

\* `Purchase` (o una conversión personalizada con valor) es lo que convierte tu
campaña de "generar leads" en "generar ventas".

### 1.3 Pixel en la landing (cliente)

1. Añadir el `VITE_META_PIXEL_ID` a `.env`.
2. Cargar el script base del Pixel en `index.html` o en `main.jsx`.
3. Disparar eventos desde React:
   - `PageView` automático.
   - `ViewContent` en `Landing.jsx` → `openModal`.
   - `Lead` en `ContactModal.jsx`, **solo tras el insert exitoso**, generando un
     `eventID` único (UUID) que también viajará por CAPI.

```js
// ContactModal.jsx (al confirmar el insert en Supabase)
const eventId = crypto.randomUUID();
// 1) Pixel (navegador)
window.fbq?.('track', 'Lead', { content_name: formData.servicio }, { eventID: eventId });
// 2) ese MISMO eventId se guarda en el lead para que n8n lo reenvíe por CAPI
//    → columna nueva: meta_event_id
```

> Importante: el `eventID` del Pixel y el `event_id` de CAPI **deben ser idénticos**
> para que Meta deduplique.

### 1.4 CAPI desde n8n (recomendado)

El DB Webhook ya manda el `record` del lead a n8n. Añadimos un nodo **HTTP Request**
que postea a la Graph API. Los datos de usuario (email, teléfono) van **hasheados
con SHA-256** (requisito de Meta).

```
POST https://graph.facebook.com/v21.0/{PIXEL_ID}/events?access_token={CAPI_TOKEN}
{
  "data": [{
    "event_name": "Lead",
    "event_time": <unix>,
    "event_id": "{{$json.body.record.meta_event_id}}",   // dedupe con el Pixel
    "action_source": "website",
    "event_source_url": "{{$json.body.record.url}}",
    "user_data": {
      "em": ["<sha256(email en minúsculas)>"],
      "ph": ["<sha256(solo dígitos del teléfono)>"],
      "fbc": "<fbclid capturado>",      // ver 3.1
      "fbp": "<cookie _fbp>"
    },
    "custom_data": { "content_name": "{{$json.body.record.servicio}}" }
  }]
}
```

**Tokens necesarios (todos del lado servidor, NUNCA en el bundle):**
- `META_PIXEL_ID`
- `META_CAPI_TOKEN` (token de acceso del dataset, se genera en Events Manager)
- Opcional: `META_TEST_EVENT_CODE` para validar en "Test Events".

> Alternativa: en vez de n8n, una **Supabase Edge Function** disparada por el insert.
> Mismo payload. Elegir n8n mantiene todo en un solo flujo; Edge Function da más
> aislamiento. (Decisión pendiente.)

### 1.5 Cómo verificar que mide bien
- **Events Manager → Test Events:** ver llegar `Lead` por Pixel y por Server.
- **Event Match Quality:** apuntar a "Bueno/Excelente" (más campos hasheados = mejor).
- **Deduplicación:** Meta debe mostrar el evento como deduplicado, no doble.

---

## 2. Capa de atribución — conectar el anuncio con el lead

Sin esto no sabes **qué campaña/anuncio** generó cada venta.

### 2.1 Capturar origen en la landing
Al cargar la página, leer de la URL y guardar (en `sessionStorage` y luego en el lead):
- `fbclid` (clic de Facebook) → se convierte en `fbc` para CAPI.
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
- Cookie `_fbp` (la pone el Pixel).

### 2.2 Nuevas columnas en `leads` (Supabase)
```sql
alter table public.leads add column if not exists meta_event_id text;
alter table public.leads add column if not exists fbclid       text;
alter table public.leads add column if not exists fbc          text;
alter table public.leads add column if not exists fbp          text;
alter table public.leads add column if not exists utm_source   text;
alter table public.leads add column if not exists utm_medium   text;
alter table public.leads add column if not exists utm_campaign text;
alter table public.leads add column if not exists utm_content  text;
```
Así, cada lead en el CRM dice de qué campaña vino → puedes calcular CPL y ROAS por
campaña y, sobre todo, **devolver la venta a la campaña correcta**.

---

## 3. Capa de IA — Claude para crear y optimizar campañas

> Las llamadas a Claude se hacen **server-side** (n8n HTTP node o Supabase Edge
> Function) para no exponer la `ANTHROPIC_API_KEY`. Modelos sugeridos:
> **`claude-opus-4-8`** o **`claude-sonnet-4-6`** para creatividad/copys;
> **`claude-haiku-4-5`** para tareas masivas y baratas (scoring, clasificación).

### 3.1 Generador de campañas (botón en el CRM)
En `/admin`, un botón "✨ Generar campaña con IA" que toma como contexto:
- El servicio/oferta seleccionada.
- Patrones de los leads reales (qué servicios piden, sectores, objeciones del campo
  "descripción").

Claude devuelve un **paquete de campaña** estructurado (pídelo en JSON):
- 3–5 **ángulos** (dolor, deseo, prueba social, urgencia…).
- **Copys** para primario, titular y descripción (varias variantes para A/B).
- **Públicos** sugeridos (intereses, lookalikes, exclusiones).
- **Ideas de creativo** (guion de video corto, concepto de imagen).
- **Presupuesto y estructura** de campaña sugerida.

Ejemplo de prompt (resumen):
```
Eres un media buyer experto en Meta Ads para agencias de IA en LATAM.
Oferta: {servicio}. Cliente ideal inferido de estos leads: {muestra}.
Objeciones frecuentes (de descripciones): {texto}.
Devuelve SOLO JSON con: angulos[], copys[{primario,titular,descripcion}],
publicos[], creativos[], estructura{presupuesto,campañas[]}.
```

### 3.2 Lead scoring automático (Claude Haiku)
Cuando entra un lead, n8n llama a Claude Haiku para puntuarlo 0–100 (intención de
compra, fit, urgencia) leyendo `servicio` + `descripcion`. Se guarda en una columna
`score` y el CRM ordena/colorea por prioridad. Beneficio doble:
- Tu equipo contacta primero a los leads calientes.
- Puedes **enviar a Meta como conversión de mayor valor** solo los leads con score
  alto → Meta optimiza hacia leads de calidad, no volumen.

### 3.3 Optimización continua
Una rutina periódica (`/loop` o cron en n8n) que:
1. Cruza leads del CRM (ganados/perdidos) con sus `utm_campaign`.
2. Pasa a Claude el rendimiento por campaña (CPL, % ganados, score medio).
3. Claude sugiere: qué pausar, qué escalar, qué copy iterar, nuevos ángulos.
4. Entrega un **resumen accionable** (email/WhatsApp/Slack al equipo).

### 3.4 Mensajes de seguimiento personalizados
Claude redacta el primer mensaje de WhatsApp/email por lead, adaptado a su
`descripcion` y `servicio`, en vez de la plantilla fija actual del CRM.

---

## 4. Ideas de integración con el CRM (resumen)

| Idea                              | Qué aporta                                          | Esfuerzo |
|-----------------------------------|-----------------------------------------------------|----------|
| Atribución UTM/fbclid por lead    | Saber qué campaña trae ventas (no solo leads)       | Bajo     |
| Evento `Purchase` al marcar Ganado| Meta optimiza hacia VENTAS reales                   | Bajo     |
| Columna `score` (Claude Haiku)    | Priorizar leads calientes + señal de calidad a Meta | Medio    |
| Botón "Generar campaña con IA"    | Copys/públicos/creativos desde leads reales         | Medio    |
| Dashboard de métricas (Mktg API)  | Gasto, CPL, ROAS por campaña dentro de /admin       | Alto     |
| Lookalikes desde clientes ganados | Subir lista hasheada de "ganados" → audiencias top  | Medio    |
| Resumen semanal de optimización   | Claude recomienda escalar/pausar                    | Medio    |
| Seguimiento auto-redactado        | Mensaje 1:1 por lead con Claude                     | Bajo     |

### Lookalikes desde ventas (alto impacto)
Exportar la lista de leads con `status = 'ganado'`, hashearla y subirla como
**Custom Audience** → crear **Lookalike**. Es la forma más directa de decirle a
Meta "tráeme más gente como mis clientes que YA compraron".

---

## 5. Hoja de ruta por fases

### Fase 1 — Medir (cimiento) ✅ prioridad
- [ ] Crear Pixel y dataset en Events Manager; generar `META_CAPI_TOKEN`.
- [ ] Instalar Pixel base en la landing (`PageView`).
- [ ] Evento `ViewContent` al abrir el modal.
- [ ] Capturar `fbclid`/UTMs/`_fbp` en la landing → guardarlos en el lead.
- [ ] Migración SQL: columnas `meta_event_id`, `fbclid`, `fbc`, `fbp`, `utm_*`.
- [ ] Evento `Lead` (Pixel) con `eventID` tras insert OK.
- [ ] Nodo CAPI en n8n (hash SHA-256 de email/teléfono) con el mismo `event_id`.
- [ ] Validar en Test Events + Event Match Quality.

### Fase 2 — Cerrar el bucle de ventas
- [ ] Al marcar un lead como **ganado** en el CRM → enviar `Purchase`/conversión a CAPI.
- [ ] Conversión personalizada en Meta optimizada a "ganado", no a "lead".
- [ ] Custom Audience + Lookalike desde leads ganados.

### Fase 3 — IA con Claude
- [ ] Lead scoring con Claude Haiku (columna `score` + orden en CRM).
- [ ] Botón "Generar campaña con IA" en `/admin` (Opus/Sonnet, salida JSON).
- [ ] Mensajes de seguimiento auto-redactados.

### Fase 4 — Optimización y reporting
- [ ] Dashboard de métricas con la Marketing API en `/admin`.
- [ ] Rutina de optimización semanal (Claude analiza CPL/ROAS y recomienda).

---

## 6. Requisitos de cuenta y setup (Meta)
1. **Meta Business Manager** + **cuenta publicitaria**.
2. **Events Manager** → crear **Pixel/Dataset** → copiar `PIXEL_ID`.
3. Generar **token de CAPI** (Conversions API) del dataset.
4. (Fase 4) App en **developers.facebook.com** con permiso `ads_read` para la
   Marketing API.
5. Verificar el dominio de la landing en Business Manager.

## 7. Variables de entorno (todas server-side salvo el Pixel ID)
```
# Frontend (público, va en el bundle — solo el ID, nunca el token)
VITE_META_PIXEL_ID=xxxxxxxxxxxxx

# Servidor (n8n / Edge Function) — SECRETOS, nunca con prefijo VITE_
META_PIXEL_ID=xxxxxxxxxxxxx
META_CAPI_TOKEN=EAAG...
META_TEST_EVENT_CODE=TEST12345        # solo en pruebas
ANTHROPIC_API_KEY=sk-ant-...          # para los pasos con Claude
```

## 8. Privacidad y cumplimiento (no opcional)
- **Hashear SIEMPRE** email/teléfono con SHA-256 antes de mandarlos a Meta (CAPI lo exige).
- **Banner de consentimiento de cookies** antes de disparar el Pixel (GDPR/“consent mode”).
- Añadir **política de privacidad** que mencione el uso de Meta Pixel y datos.
- No enviar a Claude/Meta más PII de la necesaria; el `descripcion` puede traer datos
  sensibles → revisar antes de incluirlo en prompts.
- Mantener RLS de Supabase como está (anon solo inserta).

## 9. KPIs para saber si funciona
- **Event Match Quality** (Meta) — calidad del emparejamiento CAPI.
- **CPL** (costo por lead) y **CPL por campaña** (gracias a UTMs).
- **% de leads ganados** y **CAC** (costo de adquisición de cliente).
- **ROAS** (retorno sobre inversión publicitaria) — el número que importa.
- **Score medio** de los leads por campaña (calidad, no solo cantidad).

---

### Nota de arquitectura
Todo esto encaja sin romper el flujo único actual: el lead sigue entrando una sola
vez a Supabase; el DB Webhook ya en producción solo gana pasos nuevos en n8n
(CAPI, scoring). El CRM gana columnas y botones, pero sigue leyendo de la misma
fuente de verdad. Nada de esto reintroduce doble escritura ni secretos en el navegador.
