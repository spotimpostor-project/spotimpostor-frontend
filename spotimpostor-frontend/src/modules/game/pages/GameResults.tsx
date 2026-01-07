import React, { useMemo } from 'react';
import { useGame } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { GamePlayerData } from '../../../types/game';
import { Button } from '../../../shared/components/Button';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GameResults: React.FC = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const { gameResult } = state;

  const impostor = useMemo(() => {
    if (!gameResult?.data) return null;
    return gameResult.data.find(
      (p: GamePlayerData) => p.rol.toUpperCase() === 'IMPOSTOR'
    );
  }, [gameResult]);

  const nombreImpostor = impostor ? impostor.jugador : 'Unknown';

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleNewGame = () => {
    dispatch({ type: 'SET_CURRENT_PHASE', payload: 'SETUP_MODE' });
    navigate('/setup/mode');
  };

  const handleBackToHome = () => {
    dispatch({ type: 'LEAVE_GAME', payload: undefined });
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] mb-2">
          JUEGO FINALIZADO
        </h1>
        <h2 className="text-[#22c55e] text-xl mt-2 mb-10">El impostor era...</h2>

        <div className="flex flex-col items-center mb-12">
          <span className="text-8xl font-bold text-[#22c55e] tracking-wider">
            {nombreImpostor}
          </span>
          <div className="flex items-center bg-[#22c55e] text-black rounded-full px-6 py-2 mt-4">
            <span className="text-2xl font-bold mr-3">IMPOSTOR</span>
            {/* Using a placeholder icon, can be replaced with fingerprint or skull */}
          </div>
        </div>

        <div className="p-6 bg-black border border-[#22c55e] rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] mb-8 text-center">
          <span className="text-xl font-semibold text-gray-400">SOBREVIVIÓ</span>
          <span className="block text-6xl font-mono font-bold text-[#22c55e] tracking-widest mt-2">
            {formatTime(state.gameTime)}
          </span>
        </div>

        <p className="text-xl font-light text-gray-400 text-center mb-12">
          Logró engañarlos a todos.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            onClick={handleNewGame}
            className={cn(
            'bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2',
            'shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all',
            'max-w-xs'
            )}
          >
            Jugar de nuevo
          </Button>
          <Button
            onClick={handleBackToHome}
            className={cn(
            'bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2',
            'shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all',
            'max-w-xs'
            )}
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameResults;