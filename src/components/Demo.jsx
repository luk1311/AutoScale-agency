import React from 'react';
import './Demo.css';

const Demo = ({ openModal }) => {
  return (
    <section className="section demo-section" id="demo">
      <div className="container text-center">
        <div className="demo-box glass-panel">
          <h2>Pruébalo ahora</h2>
          <p>
            Observa cómo nuestro sistema recibe información, responde preguntas y agenda citas automáticamente.
          </p>
          
          <div className="demo-actions">
            <button onClick={openModal} className="btn btn-primary">Probar demostración interactiva</button>
            <span className="demo-or">o</span>
            <button onClick={openModal} className="btn btn-secondary">Hablar con el asistente por WhatsApp</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
