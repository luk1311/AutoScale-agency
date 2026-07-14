import { Gift, Zap, PhoneCall, Moon, Lightbulb, Clapperboard, Wallet } from 'lucide-react';
import './Differentiators.css';

// Las 6 Jugadas como módulos vendibles + el Gemelo Digital como gancho.
// Fuente de verdad: Documentos/Estrategia/AutoScale_6_JUGADAS.md
const modules = [
  {
    icon: <Zap size={24} />,
    name: 'IA con Manos',
    promise: 'No responde. Ejecuta.',
    desc: 'La IA no solo conversa: crea el pedido, agenda la cita, manda el link de pago y actualiza tu panel. Opera tu negocio, no solo habla de él.',
  },
  {
    icon: <PhoneCall size={24} />,
    name: 'La IA que Llama',
    promise: 'No solo chatea. Llama.',
    desc: 'Un agente de voz en español que telefonea para confirmar citas, recuperar clientes y recordar — sin que levantes el teléfono.',
  },
  {
    icon: <Moon size={24} />,
    name: 'El Copiloto Nocturno',
    promise: 'Trabaja mientras duermes.',
    desc: 'Cada mañana te llega el parte por WhatsApp: qué se vendió, qué se agendó y qué recuperó la IA mientras no estabas.',
  },
  {
    icon: <Lightbulb size={24} />,
    name: 'El Panel que Aconseja',
    promise: 'Te dice qué hacer.',
    desc: 'No solo te muestra números: te dice la acción. "Sube el precio del combo", "cobra lo vencido". Dejas de decidir a ciegas.',
  },
  {
    icon: <Clapperboard size={24} />,
    name: 'La Fábrica de Creativos',
    promise: 'Contenido que atrae, con IA.',
    desc: 'Reels y banners generados por IA, conectados al sistema que vende. Se miden en clientes que llegan, no en "me gusta".',
  },
  {
    icon: <Wallet size={24} />,
    name: 'Contabilidad y Finanzas',
    promise: 'Sabe cuánto ganas de verdad.',
    desc: 'Registra gastos e ingresos escribiéndole a la IA por WhatsApp y te dice tu utilidad real del mes. Tu contador de bolsillo.',
  },
];

const Differentiators = ({ openModal }) => {
  return (
    <section id="diferenciadores" className="section section-alt diff">
      <div className="container">
        <div className="diff-head">
          <span className="eyebrow">Todo lo que hacemos</span>
          <h2>Todos venden un chatbot.<br />Nosotros entregamos un sistema.</h2>
          <p className="diff-sub">
            Un sistema base —web, CRM y automatización— y encima los módulos que tu
            negocio necesite. Ninguna plataforma de $29 al mes te da esto.
          </p>
        </div>

        {/* Gemelo Digital — el gancho, cómo empezamos */}
        <div className="diff-banner">
          <div className="diff-banner-icon"><Gift size={26} /></div>
          <div className="diff-banner-text">
            <span className="diff-promise inverse">Así empezamos — sin riesgo para ti</span>
            <h3>El Gemelo Digital</h3>
            <p>
              Te entregamos una demo real de tu negocio —tu web, tu panel y tu IA ya
              conversando— en 48 horas, <b>antes de que pagues nada</b>. No prometemos: te lo ponemos en la mano.
            </p>
          </div>
          <button className="btn btn-primary diff-banner-cta" onClick={openModal}>
            Quiero ver mi demo
          </button>
        </div>

        <p className="diff-modules-label">
          <span>Y estos 6 módulos se suman a tu sistema</span>
        </p>

        <div className="diff-grid">
          {modules.map((m) => (
            <article className="diff-card" key={m.name}>
              <div className="diff-icon">{m.icon}</div>
              <span className="diff-promise">{m.promise}</span>
              <h3>{m.name}</h3>
              <p>{m.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Differentiators;
