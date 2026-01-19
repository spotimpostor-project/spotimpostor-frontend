import React, { useState, useEffect } from 'react';
import api from '../../../configs/api';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// Tipos para la estructura de datos de la colección y las props del componente
interface Collection {
  nombre: string;
  codigo: string;
  autor: string;
  visibilidad: 'PUBLICA' | 'COMPARTIDA';
}

interface SelectedCollectionInfo {
    nombre: string;
    tipo: 'GENERAL' | 'PUBLICA' | 'PRIVADA' | 'COMPARTIDA';
    codigo?: string;
}

interface CommunityCollectionsTabProps {
  onSelect: (collection: { nombreColeccion: string; codigoColeccion: string; tipoColeccion: 'PUBLICA' | 'COMPARTIDA' }) => void;
  selectedCollection: SelectedCollectionInfo | null;
}

// Utility for combining Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CommunityCollectionsTab: React.FC<CommunityCollectionsTabProps> = ({ onSelect, selectedCollection }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'Nombre' | 'Código'>('Nombre');
  const [orderType, setOrderType] = useState<'Popular' | 'Reciente'>('Popular');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    const requestBody = {
      query: searchType === 'Nombre' ? searchTerm : "",
      codigo: searchType === 'Código' ? searchTerm : null,
      tipoBusqueda: searchType,
      tipoOrden: orderType.toUpperCase(),
    };

    try {
      // Using POST to ensure the request body is sent and processed by the backend.
      const response = await api.post('/colecciones/comunidad', requestBody);

      if (response.status === 200 && response.data?.data) {
        setCollections(response.data.data);
      } else {
        setCollections([]);
        setError(response.data?.message || 'La respuesta no tiene el formato esperado.');
      }
    } catch (err: any) {
      // Capture specific error message from the backend response
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al buscar colecciones. Por favor, inténtelo de nuevo.');
      }
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carga inicial
    handleSearch();
  }, [orderType]); // Recarga cuando cambia el tipo de orden

  const handleSelectCollection = (collection: Collection) => {
    onSelect({
      nombreColeccion: collection.nombre,
      codigoColeccion: collection.codigo,
      tipoColeccion: collection.visibilidad,
    });
  };

  return (
    <div className="font-chakra-petch text-white w-full">
      {/* Bloque de Filtros */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Buscar por ${searchType}...`}
          className="bg-gray-800 border border-green-500 rounded-lg px-4 py-2 w-full md:w-auto md:flex-grow focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <div className="flex w-full md:w-auto gap-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'Nombre' | 'Código')}
            className="bg-gray-800 border border-green-500 rounded-lg px-4 py-2 cursor-pointer w-1/2 md:w-auto focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="Nombre">Nombre</option>
            <option value="Código">Código</option>
          </select>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as 'Popular' | 'Reciente')}
            className="bg-gray-800 border border-green-500 rounded-lg px-4 py-2 cursor-pointer w-1/2 md:w-auto focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="Popular">Popular</option>
            <option value="Reciente">Reciente</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 rounded-lg px-6 py-2 font-bold transition-all duration-300 w-full md:w-auto disabled:opacity-50"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="text-center mb-6">
          <p className="text-red-400" style={{ textShadow: '0 0 5px rgba(248, 113, 113, 0.5)' }}>
            {error}
          </p>
        </div>
      )}

      {/* Resultados */}
      {!loading && !error && collections.length === 0 && (
        <div className="text-center">
            <p className="text-gray-400">No se encontraron colecciones públicas.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {collections.map((collection) => (
          <div
            key={collection.codigo}
            onClick={() => handleSelectCollection(collection)}
            className={cn(
                "w-full rounded-lg p-4 cursor-pointer bg-black/50 text-white text-center transition-all duration-300",
                "border border-green-400", // Subtle default border
                "hover:border-green-400", // Hover effect
                { // Selected state
                  'border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.8)]': selectedCollection?.codigo === collection.codigo
                }
              )}
          >
            <h3 className="text-xl font-bold text-neon-green">{collection.nombre}</h3>
            <p className="font-mono text-green-400 text-sm tracking-wider">#{collection.codigo}</p>
            <p className="text-xs text-gray-500 mt-2">por {collection.autor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityCollectionsTab;
