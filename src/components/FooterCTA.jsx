import './FooterCTA.css';

const FooterCTA = ({ openModal }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="v2-footer">
      <div className="container">
        
        {/* Massive CTA Section */}
        <div className="v2-footer-cta">
          <h2 className="v2-footer-title">
            ¿Listo para escalar la <br />
            <span className="text-gradient">infraestructura de tu agencia?</span>
          </h2>
          <p className="v2-footer-subtitle">
            Construimos sistemas de automatización, embudos de conversión y arquitectura web para empresas que buscan multiplicar su MRR sin contratar más personal.
          </p>
          <button className="btn btn-primary v2-footer-btn" onClick={openModal}>
            Agendar Llamada Estratégica
          </button>
        </div>

        {/* Footer Links & Info */}
        <div className="v2-footer-bottom">
          <div className="v2-footer-brand">
            <div className="v2-logo">
              AutoScale<span className="dot"></span>
            </div>
            <p className="v2-footer-tagline">Engineered for Scale.</p>
          </div>

          <div className="v2-footer-links-grid">
            <div className="v2-link-col">
              <h4>Plataforma</h4>
              <a href="#servicios">Servicios</a>
              <a href="#portafolio">Casos de Estudio</a>
              <a href="#proceso">Metodología</a>
            </div>
            <div className="v2-link-col">
              <h4>Empresa</h4>
              <a href="#about">Nosotros</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); openModal(); }}>Contacto</a>
              <a href="#careers">Carreras</a>
            </div>
            <div className="v2-link-col">
              <h4>Legal</h4>
              <a href="/terms">Términos</a>
              <a href="/privacy">Privacidad</a>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="v2-footer-copyright">
          <p>&copy; {currentYear} AutoScale Agency. Todos los derechos reservados.</p>
          <div className="v2-socials">
            <a href="https://twitter.com">Twitter</a>
            <a href="https://linkedin.com">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterCTA;
