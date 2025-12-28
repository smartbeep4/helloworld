import React from 'react';
import AppCard from '../../components/ui/AppCard';
import HamburgerMenu from '../../components/ui/HamburgerMenu';
import { APPS } from '../../constants/apps';
import '../../styles/Launchpad.css';

function Launchpad() {
  return (
    <div className="launchpad">
      <HamburgerMenu />
      <header className="launchpad-header">
        <h1 className="launchpad-title">🚀 Mini Apps Launchpad</h1>
        <p className="launchpad-subtitle">Select an app to get started</p>
      </header>
      <div className="launchpad-grid">
        {APPS.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

export default Launchpad;

