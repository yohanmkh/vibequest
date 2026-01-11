// Dynamic decisions and verifications that adapt to context
// Based on: player class, platform, stack, and current step

import { DecisionPoint, VerificationChallenge } from '../types/enhancedGameTypes';
import { PlayerClass, Platform, Stack } from '../types';
import { MicroStep } from '../types/enhanced';

// ============================================
// CONTEXT-AWARE DECISION GENERATOR
// ============================================

interface GameContext {
  playerClass: PlayerClass | null;
  platform: Platform | null;
  stack: Stack | null;
  currentStep: MicroStep | null;
}

// Decision templates that adapt to context
const decisionTemplates: Record<string, (ctx: GameContext) => DecisionPoint> = {
  // Scope creep decision - adapts to tech stack
  'scope-creep': (ctx) => ({
    id: `decision-scope-${ctx.currentStep?.id || 'general'}`,
    stepId: ctx.currentStep?.id || '',
    trigger: 'before-step',
    title: '🚨 Scope Creep Alert!',
    category: 'scope-management',
    scenario: generateScopeScenario(ctx),
    options: [
      {
        id: 'accept-scope',
        label: 'Accept the change',
        description: `Use AI to quickly add the feature${ctx.stack ? ` in ${ctx.stack}` : ''}`,
        consequences: {
          sanityChange: -15,
          coffeeChange: -20,
          xpChange: 10,
          techDebtChange: 25,
          aiTrustChange: -10,
        },
        isOptimal: false,
        reasoning: ctx.playerClass === '10x-architect' 
          ? 'As an architect, you know this adds complexity. Bad call.'
          : 'Adding features mid-sprint increases complexity and tech debt.',
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
        reasoning: 'Professional developers know when to say "not now". This is the way.',
      },
      {
        id: 'negotiate-scope',
        label: 'Negotiate a simpler version',
        description: 'Propose a minimal implementation for now',
        consequences: {
          sanityChange: 0,
          coffeeChange: -10,
          xpChange: 35,
          techDebtChange: 5,
          aiTrustChange: 0,
        },
        isOptimal: ctx.playerClass === 'co-pilot',
        reasoning: 'Finding middle ground shows strong communication skills.',
      },
    ],
  }),

  // AI usage decision - adapts to class
  'ai-review': (ctx) => ({
    id: `decision-ai-review-${ctx.currentStep?.id || 'general'}`,
    stepId: ctx.currentStep?.id || '',
    trigger: 'after-step',
    title: '🤖 AI Code Review',
    category: 'ai-usage',
    scenario: generateAIReviewScenario(ctx),
    options: [
      {
        id: 'trust-ai',
        label: 'Trust the AI output',
        description: 'The code looks fine, ship it!',
        consequences: {
          sanityChange: 5,
          coffeeChange: 5,
          xpChange: 5,
          techDebtChange: ctx.playerClass === 'vibe-surfer' ? 30 : 15,
          aiTrustChange: -15,
          codeQualityChange: -10,
        },
        isOptimal: false,
        reasoning: 'Blindly trusting AI leads to bugs and tech debt.',
      },
      {
        id: 'review-understand',
        label: 'Review and understand',
        description: 'Read through the code and make sure you understand it',
        consequences: {
          sanityChange: -5,
          coffeeChange: -10,
          xpChange: 40,
          techDebtChange: 0,
          aiTrustChange: 10,
          codeQualityChange: 15,
        },
        isOptimal: true,
        reasoning: 'Understanding code is essential. This is how you learn and grow.',
      },
      {
        id: 'refactor-improve',
        label: 'Refactor and improve',
        description: 'Understand it, then make it better',
        consequences: {
          sanityChange: -10,
          coffeeChange: -20,
          xpChange: 60,
          techDebtChange: -10,
          aiTrustChange: 15,
          codeQualityChange: 25,
        },
        isOptimal: ctx.playerClass === '10x-architect',
        reasoning: 'Going beyond AI suggestions shows mastery. Excellent work!',
      },
    ],
  }),

  // Testing decision - adapts to step type
  'testing-approach': (ctx) => ({
    id: `decision-testing-${ctx.currentStep?.id || 'general'}`,
    stepId: ctx.currentStep?.id || '',
    trigger: 'before-step',
    title: '🧪 Testing Strategy',
    category: 'quality-tradeoff',
    scenario: generateTestingScenario(ctx),
    options: [
      {
        id: 'skip-tests',
        label: 'Skip tests for now',
        description: '"I\'ll add them later" (you won\'t)',
        consequences: {
          sanityChange: 10,
          coffeeChange: 10,
          xpChange: 5,
          techDebtChange: 35,
          codeQualityChange: -20,
        },
        isOptimal: false,
        reasoning: 'Technical debt accumulates. Tests save time in the long run.',
      },
      {
        id: 'ai-generate-tests',
        label: 'Let AI generate tests',
        description: 'Quick and easy, but are they good tests?',
        consequences: {
          sanityChange: 0,
          coffeeChange: -5,
          xpChange: 20,
          techDebtChange: 10,
          aiTrustChange: -5,
          codeQualityChange: 5,
        },
        isOptimal: ctx.playerClass === 'vibe-surfer',
        reasoning: 'AI tests are better than no tests, but may miss edge cases.',
      },
      {
        id: 'write-thoughtful-tests',
        label: 'Write thoughtful tests',
        description: 'Consider edge cases and real scenarios',
        consequences: {
          sanityChange: -10,
          coffeeChange: -15,
          xpChange: 50,
          techDebtChange: -15,
          aiTrustChange: 10,
          codeQualityChange: 30,
        },
        isOptimal: ctx.playerClass === '10x-architect' || ctx.playerClass === 'co-pilot',
        reasoning: 'Quality tests are an investment that pays off exponentially.',
      },
    ],
  }),

  // Tech choice decision - adapts to platform/stack
  'tech-choice': (ctx) => ({
    id: `decision-tech-${ctx.currentStep?.id || 'general'}`,
    stepId: ctx.currentStep?.id || '',
    trigger: 'before-step',
    title: '⚙️ Technical Decision',
    category: 'technical-choice',
    scenario: generateTechChoiceScenario(ctx),
    options: generateTechOptions(ctx),
  }),
};

// ============================================
// CONTEXT-AWARE VERIFICATION GENERATOR
// ============================================

const verificationTemplates: Record<string, (ctx: GameContext) => VerificationChallenge> = {
  // State management verification - adapts to stack
  'state-management': (ctx) => ({
    id: `verify-state-${ctx.currentStep?.id || 'general'}`,
    mode: 'explain-code',
    title: `Explain: ${getStateManagementName(ctx)} State`,
    description: 'Before proceeding, explain what this code does:',
    codeToExplain: getStateManagementCode(ctx),
    requiredConcepts: getStateManagementConcepts(ctx),
    conceptHints: getStateManagementHints(ctx),
    xpReward: ctx.playerClass === 'vibe-surfer' ? 20 : 40,
    aiTrustBonus: 15,
  }),

  // Component understanding - adapts to platform
  'component-structure': (ctx) => ({
    id: `verify-component-${ctx.currentStep?.id || 'general'}`,
    mode: 'explain-code',
    title: `Explain: ${getPlatformComponentName(ctx)} Component`,
    description: 'Explain what this component does and how it works:',
    codeToExplain: getComponentCode(ctx),
    requiredConcepts: getComponentConcepts(ctx),
    xpReward: 35,
    aiTrustBonus: 10,
  }),

  // Bug spotting - adapts to current step type
  'spot-the-bug': (ctx) => ({
    id: `verify-bug-${ctx.currentStep?.id || 'general'}`,
    mode: 'spot-the-bug',
    title: '🐛 Find the Bug',
    description: `The AI generated this ${ctx.stack || 'code'}. Can you spot the issue?`,
    codeToExplain: getBuggyCode(ctx),
    requiredConcepts: ['bug', 'fix', 'error'],
    bugLocation: getBugLocation(ctx),
    bugExplanation: getBugExplanation(ctx),
    xpReward: 50,
    aiTrustBonus: 20,
  }),

  // Output prediction - adapts to language
  'predict-output': (ctx) => ({
    id: `verify-predict-${ctx.currentStep?.id || 'general'}`,
    mode: 'predict-output',
    title: '🔮 Predict the Output',
    description: 'What will this code output?',
    codeToExplain: getPredictionCode(ctx),
    expectedOutput: getPredictionOutput(ctx),
    requiredConcepts: ['output', 'result'],
    xpReward: 30,
    aiTrustBonus: 10,
  }),
};

// ============================================
// SCENARIO GENERATORS
// ============================================

function generateScopeScenario(ctx: GameContext): string {
  const feature = getScopeFeature(ctx);
  const stepName = ctx.currentStep?.title || 'current task';
  
  return `Your PM just messaged: "Can we add ${feature}? It should only take a few minutes with AI, right?"

You're in the middle of: ${stepName}
Stack: ${ctx.stack || 'your chosen framework'}
${ctx.playerClass === '10x-architect' ? '\n💡 As an architect, you know the real cost of scope changes.' : ''}`;
}

function getScopeFeature(ctx: GameContext): string {
  const features: Record<string, string[]> = {
    'react': ['drag-and-drop sorting', 'real-time collaboration', 'offline mode', 'dark theme toggle'],
    'vue': ['animation transitions', 'i18n support', 'PWA features', 'state persistence'],
    'svelte': ['motion animations', 'shared stores', 'SSR support', 'auto-imports'],
    'flutter': ['gesture recognition', 'platform-specific UI', 'background sync', 'push notifications'],
    'swift': ['haptic feedback', 'widget extensions', 'Siri shortcuts', 'iCloud sync'],
    'kotlin': ['material you theming', 'work manager tasks', 'room migrations', 'compose animations'],
  };
  
  const stackFeatures = features[ctx.stack?.toLowerCase() || ''] || features['react'];
  return stackFeatures[Math.floor(Math.random() * stackFeatures.length)];
}

function generateAIReviewScenario(ctx: GameContext): string {
  const stepName = ctx.currentStep?.title || 'this step';
  return `The AI just generated code for: ${stepName}

The code compiles and seems to work. But do you really understand what it does?
${ctx.playerClass === 'vibe-surfer' ? '\n⚡ Vibe Surfers move fast, but even they need to understand their code!' : ''}
${ctx.playerClass === '10x-architect' ? '\n🏗️ As an architect, code quality is your responsibility.' : ''}`;
}

function generateTestingScenario(ctx: GameContext): string {
  const testFramework = getTestFramework(ctx);
  return `You've completed the ${ctx.currentStep?.title || 'feature'}. Time to think about testing.

Recommended framework: ${testFramework}
${ctx.playerClass === 'co-pilot' ? '\n🤝 Co-Pilots balance speed with quality. What\'s your call?' : ''}`;
}

function getTestFramework(ctx: GameContext): string {
  const frameworks: Record<string, string> = {
    'react': 'Jest + React Testing Library',
    'vue': 'Vitest + Vue Test Utils',
    'svelte': 'Vitest + Svelte Testing Library',
    'flutter': 'Flutter Test + Mockito',
    'swift': 'XCTest',
    'kotlin': 'JUnit + Espresso',
    'next.js': 'Jest + Playwright',
    'node.js': 'Jest + Supertest',
  };
  return frameworks[ctx.stack?.toLowerCase() || ''] || 'Jest';
}

function generateTechChoiceScenario(ctx: GameContext): string {
  if (ctx.currentStep?.type === 'configuration') {
    return `You need to set up ${ctx.stack || 'your project'}. How do you want to configure it?`;
  }
  if (ctx.currentStep?.type === 'deployment') {
    return `Time to deploy your ${ctx.platform || 'app'}. Which approach do you prefer?`;
  }
  return `You're working on ${ctx.currentStep?.title || 'the next feature'}. There's a technical decision to make.`;
}

function generateTechOptions(ctx: GameContext): DecisionPoint['options'] {
  // Generate context-specific options
  if (ctx.currentStep?.type === 'deployment') {
    return [
      {
        id: 'quick-deploy',
        label: 'Quick deploy',
        description: 'Deploy to Vercel/Netlify with defaults',
        consequences: { xpChange: 15, techDebtChange: 5 },
        isOptimal: ctx.playerClass === 'vibe-surfer',
        reasoning: 'Fast deployment, but limited control.',
      },
      {
        id: 'custom-deploy',
        label: 'Custom CI/CD',
        description: 'Set up proper pipelines and environments',
        consequences: { xpChange: 40, coffeeChange: -15, techDebtChange: -10 },
        isOptimal: ctx.playerClass === '10x-architect',
        reasoning: 'More work upfront, but scales better.',
      },
    ];
  }
  
  // Default options
  return [
    {
      id: 'simple-approach',
      label: 'Keep it simple',
      description: 'Use the straightforward solution',
      consequences: { xpChange: 20, sanityChange: 5 },
      isOptimal: true,
      reasoning: 'Simple solutions are often the best.',
    },
    {
      id: 'complex-approach',
      label: 'Over-engineer it',
      description: 'Add abstractions for "future flexibility"',
      consequences: { xpChange: 10, techDebtChange: 20, sanityChange: -10 },
      isOptimal: false,
      reasoning: 'YAGNI - You Ain\'t Gonna Need It.',
    },
  ];
}

// ============================================
// CODE GENERATORS FOR VERIFICATIONS
// ============================================

function getStateManagementName(ctx: GameContext): string {
  const names: Record<string, string> = {
    'react': 'React useState',
    'vue': 'Vue ref/reactive',
    'svelte': 'Svelte Store',
    'flutter': 'Flutter State',
    'swift': 'SwiftUI @State',
    'kotlin': 'Compose State',
  };
  return names[ctx.stack?.toLowerCase() || ''] || 'State Management';
}

function getStateManagementCode(ctx: GameContext): string {
  const code: Record<string, string> = {
    'react': `const [todos, setTodos] = useState<Todo[]>([]);
const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

const filteredTodos = useMemo(() => 
  todos.filter(todo => 
    filter === 'all' ? true : 
    filter === 'active' ? !todo.completed : 
    todo.completed
  ), [todos, filter]);`,
    'vue': `const todos = ref<Todo[]>([])
const filter = ref<'all' | 'active' | 'completed'>('all')

const filteredTodos = computed(() =>
  todos.value.filter(todo =>
    filter.value === 'all' ? true :
    filter.value === 'active' ? !todo.completed :
    todo.completed
  ))`,
    'svelte': `import { writable, derived } from 'svelte/store';

const todos = writable<Todo[]>([]);
const filter = writable<'all' | 'active' | 'completed'>('all');

const filteredTodos = derived(
  [todos, filter],
  ([$todos, $filter]) => $todos.filter(todo =>
    $filter === 'all' ? true :
    $filter === 'active' ? !todo.completed :
    todo.completed
  )
);`,
    'flutter': `class TodoState extends ChangeNotifier {
  List<Todo> _todos = [];
  String _filter = 'all';
  
  List<Todo> get filteredTodos => _todos.where((todo) {
    if (_filter == 'all') return true;
    if (_filter == 'active') return !todo.completed;
    return todo.completed;
  }).toList();
}`,
    'swift': `@State private var todos: [Todo] = []
@State private var filter: TodoFilter = .all

var filteredTodos: [Todo] {
    todos.filter { todo in
        switch filter {
        case .all: return true
        case .active: return !todo.completed
        case .completed: return todo.completed
        }
    }
}`,
    'kotlin': `var todos by remember { mutableStateListOf<Todo>() }
var filter by remember { mutableStateOf(TodoFilter.All) }

val filteredTodos = remember(todos, filter) {
    todos.filter { todo ->
        when (filter) {
            TodoFilter.All -> true
            TodoFilter.Active -> !todo.completed
            TodoFilter.Completed -> todo.completed
        }
    }
}`,
  };
  return code[ctx.stack?.toLowerCase() || ''] || code['react'];
}

function getStateManagementConcepts(ctx: GameContext): string[] {
  const concepts: Record<string, string[]> = {
    'react': ['useState', 'useMemo', 'filter', 'derived state', 'dependency array'],
    'vue': ['ref', 'computed', 'reactive', 'filter'],
    'svelte': ['writable', 'derived', 'store', 'subscription'],
    'flutter': ['ChangeNotifier', 'getter', 'state'],
    'swift': ['@State', 'computed property', 'filter'],
    'kotlin': ['mutableStateOf', 'remember', 'derivedStateOf'],
  };
  return concepts[ctx.stack?.toLowerCase() || ''] || concepts['react'];
}

function getStateManagementHints(_ctx: GameContext): Record<string, string> {
  return {
    'state': 'How does the framework track and update data?',
    'filter': 'How does the filtering logic work?',
    'derived': 'What is derived/computed state?',
    'reactivity': 'How does the UI know when to update?',
  };
}

function getPlatformComponentName(ctx: GameContext): string {
  const names: Record<string, string> = {
    'web': 'React',
    'mobile': ctx.stack?.includes('flutter') ? 'Flutter Widget' : 'Native',
    'desktop': 'Desktop',
  };
  return names[ctx.platform?.toLowerCase() || ''] || 'UI';
}

function getComponentCode(ctx: GameContext): string {
  if (ctx.platform === 'mobile' && ctx.stack?.toLowerCase().includes('flutter')) {
    return `class TodoItem extends StatelessWidget {
  final Todo todo;
  final VoidCallback onToggle;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Checkbox(
        value: todo.completed,
        onChanged: (_) => onToggle(),
      ),
      title: Text(
        todo.title,
        style: TextStyle(
          decoration: todo.completed 
            ? TextDecoration.lineThrough 
            : null,
        ),
      ),
      trailing: IconButton(
        icon: Icon(Icons.delete),
        onPressed: onDelete,
      ),
    );
  }
}`;
  }
  
  // Default React component
  return `interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
      />
      <span className={todo.completed ? 'line-through text-gray-500' : ''}>
        {todo.title}
      </span>
      <button onClick={onDelete} className="ml-auto text-red-500">
        Delete
      </button>
    </div>
  );
}`;
}

function getComponentConcepts(ctx: GameContext): string[] {
  if (ctx.stack?.toLowerCase().includes('flutter')) {
    return ['StatelessWidget', 'build', 'ListTile', 'onChanged', 'TextStyle'];
  }
  return ['props', 'interface', 'event handler', 'conditional styling', 'component'];
}

function getBuggyCode(ctx: GameContext): string {
  const bugs: Record<string, string> = {
    'react': `function TodoList({ todos }) {
  const [items, setItems] = useState(todos);
  
  const addTodo = (title) => {
    items.push({ id: Date.now(), title, completed: false });
    setItems(items); // Bug: mutating state directly
  };
  
  return (
    <div>
      {items.map(item => (
        <TodoItem key={item.id} todo={item} />
      ))}
    </div>
  );
}`,
    'vue': `<script setup>
const todos = ref([])

const addTodo = (title) => {
  todos.value.push({ id: Date.now(), title, completed: false })
  // Missing: No input validation
  // Bug: No duplicate check
}
</script>`,
    'flutter': `class TodoList extends StatefulWidget {
  @override
  _TodoListState createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  List<Todo> todos = [];
  
  void addTodo(String title) {
    todos.add(Todo(id: DateTime.now().millisecondsSinceEpoch, title: title));
    // Bug: setState() not called, UI won't update
  }
}`,
  };
  return bugs[ctx.stack?.toLowerCase() || ''] || bugs['react'];
}

function getBugLocation(ctx: GameContext): { line: number; description: string } {
  const locations: Record<string, { line: number; description: string }> = {
    'react': { line: 5, description: 'The mutation happens here' },
    'vue': { line: 5, description: 'Missing validation here' },
    'flutter': { line: 12, description: 'setState() is missing' },
  };
  return locations[ctx.stack?.toLowerCase() || ''] || locations['react'];
}

function getBugExplanation(ctx: GameContext): string {
  const explanations: Record<string, string> = {
    'react': 'In React, you must never mutate state directly. Use setItems([...items, newItem]) instead.',
    'vue': 'While this works, there\'s no input validation or duplicate checking, which can lead to bugs.',
    'flutter': 'In Flutter StatefulWidget, you must call setState() to trigger a rebuild when state changes.',
  };
  return explanations[ctx.stack?.toLowerCase() || ''] || explanations['react'];
}

function getPredictionCode(ctx: GameContext): string {
  const code: Record<string, string> = {
    'react': `const [count, setCount] = useState(0);

useEffect(() => {
  console.log('Effect ran, count:', count);
  return () => console.log('Cleanup, count:', count);
}, [count]);

// User clicks button twice rapidly
setCount(1);
setCount(2);`,
    'default': `const items = [1, 2, 3, 4, 5];
const result = items
  .filter(x => x > 2)
  .map(x => x * 2)
  .reduce((a, b) => a + b, 0);
console.log(result);`,
  };
  return code[ctx.stack?.toLowerCase() || ''] || code['default'];
}

function getPredictionOutput(ctx: GameContext): string {
  const outputs: Record<string, string> = {
    'react': 'Effect ran, count: 2',
    'default': '24',
  };
  return outputs[ctx.stack?.toLowerCase() || ''] || outputs['default'];
}

// ============================================
// MAIN EXPORT: GET CONTEXTUAL CHALLENGES
// ============================================

export function getContextualDecision(
  type: 'scope-creep' | 'ai-review' | 'testing-approach' | 'tech-choice',
  context: GameContext
): DecisionPoint {
  const generator = decisionTemplates[type];
  if (!generator) {
    return decisionTemplates['scope-creep'](context);
  }
  return generator(context);
}

export function getContextualVerification(
  type: 'state-management' | 'component-structure' | 'spot-the-bug' | 'predict-output',
  context: GameContext
): VerificationChallenge {
  const generator = verificationTemplates[type];
  if (!generator) {
    return verificationTemplates['state-management'](context);
  }
  return generator(context);
}

// Get all available decision types for current step
export function getAvailableDecisions(context: GameContext): string[] {
  const decisions: string[] = ['scope-creep', 'ai-review'];
  
  if (context.currentStep?.type === 'testing') {
    decisions.push('testing-approach');
  }
  if (context.currentStep?.type === 'configuration' || context.currentStep?.type === 'deployment') {
    decisions.push('tech-choice');
  }
  
  return decisions;
}

// Get all available verification types for current step
export function getAvailableVerifications(context: GameContext): string[] {
  const verifications: string[] = [];
  
  if (context.currentStep?.type === 'code-generation') {
    verifications.push('state-management', 'component-structure', 'spot-the-bug');
  }
  if (context.currentStep?.type === 'code-review') {
    verifications.push('spot-the-bug', 'predict-output');
  }
  if (context.currentStep?.type === 'testing') {
    verifications.push('predict-output');
  }
  
  // Always have at least one option
  if (verifications.length === 0) {
    verifications.push('state-management');
  }
  
  return verifications;
}

// Get a random appropriate challenge for the context
export function getRandomDecision(context: GameContext): DecisionPoint {
  const available = getAvailableDecisions(context);
  const type = available[Math.floor(Math.random() * available.length)] as any;
  return getContextualDecision(type, context);
}

export function getRandomVerification(context: GameContext): VerificationChallenge {
  const available = getAvailableVerifications(context);
  const type = available[Math.floor(Math.random() * available.length)] as any;
  return getContextualVerification(type, context);
}
