import './Demo.css';

const Demo = ({ openModal }) => {
  return (
    <section className="section demo-section" id="demo">
      <div className="container text-center">
        <div className="demo-box glass-panel">
          <h2>Pruébalo ahora</h2>
          <p>
            Observa cómo nuestro sistema recibe información y organiza tus contactos automáticamente en el CRM.
          </p>
          
          <div className="demo-actions">
            <button onClick={openModal} className="btn btn-primary">Solicitar implementación (n8n)</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
