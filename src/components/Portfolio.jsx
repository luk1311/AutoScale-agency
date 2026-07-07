import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      // Fetch solo los activos, ordenados, max 3 para la landing
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching portfolio:', error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <section className="section portfolio-section" id="portafolio">
      <div className="container">
        <div className="section-title text-center">
          <h2>Nuestro <span className="text-gradient">Portafolio</span></h2>
          <p>Casos de éxito reales. Soluciones de alto impacto diseñadas para escalar ventas y automatizar operaciones.</p>
        </div>

        <div className="portfolio-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem' }} />
              <p>Cargando proyectos destacados...</p>
            </div>
          ) : projects.map((project, index) => (
            <Link to={`/portafolio/${project.id}`} className="portfolio-card glass-panel" key={index} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
              <div className="portfolio-image-wrapper">
                <img src={project.image} alt={project.title} className="portfolio-image" />
              </div>
              <div className="portfolio-content">
                <span className="portfolio-category">{project.category}</span>
                <h3 className="portfolio-title">{project.title}</h3>
                <p className="portfolio-description">{project.description}</p>
                <div className="portfolio-tags">
                  {(project.tags || []).map((tag, i) => (
                    <span className="portfolio-tag" key={i}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center" style={{ marginTop: '3rem' }}>
          <button className="btn btn-outline" onClick={() => navigate('/portafolio')}>
            Ver Más Proyectos <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
