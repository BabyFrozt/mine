import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';
import { Toaster } from './components/ui/sonner';

function Protected({ children }) {
  const { player } = useGame();
  if (!player) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <div className="App">
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/play" element={<Protected><GamePage /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster theme="dark" position="top-right" />
        </BrowserRouter>
      </GameProvider>
    </div>
  );
}

export default App;
