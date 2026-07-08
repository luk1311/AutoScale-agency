import './FooterCTA.css';

const FooterCTA = ({ openModal }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* CTA masivo */}
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <h2>
            Deja de perder clientes<br />
            <span className="hl">hoy mismo.</span>
          </h2>
          <p>En 10 minutos te mostramos tu sistema funcionando, con tu logo y tus servicios.</p>
          <div className="footer-cta-actions">
            <button className="btn btn-primary" onClick={openModal}>Agenda tu demo gratis</button>
            <a
              className="btn btn-outline footer-wa"
              href="https://wa.me/573116691969?text=Hola%20AutoScale%2C%20quiero%20una%20demo%20para%20mi%20negocio"
              target="_blank"
              rel="noopener noreferrer"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Pie */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <a href="/" className="footer-logo">AutoScale<span>.</span></a>
          <nav className="footer-nav">
            <a href="#servicios">Servicios</a>
            <a href="#casos">Casos reales</a>
            <a href="#precios">Precios</a>
            <a href="#faq">Preguntas</a>
          </nav>
          <p className="footer-copy">© {year} AutoScale · Barranquilla, Colombia</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterCTA;
