import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

const Process = () => {
  const sectionRef = useRef(null);

  const steps = [
    {
      number: "1",
      title: "Estrategia Integral",
      desc: "Analizamos tu negocio para diseñar la web, definir las campañas y mapear el flujo de automatización."
    },
    {
      number: "2",
      title: "Desarrollo y Diseño",
      desc: "Creamos tu Landing Page premium y conectamos los asistentes de Inteligencia Artificial."
    },
    {
      number: "3",
      title: "Lanzamiento Meta Ads",
      desc: "Activamos las campañas publicitarias para inyectar tráfico calificado a tu nuevo ecosistema."
    },
    {
      number: "4",
      title: "Conversión en Piloto",
      desc: "El tráfico llega a tu web, la IA atiende a los prospectos y tú te enfocas en cerrar las ventas."
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.process-step',
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process-timeline',
            start: 'top 85%',
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section process-section" id="proceso" ref={sectionRef}>
      <div className="container">
        <div className="section-title">
          <h2>Nuestro proceso en <span className="text-gradient">4 pasos</span></h2>
          <p>Implementación rápida, sin dolores de cabeza para ti ni tu equipo.</p>
        </div>

        <div className="process-timeline">
          {steps.map((step, index) => (
            <div className="process-step glass-panel" key={index}>
              <div className="step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
