import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      q: "¿Necesito conocimientos técnicos?",
      a: "No. Nosotros realizamos toda la implementación."
    },
    {
      q: "¿Funciona para cualquier negocio?",
      a: "Sí. Adaptamos el sistema a cada sector."
    },
    {
      q: "¿Cuánto tarda la implementación?",
      a: "Depende de la complejidad, pero normalmente entre pocos días y algunas semanas."
    },
    {
      q: "¿Puedo seguir usando mis herramientas actuales?",
      a: "Sí. Integramos la mayoría de plataformas modernas."
    },
    {
      q: "¿Qué pasa si necesito cambios?",
      a: "Podemos ajustar y optimizar los flujos según tus necesidades."
    },
    {
      q: "¿Ofrecen soporte?",
      a: "Sí. Disponemos de planes de soporte y mantenimiento."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="section-title">
          <h2>Preguntas <span className="text-gradient">Frecuentes</span></h2>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              className={`faq-item glass-panel ${activeIndex === index ? 'active' : ''}`} 
              key={index}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <h3>{faq.q}</h3>
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
