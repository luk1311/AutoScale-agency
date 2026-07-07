import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowUpRight, PlayCircle, ShieldCheck } from 'lucide-react';
import Spline from '@splinetool/react-spline';
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

    }, contentRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <section className="section hero-section" ref={contentRef}>
      
      {/* Removed static immersive background */}
      
      <div className="container hero-container">
        
        {/* Content (Left Aligned) */}
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="badge-icon" />
            Sistemas de Ventas con IA
          </div>
          
          <h1 className="hero-title">
            Tu negocio necesita un <br/><span className="text-blue">vendedor silencioso.</span>
          </h1>
          
          <p className="hero-subtitle">
            Reemplazamos tu página estática por un sistema inteligente: 
            diseño premium, automatizaciones y Agentes de IA en 
            WhatsApp que venden por ti las 24 horas.
          </p>

          <div className="hero-cta">
            <div className="hero-buttons">
              <button onClick={openModal} className="btn-primary">
                Iniciar Proyecto <ArrowUpRight size={18} />
              </button>
              <button className="btn-secondary">
                Ver cómo funciona <PlayCircle size={18} />
              </button>
            </div>
            
            <p className="cta-note">
              <ShieldCheck size={16} className="note-icon" />
              Auditamos tu proceso actual de forma gratuita.
            </p>
          </div>
        </div>

        {/* Content (Right Aligned 3D Visual) */}
        <div className="hero-visual">
          <div className="spline-wrapper animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {/* PLACEHOLDER URL: Waiting for user to provide their .splinecode */}
            <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
