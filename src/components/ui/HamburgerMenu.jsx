import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { getMenuItems } from '../../constants/routes';
import '../../styles/HamburgerMenu.css';

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-button ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Navigation Pane */}
      <nav className={`nav-pane ${isOpen ? 'open' : ''}`}>
        <div className="nav-pane-content">
          {/* Navigation Items */}
          <div className="nav-menu">
            <h2 className="nav-menu-title">Navigation</h2>
            <ul className="nav-menu-list">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <button
                    className={`nav-menu-item ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <span className="nav-menu-icon">{item.icon}</span>
                    <span className="nav-menu-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme Toggle at Bottom */}
          <div className="nav-pane-footer">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}

export default HamburgerMenu;

