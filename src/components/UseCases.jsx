import { Hospital, Building, GraduationCap, Briefcase, ShoppingBag } from 'lucide-react';
import './UseCases.css';

const UseCases = () => {
  const cases = [
    { title: "Clínicas", desc: "Web corporativa + Anuncios locales + Automatización de citas.", icon: <Hospital size={36} color="var(--accent-primary)" /> },
    { title: "Inmobiliarias", desc: "Catálogo de propiedades + Meta Ads + Calificación automática.", icon: <Building size={36} color="var(--accent-primary)" /> },
    { title: "Educación", desc: "Landing de cursos + Campañas de captación + Seguimiento de estudiantes.", icon: <GraduationCap size={36} color="var(--accent-primary)" /> },
    { title: "Servicios Profesionales", desc: "Portafolio Web + Ads de alcance + Agenda automática 24/7.", icon: <Briefcase size={36} color="var(--accent-primary)" /> },
    { title: "Ecommerce", desc: "Tienda online rápida + Retargeting + Atención por IA para ventas.", icon: <ShoppingBag size={36} color="var(--accent-primary)" /> }
  ];

  return (
    <section className="section use-cases-section" id="casos">
      <div className="container">
        <div className="section-title">
          <h2>Casos de <span className="text-gradient">uso</span></h2>
        </div>

        <div className="cases-grid">
          {cases.map((item, index) => (
            <div className={`use-case-card glass-panel animate-fade-in delay-${(index % 3 + 1) * 100}`} key={index}>
              <div className="case-icon" style={{ marginBottom: '1rem' }}>{item.icon}</div>
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
