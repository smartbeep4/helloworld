import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Launchpad from './components/Launchpad';
import SnakeGame from './components/SnakeGame';
import PlatformerGame from './components/PlatformerGame';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Launchpad />} />
          <Route path="/snake" element={<SnakeGame />} />
          <Route path="/platformer" element={<PlatformerGame />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

