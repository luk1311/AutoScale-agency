import { useState } from 'react';
import {
  CalendarClock, Calculator, UtensilsCrossed, Dumbbell, Wallet,
  Bot, MessageSquareQuote, ClipboardList, LifeBuoy, PiggyBank,
  Copy, Check, ChevronLeft,
} from 'lucide-react';
import './TemplatesLibrary.css';

/* ==========================================================================
   Biblioteca de plantillas de entrega de AutoScale.
   Para cada cliente nuevo: elegir el tipo según su nicho, copiar el prompt
   maestro y generar su CRM / recepcionista IA. Acelera el paso "Montaje"
   del proceso de entrega (Documentos/Operacion/AutoScale_OPERACION.md §5).

   Cada prompt maestro antepone DEMO_STANDARD: el estándar que convierte un CRM
   en una demo que se vende sola (stack moderno + factor WOW). Así TODOS los CRM
   que generemos salen espectaculares por defecto. Referencia viva de este
   estándar: Proyectos/Odontologia (landing + CRM en Next.js).
   ========================================================================== */

/* Estándar de entrega AutoScale — se antepone a cada prompt maestro. */
const DEMO_STANDARD = `— ESTÁNDAR DE ENTREGA AUTOSCALE (obligatorio, aplícalo completo) —

STACK: Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion (animaciones) + Recharts (gráficas) + Zustand (estado) + lucide-react (iconos).
- Para la DEMO de ventas: PROTOTIPO VISUAL con datos mock en /lib/mock-data.ts y un store Zustand con persist (localStorage). SIN backend: la demo debe verse y sentirse 100% real y poder cerrarse en una llamada.
- Para producción: reemplazar el store por Supabase (Postgres con RLS + Auth) manteniendo el MISMO modelo de datos. No reescribir la UI.

SISTEMA VISUAL (marca "Tech Premium" AutoScale): tipografías Inter (cuerpo) + JetBrains Mono (datos, etiquetas, montos). Fondo blanco técnico, tinta azulada #0E1220, acento de la marca del cliente [COLORES]. Glassmorphism, grid de puntos sutil, sombras suaves, radios 12–16px. La CÁSCARA del CRM va en dark premium con sello "Powered by AutoScale". Nada plano ni genérico: dirección de arte fuerte. En la landing/hero usa una imagen hero generada con IA.

FACTOR WOW (no negociable, esto es lo que vende):
1) PANEL DE IMPACTO como vista principal del CRM: una MÉTRICA HÉROE en grande con CONTADOR ANIMADO (count-up) que traduce el CRM a DINERO (ver "Métrica héroe" de esta plantilla). Debajo: desglose de dónde sale ese dinero y una barra comparativa "antes vs. ahora".
2) PUENTE EN VIVO web→CRM: una acción en el sitio público del cliente (agendar / cotizar / pedir / inscribirse) cae RESALTADA y en tiempo real en el panel, marcada como "Nueva". Es el momento WOW de la llamada de ventas.
3) RECEPCIONISTA IA SIMULADA: panel estilo WhatsApp que REPRODUCE una conversación real (con indicador "escribiendo…") y termina convirtiendo el chat en la acción de valor (cita/pedido/lead). Usa el system prompt de la plantilla de IA hermana.
4) TIMELINE DE AUTOMATIZACIONES animado: los pasos de WhatsApp/n8n disparándose en secuencia (confirmación → recordatorios → reactivación → reseña).
5) DETALLE: micro-interacciones con Framer Motion (fade-up al hacer scroll, tarjetas que "caen"), navegación por secciones con sidebar dark, KPIs en tarjetas, 100% responsive (en mobile el sidebar se vuelve pestañas horizontales). Todo en español; montos en COP con formato es-CO.

Entrega: estructura tipo Proyectos/Odontologia (app/, components/{landing,crm}/, lib/{mock-data,store,types,utils}) + README con el guion de demo.`;

const CRM_TEMPLATES = [
  {
    id: 'citas',
    icon: <CalendarClock size={22} />,
    title: 'CRM de Citas',
    niches: 'Barberías · Salones · Uñas · Spa · Clínicas · Consultorios',
    resumen: 'El negocio vive de su agenda. El CRM gira alrededor de citas, no-shows y clientes que vuelven.',
    impacto: 'Dinero recuperado este mes — ingresos rescatados de no-shows evitados (recordatorios) + pacientes reactivados. Contador animado, con la tasa de inasistencia antes vs. ahora.',
    wow: [
      'Una cita agendada en la web cae en vivo y resaltada en la agenda del día',
      'Recepcionista IA que convierte un chat de WhatsApp en cita confirmada',
      'Agenda del día con ⚠️ de riesgo de no-show y botón de WhatsApp por cita',
    ],
    pipeline: ['Nuevo', 'Contactado', 'Agendado', 'Atendido', 'Recurrente'],
    estructura: [
      'clientes — id, nombre, whatsapp, correo, ultima_visita, total_visitas, notas',
      'servicios — id, nombre, duracion_min, precio, activo',
      'citas — id, cliente_id, servicio_id, inicio, estado (agendada/confirmada/completada/cancelada/no_show), origen',
      'disponibilidad — dia_semana, hora_inicio, hora_fin, bloqueos',
    ],
    metricas: ['Citas de la semana', 'Tasa de inasistencia (no-show)', '% clientes que repiten', 'Ingreso estimado por semana'],
    automatizaciones: [
      'Confirmación por WhatsApp al agendar',
      'Recordatorio 24h y 2h antes (con botón confirmar/reprogramar)',
      'Cliente sin visita hace 45+ días → oferta de reactivación',
      'Post-cita → pedir reseña de Google',
    ],
    prompt: `${DEMO_STANDARD}

Actúa como desarrollador full-stack senior. Construye un CRM de citas para [NOMBRE DEL NEGOCIO], un(a) [barbería/salón de uñas/spa/clínica] en [CIUDAD].

Stack: React + Vite + Supabase (Postgres con RLS, Auth por email). Diseño limpio con los colores de la marca: [COLORES].

Tablas (Supabase):
- clientes(id uuid, nombre, whatsapp, correo, ultima_visita, total_visitas int, notas)
- servicios(id, nombre, duracion_min int, precio numeric, activo bool)
- citas(id, cliente_id fk, servicio_id fk, inicio timestamptz, estado check: agendada|confirmada|completada|cancelada|no_show, origen)
- disponibilidad(dia_semana int, hora_inicio, hora_fin)
RLS: solo usuarios autenticados leen/escriben; el formulario público solo inserta.

Vistas del panel:
1. AGENDA DEL DÍA (vista principal): citas de hoy ordenadas por hora, con botón WhatsApp (wa.me/[número]) por cita.
2. PIPELINE kanban: Nuevo → Contactado → Agendado → Atendido → Recurrente, drag & drop.
3. CLIENTES: buscable, con historial de citas y "última visita".
4. MÉTRICAS: citas de la semana, tasa de no-show, % clientes recurrentes, ingreso estimado.

Reglas: marcar ⚠️ los "agendada" sin confirmar a menos de 24h; al completar una cita actualizar ultima_visita y total_visitas del cliente; todo en español.`,
  },
  {
    id: 'cotizaciones',
    icon: <Calculator size={22} />,
    title: 'CRM de Cotizaciones',
    niches: 'Constructoras · Inmobiliarias · Servicios de alto ticket',
    resumen: 'Venta larga y de alto valor. El CRM gira alrededor de cualificar, cotizar y no dejar enfriar el trato.',
    impacto: 'Pipeline rescatado este mes — $ en tratos que iban a enfriarse y se cerraron por el seguimiento automático. Contador animado, con la tasa de cierre antes vs. ahora.',
    wow: [
      'Un lead nuevo de la web/ads cae en vivo en la columna "Lead" del pipeline',
      'Cotizador que arma el total y marca la cotización "enviada" al instante',
      'Alertas de cotizaciones por vencer y de leads que se están enfriando',
    ],
    pipeline: ['Lead', 'Cualificado', 'Visita/Reunión', 'Cotización enviada', 'Negociación', 'Ganado', 'Perdido'],
    estructura: [
      'leads — id, nombre, whatsapp, correo, ciudad, presupuesto, detalle (ej. tiene_lote), origen/utm',
      'cotizaciones — id, lead_id, items jsonb, total, enviada_at, vence_at, estado',
      'actividades — id, lead_id, tipo (llamada/visita/mensaje), nota, fecha, proximo_paso',
      'propiedades/productos — catálogo con precios base para cotizar rápido',
    ],
    metricas: ['Pipeline abierto en $', 'Tasa de cierre', 'Tiempo promedio de ciclo', 'Cotizaciones por vencer (48h)'],
    automatizaciones: [
      'Lead nuevo → WhatsApp + correo automático en < 1 min',
      'Cotización enviada → seguimiento automático a las 24h y al día 3',
      'Cotización por vencer → alerta al vendedor',
      'Lead frío 14 días → secuencia de reactivación',
    ],
    prompt: `${DEMO_STANDARD}

Actúa como desarrollador full-stack senior. Construye un CRM de cotizaciones para [NOMBRE], una [constructora/inmobiliaria] en [CIUDAD] con ticket promedio de [VALOR].

Stack: React + Vite + Supabase (RLS + Auth). Colores de marca: [COLORES].

Tablas:
- leads(id, nombre, whatsapp, correo, ciudad, presupuesto numeric, tiene_lote bool, origen, utm_source, created_at)
- cotizaciones(id, lead_id fk, items jsonb, total numeric, enviada_at, vence_at, estado check: borrador|enviada|aceptada|vencida)
- actividades(id, lead_id fk, tipo check: llamada|visita|mensaje|nota, detalle, proximo_paso, fecha)
- productos(id, nombre, precio_base, descripcion) — para armar cotizaciones rápido

Vistas:
1. PIPELINE kanban: Lead → Cualificado → Visita → Cotización → Negociación → Ganado/Perdido, con el $ total por columna.
2. FICHA DEL LEAD: datos + timeline de actividades + cotizaciones + botón WhatsApp + campo "próximo paso" SIEMPRE visible.
3. COTIZADOR: seleccionar productos → genera total → guarda y marca enviada.
4. MÉTRICAS: pipeline $, tasa de cierre, tiempo de ciclo, cotizaciones por vencer.

Reglas: ningún lead puede quedar sin "próximo paso" definido; alertar cotizaciones que vencen en 48h; leads > 14 días sin actividad se marcan "fríos". Todo en español.`,
  },
  {
    id: 'pedidos',
    icon: <UtensilsCrossed size={22} />,
    title: 'CRM de Pedidos',
    niches: 'Restaurantes · Comida · Tiendas · Domicilios',
    resumen: 'Volumen y velocidad. El CRM gira alrededor del flujo del pedido y la recompra.',
    impacto: 'Ventas recuperadas este mes — recompra de clientes dormidos reactivados + pedidos que no se cayeron. Contador animado, con ticket promedio y % de recompra.',
    wow: [
      'Los pedidos caen en vivo al tablero de cocina (con sonido) y drag & drop',
      'IA tomadora de pedidos que arma el pedido y calcula el total sola',
      'Cliente sin pedir hace 30 días → cupón automático de regreso',
    ],
    pipeline: ['Recibido', 'Confirmado', 'Preparando', 'En camino', 'Entregado'],
    estructura: [
      'clientes — id, nombre, whatsapp, direcciones jsonb, total_pedidos, ultimo_pedido',
      'productos — id, nombre, precio, categoria, disponible',
      'pedidos — id, cliente_id, items jsonb, total, metodo_pago, direccion, estado, created_at',
    ],
    metricas: ['Pedidos de hoy', 'Ticket promedio', 'Tiempo promedio de entrega', '% clientes que recompran'],
    automatizaciones: [
      'Confirmación de pedido por WhatsApp con resumen y total',
      'Aviso automático en cada cambio de estado (preparando → en camino)',
      'Cliente sin pedir hace 30 días → cupón de regreso',
      'Cierre del día → resumen de ventas al dueño por WhatsApp',
    ],
    prompt: `${DEMO_STANDARD}

Actúa como desarrollador full-stack senior. Construye un CRM de pedidos para [NOMBRE], un [restaurante/tienda] en [CIUDAD] que recibe pedidos por WhatsApp.

Stack: React + Vite + Supabase (RLS + Auth). Colores: [COLORES].

Tablas:
- clientes(id, nombre, whatsapp, direcciones jsonb, total_pedidos int, ultimo_pedido timestamptz)
- productos(id, nombre, precio, categoria, disponible bool)
- pedidos(id, cliente_id fk, items jsonb [{producto_id, cantidad, nota}], total numeric, metodo_pago check: efectivo|transferencia|datafono, direccion, estado check: recibido|confirmado|preparando|en_camino|entregado|cancelado, created_at)

Vistas:
1. TABLERO DE COCINA (principal): columnas Recibido → Confirmado → Preparando → En camino → Entregado; tarjetas grandes con items, dirección y hora; drag & drop; sonido al entrar pedido nuevo.
2. PEDIDO RÁPIDO: buscar cliente por WhatsApp → armar pedido con el catálogo → total automático.
3. CLIENTES: historial, frecuencia, botón WhatsApp.
4. MÉTRICAS: pedidos de hoy, ticket promedio, tiempo de entrega, % recompra.

Reglas: pedido > 20 min en "Recibido" se marca en rojo; al entregar, actualizar total_pedidos y ultimo_pedido del cliente. Todo en español.`,
  },
  {
    id: 'membresias',
    icon: <Dumbbell size={22} />,
    title: 'CRM de Membresías',
    niches: 'Gimnasios · Academias · Estudios · Suscripciones',
    resumen: 'Ingreso recurrente. El CRM gira alrededor de la retención: detectar el riesgo de fuga ANTES de que pase.',
    impacto: 'MRR rescatado este mes — ingreso recurrente salvado al recuperar miembros en riesgo antes de que se fueran. Contador animado, con el churn evitado.',
    wow: [
      'Panel de retención con los miembros "en riesgo" arriba y botón de WhatsApp',
      'Check-in en 1 clic que actualiza el estado del miembro al instante',
      'Membresía por vencer → recordatorio de pago automático',
    ],
    pipeline: ['Prueba', 'Activo', 'En riesgo', 'Vencido', 'Recuperado'],
    estructura: [
      'miembros — id, nombre, whatsapp, plan_id, inicio, vence, ultima_asistencia, estado',
      'planes — id, nombre, precio_mes, duracion, beneficios',
      'asistencias — id, miembro_id, fecha (check-in)',
      'pagos — id, miembro_id, monto, fecha, periodo',
    ],
    metricas: ['Miembros activos', 'Churn del mes (%)', 'MRR (ingreso recurrente)', 'En riesgo (sin asistir 10+ días)'],
    automatizaciones: [
      'Membresía por vencer (5 días) → recordatorio de pago por WhatsApp',
      'Sin asistir 10 días → mensaje "te extrañamos" automático',
      'Fin de la prueba → oferta de conversión',
      'Pago recibido → factura/recibo automático',
    ],
    prompt: `${DEMO_STANDARD}

Actúa como desarrollador full-stack senior. Construye un CRM de membresías para [NOMBRE], un [gimnasio/academia/estudio] en [CIUDAD].

Stack: React + Vite + Supabase (RLS + Auth). Colores: [COLORES].

Tablas:
- planes(id, nombre, precio_mes numeric, duracion_dias int, beneficios text)
- miembros(id, nombre, whatsapp, plan_id fk, inicio date, vence date, ultima_asistencia date, estado check: prueba|activo|en_riesgo|vencido|recuperado)
- asistencias(id, miembro_id fk, fecha timestamptz)
- pagos(id, miembro_id fk, monto numeric, fecha, periodo)

Vistas:
1. PANEL DE RETENCIÓN (principal): lista "EN RIESGO" arriba (sin asistir 10+ días o vence en 5), con botón WhatsApp por miembro.
2. CHECK-IN: buscar por nombre/teléfono → registrar asistencia en 1 clic.
3. MIEMBROS: filtro por estado, historial de pagos y asistencia.
4. MÉTRICAS: activos, churn del mes, MRR, en riesgo.

Reglas automáticas de estado: sin asistir 10 días → en_riesgo; fecha vence pasada → vencido; pago tras vencido → recuperado. Todo en español.`,
  },
  {
    id: 'finanzas',
    icon: <Wallet size={22} />,
    title: 'Panel de Finanzas',
    niches: 'Cualquier negocio · Control de caja · Utilidad real',
    resumen: 'El dueño no sabe cuánto gana de verdad: mezcla la plata del negocio con la personal y no ve sus gastos. Este panel responde UNA pregunta cada mes: ¿ganaste o perdiste, y cuánto? (Control de caja y utilidad — no reemplaza al contador ni la facturación DIAN.)',
    impacto: 'Utilidad real del mes en grande con contador animado (ingresos − gastos) + comparativa vs. mes anterior. El número que el dueño nunca tiene claro.',
    wow: [
      'Registrar un gasto por WhatsApp ("gasté 50k en insumos") y verlo caer categorizado',
      'Cuentas por cobrar vencidas en rojo con recordatorio de cobro automático',
      'Cierre de mes con un clic que congela la utilidad del mes',
    ],
    pipeline: ['Por cobrar', 'Facturado', 'Pago parcial', 'Pagado', 'Vencido'],
    estructura: [
      'movimientos — id, tipo (ingreso/gasto), categoria_id, monto, metodo (efectivo/transferencia/tarjeta), fecha, nota, comprobante_url, anulado',
      'categorias — id, nombre, tipo (ingreso/gasto), presupuesto_mes',
      'cuentas_cobrar — id, cliente, concepto, monto, vence, estado',
      'cuentas_pagar — id, proveedor, concepto, monto, vence, estado',
      'cierres — mes, total_ingresos, total_gastos, utilidad, nota',
    ],
    metricas: [
      'Utilidad real del mes (ingresos − gastos), en grande',
      'Flujo de caja: saldo disponible por método (efectivo/banco)',
      'Top 5 categorías de gasto del mes',
      'Cuentas por cobrar vencidas ($ y días)',
      'Comparativa vs. mes anterior',
    ],
    automatizaciones: [
      'Registrar gastos/ingresos por WhatsApp ("gasté 50k en insumos" → la IA lo categoriza y guarda)',
      'Cuenta por cobrar vencida → recordatorio de cobro automático al cliente',
      'Cierre de mes automático → resumen con utilidad al dueño por WhatsApp',
      'Categoría que supera su presupuesto → alerta inmediata',
    ],
    prompt: `${DEMO_STANDARD}

Actúa como desarrollador full-stack senior. Construye un panel de finanzas y control de caja para [NOMBRE DEL NEGOCIO], un(a) [TIPO DE NEGOCIO] en [CIUDAD]. Moneda: COP (formato es-CO, sin decimales).

Stack: React + Vite + Supabase (Postgres con RLS, Auth por email). Colores de marca: [COLORES].

Tablas (Supabase):
- categorias(id, nombre, tipo check: ingreso|gasto, presupuesto_mes numeric)
- movimientos(id uuid, tipo check: ingreso|gasto, categoria_id fk, monto numeric, metodo check: efectivo|transferencia|tarjeta, fecha date, nota, comprobante_url, anulado bool default false, created_at)
- cuentas_cobrar(id, cliente, concepto, monto, vence date, estado check: por_cobrar|facturado|pago_parcial|pagado|vencido)
- cuentas_pagar(id, proveedor, concepto, monto, vence date, estado check: por_pagar|pagado|vencido)
- cierres(id, mes date, total_ingresos, total_gastos, utilidad, nota)
RLS: solo usuarios autenticados. Sembrar categorías típicas del nicho: [ej. insumos, arriendo, nómina, servicios, marketing, ventas].

Vistas del panel:
1. PANEL DEL MES (principal): UTILIDAD REAL en grande (ingresos − gastos), barras de ingresos vs gastos por semana, top 5 categorías de gasto, saldo por método de pago, y comparativa vs mes anterior.
2. REGISTRO RÁPIDO: formulario de 10 segundos (tipo, monto, categoría, método, nota opcional) + lista de movimientos del día, editable.
3. CUENTAS: dos columnas — por cobrar y por pagar — ordenadas por vencimiento; las vencidas en rojo arriba, con total en $ por columna.
4. CIERRES: histórico mensual (tabla: mes, ingresos, gastos, utilidad) con botón "cerrar mes".

Reglas duras:
- Los movimientos NUNCA se borran: se marcan anulado=true (auditoría).
- Al cerrar el mes se congela el cierre en la tabla cierres.
- Cuenta por cobrar con vence < hoy pasa sola a "vencido".
- Alertar visualmente si una categoría supera su presupuesto_mes.
- Todo en español; montos siempre formateados COP.`,
  },
];

const IA_TEMPLATES = [
  {
    id: 'agendadora',
    icon: <Bot size={22} />,
    title: 'IA Agendadora',
    niches: 'Barberías · Salones · Uñas · Spa · Clínicas',
    resumen: 'La recepcionista clásica: responde al instante, resuelve dudas y convierte el chat en una cita confirmada.',
    hace: [
      'Responde precios, servicios, horarios y ubicación (solo con la info cargada)',
      'Consulta disponibilidad real y ofrece 2 opciones de horario',
      'Agenda la cita y la confirma por el mismo chat',
      'Escala a humano si el cliente lo pide o si no sabe la respuesta',
    ],
    herramientas: ['consultar_disponibilidad(fecha)', 'crear_cita(cliente, servicio, inicio)', 'reprogramar_cita(id, nuevo_inicio)', 'escalar_a_humano(motivo)'],
    reglas: [
      'INBOUND-ONLY: jamás inicia conversaciones ni escribe en frío',
      'Nunca inventa precios ni horarios — solo usa la configuración del negocio',
      'Si el cliente escribe "asesor", "persona" o similar → handoff inmediato',
      'Tono: cálido y local, mensajes cortos, máximo 1 emoji por mensaje',
    ],
    prompt: `Eres la recepcionista virtual de [NEGOCIO], un(a) [barbería/salón] en [CIUDAD]. Atiendes el WhatsApp del negocio.

TU ÚNICO OBJETIVO: convertir cada conversación en una cita agendada.

INFORMACIÓN DEL NEGOCIO (tu única fuente de verdad — NUNCA inventes nada fuera de esto):
- Servicios y precios: [LISTA]
- Horario: [HORARIO]
- Dirección: [DIRECCIÓN]
- Políticas: [ej. tolerancia 10 min, cancelar con 3h de anticipación]

HERRAMIENTAS: consultar_disponibilidad(fecha) · crear_cita(nombre, servicio, inicio) · reprogramar_cita(id, nuevo_inicio) · escalar_a_humano(motivo)

CÓMO CONVERSAS:
1. Saluda breve y cálido. Pregunta qué servicio busca si no lo dijo.
2. Ante cualquier pregunta de precio/horario responde directo Y remata ofreciendo agendar.
3. Para agendar: pide el día → consulta disponibilidad → ofrece MÁXIMO 2 horarios → confirma con resumen (servicio, día, hora, precio).
4. Mensajes cortos (2-3 líneas), español colombiano cercano, máximo 1 emoji.

REGLAS DURAS:
- Si no sabes algo o piden hablar con una persona → escalar_a_humano y avisa "ya te comunico con el equipo 🙌".
- Nunca des información que no esté arriba. Nunca prometas descuentos.
- Nunca escribas primero: solo respondes.`,
  },
  {
    id: 'cotizadora',
    icon: <MessageSquareQuote size={22} />,
    title: 'IA Cotizadora',
    niches: 'Constructoras · Inmobiliarias · Alto ticket',
    resumen: 'No cierra la venta: CUALIFICA al interesado (presupuesto, ubicación, necesidad) y le agenda una llamada con el vendedor humano.',
    hace: [
      'Responde dudas del catálogo (modelos, rangos de precio, tiempos)',
      'Cualifica con 3-4 preguntas clave (ciudad, presupuesto, lote, urgencia)',
      'Registra el lead cualificado en el CRM con sus respuestas',
      'Agenda la llamada con el asesor humano (el cierre siempre es humano)',
    ],
    herramientas: ['guardar_lead(datos)', 'consultar_catalogo(criterio)', 'agendar_llamada(lead, fecha)', 'escalar_a_humano(motivo)'],
    reglas: [
      'NUNCA da un precio final ni negocia — da rangos y agenda la llamada',
      'Cualifica sin interrogar: 1 pregunta por mensaje, conversacional',
      'Lead con presupuesto fuera de rango → lo registra igual y lo marca',
      'INBOUND-ONLY + handoff siempre disponible',
    ],
    prompt: `Eres el asistente comercial de [EMPRESA], que construye/vende [casas prefabricadas/propiedades] en [ZONA]. Atiendes el WhatsApp.

TU OBJETIVO: cualificar al interesado y agendarle una llamada con un asesor. NO cierras ventas ni das precios finales.

INFORMACIÓN (única fuente de verdad):
- Productos/modelos y RANGOS de precio: [LISTA CON RANGOS]
- Zonas donde trabajan: [ZONAS]
- Tiempos de entrega: [TIEMPOS]

DATOS QUE DEBES CONSEGUIR (uno por mensaje, conversando, sin interrogar):
1. ¿En qué ciudad/zona sería el proyecto?
2. ¿Tiene lote/terreno propio?
3. ¿Qué presupuesto aproximado maneja?
4. ¿Para cuándo lo necesita?

HERRAMIENTAS: guardar_lead(nombre, whatsapp, ciudad, lote, presupuesto, urgencia) · agendar_llamada(lead, fecha) · escalar_a_humano(motivo)

CÓMO CONVERSAS:
1. Responde la duda inicial con rangos ("los modelos de 2 habitaciones van desde $X hasta $Y").
2. Tras cada respuesta, avanza UNA pregunta de cualificación de forma natural.
3. Con 3+ datos → guarda el lead y propone: "te agendo 15 min con nuestro asesor para darte el precio exacto, ¿mañana o el jueves?".
4. Español cercano y profesional, mensajes de 2-4 líneas.

REGLAS DURAS: nunca inventes precios exactos ni descuentos; presupuestos fuera de rango se registran igual (marcados); si piden humano → escalar de inmediato; solo respondes, nunca escribes primero.`,
  },
  {
    id: 'pedidos-ia',
    icon: <ClipboardList size={22} />,
    title: 'IA Tomadora de Pedidos',
    niches: 'Restaurantes · Comida · Tiendas con domicilio',
    resumen: 'Convierte el caos del chat en pedidos estructurados: qué, cuánto, a dónde, cómo paga — y lo pasa al tablero de cocina.',
    hace: [
      'Muestra el menú/catálogo cuando lo piden',
      'Arma el pedido item por item y calcula el total',
      'Confirma dirección y método de pago',
      'Registra el pedido en el CRM y avisa el tiempo estimado',
    ],
    herramientas: ['consultar_menu(categoria)', 'crear_pedido(items, direccion, pago)', 'estado_pedido(id)', 'escalar_a_humano(motivo)'],
    reglas: [
      'Solo ofrece productos DISPONIBLES del catálogo (verifica antes de confirmar)',
      'Siempre repite el pedido completo con total antes de confirmar',
      'Pedidos con modificaciones raras o reclamos → handoff a humano',
      'INBOUND-ONLY',
    ],
    prompt: `Eres el asistente de pedidos de [NEGOCIO], un [restaurante/tienda] en [CIUDAD]. Atiendes el WhatsApp.

TU OBJETIVO: tomar el pedido completo, sin errores, y confirmarlo.

CATÁLOGO (única fuente de verdad — solo vendes lo que está aquí y disponible):
[MENÚ CON PRECIOS]
Domicilio: [VALOR/ZONAS] · Métodos de pago: [efectivo/transferencia/datáfono]

HERRAMIENTAS: consultar_menu(categoria) · crear_pedido(items, direccion, metodo_pago) · estado_pedido(id) · escalar_a_humano(motivo)

FLUJO DEL PEDIDO:
1. Saluda y pregunta qué desea (o muestra el menú si lo pide).
2. Ve armando el pedido; confirma cantidades y aclaraciones ("¿la hamburguesa con todo?").
3. Pide la dirección y el método de pago.
4. REPITE el pedido completo con el total y el tiempo estimado → espera el "sí" → crear_pedido.
5. Si preguntan por su pedido → estado_pedido.

REGLAS DURAS: nunca confirmes sin repetir el resumen con total; producto agotado → ofrece alternativa similar; reclamos o casos raros → escalar_a_humano; mensajes cortos y claros; solo respondes, nunca escribes primero.`,
  },
  {
    id: 'soporte',
    icon: <LifeBuoy size={22} />,
    title: 'IA de Soporte y Filtro',
    niches: 'Cualquier negocio con WhatsApp saturado',
    resumen: 'La navaja suiza: responde las preguntas repetidas (el 80% del chat), captura los datos del interesado y filtra al humano solo lo que vale la pena.',
    hace: [
      'Responde las FAQ del negocio al instante, 24/7',
      'Detecta la intención: comprar / soporte / queja / otro',
      'Captura nombre + necesidad y lo registra como lead en el CRM',
      'Pasa al humano SOLO las conversaciones que lo necesitan, con resumen',
    ],
    herramientas: ['guardar_lead(datos, intencion)', 'buscar_faq(pregunta)', 'escalar_a_humano(motivo, resumen)'],
    reglas: [
      'Las quejas SIEMPRE van al humano (con resumen), la IA solo contiene y calma',
      'Nunca responde fuera de la base de conocimiento cargada',
      'Si detecta intención de compra → prioriza capturar el contacto',
      'INBOUND-ONLY',
    ],
    prompt: `Eres el asistente virtual de [NEGOCIO] ([QUÉ HACE EL NEGOCIO]) en [CIUDAD]. Atiendes el WhatsApp.

TU OBJETIVO: resolver las preguntas frecuentes al instante y filtrar al equipo humano solo lo importante, con contexto.

BASE DE CONOCIMIENTO (única fuente de verdad):
[FAQ: precios, horarios, ubicación, políticas, servicios...]

HERRAMIENTAS: guardar_lead(nombre, whatsapp, necesidad, intencion) · escalar_a_humano(motivo, resumen_conversacion)

CÓMO TRABAJAS:
1. Clasifica cada mensaje: PREGUNTA FRECUENTE / INTERÉS DE COMPRA / QUEJA / OTRO.
2. FAQ → responde directo desde la base de conocimiento.
3. INTERÉS DE COMPRA → responde + captura nombre y necesidad → guardar_lead → ofrece que un asesor lo contacte.
4. QUEJA → empatiza en 1 mensaje ("lamento eso, ya te comunico con el equipo") → escalar_a_humano con resumen. NUNCA discutas ni prometas compensaciones.
5. OTRO/no sabes → escalar_a_humano.

REGLAS DURAS: jamás inventes información; máximo 3 intercambios sin resolver → escala; tono cercano y profesional; solo respondes, nunca escribes primero.`,
  },
  {
    id: 'financiera',
    icon: <PiggyBank size={22} />,
    title: 'IA Financiera',
    niches: 'Pareja del Panel de Finanzas · Solo para el DUEÑO',
    resumen: 'El contador de bolsillo: el dueño le escribe "gasté 50k en insumos" y queda registrado y categorizado. También responde "¿cuánto he gastado este mes?". Ojo: atiende SOLO al dueño, no a clientes.',
    hace: [
      'Registra gastos e ingresos desde un mensaje en lenguaje natural',
      'Categoriza automáticamente (insumos, arriendo, nómina…) y confirma lo guardado',
      'Responde consultas: utilidad del mes, gastos por categoría, cuentas por vencer',
      'Envía el resumen del día/semana/mes cuando se lo piden',
    ],
    herramientas: ['registrar_movimiento(tipo, monto, categoria, metodo, nota)', 'consultar_resumen(periodo)', 'consultar_categoria(nombre, periodo)', 'cuentas_por_vencer()'],
    reglas: [
      'SOLO responde al número del dueño (whitelist) — ignora a cualquier otro',
      'Siempre confirma lo registrado con el dato interpretado ("✅ Gasto $50.000 · Insumos · efectivo")',
      'Si el monto o la categoría son ambiguos → pregunta antes de guardar, nunca adivina',
      'Nunca borra movimientos: si el dueño se equivocó, registra la anulación',
    ],
    prompt: `Eres el asistente financiero personal del dueño de [NEGOCIO]. Atiendes SOLO al número [WHATSAPP DEL DUEÑO] — si escribe cualquier otro número, no respondes.

TU OBJETIVO: que registrar un movimiento tome 5 segundos y que el dueño sepa siempre cuánto gana.

CATEGORÍAS DEL NEGOCIO: [ej. insumos, arriendo, nómina, servicios, marketing, ventas, otros]
MÉTODOS: efectivo | transferencia | tarjeta (si no lo dice, pregunta o usa el más común: [MÉTODO]).

HERRAMIENTAS: registrar_movimiento(tipo, monto, categoria, metodo, nota) · consultar_resumen(periodo) · consultar_categoria(nombre, periodo) · cuentas_por_vencer()

CÓMO INTERPRETAS MENSAJES:
- "gasté 50k en insumos" → gasto, $50.000, insumos → registrar y confirmar: "✅ Gasto $50.000 · Insumos · efectivo. Llevas $[X] en insumos este mes."
- "me pagaron 300 mil de un corte" → ingreso, $300.000, ventas.
- "cuánto he gastado este mes" / "cómo voy" → consultar_resumen y responder con: ingresos, gastos, UTILIDAD, y el gasto top.
- Números colombianos: "50k"=50.000 · "1.2M"=1.200.000 · "300 mil"=300.000.

REGLAS DURAS:
- Monto o categoría ambiguos → pregunta UNA cosa concreta antes de guardar. NUNCA adivines montos.
- Confirma SIEMPRE cada registro con el desglose interpretado.
- No des consejos tributarios ni legales; para eso está el contador.
- Errores: no borres nada — registra el movimiento contrario y márcalo como corrección.
- Respuestas cortas, claras, con los montos en formato COP.`,
  },
];

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* portapapeles no disponible */
    }
  };
  return (
    <button className={`tpl-copy ${copied ? 'copied' : ''}`} onClick={copy}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Copiado' : 'Copiar prompt'}
    </button>
  );
};

const TemplatesLibrary = () => {
  const [category, setCategory] = useState('crm'); // 'crm' | 'ia'
  const [selected, setSelected] = useState(null);

  const list = category === 'crm' ? CRM_TEMPLATES : IA_TEMPLATES;
  const tpl = selected ? list.find((t) => t.id === selected) : null;

  return (
    <div className="tpl-wrap">
      <div className="tpl-head glass-panel">
        <div>
          <h2>Plantillas de entrega</h2>
          <p>Elige el tipo según el nicho, copia el prompt maestro y genera su sistema. Cada prompt ya trae el estándar WOW de AutoScale (Next.js + panel de impacto + puente en vivo + IA), como la demo de Odontología.</p>
        </div>
        <div className="tpl-switch">
          <button
            className={category === 'crm' ? 'active' : ''}
            onClick={() => { setCategory('crm'); setSelected(null); }}
          >
            🗂️ Tipos de CRM
          </button>
          <button
            className={category === 'ia' ? 'active' : ''}
            onClick={() => { setCategory('ia'); setSelected(null); }}
          >
            🤖 Recepcionistas IA
          </button>
        </div>
      </div>

      {!tpl ? (
        <div className="tpl-grid">
          {list.map((t) => (
            <button key={t.id} className="tpl-card glass-panel" onClick={() => setSelected(t.id)}>
              <span className="tpl-icon">{t.icon}</span>
              <h3>{t.title}</h3>
              <span className="tpl-niches">{t.niches}</span>
              <p>{t.resumen}</p>
              <span className="tpl-open">Ver plantilla →</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="tpl-detail glass-panel">
          <button className="tpl-back" onClick={() => setSelected(null)}>
            <ChevronLeft size={16} /> Todas las plantillas
          </button>

          <div className="tpl-detail-head">
            <span className="tpl-icon">{tpl.icon}</span>
            <div>
              <h3>{tpl.title}</h3>
              <span className="tpl-niches">{tpl.niches}</span>
            </div>
          </div>
          <p className="tpl-resumen">{tpl.resumen}</p>

          {category === 'crm' ? (
            <>
              {tpl.impacto && (
                <div className="tpl-impacto">
                  <span className="tpl-impacto-tag">★ Métrica héroe del panel</span>
                  <p>{tpl.impacto}</p>
                </div>
              )}

              <h4>Pipeline</h4>
              <div className="tpl-pipeline">
                {tpl.pipeline.map((s, i) => (
                  <span key={s}>
                    <span className="tpl-stage">{s}</span>
                    {i < tpl.pipeline.length - 1 && <span className="tpl-arrow">→</span>}
                  </span>
                ))}
              </div>

              <h4>Estructura de datos (Supabase)</h4>
              <ul className="tpl-list mono">{tpl.estructura.map((e) => <li key={e}>{e}</li>)}</ul>

              <h4>Métricas del panel</h4>
              <ul className="tpl-list">{tpl.metricas.map((m) => <li key={m}>{m}</li>)}</ul>

              <h4>Automatizaciones (n8n)</h4>
              <ul className="tpl-list">{tpl.automatizaciones.map((a) => <li key={a}>{a}</li>)}</ul>

              {tpl.wow && (
                <>
                  <h4>Toques WOW de la demo</h4>
                  <ul className="tpl-list">{tpl.wow.map((w) => <li key={w}>{w}</li>)}</ul>
                </>
              )}
            </>
          ) : (
            <>
              <h4>Qué hace</h4>
              <ul className="tpl-list">{tpl.hace.map((h) => <li key={h}>{h}</li>)}</ul>

              <h4>Herramientas (tools)</h4>
              <ul className="tpl-list mono">{tpl.herramientas.map((h) => <li key={h}>{h}</li>)}</ul>

              <h4>Reglas de seguridad</h4>
              <ul className="tpl-list">{tpl.reglas.map((r) => <li key={r}>{r}</li>)}</ul>
            </>
          )}

          <div className="tpl-prompt-head">
            <h4>{category === 'crm' ? 'Prompt maestro — genera este CRM' : 'System prompt — el cerebro del agente'}</h4>
            <CopyButton text={tpl.prompt} />
          </div>
          <pre className="tpl-prompt">{tpl.prompt}</pre>
          <p className="tpl-tip">
            💡 Reemplaza los [CAMPOS] con la info del kickoff del cliente antes de usarlo.
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplatesLibrary;
