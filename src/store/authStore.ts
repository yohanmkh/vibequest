// Authentication store
import { create } from 'zustand';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';

// Simple localStorage persistence
const STORAGE_KEY = 'vibequest-auth';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

// Simulate API calls (in real app, these would call a backend)
const simulateAPICall = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Generate a simple user ID
const generateUserId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Load initial state from localStorage
const loadFromStorage = (): Partial<AuthState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (parsed.user) {
        parsed.user.createdAt = new Date(parsed.user.createdAt);
        parsed.user.lastLoginAt = new Date(parsed.user.lastLoginAt);
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }
  return { user: null, isAuthenticated: false };
};

// Save to localStorage
const saveToStorage = (state: Partial<AuthState>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }));
  } catch (error) {
    console.error('Failed to save auth to storage:', error);
  }
};

const initialState = loadFromStorage();

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: initialState.user ?? null,
  isAuthenticated: initialState.isAuthenticated ?? false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await simulateAPICall(null, 800);
      
      // In a real app, validate credentials with backend
      // For now, accept any email/password (demo mode)
      const user: User = {
        id: generateUserId(),
        email: credentials.email,
        username: credentials.email.split('@')[0],
        createdAt: new Date(),
        lastLoginAt: new Date(),
        stats: {
          totalXp: 0,
          level: 1,
          completedSteps: 0,
        },
      };

      const newState = {
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

      set(newState);
      saveToStorage(newState);

      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: 'Login failed. Please check your credentials.',
      });
      return false;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    // Validate
    if (data.password !== data.confirmPassword) {
      set({
        isLoading: false,
        error: 'Passwords do not match',
      });
      return false;
    }

    if (data.password.length < 6) {
      set({
        isLoading: false,
        error: 'Password must be at least 6 characters',
      });
      return false;
    }

    try {
      // Simulate API call
      await simulateAPICall(null, 1000);

      const user: User = {
        id: generateUserId(),
        email: data.email,
        username: data.username,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        stats: {
          totalXp: 0,
          level: 1,
          completedSteps: 0,
        },
      };

      const newState = {
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

      set(newState);
      saveToStorage(newState);

      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: 'Registration failed. Please try again.',
      });
      return false;
    }
  },

  logout: () => {
    const newState = {
      user: null,
      isAuthenticated: false,
      error: null,
    };
    set(newState);
    saveToStorage(newState);
  },

  updateUser: (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      const newState = { user: updatedUser };
      set(newState);
      saveToStorage(newState);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
