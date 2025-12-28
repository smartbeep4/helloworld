import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Launchpad from './components/Launchpad';
import SnakeGame from './components/SnakeGame';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Launchpad />} />
        <Route path="/snake" element={<SnakeGame />} />
      </Routes>
    </Router>
  );
}

export default App;

