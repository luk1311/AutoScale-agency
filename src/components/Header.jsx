import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="container header-container">
        <div className="logo">
          <span className="logo-text">Auto<span className="text-gradient">Scale</span></span>
        </div>
        <a 
          href="https://wa.me/5211234567890" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-primary btn-sm"
        >
          Iniciar Proyecto
        </a>
      </div>
    </header>
  );
};

export default Header;
