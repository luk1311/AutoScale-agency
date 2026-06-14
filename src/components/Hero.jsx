import React from 'react';
import './Hero.css';

const Hero = ({ openModal }) => {
  return (
    <section className="section hero-section">
      <div className="hero-glow"></div>
      <div className="container hero-container animate-fade-in">
        <div className="hero-badge delay-100">
          Potencia tu negocio con Tecnología, Publicidad y Automatización
        </div>
        <h1 className="hero-title delay-200">
          Escala tus ventas con un ecosistema <span className="text-gradient">digital integral</span>
        </h1>
        <p className="hero-subtitle delay-300">
          Diseñamos tu página web, lanzamos campañas rentables en Meta Ads y automatizamos la atención al cliente para que vendas en piloto automático las 24 horas.
        </p>
        
        <div className="hero-benefits delay-300">
          <ul>
            <li><span className="check">✓</span> Páginas web premium de alta conversión</li>
            <li><span className="check">✓</span> Campañas de Meta Ads optimizadas para ROI</li>
            <li><span className="check">✓</span> Respuestas instantáneas en WhatsApp con IA</li>
            <li><span className="check">✓</span> Atención al cliente 24/7 sin contratar personal</li>
            <li><span className="check">✓</span> Tu ecosistema digital completamente integrado</li>
          </ul>
        </div>

        <div className="hero-cta delay-300">
          <button onClick={openModal} className="btn btn-primary btn-large">
            Quiero automatizar mi negocio
          </button>
          <p className="cta-note">Diagnóstico inicial gratuito. Sin compromiso.</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
