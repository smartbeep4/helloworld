import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ROUTES } from './constants/routes';
import Launchpad from './features/launchpad/Launchpad';
import SnakeGame from './components/games/SnakeGame';
import PlatformerGame from './components/games/PlatformerGame';
import Blogger from './components/knowledge/Blogger';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path={ROUTES.HOME} element={<Launchpad />} />
          <Route path={ROUTES.SNAKE} element={<SnakeGame />} />
          <Route path={ROUTES.PLATFORMER} element={<PlatformerGame />} />
          <Route path={ROUTES.BLOGGER} element={<Blogger />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

