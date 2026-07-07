import { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import gsap from 'gsap';
import './Hero.css';

const Hero = ({ openModal }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-badge', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
      
      gsap.fromTo('.hero-subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
      );

      gsap.fromTo('.hero-cta',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
      );
      
      gsap.fromTo('.hero-visual',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.3 }
      );
    }, contentRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <section className="section hero-section" ref={contentRef}>
      {/* Aurora Background Glows */}
      <div className="bg-glow blue" style={{ top: '-10%', left: '-10%' }}></div>
      <div className="bg-glow purple" style={{ top: '20%', right: '-10%', width: '800px', height: '800px' }}></div>
      
      <div className="container hero-container">
        
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-badge">
            Sistemas de Ventas con IA
          </div>
          
          <h1 className="hero-title">
            Tu negocio necesita un <br/><span className="text-gradient">vendedor silencioso.</span>
          </h1>
          
          <p className="hero-subtitle">
            Reemplazamos tu página estática por un sistema inteligente: diseño premium, 
            automatizaciones y Agentes de IA en WhatsApp que venden por ti las 24 horas.
          </p>

          <div className="hero-cta">
            <button onClick={openModal} className="btn btn-primary btn-large">
              Iniciar Proyecto
            </button>
            <p className="cta-note">Auditamos tu proceso actual de forma gratuita.</p>
          </div>
        </div>

        {/* Right 3D Visual */}
        <div className="hero-visual">
          <div className="spline-wrapper">
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
