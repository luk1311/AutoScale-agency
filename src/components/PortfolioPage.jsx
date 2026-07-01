import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import FooterCTA from './FooterCTA';
import ContactModal from './ContactModal';
import './Portfolio.css';

const PortfolioPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProjects = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching portfolio:', error);
      } else {
        setAllProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const categories = ['Todos', 'Desarrollo Web', 'IA & Automatización', 'Meta Ads', 'UI/UX', 'Otros'];

  const filteredProjects = filter === 'Todos' 
    ? allProjects 
    : allProjects.filter(p => p.category.includes(filter));

  return (
    <div className="app-container">
      <Header openModal={openModal} />
      
      <main className="portfolio-page" style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container">
          
          <div className="portfolio-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <Link to="/" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
              <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Volver al Inicio
            </Link>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Proyectos <span className="text-gradient">Destacados</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Explora en detalle cómo hemos ayudado a empresas a escalar con tecnología y diseño de primer nivel.
            </p>
          </div>

          <div className="portfolio-filters" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '4rem' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background: filter === cat ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${filter === cat ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'}`,
                  color: filter === cat ? '#fff' : 'var(--text-main)',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="portfolio-grid">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '1.2rem' }}>Cargando portafolio...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.2rem' }}>No se encontraron proyectos en esta categoría.</p>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
              <div className="portfolio-card glass-panel" key={index}>
                <div className="portfolio-image-wrapper">
                  <img src={project.image} alt={project.title} className="portfolio-image" />
                  <div className="portfolio-overlay">
                    <a href="#" className="portfolio-link-btn" aria-label="Ver Proyecto"><ExternalLink size={24} /></a>
                  </div>
                </div>
                <div className="portfolio-content">
                  <span className="portfolio-category">{project.category}</span>
                  <h3 className="portfolio-title">{project.title}</h3>
                  <p className="portfolio-description">{project.description}</p>
                  <div className="portfolio-tags">
                    {project.tags.map((tag, i) => (
                      <span className="portfolio-tag" key={i}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <FooterCTA openModal={openModal} />
      {isModalOpen && <ContactModal onClose={closeModal} />}
    </div>
  );
};

export default PortfolioPage;
