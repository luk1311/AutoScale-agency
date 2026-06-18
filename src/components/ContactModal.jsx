import React, { useState } from 'react';
import './ContactModal.css';

const ContactModal = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Construir el mensaje de WhatsApp como respaldo y contacto directo
    const phoneNumber = "573218641721";
    const text = `¡Hola! Me interesa trabajar con ustedes. Aquí están mis datos:\n\n*Nombre:* ${formData.nombre}\n*WhatsApp:* ${formData.whatsapp}\n*Correo:* ${formData.correo}\n*Empresa:* ${formData.empresa}\n*Servicio de interés:* ${formData.servicio}\n\n*Descripción del proyecto:*\n${formData.descripcion}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      onClose(); // Cerrar el modal después de enviar
    }, 2000); // 2 segundos de retraso para mostrar la animación
  };

  // Prevenir que el clic dentro del modal lo cierre
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={handleModalClick}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {isSubmitting ? (
          <div className="success-message text-center animate-fade-in" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <h2>¡Generando tu enlace seguro!</h2>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Estamos preparando todo...</p>
            <div className="spinner" style={{ margin: '0 auto', width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1.5rem', color: 'var(--accent-primary)' }}>Redirigiéndote a nuestro WhatsApp...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
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
            Contactar por WhatsApp
          </button>
        </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
