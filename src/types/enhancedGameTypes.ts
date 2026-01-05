// Enhanced types for VibeQuest game mechanics
// These types extend the existing system without breaking changes

import { PlayerClass, Platform, Stack, Phase } from './index';

// ============================================
// ENHANCED GAME RESOURCES
// ============================================

export interface EnhancedGameResources {
  // Existing stats
  sanity: number;        // 0-100: Mental state
  coffee: number;        // 0-100: Energy/action points
  xp: number;            // Experience points
  level: number;         // Player level
  
  // NEW hidden/visible stats
  techDebt: number;      // 0-100: Accumulated shortcuts
  aiTrust: number;       // 0-100: AI reliability score
  codeQuality: number;   // 0-100: Overall code health
  
  // Computed stats (derived)
  burnoutRisk: number;   // Computed from sanity patterns
  deploymentReadiness: number; // Computed from techDebt + codeQuality
}

export const DEFAULT_ENHANCED_RESOURCES: EnhancedGameResources = {
  sanity: 100,
  coffee: 50,
  xp: 0,
  level: 1,
  techDebt: 0,
  aiTrust: 75,
  codeQuality: 50,
  burnoutRisk: 0,
  deploymentReadiness: 100,
};

// ============================================
// DECISION SYSTEM
// ============================================

export interface DecisionPoint {
  id: string;
  stepId: string;
  trigger: 'before-step' | 'after-step' | 'on-failure';
  title: string;
  scenario: string;
  options: DecisionOption[];
  timeLimit?: number; // Seconds, optional pressure mechanic
  category: DecisionCategory;
}

export type DecisionCategory = 
  | 'scope-management'
  | 'quality-tradeoff'
  | 'ai-usage'
  | 'time-management'
  | 'technical-choice';

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  consequences: Consequences;
  isOptimal: boolean;
  reasoning: string; // Revealed after selection
  requirements?: ResourceRequirement[];
  skillDemonstrated?: SkillType;
}

export interface Consequences {
  sanityChange?: number;
  coffeeChange?: number;
  xpChange?: number;
  techDebtChange?: number;
  aiTrustChange?: number;
  codeQualityChange?: number;
  unlocksScenario?: string;
  modifiesStep?: StepModifier;
  addsBug?: BugDefinition;
  unlocksBadge?: string;
}

export interface ResourceRequirement {
  stat: keyof EnhancedGameResources;
  minValue: number;
  errorMessage: string;
}

export interface StepModifier {
  stepId: string;
  changes: {
    addValidation?: ValidationRule[];
    increaseDifficulty?: boolean;
    addBugToFix?: string;
    addRequiredConcept?: string;
  };
}

export interface BugDefinition {
  id: string;
  type: 'syntax' | 'logic' | 'type' | 'security' | 'performance';
  description: string;
  location: { file: string; line?: number };
  severity: 'low' | 'medium' | 'high' | 'critical';
  willManifestAt?: string; // Step ID when bug becomes visible
}

export type SkillType = 
  | 'debugging'
  | 'testing'
  | 'security'
  | 'devops'
  | 'architecture'
  | 'communication'
  | 'project-management'
  | 'code-review'
  | 'research'
  | 'prompting';

// ============================================
// SCENARIO/EVENT SYSTEM
// ============================================

export type ScenarioCategory = 
  | 'scope-change'
  | 'bug-report'
  | 'security-alert'
  | 'ci-failure'
  | 'team-conflict'
  | 'ai-hallucination'
  | 'deadline-pressure'
  | 'tech-debt-payoff'
  | 'performance-issue'
  | 'customer-feedback';

export interface GameScenario {
  id: string;
  category: ScenarioCategory;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  triggeredBy: ScenarioTrigger;
  options: ScenarioOption[];
  timeLimit?: number;
  isBlocking: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedStep?: string;
}

export interface ScenarioTrigger {
  type: 'stat-threshold' | 'step-completion' | 'random' | 'decision-consequence' | 'time-based';
  condition?: TriggerCondition;
}

export interface TriggerCondition {
  stat?: keyof EnhancedGameResources;
  operator?: '>' | '<' | '==' | '>=' | '<=';
  value?: number;
  stepId?: string;
  chance?: number; // 0-1 for random triggers
  afterMinutes?: number; // For time-based triggers
}

export interface ScenarioOption {
  id: string;
  label: string;
  description: string;
  requirements?: ResourceRequirement[];
  consequences: Consequences;
  skillDemonstrated?: SkillType;
  followUpScenario?: string; // Chain scenarios
}

export interface ScenarioResolution {
  scenarioId: string;
  optionChosen: string;
  timestamp: number;
  consequencesApplied: Consequences;
}

// ============================================
// VERIFICATION SYSTEM
// ============================================

export type VerificationMode = 
  | 'explain-code'
  | 'predict-output'
  | 'spot-the-bug'
  | 'refactor-challenge'
  | 'security-review'
  | 'performance-analysis';

export interface VerificationChallenge {
  id: string;
  mode: VerificationMode;
  title: string;
  description: string;
  
  // For explain-code
  codeToExplain?: string;
  requiredConcepts?: string[];
  conceptHints?: Record<string, string>;
  
  // For predict-output
  codeToRun?: string;
  inputValues?: Record<string, any>;
  expectedOutput?: string;
  outputOptions?: string[]; // Multiple choice
  
  // For spot-the-bug
  buggyCode?: string;
  bugLocation?: { line: number; description: string };
  bugType?: BugDefinition['type'];
  
  // For refactor-challenge
  messyCode?: string;
  refactorGoals?: string[];
  idealSolution?: string;
  
  // Rewards
  xpReward: number;
  aiTrustBonus: number;
  timeBonus?: { seconds: number; bonusXp: number };
}

export interface VerificationResult {
  passed: boolean;
  score: number; // 0-100
  feedback: string[];
  conceptsMatched: string[];
  conceptsMissed: string[];
  bonusAwarded?: string;
}

// ============================================
// PROMPT QUALITY SYSTEM
// ============================================

export interface PromptAnalysis {
  score: number; // 0-100
  breakdown: PromptScoreBreakdown;
  feedback: PromptFeedback[];
  improvedVersion?: string;
  category: PromptQualityCategory;
}

export interface PromptScoreBreakdown {
  specificity: number;    // How specific is the request
  context: number;        // Includes relevant context
  constraints: number;    // Requirements specified
  examples: number;       // Includes examples
  structure: number;      // Well-organized
}

export interface PromptFeedback {
  type: 'improvement' | 'warning' | 'praise';
  message: string;
  suggestion?: string;
}

export type PromptQualityCategory = 
  | 'excellent'    // 80-100
  | 'good'         // 60-79
  | 'acceptable'   // 40-59
  | 'poor'         // 20-39
  | 'vague';       // 0-19

// ============================================
// DIFFICULTY CONFIGURATION
// ============================================

export interface DifficultyConfig {
  class: PlayerClass;
  levelRange: [number, number]; // [min, max] level for this config
  modifiers: DifficultyModifiers;
}

export interface DifficultyModifiers {
  // AI Assistance Level
  aiCodeCompleteness: number;    // 0-1: How complete is AI-generated code
  aiHintAvailability: boolean;
  promptTemplatesShown: boolean;
  
  // Challenge Requirements
  verificationRequired: boolean;
  testCoverageRequired: number;  // 0-100%
  codeReviewRequired: boolean;
  
  // Resource Pressure
  coffeeDrainMultiplier: number;
  sanityRecoveryRate: number;
  scenarioFrequency: number;     // 0-1
  
  // Hidden Mechanics
  hiddenStats: (keyof EnhancedGameResources)[];
  aiHallucinationRate: number;   // 0-1
  
  // Rewards
  xpMultiplier: number;
  bonusOpportunityRate: number;
}

// ============================================
// DELIVERABLES SYSTEM
// ============================================

export type DeliverableType = 
  | 'readme'
  | 'architecture'
  | 'tests'
  | 'deployment'
  | 'documentation'
  | 'demo'
  | 'api-docs'
  | 'changelog';

export interface ProjectDeliverable {
  id: string;
  type: DeliverableType;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'draft' | 'complete';
  requiredForCompletion: boolean;
  generatedContent?: string;
  userModifications?: string[];
  qualityScore?: number;
  feedback?: string[];
  checklistItems?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  autoChecked: boolean;
  verificationRule?: ValidationRule;
}

export interface ProjectPortfolio {
  projectName: string;
  class: PlayerClass;
  platform: Platform;
  stack: Stack;
  startedAt: number;
  completedAt?: number;
  deliverables: ProjectDeliverable[];
  stats: ProjectStats;
  achievements: Achievement[];
  decisionHistory: DecisionResolution[];
  scenarioHistory: ScenarioResolution[];
}

export interface ProjectStats {
  totalXpEarned: number;
  techDebtFinal: number;
  aiTrustFinal: number;
  scenariosResolved: number;
  promptsWritten: number;
  verificationsPassed: number;
  linesOfCode: number;
  testCoverage: number;
  timeSpentMinutes: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface DecisionResolution {
  decisionId: string;
  optionChosen: string;
  timestamp: number;
  wasOptimal: boolean;
}

// ============================================
// VALIDATION RULES (Extended)
// ============================================

export interface ValidationRule {
  type: ValidationRuleType;
  value: string;
  errorMessage: string;
  severity?: 'warning' | 'error';
}

export type ValidationRuleType = 
  | 'file-exists'
  | 'code-contains'
  | 'code-not-contains'
  | 'test-passes'
  | 'no-errors'
  | 'no-warnings'
  | 'git-commit'
  | 'coverage-min'
  | 'no-any-types'
  | 'has-types'
  | 'imports-valid';

// ============================================
// AI USAGE TRACKING
// ============================================

export interface AIUsageEvent {
  id: string;
  type: AIUsageType;
  timestamp: number;
  prompt?: string;
  promptScore?: number;
  generatedCode?: string;
  wasVerified: boolean;
  wasModified: boolean;
  timeToAccept?: number; // Milliseconds between generation and acceptance
}

export type AIUsageType = 
  | 'code-generation'
  | 'code-completion'
  | 'code-explanation'
  | 'bug-fix'
  | 'refactoring'
  | 'test-generation'
  | 'documentation';

export interface AIUsageStats {
  totalPrompts: number;
  averagePromptScore: number;
  blindPasteCount: number;
  verifiedCount: number;
  modifiedCount: number;
  hallucinationsCaught: number;
}

// ============================================
// REFLECTION SYSTEM
// ============================================

export interface ReflectionCheckpoint {
  id: string;
  triggerAfterStep: string;
  title: string;
  description: string;
  questions: ReflectionQuestion[];
  minQualityScore: number;
  xpReward: number;
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  category: 'technical' | 'process' | 'ai-usage' | 'learning';
  expectedKeywords: string[];
  minLength: number;
  followUp?: string;
}

export interface ReflectionResponse {
  checkpointId: string;
  questionId: string;
  response: string;
  qualityScore: number;
  keywordsMatched: string[];
  timestamp: number;
}

// ============================================
// ENHANCED GAME STATE
// ============================================

export interface EnhancedGameState {
  // Core state
  playerClass: PlayerClass | null;
  platform: Platform | null;
  stack: Stack | null;
  currentPhase: Phase;
  currentStepId: string | null;
  
  // Resources
  resources: EnhancedGameResources;
  
  // Progress
  completedTasks: string[];
  completedVerifications: string[];
  completedReflections: string[];
  
  // Active elements
  activeScenario: GameScenario | null;
  activeDecision: DecisionPoint | null;
  pendingBugs: BugDefinition[];
  
  // History
  decisionHistory: DecisionResolution[];
  scenarioHistory: ScenarioResolution[];
  aiUsageHistory: AIUsageEvent[];
  reflectionHistory: ReflectionResponse[];
  
  // Portfolio
  portfolio: ProjectPortfolio | null;
  
  // Difficulty
  currentDifficulty: DifficultyModifiers;
}

// ============================================
// HELPER TYPES
// ============================================

export type StatChangeType = 'increase' | 'decrease' | 'set';

export interface StatChange {
  stat: keyof EnhancedGameResources;
  type: StatChangeType;
  amount: number;
  reason: string;
}

export interface GameEvent {
  id: string;
  type: 'stat-change' | 'decision' | 'scenario' | 'achievement' | 'level-up' | 'bug-introduced' | 'bug-fixed';
  timestamp: number;
  data: any;
  message: string;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const calculateBurnoutRisk = (resources: EnhancedGameResources): number => {
  // High burnout when low sanity + low coffee
  const sanityFactor = (100 - resources.sanity) / 100;
  const coffeeFactor = (100 - resources.coffee) / 100;
  return Math.round((sanityFactor * 0.6 + coffeeFactor * 0.4) * 100);
};

export const calculateDeploymentReadiness = (resources: EnhancedGameResources): number => {
  // Low tech debt + high code quality = ready to deploy
  const techDebtFactor = (100 - resources.techDebt) / 100;
  const qualityFactor = resources.codeQuality / 100;
  return Math.round((techDebtFactor * 0.5 + qualityFactor * 0.5) * 100);
};

export const getPromptQualityCategory = (score: number): PromptQualityCategory => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'acceptable';
  if (score >= 20) return 'poor';
  return 'vague';
};

export const canAffordAction = (
  resources: EnhancedGameResources, 
  cost: Partial<EnhancedGameResources>
): { canAfford: boolean; missing: string[] } => {
  const missing: string[] = [];
  
  if (cost.coffee && resources.coffee < cost.coffee) {
    missing.push(`Need ${cost.coffee} coffee (have ${resources.coffee})`);
  }
  if (cost.sanity && resources.sanity < cost.sanity) {
    missing.push(`Need ${cost.sanity} sanity (have ${resources.sanity})`);
  }
  
  return { canAfford: missing.length === 0, missing };
};
