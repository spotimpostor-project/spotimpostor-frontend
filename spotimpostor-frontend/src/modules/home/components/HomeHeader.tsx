import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../../../store';
import Sidebar from './Sidebar';

const MenuIcon = ({ onClick }: { onClick: () => void }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-green-400 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      onClick={onClick}
      style={{ filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.7))' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );

interface HomeHeaderProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const { state, dispatch } = useGame();
  const { isAuthenticated, userName } = state;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token_spot');
    localStorage.removeItem('user_name');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-30">
        {/* Left Side: Menu Icon */}
        <div className="flex items-center">
            <MenuIcon onClick={toggleSidebar} />
        </div>

        {/* Right Side: Auth Status */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2 text-white font-bold">
              <span 
                className="uppercase"
                style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.5)' }}
              >
                {userName}
              </span>
              <span className="text-gray-500">|</span>
              <button
                onClick={handleLogout}
                className="font-bold text-green-400 uppercase hover:text-green-300 transition-colors duration-200"
                style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.5)' }}
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="font-bold text-green-400 uppercase hover:text-green-300 transition-colors duration-200"
              style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.5)' }}
            >
              Login
            </Link>
          )}
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
};

export default HomeHeader;