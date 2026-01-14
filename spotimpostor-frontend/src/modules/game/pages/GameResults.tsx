import React, { useMemo } from 'react';
import { useGame } from '../../../store';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const outcome = location.state?.outcome || 'DEFEAT';
  const isVictory = outcome === 'VICTORY';

  const { gameResult } = state;

  const impostors = useMemo(() => {
    if (!gameResult?.data) return [];
    return gameResult.data.filter(
      (p: GamePlayerData) => p.rol.toUpperCase() === 'IMPOSTOR'
    );
  }, [gameResult]);

  const impostorNames = impostors.map(p => p.jugador).join(', ');

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

  const resultStatus = isVictory ? 'VICTORIA' : 'DERROTA';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-black text-white p-8 border-green-500`}>
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <h1 className={cn(
          "text-5xl font-extrabold drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] mb-2",
          "text-green-500"
        )}>
          {resultStatus}
        </h1>
        <h2 className={cn(
          "text-xl mt-2 mb-10",
          "text-green-500"
        )}>
          {impostors.length > 1 ? 'Los impostores eran...' : 'El impostor era...'}
        </h2>

        <div className="flex flex-col items-center mb-12">
          <span className={cn(
            "text-8xl font-bold tracking-wider",
            "text-green-500"
          )}>
            {impostorNames}
          </span>
          <div className={cn(
            "text-black rounded-full px-6 py-2 mt-4",
            "bg-green-500"
          )}>
            <span className="text-2xl font-bold mr-3">IMPOSTOR</span>
          </div>
        </div>

        <div className={cn(
          "p-6 bg-black border rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] mb-8 text-center",
          "border-green-500"
        )}>
          <span className="text-xl font-semibold text-gray-400">{isVictory ? "ENCONTRADOS EN" : "SOBREVIVIERON"}</span>
          <span className={cn(
            "block text-6xl font-mono font-bold tracking-widest mt-2",
            "text-green-500"
          )}>
            {formatTime(state.gameTime)}
          </span>
        </div>

        <p className="text-xl font-light text-gray-400 text-center mb-12">
          {isVictory
            ? (impostors.length > 1 ? 'Fueron encontrados y expulsados.' : 'Fue encontrado y expulsado.')
            : (impostors.length > 1 ? 'Lograron engañarlos a todos.' : 'Logró engañarlos a todos.')
          }
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            onClick={handleNewGame}
            className={cn(
              'bg-transparent font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2',
              'border-2',
              'text-green-500 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)]',
              'hover:text-white transition-all',
              'max-w-xs'
            )}
          >
            Jugar de nuevo
          </Button>
          <Button
            onClick={handleBackToHome}
            className={cn(
              'bg-transparent font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2',
              'border-2',
              'text-green-500 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)]',
              'hover:text-white transition-all',
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