import './Pricing.css';
import { Check } from 'lucide-react';
import { useRef, useState } from 'react';

const Pricing = ({ openModal }) => {
  const gridRef = useRef(null);
  const [active, setActive] = useState(0);

  // Detecta la tarjeta cuyo centro está más cerca del centro del carrusel.
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
    <section className="section pricing-section" id="precios">
      <div className="container animate-fade-in">
        <div className="section-title text-center">
          <h2 className="text-gradient">Elige el sistema de ventas para tu agencia</h2>
          <p>Planes diseñados para escalar, no cobramos por horas, construimos máquinas que venden por ti.</p>
        </div>

        <p className="pricing-hint">Desliza para comparar los planes →</p>

        <div className="pricing-grid" ref={gridRef} onScroll={handleScroll}>
          {/* Plan Esencial */}
          <div className="pricing-card glass-panel delay-100">
            <h3 className="pricing-name">Esencial</h3>
            <p className="pricing-desc">Ideal para quien busca dejar de verse amateur.</p>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">990k</span>
              <span className="period">/ setup</span>
            </div>
            <div className="pricing-monthly-wrapper">
              <span className="monthly-badge">+ $120.000 mensual</span>
            </div>
            
            <ul className="pricing-features">
              <li><Check size={20} className="check-icon" /> <span>Landing page Premium (Optimizada móvil)</span></li>
              <li><Check size={20} className="check-icon" /> <span>Hosting ultrarrápido y seguro</span></li>
              <li><Check size={20} className="check-icon" /> <span>Formulario directo al correo</span></li>
              <li><Check size={20} className="check-icon" /> <span>Botón flotante de WhatsApp</span></li>
            </ul>
            
            <button className="btn btn-secondary btn-full" onClick={openModal}>
              Agendar Demo
            </button>
          </div>

          {/* Plan Pro */}
          <div className="pricing-card glass-panel popular delay-200">
            <div className="popular-badge">⭐ Más Elegido</div>
            <h3 className="pricing-name">Pro</h3>
            <p className="pricing-desc">El Sistema Automático de Ventas.</p>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">1.79M</span>
              <span className="period">/ setup</span>
            </div>
            <div className="pricing-monthly-wrapper">
              <span className="monthly-badge pro-badge">+ $350.000 mensual</span>
            </div>
            
            <ul className="pricing-features">
              <li><Check size={20} className="check-icon" /> <span>Todo lo del plan Esencial</span></li>
              <li>
                <Check size={20} className="check-icon" /> 
                <span className="feature-text">
                  <strong className="feature-title">Automatización n8n:</strong>
                  <span className="feature-subtext">Respuesta inmediata WhatsApp/Email</span>
                </span>
              </li>
              <li><Check size={20} className="check-icon" /> <span>CRM personalizado (/admin)</span></li>
              <li><Check size={20} className="check-icon" /> <span>Gestión de estado de Leads</span></li>
              <li><Check size={20} className="check-icon" /> <span>Analíticas y exportación Excel</span></li>
            </ul>
            
            <button className="btn btn-primary btn-full" onClick={openModal}>
              Empezar con Pro
            </button>
          </div>

          {/* Plan Elite */}
          <div className="pricing-card elite-card delay-300">
            <h3 className="pricing-name text-gradient">Elite</h3>
            <p className="pricing-desc">El Sistema Definitivo con Inteligencia Artificial.</p>
            <div className="pricing-price">
              <span className="currency">desde $</span>
              <span className="amount">2.9M</span>
              <span className="period">/ setup</span>
            </div>
            <div className="pricing-monthly-wrapper">
              <span className="monthly-badge elite-badge">+ $490.000 mensual</span>
            </div>
            
            <ul className="pricing-features">
              <li><Check size={20} className="check-icon" /> <span>Todo lo del plan Pro</span></li>
              <li>
                <Check size={20} className="check-icon" /> 
                <span className="feature-text">
                  <strong className="feature-title">Agente IA WhatsApp 24/7</strong>
                  <span className="feature-subtext">(Responde dudas y agenda citas)</span>
                </span>
              </li>
              <li><Check size={20} className="check-icon" /> <span>Recordatorios 24h automáticos</span></li>
              <li><Check size={20} className="check-icon" /> <span>Reactivación de clientes inactivos</span></li>
              <li><Check size={20} className="check-icon" /> <span>Sincronización con ERP/Calendario</span></li>
            </ul>
            
            <button className="btn btn-elite btn-full" onClick={openModal}>
              Solicitar Cotización Elite
            </button>
          </div>
        </div>

        <div className="pricing-dots" role="tablist" aria-label="Planes">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              className={`pricing-dot ${active === i ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Ver plan ${i + 1} de 3`}
              aria-selected={active === i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
