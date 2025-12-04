export type PlayerClass = 'vibe-surfer' | 'co-pilot' | '10x-architect';
export type Platform = 'web' | 'mobile';
export type Stack = 'react-node' | 'flutter-firebase' | 'nextjs-prisma';
export type Phase = 'initialization' | 'skeleton' | 'brain' | 'production';
export type TaskStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface GameResources {
  sanity: number;
  coffee: number;
  xp: number;
  level: number;
}

export interface GameState {
  playerClass: PlayerClass | null;
  platform: Platform | null;
  stack: Stack | null;
  currentPhase: Phase;
  currentTaskIndex: number;
  resources: GameResources;
  inventory: string[];
  completedTasks: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'prompt-battle' | 'drag-drop' | 'code-review' | 'console-warfare' | 'hallucination-hunter' | 'css-clash' | 'schema-panic' | 'ci-cd-gauntlet' | 'setup';
  status: TaskStatus;
  coffeeCost: number;
  sanityCost?: number;
  xpReward: number;
  challenge?: Challenge;
}

export interface Challenge {
  type: string;
  prompt?: string;
  options?: string[];
  correctAnswer?: number | string;
  code?: string;
  bug?: string;
  error?: string;
  schema?: any;
}

export interface PhaseData {
  id: Phase;
  title: string;
  description: string;
  tasks: Task[];
}

export interface Curriculum {
  class: PlayerClass;
  platform: Platform;
  stack: Stack;
  phases: PhaseData[];
}

export interface VibeCheckResult {
  success: boolean;
  message: string;
  sanityChange: number;
  coffeeChange: number;
  xpGained: number;
  bug?: string;
  solution?: string;
}

