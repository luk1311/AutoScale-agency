// ============================================================================
// Atribución — captura el origen del clic (fbclid, UTMs, cookie _fbp) al cargar
// la landing y lo persiste en sessionStorage para adjuntarlo al lead. Así cada
// lead en el CRM dice de qué campaña/anuncio vino, y construimos `fbc` para que
// CAPI empareje mejor.
// ============================================================================

const STORAGE_KEY = 'autoscale_attribution';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

// Enlaces "bonitos": rutas cortas que marcan el origen del cliente sin ensuciar
// la URL con ?utm_source=... Comparte estos en tus biografías:
//   tulanding.com/ig  →  Instagram      tulanding.com/fb  →  Facebook
// Al entrar, se guarda el origen y la barra de direcciones queda limpia (en /).
const PATH_SOURCES = {
  '/ig': 'instagram',
  '/instagram': 'instagram',
  '/fb': 'facebook',
  '/facebook': 'facebook',
};

function readCookie(name) {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

// Meta espera `fbc` con el formato fb.1.<timestamp_ms>.<fbclid>.
function buildFbc(fbclid) {
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : '';
}

// Lee la URL al cargar y persiste. No sobreescribe datos de un clic anterior en
// la misma sesión si la nueva carga no trae parámetros (p. ej. navegación interna).
export function captureAttribution() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid') || '';
  const utms = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) utms[k] = v;
  }

  // Enlace bonito (/ig, /fb, ...): define el origen y limpia la URL a "/".
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const prettySource = PATH_SOURCES[path];
  if (prettySource && !utms.utm_source) {
    utms.utm_source = prettySource;
    window.history.replaceState(null, '', '/');
  }

  const existing = sessionStorage.getItem(STORAGE_KEY);
  // Nada nuevo y ya hay registro → no tocar.
  if (existing && !fbclid && Object.keys(utms).length === 0) return;

  const prev = existing ? JSON.parse(existing) : {};
  const data = {
    ...prev,
    ...utms,
    fbclid: fbclid || prev.fbclid || '',
    fbc: fbclid ? buildFbc(fbclid) : prev.fbc || '',
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Devuelve los campos listos para adjuntar al lead. `_fbp` se lee en el momento
// del envío porque el Pixel la escribe tras cargar.
export function getAttribution() {
  if (typeof window === 'undefined') return {};
  const stored = sessionStorage.getItem(STORAGE_KEY);
  const data = stored ? JSON.parse(stored) : {};
  return {
    fbclid: data.fbclid || '',
    fbc: data.fbc || '',
    fbp: readCookie('_fbp'),
    utm_source: data.utm_source || '',
    utm_medium: data.utm_medium || '',
    utm_campaign: data.utm_campaign || '',
    utm_content: data.utm_content || '',
    utm_term: data.utm_term || '',
  };
}
