import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Launchpad.css';

function AppCard({ app }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(app.path);
  };

  return (
    <div className="app-card" onClick={handleClick}>
      <div className="app-card-icon">{app.icon}</div>
      <h3 className="app-card-title">{app.title}</h3>
      <p className="app-card-description">{app.description}</p>
    </div>
  );
}

export default AppCard;

