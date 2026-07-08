import { ArrowUpRight } from 'lucide-react';
import './Portfolio.css';

const Portfolio = () => {
  const projects = [
    {
      title: "FinTech Scale",
      category: "Automatización CRM",
      metric: "+210%",
      metricLabel: "Incremento en Lead Velocity",
      image: "linear-gradient(to bottom right, #111111, #1a1a1a)"
    },
    {
      title: "Aura Cosmetics",
      category: "Headless E-commerce",
      metric: "0.8s",
      metricLabel: "Tiempo de Carga",
      image: "linear-gradient(to bottom right, #0a0a0a, #111111)"
    },
    {
      title: "B2B SaaS Growth",
      category: "Paid Media Architecture",
      metric: "4.2x",
      metricLabel: "ROAS Mantenido",
      image: "linear-gradient(to bottom right, #161616, #050505)"
    }
  ];

  return (
    <section id="portafolio" className="section v2-portfolio">
      <div className="container">
        
        <div className="showcase-header">
          <h2>Casos de <span className="text-gradient">Estudio</span></h2>
          <p>La infraestructura que construimos genera resultados medibles.</p>
        </div>

        <div className="v2-portfolio-grid">
          {projects.map((project, index) => (
            <div className="v2-portfolio-card" key={index}>
              <div className="v2-card-visual" style={{ background: project.image }}>
                {/* Minimalist Tech Overlay */}
                <div className="v2-card-overlay">
                  <div className="v2-metric-pill">
                    <strong>{project.metric}</strong>
                    <span>{project.metricLabel}</span>
                  </div>
                </div>
              </div>
              <div className="v2-card-content">
                <div>
                  <span className="v2-category">{project.category}</span>
                  <h3>{project.title}</h3>
                </div>
                <button className="v2-icon-btn">
                  <ArrowUpRight size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Portfolio;
