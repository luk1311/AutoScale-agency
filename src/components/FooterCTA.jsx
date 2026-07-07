import './FooterCTA.css';

const FooterCTA = ({ openModal }) => {
  return (
    <section className="section footer-cta-section" id="contacto" style={{ padding: '4rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
      <div className="bg-glow blue" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', opacity: '0.6' }}></div>
      <div className="container text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>¿Listo para <span className="text-gradient">escalar</span> tu negocio?</h2>
        <button onClick={openModal} className="btn btn-primary btn-large cta-btn" style={{ padding: '1rem 3rem', fontSize: '1.2rem', margin: '0 auto' }}>
          ¡Iniciar tu Proyecto!
        </button>
      </div>
    </section>
  );
};

export default FooterCTA;
