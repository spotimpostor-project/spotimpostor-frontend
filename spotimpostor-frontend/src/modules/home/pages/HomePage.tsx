// src/modules/home/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@shared/components/Button';
import NotificationPopup from '@shared/components/NotificationPopup';

const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [popup, setPopup] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    if (location.state?.showLoginAlert) {
      setPopup({ message: '¡Debes iniciar sesión para acceder a esta sección!', visible: true });
    } else if (location.state?.showComingSoon) {
      setPopup({ message: 'Esta sección se habilitará pronto. ¡Estamos trabajando en ello!', visible: true });
    }
  }, [location.state]);

  const handleClosePopup = () => {
    setPopup({ message: '', visible: false });
    // Limpia el estado de la ubicación para que el popup no vuelva a aparecer si se recarga la página
    navigate(location.pathname, { replace: true });
  };

  const handleCreateGame = () => {
    navigate('/setup/mode');
  };

  return (
    <>
      {popup.visible && <NotificationPopup message={popup.message} onClose={handleClosePopup} />}
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-transparent font-extrabold text-white">
        {/* Pulsing Neon Glow Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-[radial-gradient(circle,rgba(34,197,94,0.15)_0%,transparent_70%)] animate-[pulse-neon_4s_ease-in-out_infinite]"></div>
        </div>

        {/* Subtle Dot Grid Pattern, reacting to pulse subtly by being behind it */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:16px_16px] opacity-10 z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {/* Central Eye Icon */}
          <div className="relative mb-8">
            <div className="absolute -inset-2 rounded-full bg-transparent border-2 border-[#22c55e] drop-shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-[pulse-neon_4s_ease-in-out_infinite_reverse]"></div>
            <div className="relative w-20 h-20 bg-transparent rounded-full flex items-center justify-center">
              <EyeIcon className="w-10 h-10 text-[#22c55e]" />
            </div>
          </div>

          <h1 className="text-6xl font-extrabold text-white mb-4 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
            SPOT THE IMPOSTER
          </h1>
          <p className="font-bold text-gray-400 mb-12">
            Crea una partida, invita a tus amigos y que comience el juego.
          </p>

          {/* CREATE GAME Button */}
          <Button
            onClick={handleCreateGame}
            className="bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2
                       shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all"
          >
            <PlayIcon className="w-5 h-5" />
            CREATE GAME
          </Button>
        </div>

        {/* How to Play Link */}
        <div className="absolute bottom-6 text-center z-10">
          <a
            href="#"
            className="text-[#22c55e] font-bold drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] hover:text-white transition-all"
          >
            ¿Cómo jugar?
          </a>
        </div>
      </div>
    </>
  );
};
export default HomePage;
