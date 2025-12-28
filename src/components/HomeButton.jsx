import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/HomeButton.css';

function HomeButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show on non-home pages
  if (location.pathname === '/') {
    return null;
  }

  const handleHomeClick = () => {
    navigate('/');
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
