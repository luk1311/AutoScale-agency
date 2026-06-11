import React from 'react';
import './FooterCTA.css';

const FooterCTA = () => {
  return (
    <section className="section footer-cta-section" id="contacto">
      <div className="container text-center">
        <div className="footer-cta-content glass-panel">
          <h2>Descubre cuánto dinero <span className="text-gradient">podrías ahorrar</span></h2>
          <p className="cta-intro">
            Cada mensaje sin responder es una oportunidad perdida.<br/>
            Cada tarea repetitiva que realiza tu equipo es tiempo que podría dedicarse a vender.
          </p>
          
          <div className="cta-highlight">
            Automatizar no es un gasto.<br/>
            <strong>Es una inversión para crecer más rápido, atender mejor y aumentar tus ingresos.</strong>
          </div>

          <div className="final-action">
            <h3>Solicita tu Auditoría Gratuita</h3>
            <p>Analizaremos tu proceso actual y te mostraremos exactamente qué áreas puedes automatizar para aumentar ventas y reducir costos.</p>
            
            <a href="#contacto" className="btn btn-primary btn-large cta-btn">Quiero mi Auditoría Gratuita</a>
            <p className="cta-note">*Disponibilidad limitada para garantizar una implementación personalizada.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
