import React from 'react';
import { ShieldAlert, UserX } from 'lucide-react';

interface EliminationPopupProps {
  message: string;
}

const EliminationPopup: React.FC<EliminationPopupProps> = ({ message }) => {
  const isImpostor = message.includes('Era un impostor');
  // Extraer el nombre y el resto del mensaje
  const messageParts = message.match(/(.*?)\s+ha sido expulsado\.\s+(.*)/);
  const playerName = messageParts ? messageParts[1] : 'Un jugador';
  const resultText = messageParts ? messageParts[2] : message;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div 
        className="bg-gray-900 border-2 border-green-400 rounded-2xl shadow-2xl p-8 max-w-md mx-auto text-center font-chakra-petch flex flex-col items-center animate-slide-up"
        style={{
          boxShadow: '0 0 25px rgba(34, 197, 94, 0.4), 0 0 10px rgba(34, 197, 94, 0.3) inset',
        }}
      >
        <div className="mb-4">
            {isImpostor ? (
                <ShieldAlert className="w-20 h-20 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
            ) : (
                <UserX className="w-20 h-20 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]" />
            )}
        </div>
        <p className="text-white text-3xl font-bold mb-2">
            <span className="text-green-400">{playerName}</span> ha sido expulsado
        </p>
        <p className={`text-2xl font-bold ${isImpostor ? 'text-red-500' : 'text-white'}`}>
            {resultText}
        </p>
      </div>
    </div>
  );
};

// Add some basic animations for entrance
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
  .animate-slide-up {
    animation: slide-up 0.4s ease-out forwards;
  }
`;
document.head.appendChild(style);


export default EliminationPopup;
