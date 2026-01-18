import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import api from '../../../configs/api';

// Utility for combining Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Collection {
  _id: string;
  nombre: string;
  palabras: string[];
  visibilidad: 'PUBLICA' | 'PRIVADA' | 'COMPARTIDA';
  codigo: string;
}

type CollectionVisibility = 'PUBLICA' | 'PRIVADA' | 'COMPARTIDA';

interface SelectedCollectionInfo {
    nombre: string;
    tipo: 'GENERAL' | 'PUBLICA' | 'PRIVADA' | 'COMPARTIDA';
    codigo?: string;
}

interface UserCollectionsTabProps {
  onSelect: (collection: { nombreColeccion: string; codigoColeccion: string; tipoColeccion: CollectionVisibility }) => void;
  selectedCollection: SelectedCollectionInfo | null;
}

const UserCollectionsTab: React.FC<UserCollectionsTabProps> = ({ onSelect, selectedCollection }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Obtenemos el token DENTRO del efecto.
    // Esto asegura que se lea el valor actual de localStorage al montar el componente.
    const token = localStorage.getItem('token_spot');
    console.log("Token obtenido:", token);
    
    if (token) {
      setIsLoggedIn(true);
      const fetchCollections = async () => {
        try {
          const response = await api.get('/colecciones/usuario');
          if (response.data && response.data.codigo === '200') {
            setCollections(response.data.data);
          } else {
            console.error(response.data.message || 'Failed to fetch user collections');
          }
        } catch (error) {
          console.error('Error fetching collections:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCollections();
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
    // 2. Array de dependencias VACÍO [].
    // Esto le dice a React: "Ejecuta esto SOLO una vez cuando el componente se monte".
    // No incluimos 'onSelect' porque no lo usamos dentro del efecto y es lo que causaba el bucle.
  }, []); 

  if (isLoading) {
    return <div className="text-center text-neon-green font-chakra-petch">Cargando...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="w-full flex flex-col items-center gap-6 text-center font-chakra-petch">
        {/* Redesigned "Log In" Message Block */}
        <div className="w-full max-w-md p-4 bg-black/50 border border-green-400 rounded-lg shadow-lg">
            <p className="text-white">Para ver tus colecciones creadas debes iniciar sesión!</p>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-[#22c55e] text-black font-bold py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:bg-green-400 transition-all duration-300"
        >
          INICIAR SESIÓN
        </button>
      </div>
    );
  }

  return (
    <div className="font-chakra-petch w-full">
      {collections.length === 0 ? (
        <p className="text-center text-white">No has creado ninguna colección todavía.</p>
      ) : (
        // Mobile-First Flex Container
        <div className="flex flex-col gap-4">
          {Array.isArray(collections) && collections.map((collection) => (
            <div
              key={collection.codigo}
              className={cn(
                "w-full rounded-lg p-4 cursor-pointer bg-black/50 text-white text-center transition-all duration-300",
                "border border-green-400", // Subtle default border
                "hover:border-green-400", // Hover effect
                { // Selected state
                  'border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.8)]': selectedCollection?.codigo === collection.codigo
                }
              )}
              onClick={() => onSelect({
                nombreColeccion: collection.nombre,
                codigoColeccion: collection.codigo,
                tipoColeccion: collection.visibilidad.toUpperCase() as CollectionVisibility
              })}
            >
              <h3 className="text-xl font-bold text-neon-green">{collection.nombre}</h3>
              {/* Monospaced font for the code */}
              <p className="font-mono text-green-400 text-sm tracking-wider">#{collection.codigo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCollectionsTab;
