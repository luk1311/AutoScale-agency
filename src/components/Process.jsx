import React from 'react';
import './Process.css';

const Process = () => {
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

  return (
    <section className="section process-section" id="proceso">
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
