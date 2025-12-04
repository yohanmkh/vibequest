// Enhanced types for step-by-step learning system

export interface MicroStep {
  id: string;
  title: string;
  description: string;
  learningObjective: string;
  type: 'code-generation' | 'prompt-writing' | 'code-review' | 'testing' | 'git' | 'deployment' | 'configuration';
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  order: number;
  coffeeCost: number;
  xpReward: number;
  
  // AI Tool Information - CORE FOCUS
  aiTool?: string; // Which AI tool to use (cursor, v0, replit, etc.)
  toolInstructions?: string[]; // Step-by-step how to use the tool
  examplePrompts?: string[]; // Example prompts for this step
  promptTemplate?: string; // Template for writing prompts
  toolTips?: string[]; // Tips for using the tool effectively
  
  // Code generation
  codeTemplate?: CodeTemplate;
  expectedFiles?: FileDefinition[];
  
  // Learning content
  explanation?: string;
  bestPractices?: string[];
  commonPitfalls?: string[];
  
  // Validation
  validationRules?: ValidationRule[];
  
  // Dependencies
  dependsOn?: string[];
}

export interface CodeTemplate {
  filePath: string;
  content: string;
  language: 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'json' | 'md';
  editable: boolean;
  placeholders?: Placeholder[];
}

export interface Placeholder {
  id: string;
  type: 'function' | 'variable' | 'import' | 'component' | 'style';
  hint: string;
  expectedValue?: string;
}

export interface FileDefinition {
  path: string;
  type: 'component' | 'api' | 'config' | 'test' | 'style' | 'type' | 'directory';
  description: string;
  template?: string;
}

export interface ValidationRule {
  type: 'file-exists' | 'code-contains' | 'test-passes' | 'no-errors' | 'git-commit';
  value: string;
  errorMessage: string;
}

export interface GeneratedCode {
  filePath: string;
  content: string;
  language: string;
  timestamp: number;
  generatedBy: 'ai' | 'user';
}

export interface FileSystemState {
  files: FileNode[];
  selectedFile: string | null;
  openFiles: string[];
}

export interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  content?: string;
  language?: string;
  children?: FileNode[];
  status?: 'new' | 'modified' | 'deleted' | 'unchanged';
}

export interface GitState {
  currentBranch: string;
  commits: Commit[];
  stagedFiles: string[];
  unstagedFiles: string[];
  branches: string[];
}

export interface Commit {
  hash: string;
  message: string;
  author: string;
  timestamp: number;
  files: string[];
}

export interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  error?: string;
  duration: number;
}

export interface TestSuite {
  suiteName: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  coverage?: number;
}

export interface BuildResult {
  success: boolean;
  output: string;
  errors: string[];
  warnings: string[];
  buildTime: number;
  bundleSize?: number;
}

export interface DeploymentState {
  environment: 'development' | 'staging' | 'production';
  status: 'idle' | 'building' | 'deploying' | 'deployed' | 'failed';
  url?: string;
  buildLog?: string[];
  deployedAt?: number;
}

export interface LearningAnalytics {
  stepsCompleted: number;
  totalSteps: number;
  averagePromptQuality: number;
  codeQualityScore: number;
  testCoverage: number;
  timeSpent: number;
  hintsUsed: number;
  errorsEncountered: number;
  achievements: string[];
}

