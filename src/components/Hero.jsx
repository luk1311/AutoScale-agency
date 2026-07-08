import { CalendarCheck, Zap } from 'lucide-react';
import './Hero.css';

const Hero = ({ openModal }) => {
  return (
    <section className="hero">
      <div className="hero-grid-bg" aria-hidden="true" />

      <div className="container hero-inner">
        {/* Columna izquierda: el mensaje */}
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">Agencia web · Automatización · IA</span>

          <h1 className="hero-title">
            Construimos la web<br />
            que <span className="hl">vende por ti.</span>
          </h1>

          <p className="hero-sub">
            Diseñamos tu sitio, lo conectamos a un CRM y ponemos una
            <strong> recepcionista con IA en tu WhatsApp</strong> que responde,
            agenda y hace seguimiento — las 24 horas.
          </p>

          <div className="hero-cta">
            <button className="btn btn-primary" onClick={openModal}>Agenda una demo gratis</button>
            <a className="btn btn-outline" href="#casos">Ver casos reales</a>
          </div>

          <p className="hero-note">Sin permanencia · Demo con el nombre de tu negocio</p>
        </div>

        {/* Columna derecha: el sistema trabajando (firma visual) */}
        <div className="hero-panel" aria-label="Demostración del sistema atendiendo un cliente">
          <div className="panel-window">
            <div className="panel-titlebar">
              <span className="panel-dot" /><span className="panel-dot" /><span className="panel-dot" />
              <span className="panel-title">AutoScale · Sistema en vivo</span>
              <span className="panel-live"><span className="live-dot" />ACTIVO</span>
            </div>

            <div className="panel-chat">
              <div className="chat-bubble in anim-1">
                ¿Tienen turno para mañana? 💅
                <span className="chat-time">21:47</span>
              </div>
              <div className="chat-bubble out anim-2">
                ¡Claro! Tengo 10:30 am o 4:00 pm. ¿Cuál te sirve?
                <span className="chat-tag"><Zap size={11} /> IA · respondió en 3 seg</span>
              </div>
              <div className="chat-bubble in anim-3">
                A las 10:30 ✨
                <span className="chat-time">21:48</span>
              </div>

              <div className="panel-event anim-4">
                <span className="event-icon"><CalendarCheck size={15} /></span>
                <div>
                  <b>Cita agendada</b>
                  <span className="event-meta">mañana · 10:30 am · guardada en tu CRM</span>
                </div>
              </div>
            </div>

            <div className="panel-metrics anim-5">
              <div className="metric"><b>12</b><span>leads hoy</span></div>
              <div className="metric"><b>&lt;1 min</b><span>respuesta</span></div>
              <div className="metric"><b>24/7</b><span>siempre activo</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
