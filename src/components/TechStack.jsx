import React from 'react';
import './TechStack.css';

const TechStack = () => {
  const techList = [
    "Desarrollo Web (React & Vite)",
    "Meta Ads Manager",
    "Inteligencia Artificial Generativa",
    "WhatsApp Business API",
    "Diseño UI/UX Premium",
    "Automatizaciones con n8n",
    "Embudos de Venta Optimizados"
  ];

  return (
    <section className="section tech-section" id="tecnologia">
      <div className="container text-center">
        <div className="section-title">
          <h2>Tecnología Empresarial</h2>
          <p>Implementamos soluciones utilizando tecnologías modernas y escalables. Todo configurado y gestionado por nuestro equipo.</p>
        </div>

        <div className="tech-badges">
          {techList.map((tech, index) => (
            <div className="tech-badge" key={index}>
              {tech}
            </div>
          ))}
        </div>
        
        <div className="tech-note glass-panel">
          <p>No necesitas conocimientos técnicos. Nosotros nos encargamos de todo.</p>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
