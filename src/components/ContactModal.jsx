import React, { useState } from 'react';
import './ContactModal.css';

const ContactModal = ({ onClose }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construir el mensaje de WhatsApp
    const phoneNumber = "573218641721";
    const text = `¡Hola! Me interesa trabajar con ustedes. Aquí están mis datos:

*Nombre:* ${formData.nombre}
*WhatsApp:* ${formData.whatsapp}
*Correo:* ${formData.correo}
*Empresa:* ${formData.empresa}
*Servicio de interés:* ${formData.servicio}

*Descripción del proyecto:*
${formData.descripcion}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
    onClose(); // Cerrar el modal después de enviar
  };

  // Prevenir que el clic dentro del modal lo cierre
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={handleModalClick}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
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
      </div>
    </div>
  );
};

export default ContactModal;
