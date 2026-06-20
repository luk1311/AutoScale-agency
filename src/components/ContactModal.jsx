import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './ContactModal.css';

// Número de WhatsApp usado como respaldo si el webhook no responde.
const WHATSAPP_PHONE = '573218641721';

// URL del webhook del orquestador (n8n / Make / Zapier) que dispara las
// automatizaciones: guardar el lead, email automático y WhatsApp API.
// Se configura en .env.local como VITE_LEAD_WEBHOOK_URL (ver AUTOMATIZACIONES.md).
const WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK_URL;

const ContactModal = ({ onClose }) => {
  // 'idle' | 'submitting' | 'success' | 'whatsapp'
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    correo: '',
    empresa: '',
    servicio: 'Landing Page + IA',
    descripcion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Construye la URL de WhatsApp con el mensaje pre-rellenado (respaldo / contacto directo).
  const buildWhatsappUrl = () => {
    const text = `¡Hola! Me interesa trabajar con ustedes. Aquí están mis datos:\n\n*Nombre:* ${formData.nombre}\n*WhatsApp:* ${formData.whatsapp}\n*Correo:* ${formData.correo}\n*Empresa:* ${formData.empresa}\n*Servicio de interés:* ${formData.servicio}\n\n*Descripción del proyecto:*\n${formData.descripcion}`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    // Datos del lead + metadatos útiles para el flujo no-code.
    const payload = {
      ...formData,
      origen: 'landing-autoscale',
      fecha: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : ''
    };

    try {
      // 1. Guardar en Supabase (si está configurado)
      if (supabase) {
        const { error: supabaseError } = await supabase
          .from('leads')
          .insert([
            {
              nombre: payload.nombre,
              whatsapp: payload.whatsapp,
              correo: payload.correo,
              empresa: payload.empresa,
              servicio: payload.servicio,
              descripcion: payload.descripcion,
              origen: payload.origen,
              url: payload.url
              // La fecha (created_at) suele ser automática en Supabase
            }
          ]);
        
        if (supabaseError) {
          console.error('Error guardando en Supabase:', supabaseError);
          // Opcionalmente lanzar error si queremos que falle todo si Supabase falla
          // throw supabaseError;
        } else {
          console.log('Lead guardado exitosamente en Supabase');
        }
      } else {
        console.warn('Supabase no está configurado. Saltando inserción en BD.');
      }

      // 2. Disparar el flujo de automatización (Google Sheets / Email / WhatsApp)
      if (!WEBHOOK_URL) {
        throw new Error('VITE_LEAD_WEBHOOK_URL no está configurado');
      }

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`El webhook respondió con estado ${res.status}`);
      }

      // El flujo (n8n/Make/Zapier) ya procesó el lead.
      setStatus('success');
    } catch (err) {
      // Respaldo: no perdemos el lead. Lo enviamos por WhatsApp manual.
      console.error('Fallo el envío al webhook, usando WhatsApp como respaldo:', err);
      window.open(buildWhatsappUrl(), '_blank', 'noopener,noreferrer');
      setStatus('whatsapp');
    }
  };

  // Prevenir que el clic dentro del modal lo cierre
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={handleModalClick}>
        <button className="modal-close" onClick={onClose}>&times;</button>

        {status === 'submitting' && (
          <div className="success-message text-center animate-fade-in" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <h2>Enviando tu solicitud...</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Estamos registrando tus datos de forma segura.</p>
            <div className="spinner" style={{ margin: '0 auto', width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === 'success' && (
          <div className="success-message text-center animate-fade-in" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <div className="success-check">✓</div>
            <h2>¡Solicitud <span className="text-gradient">recibida</span>!</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Gracias, {formData.nombre.split(' ')[0] || 'crack'}. Te enviamos un correo de confirmación a <strong>{formData.correo}</strong> y nuestro equipo te contactará por WhatsApp muy pronto.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
          </div>
        )}

        {status === 'whatsapp' && (
          <div className="success-message text-center animate-fade-in" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <h2>Te redirigimos a <span className="text-gradient">WhatsApp</span></h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              Abrimos una conversación con tus datos listos para enviar. Si no se abrió automáticamente, usa el botón:
            </p>
            <a className="btn btn-primary" href={buildWhatsappUrl()} target="_blank" rel="noopener noreferrer">
              Abrir WhatsApp
            </a>
          </div>
        )}

        {status === 'idle' && (
          <>
            <h2>Inicia tu <span className="text-gradient">Proyecto</span></h2>
            <p>Déjanos tus datos para entender mejor lo que necesitas antes de hablar.</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input type="text" id="nombre" name="nombre" required value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan Pérez" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="whatsapp">WhatsApp *</label>
                  <input type="tel" id="whatsapp" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} placeholder="+57 300 000 0000" />
                </div>

                <div className="form-group">
                  <label htmlFor="correo">Correo electrónico *</label>
                  <input type="email" id="correo" name="correo" required value={formData.correo} onChange={handleChange} placeholder="juan@tuempresa.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="empresa">Empresa / Negocio *</label>
                  <input type="text" id="empresa" name="empresa" required value={formData.empresa} onChange={handleChange} placeholder="Nombre de tu negocio" />
                </div>

                <div className="form-group">
                  <label htmlFor="servicio">Servicio de interés *</label>
                  <select id="servicio" name="servicio" value={formData.servicio} onChange={handleChange} required>
                    <option value="Landing Page + IA">Landing Page + IA</option>
                    <option value="Solo Asistente IA">Solo Asistente IA (Chatbot)</option>
                    <option value="Campañas de Meta Ads">Campañas en Meta Ads</option>
                    <option value="Estrategia Integral">Estrategia Integral (Todo)</option>
                    <option value="Otro">Otro / No estoy seguro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Describe tu proyecto *</label>
                <textarea id="descripcion" name="descripcion" required value={formData.descripcion} onChange={handleChange} rows="3" placeholder="Cuéntanos un poco sobre lo que te gustaría lograr..." />
              </div>

              <button type="submit" className="btn btn-primary btn-submit">
                Enviar solicitud
              </button>
              <p className="form-fallback-note">
                ¿Prefieres escribir directo?{' '}
                <a href={buildWhatsappUrl()} target="_blank" rel="noopener noreferrer">Contáctanos por WhatsApp</a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
