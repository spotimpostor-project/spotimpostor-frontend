import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../configs/api';
import { Button } from '../../../shared/components/Button';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import UserCollectionsTab from '../components/UserCollectionsTab';
import CommunityCollectionsTab from '../components/CommunityCollectionsTab';
import { useGame } from '../../../store'; 

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CollectionApiResponse {
  message: string;
  codigo: string;
  data: string[]; 
}

interface SelectedCollectionInfo {
  nombre: string;
  tipo: 'GENERAL' | 'PUBLICA' | 'PRIVADA' | 'COMPARTIDA';
  codigo?: string;
}

const CollectionSelection: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame(); 

  const [activeTab, setActiveTab] = useState<'GENERAL' | 'MY_COLLECTIONS' | 'COMMUNITY'>('GENERAL');
  const [generalCollections, setGeneralCollections] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<SelectedCollectionInfo | null>(null);

  useEffect(() => {
    if (activeTab === 'GENERAL') {
      const fetchGeneralCollections = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get<CollectionApiResponse>('/colecciones/general');
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

  const handleSelectCollection = (collectionName: string) => {
    const newSelection: SelectedCollectionInfo = { nombre: collectionName, tipo: 'GENERAL' };
    setSelectedCollection(selectedCollection?.nombre === collectionName ? null : newSelection); 
  };

  const handleUserCollectionSelect = (collection: { nombreColeccion: string; codigoColeccion: string; tipoColeccion: 'PUBLICA' | 'PRIVADA' | 'COMPARTIDA' }) => {
    const newSelection: SelectedCollectionInfo = {
      nombre: collection.nombreColeccion,
      tipo: collection.tipoColeccion,
      codigo: collection.codigoColeccion
    };
    setSelectedCollection(selectedCollection?.codigo === collection.codigoColeccion ? null : newSelection);
  }

  const handleContinue = () => {
    if (selectedCollection) {
      dispatch({ 
        type: 'SET_COLLECTION_DATA', 
        payload: { 
          nombreColeccion: selectedCollection.nombre, 
          tipoColeccion: selectedCollection.tipo,
          codigoColeccion: selectedCollection.codigo
        } 
      });
      console.log('Selected Collection:', selectedCollection);
      navigate('/setup/players');
    }
  };

  const handleGoBack = () => {
    navigate('/setup/mode'); 
  };


  return (
    <div className="relative min-h-screen bg-black text-green p-8 flex flex-col items-center justify-center">
      <button
        onClick={handleGoBack}
        className="absolute top-8 left-8 z-10 text-neon-green hover:text-green-400 transition-colors"
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

      <div className="z-10 flex flex-col items-center max-w-4xl w-full">
        <div className="w-full text-center">
            <h1 className="text-6xl font-extrabold mb-4 text-green drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] mt-12">
              CREATE YOUR GAME
            </h1>
        </div>
        <h2 className="font-bold text-green-400 mb-12 text-center">
          Escoge la colección de palabras
        </h2>

        <div className="flex justify-center gap-6 mb-10">
          <button
            className={cn(
              "text-xl font-bold pb-2 transition-colors",
              activeTab === 'GENERAL'
                ? "text-neon-green border-b-2 border-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "text-green-500 hover:text-green-300"
            )}
            onClick={() => { setActiveTab('GENERAL'); setSelectedCollection(null); }}
          >
            GENERAL
          </button>
          <button
            className={cn(
              "text-xl font-bold pb-2 transition-colors",
              activeTab === 'MY_COLLECTIONS'
                ? "text-neon-green border-b-2 border-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "text-green-500 hover:text-green-300"
            )}
            onClick={() => { setActiveTab('MY_COLLECTIONS'); setSelectedCollection(null); }}
          >
            MIS COLECCIONES
          </button>
          <button
            className={cn(
              "text-xl font-bold pb-2 transition-colors",
              activeTab === 'COMMUNITY'
                ? "text-neon-green border-b-2 border-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "text-green-500 hover:text-green-300"
            )}
            onClick={() => { setActiveTab('COMMUNITY'); setSelectedCollection(null); }}
          >
            COMUNIDAD
          </button>
        </div>

        <div className="w-full max-w-md mb-12">
          {loading && activeTab === 'GENERAL' && (
            <p className="z-10 text-xl text-neon-green">Cargando colecciones...</p>
          )}

          {error && (
            <p className="z-10 text-xl text-red-500">{error}</p>
          )}

          {activeTab === 'GENERAL' && generalCollections && generalCollections.length > 0 && (
            <div className="w-full space-y-3">
              {generalCollections.map((collection) => (
                <div
                  key={collection}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300',
                    'bg-black/50 border',
                    'hover:bg-neon-green/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]',
                    selectedCollection?.nombre === collection 
                      ? 'border-2 border-green-400 shadow-[0_0_25px_rgba(34,197,94,0.6)]' 
                      : 'border-green-400'
                  )}
                  onClick={() => handleSelectCollection(collection)}
                >
                  <span className="text-lg font-medium text-neon-green">{collection}</span>
                  <input
                    type="radio"
                    name="collection"
                    value={collection}
                    checked={selectedCollection?.nombre === collection}
                    onChange={() => handleSelectCollection(collection)}
                    className="form-radio h-5 w-5 text-neon-green bg-transparent border-green-400 focus:ring-green-400 radio-neon-effect"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'MY_COLLECTIONS' && (
            <UserCollectionsTab onSelect={handleUserCollectionSelect} selectedCollection={selectedCollection} />
          )}
          {activeTab === 'COMMUNITY' && (
            <CommunityCollectionsTab onSelect={handleUserCollectionSelect} />
          )}
        </div>

        <div className="text-center mt-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedCollection}
            className={cn(
            'bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2',
            'shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all',
            'max-w-xs',
              !selectedCollection && 'opacity-50 cursor-not-allowed hover:shadow-none'
            )}
          >
            CONTINUAR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionSelection;
