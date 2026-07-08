import { Globe, Zap, LayoutDashboard, Bot } from 'lucide-react';
import './Services.css';

// La oferta real de AutoScale (ver Documentos/Ventas/AutoScale_CATALOGO.md):
// web + automatización n8n + CRM + Recepcionista IA 24/7 (producto estrella).
const Services = ({ openModal }) => {
  return (
    <section id="servicios" className="section services">
      <div className="container">
        <div className="services-head">
          <span className="eyebrow">Qué construimos</span>
          <h2>Un sistema completo,<br />no otra página bonita.</h2>
        </div>

        <div className="services-grid">
          <article className="service-card">
            <div className="service-icon"><Globe size={26} /></div>
            <h3>Web que convierte</h3>
            <p>
              Rápida, optimizada para el celular y diseñada para una sola cosa:
              que el visitante te deje sus datos y te escriba.
            </p>
          </article>

          <article className="service-card">
            <div className="service-icon"><Zap size={26} /></div>
            <h3>Automatización</h3>
            <p>
              Cada lead recibe WhatsApp y correo al instante, sin que nadie
              lo toque. Recordatorios y seguimiento en piloto automático.
            </p>
          </article>

          <article className="service-card">
            <div className="service-icon"><LayoutDashboard size={26} /></div>
            <h3>CRM incluido</h3>
            <p>
              Todos tus clientes potenciales ordenados en un panel: quién escribió,
              en qué va cada uno y cuánta plata hay en juego.
            </p>
          </article>

          {/* Producto estrella — bloque de color (firma Alto Impacto) */}
          <article className="service-card featured">
            <div className="service-icon inverse"><Bot size={26} /></div>
            <h3>Recepcionista IA 24/7</h3>
            <p>
              Una inteligencia artificial atiende tu WhatsApp: responde al instante,
              agenda citas y recupera clientes dormidos. Día y noche.
            </p>
            <button className="btn btn-outline service-cta" onClick={openModal}>
              La quiero en mi negocio
            </button>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Services;
