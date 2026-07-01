import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import FooterCTA from './FooterCTA';
import ContactModal from './ContactModal';
import './Portfolio.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProjectDetails = async () => {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching project details:', error);
      } else {
        setProject(data);
      }
      setLoading(false);
    };

    fetchProjectDetails();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="app-container">
        <Header openModal={openModal} />
        <main style={{ paddingTop: '150px', textAlign: 'center', minHeight: '80vh' }}>
          <h2>Proyecto no encontrado</h2>
          <Link to="/portafolio" className="btn btn-outline" style={{ marginTop: '2rem' }}>Volver al portafolio</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header openModal={openModal} />
      
      <main className="project-details-page" style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
        <div className="container">
          
          <Link to="/portafolio" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--accent-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
            <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Volver al Portafolio
          </Link>

          <div className="project-hero" style={{ marginBottom: '4rem' }}>
            <span style={{ color: 'var(--accent-tertiary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{project.category}</span>
            <h1 style={{ fontSize: '4rem', marginTop: '1rem', marginBottom: '2rem', lineHeight: '1.2' }}>{project.title}</h1>
            
            <div className="project-hero-image" style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative', margin: '0 auto' }}>
              <img src={project.image} alt={project.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
            </div>
          </div>

          <div className="project-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem', alignItems: 'start' }}>
            
            <div className="project-story">
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>El Desafío y la Solución</h3>
              <div className="rich-text" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
                {project.full_content || project.description || "Detalles del proyecto en construcción..."}
              </div>
            </div>

            <div className="project-sidebar glass-panel" style={{ padding: '2rem', borderRadius: '16px', position: 'sticky', top: '120px' }}>
              {project.website_url && (
                <a href={project.website_url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem', marginBottom: '2rem' }}>
                  Visitar Sitio Web <ExternalLink size={18} style={{ marginLeft: '10px' }} />
                </a>
              )}

              {project.metrics && project.metrics.length > 0 && (
                <div className="project-metrics">
                  <h4 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Resultados Destacados</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {project.metrics.map((metric, index) => (
                      <div key={index} className="metric-item">
                        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-secondary)', lineHeight: '1' }}>{metric.value}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="project-tags-sidebar" style={{ marginTop: '3rem' }}>
                <h4 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.2rem' }}>Tecnologías & Servicios</h4>
                <div className="portfolio-tags">
                  {(project.tags || []).map((tag, index) => (
                    <span key={index} className="portfolio-tag" style={{ background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#fff' }}>{tag}</span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <FooterCTA openModal={openModal} />
      {isModalOpen && <ContactModal onClose={closeModal} />}
    </div>
  );
};

export default ProjectDetails;
