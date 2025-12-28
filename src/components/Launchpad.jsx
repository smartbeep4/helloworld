import React from 'react';
import AppCard from './AppCard';
import '../styles/Launchpad.css';

function Launchpad() {
  const apps = [
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'Classic snake game with arrow key controls',
      icon: '🐍',
      path: '/snake',
    },
    // Future apps can be added here
  ];

  return (
    <div className="launchpad">
      <header className="launchpad-header">
        <h1 className="launchpad-title">🚀 Mini Apps Launchpad</h1>
        <p className="launchpad-subtitle">Select an app to get started</p>
      </header>
      <div className="launchpad-grid">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

export default Launchpad;

