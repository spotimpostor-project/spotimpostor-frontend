import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { GameMode, Collection, Player, GamePhase } from '../types/game'; // Assuming these types are correctly defined

// Define the initial state for the game
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

const initialGameState: GameState = {
  modes: [],
  collections: [],
  selectedMode: null,
  selectedCollection: null,
  players: [],
  impostorCount: 0,
  currentPhase: 'SETUP_MODE',
  loading: false,
};

// Define action types
type GameAction =
  | { type: 'SET_SELECTED_MODE'; payload: GameMode | null }
  | { type: 'SET_GAME_MODES'; payload: GameMode[] }
  | { type: 'SET_CURRENT_PHASE'; payload: GamePhase };
  // Add other actions as needed

// Reducer function to manage state changes
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_SELECTED_MODE':
      return { ...state, selectedMode: action.payload };
    case 'SET_GAME_MODES':
        return { ...state, modes: action.payload };
    case 'SET_CURRENT_PHASE':
        return { ...state, currentPhase: action.payload };
    default:
      return state;
  }
};

// Create the context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Create a provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
