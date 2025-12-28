import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import '../../styles/HomeButton.css';

function HomeButton() {
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
      className="home-button"
      onClick={handleHomeClick}
      aria-label="Go to home"
      title="Home"
    >
      <span className="home-icon">🏠</span>
    </button>
  );
}

export default HomeButton;

