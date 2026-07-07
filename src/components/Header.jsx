import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ openModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="main-header">
      <div className="container header-container">
        <Link to="/" className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ textDecoration: 'none' }}>
          <span className="logo-text">Auto<span className="text-gradient">Scale</span></span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="main-nav desktop-only">
          <a href="#stats" className="nav-link" onClick={(e) => handleScroll(e, 'stats')}>Impacto</a>
          <a href="#servicios" className="nav-link" onClick={(e) => handleScroll(e, 'servicios')}>Servicios</a>
          <a href="#portafolio" className="nav-link" onClick={(e) => handleScroll(e, 'portafolio')}>Portafolio</a>
          <a href="#proceso" className="nav-link" onClick={(e) => handleScroll(e, 'proceso')}>Proceso</a>
          <a href="#casos" className="nav-link" onClick={(e) => handleScroll(e, 'casos')}>Casos</a>
        </nav>

        <div className="header-actions">
          <button 
            onClick={openModal} 
            className="btn btn-primary btn-sm desktop-only"
          >
            Iniciar Proyecto
          </button>
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMobileMenuOpen ? <X size={24} color="#1d1d1f" /> : <Menu size={24} color="#1d1d1f" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#stats" className="mobile-nav-link" onClick={(e) => handleScroll(e, 'stats')}>Impacto</a>
          <a href="#servicios" className="mobile-nav-link" onClick={(e) => handleScroll(e, 'servicios')}>Servicios</a>
          <a href="#portafolio" className="mobile-nav-link" onClick={(e) => handleScroll(e, 'portafolio')}>Portafolio</a>
          <a href="#proceso" className="mobile-nav-link" onClick={(e) => handleScroll(e, 'proceso')}>Proceso</a>
          <a href="#casos" className="mobile-nav-link" onClick={(e) => handleScroll(e, 'casos')}>Casos</a>
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
