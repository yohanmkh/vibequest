// Sample scenarios for React + Node.js Todo App
// These can be loaded based on the selected stack

import { GameScenario, DecisionPoint, VerificationChallenge } from '../types/enhancedGameTypes';

// ============================================
// DECISION POINTS
// ============================================

export const todoAppDecisions: DecisionPoint[] = [
  // SCOPE CREEP - Occurs during skeleton phase
  {
    id: 'decision-scope-drag-drop',
    stepId: 'skeleton-todo-list',
    trigger: 'before-step',
    title: '🚨 Scope Creep Alert!',
    category: 'scope-management',
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
          techDebtChange: 25,
          aiTrustChange: -10,
          unlocksScenario: 'scenario-dnd-bug',
        },
        isOptimal: false,
        reasoning: `Adding features mid-sprint increases complexity. The AI-generated 
drag-and-drop will have edge cases you haven't tested. This will come back to bite you.`,
      },
      {
        id: 'defer-scope',
        label: 'Add to backlog',
        description: 'Finish current work first, schedule for next sprint',
        consequences: {
          sanityChange: 5,
          coffeeChange: 0,
          xpChange: 25,
          techDebtChange: 0,
          aiTrustChange: 5,
        },
        isOptimal: true,
        reasoning: `Professional engineers protect their sprint scope. Completing work 
properly before adding features prevents integration bugs. Good boundary setting!`,
        skillDemonstrated: 'project-management',
      },
      {
        id: 'negotiate-scope',
        label: 'Negotiate MVP version',
        description: 'Offer simpler manual reordering via up/down buttons',
        consequences: {
          sanityChange: 0,
          coffeeChange: -10,
          xpChange: 30,
          techDebtChange: 5,
          aiTrustChange: 10,
        },
        isOptimal: true,
        reasoning: `Excellent engineering judgment! You found a middle ground that 
delivers value without derailing the sprint. This is how senior engineers think.`,
        skillDemonstrated: 'communication',
      },
    ],
  },

  // AI CODE QUALITY - After generating component
  {
    id: 'decision-ai-code-review',
    stepId: 'skeleton-todo-item',
    trigger: 'after-step',
    title: '🤖 AI Generated Code Review',
    category: 'ai-usage',
    scenario: `The AI just generated your TodoItem component. The code works, but 
you notice it's using inline styles and has no TypeScript types.

What do you do?`,
    options: [
      {
        id: 'accept-as-is',
        label: 'Ship it',
        description: 'The code works, move on to the next task',
        consequences: {
          coffeeChange: 0,
          xpChange: 5,
          techDebtChange: 15,
          codeQualityChange: -10,
          aiTrustChange: -5,
        },
        isOptimal: false,
        reasoning: `Working code isn't the same as good code. Inline styles and 
missing types will slow you down later and make the codebase harder to maintain.`,
      },
      {
        id: 'refactor-now',
        label: 'Refactor it properly',
        description: 'Add types, extract styles to CSS, clean up structure',
        consequences: {
          coffeeChange: -15,
          xpChange: 35,
          techDebtChange: -5,
          codeQualityChange: 15,
          aiTrustChange: 10,
        },
        isOptimal: true,
        reasoning: `Taking time to refactor AI output is a crucial skill. You're 
building muscle memory for critically evaluating generated code.`,
        skillDemonstrated: 'code-review',
      },
      {
        id: 'ask-ai-refactor',
        label: 'Ask AI to refactor',
        description: 'Prompt: "Add TypeScript types and extract styles to Tailwind"',
        consequences: {
          coffeeChange: -10,
          xpChange: 25,
          techDebtChange: 0,
          codeQualityChange: 10,
          aiTrustChange: 5,
        },
        isOptimal: true,
        reasoning: `Smart use of AI! Using AI to improve its own output through 
iterative prompting is an advanced technique. Just make sure to verify the result.`,
        skillDemonstrated: 'prompting',
      },
    ],
  },

  // TESTING DECISION
  {
    id: 'decision-testing-approach',
    stepId: 'brain-api-integration',
    trigger: 'before-step',
    title: '🧪 Testing Strategy',
    category: 'quality-tradeoff',
    scenario: `You're about to integrate the API. Your lead asks: "Are you planning 
to write tests for this?"

You have a demo tomorrow.`,
    timeLimit: 60,
    options: [
      {
        id: 'skip-tests',
        label: 'Skip tests for now',
        description: 'We\'ll add them after the demo',
        consequences: {
          coffeeChange: 0,
          xpChange: 5,
          techDebtChange: 20,
          codeQualityChange: -15,
          unlocksScenario: 'scenario-demo-bug',
        },
        isOptimal: false,
        reasoning: `"We'll add tests later" is one of the most common lies in software 
development. The demo might work, but you're building on an unstable foundation.`,
      },
      {
        id: 'basic-tests',
        label: 'Write critical path tests',
        description: 'Test the main CRUD operations, skip edge cases',
        consequences: {
          coffeeChange: -20,
          xpChange: 30,
          techDebtChange: 5,
          codeQualityChange: 10,
        },
        isOptimal: true,
        reasoning: `Good balance! Testing the happy path catches the most common 
bugs while respecting your time constraints. This is pragmatic engineering.`,
        skillDemonstrated: 'testing',
      },
      {
        id: 'tdd-approach',
        label: 'TDD: Write tests first',
        description: 'Red-green-refactor the API integration',
        consequences: {
          coffeeChange: -30,
          sanityChange: 5,
          xpChange: 45,
          techDebtChange: -10,
          codeQualityChange: 20,
        },
        isOptimal: true,
        requirements: [{ stat: 'coffee', minValue: 30, errorMessage: 'Too tired for TDD' }],
        reasoning: `Impressive discipline! TDD takes more upfront effort but prevents 
bugs and makes refactoring safe. Your future self will thank you.`,
        skillDemonstrated: 'testing',
      },
    ],
  },

  // DEPLOYMENT CHOICE
  {
    id: 'decision-deployment-platform',
    stepId: 'production-deployment',
    trigger: 'before-step',
    title: '☁️ Deployment Decision',
    category: 'technical-choice',
    scenario: `Time to deploy! You need to choose a hosting platform. Each has trade-offs.`,
    options: [
      {
        id: 'vercel',
        label: 'Deploy to Vercel',
        description: 'One-click deployment, great DX, limited backend options',
        consequences: {
          coffeeChange: -5,
          xpChange: 20,
          techDebtChange: 0,
        },
        isOptimal: true,
        reasoning: `Vercel is excellent for React apps. The trade-off is vendor 
lock-in and limited backend flexibility, but for a todo app, it's perfect.`,
        skillDemonstrated: 'devops',
      },
      {
        id: 'railway',
        label: 'Deploy to Railway',
        description: 'Full-stack deployment, postgres included, costs money',
        consequences: {
          coffeeChange: -15,
          xpChange: 30,
          techDebtChange: 0,
        },
        isOptimal: true,
        reasoning: `Railway gives you more control and is better for full-stack apps. 
Good choice if you need a real database and backend flexibility.`,
        skillDemonstrated: 'devops',
      },
      {
        id: 'docker-vps',
        label: 'Docker + VPS',
        description: 'Full control, complex setup, maintenance burden',
        consequences: {
          coffeeChange: -30,
          sanityChange: -10,
          xpChange: 50,
          techDebtChange: 10,
        },
        isOptimal: false,
        requirements: [{ stat: 'sanity', minValue: 40, errorMessage: 'Too stressed for DevOps' }],
        reasoning: `Maximum flexibility but overkill for a todo app. You'll spend 
more time on infrastructure than features. Sometimes simpler is better.`,
        skillDemonstrated: 'devops',
      },
    ],
  },
];

// ============================================
// GAME SCENARIOS (Events)
// ============================================

export const todoAppScenarios: GameScenario[] = [
  // BUG REPORT
  {
    id: 'scenario-delete-race-condition',
    category: 'bug-report',
    title: '🐛 Bug Report: Ghost Todos',
    icon: '🐛',
    description: `QA found an issue: "When I delete a todo, it disappears but comes 
back after refresh. The API returns 200 but the database isn't updating."

This is blocking the release.`,
    triggeredBy: { 
      type: 'step-completion', 
      condition: { stepId: 'brain-delete-todo' } 
    },
    isBlocking: true,
    priority: 'high',
    relatedStep: 'brain-delete-todo',
    options: [
      {
        id: 'ask-ai-fix',
        label: 'Ask AI to fix it',
        description: 'Paste the error and ask for a solution',
        consequences: {
          coffeeChange: -15,
          sanityChange: -10,
          aiTrustChange: -5,
          unlocksScenario: 'scenario-ai-wrong-fix',
        },
      },
      {
        id: 'debug-network',
        label: 'Check Network Tab',
        description: 'Inspect the actual API request/response',
        consequences: {
          coffeeChange: -10,
          xpChange: 30,
          aiTrustChange: 10,
        },
        skillDemonstrated: 'debugging',
      },
      {
        id: 'write-failing-test',
        label: 'Write a failing test first',
        description: 'TDD approach: reproduce the bug in a test',
        consequences: {
          coffeeChange: -20,
          techDebtChange: -10,
          xpChange: 45,
          codeQualityChange: 15,
        },
        skillDemonstrated: 'testing',
      },
    ],
  },

  // AI HALLUCINATION
  {
    id: 'scenario-fake-package',
    category: 'ai-hallucination',
    title: '🤖 AI Hallucinated a Package',
    icon: '🤖',
    description: `The AI-generated code imports "react-todo-magic" which doesn't 
exist on npm. The build is failing with:

  Module not found: Can't resolve 'react-todo-magic'

You trusted the AI output without checking.`,
    triggeredBy: { 
      type: 'stat-threshold', 
      condition: { stat: 'aiTrust', operator: '<', value: 50 } 
    },
    isBlocking: true,
    priority: 'medium',
    options: [
      {
        id: 'ask-alternative',
        label: 'Ask AI for alternative',
        description: '"react-todo-magic doesn\'t exist, suggest a real package"',
        consequences: {
          coffeeChange: -10,
          sanityChange: -5,
          aiTrustChange: 5,
          xpChange: 15,
        },
      },
      {
        id: 'search-npm',
        label: 'Search npm yourself',
        description: 'Find a real package that does what you need',
        consequences: {
          coffeeChange: -15,
          xpChange: 30,
          aiTrustChange: 15,
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
          aiTrustChange: 20,
          codeQualityChange: 10,
        },
        skillDemonstrated: 'debugging', // Using existing skill type
      },
    ],
  },

  // SECURITY ALERT
  {
    id: 'scenario-xss-vulnerability',
    category: 'security-alert',
    title: '🔒 Security Alert: XSS Risk',
    icon: '🔒',
    description: `The security linter flagged a critical issue:

  "Potential XSS vulnerability: User input rendered with dangerouslySetInnerHTML"

Someone could inject malicious scripts via todo titles.`,
    triggeredBy: { 
      type: 'step-completion', 
      condition: { stepId: 'skeleton-todo-form' } 
    },
    isBlocking: true,
    priority: 'critical',
    options: [
      {
        id: 'remove-dangerous',
        label: 'Remove dangerouslySetInnerHTML',
        description: 'Use React\'s default text rendering instead',
        consequences: {
          coffeeChange: -5,
          xpChange: 35,
          codeQualityChange: 10,
        },
        skillDemonstrated: 'security',
      },
      {
        id: 'add-sanitization',
        label: 'Add DOMPurify sanitization',
        description: 'Keep innerHTML but sanitize input first',
        consequences: {
          coffeeChange: -15,
          xpChange: 40,
          codeQualityChange: 15,
        },
        skillDemonstrated: 'security',
      },
      {
        id: 'ignore-for-now',
        label: 'Suppress the warning',
        description: 'Add eslint-disable comment and move on',
        consequences: {
          coffeeChange: 0,
          sanityChange: -10,
          techDebtChange: 30,
          codeQualityChange: -20,
          addsBug: {
            id: 'bug-xss-active',
            type: 'security',
            description: 'XSS vulnerability in todo rendering',
            location: { file: 'TodoItem.tsx' },
            severity: 'critical',
            willManifestAt: 'production-deployment',
          },
        },
      },
    ],
  },

  // CI/CD FAILURE
  {
    id: 'scenario-ci-timeout',
    category: 'ci-failure',
    title: '⏱️ CI Pipeline Timeout',
    icon: '⏱️',
    description: `GitHub Actions workflow failed:

  "Job exceeded maximum execution time"
  
Your test suite is taking too long to run.`,
    triggeredBy: { 
      type: 'step-completion', 
      condition: { stepId: 'production-ci-setup' } 
    },
    isBlocking: true,
    priority: 'high',
    options: [
      {
        id: 'skip-slow-tests',
        label: 'Skip slow tests',
        description: 'Mark integration tests as skip for CI',
        consequences: {
          coffeeChange: -5,
          techDebtChange: 20,
          codeQualityChange: -15,
        },
      },
      {
        id: 'parallelize',
        label: 'Parallelize tests',
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
        label: 'Profile and optimize',
        description: 'Find the slow tests and fix them',
        consequences: {
          coffeeChange: -30,
          xpChange: 60,
          techDebtChange: -10,
          codeQualityChange: 15,
        },
        skillDemonstrated: 'testing',
      },
    ],
  },

  // DEADLINE PRESSURE
  {
    id: 'scenario-demo-tomorrow',
    category: 'deadline-pressure',
    title: '⏰ Demo Tomorrow!',
    icon: '⏰',
    description: `Your manager just announced: "The stakeholders want to see the 
todo app tomorrow at 2 PM."

You still have 3 steps left in the learning path.`,
    triggeredBy: { 
      type: 'random', 
      condition: { chance: 0.3 } 
    },
    isBlocking: false,
    priority: 'high',
    timeLimit: 30,
    options: [
      {
        id: 'rush-it',
        label: 'Rush through everything',
        description: 'Skip verification steps, paste all AI code directly',
        consequences: {
          sanityChange: -20,
          coffeeChange: -30,
          techDebtChange: 35,
          aiTrustChange: -15,
          xpChange: 20,
        },
      },
      {
        id: 'scope-cut',
        label: 'Negotiate scope',
        description: 'Show what\'s done, demo the rest as "coming soon"',
        consequences: {
          sanityChange: 5,
          xpChange: 30,
          techDebtChange: 5,
        },
        skillDemonstrated: 'communication',
      },
      {
        id: 'work-late',
        label: 'Work late tonight',
        description: 'You can probably finish if you stay up late',
        consequences: {
          sanityChange: -25,
          coffeeChange: -40,
          xpChange: 40,
          techDebtChange: 10,
        },
        requirements: [{ stat: 'sanity', minValue: 50, errorMessage: 'You need rest' }],
      },
    ],
  },

  // TECH DEBT PAYOFF
  {
    id: 'scenario-refactor-window',
    category: 'tech-debt-payoff',
    title: '🧹 Refactoring Opportunity',
    icon: '🧹',
    description: `You have a quiet afternoon. This is a good time to address 
some of the shortcuts you took earlier.

Current tech debt: High`,
    triggeredBy: { 
      type: 'stat-threshold', 
      condition: { stat: 'techDebt', operator: '>', value: 40 } 
    },
    isBlocking: false,
    priority: 'medium',
    options: [
      {
        id: 'deep-refactor',
        label: 'Deep refactoring session',
        description: 'Spend time properly restructuring code',
        consequences: {
          coffeeChange: -30,
          techDebtChange: -30,
          codeQualityChange: 20,
          xpChange: 45,
        },
        skillDemonstrated: 'code-review',
      },
      {
        id: 'quick-wins',
        label: 'Quick wins only',
        description: 'Fix the most obvious issues',
        consequences: {
          coffeeChange: -15,
          techDebtChange: -15,
          xpChange: 20,
        },
      },
      {
        id: 'skip',
        label: 'Keep shipping',
        description: 'We\'ll refactor later (we won\'t)',
        consequences: {
          techDebtChange: 5,
          sanityChange: -5,
        },
      },
    ],
  },

  // DND BUG (Consequence of accepting scope creep)
  {
    id: 'scenario-dnd-bug',
    category: 'bug-report',
    title: '🐛 Drag-and-Drop Broken',
    icon: '🐛',
    description: `Remember that drag-and-drop feature you rushed? Users are reporting:

"When I drag a todo, the whole list flickers and sometimes items disappear."

The AI-generated code had a hidden bug in the state management.`,
    triggeredBy: { 
      type: 'decision-consequence', 
      condition: { stepId: 'decision-scope-drag-drop' } 
    },
    isBlocking: true,
    priority: 'high',
    options: [
      {
        id: 'fix-properly',
        label: 'Fix the state management',
        description: 'Debug and fix the optimistic update logic',
        consequences: {
          coffeeChange: -25,
          sanityChange: -10,
          xpChange: 40,
          techDebtChange: -10,
        },
        skillDemonstrated: 'debugging',
      },
      {
        id: 'remove-feature',
        label: 'Remove drag-and-drop',
        description: 'Roll back to simple list, add to backlog properly',
        consequences: {
          coffeeChange: -10,
          sanityChange: 10,
          techDebtChange: -20,
          xpChange: 25,
        },
        skillDemonstrated: 'project-management',
      },
      {
        id: 'disable-temporarily',
        label: 'Feature flag it off',
        description: 'Hide the feature, fix it later',
        consequences: {
          coffeeChange: -5,
          techDebtChange: 15,
          xpChange: 15,
        },
      },
    ],
  },

  // AI WRONG FIX (Consequence of asking AI to fix bug)
  {
    id: 'scenario-ai-wrong-fix',
    category: 'ai-hallucination',
    title: '🤖 AI Fix Made It Worse',
    icon: '🤖',
    description: `You asked the AI to fix the delete bug, and it "fixed" it by:

1. Adding a 500ms setTimeout before the delete
2. Refreshing the entire page after each delete

The bug is "fixed" but the UX is terrible.`,
    triggeredBy: { 
      type: 'decision-consequence' 
    },
    isBlocking: true,
    priority: 'medium',
    options: [
      {
        id: 'accept-hacky-fix',
        label: 'Ship it',
        description: 'It works, users can deal with the refresh',
        consequences: {
          techDebtChange: 25,
          codeQualityChange: -20,
          aiTrustChange: -10,
          xpChange: 5,
        },
      },
      {
        id: 'debug-yourself',
        label: 'Fix it properly yourself',
        description: 'Understand the real issue and fix correctly',
        consequences: {
          coffeeChange: -20,
          xpChange: 50,
          aiTrustChange: 15,
          codeQualityChange: 10,
        },
        skillDemonstrated: 'debugging',
      },
      {
        id: 'better-prompt',
        label: 'Better prompt for AI',
        description: '"Fix delete without setTimeout or page refresh, use optimistic UI"',
        consequences: {
          coffeeChange: -15,
          xpChange: 35,
          aiTrustChange: 10,
        },
        skillDemonstrated: 'prompting',
      },
    ],
  },
];

// ============================================
// VERIFICATION CHALLENGES
// ============================================

export const todoAppVerifications: VerificationChallenge[] = [
  {
    id: 'verify-usestate',
    mode: 'explain-code',
    title: 'Explain: React State',
    description: 'Before proceeding, explain what this useState hook does:',
    codeToExplain: `const [todos, setTodos] = useState<Todo[]>([]);`,
    requiredConcepts: ['state', 'array', 'type', 'initial value', 'setter'],
    conceptHints: {
      'state': 'How does React track data changes?',
      'array': 'What data structure is being stored?',
      'type': 'What does Todo[] mean?',
    },
    xpReward: 30,
    aiTrustBonus: 10,
  },
  {
    id: 'verify-useeffect',
    mode: 'explain-code',
    title: 'Explain: useEffect Hook',
    description: 'The AI generated this code. Explain what it does:',
    codeToExplain: `
useEffect(() => {
  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
  };
  fetchTodos();
}, []);`,
    requiredConcepts: ['side effect', 'async', 'dependency array', 'mount', 'fetch'],
    xpReward: 40,
    aiTrustBonus: 15,
    timeBonus: { seconds: 60, bonusXp: 10 },
  },
  {
    id: 'verify-predict-filter',
    mode: 'predict-output',
    title: 'Predict: Filter Output',
    description: 'What will this code return?',
    codeToRun: `
const todos = [
  { id: 1, text: "Learn React", completed: true },
  { id: 2, text: "Build App", completed: false },
  { id: 3, text: "Deploy", completed: false }
];

const incomplete = todos.filter(t => !t.completed);
console.log(incomplete.length);`,
    expectedOutput: '2',
    outputOptions: ['1', '2', '3', 'undefined'],
    xpReward: 25,
    aiTrustBonus: 5,
  },
  {
    id: 'verify-spot-bug-async',
    mode: 'spot-the-bug',
    title: 'Spot the Bug: Async Issue',
    description: 'This AI-generated code has a bug. Find it:',
    buggyCode: `
async function deleteTodo(id: number) {
  await fetch(\`/api/todos/\${id}\`, { method: 'DELETE' });
  // Update local state
  const newTodos = todos.filter(t => t.id !== id);
  setTodos(newTodos);
}

// Called like this:
<button onClick={deleteTodo(todo.id)}>Delete</button>`,
    bugLocation: { 
      line: 9, 
      description: 'onClick is calling the function immediately instead of passing a reference' 
    },
    bugType: 'logic',
    xpReward: 45,
    aiTrustBonus: 20,
  },
  {
    id: 'verify-refactor-component',
    mode: 'refactor-challenge',
    title: 'Refactor: Messy Component',
    description: 'The AI generated this messy code. Improve it:',
    messyCode: `
function Todo(props) {
  return <div style={{padding: '10px', border: '1px solid gray', marginBottom: '5px'}}>
    <span style={{textDecoration: props.todo.completed ? 'line-through' : 'none'}}>{props.todo.text}</span>
    <button style={{marginLeft: '10px', backgroundColor: 'red', color: 'white'}} onClick={() => props.onDelete(props.todo.id)}>Delete</button>
    <button style={{marginLeft: '5px', backgroundColor: 'green', color: 'white'}} onClick={() => props.onToggle(props.todo.id)}>{props.todo.completed ? 'Undo' : 'Done'}</button>
  </div>
}`,
    refactorGoals: [
      'Add TypeScript types for props',
      'Extract inline styles to Tailwind classes',
      'Use destructuring for cleaner code',
      'Add proper accessibility attributes',
    ],
    idealSolution: `
interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

function TodoItem({ todo, onDelete, onToggle }: TodoItemProps) {
  return (
    <div className="p-2 border border-gray-300 mb-1 rounded flex items-center justify-between">
      <span className={todo.completed ? 'line-through text-gray-500' : ''}>
        {todo.text}
      </span>
      <div className="flex gap-1">
        <button 
          onClick={() => onToggle(todo.id)}
          className="px-2 py-1 bg-green-500 text-white rounded text-sm"
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed ? 'Undo' : 'Done'}
        </button>
        <button 
          onClick={() => onDelete(todo.id)}
          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
          aria-label="Delete todo"
        >
          Delete
        </button>
      </div>
    </div>
  );
}`,
    xpReward: 60,
    aiTrustBonus: 25,
  },
];

// ============================================
// REFLECTION CHECKPOINTS
// ============================================

import { ReflectionCheckpoint } from '../types/enhancedGameTypes';

export const todoAppReflections: ReflectionCheckpoint[] = [
  {
    id: 'reflection-skeleton-complete',
    triggerAfterStep: 'skeleton-complete',
    title: '🤔 Skeleton Phase Reflection',
    description: 'Take a moment to reflect on what you\'ve built so far.',
    questions: [
      {
        id: 'q1',
        question: 'What was the most challenging part of building the UI?',
        category: 'technical',
        expectedKeywords: ['state', 'component', 'style', 'layout', 'props'],
        minLength: 50,
      },
      {
        id: 'q2',
        question: 'How did AI help or hinder your progress?',
        category: 'ai-usage',
        expectedKeywords: ['prompt', 'generate', 'modify', 'understand', 'bug'],
        minLength: 50,
      },
    ],
    minQualityScore: 60,
    xpReward: 30,
  },
  {
    id: 'reflection-api-integration',
    triggerAfterStep: 'brain-api-integration',
    title: '🤔 API Integration Reflection',
    description: 'Reflect on connecting your frontend to the backend.',
    questions: [
      {
        id: 'q1',
        question: 'What error handling did you implement and why?',
        category: 'technical',
        expectedKeywords: ['try', 'catch', 'error', 'loading', 'state', 'user'],
        minLength: 75,
        followUp: 'Think about what happens when the API fails.',
      },
      {
        id: 'q2',
        question: 'If you started over, what would you do differently?',
        category: 'process',
        expectedKeywords: ['plan', 'test', 'type', 'structure', 'early'],
        minLength: 50,
      },
    ],
    minQualityScore: 65,
    xpReward: 40,
  },
  {
    id: 'reflection-project-complete',
    triggerAfterStep: 'production-deployed',
    title: '🎉 Project Completion Reflection',
    description: 'Congratulations! Let\'s reflect on the full journey.',
    questions: [
      {
        id: 'q1',
        question: 'What\'s the most important thing you learned about AI-assisted coding?',
        category: 'ai-usage',
        expectedKeywords: ['verify', 'prompt', 'understand', 'modify', 'trust', 'review'],
        minLength: 100,
      },
      {
        id: 'q2',
        question: 'What technical debt did you accumulate? What would you fix given more time?',
        category: 'technical',
        expectedKeywords: ['test', 'refactor', 'type', 'style', 'error', 'edge'],
        minLength: 75,
      },
      {
        id: 'q3',
        question: 'How would you explain vibe coding to another student?',
        category: 'learning',
        expectedKeywords: ['AI', 'code', 'verify', 'prompt', 'understand', 'iterate'],
        minLength: 100,
      },
    ],
    minQualityScore: 70,
    xpReward: 75,
  },
];
