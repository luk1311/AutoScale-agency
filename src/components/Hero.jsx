import './Hero.css';

const Hero = ({ openModal }) => {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <span className="eyebrow hero-eyebrow">Web · Automatización · IA en WhatsApp</span>

        <h1 className="hero-title">
          Tu negocio,<br />
          <span className="hl">vendiendo&nbsp;solo.</span>
        </h1>

        <p className="hero-sub">
          Webs que convierten, CRM y una <strong>recepcionista con IA en tu WhatsApp</strong> que
          atiende, agenda y recupera clientes — 24/7, sin que muevas un dedo.
        </p>

        <div className="hero-cta">
          <button className="btn btn-primary" onClick={openModal}>Agenda una demo gratis</button>
          <a className="btn btn-outline" href="#casos">Ver casos reales</a>
        </div>

        <div className="hero-proof">
          <div className="proof"><b>24/7</b><span>atención sin descanso</span></div>
          <div className="proof-div" />
          <div className="proof"><b>1&nbsp;min</b><span>para agendar</span></div>
          <div className="proof-div" />
          <div className="proof"><b>0</b><span>clientes perdidos</span></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
