import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DynamicBackground from '../../../shared/components/DynamicBackground';
import { Button } from '../../../shared/components/Button';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// Utility for combining Tailwind classes - copied from Button.tsx for consistency
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { GameMode } from '../../../types/game';

interface ApiResponse {
  message: string;
  codigo: string;
  data: GameMode[];
}

const GameModeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [gameModes, setGameModes] = useState<GameMode[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  useEffect(() => {
    const fetchGameModes = async () => {
      try {
        const response = await axios.get<ApiResponse>('/api/modos_partida');
        setGameModes(response.data.data);
      } catch (err) {
        console.error('Error fetching game modes:', err);
        setError('Failed to load game modes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameModes();
  }, []);

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode.modo === selectedMode?.modo ? null : mode); // Toggle selection
  };

  const handleGoBack = () => {
    navigate('/'); // Go back to the home page
  };

  const handleContinue = () => {
    if (selectedMode) {
      // TODO: Save selectedMode to global store (src/store/)
      // For now, it will navigate
      console.log('Selected Mode:', selectedMode);
      navigate('/game/setup'); // Assuming a route '/game/setup'
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <DynamicBackground />
        <p className="z-10 text-xl text-emerald-400">Loading game modes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-black text-white flex items-center justify-center">
        <DynamicBackground />
        <p className="z-10 text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <DynamicBackground />

      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-8 left-8 z-10 text-emerald-400 hover:text-emerald-300 transition-colors"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      {/* Content */}
      <div className="z-10 flex flex-col items-center max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold mb-4 text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
          CREATE YOUR GAME
        </h1>
        <h2 className="font-bold text-gray-400 mb-12">
          Choose game mode
        </h2>

        {gameModes && gameModes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-10">
            {gameModes.map((mode) => (
              <div
                key={mode.modo}
                className={cn(
                  'bg-emerald-900/30 p-6 rounded-lg cursor-pointer transition-all duration-300',
                  'border-2 border-transparent hover:border-emerald-500 hover:shadow-neon-emerald',
                  selectedMode?.modo === mode.modo && 'border-2 border-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                )}
                onClick={() => handleSelectMode(mode)}
              >
                <h3 className={cn("text-3xl font-bold mb-2 text-[#22c55e]",
                  selectedMode?.modo === mode.modo ? 'drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]'
                )}>{mode.modo}</h3>
                <p className="text-gray-400 text-lg">{mode.descripcion}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xl text-gray-400">No game modes available.</p>
        )}

        <div className="w-full flex justify-center mb-12">
          <Button
            onClick={handleContinue}
            disabled={!selectedMode}
            className={cn(
              'bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2',
              'shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all',
              'max-w-xs', // Keep max-w-xs for button size constraint
              !selectedMode && 'opacity-50 cursor-not-allowed hover:shadow-none active:scale-100'
            )}
          >
            CONTINUE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelection;
