import { create } from 'zustand';
import { CATEGORIES } from '../constants/game';
import { gameService } from '../lib/supabase';

export type GameState = 'home' | 'setup' | 'players' | 'reveal' | 'countdown' | 'round' | 'voting' | 'elimination' | 'results' | 'instructions' | 'settings';

interface Player {
  id: string;
  name: string;
  role: 'player' | 'impostor';
  word: string;
  hint?: string;
  isRevealed: boolean;
  votes: number;
  isEliminated: boolean;
}

interface GameStore {
  gameState: GameState;
  players: Player[];
  impostorCount: number;
  category: string;
  word: string;
  wordHint: string;
  impostorHintEnabled: boolean;
  roundTime: number;
  currentTime: number;
  winner: 'players' | 'impostor' | null;
  revealingPlayerIndex: number;
  lastEliminatedPlayer: Player | null;
  
  // Dynamic categories fetched from Supabase (falls back to local CATEGORIES)
  categories: Array<{ id: string; name: string; icon: string; color: string; words: Array<{ word: string; hint: string }> }>;
  isLoading: boolean;
  
  // Draft state for two-step setup
  draftPlayerNames: string[];
  draftConfig: { impostorCount: number, category: string, word: string, wordHint: string, time: number, impostorHintEnabled: boolean } | null;
  
  // Actions
  setGameState: (state: GameState) => void;
  prepareSetup: (playerNames: string[], impostorCount: number, category: string, word: string, wordHint: string, time: number, impostorHintEnabled: boolean) => void;
  setSetup: (playerNames: string[]) => void;
  nextReveal: () => void;
  startCountdown: () => void;
  startRound: () => void;
  tick: () => void;
  votePlayer: (playerId: string) => void;
  nextRound: () => void;
  endGame: (winner: 'players' | 'impostor') => void;
  resetGame: () => void;
  loadGameData: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'home',
  players: [],
  impostorCount: 1,
  category: '',
  word: '',
  wordHint: '',
  impostorHintEnabled: false,
  roundTime: 60,
  currentTime: 60,
  winner: null,
  revealingPlayerIndex: 0,
  lastEliminatedPlayer: null,
  draftPlayerNames: [],
  draftConfig: null,
  
  // Default values from static constants
  categories: CATEGORIES,
  isLoading: false,

  setGameState: (state) => set({ gameState: state }),

  prepareSetup: (playerNames, impostorCount, category, word, wordHint, time, impostorHintEnabled) => {
    set({
      draftPlayerNames: playerNames,
      draftConfig: { impostorCount, category, word, wordHint, time, impostorHintEnabled },
      gameState: 'players'
    });
  },

  setSetup: (playerNames) => {
    const config = get().draftConfig;
    if (!config) return;
    
    // Randomize roles
    const playerRoles: Array<'player' | 'impostor'> = new Array(playerNames.length).fill('player');
    let assignedImpostors = 0;
    while (assignedImpostors < config.impostorCount) {
      const idx = Math.floor(Math.random() * playerNames.length);
      if (playerRoles[idx] !== 'impostor') {
        playerRoles[idx] = 'impostor';
        assignedImpostors++;
      }
    }

    const players: Player[] = playerNames.map((name, i) => ({
      id: crypto.randomUUID(),
      name,
      role: playerRoles[i],
      word: playerRoles[i] === 'impostor' ? '' : config.word,
      hint: playerRoles[i] === 'impostor' && config.impostorHintEnabled ? config.wordHint : undefined,
      isRevealed: false,
      votes: 0,
      isEliminated: false
    }));

    set({
      players,
      impostorCount: config.impostorCount,
      category: config.category,
      word: config.word,
      wordHint: config.wordHint,
      impostorHintEnabled: config.impostorHintEnabled,
      roundTime: config.time,
      currentTime: config.time,
      gameState: 'reveal',
      revealingPlayerIndex: 0,
      winner: null
    });
  },

  nextReveal: () => {
    const { revealingPlayerIndex, players } = get();
    if (revealingPlayerIndex < players.length - 1) {
      set({ revealingPlayerIndex: revealingPlayerIndex + 1 });
    } else {
      set({ gameState: 'countdown' });
    }
  },

  startCountdown: () => set({ gameState: 'countdown' }),

  startRound: () => set({ gameState: 'round' }),

  tick: () => {
    const { currentTime } = get();
    if (currentTime > 0) {
      set({ currentTime: currentTime - 1 });
    } else {
      set({ gameState: 'voting' });
    }
  },

  votePlayer: (playerId) => {
    const { players } = get();
    
    const updatedPlayers = players.map(p => 
      p.id === playerId ? { ...p, isEliminated: true } : p
    );
    
    const eliminatedPlayer = updatedPlayers.find(p => p.id === playerId) || null;
    set({ players: updatedPlayers, lastEliminatedPlayer: eliminatedPlayer });

    const aliveImpostors = updatedPlayers.filter(p => p.role === 'impostor' && !p.isEliminated).length;
    const aliveNormals = updatedPlayers.filter(p => p.role === 'player' && !p.isEliminated).length;

    if (aliveImpostors === 0) {
      get().endGame('players');
    } else if (aliveImpostors >= aliveNormals) {
      get().endGame('impostor');
    } else {
      set({ gameState: 'elimination' });
    }
  },

  nextRound: () => {
    const { roundTime } = get();
    set({
      currentTime: roundTime,
      gameState: 'round'
    });
  },

  endGame: (winner) => set({ gameState: 'results', winner }),

  resetGame: () => set({
    gameState: 'home',
    players: [],
    winner: null,
    revealingPlayerIndex: 0,
    lastEliminatedPlayer: null
  }),

  loadGameData: async () => {
    set({ isLoading: true });
    try {
      const [supabaseCats, supabaseWords] = await Promise.all([
        gameService.getCategories(),
        gameService.getWords()
      ]);

      if (supabaseCats && supabaseWords && supabaseCats.length > 0) {
        // Mapear las palabras asociadas a sus respectivas categorías
        const mappedCategories = supabaseCats.map(cat => {
          const associatedWords = supabaseWords
            .filter(w => w.category_id === cat.id)
            .map(w => ({ word: w.word, hint: w.hint }));
          
          return {
            id: cat.id,
            name: cat.name,
            icon: cat.icon,
            color: cat.color,
            words: associatedWords
          };
        }).filter(cat => cat.words.length > 0); // Omitimos categorías que hayan quedado vacías

        if (mappedCategories.length > 0) {
          set({ categories: mappedCategories });
          console.log('✅ Datos de juego cargados exitosamente desde Supabase.');
        } else {
          console.warn('⚠️ Se obtuvieron categorías vacías de Supabase, manteniendo fallback local.');
        }
      } else {
        console.log('ℹ️ No se pudo cargar desde Supabase (posiblemente sin claves o DB vacía). Usando datos locales.');
      }
    } catch (err) {
      console.error('❌ Error cargando datos de Supabase, usando fallback local:', err);
    } finally {
      set({ isLoading: false });
    }
  }
}));

