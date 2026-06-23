# Mensajes de WhatsApp / Instagram / Messenger → CRM

Cuando un cliente te escribe por **WhatsApp Business**, **Instagram DM** o
**Messenger**, Meta envía un webhook a la Edge Function `meta-webhook`, que crea
un lead en la tabla `leads`. A partir de ahí aparece en el CRM como cualquier
otro lead, con su badge de canal (💬 WhatsApp / 📷 Instagram / 💙 Messenger) y
dispara las mismas automatizaciones de n8n que un lead del formulario.

```
Cliente escribe  →  Meta  →  Edge Function meta-webhook  →  tabla leads  →  CRM
                                                                  └→ Database Webhook → n8n
```

## URL del webhook (ya desplegada)

```
https://cdojsvfekspzsmzroltm.supabase.co/functions/v1/meta-webhook
```

## 1. Secrets en Supabase

Dashboard → **Edge Functions → Secrets** (o Project Settings → Edge Functions):

| Secret              | Obligatorio | Para qué sirve                                                            |
| ------------------- | ----------- | ------------------------------------------------------------------------- |
| `META_VERIFY_TOKEN` | Sí          | Una contraseña que tú inventas. La repetirás en Meta al configurar.       |
| `META_APP_SECRET`   | Recomendado | Valida la firma de cada webhook (App Secret de tu app de Meta).           |
| `META_PAGE_TOKEN`   | Opcional    | Token de página para resolver el **nombre real** en Messenger/Instagram. |

> `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` los inyecta Supabase solo.

## 2. Configuración en Meta for Developers

> Tu app de Meta es la que ya conecta tu página de Facebook, Instagram y WhatsApp
> Business. Si no tienes una app, créala en https://developers.facebook.com.

Para **cada producto** (WhatsApp, Messenger, Instagram) en el panel de la app:

1. Entra a **Webhooks** del producto → **Editar suscripción / Callback URL**.
2. **Callback URL**: la URL de arriba.
3. **Verify token**: el mismo valor que pusiste en `META_VERIFY_TOKEN`.
4. Meta hará una llamada de verificación (GET). Debe quedar en verde ✅.
5. **Suscríbete a los campos de mensajes**:
   - **WhatsApp** → campo `messages`.
   - **Messenger** → campo `messages` (suscribe también la página).
   - **Instagram** → campo `messages`.

### WhatsApp en producción

El número de WhatsApp Business debe estar conectado a esta app (WhatsApp →
Configuración de la API) y la app fuera de modo desarrollo para recibir mensajes
de cualquier cliente.

## 3. Probar

1. Escríbete a ti mismo por WhatsApp / un DM de Instagram / un mensaje de Messenger.
2. En unos segundos debe aparecer un lead nuevo en el CRM con el badge del canal.
3. Si no aparece, mira los logs: Dashboard → **Edge Functions → meta-webhook → Logs**.

## Notas

- **Anti-duplicados**: si la misma persona te escribe varias veces por el mismo
  canal, no se crea un lead nuevo (índice único `origen + canal_externo_id`).
- **El chat sigue en la app de Meta/WhatsApp**: aquí solo entra el contacto como
  lead. Desde el CRM puedes responderle por WhatsApp con el botón 💬 (solo
  WhatsApp tiene número; en Instagram/Messenger respondes desde la app de Meta).
- Sin `META_PAGE_TOKEN`, los leads de Instagram/Messenger entran con un nombre
  provisional (`Instagram <id>` / `Messenger <id>`) hasta que añadas el token.
