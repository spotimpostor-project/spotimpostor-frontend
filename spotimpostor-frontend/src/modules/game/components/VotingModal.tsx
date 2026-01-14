// src/modules/game/components/VotingModal.tsx
import React from 'react';
import { Player } from '../../../types/game';
import { Button } from '../../../shared/components/Button';
import { X, User } from 'lucide-react';

interface VotingModalProps {
  players: Player[];
  onVote: (playerId: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const VotingModal: React.FC<VotingModalProps> = ({ players, onVote, onCancel, isOpen }) => {
  if (!isOpen) return null;

  const activePlayers = players.filter(p => !p.isEliminated);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[#22c55e] rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.4)] w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-[#22c55e]">
          <h2 className="text-2xl font-bold text-[#22c55e]">Votar para eliminar</h2>
          <button onClick={onCancel} className="text-[#22c55e] hover:text-white">
            <X size={28} />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-neon">
          <p className="text-gray-400 mb-6">Selecciona a un jugador para eliminarlo de la partida.</p>
          <div className="grid grid-cols-1 gap-4">
            {activePlayers.map(player => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-gray-900 border border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <User className="w-8 h-8 text-[#22c55e]" />
                  <span className="text-xl font-semibold text-white">{player.name}</span>
                </div>
                <Button
                  onClick={() => onVote(player.id)}
                  className="bg-[#22c55e] text-black font-bold rounded-lg px-6 py-2 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] transition-all"
                >
                  Votar
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-[#22c55e]">
          <Button
            onClick={onCancel}
            className="bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-3"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;
