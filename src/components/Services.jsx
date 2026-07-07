import { Workflow, ShoppingCart, BarChart, Layout, Mail, Server, ArrowRight } from 'lucide-react';
import './Services.css';

const Services = () => {
  const services = [
    {
      title: "Automatización Low-Code",
      description: "Conectamos tu ecosistema digital usando n8n, Make y Zapier. Eliminamos tareas repetitivas para que tu equipo se enfoque en el crecimiento.",
      icon: "⚡",
      visual: (
        <div className="bento-visual automation-canvas">
          <div className="node-grid">
            <div className="canvas-node n-trigger">
              <div className="node-icon"><Mail size={16}/></div>
              <span>Nuevo Lead</span>
            </div>
            <div className="canvas-path p1"></div>
            
            <div className="canvas-node n-ai">
              <div className="node-icon"><Workflow size={16}/></div>
              <span>AI Agent</span>
            </div>
            <div className="canvas-path p2"></div>
            <div className="canvas-path p3"></div>
            
            <div className="canvas-node n-crm">
              <div className="node-icon"><Server size={16}/></div>
              <span>HubSpot</span>
            </div>
            
            <div className="canvas-node n-slack">
              <div className="node-icon"><Layout size={16}/></div>
              <span>Notificar</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Desarrollo E-commerce",
      description: "Tiendas Shopify ultra-rápidas y optimizadas para conversión. Custom themes, integraciones complejas y headless commerce.",
      icon: "🛍️",
      visual: (
        <div className="bento-visual ecommerce-window">
          <div className="browser-mockup">
            <div className="browser-header">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
            <div className="browser-body">
              <div className="product-skeleton"></div>
              <div className="skeleton-lines">
                <div className="s-line w-80"></div>
                <div className="s-line w-40"></div>
              </div>
              <div className="btn-skeleton"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Paid Media & Growth",
      description: "Estrategias omnicanal en Meta y Google Ads. Escalamos tu facturación con creativos data-driven y media buying de precisión.",
      icon: "📈",
      visual: null
    },
    {
      title: "CRO & UI/UX Premium",
      description: "Diseño que convierte. Interfaces inmersivas, branding coherente y auditorías de usabilidad que reducen el abandono del carrito.",
      icon: "✨",
      visual: null
    },
    {
      title: "CRM & Email Marketing",
      description: "Flujos de retención hiper-personalizados en Klaviyo y Hubspot. Convertimos clientes de una sola vez en compradores recurrentes.",
      icon: "✉️",
      visual: (
        <div className="bento-visual email-campaign">
          <div className="email-card c1">
            <div className="e-header"><div className="e-avatar"></div><div className="e-line"></div></div>
            <div className="e-body"><div className="e-box"></div></div>
          </div>
          <div className="email-card c2">
            <div className="e-header"><div className="e-avatar"></div><div className="e-line"></div></div>
            <div className="e-body"><div className="e-box"></div></div>
          </div>
        </div>
      )
    },
    {
      title: "Arquitectura de Software",
      description: "Sistemas backend robustos y APIs a medida. Escalabilidad asegurada con React, Node.js y bases de datos optimizadas.",
      icon: "⚙️",
      visual: (
        <div className="bento-visual server-stack">
           <div className="server-rack"><div className="lights"><span className="l-on"></span><span className="l-on"></span></div><div className="s-line"></div></div>
           <div className="server-rack"><div className="lights"><span className="l-on"></span><span className="l-off"></span></div><div className="s-line"></div></div>
           <div className="server-rack r-active"><div className="lights"><span className="l-blink"></span><span className="l-on"></span></div><div className="s-line"></div></div>
        </div>
      )
    }
  ];

  return (
    <section id="servicios" className="section services-section">
      
      <div className="container">
        <div className="section-title">
          <h2>Nuestro <span className="text-gradient">Arsenal Técnico</span></h2>
          <p>No somos una agencia tradicional. Somos ingenieros de crecimiento construyendo la maquinaria de tu negocio.</p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className={`service-card delay-${(index % 3 + 1) * 100} ${service.visual ? 'has-visual' : ''}`}>
              <div className="service-content">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              {service.visual && service.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
