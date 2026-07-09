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
    let alive = true;

    const load = async () => {
      if (!supabase) { if (alive) setLoading(false); return; }
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('id', id)
        .single();
      if (!alive) return;
      if (!error) setProject(data);
      setLoading(false);
    };

    load();
    return () => { alive = false; };
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="pf-page-state" style={{ minHeight: '100vh' }}>
        <Loader2 size={38} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="app-container">
        <Header openModal={openModal} />
        <main className="pf-page">
          <div className="container pf-page-state">
            <h2>Proyecto no encontrado</h2>
            <Link to="/portafolio" className="btn btn-outline">Volver al portafolio</Link>
          </div>
        </main>
      </div>
    );
  }

  const href = project.website_url
    ? (project.website_url.startsWith('http') ? project.website_url : `https://${project.website_url}`)
    : null;

  return (
    <div className="app-container">
      <Header openModal={openModal} />

      <main className="pf-page">
        <div className="container">
          <Link to="/portafolio" className="pf-page-back"><ArrowLeft size={16} /> Volver al portafolio</Link>

          <div className="pd-hero">
            <span className="eyebrow">{project.category}</span>
            <h1 className="pd-title">{project.title}</h1>
          </div>

          {project.image && (
            <div className="pd-image">
              <img src={project.image} alt={project.title} />
            </div>
          )}

          {project.description && <p className="pd-quote">{project.description}</p>}

          <div className="pd-grid">
            {project.full_content && (
              <div className="pd-story">
                <h3>El desafío y la solución</h3>
                <p>{project.full_content}</p>
              </div>
            )}

            <aside className={`pd-sidebar ${!project.full_content ? 'pd-sidebar-solo' : ''}`}>
              {href && (
                <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary pd-visit">
                  Visitar sitio web <ExternalLink size={16} />
                </a>
              )}
              {project.tags && project.tags.length > 0 && (
                <div className="pd-tags">
                  <h4>Tecnologías y servicios</h4>
                  <div className="pd-tags-list">
                    {project.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <FooterCTA openModal={openModal} />
      {isModalOpen && <ContactModal onClose={closeModal} />}
    </div>
  );
};

export default ProjectDetails;
