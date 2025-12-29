import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import '../../styles/HomeButton.css';

function HomeButton({ isNavOpen = false }) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <button
      className={`home-button ${isNavOpen ? 'hidden' : ''}`}
      onClick={handleHomeClick}
      aria-label="Go to home"
      title="Home"
    >
      <span className="home-icon">🏠</span>
    </button>
  );
}

export default HomeButton;

