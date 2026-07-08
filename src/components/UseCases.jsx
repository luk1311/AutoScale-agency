import { useState } from 'react';
import { ShoppingCart, LayoutTemplate, Briefcase } from 'lucide-react';
import './UseCases.css';

const UseCases = () => {
  const [activeTab, setActiveTab] = useState(0);

  const cases = [
    {
      id: "ecommerce",
      icon: <ShoppingCart size={24} />,
      title: "E-commerce",
      headline: "Operaciones Headless para tiendas de alto volumen.",
      description: "Sincronizamos inventarios multicanal, automatizamos recuperación de carritos abandonados mediante secuencias omnichannel y conectamos pasarelas de pago con ERPs sin intervención humana.",
      tags: ["Shopify Plus", "ERP Sync", "Omnichannel"]
    },
    {
      id: "infoproductos",
      icon: <LayoutTemplate size={24} />,
      title: "Info-productos",
      headline: "Embudos de lanzamiento que escalan sin romperse.",
      description: "Integramos plataformas de cursos, automatizamos la entrega de credenciales, y construimos sistemas de retención impulsados por AI para reducir el churn rate y aumentar el LTV.",
      tags: ["Funnels", "LTV Boost", "Kajabi/Hotmart"]
    },
    {
      id: "agencias",
      icon: <Briefcase size={24} />,
      title: "Agencias B2B",
      headline: "Infraestructura para escalar a $100k/mo.",
      description: "Automatizamos la generación y cualificación de leads, el onboarding de clientes y la gestión de proyectos. Libera a tu equipo del trabajo manual para que se enfoque en la estrategia.",
      tags: ["Lead Gen", "Onboarding", "CRM Automation"]
    }
  ];

  return (
    <section id="use-cases" className="section v2-usecases">
      <div className="container">
        
        <div className="showcase-header">
          <h2>Soluciones por <span className="text-gradient">Industria</span></h2>
          <p>Sistemas diseñados a la medida de tu modelo de negocio.</p>
        </div>

        <div className="v2-usecases-container">
          
          {/* Tabs Navigation */}
          <div className="v2-tabs-nav">
            {cases.map((useCase, index) => (
              <button 
                key={useCase.id}
                className={`v2-tab-btn ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                {useCase.icon}
                <span>{useCase.title}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="v2-tab-content-wrapper">
            {cases.map((useCase, index) => (
              <div 
                key={useCase.id} 
                className={`v2-tab-pane ${activeTab === index ? 'active' : ''}`}
              >
                <div className="v2-pane-inner">
                  <h3>{useCase.headline}</h3>
                  <p>{useCase.description}</p>
                  
                  <div className="v2-pane-tags">
                    {useCase.tags.map(tag => (
                      <span key={tag} className="v2-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default UseCases;
