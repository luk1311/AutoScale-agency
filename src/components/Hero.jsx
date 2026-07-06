import './Hero.css';

const Hero = ({ openModal }) => {
  return (
    <section className="section hero-section">
      <div className="container hero-container animate-fade-in">
        
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-badge delay-100">
            Sistemas de Ventas con IA
          </div>
          
          <h1 className="hero-title delay-200">
            Tu negocio necesita un <br/><span className="text-gradient">vendedor silencioso.</span>
          </h1>
          
          <p className="hero-subtitle delay-300">
            Reemplazamos tu página estática por un sistema inteligente: diseño premium, 
            automatizaciones y Agentes de IA en WhatsApp que venden por ti las 24 horas.
          </p>

          <div className="hero-cta delay-300">
            <button onClick={openModal} className="btn btn-primary btn-large">
              Iniciar Proyecto
            </button>
            <p className="cta-note">Auditamos tu proceso actual de forma gratuita.</p>
          </div>
        </div>

        {/* Right 3D Visual (Spline Placeholder) */}
        <div className="hero-visual delay-300">
          <div className="spline-placeholder">
            {/* We will inject Spline iframe or canvas here later. For now, an elegant glass orb placeholder */}
            <div className="glass-orb"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
