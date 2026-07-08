import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // First one open by default

  const faqs = [
    {
      question: "¿Cuánto tiempo toma implementar la arquitectura?",
      answer: "Depende de la complejidad técnica de tu agencia. Sin embargo, nuestro sprint promedio de 'Growth Architecture' toma entre 3 y 4 semanas desde la auditoría inicial hasta el despliegue en producción."
    },
    {
      question: "¿Qué herramientas o stack tecnológico utilizan?",
      answer: "Somos agnósticos en herramientas, pero nos inclinamos por la mejor infraestructura de su clase. Usamos Make/n8n para automatización, HubSpot/GoHighLevel para CRM, y stacks de código a medida (React, Node, Python) cuando el No-Code no es suficiente."
    },
    {
      question: "¿Mi equipo necesitará capacitación técnica?",
      answer: "No. Construimos sistemas 'Zero-Friction'. Tu equipo seguirá usando las interfaces que ya conocen (Slack, Email, CRM), mientras nuestra arquitectura hace todo el trabajo pesado en el backend."
    },
    {
      question: "¿Qué pasa si mis procesos cambian en el futuro?",
      answer: "Nuestra infraestructura es modular. Si tu modelo de negocio pivota o añades nuevos servicios, adaptamos las ramas lógicas del sistema sin tener que reconstruir todo desde cero."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="section v2-faq">
      <div className="container">
        
        <div className="showcase-header">
          <h2>Preguntas <span className="text-gradient">Frecuentes</span></h2>
          <p>Claridad radical antes de nuestra llamada estratégica.</p>
        </div>

        <div className="v2-faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`v2-faq-item ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="v2-faq-question">
                <h3>{faq.question}</h3>
                <ChevronDown className="v2-faq-icon" size={24} />
              </div>
              <div className="v2-faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
