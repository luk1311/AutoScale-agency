import './Pricing.css';

const Pricing = ({ openModal }) => {
  return (
    <section className="section pricing-section" id="precios">
      <div className="container animate-fade-in">
        <div className="section-title text-center">
          <h2 className="text-gradient">Elige el sistema de ventas para tu agencia</h2>
          <p>Planes diseñados para escalar, no cobramos por horas, construimos máquinas que venden por ti.</p>
        </div>

        <div className="pricing-grid">
          {/* Plan Esencial */}
          <div className="pricing-card glass-panel delay-100">
            <h3 className="pricing-name">Esencial</h3>
            <p className="pricing-desc">Ideal para quien busca dejar de verse amateur.</p>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">990k</span>
              <span className="period">/ setup</span>
            </div>
            <p className="pricing-monthly">+ $120.000 mensual</p>
            
            <ul className="pricing-features">
              <li><span className="check">✓</span> Landing page Premium (Optimizada móvil)</li>
              <li><span className="check">✓</span> Hosting ultrarrápido y seguro</li>
              <li><span className="check">✓</span> Formulario directo al correo</li>
              <li><span className="check">✓</span> Botón flotante de WhatsApp</li>
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
            <p className="pricing-monthly">+ $350.000 mensual</p>
            
            <ul className="pricing-features">
              <li><span className="check">✓</span> Todo lo del plan Esencial</li>
              <li><span className="check">✓</span> <strong>Automatización n8n:</strong> Respuesta inmediata WhatsApp/Email</li>
              <li><span className="check">✓</span> CRM personalizado (/admin)</li>
              <li><span className="check">✓</span> Gestión de estado de Leads</li>
              <li><span className="check">✓</span> Analíticas y exportación Excel</li>
            </ul>
            
            <button className="btn btn-primary btn-full" onClick={openModal}>
              Empezar con Pro
            </button>
          </div>

          {/* Plan Elite */}
          <div className="pricing-card glass-panel elite delay-300">
            <h3 className="pricing-name text-gradient">Elite</h3>
            <p className="pricing-desc">El Sistema Definitivo con Inteligencia Artificial.</p>
            <div className="pricing-price">
              <span className="currency">desde $</span>
              <span className="amount">2.9M</span>
              <span className="period">/ setup</span>
            </div>
            <p className="pricing-monthly">+ $490.000 mensual</p>
            
            <ul className="pricing-features">
              <li><span className="check">✓</span> Todo lo del plan Pro</li>
              <li><span className="check">✓</span> <strong>Agente IA WhatsApp 24/7</strong> (Responde dudas y agenda citas)</li>
              <li><span className="check">✓</span> Recordatorios 24h automáticos</li>
              <li><span className="check">✓</span> Reactivación de clientes inactivos</li>
              <li><span className="check">✓</span> Sincronización con ERP/Calendario</li>
            </ul>
            
            <button className="btn btn-primary btn-full" onClick={openModal}>
              Solicitar Cotización Elite
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
