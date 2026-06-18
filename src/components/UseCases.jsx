import './UseCases.css';

const UseCases = () => {
  const cases = [
    { title: "Clínicas", desc: "Web corporativa + Anuncios locales + Automatización de citas.", icon: "🏥" },
    { title: "Inmobiliarias", desc: "Catálogo de propiedades + Meta Ads + Calificación automática.", icon: "🏢" },
    { title: "Educación", desc: "Landing de cursos + Campañas de captación + Seguimiento de estudiantes.", icon: "🎓" },
    { title: "Servicios Profesionales", desc: "Portafolio Web + Ads de alcance + Agenda automática 24/7.", icon: "💼" },
    { title: "Ecommerce", desc: "Tienda online rápida + Retargeting + Atención por IA para ventas.", icon: "🛍️" }
  ];

  return (
    <section className="section use-cases-section" id="casos">
      <div className="container">
        <div className="section-title">
          <h2>Casos de <span className="text-gradient">uso</span></h2>
        </div>

        <div className="cases-grid">
          {cases.map((item, index) => (
            <div className="use-case-card glass-panel" key={index}>
              <div className="case-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
