// ============================================================================
// Helpers compartidos del CRM: atribución de marketing y formato.
// Usados por la tabla, el Kanban y el dashboard de métricas.
// ============================================================================

// Orden del pipeline (coincide con el constraint de la BD).
export const STATUS_ORDER = ['nuevo', 'contactado', 'propuesta', 'ganado'];

export const STATUS_META = {
  nuevo:      { label: 'Nuevo',      emoji: '🔴', color: '#ef4444' },
  contactado: { label: 'Contactado', emoji: '🟡', color: '#eab308' },
  propuesta:  { label: 'Propuesta',  emoji: '🔵', color: '#3b82f6' },
  ganado:     { label: 'Ganado',     emoji: '🟢', color: '#22c55e' },
};

// Etiqueta legible de la campaña/origen de un lead (para atribución y filtros).
export function getCampaign(lead) {
  if (lead.utm_campaign) return lead.utm_campaign;
  if (lead.fbclid) return 'Meta Ads (sin UTM)';
  if (lead.utm_source) return lead.utm_source;
  return lead.origen || 'Directo';
}

// Canal de alto nivel: de dónde vino el lead (con color e icono).
export function getChannel(lead) {
  const source = (lead.utm_source || '').toLowerCase();
  const isMeta =
    lead.fbclid ||
    ['fb', 'meta', 'face', 'ig', 'insta'].some((k) => source.includes(k));

  if (isMeta) return { label: 'Meta Ads', emoji: '📘', color: '#1877f2' };
  if (source.includes('google')) return { label: 'Google', emoji: '🔍', color: '#ea4335' };
  if (lead.utm_source) return { label: lead.utm_source, emoji: '🔗', color: '#8b5cf6' };
  return { label: 'Directo', emoji: '🌐', color: '#9ca3af' };
}

// Formato de dinero (COP, sin decimales). Cambia 'COP' si operas en otra moneda.
export function formatMoney(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
}

// Normaliza un valor monetario (de un input o de la BD) a número o null.
// Evita falsos cambios al comparar: Supabase puede devolver `numeric` como
// string ("2500000"), y el input lo devuelve como string también.
export function parseMoneyInput(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
