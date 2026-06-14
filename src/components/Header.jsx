import React from 'react';
import './Header.css';

const Header = ({ openModal }) => {
  return (
    <header className="main-header">
      <div className="container header-container">
        <div className="logo">
          <span className="logo-text">Auto<span className="text-gradient">Scale</span></span>
        </div>
        <button 
          onClick={openModal} 
          className="btn btn-primary btn-sm"
        >
          Iniciar Proyecto
        </button>
      </div>
    </header>
  );
};

export default Header;
