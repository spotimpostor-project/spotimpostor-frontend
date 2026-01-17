import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../../configs/api';
import { Button } from '../../../shared/components/Button';

// Definición de tipos
type Palabra = {
  id: number | null;
  palabra: string;
};

type Visibilidad = 'PUBLICA' | 'PRIVADA' | 'COMPARTIDA';

// The collection object is passed directly in the navigation state
type LocationState = {
  collection: {
    nombre: string;
    visibilidad: Visibilidad;
    codigo: string;
  };
};

const EditCollectionPage: React.FC = () => {
  const { codigo: codigoFromParams } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;

  // Initialize state directly from location.state to ensure it's available on first render
  const [nombre, setNombre] = useState(locationState?.collection?.nombre || '');
  const [visibilidad, setVisibilidad] = useState<Visibilidad>(locationState?.collection?.visibilidad || 'PRIVADA');
  const [palabras, setPalabras] = useState<Palabra[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Use codigo from URL params as the source of truth, but can fallback to state if needed
  const codigo = codigoFromParams || locationState?.collection?.codigo;

  const hasLogged = useRef(false);

  useEffect(() => {
    const fetchWords = async () => {
      if (!codigo) {
        setError("No se ha proporcionado un código de colección.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await api.get(`/colecciones/usuario/${codigo}`);
        const wordsData = response.data?.data;
        if (Array.isArray(wordsData)) {
          setPalabras(wordsData.map((p: any) => ({ id: p.id, palabra: p.palabra })));
        } else {
          setPalabras([]);
        }
      } catch (err) {
        setError('Error al cargar las palabras. Por favor, inténtalo de nuevo.');
        console.error('Error fetching collection words:', err);
        setPalabras([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, [codigo]);

  // Log initial state to console once all data is loaded
  useEffect(() => {
    if (!isLoading && !hasLogged.current && nombre) { // Ensure name is also loaded
      console.log('CONSOLA:', {
        Nombre: nombre,
        Visibilidad: visibilidad,
        Codigo: codigo,
        Palabras: palabras,
      });
      hasLogged.current = true;
    }
  }, [isLoading, nombre, visibilidad, codigo, palabras]);

  const handleWordChange = (index: number, value: string) => {
    const newPalabras = [...palabras];
    newPalabras[index].palabra = value;
    setPalabras(newPalabras);
  };

  const addWordInput = () => {
    setPalabras([...palabras, { id: null, palabra: '' }]);
  };

  const removeWordInput = (index: number) => {
    setPalabras(palabras.filter((_, i) => i !== index));
  };

  const handleGoBack = () => {
    navigate('/my-collections');
  };

  const handleSaveChanges = async () => {
    if (!nombre.trim()) {
      setError('El nombre de la colección no puede estar vacío.');
      setSuccessMessage(null);
      return;
    }
    setError(null);

    const payload = {
      nombre,
      visibilidad,
      palabras: palabras.filter(p => p.palabra.trim() !== ''),
    };

    try {
      const response = await api.patch(`/colecciones/usuario/${codigo}`, payload);
      if (response.status === 200) {
        setError(null);
        setSuccessMessage('Actualización exitosa');
        setTimeout(() => {
          navigate('/my-collections');
        }, 2000);
      } else {
        setSuccessMessage(null);
        setError(`Error al guardar: ${response.statusText}`);
      }
    } catch (err: any) {
      setSuccessMessage(null);
      console.error('Error saving changes:', err);
      const errorMessage = err.response?.data?.message || 'Error al guardar los cambios.';
      setError(errorMessage);
    }
  };

  const inputStyle = "w-full p-3 rounded-md bg-black text-white border border-[#22c55e] focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.3)]";

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center font-['Chakra_Petch']">
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl pt-20 pb-20 px-4">
        <h1 className="text-5xl font-extrabold mb-2 text-white text-center drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">EDITAR COLECCIÓN</h1>
        <h2 className="text-2xl font-bold text-[#22c55e] mb-8 text-center drop-shadow-[0_0_5px_rgba(34,197,94,0.7)]">
          #{codigo}
        </h2>

        {error && <p className="text-red-500 text-lg mb-4 bg-red-900/50 border border-red-500 rounded-md p-3">{error}</p>}
        {successMessage && <p className="text-green-400 text-lg mb-4 bg-green-900/50 border border-green-500 rounded-md p-3">{successMessage}</p>}

        <div className="w-full bg-black/50 rounded-lg p-6 mb-8 border border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <div className="mb-6">
            <label htmlFor="collectionName" className="block text-xl font-semibold text-white mb-2">Nombre</label>
            <input
              id="collectionName"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputStyle}
              placeholder="Nombre de la colección"
            />
          </div>

          <div className="mb-8">
            <label htmlFor="visibility" className="block text-xl font-semibold text-white mb-2">Visibilidad</label>
            <select
              id="visibility"
              value={visibilidad}
              onChange={(e) => setVisibilidad(e.target.value as Visibilidad)}
              className={inputStyle}
            >
              <option value="PUBLICA">PÚBLICA</option>
              <option value="PRIVADA">PRIVADA</option>
              <option value="COMPARTIDA">COMPARTIDA</option>
            </select>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Palabras</h3>
            {isLoading ? (
              <p className="text-center text-gray-400">Cargando palabras...</p>
            ) : (
              palabras.map((palabra, index) => (
                <div key={palabra.id || `new-${index}`} className="flex items-center space-x-2 mb-3">
                  <input
                    type="text"
                    placeholder={`Palabra ${index + 1}`}
                    value={palabra.palabra}
                    onChange={(e) => handleWordChange(index, e.target.value)}
                    className={inputStyle}
                  />
                  <button
                    onClick={() => removeWordInput(index)}
                    className="p-2 rounded-full bg-transparent text-[#c52222] hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-[#c52222] border border-[#c52222]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))
            )}
            <button
              onClick={addWordInput}
              className="w-full py-3 mt-4 text-[#22c55e] border-2 border-dashed border-[#22c55e] rounded-md hover:bg-[#22c55e]/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            >
              + AÑADIR PALABRA
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4 w-full">
            <Button
              onClick={handleGoBack}
              className="bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all"
            >
              Volver
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="bg-[#22c55e] text-black font-bold py-2 px-4 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:bg-green-400 transition-all duration-300"
              disabled={!!successMessage}
            >
              Guardar Cambios
            </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCollectionPage;
