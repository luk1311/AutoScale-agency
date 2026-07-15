/* ==========================================================================
   OPERACIÓN por plantilla — stack técnico y costos operacionales.
   Fuente: notas técnicas del catálogo + estimación de proveedores en jul-2026.
   Costos MENSUALES por CLIENTE promedio (en COP, 1 USD ~ 4.200 COP).
   Regla: si algo se autoaloja o vive en free tier, lo indicamos.
   ==========================================================================

   Cómo se conecta:
   El componente TemplatesLibrary importa STACK_BY_ID y COSTOS_BY_ID desde
   este archivo y renderiza dos bloques al final de cada ficha:
     - Stack técnico (herramientas + propósito)
     - Costos operacionales mensuales (con un total calculado)
   Así los costos viven en un solo lugar y son fáciles de actualizar cuando
   cambien precios de proveedores. */

/* ==== STACK: qué herramientas mueven cada plantilla ==== */
export const STACK_BY_ID = {
  /* ── CRMs (base tech transversal) ─────────────────────── */
  citas: [
    { tool: 'Next.js + React', proposito: 'App del CRM (panel del cliente)' },
    { tool: 'Supabase (Postgres + Auth + RLS)', proposito: 'Base de datos y login del panel' },
    { tool: 'n8n', proposito: 'Automatizaciones (recordatorios, reactivación, reseñas)' },
    { tool: 'WhatsApp Cloud API', proposito: 'Envío de mensajes al cliente final' },
    { tool: 'Vercel', proposito: 'Hosting del CRM y la web pública' },
  ],
  cotizaciones: [
    { tool: 'Next.js + React', proposito: 'Panel del CRM' },
    { tool: 'Supabase (Postgres + Auth + RLS)', proposito: 'Leads, cotizaciones, actividades' },
    { tool: 'n8n', proposito: 'Alertas de cotización por vencer y secuencias' },
    { tool: 'WhatsApp Cloud API', proposito: 'Seguimiento al lead' },
    { tool: 'Resend o Gmail API', proposito: 'Envío del PDF de cotización por correo' },
    { tool: 'Vercel', proposito: 'Hosting del CRM' },
  ],
  pedidos: [
    { tool: 'Next.js + React', proposito: 'Tablero de cocina (KDS) y panel de dueño' },
    { tool: 'Supabase (Postgres + Auth + RLS + Realtime)', proposito: 'Pedidos en vivo entre WhatsApp y cocina' },
    { tool: 'n8n', proposito: 'Confirmación, aviso de estado, cierre del día' },
    { tool: 'WhatsApp Cloud API', proposito: 'Canal de pedidos y avisos' },
    { tool: 'Vercel', proposito: 'Hosting' },
  ],
  membresias: [
    { tool: 'Next.js + React', proposito: 'Panel de retención y check-in' },
    { tool: 'Supabase (Postgres + Auth + RLS)', proposito: 'Miembros, planes, asistencias, pagos' },
    { tool: 'n8n', proposito: 'Recordatorios de pago, "te extrañamos", conversión de prueba' },
    { tool: 'WhatsApp Cloud API', proposito: 'Notificaciones al miembro' },
    { tool: 'Vercel', proposito: 'Hosting' },
  ],
  finanzas: [
    { tool: 'Next.js + React', proposito: 'Panel del mes + registro rápido' },
    { tool: 'Supabase (Postgres + Auth + RLS)', proposito: 'Movimientos, categorías, cierres' },
    { tool: 'n8n', proposito: 'Recordatorios de cobro y alertas de presupuesto' },
    { tool: 'WhatsApp Cloud API', proposito: 'Registro conversacional y resumen al dueño' },
    { tool: 'Vercel', proposito: 'Hosting' },
  ],

  /* ── Recepcionistas / Agentes IA ─────────────────────── */
  agendadora: [
    { tool: 'Claude 4.5 Haiku (Anthropic API)', proposito: 'Cerebro conversacional (tool use)' },
    { tool: 'n8n', proposito: 'Orquestación de tools y handoff a humano' },
    { tool: 'WhatsApp Cloud API', proposito: 'Canal inbound (nunca escribe primero)' },
    { tool: 'Supabase', proposito: 'Fuente de verdad (agenda, servicios, cliente)' },
  ],
  cotizadora: [
    { tool: 'Claude 4.5 Sonnet (Anthropic API)', proposito: 'Cualificación conversacional (más contexto)' },
    { tool: 'n8n', proposito: 'Orquestación + agendar_llamada' },
    { tool: 'WhatsApp Cloud API', proposito: 'Canal' },
    { tool: 'Google Calendar API', proposito: 'Agenda del asesor humano' },
    { tool: 'Supabase', proposito: 'Leads cualificados y catálogo' },
  ],
  'pedidos-ia': [
    { tool: 'Claude 4.5 Haiku (Anthropic API)', proposito: 'Cerebro del tomador de pedidos' },
    { tool: 'n8n', proposito: 'Orquestación + crear_pedido → tablero' },
    { tool: 'WhatsApp Cloud API', proposito: 'Canal' },
    { tool: 'Supabase (Realtime)', proposito: 'Pedidos que caen en vivo en cocina' },
  ],
  soporte: [
    { tool: 'Claude 4.5 Haiku (Anthropic API)', proposito: 'Cerebro (FAQ + clasificación)' },
    { tool: 'n8n', proposito: 'Orquestación + handoff' },
    { tool: 'WhatsApp Cloud API', proposito: 'Canal' },
    { tool: 'Supabase (pgvector)', proposito: 'Base de conocimiento con búsqueda semántica' },
  ],
  financiera: [
    { tool: 'Claude 4.5 Haiku (Anthropic API)', proposito: 'Interpretación de lenguaje natural ("gasté 50k…")' },
    { tool: 'n8n', proposito: 'Orquestación + registrar_movimiento' },
    { tool: 'WhatsApp Cloud API', proposito: 'Canal (solo whitelist del dueño)' },
    { tool: 'Supabase', proposito: 'Panel de Finanzas (movimientos, cierres)' },
  ],

  /* ── Jugadas premium ─────────────────────────────────── */
  voz: [
    { tool: 'ElevenLabs (voz neuronal en español)', proposito: 'Voz natural del agente' },
    { tool: 'Twilio Programmable Voice', proposito: 'Telefonía saliente (números CO)' },
    { tool: 'Claude 4.5 Sonnet', proposito: 'Cerebro conversacional en tiempo real' },
    { tool: 'n8n', proposito: 'Orquestación de campañas y resultados al CRM' },
    { tool: 'Supabase', proposito: 'Registro de intentos y resultados' },
  ],
  creativos: [
    { tool: 'Higgsfield (video/imagen IA)', proposito: 'Generación de reels e imágenes' },
    { tool: 'Canva API', proposito: 'Plantillas de marca y banners' },
    { tool: 'Claude 4.5 Sonnet', proposito: 'Guion, hooks y captions' },
    { tool: 'Postiz (self-host) o Ayrshare', proposito: 'Publicación programada a IG/FB/TikTok' },
    { tool: 'n8n', proposito: 'Flujo: generar → aprobar → publicar → medir' },
  ],
  copiloto: [
    { tool: 'n8n (scheduler)', proposito: 'Corre cada mañana a la hora acordada' },
    { tool: 'Claude 4.5 Haiku', proposito: 'Arma el resumen y prioriza acciones' },
    { tool: 'Supabase', proposito: 'Fuente de datos del negocio' },
    { tool: 'WhatsApp Cloud API', proposito: 'Entrega al dueño (whitelist)' },
  ],
  'panel-aconseja': [
    { tool: 'Next.js + React', proposito: 'UI del panel con recomendaciones' },
    { tool: 'Supabase + Edge Functions', proposito: 'Reglas de señal (stock, recompra, ads, precio)' },
    { tool: 'Claude 4.5 Sonnet', proposito: 'Redacción de la recomendación en lenguaje llano' },
    { tool: 'n8n', proposito: 'Cron de detección y notificaciones' },
  ],
};

/* ==== COSTOS operacionales mensuales por CLIENTE (COP) ==== */
/* Nota: 1 USD ≈ 4.200 COP. Cuando algo se comparte entre clientes
   (Evolution self-host, n8n self-host, seat de Vercel) el monto es la
   porción prorrateada por cliente promedio. */
export const COSTOS_BY_ID = {
  citas: [
    { concepto: 'Supabase Pro (compartido)', monto: 6000, nota: 'prorrateado por cliente' },
    { concepto: 'n8n Cloud Starter', monto: 8000, nota: '~10 flujos activos por cliente' },
    { concepto: 'WhatsApp Cloud API', monto: 12000, nota: 'plantillas de recordatorio y confirmación' },
    { concepto: 'Vercel Hobby/Pro', monto: 5000, nota: 'CRM + web' },
  ],
  cotizaciones: [
    { concepto: 'Supabase Pro (compartido)', monto: 6000, nota: 'prorrateado' },
    { concepto: 'n8n Cloud Starter', monto: 8000, nota: 'seguimiento a leads' },
    { concepto: 'WhatsApp Cloud API', monto: 15000, nota: 'seguimiento a leads calientes' },
    { concepto: 'Resend', monto: 6000, nota: 'envío del PDF de cotización' },
    { concepto: 'Vercel', monto: 5000, nota: '' },
  ],
  pedidos: [
    { concepto: 'Supabase Pro + Realtime', monto: 10000, nota: 'pedidos en vivo' },
    { concepto: 'n8n Cloud Starter', monto: 8000, nota: 'confirmaciones y estados' },
    { concepto: 'WhatsApp Cloud API', monto: 30000, nota: 'alto volumen por pedido' },
    { concepto: 'Vercel', monto: 5000, nota: '' },
  ],
  membresias: [
    { concepto: 'Supabase Pro (compartido)', monto: 6000, nota: 'prorrateado' },
    { concepto: 'n8n Cloud Starter', monto: 8000, nota: '' },
    { concepto: 'WhatsApp Cloud API', monto: 10000, nota: 'recordatorios y reactivación' },
    { concepto: 'Vercel', monto: 5000, nota: '' },
  ],
  finanzas: [
    { concepto: 'Supabase Pro (compartido)', monto: 6000, nota: 'prorrateado' },
    { concepto: 'n8n Cloud Starter', monto: 6000, nota: 'cierre y alertas' },
    { concepto: 'WhatsApp Cloud API', monto: 8000, nota: 'entrega al dueño' },
    { concepto: 'Vercel', monto: 5000, nota: '' },
  ],

  agendadora: [
    { concepto: 'Claude Haiku API', monto: 15000, nota: '~1.000 conversaciones/mes' },
    { concepto: 'WhatsApp Cloud API', monto: 20000, nota: 'volumen inbound' },
    { concepto: 'n8n', monto: 6000, nota: 'flujo del agente' },
    { concepto: 'Supabase', monto: 4000, nota: 'contexto y catálogo' },
  ],
  cotizadora: [
    { concepto: 'Claude Sonnet API', monto: 45000, nota: 'conversación cualificadora más larga' },
    { concepto: 'WhatsApp Cloud API', monto: 15000, nota: '' },
    { concepto: 'n8n', monto: 6000, nota: '' },
    { concepto: 'Google Calendar API', monto: 0, nota: 'gratis' },
    { concepto: 'Supabase', monto: 4000, nota: '' },
  ],
  'pedidos-ia': [
    { concepto: 'Claude Haiku API', monto: 22000, nota: 'muchas conversaciones cortas' },
    { concepto: 'WhatsApp Cloud API', monto: 30000, nota: 'volumen restaurantero' },
    { concepto: 'n8n', monto: 6000, nota: '' },
    { concepto: 'Supabase Realtime', monto: 4000, nota: '' },
  ],
  soporte: [
    { concepto: 'Claude Haiku API', monto: 12000, nota: '80% resuelto por IA' },
    { concepto: 'Embeddings + pgvector', monto: 3000, nota: 'indexación FAQ mensual' },
    { concepto: 'WhatsApp Cloud API', monto: 15000, nota: '' },
    { concepto: 'n8n', monto: 6000, nota: '' },
    { concepto: 'Supabase', monto: 4000, nota: '' },
  ],
  financiera: [
    { concepto: 'Claude Haiku API', monto: 3000, nota: 'un solo usuario, bajo volumen' },
    { concepto: 'WhatsApp Cloud API', monto: 3000, nota: 'solo al dueño' },
    { concepto: 'n8n', monto: 4000, nota: '' },
    { concepto: 'Supabase', monto: 4000, nota: '' },
  ],

  voz: [
    { concepto: 'ElevenLabs (voz neural)', monto: 80000, nota: '~300 min de voz al mes' },
    { concepto: 'Twilio Voice (números CO + minutos)', monto: 90000, nota: 'saliente Colombia' },
    { concepto: 'Claude Sonnet API', monto: 40000, nota: 'realtime en llamada' },
    { concepto: 'n8n', monto: 6000, nota: '' },
    { concepto: 'Supabase', monto: 4000, nota: '' },
  ],
  creativos: [
    { concepto: 'Higgsfield (video/imagen IA)', monto: 90000, nota: '~10 reels/mes' },
    { concepto: 'Canva Pro (compartido)', monto: 8000, nota: 'prorrateado' },
    { concepto: 'Claude Sonnet API', monto: 15000, nota: 'guiones y captions' },
    { concepto: 'Postiz self-host', monto: 6000, nota: 'prorrateado' },
    { concepto: 'n8n', monto: 6000, nota: '' },
  ],
  copiloto: [
    { concepto: 'Claude Haiku API', monto: 2000, nota: '~30 partes/mes' },
    { concepto: 'n8n (scheduler)', monto: 3000, nota: '' },
    { concepto: 'WhatsApp Cloud API', monto: 3000, nota: '1 mensaje al día' },
  ],
  'panel-aconseja': [
    { concepto: 'Claude Sonnet API', monto: 12000, nota: 'redacción de recomendaciones' },
    { concepto: 'Supabase Edge Functions', monto: 4000, nota: 'ejecución de reglas' },
    { concepto: 'n8n', monto: 5000, nota: 'cron de detección' },
  ],
};

/* Total mensual estimado (COP) — sumatoria simple. */
export function costoMensualTotal(id) {
  const arr = COSTOS_BY_ID[id] || [];
  return arr.reduce((a, c) => a + (Number(c.monto) || 0), 0);
}
