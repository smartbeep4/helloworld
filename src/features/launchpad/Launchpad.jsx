import React, { useState } from 'react';
import AppCard from '../../components/ui/AppCard';
import HamburgerMenu from '../../components/ui/HamburgerMenu';
import { getAppsByCategory, getCategoryMetadata } from '../../constants/apps';
import '../../styles/Launchpad.css';

function Launchpad() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const appsByCategory = getAppsByCategory();
  const categoryMetadata = getCategoryMetadata();

  return (
    <div className="launchpad">
      <HamburgerMenu onNavStateChange={setIsNavOpen} />
      <header className="launchpad-header">
        <h1 className="launchpad-title">🚀 Mini Apps Launchpad</h1>
        <p className="launchpad-subtitle">Select an app to get started</p>
      </header>
      <div className="launchpad-sections">
        {Object.entries(appsByCategory).map(([category, apps]) => (
          <section key={category} className="launchpad-section">
            <h2 className="section-title">
              <span className="section-icon">{categoryMetadata[category]?.icon}</span>
              {categoryMetadata[category]?.label || category}
            </h2>
            <div className="launchpad-grid">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Launchpad;

