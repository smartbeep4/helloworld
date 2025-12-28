import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import '../../styles/HomeButton.css';

function HomeButton({ isNavOpen = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show on non-home pages
  if (location.pathname === ROUTES.HOME) {
    return null;
  }

  const handleHomeClick = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <button
      className={`home-button ${isNavOpen ? 'fading' : ''}`}
      onClick={handleHomeClick}
      aria-label="Go to home"
      title="Home"
    >
      <span className="home-icon">
        {isNavOpen ? '🐴' : '🏠'}
      </span>
      {isNavOpen && (
        <span className="home-text">SmartApps</span>
      )}
    </button>
  );
}

export default HomeButton;

