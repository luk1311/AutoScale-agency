import { Code, Megaphone, Sparkles, MessageCircle, PenTool, Workflow, LineChart } from 'lucide-react';
import './TechStack.css';

const TechStack = () => {
  const techGroups = [
    {
      category: "Desarrollo & Diseño",
      items: [
        { name: "Desarrollo Web (React)", icon: <Code size={18} /> },
        { name: "UI/UX Premium", icon: <PenTool size={18} /> }
      ]
    },
    {
      category: "IA & Automatización",
      items: [
        { name: "Agentes de IA", icon: <Sparkles size={18} /> },
        { name: "Workflows con n8n", icon: <Workflow size={18} /> },
        { name: "WhatsApp API", icon: <MessageCircle size={18} /> }
      ]
    },
    {
      category: "Growth & Ventas",
      items: [
        { name: "Meta Ads Manager", icon: <Megaphone size={18} /> },
        { name: "Embudos de Venta", icon: <LineChart size={18} /> }
      ]
    }
  ];

  return (
    <section className="section tech-section" id="tecnologia">
      <div className="container text-center">
        <div className="section-title">
          <h2>Tecnología <span className="text-gradient">Empresarial</span></h2>
          <p>Implementamos soluciones utilizando tecnologías modernas y escalables. Todo configurado y gestionado por nuestro equipo.</p>
        </div>

        <div className="tech-groups-wrapper">
          {techGroups.map((group, groupIndex) => (
            <div className="tech-group glass-panel" key={groupIndex} style={{ animationDelay: `${groupIndex * 150}ms` }}>
              <h3 className="tech-group-title">{group.category}</h3>
              <div className="tech-group-items">
                {group.items.map((tech, itemIndex) => (
                  <div className="tech-item-clean" key={itemIndex}>
                    <span className="tech-icon-clean">{tech.icon}</span>
                    <span className="tech-name-clean">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="tech-note glass-panel">
          <p>No necesitas conocimientos técnicos. <span>Nosotros nos encargamos de todo.</span></p>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
