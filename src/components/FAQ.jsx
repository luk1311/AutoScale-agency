import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

// Preguntas reales de prospectos (ver Documentos/Ventas/AutoScale_OBJECIONES.md).
const faqs = [
  {
    q: '¿En cuánto tiempo queda funcionando?',
    a: 'La web con automatización queda lista en días, no meses. La Recepcionista IA se entrena con la información de tu negocio (servicios, precios, horarios) y se conecta a tu WhatsApp en la misma semana.',
  },
  {
    q: 'Ya tengo Instagram y me escriben por ahí. ¿Para qué necesito esto?',
    a: 'Justo por eso. Hoy la gente te ve, te escribe… y se pierde entre mensajes. El sistema captura a cada interesado, le responde al instante y te lo deja ordenado en un panel. Tu Instagram no se reemplaza: se convierte en citas.',
  },
  {
    q: '¿Necesito saber de tecnología?',
    a: 'No. Nosotros montamos todo y tú solo usas WhatsApp y un panel muy simple. Si sabes usar Instagram, sabes usar esto.',
  },
  {
    q: '¿La IA va a contestar cosas raras a mis clientes?',
    a: 'No inventa nada: responde solo con la información de tu negocio (tus precios, tus horarios). Y si un cliente pide hablar con una persona, te pasa la conversación al instante.',
  },
  {
    q: '¿Qué pasa con mi número de WhatsApp?',
    a: 'Sigue siendo tuyo y sigues pudiendo escribir tú. La IA solo responde a quienes te escriben — nunca manda mensajes en frío ni a desconocidos.',
  },
  {
    q: '¿Cuánto cuesta y hay permanencia?',
    a: 'Los planes arrancan en $990.000 de montaje + mensualidad desde $220.000. Sin permanencia: si no te da resultados, lo cancelas. (Spoiler: con 2–3 clientes nuevos al mes ya se pagó solo.)',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section faq">
      <div className="container faq-container">
        <div className="faq-head">
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2>Lo que todos preguntan<br />antes de empezar.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className={`faq-item ${openIndex === i ? 'open' : ''}`}
            >
              <button className="faq-q" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                <h3>{f.q}</h3>
                <ChevronDown className="faq-chevron" size={22} strokeWidth={2.6} />
              </button>
              <div className="faq-a"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
