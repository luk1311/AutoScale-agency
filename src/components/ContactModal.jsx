import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { trackLead } from '../lib/metaPixel';
import { getAttribution } from '../lib/attribution';
import './ContactModal.css';

// Número de WhatsApp usado como respaldo si no se puede guardar el lead.
const WHATSAPP_PHONE = '573218641721';

// Tiempo máximo (ms) que esperamos al insert antes de caer al respaldo de WhatsApp.
const INSERT_TIMEOUT_MS = 12000;

const ContactModal = ({ onClose }) => {
  const [status, setStatus] = useState('idle');
  const [formError, setFormError] = useState('');
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
    if (status === 'submitting') return; // Evita envíos dobles

    if (!formData.nombre || !formData.whatsapp || !formData.correo || !formData.empresa || !formData.descripcion) {
      setFormError('Por favor, completa todos los campos obligatorios (*)');
      return;
    }
    setFormError('');

    setStatus('submitting');

    // Supabase es la única fuente de verdad. Al insertar el lead, un Database
    // Webhook de Supabase dispara n8n (email + WhatsApp). El frontend NO llama
    // a n8n directamente: así no hay doble escritura ni "éxito" falso.
    if (!supabase) {
      console.error('Supabase no está configurado. Usando WhatsApp como respaldo.');
      window.open(buildWhatsappUrl(), '_blank', 'noopener,noreferrer');
      setStatus('whatsapp');
      return;
    }

    // event_id compartido Pixel↔CAPI: el navegador dispara el Lead con este ID y
    // n8n lo reenvía por CAPI con el mismo valor → Meta deduplica (no cuenta doble).
    const eventId = crypto.randomUUID();
    // Origen del clic (fbclid/UTMs/_fbp) capturado al cargar la landing.
    const attribution = getAttribution();

    try {
      const insert = supabase.from('leads').insert([
        {
          nombre: formData.nombre,
          whatsapp: formData.whatsapp,
          correo: formData.correo,
          empresa: formData.empresa,
          servicio: formData.servicio,
          descripcion: formData.descripcion,
          status: 'nuevo',
          origen: 'landing-autoscale',
          url: typeof window !== 'undefined' ? window.location.href : '',
          // Medición/atribución para Meta (n8n los usa para CAPI).
          meta_event_id: eventId,
          ...attribution
          // created_at lo gestiona Supabase automáticamente
        }
      ]);

      // Timeout: si la red/BD cuelga, no dejamos el modal atascado en "enviando".
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tiempo de espera agotado')), INSERT_TIMEOUT_MS)
      );

      const { error } = await Promise.race([insert, timeout]);
      if (error) throw error;

      // El lead quedó guardado. Email/WhatsApp los dispara Supabase → n8n.
      setStatus('success');

      // Conversión (Lead) al Pixel con el MISMO eventId que reenviará CAPI.
      trackLead({ eventId, content_name: formData.servicio });
    } catch (err) {
      // Respaldo: no perdemos el lead. Solo llegamos aquí si Supabase falló,
      // por lo que NO hay duplicado: el lead no se guardó.
      console.error('Fallo al guardar en Supabase, usando WhatsApp como respaldo:', err);
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
              Gracias, {formData.nombre.split(' ')[0] || 'crack'}. En breve te llegará un correo de confirmación a <strong>{formData.correo}</strong> y nuestro equipo te contactará por WhatsApp.
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

            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              {formError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '0.5rem' }}>
                  {formError}
                </div>
              )}
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
