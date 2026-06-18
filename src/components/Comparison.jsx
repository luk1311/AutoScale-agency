import './Comparison.css';

const Comparison = () => {
  const comparisons = [
    {
      before: "Responder manualmente cientos de mensajes",
      after: "Respuestas automáticas e instantáneas"
    },
    {
      before: "Perder clientes fuera del horario laboral",
      after: "Atención disponible 24/7"
    },
    {
      before: "Información dispersa en múltiples plataformas",
      after: "CRM centralizado y sincronizado"
    },
    {
      before: "Seguimiento manual e inconsistente",
      after: "Automatización completa de seguimientos"
    },
    {
      before: "Más carga de trabajo para el equipo",
      after: "Más tiempo para cerrar ventas y crecer"
    }
  ];

  return (
    <section className="section comparison-section" id="comparacion">
      <div className="container">
        <div className="section-title">
          <h2>Antes vs <span className="text-gradient">Después</span></h2>
          <p>La diferencia entre un proceso obsoleto y un ecosistema automatizado de alto rendimiento.</p>
        </div>

        <div className="comparison-table glass-panel">
          <div className="comparison-header">
            <div className="header-before">Lo que haces ahora</div>
            <div className="header-after">Con nuestro sistema</div>
          </div>
          
          <div className="comparison-body">
            {comparisons.map((item, index) => (
              <div className="comparison-row" key={index}>
                <div className="cell-before">
                  <span className="cross">✕</span>
                  <p>{item.before}</p>
                </div>
                <div className="cell-after">
                  <span className="check">✓</span>
                  <p>{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
