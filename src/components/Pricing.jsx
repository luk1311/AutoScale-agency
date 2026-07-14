import { useState, useMemo } from 'react';
import { Check, Plus, Sparkles, MessageCircle, Lock, Flame } from 'lucide-react';
import './Pricing.css';

// ── Modelo modular ─────────────────────────────────────────────────────────
// Se acabó "planes vs módulos": hay UN sistema base + módulos que se encienden.
// Los "planes" son solo presets de arranque. Precios en COP (editables aquí).
const BASE = {
  setup: 990000,
  mes: 220000,
  incluye: ['Web que convierte', 'CRM incluido', 'Automatización (WhatsApp + correo)'],
};

const MODULES = [
  { id: 'manos', emoji: '🤲', name: 'IA con Manos', desc: 'Atiende, agenda y ejecuta en tu WhatsApp', setup: 700000, mes: 290000 },
  { id: 'voz', emoji: '🗣️', name: 'La IA que Llama', desc: 'Agente de voz que confirma y reactiva', setup: 500000, mes: 290000 },
  { id: 'copiloto', emoji: '🌙', name: 'Copiloto Nocturno', desc: 'El parte diario de lo que hizo la IA', setup: 0, mes: 90000 },
  { id: 'panel', emoji: '🧠', name: 'Panel que Aconseja', desc: 'Te dice qué hacer con tus datos', setup: 0, mes: 120000 },
  { id: 'creativos', emoji: '🎬', name: 'Fábrica de Creativos', desc: 'Reels y banners con IA para atraer', setup: 300000, mes: 400000 },
  { id: 'finanzas', emoji: '💰', name: 'Contabilidad y Finanzas', desc: 'Tu utilidad real, registrada por WhatsApp', setup: 200000, mes: 180000 },
];

const PRESETS = [
  { id: 'arranque', label: 'Arranque', mods: [] },
  { id: 'completo', label: 'Completo', mods: ['manos', 'copiloto', 'panel'], reco: true },
  { id: 'maximo', label: 'Máximo', mods: ['manos', 'voz', 'copiloto', 'panel', 'creativos', 'finanzas'] },
];

const WHATSAPP = '573116691969';
const OFF = 0.30; // 30% de descuento de lanzamiento
const cop = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
const disc = (n) => Math.round(n * (1 - OFF));

const Pricing = () => {
  const [selected, setSelected] = useState(() => new Set(['manos', 'copiloto', 'panel'])); // arranca en "Completo"

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const applyPreset = (mods) => setSelected(new Set(mods));

  const chosen = MODULES.filter((m) => selected.has(m.id));
  const setupTotal = BASE.setup + chosen.reduce((a, m) => a + m.setup, 0);
  const mesTotal = BASE.mes + chosen.reduce((a, m) => a + m.mes, 0);

  const presetActivo = useMemo(() => {
    const sel = [...selected].sort().join(',');
    const p = PRESETS.find((x) => [...x.mods].sort().join(',') === sel);
    return p ? p.label : 'Personalizado';
  }, [selected]);

  const waHref = useMemo(() => {
    const lineas = [
      'Hola AutoScale 👋 Armé mi plan en la web:',
      '',
      '✅ Sistema base (web + CRM + automatización)',
      ...chosen.map((m) => `✅ ${m.name}`),
      '',
      '🔥 Precio de lanzamiento (30% OFF):',
      `💵 Inversión inicial: ${cop(disc(setupTotal))} (antes ${cop(setupTotal)})`,
      `🔁 Mensualidad: ${cop(disc(mesTotal))} (antes ${cop(mesTotal)})`,
      '',
      'Quiero empezar por mi Gemelo Digital gratis.',
    ].join('\n');
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas)}`;
  }, [chosen, setupTotal, mesTotal]);

  const Precio = ({ setup, mes, plus }) => (
    <div className="mod-price">
      {setup > 0 && (
        <div className="mod-price-row">
          <span>Inversión</span>
          <div><s className="price-was">{cop(setup)}</s> <b>{cop(disc(setup))}</b></div>
        </div>
      )}
      <div className="mod-price-row">
        <span>Mensual</span>
        <div><s className="price-was">{cop(mes)}</s> <b>{plus ? '+' : ''}{cop(disc(mes))}</b></div>
      </div>
    </div>
  );

  return (
    <section id="precios" className="section section-alt pricing">
      <div className="container">
        <div className="pricing-head">
          <span className="eyebrow">Arma tu plan</span>
          <h2>Tú decides qué<br />necesita tu negocio.</h2>
          <p className="pricing-intro">
            Un solo sistema base y los módulos que quieras encima. Enciende, apaga y
            mira el precio en vivo. Cuando esté listo, te llega a mi WhatsApp.
          </p>
          <span className="promo-badge"><Flame size={15} /> 30% OFF · Precio de lanzamiento</span>
        </div>

        {/* Presets */}
        <div className="preset-row">
          <span className="preset-label">Empieza rápido:</span>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`preset-chip ${presetActivo === p.label ? 'active' : ''}`}
              onClick={() => applyPreset(p.mods)}
            >
              {p.label}
              {p.reco && <span className="preset-reco">Recomendado</span>}
            </button>
          ))}
        </div>

        <div className="builder">
          {/* Módulos */}
          <div className="builder-main">
            <article className="mod-card base">
              <div className="mod-top">
                <span className="mod-emoji"><Lock size={18} /></span>
                <div>
                  <h3>Sistema base</h3>
                  <span className="mod-desc">La fundación — siempre incluida</span>
                </div>
                <span className="mod-check on"><Check size={16} strokeWidth={3} /></span>
              </div>
              <ul className="base-incluye">
                {BASE.incluye.map((i) => <li key={i}><Check size={14} strokeWidth={3} /> {i}</li>)}
              </ul>
              <Precio setup={BASE.setup} mes={BASE.mes} />
            </article>

            <div className="mod-grid">
              {MODULES.map((m) => {
                const on = selected.has(m.id);
                return (
                  <button
                    key={m.id}
                    className={`mod-card ${on ? 'on' : ''}`}
                    onClick={() => toggle(m.id)}
                    aria-pressed={on}
                  >
                    <div className="mod-top">
                      <span className="mod-emoji">{m.emoji}</span>
                      <div>
                        <h3>{m.name}</h3>
                        <span className="mod-desc">{m.desc}</span>
                      </div>
                      <span className={`mod-check ${on ? 'on' : ''}`}>
                        {on ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                      </span>
                    </div>
                    <Precio setup={m.setup} mes={m.mes} plus />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumen sticky */}
          <aside className="builder-summary">
            <div className="summary-card">
              <div className="summary-head">
                <span className="eyebrow">Tu plan</span>
                <span className="summary-preset">{presetActivo}</span>
              </div>

              <ul className="summary-list">
                <li className="fixed"><Check size={14} strokeWidth={3} /> Sistema base</li>
                {chosen.map((m) => (
                  <li key={m.id}><Check size={14} strokeWidth={3} /> {m.name}</li>
                ))}
                {chosen.length === 0 && <li className="muted">Sin módulos extra todavía</li>}
              </ul>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Inversión inicial</span>
                  <span className="total-val"><s className="price-was">{cop(setupTotal)}</s> <b>{cop(disc(setupTotal))}</b></span>
                </div>
                <div className="total-row big">
                  <span>Mensualidad <span className="disc-chip">−30%</span></span>
                  <span className="total-val"><s className="price-was">{cop(mesTotal)}</s> <b>{cop(disc(mesTotal))}</b></span>
                </div>
              </div>

              <a className="summary-cta" href={waHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} /> Enviarme este plan por WhatsApp
              </a>
              <p className="summary-note">
                <Sparkles size={13} /> Incluye tu <b>Gemelo Digital gratis</b>. Sin permanencia.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
