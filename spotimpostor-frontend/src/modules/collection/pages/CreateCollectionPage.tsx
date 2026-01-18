import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../configs/api';
import { Button } from '../../../shared/components/Button';

const CreateCollectionPage: React.FC = () => {
  const [nombreColeccion, setNombreColeccion] = useState('');
  const [palabras, setPalabras] = useState<string[]>(['']);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleWordChange = (index: number, value: string) => {
    const newPalabras = [...palabras];
    newPalabras[index] = value;
    setPalabras(newPalabras);
  };

  const addWordInput = () => {
    setPalabras([...palabras, '']);
  };

  const removeWordInput = (index: number) => {
    setPalabras(palabras.filter((_, i) => i !== index));
  };

  const handleGoBack = () => {
    navigate('/my-collections');
  };

  const handleSaveCollection = async () => {
    if (nombreColeccion.trim() === '' || palabras.length < 3) {
      setError('El nombre de la colección no puede estar vacío y debe tener al menos 3 palabras.');
      return;
    }

    const token = localStorage.getItem('token_spot');
    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await api.post('/colecciones', {
        nombreColeccion,
        palabras,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.codigo === '200' && response.data.message === 'Registro exitoso') {
        setSuccessMessage('¡Colección creada con éxito!');
        setError(null);
        setTimeout(() => {
          navigate('/my-collections');
        }, 2000);
      } else {
        setError(response.data.message || 'Ocurrió un error al crear la colección.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocurrió un error de red.');
    }
  };

  const isSaveDisabled = nombreColeccion.trim() === '' || palabras.length < 3;

  const inputStyle = "w-full p-3 rounded-md bg-black text-white border border-[#22c55e] focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.3)]";

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center font-['Chakra_Petch']">
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl pt-20 pb-20 px-4">
        <h1 className="text-5xl font-extrabold mb-8 text-white text-center drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">CREAR COLECCIÓN</h1>

        {error && <p className="text-red-500 text-lg mb-4 bg-red-900/50 border border-red-500 rounded-md p-3">{error}</p>}
        {successMessage && <p className="text-green-400 text-lg mb-4 bg-green-900/50 border border-green-500 rounded-md p-3">{successMessage}</p>}

        <div className="w-full bg-black/50 rounded-lg p-6 mb-8 border border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <div className="mb-6">
            <label htmlFor="collectionName" className="block text-xl font-semibold text-white mb-2">Nombre</label>
            <input
              id="collectionName"
              type="text"
              value={nombreColeccion}
              onChange={(e) => setNombreColeccion(e.target.value)}
              className={inputStyle}
              placeholder="Nombre de la colección"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Palabras</h3>
            {palabras.map((palabra, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  placeholder={`Palabra ${index + 1}`}
                  value={palabra}
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
            ))}
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
              onClick={handleSaveCollection}
              className={`font-bold py-2 px-4 rounded-full transition-all duration-300 ${
                isSaveDisabled
                  ? 'bg-[#246b3e] text-black border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)]'
                  : 'bg-[#22c55e] text-black shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:bg-green-400'
              }`}
              disabled={isSaveDisabled}
            >
              GUARDAR
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionPage;
