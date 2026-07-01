import './FooterCTA.css';

const FooterCTA = ({ openModal }) => {
  return (
    <section className="section footer-cta-section" id="contacto" style={{ padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>¿Listo para <span className="text-gradient">escalar</span> tu negocio?</h2>
        <button onClick={openModal} className="btn btn-primary btn-large cta-btn" style={{ padding: '1rem 3rem', fontSize: '1.2rem', margin: '0 auto' }}>
          ¡Iniciar tu Proyecto!
        </button>
      </div>
    </section>
  );
};

export default FooterCTA;
