import { GameMode, Collection, Player, GamePhase, GameState, GameResult } from '../types/game';

export const initialGameState: GameState = {
  gameId: null,
  hostId: null,
  modes: [],
  collections: [],
  selectedMode: null,
  selectedCollection: null,
  players: [],
  impostorCount: 0,
  currentPhase: 'SETUP_MODE',
  loading: false,
  modo: '',
  nombreColeccion: '',
  tipoColeccion: 'GENERAL',
  codigoColeccion: null,
  cantidadJugadores: 0,
  cantidadImpostores: 0,
  correo: null,
  jugadores: [],
  gameResult: null,
  gameTime: 0,
};

// Define action types
export type GameAction =
  | { type: 'SET_SELECTED_MODE'; payload: GameMode | null }
  | { type: 'SET_GAME_MODES'; payload: GameMode[] }
  | { type: 'SET_SELECTED_COLLECTION'; payload: Collection | null }
  | { type: 'SET_CURRENT_PHASE'; payload: GamePhase }
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'SET_IMPOSTOR_COUNT'; payload: number }
  | { type: 'CREATE_GAME'; payload: { gameId: string; hostId: string; players: Player[]; impostorCount: number } }
  | { type: 'JOIN_GAME'; payload: { gameId: string; players: Player[] } }
  | { type: 'LEAVE_GAME'; payload: undefined }
  | { type: 'SET_MODE'; payload: string }
  | { type: 'SET_COLLECTION_DATA'; payload: { nombreColeccion: string; tipoColeccion: 'GENERAL' | 'PUBLICA' | 'COMPARTIDA' | 'PRIVADA'; }; }
  | { type: 'SET_PLAYER_DATA'; payload: { jugadores: string[]; cantidadJugadores: number; cantidadImpostores: number; }; }
  | { type: 'SET_GAME_RESULT'; payload: GameResult; }
  | { type: 'SET_GAME_TIME'; payload: number }
  | { type: 'UPDATE_PLAYER_READY_STATUS'; payload: { playerId: string; isReady: boolean } };

// Reducer function to manage state changes
export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_SELECTED_MODE':
      return { ...state, selectedMode: action.payload };
    case 'SET_GAME_MODES':
        return { ...state, modes: action.payload };
    case 'SET_SELECTED_COLLECTION':
        return { ...state, selectedCollection: action.payload };
    case 'SET_CURRENT_PHASE':
        return { ...state, currentPhase: action.payload };
    case 'SET_PLAYERS':
        return { ...state, players: action.payload };
    case 'SET_IMPOSTOR_COUNT':
        return { ...state, impostorCount: action.payload };
    case 'CREATE_GAME':
      return {
        ...state,
        gameId: action.payload.gameId,
        hostId: action.payload.hostId,
        players: action.payload.players,
        impostorCount: action.payload.impostorCount,
        currentPhase: 'LOBBY',
      };
    case 'JOIN_GAME':
      return {
        ...state,
        gameId: action.payload.gameId,
        players: action.payload.players,
        currentPhase: 'LOBBY',
      };
    case 'LEAVE_GAME':
      return {
        ...initialGameState, // Reset to initial state when leaving a game
      };
    case 'SET_MODE':
      return {
        ...state,
        modo: action.payload,
      };
    case 'SET_COLLECTION_DATA':
      return {
        ...state,
        nombreColeccion: action.payload.nombreColeccion,
        tipoColeccion: action.payload.tipoColeccion,
      };
    case 'SET_PLAYER_DATA':
      return {
        ...state,
        jugadores: action.payload.jugadores,
        cantidadJugadores: action.payload.cantidadJugadores,
        cantidadImpostores: action.payload.cantidadImpostores,
      };
    case 'SET_GAME_RESULT':
      return {
        ...state,
        gameResult: action.payload,
        players: state.players.map((p: Player) => {
          const resultData = action.payload.data.find(r => r.jugador === p.id);
          return resultData ? { ...p, role: resultData.rol, word: resultData.palabra } : p;
        }),
      };
    case 'SET_GAME_TIME':
      return { ...state, gameTime: action.payload };
    case 'UPDATE_PLAYER_READY_STATUS':
      return {
        ...state,
        players: state.players.map((p: Player) =>
          p.id === action.payload.playerId ? { ...p, isReady: action.payload.isReady } : p
        ),
      };
    default:
      return state;
  }
};
