import './Services.css';

const Services = () => {
  const services = [
    {
      title: "Automatización Low-Code",
      description: "Conectamos tu ecosistema digital usando n8n, Make y Zapier. Eliminamos tareas repetitivas para que tu equipo se enfoque en el crecimiento.",
      icon: "⚡"
    },
    {
      title: "Desarrollo E-commerce",
      description: "Tiendas Shopify ultra-rápidas y optimizadas para conversión. Custom themes, integraciones complejas y headless commerce.",
      icon: "🛍️"
    },
    {
      title: "Paid Media & Growth",
      description: "Estrategias omnicanal en Meta y Google Ads. Escalamos tu facturación con creativos data-driven y media buying de precisión.",
      icon: "📈"
    },
    {
      title: "CRO & UI/UX Premium",
      description: "Diseño que convierte. Interfaces inmersivas, branding coherente y auditorías de usabilidad que reducen el abandono del carrito.",
      icon: "✨"
    },
    {
      title: "CRM & Email Marketing",
      description: "Flujos de retención hiper-personalizados en Klaviyo y Hubspot. Convertimos clientes de una sola vez en compradores recurrentes.",
      icon: "✉️"
    },
    {
      title: "Arquitectura de Software",
      description: "Sistemas backend robustos y APIs a medida. Escalabilidad asegurada con React, Node.js y bases de datos optimizadas.",
      icon: "⚙️"
    }
  ];

  return (
    <section id="servicios" className="section services-section">
      <div className="bg-glow blue" style={{ top: '20%', left: '-20%', width: '700px', height: '700px' }}></div>
      <div className="bg-glow purple" style={{ bottom: '10%', right: '-10%', width: '600px', height: '600px' }}></div>
      
      <div className="container">
        <div className="section-title">
          <h2>Nuestro <span className="text-gradient">Arsenal Técnico</span></h2>
          <p>No somos una agencia tradicional. Somos ingenieros de crecimiento construyendo la maquinaria de tu negocio.</p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className={`service-card glass-panel delay-${(index % 3 + 1) * 100}`}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
