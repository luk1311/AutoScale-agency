import { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ openModal }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`v2-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container v2-header-container">
        
        {/* Logo */}
        <a href="/" className="v2-logo">
          AutoScale<span className="dot"></span>
        </a>

        {/* Desktop Nav */}
        <nav className="v2-nav">
          <a href="#servicios" className="v2-nav-link">Servicios</a>
          <a href="#casos" className="v2-nav-link">Casos reales</a>
          <a href="#precios" className="v2-nav-link">Precios</a>
        </nav>

        {/* CTA */}
        <div className="v2-header-actions">
          <button className="btn btn-primary v2-cta" onClick={openModal}>
            Iniciar Proyecto
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
