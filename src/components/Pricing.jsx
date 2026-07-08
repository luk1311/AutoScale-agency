import { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import './Pricing.css';

// Precios oficiales — fuente: Documentos/Ventas/AutoScale_CATALOGO.md
const plans = [
  {
    name: 'Esencial',
    tag: 'Para empezar a captar',
    setup: '$990k',
    monthly: '$220.000/mes',
    features: [
      'Web optimizada para el celular',
      'Captura de leads',
      'WhatsApp + correo automático a cada lead',
      'Hosting rápido y seguro',
    ],
    cta: 'Empezar con Esencial',
    style: 'plain',
  },
  {
    name: 'Pro',
    tag: 'El sistema completo',
    setup: '$1.79M',
    monthly: '$350.000/mes',
    features: [
      'Todo lo del Esencial',
      'CRM para gestionar tus clientes',
      'Recordatorios y seguimiento automático',
      'Reportes y exportación',
    ],
    cta: 'Quiero el Pro',
    style: 'featured',
    badge: 'Más elegido',
  },
  {
    name: 'Recepcionista IA',
    tag: 'Tu WhatsApp atendido 24/7',
    setup: '$890k',
    monthly: '$290.000/mes',
    features: [
      'IA que responde al instante, día y noche',
      'Agenda citas sola',
      'Entrenada con tu negocio',
      'Panel de conversaciones + paso a humano',
    ],
    cta: 'Quiero la IA',
    style: 'dark',
  },
];

const Pricing = ({ openModal }) => {
  const gridRef = useRef(null);
  const [active, setActive] = useState(0);

  // Detecta la tarjeta cuyo centro queda más cerca del centro del carrusel (móvil).
  const handleScroll = () => {
    const el = gridRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let min = Infinity;
    Array.from(el.children).forEach((card, i) => {
      const d = Math.abs(card.offsetLeft + card.clientWidth / 2 - center);
      if (d < min) { min = d; closest = i; }
    });
    setActive(closest);
  };

  const goTo = (i) => {
    const el = gridRef.current;
    const card = el && el.children[i];
    if (card) {
      el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: 'smooth' });
    }
  };

  return (
    <section id="precios" className="section section-alt pricing">
      <div className="container">
        <div className="pricing-head">
          <span className="eyebrow">Precios claros</span>
          <h2>Elige tu sistema.<br />Sin letra pequeña.</h2>
        </div>

        <p className="pricing-hint">Desliza para comparar →</p>

        <div className="pricing-grid" ref={gridRef} onScroll={handleScroll}>
          {plans.map((plan) => (
            <article key={plan.name} className={`plan-card is-${plan.style}`}>
              {plan.badge && <span className="plan-badge">{plan.badge}</span>}
              <span className="plan-tag">{plan.tag}</span>
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <b>{plan.setup}</b>
                <span>setup</span>
              </div>
              <div className="plan-monthly">+ {plan.monthly}</div>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}><Check size={17} strokeWidth={3} /> {f}</li>
                ))}
              </ul>
              <button className="btn btn-primary plan-cta" onClick={openModal}>
                {plan.cta}
              </button>
            </article>
          ))}
        </div>

        <div className="pricing-dots" role="tablist" aria-label="Planes">
          {plans.map((p, i) => (
            <button
              key={p.name}
              className={`pricing-dot ${active === i ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Ver plan ${p.name}`}
              aria-selected={active === i}
            />
          ))}
        </div>

        <p className="pricing-note">
          ¿Necesitas flujos a la medida (agenda, inventario, integraciones)?
          <b> Automatización a medida desde $2.9M.</b> Y los módulos extra
          (anti-inasistencia, reseñas de Google, reactivación) se suman a cualquier plan.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
