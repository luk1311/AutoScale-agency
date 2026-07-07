import { Workflow, ShoppingCart, BarChart, Layout, Mail, Server, ArrowRight } from 'lucide-react';
import './Services.css';

const Services = () => {
  const services = [
    {
      title: "Automatización Low-Code",
      description: "Conectamos tu ecosistema digital usando n8n, Make y Zapier. Eliminamos tareas repetitivas para que tu equipo se enfoque en el crecimiento.",
      icon: "⚡",
      visual: (
        <div className="bento-visual automation-flow">
          <div className="node n1"><Mail size={16}/></div>
          <div className="line l1"></div>
          <div className="node n2"><Workflow size={16}/></div>
          <div className="line l2"></div>
          <div className="node n3"><Server size={16}/></div>
        </div>
      )
    },
    {
      title: "Desarrollo E-commerce",
      description: "Tiendas Shopify ultra-rápidas y optimizadas para conversión. Custom themes, integraciones complejas y headless commerce.",
      icon: "🛍️",
      visual: (
        <div className="bento-visual ecommerce-chart">
          <div className="bar b1"></div>
          <div className="bar b2"></div>
          <div className="bar b3"></div>
          <div className="bar b4"></div>
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
        <div className="bento-visual email-flow">
          <div className="email-pill">Welcome Series</div>
          <div className="email-pill">Abandoned Cart</div>
        </div>
      )
    },
    {
      title: "Arquitectura de Software",
      description: "Sistemas backend robustos y APIs a medida. Escalabilidad asegurada con React, Node.js y bases de datos optimizadas.",
      icon: "⚙️",
      visual: (
        <div className="bento-visual code-block">
          <div className="code-line w-75"></div>
          <div className="code-line w-50"></div>
          <div className="code-line w-100"></div>
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
            <div key={index} className={`service-card delay-${(index % 3 + 1) * 100}`}>
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
