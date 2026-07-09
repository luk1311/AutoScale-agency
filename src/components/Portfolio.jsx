import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Portfolio.css';

// Respaldo si Supabase no está configurado o aún no hay casos activos.
const FALLBACK_PROJECTS = [
  {
    id: 'fallback-nail',
    title: 'Nail Studio',
    category: 'Salón de uñas · Barranquilla',
    description: 'Las clientas agendan solas por WhatsApp: formulario, confirmación automática y panel de citas.',
    website_url: 'https://nail-studio-tau-five.vercel.app',
  },
  {
    id: 'fallback-multicasas',
    title: 'MultiCasas Prefabricadas',
    category: 'Constructora · Colombia',
    description: 'Cotizador interactivo que captura al interesado y dispara WhatsApp + correo al equipo de ventas.',
    website_url: 'https://multicasas-web.vercel.app/',
  },
];

const TONES = ['rose', 'amber'];

const Portfolio = ({ openModal }) => {
  // null = cargando; luego siempre un array (real o de respaldo).
  const [projects, setProjects] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!supabase) {
        if (alive) setProjects(FALLBACK_PROJECTS);
        return;
      }

      // Traemos 3 para saber si hay más de 2 (mostramos 2 + link "ver todos").
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('id, title, category, description, image, website_url, tags')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!alive) return;

      if (error || !data || data.length === 0) {
        setProjects(FALLBACK_PROJECTS);
      } else {
        setHasMore(data.length > 2);
        setProjects(data.slice(0, 2));
      }
    };

    load();
    return () => { alive = false; };
  }, []);

  // Evita el parpadeo de layout: no renderiza la grilla hasta tener datos.
  if (!projects) return null;

  return (
    <section id="casos" className="section cases">
      <div className="container">
        <div className="cases-head">
          <span className="eyebrow">Casos reales</span>
          <h2>No te lo contamos.<br />Te lo mostramos funcionando.</h2>
        </div>

        <div className="cases-grid">
          {projects.map((p, i) => {
            const href = p.website_url;
            const initial = `${(p.title || '?').trim().charAt(0).toUpperCase()}.`;
            const Card = (
              <>
                <div className={`case-visual tone-${TONES[i % TONES.length]}`}>
                  {p.image ? (
                    <img className="case-image" src={p.image} alt={p.title} />
                  ) : (
                    <span className="case-initial">{initial}</span>
                  )}
                  <span className="case-live">● Demo en vivo</span>
                </div>
                <div className="case-body">
                  <span className="case-category">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <span className="case-link">
                    Ver la demo <ArrowUpRight size={18} />
                  </span>
                </div>
              </>
            );
            return href ? (
              <a key={p.id} className="case-card" href={href} target="_blank" rel="noopener noreferrer">
                {Card}
              </a>
            ) : (
              <Link key={p.id} className="case-card" to={`/portafolio/${p.id}`}>
                {Card}
              </Link>
            );
          })}

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

        {hasMore && (
          <div className="cases-more">
            <Link to="/portafolio" className="cases-more-link">
              Ver todos los casos <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
