import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './router/MainLayout';
import HomePage from './modules/home/pages/HomePage';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import MyCollectionsPage from './modules/collection/pages/MyCollectionsPage';
import EditCollectionPage from './modules/collection/pages/EditCollectionPage';
import CreateCollectionPage from './modules/collection/pages/CreateCollectionPage';
import CollectionSelection from './modules/game/pages/CollectionSelection';
import GameModeSelection from './modules/game/pages/GameModeSelection';
import GameResults from './modules/game/pages/GameResults';
import GameSession from './modules/game/pages/GameSession';
import Lobby from './modules/game/pages/Lobby';
import PlayerSetup from './modules/game/pages/PlayerSetup';

const LayoutWrapper = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  return <MainLayout isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/my-collections', element: <MyCollectionsPage /> },
      { path: '/edit-collection/:codigo', element: <EditCollectionPage /> },
      { path: '/create-collection', element: <CreateCollectionPage /> },
      { path: '/collection-selection', element: <CollectionSelection /> },
      { path: '/game-mode-selection', element: <GameModeSelection /> },
      { path: '/game-results', element: <GameResults /> },
      { path: '/game-session', element: <GameSession /> },
      { path: '/lobby', element: <Lobby /> },
      { path: '/player-setup', element: <PlayerSetup /> },
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
