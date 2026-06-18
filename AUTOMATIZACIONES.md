# Automatizaciones del formulario de contacto

El formulario (`src/components/ContactModal.jsx`) envía cada lead a **un único
webhook** de un orquestador sin código (n8n, Make o Zapier). Ese flujo se encarga
de las 3 automatizaciones, sin exponer ningún token secreto en el navegador.

```
ContactModal (React)
      │  POST JSON con los datos del lead
      ▼
  Webhook (n8n / Make / Zapier)
      ├─► 1. Guarda el lead en Google Sheets / Airtable     (captura)
      ├─► 2. Email automático de bienvenida al cliente        (Gmail / Resend)
      └─► 3. Mensaje por WhatsApp Cloud API / Twilio          (WhatsApp API)
```

> Si el webhook falla o no está configurado, el formulario abre WhatsApp (`wa.me`)
> con los datos pre-rellenados como **respaldo**, para no perder nunca el lead.

## 1. Configurar la URL del webhook

1. Copia `.env.example` a `.env.local`.
2. Pega la URL de tu webhook en `VITE_LEAD_WEBHOOK_URL`.
3. Reinicia `npm run dev` (Vite solo lee las variables al arrancar).

En producción (Vercel / Netlify / etc.) define la misma variable
`VITE_LEAD_WEBHOOK_URL` en el panel de variables de entorno del hosting.

## 2. Formato del payload (lo que recibe el webhook)

`Content-Type: application/json`

```json
{
  "nombre": "Juan Pérez",
  "whatsapp": "+57 300 000 0000",
  "correo": "juan@tuempresa.com",
  "empresa": "Mi Negocio SAS",
  "servicio": "Landing Page + IA",
  "descripcion": "Quiero automatizar la atención por WhatsApp.",
  "origen": "landing-autoscale",
  "fecha": "2026-06-18T15:00:00.000Z",
  "url": "https://tudominio.com/"
}
```

## 3. Armar el flujo (ejemplo con n8n)

1. **Webhook (Trigger)** — método `POST`. Copia su URL de producción a `.env.local`.
2. **Google Sheets → Append Row** — mapea cada campo del JSON a una columna.
   (Alternativa: Airtable → Create Record.)
3. **Email** — nodo Gmail / SMTP / Resend:
   - Para: `{{$json.correo}}`
   - Asunto: `¡Recibimos tu solicitud, {{$json.nombre}}!`
   - Cuerpo: mensaje de bienvenida + próximos pasos.
4. **WhatsApp** — nodo WhatsApp Cloud API (Meta) o Twilio:
   - Notificación interna al equipo, y/o
   - Mensaje automático de confirmación al `{{$json.whatsapp}}`.
5. **Respond to Webhook** — devuelve `200`. El frontend muestra la pantalla de
   éxito solo si la respuesta es `2xx`.

> En **Make** o **Zapier** el patrón es idéntico: módulo *Webhooks → Custom webhook*
> como disparador y luego los módulos de Sheets / Email / WhatsApp.

## 4. CORS (importante)

El navegador llama al webhook directamente, así que el orquestador debe permitir
peticiones desde el dominio de la landing:

- **n8n:** define `N8N_CORS_ALLOW_ORIGIN` (o usa un proxy) para tu dominio.
- **Make / Zapier:** sus webhooks aceptan CORS por defecto.

Si ves errores de CORS en la consola, el formulario seguirá funcionando vía el
respaldo de WhatsApp mientras lo resuelves.
