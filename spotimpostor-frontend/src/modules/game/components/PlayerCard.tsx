import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { LobbyPlayer } from '../../../types/game';

// Utility for combining Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// The player prop now has the raw data from gameResult.data plus our own UI state
interface PlayerCardProps {
  player: LobbyPlayer;
  onReady: (playerId: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onReady }) => {
  const [showRole, setShowRole] = useState(false);

  const handleViewRole = () => {
    setShowRole(true);
  };

  const handleReady = () => {
    setShowRole(false);
    onReady(player.id);
  };

  return (
    <div
      className={cn(
        'relative p-4 bg-black/50 rounded-lg border border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300',
        { 'shadow-[0_0_25px_rgba(16,185,129,0.6)] border-[#22c55e] border-2': player.isReady }
      )}
    >
      <div className="flex justify-between items-center">
        <span className="text-xl font-body text-white tracking-wide">
          {player.jugador || 'Cargando...'}
        </span>
        {!player.isReady && !showRole ? (
          <Button
            onClick={handleViewRole}
            className="px-6 py-2 text-base bg-transparent border border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/20 rounded-md transition-colors"
          >
            VER
          </Button>
        ) : player.isReady ? (
          <div className="flex items-center text-[#22c55e] drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]">
            <span className="font-bold text-lg uppercase">READY</span>
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
        ) : null}
      </div>

      {showRole && !player.isReady && (
        <div className="mt-4 pt-4 border-t border-[#22c55e]/20 bg-black">
          <p className="text-base text-gray-400 font-body">TU ROL:</p>
          <p className="text-4xl font-extrabold text-[#22c55e] uppercase tracking-widest mt-1">
            {player.rol || 'No asignado'}
          </p>
          <p className="text-base text-gray-400 font-body mt-4">TU PALABRA:</p>
          <p className="text-3xl font-extrabold text-[#22c55e] uppercase tracking-widest mt-1">
            {player.palabra || 'No asignada'}
          </p>
          <div className="mt-6 text-center">
            <Button 
              onClick={handleReady}
              className="px-8 py-3 bg-transparent border-2 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/20 rounded-lg font-bold transition-colors"
            >
              ESTOY LISTO
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;