
import React, { useState, useEffect } from 'react';
import api from '../../../configs/api';

// Tipos para la estructura de datos de la colección y las props del componente
interface Collection {
  nombre: string;
  codigo: string;
  autor: string;
  visibilidad: 'PUBLICA' | 'COMPARTIDA';
}

interface CommunityCollectionsTabProps {
  onSelect: (collection: { nombreColeccion: string; codigoColeccion: string; tipoColeccion: 'PUBLICA' | 'COMPARTIDA' }) => void;
}

const CommunityCollectionsTab: React.FC<CommunityCollectionsTabProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'Nombre' | 'Código'>('Nombre');
  const [orderType, setOrderType] = useState<'Popular' | 'Reciente'>('Popular');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
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
    setSelectedCollection(collection);
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

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {collections.map((collection) => (
            <div
              key={collection.codigo}
              onClick={() => handleSelectCollection(collection)}
              className={`bg-gray-900 border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 flex flex-col justify-center items-center text-center w-full max-w-xs min-h-[150px]
                ${selectedCollection?.codigo === collection.codigo
                  ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)]' // Efecto glow verde
                  : 'border-gray-700 hover:border-green-500'
                }`}
            >
              <h3 className="text-xl font-bold text-green-400">{collection.nombre}</h3>
              <p className="text-sm text-gray-300">#{collection.codigo}</p>
              <p className="text-xs text-gray-500 mt-2">por {collection.autor}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityCollectionsTab;
