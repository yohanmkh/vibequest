// Authentication types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt: Date;
  stats: {
    totalXp: number;
    level: number;
    completedSteps: number;
    currentClass?: string;
    currentPlatform?: string;
    currentStack?: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

