import { Gift, Zap, PhoneCall, Moon, Lightbulb, Clapperboard } from 'lucide-react';
import './Differentiators.css';

// Las 6 Jugadas — lenguaje único de la marca.
// Fuente de verdad: Documentos/Estrategia/AutoScale_6_JUGADAS.md
// Orden en la web = orden de impacto. El Gemelo Digital es el gancho (featured).
const plays = [
  {
    icon: <Zap size={24} />,
    name: 'IA con Manos',
    promise: 'No responde. Ejecuta.',
    desc: 'La IA no solo conversa: crea el pedido, manda el link de pago, agenda la cita y actualiza tu panel. Opera tu negocio, no solo habla de él.',
  },
  {
    icon: <PhoneCall size={24} />,
    name: 'La IA que Llama',
    promise: 'No solo chatea. Llama.',
    desc: 'Un agente de voz en español que telefonea para confirmar pedidos, recuperar carritos y recordar citas. Habla natural, no suena a robot.',
  },
  {
    icon: <Moon size={24} />,
    name: 'El Copiloto Nocturno',
    promise: 'Trabaja mientras duermes.',
    desc: 'Cada mañana te llega el parte por WhatsApp: "cerré 3 ventas, agendé 5 citas, recuperé 2 carritos". Un empleado más, no un bot que espera.',
  },
  {
    icon: <Lightbulb size={24} />,
    name: 'El Panel que Aconseja',
    promise: 'Te dice qué hacer.',
    desc: 'No solo te muestra números: te recomienda la acción. "El combo se está agotando, súbelo de precio." Dejas de decidir a ciegas.',
  },
  {
    icon: <Clapperboard size={24} />,
    name: 'La Fábrica de Creativos',
    promise: 'El contenido que te atrae, con IA.',
    desc: 'Reels, banners y videos generados por IA, conectados al mismo sistema que vende. Atraemos con contenido y cerramos con el agente, bajo un solo techo.',
  },
];

const Differentiators = ({ openModal }) => {
  return (
    <section id="diferenciadores" className="section section-alt diff">
      <div className="container">
        <div className="diff-head">
          <span className="eyebrow">Lo que nos hace distintos</span>
          <h2>Todos venden un chatbot.<br />Nosotros entregamos un sistema.</h2>
          <p className="diff-sub">
            Seis jugadas que ninguna plataforma de $29 al mes te puede dar. Porque no te
            vendemos una herramienta para que la configures: te entregamos el negocio funcionando.
          </p>
        </div>

        <div className="diff-grid">
          {/* Jugada gancho — bloque tinta */}
          <article className="diff-card diff-hero">
            <div className="diff-icon inverse"><Gift size={24} /></div>
            <span className="diff-promise">Verás tu negocio funcionando antes de pagar.</span>
            <h3>El Gemelo Digital</h3>
            <p>
              Te entregamos una demo real —tu web, tu panel y tu IA ya conversando— en 48 horas,
              antes de que firmes nada. No prometemos: te lo ponemos en la mano.
            </p>
            <button className="btn btn-outline diff-cta" onClick={openModal}>
              Quiero ver mi demo
            </button>
          </article>

          {plays.map((p) => (
            <article className="diff-card" key={p.name}>
              <div className="diff-icon">{p.icon}</div>
              <span className="diff-promise">{p.promise}</span>
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentiators;
