import './Demo.css';

const Demo = ({ openModal }) => {
  const openChatWidget = () => {
    const chatBtn = document.querySelector('.chat-toggle-btn');
    if (chatBtn) {
      chatBtn.click();
    }
  };

  return (
    <section className="section demo-section" id="demo">
      <div className="container text-center">
        <div className="demo-box glass-panel">
          <h2>Pruébalo ahora</h2>
          <p>
            Observa cómo nuestro sistema recibe información, responde preguntas y agenda citas automáticamente.
          </p>
          
          <div className="demo-actions">
            <button onClick={openChatWidget} className="btn btn-primary">Probar asistente en vivo</button>
            <span className="demo-or">o</span>
            <button onClick={openModal} className="btn btn-secondary">Solicitar implementación (n8n)</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
