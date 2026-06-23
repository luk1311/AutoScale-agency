import { Monitor, TrendingUp, Bot, Target, BarChart2, RefreshCw } from 'lucide-react';
import './Solution.css';

const Solution = () => {
  const features = [
    {
      title: "Desarrollo Web Premium",
      desc: "Landing pages y sitios web ultra rápidos, diseñados para cautivar y convertir visitantes.",
      icon: <Monitor size={36} color="var(--accent-primary)" />
    },
    {
      title: "Campañas en Meta Ads",
      desc: "Anuncios estratégicos en Facebook e Instagram para atraer tráfico altamente calificado.",
      icon: <TrendingUp size={36} color="var(--accent-primary)" />
    },
    {
      title: "Atención Automatizada",
      desc: "Asistentes de IA que responden, califican y agendan citas 24/7.",
      icon: <Bot size={36} color="var(--accent-primary)" />
    },
    {
      title: "Embudos de Venta",
      desc: "Sistemas integrados que transforman clics en clientes reales sin esfuerzo manual.",
      icon: <Target size={36} color="var(--accent-primary)" />
    },
    {
      title: "CRM Centralizado",
      desc: "Toda la información de prospectos y campañas organizada en un solo lugar.",
      icon: <BarChart2 size={36} color="var(--accent-primary)" />
    },
    {
      title: "Optimización Continua",
      desc: "Análisis de datos para mejorar el rendimiento de tus campañas y procesos constantemente.",
      icon: <RefreshCw size={36} color="var(--accent-primary)" />
    }
  ];

  return (
    <section className="section solution-section" id="solucion">
      <div className="container">
        <div className="section-title">
          <h2>La solución: un sistema que trabaja <span className="text-gradient">mientras tú duermes</span></h2>
          <p>
            Diseñamos ecosistemas digitales completos combinando Páginas Web, Meta Ads e Inteligencia Artificial para captar, atender y convertir clientes automáticamente.
          </p>
        </div>

        <div className="grid grid-cols-3">
          {features.map((feature, index) => (
            <div className={`glass-panel feature-card animate-fade-in delay-${(index % 3 + 1) * 100}`} key={index}>
              <div className="feature-icon" style={{ marginBottom: '1rem' }}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;
