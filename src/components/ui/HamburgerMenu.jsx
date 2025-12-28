import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { getMenuItems } from '../../constants/routes';
import { getAppsByCategory, getCategoryMetadata } from '../../constants/apps';
import '../../styles/HamburgerMenu.css';

function HamburgerMenu({ onNavStateChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set(['games'])); // Default 'games' expanded
  const navigate = useNavigate();
  const location = useLocation();
  const onNavStateChangeRef = useRef(onNavStateChange);

  // Keep ref updated
  useEffect(() => {
    onNavStateChangeRef.current = onNavStateChange;
  }, [onNavStateChange]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    onNavStateChangeRef.current?.(false);
  }, [location.pathname]);

  // Close menu on escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        onNavStateChangeRef.current?.(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const appsByCategory = getAppsByCategory();
  const categoryMetadata = getCategoryMetadata();

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-button ${isOpen ? 'active' : ''}`}
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);
          onNavStateChange?.(newState);
        }}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        type="button"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="menu-overlay"
          onClick={() => {
            setIsOpen(false);
            onNavStateChangeRef.current?.(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Navigation Pane */}
      <nav className={`nav-pane ${isOpen ? 'open' : ''}`}>
        <div className="nav-pane-content">
          {/* Navigation Items */}
          <div className="nav-menu">
            <h2 className="nav-menu-title">Apps</h2>
            <div className="nav-categories">
              {Object.entries(appsByCategory).map(([category, apps]) => (
                <div key={category} className="nav-category">
                  <button
                    className="nav-category-header"
                    onClick={() => toggleCategory(category)}
                  >
                    <span className="nav-category-icon">{categoryMetadata[category]?.icon}</span>
                    <span className="nav-category-label">{categoryMetadata[category]?.label || category}</span>
                    <span className={`nav-category-chevron ${expandedCategories.has(category) ? 'expanded' : ''}`}>
                      ▶
                    </span>
                  </button>
                  {expandedCategories.has(category) && (
                    <ul className="nav-app-list">
                      {apps.map((app) => (
                        <li key={app.id}>
                          <button
                            className={`nav-app-item ${
                              location.pathname === app.path ? 'active' : ''
                            }`}
                            onClick={() => handleNavigation(app.path)}
                          >
                            <span className="nav-app-icon">{app.icon}</span>
                            <span className="nav-app-label">{app.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
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

