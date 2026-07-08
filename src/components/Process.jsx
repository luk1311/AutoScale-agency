import './Process.css';

const Process = () => {
  const steps = [
    {
      phase: "01",
      title: "Auditoría de Infraestructura",
      description: "Mapeamos cada proceso actual de tu agencia. Identificamos cuellos de botella y fugas de capital donde tu equipo pierde horas valiosas."
    },
    {
      phase: "02",
      title: "Diseño de Arquitectura",
      description: "Diseñamos un pipeline de automatización personalizado. Definimos los webhooks, bases de datos y herramientas No-Code necesarias para escalar."
    },
    {
      phase: "03",
      title: "Desarrollo y Despliegue",
      description: "Construimos el sistema en un entorno aislado. Una vez superado el QA de estrés, lo conectamos a tu ecosistema en vivo sin fricción."
    },
    {
      phase: "04",
      title: "Iteración y Escalamiento",
      description: "Monitoreamos los flujos 24/7. Optimizamos tasas de conversión y añadimos nuevas ramas lógicas a medida que tu MRR aumenta."
    }
  ];

  return (
    <section id="proceso" className="section v2-process">
      <div className="container">
        
        <div className="showcase-header">
          <h2>Metodología de <span className="text-gradient">Ingeniería</span></h2>
          <p>No improvisamos. Aplicamos un framework de desarrollo estructurado para garantizar escalabilidad técnica.</p>
        </div>

        <div className="v2-pipeline">
          <div className="v2-pipeline-line"></div>
          
          <div className="v2-steps-container">
            {steps.map((step, index) => (
              <div className="v2-process-step" key={index}>
                <div className="v2-step-node">
                  <span className="v2-node-glow"></span>
                  <span className="v2-node-core"></span>
                </div>
                <div className="v2-step-content">
                  <div className="v2-step-phase">{step.phase}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Process;
