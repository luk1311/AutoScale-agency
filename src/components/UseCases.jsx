import { Scissors, Sparkles, Home, HeartPulse } from 'lucide-react';
import './UseCases.css';

// Nichos reales a los que AutoScale vende hoy.
const niches = [
  {
    icon: <Scissors size={22} />,
    title: 'Barberías',
    pain: 'Turnos que se pierden en el chat',
    win: 'Reservas solas por WhatsApp mientras cortas.',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'Uñas, belleza y spa',
    pain: 'DM saturado y citas sin confirmar',
    win: 'Agenda llena y recordatorios automáticos.',
  },
  {
    icon: <Home size={22} />,
    title: 'Constructoras e inmobiliario',
    pain: 'Interesados que se enfrían sin seguimiento',
    win: 'Cotizador + CRM que no deja escapar un lead.',
  },
  {
    icon: <HeartPulse size={22} />,
    title: 'Clínicas y consultorios',
    pain: 'Inasistencias que cuestan plata',
    win: 'Confirmación y reprogramación sin llamadas.',
  },
];

const UseCases = () => {
  return (
    <section id="para-quien" className="section usecases">
      <div className="container">
        <div className="usecases-head">
          <span className="eyebrow">Para quién</span>
          <h2>Hecho para negocios<br />que viven de sus citas.</h2>
        </div>

        <div className="niche-grid">
          {niches.map((n) => (
            <article className="niche-card" key={n.title}>
              <div className="niche-top">
                <span className="niche-icon">{n.icon}</span>
                <h3>{n.title}</h3>
              </div>
              <p className="niche-pain">{n.pain}</p>
              <p className="niche-win">→ {n.win}</p>
            </article>
          ))}
        </div>

        <p className="niche-note">
          ¿Otro tipo de negocio? Si tus clientes te escriben por WhatsApp, esto funciona para ti.
        </p>
      </div>
    </section>
  );
};

export default UseCases;
