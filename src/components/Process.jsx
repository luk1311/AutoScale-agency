import './Process.css';

// El proceso real con un cliente de AutoScale (secuencia de verdad → números).
const steps = [
  {
    phase: '01',
    title: 'Demo de 10 minutos',
    description: 'Te mostramos el sistema funcionando con el nombre de tu negocio. Sin compromiso, sin tecnicismos.',
  },
  {
    phase: '02',
    title: 'Montaje en días, no meses',
    description: 'Construimos tu web, conectamos el WhatsApp y cargamos tus servicios, precios y horarios.',
  },
  {
    phase: '03',
    title: 'Encendido',
    description: 'La automatización y la IA empiezan a atender. Tú ves cada cliente entrar en tu panel.',
  },
  {
    phase: '04',
    title: 'Acompañamiento',
    description: 'Cada mes ajustamos, medimos y mejoramos. El sistema crece con tu negocio.',
  },
];

const Process = () => {
  return (
    <section id="proceso" className="section section-alt process">
      <div className="container">
        <div className="process-head">
          <span className="eyebrow">Cómo funciona</span>
          <h2>De cero a vendiendo solo<br />en 4 pasos.</h2>
        </div>

        <ol className="process-steps">
          {steps.map((s) => (
            <li className="process-step" key={s.phase}>
              <span className="step-num">{s.phase}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Process;
