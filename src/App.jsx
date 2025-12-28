import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Launchpad from './components/Launchpad';
import SnakeGame from './components/SnakeGame';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Launchpad />} />
          <Route path="/snake" element={<SnakeGame />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

