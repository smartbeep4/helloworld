import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/ThemeToggle.css';

function ThemeToggle() {
  const { theme, changeTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'gray', label: 'Gray', icon: '🌓' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
  ];

  return (
    <div className="theme-toggle">
      <div className="theme-toggle-label">Theme</div>
      <div className="theme-options">
        {themes.map((themeOption) => {
          const isActive = theme === themeOption.value;
          return (
            <button
              key={themeOption.value}
              className={`theme-option ${isActive ? 'active' : ''}`}
              onClick={() => changeTheme(themeOption.value)}
              aria-label={`Switch to ${themeOption.label} theme`}
              aria-pressed={isActive}
            >
              <span className="theme-option-overlay"></span>
              <span className="theme-option-content">
                <span className="theme-option-icon">{themeOption.icon}</span>
                <span className="theme-option-label">{themeOption.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ThemeToggle;

