import React from 'react';
import './Demo.css';

const Demo = () => {
  return (
    <section className="section demo-section" id="demo">
      <div className="container text-center">
        <div className="demo-box glass-panel">
          <h2>Pruébalo ahora</h2>
          <p>
            Observa cómo nuestro sistema recibe información, responde preguntas y agenda citas automáticamente.
          </p>
          
          <div className="demo-actions">
            <a href="#demo" className="btn btn-primary">Probar demostración interactiva</a>
            <span className="demo-or">o</span>
            <a href="#whatsapp" className="btn btn-secondary">Hablar con el asistente por WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
