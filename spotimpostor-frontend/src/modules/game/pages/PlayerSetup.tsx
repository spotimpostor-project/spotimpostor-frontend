import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../configs/api';
import { GameContext } from '../../../store';
import { Button } from '../../../shared/components/Button';
import { Player } from '../../../types/game';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PlayerSetup: React.FC = () => {
  const navigate = useNavigate();
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('PlayerSetup must be used within a GameProvider');
  }

  const { state, dispatch } = context;

  const [playerNames, setPlayerNames] = useState<string[]>(() => 
    state.jugadores.length >= 3 ? state.jugadores : ['', '', '']
  );
  const [impostorCount, setImpostorCount] = useState<number>(state.cantidadImpostores || 1);
  const [error, setError] = useState<string | null>(null);

  const { modo, nombreColeccion, tipoColeccion, codigoColeccion } = state;

  const activePlayersCount = playerNames.filter(name => name.trim() !== '').length;
  const minImpostors = 1;
  const maxImpostors = Math.floor(activePlayersCount / 2);

  useEffect(() => {
    if (activePlayersCount < 3) {
      setImpostorCount(1);
      return;
    }
    
    const newMax = Math.floor(activePlayersCount / 2);
    
    if (impostorCount > newMax) {
      setImpostorCount(newMax);
    } else if (impostorCount < minImpostors) {
      setImpostorCount(minImpostors);
    }

  }, [playerNames, activePlayersCount, impostorCount]);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const addPlayerInput = () => {
    setPlayerNames([...playerNames, '']);
  };

  const removePlayerInput = (index: number) => {
    if (playerNames.length > 3) {
      const newPlayerNames = playerNames.filter((_, i) => i !== index);
      setPlayerNames(newPlayerNames);
    }
  };

  const incrementImpostors = () => {
    if (impostorCount < maxImpostors) {
      setImpostorCount(prev => prev + 1);
    }
  };

  const decrementImpostors = () => {
    if (impostorCount > minImpostors) {
      setImpostorCount(prev => prev - 1);
    }
  };

  const isGameSetupValid = useCallback(() => {
    const allNamesFilled = playerNames.every(name => name.trim() !== '');
    return activePlayersCount >= 3 && allNamesFilled;
  }, [playerNames, activePlayersCount]);

  const handleCreateGame = async () => {
    if (!isGameSetupValid()) {
      setError("Please ensure all player names are filled and there are at least 3 players.");
      return;
    }
    setError(null);

    const activePlayers = playerNames.filter(name => name.trim() !== '');
    const cantidadJugadores = activePlayers.length;

    dispatch({
      type: 'SET_PLAYER_DATA',
      payload: {
        jugadores: activePlayers,
        cantidadJugadores: cantidadJugadores,
        cantidadImpostores: impostorCount,
      },
    });

    const gamePayload = {
      modo,
      nombreColeccion,
      codigoColeccion,
      tipoColeccion,
      cantidadJugadores,
      cantidadImpostores: impostorCount,
      jugadores: activePlayers,
    };

    try {
      const response = await api.post('/partidas', gamePayload);
      if (response.status === 200) {
        const { idPartida, rolesJugadores } = response.data.data;
        
        console.log('Datos de Partida Cargados:', { idPartida, jugadores: rolesJugadores });
        localStorage.setItem('current_game_id', idPartida);

        const formattedPlayers: Player[] = rolesJugadores.map((p: { jugador: string; rol: 'CIVIL' | 'IMPOSTOR'; palabra: string; }) => ({
          id: p.jugador,
          name: p.jugador,
          role: p.rol,
          word: p.palabra,
          isReady: false,
          isEliminated: false,
        }));
        dispatch({ type: 'SET_PLAYERS', payload: formattedPlayers });
        dispatch({ type: 'SET_GAME_ID', payload: idPartida });
        dispatch({ type: 'SET_GAME_RESULT', payload: { data: rolesJugadores } });
        navigate('/lobby');
      } else {
        setError(`Error creating game: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error creating game:', err);
      setError('Failed to create game. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/setup/collection');
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center">
      <button
        onClick={handleGoBack}
        className="absolute top-8 left-8 z-20 text-[#22c55e] hover:text-emerald-300 transition-colors"
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md pt-24 pb-20 px-4">
        <h1 className="text-6xl font-extrabold mb-4 text-white text-center drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">CREA TU PARTIDA</h1>
        <h2 className="font-bold text-green-400 mb-12 text-center">Ingresar la lista de jugadores</h2>

        {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

        <div className="w-full bg-black/50 rounded-lg p-4 mb-6 border border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <h3 className="text-xl font-semibold text-white mb-4">Players: {activePlayersCount}</h3>
          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                placeholder={`Player ${index + 1}`}
                value={name}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                className="flex-grow p-3 rounded-md bg-black text-white border border-[#22c55e] focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.3)]"
              />
              {playerNames.length > 3 && (
                <button
                  onClick={() => removePlayerInput(index)}
                  className="p-2 rounded-full bg-transparent text-[#22c55e] hover:bg-[#22c55e]/20 focus:outline-none focus:ring-2 focus:ring-[#22c55e] border border-[#22c55e]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addPlayerInput}
            className="w-full py-3 mt-4 text-[#22c55e] border-2 border-dashed border-[#22c55e] rounded-md hover:bg-[#22c55e]/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
          >
            + ADD PLAYER
          </button>
        </div>

        <div className="w-full bg-black/50 rounded-lg p-4 mb-8 border border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <h3 className="text-xl font-semibold text-white mb-4">Number of Impostors:</h3>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={decrementImpostors}
              disabled={impostorCount <= minImpostors || activePlayersCount < 3}
              className="p-3 rounded-full bg-black/50 text-[#22c55e] border border-[#22c55e] hover:bg-[#22c55e]/20 focus:outline-none focus:ring-2 focus:ring-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </button>
            <span className="text-4xl font-bold text-[#22c55e]">{impostorCount}</span>
            <button
              onClick={incrementImpostors}
              disabled={impostorCount >= maxImpostors || activePlayersCount < 3}
              className="p-3 rounded-full bg-black/50 text-[#22c55e] border border-[#22c55e] hover:bg-[#22c55e]/20 focus:outline-none focus:ring-2 focus:ring-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          <div className="bg-black/50 border border-[#22c55e] rounded-md p-3 text-[#22c55e] flex items-center space-x-2 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Max impostors: {maxImpostors}. Min impostors: {minImpostors}. Players: {activePlayersCount}</p>
          </div>
        </div>

        <Button
          onClick={handleCreateGame}
          disabled={!isGameSetupValid()}
          className={cn(
            'bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2',
            'shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all',
            'max-w-xs',
            !isGameSetupValid() && 'opacity-50 cursor-not-allowed hover:shadow-none active:scale-100'
          )}
        >
          CREATE GAME
        </Button>
      </div>
    </div>
  );
};

export default PlayerSetup;