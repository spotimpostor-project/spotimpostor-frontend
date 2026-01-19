import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    const token = localStorage.getItem('token_spot');

    if (path === '/my-collections') {
      if (token) {
        navigate(path);
      } else {
        navigate('/', { state: { showLoginAlert: true } });
      }
    } else if (path === '/settings') {
      if (token) {
        navigate('/', { state: { showComingSoon: true } });
      } else {
        navigate('/', { state: { showLoginAlert: true } });
      }
    }
    onClose();
  };

  const baseLinkClasses = 'text-lg hover:text-green-400 transition-colors duration-200 p-2 rounded-md text-center';
  const activeLinkClasses = 'bg-green-900/50 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.5)]';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 bg-opacity-90 text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-10 text-center text-green-400 uppercase" style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.5)' }}>
                Menú
            </h2>
            <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  onClick={onClose} 
                  className={clsx(baseLinkClasses, { [activeLinkClasses]: pathname === '/' })}
                >
                    Principal
                </Link>
                <button 
                  onClick={() => handleNavigation('/my-collections')} 
                  className={clsx(baseLinkClasses, { [activeLinkClasses]: pathname === '/my-collections' })}
                >
                    Mi Colección
                </button>
                <button 
                  onClick={() => handleNavigation('/settings')} 
                  className={clsx(baseLinkClasses, { [activeLinkClasses]: pathname === '/settings' })}
                >
                    Configuración
                </button>
            </nav>
            <div className="mt-auto text-center text-xs text-gray-500">
                Spot The Impostor
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;