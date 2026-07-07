import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowUpRight, PlayCircle } from 'lucide-react';
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
    <section className="section hero-section dark-theme" ref={contentRef}>
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
          </div>
        </div>

        {/* Content (Right Aligned Glassmorphism Mockup) */}
        <div className="hero-visual">
          <div className="glass-mockup animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="mockup-glow mockup-glow-1"></div>
            <div className="mockup-glow mockup-glow-2"></div>
            
            <div className="glass-card">
              <div className="glass-header">
                <div className="glass-header-left">
                  <div className="status-dot pulsing"></div>
                  <span className="ai-status">Agente IA Activo</span>
                </div>
                <span className="ai-time">Ahora</span>
              </div>
              
              <div className="glass-body">
                <div className="chat-bubble ai-bubble">
                  <Sparkles size={14} className="bubble-icon" />
                  <p>¡Hola! He agendado 3 nuevas reuniones mientras dormías. 🚀</p>
                </div>
                <div className="chat-bubble user-bubble">
                  <p>Increíble. Pásame el reporte de ventas.</p>
                </div>
                <div className="chat-bubble ai-bubble typing">
                  Generando reporte en tiempo real
                  <span className="dot-anim">...</span>
                </div>
              </div>
              
              <div className="glass-footer">
                <div className="glass-input-fake">Escribe un mensaje...</div>
                <div className="glass-send-btn">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
