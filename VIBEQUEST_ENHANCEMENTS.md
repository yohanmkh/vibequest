# VibeQuest Enhancement Proposal
## Transforming Tutorial Fatigue into Engineering Mastery

---

## Executive Summary

This document proposes **incremental, realistic enhancements** to VibeQuest that transform it from a step-based tutorial into a **decision-driven engineering simulator**. The goal: students don't just follow steps—they **make engineering trade-offs**, face **real-world consequences**, and develop **judgment about AI-assisted development**.

---

## 1. Learning Experience Enhancements

### 1.1 Decision Points (Replace Passive Steps)

**Current Problem:** Students click "Next" without thinking.

**Solution:** Inject **decision gates** at critical moments.

```typescript
// New type: DecisionPoint
interface DecisionPoint {
  id: string;
  stepId: string; // Which step this decision belongs to
  trigger: 'before-step' | 'after-step' | 'on-failure';
  title: string;
  scenario: string;
  options: DecisionOption[];
  timeLimit?: number; // Optional pressure mechanic
}

interface DecisionOption {
  id: string;
  label: string;
  description: string;
  consequences: Consequences;
  isOptimal: boolean;
  reasoning: string; // Revealed after selection
}

interface Consequences {
  sanityChange: number;
  coffeeChange: number;
  xpChange: number;
  techDebtChange: number;      // NEW STAT
  aiTrustChange: number;       // NEW STAT
  unlocksScenario?: string;    // Trigger future event
  modifiesStep?: StepModifier;
}

interface StepModifier {
  stepId: string;
  changes: {
    addValidation?: ValidationRule[];
    increaseDifficulty?: boolean;
    addBugToFix?: string;
  };
}
```

**Example Decision Point (React Todo App):**

```typescript
const scopeCreepDecision: DecisionPoint = {
  id: 'decision-scope-1',
  stepId: 'skeleton-todo-list',
  trigger: 'before-step',
  title: '🚨 Scope Creep Alert!',
  scenario: `Your PM just messaged: "Can we add drag-and-drop sorting to the todo list? 
    It should only take a few minutes with AI, right?"
    
    You're halfway through the basic CRUD implementation.`,
  options: [
    {
      id: 'accept-scope',
      label: 'Accept the change',
      description: 'Use AI to quickly add drag-and-drop',
      consequences: {
        sanityChange: -15,
        coffeeChange: -20,
        xpChange: 10,
        techDebtChange: +25,
        aiTrustChange: -10,
        unlocksScenario: 'dnd-bug-scenario', // This will bite them later
      },
      isOptimal: false,
      reasoning: 'Adding features mid-sprint increases complexity. The AI-generated drag-and-drop will have edge cases you haven\'t tested.',
    },
    {
      id: 'defer-scope',
      label: 'Add to backlog',
      description: 'Finish current work first, schedule for next sprint',
      consequences: {
        sanityChange: +5,
        coffeeChange: 0,
        xpChange: 25,
        techDebtChange: 0,
        aiTrustChange: +5,
      },
      isOptimal: true,
      reasoning: 'Professional engineers protect their sprint scope. Completing work properly before adding features prevents integration bugs.',
    },
    {
      id: 'negotiate-scope',
      label: 'Negotiate MVP version',
      description: 'Offer simpler manual reordering via up/down buttons',
      consequences: {
        sanityChange: 0,
        coffeeChange: -10,
        xpChange: 30,
        techDebtChange: +5,
        aiTrustChange: +10,
      },
      isOptimal: true,
      reasoning: 'Excellent engineering judgment! You found a middle ground that delivers value without derailing the sprint.',
    },
  ],
};
```

### 1.2 Verification Stages (Anti-Blind-Copy-Paste)

**New Step Type:** `verification`

```typescript
interface VerificationStep extends MicroStep {
  type: 'verification';
  verificationMode: 'explain-code' | 'predict-output' | 'spot-the-bug' | 'refactor-challenge';
  
  // For explain-code
  codeToExplain?: string;
  requiredConcepts?: string[]; // Keywords student must mention
  
  // For predict-output
  codeToRun?: string;
  expectedOutput?: string;
  
  // For spot-the-bug (AI hallucination detection)
  buggyCode?: string;
  bugLocation?: { line: number; description: string };
  
  // For refactor-challenge
  messyCode?: string;
  refactorGoals?: string[];
}
```

**Example: After AI generates a useEffect hook**

```typescript
const verifyUseEffect: VerificationStep = {
  id: 'verify-useeffect-1',
  title: 'Verify: Do You Understand This Code?',
  type: 'verification',
  verificationMode: 'explain-code',
  learningObjective: 'Ensure you understand React useEffect before moving on',
  codeToExplain: `
useEffect(() => {
  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
  };
  fetchTodos();
}, []);
  `,
  requiredConcepts: ['dependency array', 'async', 'mount', 'side effect'],
  coffeeCost: 5,
  xpReward: 40, // High reward for understanding
  // ... other fields
};
```

### 1.3 Reflection Prompts

After every 3-5 completed steps, trigger a **reflection checkpoint**:

```typescript
interface ReflectionCheckpoint {
  id: string;
  triggerAfterStep: string;
  questions: ReflectionQuestion[];
  minQualityScore: number; // 0-100, based on keyword analysis
}

interface ReflectionQuestion {
  question: string;
  category: 'technical' | 'process' | 'ai-usage';
  expectedKeywords: string[];
  followUp?: string; // If answer is too short
}

const reflectionAfterCRUD: ReflectionCheckpoint = {
  id: 'reflection-crud',
  triggerAfterStep: 'brain-api-integration',
  questions: [
    {
      question: 'What was the hardest part of connecting your frontend to the API?',
      category: 'technical',
      expectedKeywords: ['async', 'error', 'state', 'loading'],
    },
    {
      question: 'How many times did you need to modify AI-generated code? Why?',
      category: 'ai-usage',
      expectedKeywords: ['prompt', 'context', 'edge case', 'type'],
    },
    {
      question: 'If you started over, what would you do differently?',
      category: 'process',
      expectedKeywords: ['plan', 'test', 'smaller', 'understand'],
    },
  ],
  minQualityScore: 60,
};
```

---

## 2. Enhanced Game Mechanics

### 2.1 Stats That Matter

**New Stats System:**

```typescript
interface EnhancedGameResources {
  // Existing
  sanity: number;     // 0-100
  coffee: number;     // 0-100
  xp: number;
  level: number;
  
  // NEW STATS
  techDebt: number;           // 0-100, HIDDEN initially
  aiTrust: number;            // 0-100, represents AI reliability score
  codeQuality: number;        // 0-100, affects deployment success
  
  // Derived/Computed
  burnoutRisk: number;        // Computed from sanity + coffee patterns
  deploymentReadiness: number; // Computed from techDebt + codeQuality
}
```

### 2.2 Stat Mechanics

| Stat | Increases When | Decreases When | Gameplay Impact |
|------|---------------|----------------|-----------------|
| **Sanity** | Successful tasks, breaks, good prompts | Failed tasks, hallucinations, scope creep | <30: Random "panic events", typos in generated code |
| **Coffee** | Time passage, coffee breaks | Task attempts, overtime | <20: Can't start new tasks, forced break |
| **Tech Debt** | Skipping tests, quick fixes, accepting all AI code | Refactoring, writing tests, code review | >70: Random bugs appear, deployment fails |
| **AI Trust** | Verifying AI output, good prompts, catching bugs | Blind copy-paste, hallucinations, skipped verification | <40: AI generates more bugs, worse suggestions |
| **Code Quality** | Tests, reviews, refactoring | Skipping validation, rushing | <50: Deployment blocked |

### 2.3 Sanity/Coffee Real Impact

```typescript
// In useEnhancedGameEngine.ts
const applySanityEffects = (sanity: number, generatedCode: string): string => {
  if (sanity < 30) {
    // Panic mode: introduce subtle issues
    const panicEffects = [
      { find: 'const', replace: 'let', chance: 0.3 },
      { find: '===', replace: '==', chance: 0.2 },
      { find: 'async ', replace: '', chance: 0.1 },
    ];
    // Apply random "mistakes" to AI output
    return applyPanicMutations(generatedCode, panicEffects);
  }
  return generatedCode;
};

const checkCoffeeLock = (coffee: number): CoffeeLockState => {
  if (coffee < 10) {
    return {
      locked: true,
      message: '☕ You need a break! Take a coffee break to continue.',
      unlockCost: 0, // Free break, but costs time
      breakDuration: 30, // seconds
    };
  }
  if (coffee < 20) {
    return {
      locked: false,
      warning: '⚠️ Running low on coffee. Consider a break soon.',
    };
  }
  return { locked: false };
};
```

### 2.4 Tech Debt Accumulation

```typescript
interface TechDebtEvent {
  id: string;
  source: 'skipped-test' | 'quick-fix' | 'unverified-ai' | 'scope-creep';
  amount: number;
  description: string;
  canPayOff: boolean;
  payOffCost: { coffee: number; steps: number };
}

const techDebtSources: Record<string, number> = {
  'skipped-test': 15,
  'accepted-ai-without-review': 10,
  'quick-fix-no-refactor': 8,
  'scope-creep-accepted': 20,
  'ignored-linter-warning': 5,
};

// Tech debt consequences
const checkTechDebtConsequences = (techDebt: number): TechDebtConsequence | null => {
  if (techDebt > 80) {
    return {
      type: 'deployment-blocked',
      message: '🚫 Tech debt too high! You must refactor before deploying.',
      requiredAction: 'refactor-challenge',
    };
  }
  if (techDebt > 60) {
    return {
      type: 'random-bug',
      message: '🐛 A bug appeared from accumulated tech debt!',
      bugToFix: generateRandomBug(),
    };
  }
  if (techDebt > 40) {
    return {
      type: 'warning',
      message: '⚠️ Tech debt is accumulating. Consider refactoring.',
    };
  }
  return null;
};
```

---

## 3. Scenario/Event System

### 3.1 Event Types

```typescript
type ScenarioCategory = 
  | 'scope-change'      // PM requests
  | 'bug-report'        // Production issues  
  | 'security-alert'    // Vulnerabilities
  | 'ci-failure'        // Pipeline issues
  | 'team-conflict'     // Code review disputes
  | 'ai-hallucination'  // AI generated incorrect code
  | 'deadline-pressure' // Time constraints
  | 'tech-debt-payoff'; // Opportunity to reduce debt

interface GameScenario {
  id: string;
  category: ScenarioCategory;
  title: string;
  description: string;
  triggeredBy: ScenarioTrigger;
  options: ScenarioOption[];
  timeLimit?: number;
  isBlocking: boolean; // Must resolve before continuing
}

interface ScenarioTrigger {
  type: 'stat-threshold' | 'step-completion' | 'random' | 'decision-consequence';
  condition?: {
    stat?: keyof EnhancedGameResources;
    operator?: '>' | '<' | '==' | '>=';
    value?: number;
    stepId?: string;
    chance?: number; // 0-1 for random
  };
}

interface ScenarioOption {
  id: string;
  label: string;
  description: string;
  requirements?: { stat: string; minValue: number }[];
  consequences: Consequences;
  skillDemonstrated?: string; // For assessment
}
```

### 3.2 React Todo App Scenarios

```typescript
const todoAppScenarios: GameScenario[] = [
  // SCOPE CHANGE
  {
    id: 'scenario-priority-feature',
    category: 'scope-change',
    title: '🆕 Priority Request',
    description: `The product owner wants to add priority levels (High/Medium/Low) 
      to todos. "Users are asking for it. Can you add it today?"`,
    triggeredBy: { type: 'step-completion', condition: { stepId: 'skeleton-todo-item' } },
    isBlocking: false,
    options: [
      {
        id: 'add-priority-now',
        label: 'Add it now',
        description: 'Use AI to quickly generate priority dropdown',
        consequences: {
          coffeeChange: -25,
          techDebtChange: +15,
          xpChange: 20,
          modifiesStep: {
            stepId: 'brain-api-integration',
            changes: { addValidation: [{ type: 'code-contains', value: 'priority', errorMessage: 'API must handle priority field' }] },
          },
        },
      },
      {
        id: 'plan-priority',
        label: 'Plan it properly',
        description: 'Create a ticket, design the schema change first',
        consequences: {
          coffeeChange: -10,
          techDebtChange: 0,
          xpChange: 35,
          aiTrustChange: +5,
        },
        skillDemonstrated: 'project-management',
      },
    ],
  },

  // BUG REPORT
  {
    id: 'scenario-delete-bug',
    category: 'bug-report',
    title: '🐛 Bug Report: Delete Not Working',
    description: `QA found an issue: "When I delete a todo, it disappears but comes 
      back after refresh. The API returns 200 but the database isn't updating."`,
    triggeredBy: { type: 'step-completion', condition: { stepId: 'brain-delete-todo' } },
    isBlocking: true,
    options: [
      {
        id: 'ask-ai-fix',
        label: 'Ask AI to fix it',
        description: 'Paste the error and ask for a solution',
        consequences: {
          coffeeChange: -15,
          sanityChange: -10,
          aiTrustChange: -5, // AI might give wrong fix
          unlocksScenario: 'scenario-ai-wrong-fix', // 50% chance
        },
      },
      {
        id: 'debug-manually',
        label: 'Debug step-by-step',
        description: 'Check network tab, API logs, database',
        consequences: {
          coffeeChange: -20,
          sanityChange: +5,
          xpChange: 40,
          aiTrustChange: +10,
        },
        skillDemonstrated: 'debugging',
      },
      {
        id: 'write-test-first',
        label: 'Write a failing test first',
        description: 'TDD approach: reproduce the bug in a test',
        consequences: {
          coffeeChange: -25,
          techDebtChange: -10,
          xpChange: 50,
          codeQualityChange: +15,
        },
        skillDemonstrated: 'testing',
      },
    ],
  },

  // SECURITY ALERT
  {
    id: 'scenario-xss-vuln',
    category: 'security-alert',
    title: '🔒 Security Alert: XSS Vulnerability',
    description: `The security scan found a critical issue: User input in todo 
      titles isn't being sanitized. Someone could inject malicious scripts.`,
    triggeredBy: { type: 'step-completion', condition: { stepId: 'skeleton-todo-form' } },
    isBlocking: true,
    options: [
      {
        id: 'sanitize-input',
        label: 'Sanitize all inputs',
        description: 'Add DOMPurify and sanitize before rendering',
        consequences: {
          coffeeChange: -15,
          xpChange: 35,
          codeQualityChange: +10,
        },
        skillDemonstrated: 'security',
      },
      {
        id: 'use-textcontent',
        label: 'Use textContent instead of innerHTML',
        description: 'React already escapes by default, verify this',
        consequences: {
          coffeeChange: -5,
          xpChange: 45,
          aiTrustChange: +10,
        },
        skillDemonstrated: 'security',
      },
    ],
  },

  // CI/CD FAILURE  
  {
    id: 'scenario-ci-timeout',
    category: 'ci-failure',
    title: '⏱️ CI Pipeline Timeout',
    description: `The GitHub Actions workflow is failing: "Job exceeded maximum 
      execution time of 6 hours." Your tests are taking too long.`,
    triggeredBy: { type: 'step-completion', condition: { stepId: 'production-ci-setup' } },
    isBlocking: true,
    options: [
      {
        id: 'skip-tests',
        label: 'Skip slow tests',
        description: 'Mark integration tests as skip for now',
        consequences: {
          coffeeChange: -5,
          techDebtChange: +25,
          codeQualityChange: -20,
        },
      },
      {
        id: 'parallelize-tests',
        label: 'Parallelize test execution',
        description: 'Split tests across multiple runners',
        consequences: {
          coffeeChange: -20,
          xpChange: 40,
          techDebtChange: 0,
        },
        skillDemonstrated: 'devops',
      },
      {
        id: 'optimize-tests',
        label: 'Profile and optimize slow tests',
        description: 'Find the bottleneck and fix it',
        consequences: {
          coffeeChange: -30,
          xpChange: 60,
          techDebtChange: -10,
          codeQualityChange: +15,
        },
        skillDemonstrated: 'testing',
      },
    ],
  },

  // AI HALLUCINATION
  {
    id: 'scenario-ai-wrong-import',
    category: 'ai-hallucination',
    title: '🤖 AI Hallucinated a Package',
    description: `The AI-generated code imports "react-todo-magic" which doesn't 
      exist on npm. The build is failing with "Module not found."`,
    triggeredBy: { 
      type: 'stat-threshold', 
      condition: { stat: 'aiTrust', operator: '<', value: 50 } 
    },
    isBlocking: true,
    options: [
      {
        id: 'ask-alternative',
        label: 'Ask AI for alternative',
        description: 'Prompt: "react-todo-magic doesn\'t exist, suggest real package"',
        consequences: {
          coffeeChange: -10,
          sanityChange: -5,
          aiTrustChange: +5,
        },
      },
      {
        id: 'search-npm',
        label: 'Search npm yourself',
        description: 'Find a real package that does what you need',
        consequences: {
          coffeeChange: -15,
          xpChange: 25,
          aiTrustChange: +15,
        },
        skillDemonstrated: 'research',
      },
      {
        id: 'implement-yourself',
        label: 'Implement without package',
        description: 'Write the functionality manually',
        consequences: {
          coffeeChange: -25,
          xpChange: 50,
          aiTrustChange: +20,
          codeQualityChange: +10,
        },
        skillDemonstrated: 'coding',
      },
    ],
  },

  // TECH DEBT PAYOFF OPPORTUNITY
  {
    id: 'scenario-refactor-opportunity',
    category: 'tech-debt-payoff',
    title: '🧹 Refactoring Window',
    description: `You have a quiet afternoon. This is a good time to address 
      some of the shortcuts you took earlier.`,
    triggeredBy: { 
      type: 'stat-threshold', 
      condition: { stat: 'techDebt', operator: '>', value: 40 } 
    },
    isBlocking: false,
    options: [
      {
        id: 'full-refactor',
        label: 'Deep refactoring session',
        description: 'Spend time properly restructuring code',
        consequences: {
          coffeeChange: -30,
          techDebtChange: -30,
          codeQualityChange: +20,
          xpChange: 45,
        },
      },
      {
        id: 'quick-fixes',
        label: 'Quick wins only',
        description: 'Fix the most obvious issues',
        consequences: {
          coffeeChange: -15,
          techDebtChange: -15,
          xpChange: 20,
        },
      },
      {
        id: 'skip-refactor',
        label: 'Keep shipping',
        description: 'We\'ll refactor later (we won\'t)',
        consequences: {
          coffeeChange: 0,
          techDebtChange: +5,
          sanityChange: -5, // You know this is wrong
        },
      },
    ],
  },
];
```

### 3.3 Event Engine Implementation

```typescript
// New file: src/engines/scenarioEngine.ts
interface ScenarioEngine {
  checkTriggers: (gameState: EnhancedGameState) => GameScenario[];
  resolveScenario: (scenarioId: string, optionId: string) => Consequences;
  getActiveScenarios: () => GameScenario[];
  getPendingScenarios: () => GameScenario[];
}

const useScenarioEngine = (): ScenarioEngine => {
  const [activeScenarios, setActiveScenarios] = useState<GameScenario[]>([]);
  const [scenarioHistory, setScenarioHistory] = useState<ScenarioResolution[]>([]);
  
  const checkTriggers = useCallback((gameState: EnhancedGameState) => {
    const triggered: GameScenario[] = [];
    
    for (const scenario of allScenarios) {
      if (scenarioHistory.some(h => h.scenarioId === scenario.id)) continue;
      
      const { type, condition } = scenario.triggeredBy;
      
      switch (type) {
        case 'stat-threshold':
          if (condition?.stat && condition?.operator && condition?.value !== undefined) {
            const statValue = gameState.resources[condition.stat];
            if (evaluateCondition(statValue, condition.operator, condition.value)) {
              triggered.push(scenario);
            }
          }
          break;
          
        case 'step-completion':
          if (condition?.stepId && gameState.completedTasks.includes(condition.stepId)) {
            triggered.push(scenario);
          }
          break;
          
        case 'random':
          if (condition?.chance && Math.random() < condition.chance) {
            triggered.push(scenario);
          }
          break;
      }
    }
    
    return triggered;
  }, [scenarioHistory]);
  
  // ... rest of implementation
};
```

---

## 4. Level Progression System

### 4.1 Difficulty Scaling

```typescript
interface DifficultyConfig {
  class: PlayerClass;
  level: number;
  modifiers: DifficultyModifiers;
}

interface DifficultyModifiers {
  // AI Assistance Level
  aiCodeCompleteness: number;    // 0-1: How complete is AI-generated code
  aiHintAvailability: boolean;   // Can ask AI for hints
  promptTemplatesShown: boolean; // Show example prompts
  
  // Challenge Difficulty
  verificationRequired: boolean; // Must explain code before proceeding
  testCoverageRequired: number;  // 0-100%
  codeReviewRequired: boolean;   // Must review AI output
  
  // Time/Resource Pressure
  coffeeDrainMultiplier: number; // 1.0 = normal, 2.0 = double drain
  sanityRecoveryRate: number;    // How fast sanity recovers
  scenarioFrequency: number;     // How often random events occur
  
  // Hidden Mechanics
  hiddenStats: string[];         // Which stats are hidden from UI
  aiHallucinationRate: number;   // 0-1: Chance AI generates bugs
}

const difficultyConfigs: DifficultyConfig[] = [
  // VIBE SURFER (Beginner) - Levels 1-10
  {
    class: 'vibe-surfer',
    level: 1,
    modifiers: {
      aiCodeCompleteness: 0.95,
      aiHintAvailability: true,
      promptTemplatesShown: true,
      verificationRequired: false,
      testCoverageRequired: 0,
      codeReviewRequired: false,
      coffeeDrainMultiplier: 0.5,
      sanityRecoveryRate: 2.0,
      scenarioFrequency: 0.3,
      hiddenStats: ['techDebt', 'aiTrust'],
      aiHallucinationRate: 0.05,
    },
  },
  {
    class: 'vibe-surfer',
    level: 5,
    modifiers: {
      aiCodeCompleteness: 0.85,
      aiHintAvailability: true,
      promptTemplatesShown: true,
      verificationRequired: true, // Now must verify
      testCoverageRequired: 0,
      codeReviewRequired: false,
      coffeeDrainMultiplier: 0.75,
      sanityRecoveryRate: 1.5,
      scenarioFrequency: 0.5,
      hiddenStats: ['techDebt'], // aiTrust now visible
      aiHallucinationRate: 0.1,
    },
  },
  
  // CO-PILOT (Intermediate) - Levels 1-10
  {
    class: 'co-pilot',
    level: 1,
    modifiers: {
      aiCodeCompleteness: 0.7,
      aiHintAvailability: true,
      promptTemplatesShown: false, // Must write own prompts
      verificationRequired: true,
      testCoverageRequired: 30,
      codeReviewRequired: true,
      coffeeDrainMultiplier: 1.0,
      sanityRecoveryRate: 1.0,
      scenarioFrequency: 0.6,
      hiddenStats: [],
      aiHallucinationRate: 0.15,
    },
  },
  
  // 10X ARCHITECT (Advanced) - Levels 1-10
  {
    class: '10x-architect',
    level: 1,
    modifiers: {
      aiCodeCompleteness: 0.5, // AI only provides scaffolding
      aiHintAvailability: false,
      promptTemplatesShown: false,
      verificationRequired: true,
      testCoverageRequired: 70,
      codeReviewRequired: true,
      coffeeDrainMultiplier: 1.5,
      sanityRecoveryRate: 0.5,
      scenarioFrequency: 0.8,
      hiddenStats: [],
      aiHallucinationRate: 0.25, // AI is less reliable
    },
  },
];
```

### 4.2 Class Differences Deep Dive

| Aspect | Vibe Surfer | Co-Pilot | 10x Architect |
|--------|-------------|----------|---------------|
| **AI Output** | Complete, working code | Code with TODOs | Pseudocode + structure |
| **Prompts** | Templates provided | Examples shown | Write from scratch |
| **Verification** | Optional, encouraged | Required before next step | Required + explain |
| **Testing** | None required | Unit tests required | Unit + Integration |
| **Code Review** | AI reviews for you | You review AI + manual check | Full PR simulation |
| **Tech Debt** | Hidden stat | Visible, warnings | Visible, hard limits |
| **Scenarios** | Fewer, gentler | Regular, medium stakes | Frequent, high stakes |
| **Deployment** | Guided walkthrough | Semi-automated | Full CI/CD setup |

### 4.3 Level Unlocks

```typescript
interface LevelUnlock {
  level: number;
  unlocks: Unlock[];
}

interface Unlock {
  type: 'feature' | 'tool' | 'scenario-type' | 'stat-visibility' | 'achievement';
  id: string;
  name: string;
  description: string;
}

const vibeSurferUnlocks: LevelUnlock[] = [
  { level: 2, unlocks: [{ type: 'tool', id: 'cursor-composer', name: 'Cursor Composer', description: 'Multi-file AI editing' }] },
  { level: 3, unlocks: [{ type: 'feature', id: 'prompt-history', name: 'Prompt History', description: 'See and reuse past prompts' }] },
  { level: 5, unlocks: [{ type: 'stat-visibility', id: 'ai-trust', name: 'AI Trust Meter', description: 'See how reliable your AI is' }] },
  { level: 7, unlocks: [{ type: 'scenario-type', id: 'security', name: 'Security Scenarios', description: 'Face security challenges' }] },
  { level: 10, unlocks: [{ type: 'achievement', id: 'vibe-master', name: 'Vibe Master', description: 'Unlock Co-Pilot class' }] },
];
```

---

## 5. AI Usage Philosophy

### 5.1 Prompt Quality Scoring

```typescript
interface PromptAnalysis {
  score: number;           // 0-100
  breakdown: {
    specificity: number;   // How specific is the request
    context: number;       // Does it include relevant context
    constraints: number;   // Are requirements specified
    examples: number;      // Does it include examples
    structure: number;     // Is it well-organized
  };
  feedback: string[];
  improvedVersion?: string;
}

const analyzePrompt = (prompt: string, context: StepContext): PromptAnalysis => {
  const analysis: PromptAnalysis = {
    score: 0,
    breakdown: { specificity: 0, context: 0, constraints: 0, examples: 0, structure: 0 },
    feedback: [],
  };
  
  // Specificity check
  const vaguePatterns = ['make', 'create', 'build', 'do', 'something'];
  const specificPatterns = ['component', 'function', 'that takes', 'returns', 'with props'];
  
  const vagueCount = vaguePatterns.filter(p => prompt.toLowerCase().includes(p)).length;
  const specificCount = specificPatterns.filter(p => prompt.toLowerCase().includes(p)).length;
  
  analysis.breakdown.specificity = Math.min(100, specificCount * 20 - vagueCount * 10);
  
  // Context check
  const hasFileContext = prompt.includes('in') || prompt.includes('for');
  const hasStackContext = prompt.toLowerCase().includes('react') || 
                          prompt.toLowerCase().includes('typescript');
  
  analysis.breakdown.context = (hasFileContext ? 40 : 0) + (hasStackContext ? 40 : 0);
  
  // Constraints check
  const constraintPatterns = ['must', 'should', 'needs to', 'required', 'validation'];
  analysis.breakdown.constraints = Math.min(100, 
    constraintPatterns.filter(p => prompt.toLowerCase().includes(p)).length * 25
  );
  
  // Calculate total score
  analysis.score = Object.values(analysis.breakdown).reduce((a, b) => a + b, 0) / 5;
  
  // Generate feedback
  if (analysis.breakdown.specificity < 50) {
    analysis.feedback.push('Be more specific about what you want');
  }
  if (analysis.breakdown.context < 50) {
    analysis.feedback.push('Include context about where this code will be used');
  }
  
  return analysis;
};
```

### 5.2 Anti-Copy-Paste Mechanics

```typescript
interface CopyPasteDetection {
  detectBlindPaste: (code: string, stepContext: StepContext) => BlindPasteResult;
  getVerificationChallenge: (code: string) => VerificationChallenge;
}

interface BlindPasteResult {
  isBlindPaste: boolean;
  confidence: number;
  indicators: string[];
  penalty?: Consequences;
}

const detectBlindPaste = (code: string, generatedAt: number): BlindPasteResult => {
  const now = Date.now();
  const timeSinceGeneration = now - generatedAt;
  
  const indicators: string[] = [];
  
  // Too fast? Probably didn't read it
  if (timeSinceGeneration < 5000) { // Less than 5 seconds
    indicators.push('Pasted immediately after generation');
  }
  
  // No modifications? Didn't customize
  // (This would compare to originally generated code)
  
  // Calculate confidence
  const confidence = indicators.length > 0 ? 0.7 : 0;
  
  return {
    isBlindPaste: confidence > 0.5,
    confidence,
    indicators,
    penalty: confidence > 0.5 ? {
      sanityChange: 0,
      techDebtChange: +10,
      aiTrustChange: -10,
      xpChange: -5,
    } : undefined,
  };
};
```

### 5.3 Rewarding Good AI Usage

```typescript
interface AIUsageReward {
  type: 'good-prompt' | 'caught-hallucination' | 'effective-refactor' | 'iterative-improvement';
  xpBonus: number;
  aiTrustBonus: number;
  badge?: string;
  message: string;
}

const aiUsageRewards: AIUsageReward[] = [
  {
    type: 'good-prompt',
    xpBonus: 15,
    aiTrustBonus: 5,
    badge: 'Prompt Whisperer',
    message: '✨ Excellent prompt! Clear, specific, and contextual.',
  },
  {
    type: 'caught-hallucination',
    xpBonus: 25,
    aiTrustBonus: 10,
    badge: 'Hallucination Hunter',
    message: '🎯 Great catch! You spotted the AI mistake before it caused problems.',
  },
  {
    type: 'effective-refactor',
    xpBonus: 30,
    aiTrustBonus: 15,
    badge: 'Code Surgeon',
    message: '🔧 Nice refactoring! You improved on the AI\'s initial output.',
  },
  {
    type: 'iterative-improvement',
    xpBonus: 20,
    aiTrustBonus: 10,
    badge: 'Iterative Master',
    message: '🔄 Smart! You iterated on the prompt to get better results.',
  },
];
```

---

## 6. Deliverables System

### 6.1 Artifact Tracking

```typescript
interface ProjectDeliverable {
  id: string;
  type: 'readme' | 'architecture' | 'tests' | 'deployment' | 'documentation' | 'demo';
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'draft' | 'complete';
  requiredForCompletion: boolean;
  generatedContent?: string;
  userModifications?: string[];
  qualityScore?: number;
  feedback?: string[];
}

interface ProjectPortfolio {
  projectName: string;
  completedAt?: Date;
  deliverables: ProjectDeliverable[];
  stats: {
    totalXpEarned: number;
    techDebtFinal: number;
    scenariosResolved: number;
    promptsWritten: number;
    linesOfCode: number;
    testCoverage: number;
  };
  achievements: Achievement[];
  exportFormats: ('github' | 'zip' | 'pdf')[];
}
```

### 6.2 Required Artifacts (Todo App)

```typescript
const todoAppDeliverables: ProjectDeliverable[] = [
  {
    id: 'readme',
    type: 'readme',
    name: 'README.md',
    description: 'Project documentation with setup instructions',
    requiredForCompletion: true,
    status: 'not-started',
  },
  {
    id: 'architecture',
    type: 'architecture',
    name: 'ARCHITECTURE.md',
    description: 'System design and component structure',
    requiredForCompletion: true,
    status: 'not-started',
  },
  {
    id: 'tests',
    type: 'tests',
    name: 'Test Suite',
    description: 'Unit and integration tests',
    requiredForCompletion: true,
    status: 'not-started',
  },
  {
    id: 'deployment',
    type: 'deployment',
    name: 'Deployment Config',
    description: 'CI/CD pipeline and hosting setup',
    requiredForCompletion: true,
    status: 'not-started',
  },
  {
    id: 'api-docs',
    type: 'documentation',
    name: 'API Documentation',
    description: 'REST API endpoints documentation',
    requiredForCompletion: false,
    status: 'not-started',
  },
  {
    id: 'demo-video',
    type: 'demo',
    name: 'Demo Recording',
    description: 'Video walkthrough of the application',
    requiredForCompletion: false,
    status: 'not-started',
  },
];
```

### 6.3 Completion Checklist

```typescript
interface CompletionChecklist {
  category: string;
  items: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  autoChecked: boolean; // Can be automatically verified
  verificationRule?: ValidationRule;
}

const todoAppChecklist: CompletionChecklist[] = [
  {
    category: 'Code Quality',
    items: [
      { id: 'no-lint-errors', label: 'No linting errors', autoChecked: true, verificationRule: { type: 'no-errors', value: '', errorMessage: '' } },
      { id: 'typescript-strict', label: 'TypeScript strict mode passes', autoChecked: true },
      { id: 'no-any', label: 'No `any` types used', autoChecked: true },
    ],
  },
  {
    category: 'Testing',
    items: [
      { id: 'unit-tests', label: 'Unit tests for components', autoChecked: true },
      { id: 'api-tests', label: 'API integration tests', autoChecked: true },
      { id: 'coverage-50', label: 'Test coverage > 50%', autoChecked: true },
    ],
  },
  {
    category: 'Documentation',
    items: [
      { id: 'readme-exists', label: 'README.md exists', autoChecked: true },
      { id: 'readme-complete', label: 'README has setup instructions', autoChecked: false },
      { id: 'architecture-doc', label: 'Architecture documented', autoChecked: false },
    ],
  },
  {
    category: 'Deployment',
    items: [
      { id: 'ci-passes', label: 'CI pipeline passes', autoChecked: true },
      { id: 'deployed', label: 'App deployed to hosting', autoChecked: false },
      { id: 'env-vars', label: 'Environment variables documented', autoChecked: false },
    ],
  },
];
```

---

## 7. Implementation Roadmap

### Phase 1: Core Mechanics (Week 1-2)
1. Add `techDebt` and `aiTrust` to `GameResources`
2. Implement `DecisionPoint` system
3. Add stat impact to existing steps
4. Create `ScenarioModal` component

### Phase 2: Verification System (Week 2-3)
1. Add `VerificationStep` type
2. Implement code explanation checker
3. Add blind-paste detection
4. Create prompt quality analyzer

### Phase 3: Scenarios (Week 3-4)
1. Implement `ScenarioEngine`
2. Create 10-15 scenarios for Todo App
3. Add scenario trigger system
4. Connect scenarios to consequences

### Phase 4: Deliverables (Week 4-5)
1. Add `ProjectDeliverable` tracking
2. Implement artifact generation
3. Create completion checklist UI
4. Add export functionality

### Phase 5: Polish (Week 5-6)
1. Balance stat changes
2. Add achievements system
3. Implement class progression
4. Create tutorial for new mechanics

---

## 8. UI/UX Mockups

### 8.1 Enhanced HUD
```
┌─────────────────────────────────────────────────────────────┐
│ 🧠 Sanity [████████░░] 80    ☕ Coffee [██████░░░░] 60     │
│ ⚡ XP 1,250  Level 5         📊 Tech Debt [░░░░░░░░░░] 15  │
│                              🤖 AI Trust [████████░░] 85   │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Decision Modal
```
┌─────────────────────────────────────────────────────────────┐
│ 🚨 SCOPE CREEP ALERT!                               ⏱️ 2:00│
├─────────────────────────────────────────────────────────────┤
│ Your PM just messaged: "Can we add drag-and-drop..."       │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ○ Accept the change                                     ││
│ │   Use AI to quickly add drag-and-drop                   ││
│ │   ☕-20  🧠-15  📊+25                                   ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ● Add to backlog                           ⭐ Optimal   ││
│ │   Finish current work first                             ││
│ │   🧠+5  ⚡+25                                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│                    [ Confirm Decision ]                     │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 Verification Challenge
```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 VERIFICATION REQUIRED                                    │
├─────────────────────────────────────────────────────────────┤
│ Before proceeding, explain what this code does:             │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ useEffect(() => {                                       ││
│ │   const fetchTodos = async () => {                      ││
│ │     const response = await fetch('/api/todos');         ││
│ │     setTodos(await response.json());                    ││
│ │   };                                                    ││
│ │   fetchTodos();                                         ││
│ │ }, []);                                                 ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Your explanation:                                           │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ This useEffect runs once on component mount because     ││
│ │ of the empty dependency array. It calls an async        ││
│ │ function to fetch todos from the API...                 ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ✓ Mentioned: dependency array, mount, async                 │
│ ✗ Missing: side effect                                      │
│                                                             │
│        [ Need a Hint? ] [ Submit Explanation ]              │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

These enhancements transform VibeQuest from a "click-through tutorial" into an **engineering judgment simulator**. Key differentiators:

1. **Decision-driven learning** - Students face real trade-offs, not just instructions
2. **Meaningful stats** - Tech debt and AI trust create gameplay tension
3. **Consequence system** - Choices have ripple effects across the project
4. **Anti-shortcut mechanics** - Blind AI usage is detected and penalized
5. **Real artifacts** - Students leave with portfolio-worthy deliverables

This positions VibeQuest as a **unique educational game** that teaches the meta-skill of AI-assisted development, not just coding.
