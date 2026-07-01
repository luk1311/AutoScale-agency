import { MessageSquare, Ghost, Network, AlertTriangle } from 'lucide-react';
import './PainPoints.css';

const PainPoints = () => {
  const points = [
    {
      title: "Mensajes acumulados",
      description: "Tu equipo dedica horas respondiendo las mismas preguntas una y otra vez.",
      icon: <MessageSquare size={36} color="var(--accent-primary)" />
    },
    {
      title: "Prospectos que desaparecen",
      description: "Personas interesadas escriben fuera de horario y nunca reciben atención inmediata.",
      icon: <Ghost size={36} color="var(--accent-primary)" />
    },
    {
      title: "Procesos desorganizados",
      description: "Información dispersa entre WhatsApp, Instagram, correos y hojas de cálculo.",
      icon: <Network size={36} color="var(--accent-primary)" />
    },
    {
      title: "Falta de seguimiento",
      description: "Muchos clientes potenciales se pierden simplemente porque nadie les dio continuidad.",
      icon: <AlertTriangle size={36} color="var(--accent-primary)" />
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

        <div className="pain-points-grid">
          {points.map((point, index) => (
            <div className={`glass-panel pain-point-card animate-fade-in delay-${(index % 3 + 1) * 100}`} key={index}>
              <div className="pain-icon" style={{ marginBottom: '1rem' }}>{point.icon}</div>
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
