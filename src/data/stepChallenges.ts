// UNIQUE Step-specific decisions and verifications for EACH curriculum step
// Every step has completely different scenarios and tests

import { DecisionPoint, VerificationChallenge } from '../types/enhancedGameTypes';
import { PlayerClass, Platform, Stack } from '../types';
import { MicroStep } from '../types/enhanced';

interface StepContext {
  playerClass: PlayerClass | null;
  platform: Platform | null;
  stack: Stack | null;
  step: MicroStep;
}

interface StepChallenge {
  decision: (ctx: StepContext) => DecisionPoint;
  verification: (ctx: StepContext) => VerificationChallenge;
}

// ============================================
// STEP-SPECIFIC CHALLENGES - ALL UNIQUE
// ============================================

const stepChallenges: Record<string, StepChallenge> = {

  // ========== PLAN-1: Gather Requirements ==========
  'plan-1': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '📝 The PM Wants a Meeting',
      category: 'scope-management',
      scenario: `Your PM schedules a requirements meeting. They say: "We need a todo app, but I have some IDEAS..."

They want to discuss:
- Basic todo CRUD
- User authentication  
- Real-time sync across devices
- AI-powered task suggestions
- Calendar integration
- Team collaboration features

The meeting is in 10 minutes. How do you prepare?`,
      options: [
        {
          id: 'accept-all',
          label: 'Agree to everything',
          description: '"Sure, we can do all of that!" (You want to impress them)',
          consequences: {
            sanityChange: -20,
            coffeeChange: -15,
            xpChange: 5,
            techDebtChange: 40,
          },
          isOptimal: false,
          reasoning: 'Saying yes to everything without pushback leads to impossible scope. Classic mistake!',
        },
        {
          id: 'mvp-focus',
          label: 'Propose MVP approach',
          description: '"Let\'s start with core features and iterate"',
          consequences: {
            sanityChange: 10,
            coffeeChange: 0,
            xpChange: 35,
            techDebtChange: -10,
            codeQualityChange: 15,
          },
          isOptimal: true,
          reasoning: 'MVP approach is professional. Ship early, learn fast, iterate.',
        },
        {
          id: 'document-first',
          label: 'Ask for written requirements first',
          description: '"Can you send me a doc before the meeting?"',
          consequences: {
            sanityChange: 5,
            coffeeChange: 5,
            xpChange: 25,
            techDebtChange: 0,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: 'Getting requirements in writing prevents scope creep. Smart move.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '📝 Prioritize These Requirements',
      description: `Your PM sent this feature list. Categorize them into MVP (Must Have), V2 (Nice to Have), and V3 (Future):`,
      codeToExplain: `Feature Requests for Todo App:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Add a new todo item
2. Mark todo as complete
3. Delete a todo
4. Real-time sync across devices
5. AI task suggestions
6. User authentication
7. Filter by status (all/active/done)
8. Due date reminders
9. Team sharing & collaboration
10. Dark mode

Your task: Which are MVP (ship first)?
Which can wait for V2? Which are V3?`,
      requiredConcepts: ['MVP', 'prioritization', 'must-have', 'nice-to-have', 'CRUD'],
      conceptHints: {
        'MVP': 'What\'s the minimum to be useful?',
        'CRUD': 'Create, Read, Update, Delete - the basics',
        'prioritization': 'What delivers value fastest?',
      },
      xpReward: 30,
      aiTrustBonus: 10,
    }),
  },

  // ========== PLAN-2: Create Project Plan ==========
  'plan-2': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '📅 Sprint Planning Conflict',
      category: 'time-management',
      scenario: `You're planning your ${ctx.stack || 'project'} timeline. Your tech lead asks:

"How long will the todo app take?"

Your honest estimate: 2 weeks
What the business wants: 1 week
What your AI suggests: "3-4 days with Cursor"

The deadline is tied to a product launch. What do you commit to?`,
      options: [
        {
          id: 'ai-estimate',
          label: 'Trust the AI estimate (3-4 days)',
          description: '"AI will speed things up!"',
          consequences: {
            sanityChange: -25,
            coffeeChange: -30,
            xpChange: 10,
            techDebtChange: 35,
            aiTrustChange: -20,
          },
          isOptimal: false,
          reasoning: 'AI estimates ignore testing, debugging, edge cases, and meetings. Dangerous!',
        },
        {
          id: 'honest-estimate',
          label: 'Give honest estimate (2 weeks)',
          description: '"I need 2 weeks to do this right"',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 40,
            techDebtChange: -15,
            codeQualityChange: 20,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: 'Honest estimates build trust. Under-promise, over-deliver.',
        },
        {
          id: 'negotiate',
          label: 'Negotiate scope for 1 week',
          description: '"1 week for MVP, week 2 for polish"',
          consequences: {
            sanityChange: 5,
            coffeeChange: -10,
            xpChange: 35,
            techDebtChange: 5,
          },
          isOptimal: ctx.playerClass === 'co-pilot',
          reasoning: 'Negotiating scope is a valuable skill. You found a middle ground.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '📅 Estimate This Sprint',
      description: `Break down this sprint and estimate hours for each task:`,
      codeToExplain: `Sprint 1: Todo App MVP
━━━━━━━━━━━━━━━━━━━━━━━
Task                          | Your Estimate
─────────────────────────────────────────────
Project setup & config        | ___ hours
TodoList component            | ___ hours  
TodoItem component            | ___ hours
AddTodo form                  | ___ hours
State management              | ___ hours
Basic styling                 | ___ hours
Testing                       | ___ hours
Bug fixes & polish            | ___ hours
─────────────────────────────────────────────
TOTAL                         | ___ hours

Pro tip: Multiply your estimate by 1.5-2x for reality`,
      requiredConcepts: ['estimation', 'buffer', 'sprint', 'breakdown', 'tasks'],
      conceptHints: {
        'estimation': 'How long does each task really take?',
        'buffer': 'Always add buffer time for unknowns',
        'breakdown': 'Smaller tasks = better estimates',
      },
      xpReward: 35,
      aiTrustBonus: 10,
    }),
  },

  // ========== INIT-1: Create Project Structure ==========
  'init-1': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '📁 Folder Structure Debate',
      category: 'technical-choice',
      scenario: `Your team is arguing about folder structure for the ${ctx.stack || 'project'}.

Developer A: "Let's use feature-based folders!"
├── features/
│   ├── todos/
│   └── auth/

Developer B: "No, type-based is cleaner!"
├── components/
├── hooks/
├── services/

Developer C: "Just use the framework default..."

You're the tie-breaker. What do you choose?`,
      options: [
        {
          id: 'default-structure',
          label: 'Use framework defaults',
          description: 'Go with what create-react-app/flutter gives us',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 15,
            techDebtChange: 15,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Defaults work for small projects but can get messy as you scale.',
        },
        {
          id: 'feature-based',
          label: 'Feature-based structure',
          description: 'Group by feature (todos/, auth/, shared/)',
          consequences: {
            sanityChange: 0,
            coffeeChange: -10,
            xpChange: 40,
            techDebtChange: -15,
            codeQualityChange: 25,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: 'Feature-based scales well and keeps related code together. Pro choice!',
        },
        {
          id: 'type-based',
          label: 'Type-based structure',
          description: 'Group by type (components/, hooks/, services/)',
          consequences: {
            sanityChange: 5,
            coffeeChange: -5,
            xpChange: 30,
            techDebtChange: 0,
            codeQualityChange: 10,
          },
          isOptimal: ctx.playerClass === 'co-pilot',
          reasoning: 'Type-based is familiar and works well for medium projects.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'spot-the-bug',
      title: '📁 Fix This Project Structure',
      description: `This folder structure has problems. Identify what's wrong:`,
      codeToExplain: `my-todo-app/
├── src/
│   ├── App.tsx
│   ├── TodoList.tsx          # ❌ Component in root
│   ├── TodoItem.tsx          # ❌ Component in root  
│   ├── api.ts                # ❌ Utility in root
│   ├── styles.css            # ❌ Styles in root
│   ├── useTodos.ts           # ❌ Hook in root
│   ├── types.ts
│   └── utils/
│       └── helpers.ts
├── package.json
└── README.md

What's the problem with this structure?
How would you reorganize it?`,
      requiredConcepts: ['organization', 'separation', 'folders', 'scalability'],
      bugLocation: { line: 3, description: 'Components should be in a components/ folder' },
      bugExplanation: 'All files in root makes it hard to navigate. Group by type or feature!',
      xpReward: 35,
      aiTrustBonus: 15,
    }),
  },

  // ========== INIT-2: Initialize Package.json ==========
  'init-2': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '📦 Dependency Dilemma',
      category: 'technical-choice',
      scenario: `Setting up ${ctx.stack === 'flutter-firebase' ? 'pubspec.yaml' : 'package.json'}. 

A senior dev reviews your dependencies and comments:

"Why are you installing ${ctx.stack === 'flutter-firebase' ? 'get_it, injectable, freezed, auto_route, dio' : 'redux, redux-toolkit, axios, lodash, moment, uuid'}? 
This is a todo app, not a spaceship."

But Stack Overflow says these are "industry standard"...`,
      options: [
        {
          id: 'kitchen-sink',
          label: 'Install everything anyway',
          description: '"Better to have it and not need it!"',
          consequences: {
            sanityChange: -10,
            coffeeChange: -5,
            xpChange: 5,
            techDebtChange: 30,
            codeQualityChange: -10,
          },
          isOptimal: false,
          reasoning: 'Unnecessary dependencies = bloat, security risks, and complexity.',
        },
        {
          id: 'minimal',
          label: 'Start minimal, add as needed',
          description: 'Only install what you\'ll use TODAY',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 40,
            techDebtChange: -15,
            codeQualityChange: 20,
          },
          isOptimal: true,
          reasoning: 'YAGNI - You Aren\'t Gonna Need It. Start lean, add when necessary.',
        },
        {
          id: 'ai-suggest',
          label: 'Ask AI for recommendations',
          description: 'Let ChatGPT decide what you need',
          consequences: {
            sanityChange: 0,
            coffeeChange: -5,
            xpChange: 20,
            techDebtChange: 10,
            aiTrustChange: -10,
          },
          isOptimal: false,
          reasoning: 'AI often suggests popular packages, not necessarily what YOU need.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '📦 Audit These Dependencies',
      description: `Review this ${ctx.stack === 'flutter-firebase' ? 'pubspec.yaml' : 'package.json'}. Which dependencies are unnecessary for a todo app?`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^2.24.0        # Need this? ___
  cloud_firestore: ^4.13.0      # Need this? ___
  provider: ^6.1.1              # Need this? ___
  get_it: ^7.6.0                # Need this? ___
  injectable: ^2.3.0            # Need this? ___
  freezed_annotation: ^2.4.0    # Need this? ___
  json_annotation: ^4.8.0       # Need this? ___
  dio: ^5.3.0                   # Need this? ___
  
For a basic todo app, which of these do you ACTUALLY need?
Which are overkill?` : `{
  "dependencies": {
    "react": "^18.2.0",           // Need this? ___
    "react-dom": "^18.2.0",       // Need this? ___
    "axios": "^1.6.0",            // Need this? ___
    "lodash": "^4.17.0",          // Need this? ___
    "moment": "^2.29.0",          // Need this? ___
    "redux": "^4.2.0",            // Need this? ___
    "@reduxjs/toolkit": "^1.9.0", // Need this? ___
    "uuid": "^9.0.0",             // Need this? ___
    "date-fns": "^2.30.0"         // Need this? ___
  }
}

For a basic todo app, which do you ACTUALLY need?`,
      requiredConcepts: ['dependencies', 'bloat', 'YAGNI', 'minimal', 'bundle size'],
      xpReward: 35,
      aiTrustBonus: 15,
    }),
  },

  // ========== INIT-3: TypeScript/Dart Configuration ==========
  'init-3': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '⚙️ Strict Mode Showdown',
      category: 'quality-tradeoff',
      scenario: `Configuring ${ctx.stack === 'flutter-firebase' ? 'Dart analysis' : 'TypeScript'}. Your options:

STRICT MODE:
- Catches more bugs at compile time
- More red squiggles to fix
- Takes longer to set up

RELAXED MODE:
- Faster to start coding
- Fewer errors to deal with
- Bugs show up at runtime instead

Your deadline is tight. What do you choose?`,
      options: [
        {
          id: 'relaxed',
          label: 'Relaxed mode (faster start)',
          description: '"I\'ll fix types later" (you won\'t)',
          consequences: {
            sanityChange: 10,
            coffeeChange: 10,
            xpChange: 10,
            techDebtChange: 35,
            codeQualityChange: -25,
          },
          isOptimal: false,
          reasoning: 'Skipping strict mode means bugs hide until production. Dangerous!',
        },
        {
          id: 'strict',
          label: 'Full strict mode',
          description: 'All checks enabled, no shortcuts',
          consequences: {
            sanityChange: -10,
            coffeeChange: -15,
            xpChange: 45,
            techDebtChange: -20,
            codeQualityChange: 35,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: 'Strict mode catches bugs early. The initial pain saves future pain.',
        },
        {
          id: 'gradual',
          label: 'Start strict, add exceptions when stuck',
          description: 'Strict by default, relax only when necessary',
          consequences: {
            sanityChange: 0,
            coffeeChange: -5,
            xpChange: 35,
            techDebtChange: -5,
            codeQualityChange: 20,
          },
          isOptimal: ctx.playerClass === 'co-pilot',
          reasoning: 'Pragmatic approach. Strict where it matters, flexible when needed.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'spot-the-bug',
      title: '⚙️ Strict Mode Would Catch This',
      description: `This code has a bug that strict mode would catch. Find it:`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `class Todo {
  String id;
  String title;
  bool completed;
  
  Todo({required this.id, required this.title, this.completed});
  // ^ BUG: What's wrong with this.completed?
}

void main() {
  var todo = Todo(id: '1', title: 'Test');
  print(todo.completed); // What prints?
}` : `interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

function createTodo(title: string): Todo {
  return {
    id: Date.now().toString(),
    title: title,
    // BUG: What's missing here?
  };
}

const todo = createTodo("Test");
console.log(todo.completed); // What prints?`,
      requiredConcepts: ['strict mode', 'type safety', 'null safety', 'required fields'],
      bugLocation: { line: ctx.stack === 'flutter-firebase' ? 6 : 10, description: 'Missing required property' },
      bugExplanation: ctx.stack === 'flutter-firebase' 
        ? 'completed has no default value and isn\'t required. It will be null!'
        : 'completed is missing from return object. TypeScript strict mode would catch this!',
      xpReward: 40,
      aiTrustBonus: 15,
    }),
  },

  // ========== INIT-4: Configure Styling ==========
  'init-4': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🎨 CSS Framework Wars',
      category: 'technical-choice',
      scenario: `Time to set up styling. The team has opinions:

TAILWIND FANS: "Utility classes are the future!"
CSS-IN-JS FANS: "Styled-components are cleaner!"
PURISTS: "Just use plain CSS modules"
${ctx.stack === 'flutter-firebase' ? 'FLUTTER: "Material Design 3 is built in!"' : ''}

Twitter is fighting about this RIGHT NOW. 
You need to pick something and move on.`,
      options: [
        {
          id: 'tailwind',
          label: ctx.stack === 'flutter-firebase' ? 'Custom theme with Material 3' : 'Tailwind CSS',
          description: ctx.stack === 'flutter-firebase' ? 'Use Material 3 with custom theming' : 'Utility-first CSS framework',
          consequences: {
            sanityChange: 5,
            coffeeChange: -5,
            xpChange: 35,
            techDebtChange: -5,
            codeQualityChange: 15,
          },
          isOptimal: true,
          reasoning: ctx.stack === 'flutter-firebase' 
            ? 'Material 3 is Flutter\'s strength. Use it!'
            : 'Tailwind is fast and maintainable. Good choice!',
        },
        {
          id: 'css-in-js',
          label: ctx.stack === 'flutter-firebase' ? 'Inline styles everywhere' : 'Styled Components',
          description: 'CSS-in-JS approach',
          consequences: {
            sanityChange: 0,
            coffeeChange: -10,
            xpChange: 25,
            techDebtChange: 10,
          },
          isOptimal: false,
          reasoning: 'More setup overhead for a small project.',
        },
        {
          id: 'plain-css',
          label: 'Plain CSS/SCSS',
          description: 'Keep it simple with regular stylesheets',
          consequences: {
            sanityChange: 5,
            coffeeChange: 5,
            xpChange: 20,
            techDebtChange: 5,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Simple and works. Nothing wrong with basics.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'predict-output',
      title: '🎨 What Does This Style Do?',
      description: `Predict what this component will look like:`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `Container(
  padding: EdgeInsets.all(16),
  margin: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(8),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.1),
        blurRadius: 4,
        offset: Offset(0, 2),
      ),
    ],
  ),
  child: Text('Todo Item'),
)

Describe what this looks like:` : `<div className="p-4 mx-2 my-1 bg-white rounded-lg shadow-md 
  hover:shadow-lg transition-shadow">
  <span className="text-gray-800 font-medium">Todo Item</span>
</div>

Describe what this looks like:
- Background color?
- Padding/margin?
- Border radius?
- What happens on hover?`,
      expectedOutput: 'White card with rounded corners, padding, slight shadow, shadow grows on hover',
      requiredConcepts: ['padding', 'margin', 'shadow', 'border-radius', 'hover'],
      xpReward: 30,
      aiTrustBonus: 10,
    }),
  },

  // ========== INIT-5: Initialize Git Repository ==========
  'init-5': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🔀 Git Workflow Decision',
      category: 'technical-choice',
      scenario: `Setting up Git. How will you structure your commits?

Option A: Commit whenever (YOLO)
"wip" "fix" "stuff" "asdfasdf"

Option B: Conventional Commits
"feat: add todo list component"
"fix: resolve checkbox toggle bug"

Option C: Commit only when feature is done
One big commit per feature

Your future self will read these commits. Choose wisely.`,
      options: [
        {
          id: 'yolo',
          label: 'Commit whenever, message whatever',
          description: '"git commit -m \'stuff\'" ship it!',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 5,
            techDebtChange: 25,
            codeQualityChange: -15,
          },
          isOptimal: false,
          reasoning: 'Bad commit messages make debugging and reverting a nightmare.',
        },
        {
          id: 'conventional',
          label: 'Conventional commits',
          description: 'feat:, fix:, docs:, refactor: prefixes',
          consequences: {
            sanityChange: -5,
            coffeeChange: -5,
            xpChange: 40,
            techDebtChange: -10,
            codeQualityChange: 25,
          },
          isOptimal: ctx.playerClass === '10x-architect' || ctx.playerClass === 'co-pilot',
          reasoning: 'Conventional commits = easy changelogs, better debugging, happier team.',
        },
        {
          id: 'big-commits',
          label: 'One commit per feature',
          description: 'Complete the feature, then commit',
          consequences: {
            sanityChange: 0,
            coffeeChange: 0,
            xpChange: 20,
            techDebtChange: 15,
          },
          isOptimal: false,
          reasoning: 'Big commits are hard to review and impossible to partially revert.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '🔀 Fix These Commit Messages',
      description: `These commit messages are BAD. Rewrite them properly:`,
      codeToExplain: `BAD COMMIT HISTORY:
━━━━━━━━━━━━━━━━━━━━
1. "stuff"
2. "fix"  
3. "wip"
4. "asdfasdf"
5. "it works now"
6. "final"
7. "final final"
8. "ok actually final"

Rewrite each as a good commit message:
1. → _______________
2. → _______________
3. → _______________

What format should commits follow?`,
      requiredConcepts: ['conventional commits', 'feat', 'fix', 'descriptive', 'atomic'],
      xpReward: 30,
      aiTrustBonus: 10,
    }),
  },

  // ========== ARCH-1: Define Architecture ==========
  'arch-1': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🏗️ Architecture Astronaut Alert',
      category: 'technical-choice',
      scenario: `You're designing the ${ctx.stack || 'app'} architecture. A senior dev warns:

"Don't over-engineer it. It's just a todo app."

But another dev says: "We need Clean Architecture! 
Repositories, Use Cases, Domain Layer, DTOs..."

The AI suggests: "Just put everything in one file to start."

Who do you listen to?`,
      options: [
        {
          id: 'over-engineer',
          label: 'Full Clean Architecture',
          description: '12 layers of abstraction for a todo app',
          consequences: {
            sanityChange: -20,
            coffeeChange: -25,
            xpChange: 20,
            techDebtChange: 25,
            codeQualityChange: -10,
          },
          isOptimal: false,
          reasoning: 'Clean Architecture for a todo app is massive overkill. YAGNI!',
        },
        {
          id: 'single-file',
          label: 'Everything in App.tsx',
          description: 'Ship fast, refactor later (you won\'t)',
          consequences: {
            sanityChange: 15,
            coffeeChange: 10,
            xpChange: 10,
            techDebtChange: 40,
            codeQualityChange: -25,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'For a quick prototype, sometimes spaghetti ships faster.',
        },
        {
          id: 'sensible-layers',
          label: 'Simple separation (UI, State, Types)',
          description: 'Components, hooks, types - just the basics',
          consequences: {
            sanityChange: 5,
            coffeeChange: -5,
            xpChange: 45,
            techDebtChange: -10,
            codeQualityChange: 30,
          },
          isOptimal: true,
          reasoning: 'Right-sized architecture. Enough structure without bureaucracy.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '🏗️ Rate This Architecture',
      description: `Is this architecture appropriate for a todo app? Why or why not?`,
      codeToExplain: `my-todo-app/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Todo.ts
│   │   ├── repositories/
│   │   │   └── ITodoRepository.ts
│   │   └── usecases/
│   │       ├── CreateTodoUseCase.ts
│   │       ├── DeleteTodoUseCase.ts
│   │       ├── UpdateTodoUseCase.ts
│   │       └── GetTodosUseCase.ts
│   ├── data/
│   │   ├── datasources/
│   │   │   └── LocalTodoDataSource.ts
│   │   ├── mappers/
│   │   │   └── TodoMapper.ts
│   │   └── repositories/
│   │       └── TodoRepositoryImpl.ts
│   ├── presentation/
│   │   ├── pages/
│   │   ├── widgets/
│   │   └── bloc/
│   └── core/
│       ├── di/
│       └── utils/

Is this too much? Too little? Just right?`,
      requiredConcepts: ['over-engineering', 'YAGNI', 'layers', 'complexity'],
      xpReward: 40,
      aiTrustBonus: 15,
    }),
  },

  // ========== SKELETON-0: Create App Shell ==========
  'skeleton-0': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🐚 The App Shell Strategy',
      category: 'technical-choice',
      scenario: `Starting the app shell. Do you:

A) Generate with AI
"Hey Cursor, create a todo app shell with header, main content, and footer"

B) Build from scratch
Open docs, write every line yourself

C) Copy from a previous project
You have a similar shell somewhere...`,
      options: [
        {
          id: 'ai-generate',
          label: 'Let AI generate it',
          description: 'One prompt, instant shell',
          consequences: {
            sanityChange: 10,
            coffeeChange: 10,
            xpChange: 20,
            techDebtChange: 10,
            aiTrustChange: -5,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Fast but you might not understand what was generated.',
        },
        {
          id: 'from-scratch',
          label: 'Build from scratch',
          description: 'Type every character yourself',
          consequences: {
            sanityChange: -10,
            coffeeChange: -15,
            xpChange: 45,
            techDebtChange: -10,
            codeQualityChange: 20,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: 'You understand every line. That\'s valuable!',
        },
        {
          id: 'hybrid',
          label: 'AI generates, you review & modify',
          description: 'Generate then understand and adjust',
          consequences: {
            sanityChange: 5,
            coffeeChange: 0,
            xpChange: 35,
            techDebtChange: 0,
            aiTrustChange: 5,
          },
          isOptimal: ctx.playerClass === 'co-pilot',
          reasoning: 'Best of both worlds. Speed + understanding.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'predict-output',
      title: '🐚 What Does This Shell Render?',
      description: `Describe what this app shell looks like when rendered:`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `Scaffold(
  appBar: AppBar(
    title: Text('My Todos'),
    actions: [
      IconButton(icon: Icon(Icons.search), onPressed: () {}),
      IconButton(icon: Icon(Icons.more_vert), onPressed: () {}),
    ],
  ),
  body: Center(child: Text('No todos yet!')),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
  ),
  bottomNavigationBar: BottomNavigationBar(
    items: [
      BottomNavigationBarItem(icon: Icon(Icons.list), label: 'All'),
      BottomNavigationBarItem(icon: Icon(Icons.check), label: 'Done'),
    ],
  ),
)

Describe the visual layout:` : `function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">My Todos</h1>
      </header>
      
      <main className="max-w-md mx-auto p-4">
        <p className="text-gray-500 text-center">No todos yet!</p>
      </main>
      
      <footer className="fixed bottom-0 w-full bg-white p-4 shadow-lg">
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          + Add Todo
        </button>
      </footer>
    </div>
  );
}

Describe the visual layout:`,
      expectedOutput: ctx.stack === 'flutter-firebase' 
        ? 'App bar with title and icons, empty center message, FAB button bottom right, bottom nav with tabs'
        : 'Blue header, centered content area with empty message, sticky footer with add button',
      requiredConcepts: ['layout', 'header', 'main', 'footer', 'visual hierarchy'],
      xpReward: 30,
      aiTrustBonus: 10,
    }),
  },

  // ========== SKELETON-1: Build Todo List Component ==========
  'skeleton-1': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '📋 List Rendering Approach',
      category: 'quality-tradeoff',
      scenario: `Building the TodoList. You need to render multiple items.

For 10 items: Any approach works fine.
For 1,000 items: Performance matters!
For 10,000 items: You need virtualization.

Your current design has... wait, how many todos will users have?

"Probably like 10-20" says the PM.
"But what if they have more?" asks QA.`,
      options: [
        {
          id: 'simple-map',
          label: 'Simple .map() rendering',
          description: 'todos.map(todo => <TodoItem />)',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 30,
            techDebtChange: 5,
          },
          isOptimal: true,
          reasoning: 'For a todo app, simple .map() is perfect. Don\'t over-optimize!',
        },
        {
          id: 'virtualized',
          label: 'Add virtualization now',
          description: 'Use react-window or ListView.builder',
          consequences: {
            sanityChange: -10,
            coffeeChange: -15,
            xpChange: 25,
            techDebtChange: -5,
          },
          isOptimal: false,
          reasoning: 'Premature optimization. Wait until you have a real performance problem.',
        },
        {
          id: 'pagination',
          label: 'Paginate the list',
          description: 'Show 10 at a time with "Load More"',
          consequences: {
            sanityChange: 0,
            coffeeChange: -10,
            xpChange: 20,
            techDebtChange: 0,
          },
          isOptimal: false,
          reasoning: 'Pagination adds UX complexity. Only needed for huge lists.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'spot-the-bug',
      title: '📋 Fix This List Component',
      description: `This TodoList has a common bug. Find it:`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `class TodoList extends StatelessWidget {
  final List<Todo> todos;
  
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: todos.map((todo) => TodoItem(todo: todo)).toList(),
      // ^ BUG: What's missing here?
    );
  }
}

// When you reorder todos, what goes wrong?` : `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem todo={todo} />
        // ^ BUG: What's missing here?
      ))}
    </ul>
  );
}

// React will warn you about this!`,
      requiredConcepts: ['key prop', 'list rendering', 'reconciliation', 'unique identifier'],
      bugLocation: { line: ctx.stack === 'flutter-firebase' ? 7 : 5, description: 'Missing key prop' },
      bugExplanation: ctx.stack === 'flutter-firebase' 
        ? 'Need key: ValueKey(todo.id) for efficient list updates!'
        : 'Missing key prop! Should be: <TodoItem key={todo.id} todo={todo} />',
      xpReward: 40,
      aiTrustBonus: 15,
    }),
  },

  // ========== SKELETON-2: Build Todo Item Component ==========
  'skeleton-2': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '✅ The Checkbox Conundrum',
      category: 'technical-choice',
      scenario: `Designing the TodoItem checkbox interaction.

Option A: Click anywhere to toggle
The whole row is clickable

Option B: Only checkbox toggles
Click text to edit, checkbox to complete

Option C: Swipe to complete (mobile)
Gesture-based interaction

The designer says "whatever feels natural."
Thanks, that's not helpful at all.`,
      options: [
        {
          id: 'click-anywhere',
          label: 'Click anywhere to toggle',
          description: 'Whole row is one big button',
          consequences: {
            sanityChange: 5,
            coffeeChange: 5,
            xpChange: 25,
            techDebtChange: 0,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Simple and touch-friendly. Good for mobile.',
        },
        {
          id: 'checkbox-only',
          label: 'Checkbox toggles, text for edit',
          description: 'Separate concerns, more precise',
          consequences: {
            sanityChange: -5,
            coffeeChange: -5,
            xpChange: 40,
            techDebtChange: -5,
            codeQualityChange: 15,
          },
          isOptimal: true,
          reasoning: 'Clear affordances. Users know what each click does.',
        },
        {
          id: 'swipe-gesture',
          label: 'Swipe gestures',
          description: 'Swipe right = done, swipe left = delete',
          consequences: {
            sanityChange: -15,
            coffeeChange: -20,
            xpChange: 30,
            techDebtChange: 10,
          },
          isOptimal: false,
          reasoning: 'Gestures are cool but hard to discover. Add as enhancement later.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '✅ Explain This TodoItem',
      description: `What does each part of this TodoItem do?`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `ListTile(
  leading: Checkbox(
    value: todo.completed,
    onChanged: (value) => onToggle(todo.id),
  ),
  title: Text(
    todo.title,
    style: TextStyle(
      decoration: todo.completed 
        ? TextDecoration.lineThrough 
        : TextDecoration.none,
      color: todo.completed ? Colors.grey : Colors.black,
    ),
  ),
  trailing: IconButton(
    icon: Icon(Icons.delete),
    onPressed: () => onDelete(todo.id),
  ),
)

Explain what each part does:
- leading: ___
- title style: ___
- trailing: ___` : `<li className="flex items-center gap-3 p-3 bg-white rounded shadow">
  <input
    type="checkbox"
    checked={todo.completed}
    onChange={() => onToggle(todo.id)}
    className="w-5 h-5"
  />
  <span className={\`flex-1 \${todo.completed ? 'line-through text-gray-400' : ''}\`}>
    {todo.title}
  </span>
  <button onClick={() => onDelete(todo.id)} className="text-red-500">
    🗑️
  </button>
</li>

Explain what each part does:
- checkbox: ___
- span className: ___  
- button: ___`,
      requiredConcepts: ['checkbox', 'conditional styling', 'event handlers', 'accessibility'],
      xpReward: 30,
      aiTrustBonus: 10,
    }),
  },

  // ========== SKELETON-3: Add New Todo Form ==========
  'skeleton-3': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '📝 Form or No Form?',
      category: 'technical-choice',
      scenario: `Adding the "new todo" input. Options:

A) Inline input (always visible)
Input at top/bottom, type and hit Enter

B) Modal form
Button opens modal with full form

C) Floating Action Button (mobile pattern)
FAB opens bottom sheet with input

The PM wants "whatever Twitter does."
(Twitter doesn't have todos...)`,
      options: [
        {
          id: 'inline',
          label: 'Inline input always visible',
          description: 'Simple text input, Enter to submit',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 35,
            techDebtChange: -5,
          },
          isOptimal: true,
          reasoning: 'Fastest UX for adding todos. No friction!',
        },
        {
          id: 'modal',
          label: 'Modal form',
          description: 'Click button → modal → form → submit',
          consequences: {
            sanityChange: -5,
            coffeeChange: -10,
            xpChange: 25,
            techDebtChange: 5,
          },
          isOptimal: false,
          reasoning: 'Modal adds friction. Save modals for complex forms.',
        },
        {
          id: 'fab-sheet',
          label: 'FAB + Bottom sheet',
          description: 'Material Design mobile pattern',
          consequences: {
            sanityChange: -10,
            coffeeChange: -15,
            xpChange: 30,
            techDebtChange: 5,
          },
          isOptimal: ctx.stack === 'flutter-firebase',
          reasoning: ctx.stack === 'flutter-firebase' 
            ? 'Flutter/Material pattern. Good for mobile!'
            : 'Over-engineering for a web app.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'spot-the-bug',
      title: '📝 Fix This Form',
      description: `This add-todo form has UX bugs. Find them:`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `TextField(
  controller: _controller,
  decoration: InputDecoration(
    hintText: 'Add todo...',
  ),
)

// Bugs:
// 1. How do you submit? (no button, no onSubmitted)
// 2. What happens after submit? (input not cleared)
// 3. Can you add empty todos? (no validation)

// Fix these issues!` : `function AddTodo({ onAdd }) {
  const [text, setText] = useState('');
  
  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Add todo..."
    />
  );
  // Bugs:
  // 1. How do you submit? (no form, no Enter key handler)
  // 2. What happens after submit? (text not cleared)
  // 3. Can you add empty todos? (no validation)
}`,
      requiredConcepts: ['form submission', 'validation', 'clearing input', 'Enter key'],
      bugLocation: { line: 5, description: 'Missing submit handler and validation' },
      bugExplanation: 'Need: onSubmit handler, clear input after add, validate non-empty!',
      xpReward: 40,
      aiTrustBonus: 15,
    }),
  },

  // ========== SKELETON-4: Style Components ==========
  'skeleton-4': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🎨 The Pixel Perfect Trap',
      category: 'quality-tradeoff',
      scenario: `The designer sent a Figma mockup. It's beautiful.
But matching it EXACTLY would take 3x longer.

Designer: "Can you match this pixel-perfect?"
PM: "We need to ship by Friday."
You: Looking at 47 custom spacing values...

What do you do?`,
      options: [
        {
          id: 'pixel-perfect',
          label: 'Match Figma exactly',
          description: 'Every shadow, every gradient, every pixel',
          consequences: {
            sanityChange: -25,
            coffeeChange: -30,
            xpChange: 20,
            techDebtChange: 15,
          },
          isOptimal: false,
          reasoning: 'Pixel-perfect takes forever and users won\'t notice most details.',
        },
        {
          id: 'system-tokens',
          label: 'Use design system tokens',
          description: 'Close enough with consistent spacing/colors',
          consequences: {
            sanityChange: 5,
            coffeeChange: -5,
            xpChange: 40,
            techDebtChange: -10,
            codeQualityChange: 20,
          },
          isOptimal: true,
          reasoning: 'Design systems = consistent + maintainable. 80% of the look, 20% of the effort.',
        },
        {
          id: 'minimal',
          label: 'Minimal styling (ship fast)',
          description: 'Basic styling, polish later',
          consequences: {
            sanityChange: 15,
            coffeeChange: 10,
            xpChange: 20,
            techDebtChange: 20,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Sometimes ugly but working beats beautiful but delayed.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '🎨 Critique This Styling',
      description: `What's wrong with this styling approach?`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `// INCONSISTENT STYLING
Container(margin: EdgeInsets.only(left: 12, right: 17, top: 8)),
Container(margin: EdgeInsets.only(left: 15, right: 12, top: 11)),  
Container(margin: EdgeInsets.only(left: 13, right: 16, top: 9)),

// Magic numbers everywhere!
Text('Title', style: TextStyle(fontSize: 17)),
Text('Body', style: TextStyle(fontSize: 14)),
Text('Small', style: TextStyle(fontSize: 11)),

// What problems do you see?
// How would you fix this?` : `/* INCONSISTENT STYLING */
.todo-item-1 { margin: 12px 17px 8px; }
.todo-item-2 { margin: 15px 12px 11px; }
.todo-item-3 { margin: 13px 16px 9px; }

/* Magic colors */
.header { color: #3b82f6; }
.button { color: #3a81f5; }  /* Almost the same? */
.link { color: #3c83f7; }    /* Why different? */

/* What problems do you see?
   How would you fix this? */`,
      requiredConcepts: ['design tokens', 'consistency', 'magic numbers', 'theme'],
      xpReward: 35,
      aiTrustBonus: 10,
    }),
  },

  // ========== SKELETON-5: Make Responsive ==========
  'skeleton-5': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '📱 Mobile First or Desktop First?',
      category: 'technical-choice',
      scenario: `Making the app responsive. Your analytics say:

60% mobile users
30% desktop users  
10% tablet users

Do you design mobile-first and scale up?
Or desktop-first and squeeze down?

The designer only gave you a mobile mockup.`,
      options: [
        {
          id: 'mobile-first',
          label: 'Mobile first',
          description: 'Start small, add complexity for larger screens',
          consequences: {
            sanityChange: 5,
            coffeeChange: -5,
            xpChange: 40,
            techDebtChange: -10,
            codeQualityChange: 20,
          },
          isOptimal: true,
          reasoning: 'Mobile-first = simpler base styles. Matches your user distribution too!',
        },
        {
          id: 'desktop-first',
          label: 'Desktop first',
          description: 'Full layout, then hide things on mobile',
          consequences: {
            sanityChange: -5,
            coffeeChange: -10,
            xpChange: 25,
            techDebtChange: 10,
          },
          isOptimal: false,
          reasoning: 'Desktop-first means more overrides for mobile. More CSS, more bugs.',
        },
        {
          id: 'ignore-responsive',
          label: 'Skip responsiveness for now',
          description: 'Fixed width, works on desktop',
          consequences: {
            sanityChange: 15,
            coffeeChange: 10,
            xpChange: 10,
            techDebtChange: 30,
          },
          isOptimal: false,
          reasoning: '60% of your users are on mobile! This is a bad trade-off.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'predict-output',
      title: '📱 How Does This Behave?',
      description: `What happens at different screen sizes?`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth < 600) {
      // Mobile
      return Column(children: [todoList, addButton]);
    } else {
      // Desktop
      return Row(
        children: [
          Expanded(flex: 2, child: todoList),
          Expanded(flex: 1, child: sidebar),
        ],
      );
    }
  },
)

At 400px width: ___
At 800px width: ___
At 1200px width: ___` : `<div className="
  flex flex-col          /* Mobile: stack vertically */
  md:flex-row            /* Desktop: side by side */
  md:max-w-4xl md:mx-auto
">
  <main className="flex-1 p-4">
    {/* Todo list */}
  </main>
  <aside className="
    hidden md:block      /* Hidden on mobile! */
    w-64 p-4 bg-gray-50
  ">
    {/* Sidebar */}
  </aside>
</div>

At 375px (mobile): ___
At 768px (tablet): ___
At 1200px (desktop): ___`,
      expectedOutput: 'Mobile: single column, no sidebar. Desktop: two columns with sidebar.',
      requiredConcepts: ['responsive', 'breakpoints', 'mobile-first', 'media queries'],
      xpReward: 35,
      aiTrustBonus: 10,
    }),
  },

  // ========== SKELETON-6: Wire Up Navigation ==========
  'skeleton-6': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🧭 Routing Complexity',
      category: 'technical-choice',
      scenario: `Setting up navigation. Your todo app needs:

- Main todo list view
- Individual todo detail view (maybe?)
- Settings page (eventually)

Do you need a full router, or is simpler state-based navigation enough?`,
      options: [
        {
          id: 'full-router',
          label: 'Full routing library',
          description: 'React Router, Go Router, etc.',
          consequences: {
            sanityChange: -10,
            coffeeChange: -15,
            xpChange: 30,
            techDebtChange: -5,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: 'Good for deep linking and browser history. Might be overkill for MVP.',
        },
        {
          id: 'state-based',
          label: 'Simple state-based views',
          description: 'useState for currentView, switch/case render',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 35,
            techDebtChange: 5,
          },
          isOptimal: true,
          reasoning: 'For a simple app, state-based is simpler. Add router when you need URLs.',
        },
        {
          id: 'single-page',
          label: 'No navigation needed',
          description: 'Everything on one page',
          consequences: {
            sanityChange: 15,
            coffeeChange: 10,
            xpChange: 20,
            techDebtChange: 10,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Simplest option. Works for MVP!',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '🧭 Explain This Navigation',
      description: `How does this navigation work?`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `// Simple navigation with Navigator
Navigator.push(context, MaterialPageRoute(
  builder: (context) => TodoDetailScreen(todo: todo),
));

// vs Navigator 2.0 / GoRouter
GoRouter(
  routes: [
    GoRoute(path: '/', builder: (_, __) => HomeScreen()),
    GoRoute(path: '/todo/:id', builder: (_, state) => 
      TodoDetailScreen(id: state.params['id']!)),
  ],
)

When would you use each approach?` : `// Option A: State-based
const [view, setView] = useState('list');

{view === 'list' && <TodoList />}
{view === 'detail' && <TodoDetail />}
{view === 'settings' && <Settings />}

// Option B: React Router
<Routes>
  <Route path="/" element={<TodoList />} />
  <Route path="/todo/:id" element={<TodoDetail />} />
  <Route path="/settings" element={<Settings />} />
</Routes>

When would you use each approach?`,
      requiredConcepts: ['navigation', 'routing', 'deep linking', 'state management'],
      xpReward: 35,
      aiTrustBonus: 10,
    }),
  },

  // ========== BRAIN-0: Define Data Types ==========
  'brain-0': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🧠 Type System Philosophy',
      category: 'technical-choice',
      scenario: `Defining the Todo type. How strict do you go?

MINIMALIST:
type Todo = { id: string; title: string; done: boolean; }

COMPLETE:  
type Todo = {
  id: UUID;
  title: NonEmptyString;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  priority: Priority;
  tags: Tag[];
  dueDate?: Date;
}

Your MVP only shows title and checkbox...`,
      options: [
        {
          id: 'minimal-type',
          label: 'Minimal type (3 fields)',
          description: 'Just id, title, completed - nothing more',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 30,
            techDebtChange: 5,
          },
          isOptimal: true,
          reasoning: 'Start minimal, extend when needed. YAGNI wins again!',
        },
        {
          id: 'full-featured',
          label: 'Full-featured type',
          description: 'All fields you might ever need',
          consequences: {
            sanityChange: -10,
            coffeeChange: -15,
            xpChange: 25,
            techDebtChange: 15,
          },
          isOptimal: false,
          reasoning: 'Over-designing types wastes time on fields you won\'t use.',
        },
        {
          id: 'extensible',
          label: 'Minimal + metadata field',
          description: 'Base fields + optional metadata: Record<string, any>',
          consequences: {
            sanityChange: 0,
            coffeeChange: -5,
            xpChange: 35,
            techDebtChange: 0,
            codeQualityChange: 10,
          },
          isOptimal: ctx.playerClass === 'co-pilot',
          reasoning: 'Flexible approach. Extend via metadata without schema changes.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'spot-the-bug',
      title: '🧠 Fix This Type Definition',
      description: `This Todo type has problems. Find them:`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `class Todo {
  var id;           // BUG 1: What type?
  var title;        // BUG 2: What type?  
  var completed;    // BUG 3: What type?
  
  Todo(this.id, this.title, this.completed);
}

// Problems:
// 1. All vars are dynamic - no type safety
// 2. id could be null
// 3. title could be empty string

// How would you fix this?` : `interface Todo {
  id: any;           // BUG 1: too loose!
  title: string;     // BUG 2: could be empty
  completed: boolean | null;  // BUG 3: why nullable?
}

function createTodo(title): Todo {  // BUG 4: no param type!
  return {
    id: Math.random(),  // BUG 5: not a string
    title,
    completed: null,    // BUG 6: starts null?
  };
}`,
      requiredConcepts: ['type safety', 'nullability', 'validation', 'type inference'],
      bugLocation: { line: 2, description: 'Using any/dynamic types' },
      bugExplanation: 'Types should be specific: id: string, title: string (with validation), completed: boolean',
      xpReward: 40,
      aiTrustBonus: 15,
    }),
  },

  // ========== BRAIN-1: Implement State Management ==========
  'brain-1': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🧠 State Management Wars',
      category: 'technical-choice',
      scenario: `Time to manage todo state. The internet is fighting:

REACT: "Just use useState!" vs "No, useReducer!" vs "No, Zustand!" vs "No, Redux!"
FLUTTER: "Provider!" vs "Riverpod!" vs "BLoC!" vs "GetX!"

Your todo app has:
- A list of todos
- Add/edit/delete operations
- Maybe a filter (all/active/done)

What do you choose?`,
      options: [
        {
          id: 'simple-state',
          label: ctx.stack === 'flutter-firebase' ? 'StatefulWidget + setState' : 'useState + props',
          description: 'Keep it simple, built-in state',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 25,
            techDebtChange: 10,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Simple state works for small apps but gets messy with prop drilling.',
        },
        {
          id: 'light-state-lib',
          label: ctx.stack === 'flutter-firebase' ? 'Provider / Riverpod' : 'Zustand / Jotai',
          description: 'Lightweight state library',
          consequences: {
            sanityChange: 5,
            coffeeChange: -5,
            xpChange: 40,
            techDebtChange: -5,
            codeQualityChange: 20,
          },
          isOptimal: true,
          reasoning: 'Right-sized solution. Easy to use, scales well, minimal boilerplate.',
        },
        {
          id: 'heavy-state-lib',
          label: ctx.stack === 'flutter-firebase' ? 'BLoC / Clean Architecture' : 'Redux + Toolkit + Saga',
          description: 'Full enterprise state management',
          consequences: {
            sanityChange: -20,
            coffeeChange: -25,
            xpChange: 25,
            techDebtChange: 20,
            codeQualityChange: -5,
          },
          isOptimal: false,
          reasoning: 'Massive overkill for a todo app. You\'ll write 10x more code.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '🧠 Explain This State Code',
      description: `What does each part of this state management do?`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `final todosProvider = StateNotifierProvider<TodoNotifier, List<Todo>>((ref) {
  return TodoNotifier();
});

class TodoNotifier extends StateNotifier<List<Todo>> {
  TodoNotifier() : super([]);
  
  void add(String title) {
    state = [...state, Todo(id: uuid(), title: title, completed: false)];
  }
  
  void toggle(String id) {
    state = state.map((t) => t.id == id ? t.copyWith(completed: !t.completed) : t).toList();
  }
  
  void delete(String id) {
    state = state.where((t) => t.id != id).toList();
  }
}

// Why [...state, newTodo] instead of state.add()?` : `const useTodoStore = create((set) => ({
  todos: [],
  
  addTodo: (title) => set((state) => ({
    todos: [...state.todos, { id: crypto.randomUUID(), title, completed: false }]
  })),
  
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    )
  })),
  
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(t => t.id !== id)
  })),
}));

// Why [...state.todos, newTodo] instead of push()?`,
      requiredConcepts: ['immutability', 'state updates', 'spread operator', 'map/filter'],
      xpReward: 45,
      aiTrustBonus: 15,
    }),
  },

  // ========== BRAIN-1.5: Add Persistence ==========
  'brain-1.5': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '💾 Where to Store Data?',
      category: 'technical-choice',
      scenario: `Users want their todos to persist. Where do you store them?

Options:
A) Local storage (browser/device)
   Pros: Simple, works offline
   Cons: No sync across devices

B) Firebase/Cloud
   Pros: Syncs everywhere, real-time
   Cons: More setup, needs auth

C) Your own backend
   Pros: Full control
   Cons: You have to build it

The PM says "whatever is fastest."`,
      options: [
        {
          id: 'local-storage',
          label: 'Local Storage only',
          description: ctx.stack === 'flutter-firebase' ? 'SharedPreferences / Hive' : 'localStorage / IndexedDB',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 30,
            techDebtChange: 10,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Fast to implement, works offline. Good for MVP!',
        },
        {
          id: 'firebase',
          label: ctx.stack === 'flutter-firebase' ? 'Firebase Firestore' : 'Firebase or Supabase',
          description: 'Cloud database with real-time sync',
          consequences: {
            sanityChange: -5,
            coffeeChange: -15,
            xpChange: 45,
            techDebtChange: -10,
            codeQualityChange: 15,
          },
          isOptimal: ctx.stack === 'flutter-firebase' || ctx.playerClass === '10x-architect',
          reasoning: 'Scalable and handles sync. More setup but worth it.',
        },
        {
          id: 'local-then-cloud',
          label: 'Local first, cloud later',
          description: 'Start with localStorage, add cloud sync as upgrade',
          consequences: {
            sanityChange: 5,
            coffeeChange: -5,
            xpChange: 35,
            techDebtChange: 5,
          },
          isOptimal: ctx.playerClass === 'co-pilot',
          reasoning: 'Iterative approach. Ship fast, enhance later.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'spot-the-bug',
      title: '💾 Fix This Persistence Code',
      description: `This localStorage code has bugs. Find them:`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `Future<void> saveTodos(List<Todo> todos) async {
  final prefs = await SharedPreferences.getInstance();
  prefs.setString('todos', todos.toString()); // BUG!
}

Future<List<Todo>> loadTodos() async {
  final prefs = await SharedPreferences.getInstance();
  final data = prefs.getString('todos');
  return data;  // BUG! Wrong return type
}

// What's wrong with:
// 1. todos.toString() for saving?
// 2. Returning data directly?` : `function saveTodos(todos) {
  localStorage.setItem('todos', todos);  // BUG!
}

function loadTodos() {
  const data = localStorage.getItem('todos');
  return data;  // BUG! Returns string, not array
}

// What's wrong with:
// 1. Saving todos directly?
// 2. Returning data without parsing?`,
      requiredConcepts: ['JSON serialization', 'parsing', 'type conversion', 'localStorage'],
      bugLocation: { line: 2, description: 'Not JSON serializing' },
      bugExplanation: 'Must JSON.stringify when saving and JSON.parse when loading!',
      xpReward: 40,
      aiTrustBonus: 15,
    }),
  },

  // ========== BRAIN-2: Implement Core Operations ==========
  'brain-2': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '⚡ Optimistic or Pessimistic?',
      category: 'technical-choice',
      scenario: `Implementing todo operations with a backend.

OPTIMISTIC UPDATE:
- Update UI immediately
- Send to server in background
- Rollback if server fails
- Feels instant!

PESSIMISTIC UPDATE:
- Show loading spinner
- Wait for server response
- Then update UI
- Safer but slower

What feels better for a todo app?`,
      options: [
        {
          id: 'optimistic',
          label: 'Optimistic updates',
          description: 'Update UI first, sync later',
          consequences: {
            sanityChange: -5,
            coffeeChange: -10,
            xpChange: 45,
            techDebtChange: 5,
            codeQualityChange: 15,
          },
          isOptimal: true,
          reasoning: 'Optimistic updates feel snappy! Users love instant feedback.',
        },
        {
          id: 'pessimistic',
          label: 'Pessimistic updates',
          description: 'Wait for server, then update UI',
          consequences: {
            sanityChange: 5,
            coffeeChange: 5,
            xpChange: 30,
            techDebtChange: -5,
          },
          isOptimal: false,
          reasoning: 'Safe but feels sluggish. Fine for critical data, overkill for todos.',
        },
        {
          id: 'local-only',
          label: 'Just local state (no server)',
          description: 'Skip the backend complexity',
          consequences: {
            sanityChange: 15,
            coffeeChange: 10,
            xpChange: 20,
            techDebtChange: 15,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Simplest approach for MVP. Add backend sync later.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '⚡ Trace This Update Flow',
      description: `Trace what happens when user clicks "complete todo":`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `Future<void> toggleTodo(String id) async {
  // Step 1: Optimistic update
  state = state.map((t) => 
    t.id == id ? t.copyWith(completed: !t.completed) : t
  ).toList();
  
  try {
    // Step 2: Sync to server
    await FirebaseFirestore.instance
      .collection('todos')
      .doc(id)
      .update({'completed': /* new value */});
  } catch (e) {
    // Step 3: Rollback on failure
    state = state.map((t) =>
      t.id == id ? t.copyWith(completed: !t.completed) : t
    ).toList();
    showError('Failed to update');
  }
}

What happens at each step?` : `async function toggleTodo(id) {
  // Step 1: Save original state
  const original = [...todos];
  
  // Step 2: Optimistic update
  setTodos(todos.map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  ));
  
  try {
    // Step 3: Sync to server
    await api.updateTodo(id, { completed: !original.find(t => t.id === id).completed });
  } catch (error) {
    // Step 4: Rollback on failure
    setTodos(original);
    showError('Failed to update');
  }
}

What happens at each step?`,
      requiredConcepts: ['optimistic update', 'rollback', 'error handling', 'async/await'],
      xpReward: 45,
      aiTrustBonus: 15,
    }),
  },

  // ========== BRAIN-3: Add Filtering/Sorting ==========
  'brain-3': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🔍 Filter UX Decision',
      category: 'technical-choice',
      scenario: `Adding todo filters (All / Active / Completed).

Where do you apply the filter?

A) URL params: /todos?filter=active
   - Shareable, bookmarkable
   - More work to implement

B) Local state: useState('all')
   - Simple
   - Resets on refresh

C) Derived state: compute filtered list
   - Keep source of truth clean
   - Filter is just a view

How fancy do you go?`,
      options: [
        {
          id: 'url-params',
          label: 'URL-based filters',
          description: '/todos?filter=active - shareable links',
          consequences: {
            sanityChange: -10,
            coffeeChange: -15,
            xpChange: 40,
            techDebtChange: -5,
            codeQualityChange: 15,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: 'URL state is shareable and persists refresh. Pro pattern!',
        },
        {
          id: 'local-state',
          label: 'Local component state',
          description: 'Simple useState for filter',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 25,
            techDebtChange: 5,
          },
          isOptimal: ctx.playerClass === 'vibe-surfer',
          reasoning: 'Simple and works. Filter resets on refresh but that\'s okay.',
        },
        {
          id: 'derived-state',
          label: 'Derived/computed state',
          description: 'Filter is computed from todos + filter value',
          consequences: {
            sanityChange: 0,
            coffeeChange: -5,
            xpChange: 35,
            techDebtChange: -5,
            codeQualityChange: 10,
          },
          isOptimal: true,
          reasoning: 'Clean separation. Source of truth stays pure, filter is just a lens.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'predict-output',
      title: '🔍 What Does This Filter Return?',
      description: `Given these todos, what does each filter show?`,
      codeToExplain: `const todos = [
  { id: '1', title: 'Buy milk', completed: true },
  { id: '2', title: 'Walk dog', completed: false },
  { id: '3', title: 'Code app', completed: false },
  { id: '4', title: 'Sleep', completed: true },
];

const filter = 'active'; // Options: 'all', 'active', 'completed'

const filteredTodos = todos.filter(todo => {
  if (filter === 'all') return true;
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
});

// What titles appear when filter = 'active'?
// What titles appear when filter = 'completed'?
// What titles appear when filter = 'all'?`,
      expectedOutput: 'Active: Walk dog, Code app. Completed: Buy milk, Sleep. All: all 4.',
      requiredConcepts: ['filter', 'array methods', 'boolean logic', 'derived state'],
      xpReward: 35,
      aiTrustBonus: 10,
    }),
  },

  // ========== BRAIN-4: Error Handling ==========
  'brain-4': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🚨 Error Handling Strategy',
      category: 'quality-tradeoff',
      scenario: `Your todo app can fail in many ways:
- Network errors (can't reach server)
- Validation errors (empty title)
- Auth errors (session expired)
- Server errors (500s)

How do you handle errors?

A) Show technical error messages
"Error: ECONNREFUSED localhost:3000"

B) User-friendly messages
"Couldn't save. Please try again."

C) Silent retry + fallback
Try again automatically, show error only if all retries fail`,
      options: [
        {
          id: 'technical-errors',
          label: 'Show technical details',
          description: 'Console.log + show error.message to user',
          consequences: {
            sanityChange: 10,
            coffeeChange: 5,
            xpChange: 15,
            techDebtChange: 15,
            codeQualityChange: -15,
          },
          isOptimal: false,
          reasoning: 'Users don\'t understand "ECONNREFUSED". Bad UX!',
        },
        {
          id: 'friendly-errors',
          label: 'User-friendly messages',
          description: 'Map errors to helpful messages',
          consequences: {
            sanityChange: 0,
            coffeeChange: -5,
            xpChange: 40,
            techDebtChange: -5,
            codeQualityChange: 20,
          },
          isOptimal: true,
          reasoning: 'Good UX! Users know what went wrong and what to do.',
        },
        {
          id: 'auto-retry',
          label: 'Silent retry with fallback',
          description: 'Auto-retry 3x, then show friendly error',
          consequences: {
            sanityChange: -10,
            coffeeChange: -15,
            xpChange: 45,
            techDebtChange: -10,
            codeQualityChange: 25,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: 'Robust pattern! Many errors are transient. Retry often works.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '🚨 Improve This Error Handling',
      description: `This error handling is bad. How would you improve it?`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `Future<void> addTodo(String title) async {
  try {
    await db.collection('todos').add({'title': title});
  } catch (e) {
    print(e);  // 🤔 Just prints to console
  }
}

// Problems:
// 1. User sees nothing when it fails
// 2. No retry logic
// 3. No specific error messages

// How would you improve this?` : `async function addTodo(title) {
  try {
    await api.post('/todos', { title });
  } catch (e) {
    console.log(e);  // 🤔 Just logs to console
  }
}

// Problems:
// 1. User sees nothing when it fails
// 2. No retry logic
// 3. No specific error messages

// How would you improve this?`,
      requiredConcepts: ['error handling', 'user feedback', 'retry', 'error messages'],
      xpReward: 40,
      aiTrustBonus: 15,
    }),
  },

  // ========== TEST: Add Tests ==========
  'test': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🧪 Testing Philosophy',
      category: 'quality-tradeoff',
      scenario: `Time to write tests. How much testing do you do?

A) No tests (ship it!)
"I tested it manually, it works"

B) Critical path tests only
Test add/toggle/delete - the core flows

C) Full test coverage
Unit tests, integration tests, E2E tests

Your deadline is tomorrow. What do you prioritize?`,
      options: [
        {
          id: 'no-tests',
          label: 'Skip tests for now',
          description: '"I\'ll add them later" (you won\'t)',
          consequences: {
            sanityChange: 15,
            coffeeChange: 10,
            xpChange: 5,
            techDebtChange: 40,
            codeQualityChange: -30,
          },
          isOptimal: false,
          reasoning: 'No tests = no confidence. Bugs will haunt you.',
        },
        {
          id: 'critical-tests',
          label: 'Test critical paths only',
          description: 'Happy path tests for core features',
          consequences: {
            sanityChange: 0,
            coffeeChange: -10,
            xpChange: 40,
            techDebtChange: -10,
            codeQualityChange: 25,
          },
          isOptimal: true,
          reasoning: 'Pragmatic testing. Cover the important stuff, ship with confidence.',
        },
        {
          id: 'full-coverage',
          label: '100% test coverage',
          description: 'Test everything, miss nothing',
          consequences: {
            sanityChange: -25,
            coffeeChange: -30,
            xpChange: 30,
            techDebtChange: -20,
            codeQualityChange: 15,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: '100% coverage is rarely worth the effort. Diminishing returns.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '🧪 What Does This Test Check?',
      description: `Explain what this test verifies:`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `testWidgets('adds todo to list', (tester) async {
  await tester.pumpWidget(MyApp());
  
  // Find and tap add button
  await tester.enterText(find.byType(TextField), 'Buy milk');
  await tester.tap(find.byIcon(Icons.add));
  await tester.pump();
  
  // Verify todo appears
  expect(find.text('Buy milk'), findsOneWidget);
});

// What does this test verify?
// What could still break that this test misses?` : `test('adds todo to list', () => {
  render(<TodoApp />);
  
  // Add a todo
  fireEvent.change(screen.getByPlaceholderText('Add todo...'), {
    target: { value: 'Buy milk' }
  });
  fireEvent.click(screen.getByText('Add'));
  
  // Verify it appears
  expect(screen.getByText('Buy milk')).toBeInTheDocument();
});

// What does this test verify?
// What could still break that this test misses?`,
      requiredConcepts: ['unit test', 'integration test', 'assertions', 'test coverage'],
      xpReward: 40,
      aiTrustBonus: 15,
    }),
  },

  // ========== DEPLOY: Deploy to Production ==========
  'deploy': {
    decision: (ctx) => ({
      id: `decision-${ctx.step.id}`,
      stepId: ctx.step.id,
      trigger: 'before-step',
      title: '🚀 Deployment Strategy',
      category: 'technical-choice',
      scenario: `Ready to deploy! Where do you host?

A) Free tier (Vercel/Firebase/Netlify)
   $0/month, easy setup, some limits

B) Cloud provider (AWS/GCP)
   More control, more complexity, more cost

C) Self-hosted (VPS/Docker)
   Full control, you manage everything

It's a todo app, not a bank. What makes sense?`,
      options: [
        {
          id: 'free-tier',
          label: 'Free hosting (Vercel/Firebase)',
          description: 'One-click deploy, free tier',
          consequences: {
            sanityChange: 15,
            coffeeChange: 10,
            xpChange: 35,
            techDebtChange: 0,
          },
          isOptimal: true,
          reasoning: 'Perfect for MVPs! Free, fast, and just works.',
        },
        {
          id: 'cloud-provider',
          label: 'AWS/GCP/Azure',
          description: 'Enterprise cloud infrastructure',
          consequences: {
            sanityChange: -15,
            coffeeChange: -20,
            xpChange: 30,
            techDebtChange: -5,
          },
          isOptimal: false,
          reasoning: 'Overkill for a todo app. Save cloud complexity for when you need it.',
        },
        {
          id: 'self-hosted',
          label: 'Self-hosted VPS',
          description: 'Your own server, your own problems',
          consequences: {
            sanityChange: -25,
            coffeeChange: -25,
            xpChange: 40,
            techDebtChange: 10,
          },
          isOptimal: ctx.playerClass === '10x-architect',
          reasoning: 'Learning experience! But high maintenance for a side project.',
        },
      ],
    }),
    verification: (ctx) => ({
      id: `verify-${ctx.step.id}`,
      mode: 'explain-code',
      title: '🚀 Explain This Deploy Config',
      description: `What does this deployment configuration do?`,
      codeToExplain: ctx.stack === 'flutter-firebase' ? `# firebase.json
{
  "hosting": {
    "public": "build/web",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}

// What does each section configure?
// What does the rewrite rule do?` : `// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}

// What does each section configure?
// What do the headers do?`,
      requiredConcepts: ['deployment', 'hosting', 'SPA routing', 'security headers'],
      xpReward: 40,
      aiTrustBonus: 15,
    }),
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getDecisionForStep(ctx: StepContext): DecisionPoint | null {
  const stepId = ctx.step.id;
  const challenge = stepChallenges[stepId];
  
  if (!challenge) {
    console.log(`No decision found for step: ${stepId}`);
    return null;
  }
  
  return challenge.decision(ctx);
}

export function getVerificationForStep(ctx: StepContext): VerificationChallenge | null {
  const stepId = ctx.step.id;
  const challenge = stepChallenges[stepId];
  
  if (!challenge) {
    console.log(`No verification found for step: ${stepId}`);
    return null;
  }
  
  return challenge.verification(ctx);
}

export function hasStepChallenge(stepId: string): boolean {
  return stepId in stepChallenges;
}

export function getAvailableStepIds(): string[] {
  return Object.keys(stepChallenges);
}

export { stepChallenges };
export type { StepContext, StepChallenge };
