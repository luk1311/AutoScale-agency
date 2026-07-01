import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header = ({ openModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="main-header">
      <div className="container header-container">
        <div className="logo">
          <span className="logo-text">Auto<span className="text-gradient">Scale</span></span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="main-nav desktop-only">
          <a href="#stats" className="nav-link">Impacto</a>
          <a href="#servicios" className="nav-link">Servicios</a>
          <a href="#portafolio" className="nav-link">Portafolio</a>
          <a href="#proceso" className="nav-link">Proceso</a>
          <a href="#casos" className="nav-link">Casos</a>
        </nav>

        <div className="header-actions">
          <button 
            onClick={openModal} 
            className="btn btn-primary btn-sm desktop-only"
          >
            Iniciar Proyecto
          </button>
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMobileMenuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#stats" className="mobile-nav-link" onClick={toggleMenu}>Impacto</a>
          <a href="#servicios" className="mobile-nav-link" onClick={toggleMenu}>Servicios</a>
          <a href="#portafolio" className="mobile-nav-link" onClick={toggleMenu}>Portafolio</a>
          <a href="#proceso" className="mobile-nav-link" onClick={toggleMenu}>Proceso</a>
          <a href="#casos" className="mobile-nav-link" onClick={toggleMenu}>Casos</a>
          <button 
            onClick={() => { toggleMenu(); openModal(); }} 
            className="btn btn-primary btn-mobile-cta"
          >
            Iniciar Proyecto
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
