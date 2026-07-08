import './Pricing.css';

const Pricing = ({ openModal }) => {
  return (
    <section id="pricing" className="section v2-pricing">
      <div className="container">
        
        <div className="showcase-header">
          <h2>Inversión <span className="text-gradient">Estratégica</span></h2>
          <p>No somos un gasto. Somos la infraestructura que multiplica tu MRR.</p>
        </div>

        <div className="v2-pricing-grid">
          
          {/* Growth Tier */}
          <div className="v2-price-card">
            <div className="v2-price-header">
              <h3>Growth Architecture</h3>
              <div className="v2-price-amount">
                <span className="currency">$</span>2,500<span className="period">/mo</span>
              </div>
              <p>Para agencias facturando $10k - $30k/mo buscando escalar sin romper operaciones.</p>
            </div>
            
            <ul className="v2-price-features">
              <li>Auditoría de Sistemas (One-time)</li>
              <li>Automatización de Onboarding</li>
              <li>CRM Setup (HubSpot/GoHighLevel)</li>
              <li>Soporte Slack Dedicado (L-V)</li>
              <li>1 Iteración Estratégica Mensual</li>
            </ul>
            
            <button className="btn btn-outline v2-price-btn" onClick={openModal}>
              Aplicar Ahora
            </button>
          </div>

          {/* Scale Tier (Popular) */}
          <div className="v2-price-card popular">
            <div className="popular-badge">Recomendado</div>
            <div className="v2-price-header">
              <h3>Scale Engineering</h3>
              <div className="v2-price-amount">
                Personalizado
              </div>
              <p>Para empresas +$50k/mo que requieren infraestructura técnica profunda y embudos complejos.</p>
            </div>
            
            <ul className="v2-price-features">
              <li><strong>Todo lo de Growth, más:</strong></li>
              <li>Desarrollo de Apps Internas (No-Code)</li>
              <li>Arquitectura de Datos Avanzada</li>
              <li>Embudos de Paid Media B2B</li>
              <li>Ingeniería de Prompts y Agentes AI</li>
              <li>Línea Directa 24/7 con el Director Técnico</li>
            </ul>
            
            <button className="btn btn-primary v2-price-btn" onClick={openModal}>
              Agendar Llamada Estratégica
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Pricing;
