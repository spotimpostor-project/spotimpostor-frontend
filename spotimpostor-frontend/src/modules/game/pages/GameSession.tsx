import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, Eye } from 'lucide-react';
import { useGame } from '../../../store';
import VotingModal from '../components/VotingModal';
import { Player } from '../../../types/game';

const GameSession: React.FC = () => {
  const { state, dispatch } = useGame();
  const { players } = state;
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [eliminationMessage, setEliminationMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const checkWinConditions = useCallback((currentPlayers: Player[]) => {
    const { impostors, civilians } = currentPlayers.reduce(
      (acc, player) => {
        if (!player.isEliminated) {
          if (player.role?.toUpperCase() === 'IMPOSTOR') {
            acc.impostors++;
          } else {
            acc.civilians++;
          }
        }
        return acc;
      },
      { impostors: 0, civilians: 0 }
    );

    console.log('--- Voting Results ---');
    console.log(`Active civilians: ${civilians}`);
    console.log(`Active impostors: ${impostors}`);

    const citizensWin = state.impostorCount > 0 && impostors === 0;
    const impostorsWin = state.impostorCount > 0 && impostors > 0 && civilians <= impostors;

    if (impostorsWin) {
      setIsTimerRunning(false);
      dispatch({ type: 'SET_GAME_TIME', payload: time });
      setTimeout(() => navigate('/results', { state: { outcome: 'DEFEAT' } }), 2000);
    } else if (citizensWin) {
      setIsTimerRunning(false);
      dispatch({ type: 'SET_GAME_TIME', payload: time });
      setTimeout(() => navigate('/results', { state: { outcome: 'VICTORY' } }), 2000);
    } else {
      setIsTimerRunning(true);
      setTimeout(() => {
        setEliminationMessage(null);
      }, 3000);
    }
  }, [dispatch, navigate, state.impostorCount, time]);

  const handleVote = (playerId: string) => {
    setIsTimerRunning(false);
    setIsVotingOpen(false);

    const eliminatedPlayer = players.find(p => p.id === playerId);
    if (eliminatedPlayer) {
      const message = `${eliminatedPlayer.name} ha sido expulsado. ${
        eliminatedPlayer.role?.toUpperCase() === 'IMPOSTOR' ? 'Era un impostor.' : 'No era un impostor.'
      }`;
      setEliminationMessage(message);
    }

    const nextPlayers = players.map(p =>
      p.id === playerId ? { ...p, isEliminated: true } : p
    );
    
    checkWinConditions(nextPlayers);
    dispatch({ type: 'ELIMINATE_PLAYER', payload: { playerId } });
  };

  const handleInitiateVoting = () => {
    setIsTimerRunning(false);
    setIsVotingOpen(true);
  };

  const handleCancelVote = () => {
    setIsVotingOpen(false);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleRevealImpostor = () => {
    dispatch({ type: 'SET_GAME_TIME', payload: time });
    navigate('/results', { state: { outcome: 'DEFEAT' } });
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-black text-white p-8">
      <div className="text-center mt-12">
        <h1 className="text-5xl font-extrabold text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
          JUEGO INICIADO
        </h1>
        <p className="text-[#22c55e] text-xl mt-2">
          Encuentra al impostor...
        </p>
      </div>

      {eliminationMessage && (
        <div className="absolute top-1/3 z-20 p-6 bg-black border border-[#22c55e] rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <p className="text-2xl text-white text-center">{eliminationMessage}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Card 1: Iniciar Votaciones */}
        <div 
          onClick={handleInitiateVoting}
          className="flex flex-col items-center justify-center text-center p-8 bg-black border border-[#22c55e] rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] hover:scale-105 cursor-pointer h-64 md:h-80 flex-1"
        >
          <Vote className="w-16 h-16 mb-4 text-[#22c55e]" />
          <h2 className="text-3xl font-bold text-white">INICIAR VOTACIONES</h2>
          <p className="text-lg text-gray-400 mt-2">Eliminen a un sospechoso</p>
        </div>

        {/* Card 2: Revelar al Impostor */}
        <div 
          onClick={handleRevealImpostor}
          className="flex flex-col items-center justify-center text-center p-8 bg-black border border-[#22c55e] rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] hover:scale-105 cursor-pointer h-64 md:h-80 flex-1"
        >
          <Eye className="w-16 h-16 mb-4 text-[#22c55e]" />
          <h2 className="text-3xl font-bold text-white">REVELAR AL IMPOSTOR</h2>
          <p className="text-lg text-gray-400 mt-2">Finaliza el juego y revela roles</p>
        </div>
      </div>

      <div className="w-full flex justify-center mb-4">
        <div className="text-6xl font-mono font-bold text-[#22c55e] tracking-widest">
          {formatTime(time)}
        </div>
      </div>
      
      <VotingModal 
        isOpen={isVotingOpen}
        players={players}
        onVote={handleVote}
        onCancel={handleCancelVote}
      />
    </div>
  );
};

export default GameSession;