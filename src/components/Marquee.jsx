import './Marquee.css';

const Marquee = () => {
  const items = [
    "Make", "Zapier", "n8n", "Shopify", "React", "Node.js", "Klaviyo", "Meta Ads", "Google Ads", "Supabase",
    // Duplicados para el efecto infinito suave
    "Make", "Zapier", "n8n", "Shopify", "React", "Node.js", "Klaviyo", "Meta Ads", "Google Ads", "Supabase"
  ];

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {items.map((item, index) => (
          <div key={index} className="marquee-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
