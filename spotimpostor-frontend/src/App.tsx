import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from './modules/home/pages/HomePage';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import GameModeSelection from './modules/game/pages/GameModeSelection';
import CollectionSelection from './modules/game/pages/CollectionSelection';
import PlayerSetup from './modules/game/pages/PlayerSetup';
import Lobby from './modules/game/pages/Lobby';
import GameSession from './modules/game/pages/GameSession';
import GameResults from './modules/game/pages/GameResults';
import { useGame } from './store';
import MainLayout from './router/MainLayout'; // Import the new layout

function AppContent() {
  const location = useLocation();
  const { dispatch } = useGame();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on auth page navigation
  useEffect(() => {
    if (location.pathname.startsWith('/auth')) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Effect for initial auth check
  useEffect(() => {
    const token = localStorage.getItem('token_spot');
    const userName = localStorage.getItem('user_name');
    if (token && userName) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { token, userName } });
    }
  }, [dispatch]);

  return (
    <div className="relative w-full max-w-full min-h-screen overflow-x-hidden bg-black">
      <div className="relative z-10">
        <Routes>
          {/* Routes without MainLayout (no header) */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          
          <Route path="/setup/mode" element={<GameModeSelection />} />
          <Route path="/setup/collection" element={<CollectionSelection />} />
          <Route path="/setup/players" element={<PlayerSetup />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game-session" element={<GameSession />} />
          <Route path="/game" element={<Placeholder name="Juego en Progreso" />} />
          <Route path="/game/vote" element={<Placeholder name="Votaciones" />} />
          <Route path="/results" element={<GameResults />} />

          {/* Routes WITH MainLayout (and header) */}
          <Route element={<MainLayout isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />}>
            <Route path="/" element={<HomePage />} />
            {/* Future routes that need the header can be added here, e.g., /my-collection, /settings */}
          </Route>
        </Routes>
      </div>
    </div>
  );
}

// Placeholder component remains for routes that are not yet implemented
const Placeholder = ({ name }: { name: string }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
    <h1 className="text-2xl font-bold text-slate-800">Pantalla: {name}</h1>
  </div>
);

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
