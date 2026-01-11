import { create } from 'zustand';
import { GameState, GameResources, PlayerClass, Platform, Stack, Phase } from '../types';

interface GameStore extends GameState {
  // Actions
  setPlayerClass: (playerClass: PlayerClass) => void;
  setPlatform: (platform: Platform) => void;
  setStack: (stack: Stack) => void;
  setCurrentPhase: (phase: Phase) => void;
  setCurrentTaskIndex: (index: number) => void;
  updateResources: (updates: Partial<GameResources>) => void;
  addToInventory: (item: string) => void;
  completeTask: (taskId: string) => void;
  resetGame: () => void;
  consumeCoffee: (amount: number) => boolean;
  consumeSanity: (amount: number) => boolean;
  regenerateCoffee: () => void;
}

const initialResources: GameResources = {
  sanity: 100,
  coffee: 50,
  xp: 0,
  level: 1,
  // NEW: Enhanced stats
  techDebt: 0,
  aiTrust: 75,
  codeQuality: 50,
  burnoutRisk: 0,
  deploymentReadiness: 100,
};

const initialState: GameState = {
  playerClass: null,
  platform: null,
  stack: null,
  currentPhase: 'initialization',
  currentTaskIndex: 0,
  resources: initialResources,
  inventory: [],
  completedTasks: [],
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setPlayerClass: (playerClass) => set({ playerClass }),

  setPlatform: (platform) => set({ platform }),

  setStack: (stack) => set({ stack }),

  setCurrentPhase: (phase) => set({ currentPhase: phase }),

  setCurrentTaskIndex: (index) => set({ currentTaskIndex: index }),

  updateResources: (updates) =>
    set((state) => ({
      resources: { ...state.resources, ...updates },
    })),

  addToInventory: (item) =>
    set((state) => ({
      inventory: [...state.inventory, item],
    })),

  completeTask: (taskId) =>
    set((state) => ({
      completedTasks: [...state.completedTasks, taskId],
    })),

  resetGame: () => set(initialState),

  consumeCoffee: (amount) => {
    const state = get();
    if (state.resources.coffee >= amount) {
      set((s) => ({
        resources: { ...s.resources, coffee: s.resources.coffee - amount },
      }));
      return true;
    }
    return false;
  },

  consumeSanity: (amount) => {
    const state = get();
    const newSanity = Math.max(0, state.resources.sanity - amount);
    set((s) => ({
      resources: { ...s.resources, sanity: newSanity },
    }));
    return newSanity > 0;
  },

  regenerateCoffee: () => {
    set((state) => {
      const newCoffee = Math.min(100, state.resources.coffee + 1);
      return {
        resources: { ...state.resources, coffee: newCoffee },
      };
    });
  },
}));

