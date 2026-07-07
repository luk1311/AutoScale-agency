import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

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
      
      // Image Parallax Logic
      const heroBg = document.getElementById('hero-bg-img');
      if (heroBg) {
        gsap.fromTo(heroBg, 
          { scale: 1.1 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
    }, contentRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <section className="section hero-section" ref={contentRef}>
      
      {/* Background Image Wrapper */}
      <div className="hero-video-wrapper">
        <img 
          id="hero-bg-img"
          className="hero-video"
          src="/hero-3d.png" 
          alt="AI Sales System"
        />
        <div className="video-overlay"></div>
      </div>

      {/* Aurora Background Glows (Optional, placed over video for extra effect) */}
      
      <div className="container hero-container">
        
        {/* Content (Centered for full screen) */}
        <div className="hero-content centered">
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

      </div>
    </section>
  );
};

export default Hero;
