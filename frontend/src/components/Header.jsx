import React from 'react';
// uncomment when adding styling
//import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="app-header-content">
        <span className="app-header-logo">SANAHAKU</span>
        <span className="app-header-subtitle">Finnish pronunciation finder</span>
        <span className="app-header-description">Uses YouTube subtitles to find real pronunciation in context</span>
      </div>
    </header>
  );
}

export default Header;