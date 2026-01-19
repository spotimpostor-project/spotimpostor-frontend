import React, { useCallback, useMemo } from 'react';
import { Button } from '../../../shared/components/Button'; // Assuming Button is still needed
import { useGame } from '../../../store';
import { useNavigate } from 'react-router-dom';
import PlayerCard from '../components/PlayerCard';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// Utility for combining Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { players, selectedMode } = state;

  const handleReady = useCallback((playerId: string) => {
    dispatch({ type: 'UPDATE_PLAYER_READY_STATUS', payload: { playerId, isReady: true } });
  }, [dispatch]);

  const isBlindMode = useMemo(() => selectedMode?.modo === 'A CIEGAS', [selectedMode]);

  const readyPlayersCount = useMemo(() => {
    return players.filter(p => p.isReady).length;
  }, [players]);

  const allPlayersReady = useMemo(() => {
    return players.length > 0 && readyPlayersCount === players.length;
  }, [players, readyPlayersCount]);

  const handleStartGame = () => {
    console.log('Starting game...');
    navigate('/game-session');
    // dispatch({ type: 'SET_GAME_PHASE', payload: 'INGAME' });
  };

  return (
    <div className="bg-black text-white">
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen overflow-y-auto p-4 pt-24 pb-20 text-white font-body">
        <div className="relative mb-8 text-center">
          <h1 className="text-6xl font-extrabold mb-4 text-white text-center drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
            WAITING ROOM
          </h1>
          <h2 className="font-bold text-green-400 mb-12 text-center">Revisa tu palabra y rol asignados</h2>
        </div>

        <div className="w-full max-w-2xl space-y-4">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={{
                id: player.id,
                jugador: player.name,
                rol: player.role as 'CIVIL' | 'IMPOSTOR',
                palabra: player.word as string,
                isReady: player.isReady,
              }}
              onReady={handleReady}
              isBlindMode={isBlindMode}
            />
          ))}
        </div>

        <div className="mt-6 text-xl font-primary text-[#22c55e] drop-shadow-neon">
          {readyPlayersCount}/{players.length} Listos
        </div>

        <div className="w-full flex justify-center mt-6">
          <Button
            onClick={handleStartGame}
            disabled={!allPlayersReady}
            className={cn(
            'bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2',
            'shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all',
            'max-w-xs',
              !allPlayersReady && 'opacity-50 cursor-not-allowed hover:shadow-none active:scale-100'
            )}
          >
            INICIAR PARTIDA
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
