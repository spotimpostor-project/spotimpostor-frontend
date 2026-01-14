// src/modules/home/components/HomeHeader.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-[#22c55e]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const HomeHeader: React.FC = () => {
  const location = useLocation();

  return (
    <header className="absolute top-0 right-0 p-4 md:p-6 px-6">
      {location.pathname === '/' && (
        <div className="flex items-center space-x-2">
          <UserIcon />
          <span className="font-bold text-[#22c55e]">Login</span>
        </div>
      )}
    </header>
  );
};

export default HomeHeader;
