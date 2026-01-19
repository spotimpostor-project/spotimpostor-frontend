import { useQuery } from '@tanstack/react-query';
import api from '../../../configs/api';

export const useGameModes = () => {
  return useQuery({
    queryKey: ['gameModes'],
    queryFn: async () => {
      console.log('--- LLAMADA AL BACKEND: Obteniendo Modos de Juego ---');
      const res = await api.get('/modos-partida');
      return res.data.data;
    },
    staleTime: Infinity,
  });
};

export const useGeneralCollections = () => {
  return useQuery({
    queryKey: ['generalCollections'],
    queryFn: async () => {
      console.log('--- LLAMADA AL BACKEND: Obteniendo Colecciones Generales ---');
      const res = await api.get('/colecciones/general');
      return res.data.data;
    },
    staleTime: Infinity,
  });
};
