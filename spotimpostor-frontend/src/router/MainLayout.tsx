import React from 'react';
import { Outlet } from 'react-router-dom';
import HomeHeader from '../modules/home/components/HomeHeader';

interface MainLayoutProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <HomeHeader isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
