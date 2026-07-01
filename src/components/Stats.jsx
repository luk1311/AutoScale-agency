import './Stats.css';

const Stats = () => {
  const stats = [
    { label: "En Ventas Generadas", value: "+$12M" },
    { label: "Sistemas Implementados", value: "85+" },
    { label: "Horas Ahorradas / Mes", value: "5,000+" },
    { label: "Automatización", value: "24/7" },
  ];

  return (
    <section id="stats" className="section stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card glass-panel delay-100">
              <h3 className="stat-value text-gradient">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
