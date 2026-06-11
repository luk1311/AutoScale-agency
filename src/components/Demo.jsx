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
            <a href="https://wa.me/5211234567890?text=Hola,%20quiero%20probar%20la%20demostración%20interactiva." target="_blank" rel="noopener noreferrer" className="btn btn-primary">Probar demostración interactiva</a>
            <span className="demo-or">o</span>
            <a href="https://wa.me/5211234567890?text=Hola,%20quisiera%20hablar%20con%20el%20asistente." target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Hablar con el asistente por WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
