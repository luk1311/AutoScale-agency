import './PainPoints.css';

const PainPoints = () => {
  const points = [
    {
      title: "Mensajes acumulados",
      description: "Tu equipo dedica horas respondiendo las mismas preguntas una y otra vez.",
      icon: "💬"
    },
    {
      title: "Prospectos que desaparecen",
      description: "Personas interesadas escriben fuera de horario y nunca reciben atención inmediata.",
      icon: "👻"
    },
    {
      title: "Procesos desorganizados",
      description: "Información dispersa entre WhatsApp, Instagram, correos y hojas de cálculo.",
      icon: "📉"
    },
    {
      title: "Falta de seguimiento",
      description: "Muchos clientes potenciales se pierden simplemente porque nadie les dio continuidad.",
      icon: "⚠️"
    }
  ];

  return (
    <section className="section pain-points-section" id="problema">
      <div className="container">
        <div className="section-title">
          <h2>¿Cuánto dinero estás perdiendo por <span className="text-gradient">responder tarde?</span></h2>
          <p>
            Cada minuto que un prospecto espera una respuesta, aumenta la probabilidad de que compre a tu competencia. Probablemente estás enfrentando alguno de estos problemas:
          </p>
        </div>

        <div className="grid grid-cols-2">
          {points.map((point, index) => (
            <div className="glass-panel pain-point-card" key={index}>
              <div className="pain-icon">{point.icon}</div>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
