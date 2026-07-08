import './Hero.css';

const Hero = ({ openModal }) => {
  return (
    <section className="v2-hero">
      {/* Background Tech Grid */}
      <div className="v2-hero-bg">
        <div className="v2-grid-overlay"></div>
        <div className="v2-glow-blob"></div>
      </div>

      <div className="container v2-hero-container">
        <div className="v2-hero-content">
          
          <div className="v2-badge">
            <span className="v2-badge-dot"></span>
            Scale Engineering Agency
          </div>
          
          <h1 className="v2-hero-title">
            Escalamos agencias <br/>
            mediante <span className="text-gradient">código</span> y <span className="text-gradient">sistemas.</span>
          </h1>
          
          <p className="v2-hero-subtitle">
            Sustituimos el caos operativo por infraestructura tecnológica. Construimos automatizaciones B2B, embudos de alta conversión y ecosistemas digitales diseñados exclusivamente para multiplicar tu facturación.
          </p>
          
          <div className="v2-hero-actions">
            <button className="btn btn-primary v2-hero-btn" onClick={openModal}>
              Agendar Auditoría Gratuita
            </button>
            <button className="btn btn-outline v2-hero-btn">
              Ver Casos de Estudio
            </button>
          </div>

          {/* Social Proof / Mini Stats */}
          <div className="v2-hero-proof">
            <div className="proof-item">
              <strong>+140%</strong>
              <span>MRR Promedio</span>
            </div>
            <div className="proof-item">
              <strong>Zero</strong>
              <span>Caos Operativo</span>
            </div>
            <div className="proof-item">
              <strong>24/7</strong>
              <span>Sistemas Activos</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
