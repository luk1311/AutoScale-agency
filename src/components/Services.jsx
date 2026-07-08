import { useEffect, useState, useRef } from 'react';
import { Workflow, Mail, Server, Layout } from 'lucide-react';
import './Services.css';

const Services = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const textRefs = useRef([]);
  const containerRef = useRef(null);

  const services = [
    {
      title: "Automatización Low-Code",
      description: "Conectamos tu ecosistema digital usando n8n, Make y Zapier. Eliminamos tareas repetitivas para que tu equipo se enfoque en el crecimiento.",
      icon: "⚡",
      visual: (
        <div className="bento-visual automation-canvas">
          <div className="node-grid">
            <div className="canvas-node n-trigger"><div className="node-icon"><Mail size={16}/></div><span>Nuevo Lead</span></div>
            <div className="canvas-path p1"></div>
            <div className="canvas-node n-ai"><div className="node-icon"><Workflow size={16}/></div><span>AI Agent</span></div>
            <div className="canvas-path p2"></div>
            <div className="canvas-path p3"></div>
            <div className="canvas-node n-crm"><div className="node-icon"><Server size={16}/></div><span>HubSpot</span></div>
            <div className="canvas-node n-slack"><div className="node-icon"><Layout size={16}/></div><span>Notificar</span></div>
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
            <div className="browser-header"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div>
            <div className="browser-body">
              <div className="product-skeleton"></div>
              <div className="skeleton-lines"><div className="s-line w-80"></div><div className="s-line w-40"></div></div>
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
      visual: (
        <div className="bento-visual abstract-gradient">
           <div className="glow-orb orb-1"></div>
           <div className="glow-orb orb-2"></div>
           <div className="glass-chart">
              <div className="c-bar h-1"></div><div className="c-bar h-2"></div><div className="c-bar h-3"></div><div className="c-bar h-4"></div>
           </div>
        </div>
      )
    },
    {
      title: "CRO & UI/UX Premium",
      description: "Diseño que convierte. Interfaces inmersivas, branding coherente y auditorías de usabilidad que reducen el abandono del carrito.",
      icon: "✨",
      visual: (
        <div className="bento-visual ui-mock">
           <div className="ui-card">
              <div className="ui-circle"></div>
              <div className="ui-lines"><div className="ul"></div><div className="ul"></div></div>
           </div>
           <div className="ui-cursor">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 3.21V20.8C5.5 21.45 6.27 21.8 6.75 21.36L11.44 17.06H17.5C18.33 17.06 19 16.39 19 15.56V3.21C19 2.38 18.33 1.71 17.5 1.71H7C6.17 1.71 5.5 2.38 5.5 3.21Z" fill="#111113"/></svg>
           </div>
        </div>
      )
    },
    {
      title: "CRM & Email Marketing",
      description: "Flujos de retención hiper-personalizados en Klaviyo y Hubspot. Convertimos clientes de una sola vez en compradores recurrentes.",
      icon: "✉️",
      visual: (
        <div className="bento-visual email-campaign">
          <div className="email-card c1"><div className="e-header"><div className="e-avatar"></div><div className="e-line"></div></div><div className="e-body"><div className="e-box"></div></div></div>
          <div className="email-card c2"><div className="e-header"><div className="e-avatar"></div><div className="e-line"></div></div><div className="e-body"><div className="e-box"></div></div></div>
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

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.5 // Requiere que al menos el 50% esté visible para activar
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.dataset.index);
          setActiveIndex(index);
        }
      });
    }, observerOptions);

    textRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="servicios" className="section vg-showcase-section">
      <div className="container">
        <div className="showcase-header">
          <h2>Nuestro <span className="text-gradient">Arsenal Técnico</span></h2>
          <p>No somos una agencia tradicional. Somos ingenieros de crecimiento construyendo la maquinaria de tu negocio.</p>
        </div>
        
        {/* El Menú Estilo Videojuego - Altura fija y dividida exactamente a la mitad */}
        <div className="vg-menu-container">
          
          {/* Columna Izquierda: El Carrusel Snap */}
          <div className="vg-text-carousel" ref={containerRef}>
            <div className="vg-carousel-padding-top"></div>
            {services.map((service, index) => (
              <div 
                key={index}
                data-index={index}
                ref={el => textRefs.current[index] = el}
                className={`vg-menu-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => {
                  textRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <div className="vg-item-icon">{service.icon}</div>
                <div className="vg-item-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
            <div className="vg-carousel-padding-bottom"></div>
          </div>

          {/* Columna Derecha: El Visor Dinámico */}
          <div className="vg-visual-viewport">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`vg-visual-pane ${activeIndex === index ? 'active' : ''}`}
              >
                {service.visual}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Services;
