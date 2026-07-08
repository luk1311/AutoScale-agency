import { ArrowUpRight } from 'lucide-react';
import './Portfolio.css';

// Casos REALES de AutoScale, con demos en vivo (nada inventado).
const projects = [
  {
    initial: 'N.',
    tone: 'rose',
    title: 'Nail Studio',
    category: 'Salón de uñas · Barranquilla',
    result: 'Las clientas agendan solas por WhatsApp: formulario, confirmación automática y panel de citas.',
    url: 'https://nail-studio-tau-five.vercel.app',
  },
  {
    initial: 'M.',
    tone: 'amber',
    title: 'MultiCasas Prefabricadas',
    category: 'Constructora · Colombia',
    result: 'Cotizador interactivo que captura al interesado y dispara WhatsApp + correo al equipo de ventas.',
    url: 'https://multicasas-web.vercel.app/',
  },
];

const Portfolio = ({ openModal }) => {
  return (
    <section id="casos" className="section cases">
      <div className="container">
        <div className="cases-head">
          <span className="eyebrow">Casos reales</span>
          <h2>No te lo contamos.<br />Te lo mostramos funcionando.</h2>
        </div>

        <div className="cases-grid">
          {projects.map((p) => (
            <a
              key={p.title}
              className="case-card"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={`case-visual tone-${p.tone}`}>
                <span className="case-initial">{p.initial}</span>
                <span className="case-live">● Demo en vivo</span>
              </div>
              <div className="case-body">
                <span className="case-category">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.result}</p>
                <span className="case-link">
                  Ver la demo <ArrowUpRight size={18} />
                </span>
              </div>
            </a>
          ))}

          {/* Tercera tarjeta: CTA directo */}
          <button className="case-card case-cta" onClick={openModal}>
            <div className="case-visual tone-ink">
              <span className="case-initial">¿Tú?</span>
            </div>
            <div className="case-body">
              <span className="case-category">Tu negocio</span>
              <h3>El próximo caso puede ser el tuyo</h3>
              <p>Te mostramos en 10 minutos cómo se vería tu sistema, con tu logo y tus servicios.</p>
              <span className="case-link">Agendar demo <ArrowUpRight size={18} /></span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
