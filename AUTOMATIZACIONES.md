# Automatizaciones del formulario de contacto

**Flujo único — Supabase es la fuente de verdad.** El formulario
(`src/components/ContactModal.jsx`) hace una sola escritura: inserta el lead en
la tabla `leads` de Supabase. Esa inserción dispara un **Database Webhook** de
Supabase hacia n8n, que envía el email y el WhatsApp. El CRM (`/admin`) lee y
gestiona esos mismos leads. No hay doble escritura ni copias en Google Sheets.

```
ContactModal (React)
      │  insert() en la tabla `leads`
      ▼
   Supabase  ──(Database Webhook: INSERT)──►  n8n
      ▲                                         ├─► Email de bienvenida   (Gmail / Resend)
      │  read / update status                   └─► WhatsApp Cloud API     (Meta / Twilio)
   CRM (/admin)
```

> Si el `insert` en Supabase falla (red caída, etc.), el formulario abre WhatsApp
> (`wa.me`) con los datos pre-rellenados como **respaldo**. Como el lead no llegó
> a guardarse, no se generan duplicados.

## 1. Crear la tabla, RLS y el usuario admin

1. En el **Dashboard de Supabase → SQL Editor**, ejecuta `supabase/schema.sql`.
   Eso crea la tabla `leads`, los índices, las políticas RLS (el formulario solo
   puede *insertar*; el CRM, ya autenticado, puede *leer* y *actualizar*).
2. En **Authentication → Users → Add user**, crea el usuario administrador del CRM
   (correo + contraseña). Con eso entras en `/admin` vía Supabase Auth.

## 2. Configurar el frontend

1. Copia `.env.example` a `.env.local`.
2. Rellena `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los de tu proyecto.
3. Reinicia `npm run dev` (Vite solo lee las variables al arrancar).

En producción (Vercel / Netlify) define esas mismas dos variables en el panel del
hosting. **Ya no hay** `VITE_LEAD_WEBHOOK_URL` ni `VITE_ADMIN_PASSWORD`.

## 3. Conectar Supabase con n8n (Database Webhook)

1. **Dashboard → Database → Webhooks → Create a new hook.**
   - Tabla: `public.leads`
   - Eventos: **Insert**
   - Tipo: **HTTP Request**, método `POST`, URL del webhook de tu flujo n8n.
2. Importa `n8n-template.json` en n8n y activa el flujo.

Supabase envía al webhook un body con esta forma:

```json
{
  "type": "INSERT",
  "table": "leads",
  "record": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "whatsapp": "+57 300 000 0000",
    "correo": "juan@tuempresa.com",
    "empresa": "Mi Negocio SAS",
    "servicio": "Landing Page + IA",
    "descripcion": "Quiero automatizar la atención por WhatsApp.",
    "status": "nuevo",
    "origen": "landing-autoscale",
    "url": "https://tudominio.com/",
    "created_at": "2026-06-18T15:00:00.000Z"
  }
}
```

Por eso en n8n los campos se leen como `{{$json.body.record.nombre}}`, etc.

## 4. El flujo en n8n (resumen del template)

1. **Webhook (Trigger)** — recibe el `INSERT` de Supabase.
2. **Gmail / Resend** — email de bienvenida a `{{$json.body.record.correo}}`.
3. **WhatsApp Cloud API (Meta) / Twilio** — mensaje a `{{$json.body.record.whatsapp}}`.

> Ya **no** hay nodo de Google Sheets: el lead vive en Supabase, que es la única
> fuente de verdad. Si quieres un espejo en Sheets, añádelo como paso extra, pero
> no es necesario para el CRM.

## 5. Notas

- **Sin CORS que resolver:** el navegador ya no llama a n8n directamente; quien lo
  invoca es Supabase desde su backend.
- **El "éxito" ya no miente:** el formulario muestra la pantalla de éxito solo
  cuando el `insert` se confirma. El email/WhatsApp corren de forma asíncrona en
  n8n disparados por la base de datos.
