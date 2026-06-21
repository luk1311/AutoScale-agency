// ============================================================================
// Meta Pixel — carga e inicialización guardada por entorno.
// El Pixel ID es público por diseño (vive en el navegador). El token de CAPI es
// SECRETO y vive solo del lado servidor (n8n / Edge Function), nunca aquí.
// El pixel solo se carga si VITE_META_PIXEL_ID está configurado, así no
// disparamos eventos con un ID inválido (placeholder) en desarrollo.
// ============================================================================

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

let initialized = false;

// Carga el loader oficial de Meta (define window.fbq) y dispara PageView.
export function initMetaPixel() {
  if (initialized || !PIXEL_ID || typeof window === 'undefined') return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
  initialized = true;
}

// ViewContent: el usuario mostró intención (abrió el modal de contacto).
export function trackViewContent(data = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', data);
  }
}

// Lead: conversión real tras guardar el lead. El `eventId` DEBE ser el mismo que
// luego reenvía n8n por CAPI para que Meta deduplique (no cuente doble).
export function trackLead({ eventId, content_name } = {}) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq(
    'track',
    'Lead',
    { content_name },
    eventId ? { eventID: eventId } : undefined
  );
}

export const isPixelEnabled = () => Boolean(PIXEL_ID);
