// src/modules/home/components/HeroSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/Button';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateGame = () => {
    navigate('/setup/mode');
  };

  return (
    <div className="text-center">
      <h1 className="text-6xl md:text-7xl font-primary uppercase mb-12 animate-neon-flicker text-soft-neon-green">
        Spot the Impostor
      </h1>
      <Button 
        onClick={handleCreateGame} 
        className="text-xl"
      >
        Crear partida
      </Button>
      <a href="#" className="block mt-8 text-soft-neon-green/80 hover:text-soft-neon-green transition-colors">
        ¿Cómo jugar?
      </a>
    </div>
  );
};

export default HeroSection;
