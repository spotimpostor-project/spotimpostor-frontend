import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, Eye } from 'lucide-react';
import { useGame } from '../../../store';

const GameSession: React.FC = () => {
  const [time, setTime] = useState(0);
  const navigate = useNavigate();
  const { dispatch } = useGame();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleRevealImpostor = () => {
    dispatch({ type: 'SET_GAME_TIME', payload: time });
    navigate('/results');
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

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Card 1: Iniciar Votaciones */}
        <div 
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
    </div>
  );
};

export default GameSession;