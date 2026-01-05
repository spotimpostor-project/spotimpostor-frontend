import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './modules/home/pages/HomePage';
import DynamicBackground from './shared/components/DynamicBackground';
import HomeHeader from './modules/home/components/HomeHeader'; // Import HomeHeader
import GameModeSelection from './modules/game/pages/GameModeSelection'; // Import GameModeSelection

// Importaremos las páginas conforme las creemos
// Por ahora usaremos placeholders rápidos para que puedas navegar
const Placeholder = ({ name }: { name: string }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
    <h1 className="text-2xl font-bold text-slate-800">Pantalla: {name}</h1>
  </div>
);

function AppContent() {
  const location = useLocation();
  const showHomeHeader = !location.pathname.startsWith('/setup');

  return (
    <div className="relative w-full max-w-full min-h-screen overflow-x-hidden bg-black">
      <DynamicBackground /> {/* Render the dynamic background */}
      <div className="relative z-10">
        {showHomeHeader && <HomeHeader />} {/* Conditionally render HomeHeader */}
        <Routes>
          {/* Flujo Principal */}
          <Route path="/" element={<HomePage />} />
          <Route path="/setup/mode" element={<GameModeSelection />} /> {/* Use GameModeSelection */}
          <Route path="/setup/collection" element={<Placeholder name="Selección de Colección" />} />
          <Route path="/setup/players" element={<Placeholder name="Configuración de Jugadores" />} />
          <Route path="/lobby" element={<Placeholder name="Sala de Espera (Revelación)" />} />
          <Route path="/game" element={<Placeholder name="Juego en Progreso" />} />
          <Route path="/game/vote" element={<Placeholder name="Votaciones" />} />
          <Route path="/results" element={<Placeholder name="Resultados Finales" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
