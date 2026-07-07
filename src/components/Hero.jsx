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
      
      // Video Scrubbing Logic
      const video = document.getElementById('hero-video');
      if (video) {
        // Wait for metadata to know the duration
        video.onloadedmetadata = () => {
          gsap.to(video, {
            currentTime: video.duration || 1,
            ease: "none",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.5, // 0.5 sec smoothing
            }
          });
        };
      }
    }, contentRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <section className="section hero-section" ref={contentRef}>
      
      {/* Background Video Wrapper */}
      <div className="hero-video-wrapper">
        <video 
          id="hero-video"
          className="hero-video"
          src="https://cdn.pixabay.com/video/2020/07/28/45885-446755498_large.mp4" 
          muted 
          playsInline 
          preload="auto"
        ></video>
        <div className="video-overlay"></div>
      </div>

      {/* Aurora Background Glows (Optional, placed over video for extra effect) */}
      <div className="bg-glow blue" style={{ top: '-10%', left: '-10%' }}></div>
      <div className="bg-glow purple" style={{ top: '20%', right: '-10%', width: '800px', height: '800px' }}></div>
      
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
