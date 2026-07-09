import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import FooterCTA from './FooterCTA';
import ContactModal from './ContactModal';
import './Portfolio.css';

const TONES = ['rose', 'amber'];

const PortfolioPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let alive = true;

    const load = async () => {
      if (!supabase) { if (alive) setLoading(false); return; }
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('id, title, subtitle, category, description, image, website_url, tags')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (!alive) return;
      if (!error && data) setProjects(data);
      setLoading(false);
    };

    load();
    return () => { alive = false; };
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Categorías reales, derivadas de los proyectos publicados.
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['Todos', ...Array.from(set)];
  }, [projects]);

  const filtered = filter === 'Todos' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="app-container">
      <Header openModal={openModal} />

      <main className="pf-page">
        <div className="container">
          <Link to="/" className="pf-page-back"><ArrowLeft size={16} /> Volver al inicio</Link>

          <div className="cases-head pf-page-head">
            <span className="eyebrow">Portafolio</span>
            <h2>Sistemas que ya están<br />trabajando por un negocio.</h2>
          </div>

          {categories.length > 2 && (
            <div className="pf-page-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`pf-page-filter ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="pf-page-state">
              <Loader2 size={38} style={{ animation: 'spin 1s linear infinite' }} />
              <p>Cargando proyectos…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="pf-page-state">
              <p>Aún no hay proyectos publicados aquí.</p>
            </div>
          ) : (
            <div className="cases-grid">
              {filtered.map((p, i) => {
                const initial = `${(p.title || '?').trim().charAt(0).toUpperCase()}.`;
                const href = p.website_url;
                const inner = (
                  <>
                    <div className={`case-visual tone-${TONES[i % TONES.length]}`}>
                      {p.image ? (
                        <img className="case-image" src={p.image} alt={p.title} />
                      ) : (
                        <span className="case-initial">{initial}</span>
                      )}
                      <span className="case-live">● En vivo</span>
                    </div>
                    <div className="case-body">
                      <span className="case-category">{p.subtitle || p.category}</span>
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                      <span className="case-link">Ver la demo <ArrowUpRight size={18} /></span>
                    </div>
                  </>
                );
                return href ? (
                  <a
                    key={p.id}
                    className="case-card"
                    href={href.startsWith('http') ? href : `https://${href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link key={p.id} className="case-card" to={`/portafolio/${p.id}`}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <FooterCTA openModal={openModal} />
      {isModalOpen && <ContactModal onClose={closeModal} />}
    </div>
  );
};

export default PortfolioPage;
