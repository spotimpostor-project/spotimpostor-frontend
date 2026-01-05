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
  }