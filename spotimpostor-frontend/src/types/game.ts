export interface GameMode {
    modo: string;
    descripcion: string;
}  
  export interface Collection {
    id: string;
    name: string;
    category: 'GENERAL' | 'PUBLICA' | 'COMPARTIDA' | 'PRIVADA';
  }
  
  export interface Player {
    id: string;
    name: string;
    role?: 'CIVIL' | 'IMPOSTOR';
    word?: string;
    isReady: boolean; // Para la validación de la Sala de Espera
    isEliminated: boolean; // ¿Ya fue eliminado del juego?
  }
  
  export type GamePhase = 'SETUP_MODE' | 'SETUP_COLL' | 'SETUP_PLAYERS' | 'LOBBY' | 'INGAME' | 'RESULTS';
  
  export interface GameState {
    modes: GameMode[];
    collections: Collection[];
    selectedMode: GameMode | null;
    selectedCollection: Collection | null;
    players: Player[];
    impostorCount: number;
    currentPhase: GamePhase;
    loading: boolean;
    // New fields for game creation
    modo: string;
    nombreColeccion: string;
    tipoColeccion: 'GENERAL' | 'PUBLICA' | 'COMPARTIDA' | 'PRIVADA';
    codigoColeccion: string | null;
    cantidadJugadores: number;
    cantidadImpostores: number;
    correo: string | null;
    jugadores: string[];
    gameResult: GameResult | null; // Store the backend response here
    gameTime: number;
  }

  export interface GamePlayerData {
    jugador: string;
    rol: 'CIVIL' | 'IMPOSTOR';
    palabra: string;
  }

  export interface LobbyPlayer extends GamePlayerData {
    id: string;
    isReady: boolean;
  }
  
  export interface GameResult {
    data: GamePlayerData[];
  }