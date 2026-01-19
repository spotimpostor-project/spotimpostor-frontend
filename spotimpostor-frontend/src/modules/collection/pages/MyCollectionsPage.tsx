import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../configs/api';

// --- Icon Components ---
const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);

// --- Type Interface ---
interface Collection {
  codigo: string;
  nombre: string;
  visibilidad: 'PUBLICA' | 'PRIVADA' | 'COMPARTIDA';
}

const MyCollectionsPage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const response = await api.get('/colecciones/usuario');
        if (response.data && response.data.codigo === '200') {
          setCollections(response.data.data);
        } else {
          throw new Error(response.data.message || 'Error al cargar las colecciones');
        }
      } catch (err: any) {
        setError(err.message || 'No se pudo conectar al servidor.');
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const getVisibilityClass = (visibilidad: Collection['visibilidad']) => {
    const baseClasses = 'uppercase text-xs font-bold px-3 py-1 rounded-full border';
    const colorMap = {
      PUBLICA: 'bg-green-500/10 text-green-400 border-green-500/30',
      PRIVADA: 'bg-red-500/10 text-red-400 border-red-500/30',
      COMPARTIDA: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    };
    return `${baseClasses} ${colorMap[visibilidad] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`;
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-green-400 animate-pulse text-2xl">Cargando colecciones...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500 text-2xl">{error}</p>;
    }

    if (collections.length === 0) {
      return (
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="absolute -inset-2 rounded-full bg-transparent border-2 border-[#22c55e] drop-shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-[pulse-neon_4s_ease-in-out_infinite_reverse]"></div>
              <div className="relative w-20 h-20 bg-transparent rounded-full flex items-center justify-center">
                <FolderIcon className="w-10 h-10 text-[#22c55e]" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
              Tu Compendio Está Vacío
            </h2>
            <p className="font-bold text-gray-400 mb-12 max-w-sm">
              Crea tu primera colección de palabras para empezar a jugar partidas personalizadas.
            </p>
            <Link
              to="/create-collection"
              className="bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              CREAR COLECCIÓN
            </Link>
        </div>
      );
    }

    return (
        <>
            <Link
              to="/create-collection"
              className="bg-transparent text-[#22c55e] border-2 border-[#22c55e] font-bold rounded-full text-lg px-8 py-4 flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] hover:text-white transition-all mb-12"
            >
              <PlusIcon className="w-5 h-5" />
              CREAR COLECCIÓN
            </Link>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                <div 
                    key={collection.codigo} 
                    className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-6 shadow-lg flex flex-col justify-between text-center group hover:border-green-500/50 hover:shadow-green-500/10 transition-all duration-300"
                >
                    <div className="flex-grow flex flex-col justify-center">
                        <div className="flex justify-center mb-4">
                            <span className={getVisibilityClass(collection.visibilidad)}>
                                {collection.visibilidad}
                            </span>
                        </div>
                        <h3 className="text-white font-bold text-xl mb-1 group-hover:text-green-400 transition-colors">{collection.nombre}</h3>
                        <p className="font-mono text-sm text-gray-500">#{collection.codigo}</p>
                    </div>
                    <div className="mt-6">
                        <Link to={`/edit-collection/${collection.codigo}`} state={{ collection }}>
                            <button className="w-full bg-[#22c55e] text-black font-bold py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:bg-green-400 transition-all duration-300">
                                Editar
                            </button>
                        </Link>
                    </div>
                </div>
                ))}
            </div>
        </>
    );
  };

  return (
    <div className="relative min-h-screen bg-black text-white p-4 sm:p-8 flex flex-col items-center pt-24">
        {/* Background Effects from HomePage */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 bg-[radial-gradient(circle,rgba(34,197,94,0.15)_0%,transparent_70%)] animate-[pulse-neon_4s_ease-in-out_infinite]"></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:16px_16px] opacity-10 z-0 pointer-events-none"></div>

        <header className="relative z-10 text-center py-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
            Mis Colecciones
          </h1>
        </header>
        <main className="relative z-10 w-full flex flex-col items-center max-w-5xl">
          {renderContent()}
        </main>
    </div>
  );
};

export default MyCollectionsPage;
