
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './modules/home/pages/HomePage';

import HomeHeader from './modules/home/components/HomeHeader'; // Import HomeHeader
import GameModeSelection from './modules/game/pages/GameModeSelection'; // Import GameModeSelection
import CollectionSelection from './modules/game/pages/CollectionSelection'; // Import CollectionSelection
import PlayerSetup from './modules/game/pages/PlayerSetup'; // Import PlayerSetup
import Lobby from './modules/game/pages/Lobby'; // Import Lobby component
import GameSession from './modules/game/pages/GameSession'; // Import GameSession component
import GameResults from './modules/game/pages/GameResults';

// Importaremos las páginas conforme las creemos

function AppContent() {
  const location = useLocation();
  const showHomeHeader = !location.pathname.startsWith('/setup') && location.pathname !== '/lobby'; // Do not show header on lobby page

  return (
    <div className="relative w-full max-w-full min-h-screen overflow-x-hidden bg-black">

      <div className="relative z-10">
        {showHomeHeader && <HomeHeader />} {/* Conditionally render HomeHeader */}
        <Routes>
          {/* Flujo Principal */}
          <Route path="/" element={<HomePage />} />
          <Route path="/setup/mode" element={<GameModeSelection />} /> {/* Use GameModeSelection */}
          <Route path="/setup/collection" element={<CollectionSelection />} /> {/* Use CollectionSelection */}
          <Route path="/setup/players" element={<PlayerSetup />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game-session" element={<GameSession />} />
          <Route path="/game" element={<Placeholder name="Juego en Progreso" />} />
          <Route path="/game/vote" element={<Placeholder name="Votaciones" />} />
          <Route path="/results" element={<GameResults />} />
        </Routes>
      </div>
    </div>
  );
}

// Placeholder component moved inside AppContent for local scope if still needed or removed
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
