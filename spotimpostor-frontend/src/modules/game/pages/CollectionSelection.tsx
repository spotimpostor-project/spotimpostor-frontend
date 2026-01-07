import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../../shared/components/Button';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { useGame } from '../../../store'; // Import useGame

// Utility for combining Tailwind classes - copied from Button.tsx for consistency
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CollectionApiResponse {
  message: string;
  codigo: string;
  data: string[]; // Array of collection names
}

const CollectionSelection: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame(); // Use the game context

  const [activeTab, setActiveTab] = useState<'GENERAL' | 'MY_COLLECTIONS' | 'COMMUNITY'>('GENERAL');
  const [generalCollections, setGeneralCollections] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'GENERAL') {
      const fetchGeneralCollections = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get<CollectionApiResponse>('/api/colecciones/general');
          setGeneralCollections(response.data.data);
        } catch (err) {
          console.error('Error fetching general collections:', err);
          setError('Failed to load general collections. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchGeneralCollections();
    }
  }, [activeTab]);

  const handleSelectCollection = (collection: string) => {
    setSelectedCollection(collection === selectedCollection ? null : collection); // Toggle selection
  };

  const handleContinue = () => {
    if (selectedCollection) {
      dispatch({ 
        type: 'SET_COLLECTION_DATA', 
        payload: { 
          nombreColeccion: selectedCollection, 
          tipoColeccion: 'GENERAL' 
        } 
      });
      console.log('Selected Collection:', selectedCollection);
      navigate('/setup/players');
    }
  };

  const handleGoBack = () => {
    navigate('/setup/mode'); // Go back to the game mode selection
  };


  return (
    <div className="relative min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-8 left-8 z-10 text-[#22c55e] hover:text-[#22c55e] transition-colors"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>

      {/* Content */}
      <div className="z-10 flex flex-col items-center max-w-4xl w-full">
        <h1 className="text-6xl font-extrabold mb-4 text-white drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
          CREATE YOUR GAME
        </h1>
        <h2 className="font-bold text-gray-400 mb-12">
          Escoge la colección de palabras
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-10">
          <button
            className={cn(
              "text-xl font-bold pb-2 transition-colors",
              activeTab === 'GENERAL'
                ? "text-[#22c55e] border-b-2 border-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "text-gray-500 hover:text-gray-300"
            )}
            onClick={() => setActiveTab('GENERAL')}
          >
            GENERAL
          </button>
          <button
            className={cn(
              "text-xl font-bold pb-2 transition-colors",
              activeTab === 'MY_COLLECTIONS'
                ? "text-[#22c55e] border-b-2 border-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "text-gray-500 hover:text-gray-300"
            )}
            onClick={() => setActiveTab('MY_COLLECTIONS')}
          >
            MIS COLECCIONES
          </button>
          <button
            className={cn(
              "text-xl font-bold pb-2 transition-colors",
              activeTab === 'COMMUNITY'
                ? "text-[#22c55e] border-b-2 border-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "text-gray-500 hover:text-gray-300"
            )}
            onClick={() => setActiveTab('COMMUNITY')}
          >
            COMUNIDAD
          </button>
        </div>

        {loading && (
          <p className="z-10 text-xl text-[#22c55e]">Cargando colecciones...</p>
        )}

        {error && (
          <p className="z-10 text-xl text-red-500">{error}</p>
        )}

        {activeTab === 'GENERAL' && generalCollections && generalCollections.length > 0 && (
          <div className="w-full max-w-md space-y-3 mb-10"> {/* Removed outer container styling, added spacing */}
            {generalCollections.map((collection) => (
              <div
                key={collection}
                className={cn(
                  'flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200',
                  'bg-black/50 border border-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.2)]', // Base styling for a row
                  'hover:bg-[#22c55e]/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]', // Hover effect
                  selectedCollection === collection && 'bg-[#22c55e]/20 border-2 border-[#22c55e] shadow-[0_0_25px_rgba(34,197,94,0.6)]' // Selected state
                )}
                onClick={() => handleSelectCollection(collection)}
              >
                <span className="text-lg font-medium text-white">{collection}</span>
                <input
                  type="radio"
                  name="collection"
                  value={collection}
                  checked={selectedCollection === collection}
                  onChange={() => handleSelectCollection(collection)}
                  className="form-radio h-5 w-5 text-[#22c55e] bg-transparent border-[#22c55e] focus:ring-[#22c55e] radio-neon-effect"
                />
              </div>
            ))}
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab === 'MY_COLLECTIONS' && (
          <p className="text-xl text-gray-400 mt-5">Funcionalidad "Mis Colecciones" próximamente.</p>
        )}
        {activeTab === 'COMMUNITY' && (
          <p className="text-xl text-gray-400 mt-5">Funcionalidad "Comunidad" próximamente.</p>
        )}

        <div className="w-full flex justify-center mb-12">
          <Button
            onClick={handleContinue}
            disabled={!selectedCollection}
            className={cn(
              'bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2',
              'shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all',
              'max-w-xs',
              !selectedCollection && 'opacity-50 cursor-not-allowed hover:shadow-none active:scale-100'
            )}
          >
            CONTINUE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionSelection;
