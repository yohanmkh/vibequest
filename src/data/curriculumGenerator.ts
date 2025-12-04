// Curriculum Generator - Creates complete 21-step curricula for all scenarios
import { MicroStep } from '../types/enhanced';

type ClassType = 'vibe-surfer' | 'co-pilot' | '10x-architect';
type Platform = 'web' | 'mobile';
type Stack = 'react-node' | 'flutter-firebase' | 'nextjs-prisma';

interface StackConfig {
  name: string;
  styling: string;
  language: string;
  framework: string;
}

const stackConfigs: Record<Stack, StackConfig> = {
  'react-node': {
    name: 'React + Node.js',
    styling: 'Tailwind CSS',
    language: 'TypeScript',
    framework: 'React',
  },
  'flutter-firebase': {
    name: 'Flutter + Firebase',
    styling: 'Material Design',
    language: 'Dart',
    framework: 'Flutter',
  },
  'nextjs-prisma': {
    name: 'Next.js + Prisma',
    styling: 'Tailwind CSS',
    language: 'TypeScript',
    framework: 'Next.js',
  },
};

function createStep(
  baseId: string,
  title: string,
  description: string,
  learningObjective: string,
  type: MicroStep['type'],
  order: number,
  coffeeCost: number,
  xpReward: number,
  dependsOn: string[],
  aiTool: string,
  toolInstructions: string[],
  examplePrompts: string[],
  promptTemplate: string,
  toolTips: string[],
  config: StackConfig,
  classType: ClassType,
  platform: Platform
): MicroStep {
  // Customize based on stack
  const isNextJs = config.framework.indexOf('Next') !== -1;
  const backendName = platform === 'mobile' ? 'Firebase' : (isNextJs ? 'Prisma' : 'Node.js');

  let customizedTitle = title
    .replace('React', config.framework)
    .replace('Node.js', backendName)
    .replace('TypeScript', config.language)
    .replace('Tailwind CSS', config.styling);
  
  // Add class-specific prefix to make titles visually distinct
  if (classType === 'vibe-surfer') {
    customizedTitle = `🤖 ${customizedTitle}`;
  } else if (classType === 'co-pilot') {
    customizedTitle = `🤝 ${customizedTitle}`;
  } else if (classType === '10x-architect') {
    customizedTitle = `⚡ ${customizedTitle}`;
  }

  const customizedDescription = description
    .replace('React', config.framework)
    .replace('Node.js', backendName);

  const customizedPrompts = examplePrompts.map(p => 
    p.replace('React', config.framework)
     .replace('Node.js', backendName)
     .replace('TypeScript', config.language)
     .replace('[STACK]', config.name)
  );

  const customizedTemplate = promptTemplate
    .replace('[STACK]', config.name)
    .replace('[PLATFORM]', platform)
    .replace('React', config.framework)
    .replace('Node.js', backendName);

  // Adjust difficulty and methodology based on class
  let finalXpReward = xpReward;
  let finalCoffeeCost = coffeeCost;
  let finalLearningObjective = learningObjective;
  let finalDescription = customizedDescription;
  let finalToolTips = [...toolTips];

  if (classType === 'vibe-surfer') {
    // EASY MODE: Total AI Reliance - AI does the work, student learns concepts
    finalDescription = `${customizedDescription} [AI-Driven: Let AI generate the solution, focus on understanding the concepts.]`;
    finalLearningObjective = `${learningObjective} (Easy Mode: Learn by observing AI-generated solutions. Focus on understanding concepts rather than writing code yourself.)`;
    finalToolTips.push('Let AI do the heavy lifting', 'Focus on understanding the generated code', 'Ask AI to explain what it created');
  } else if (classType === 'co-pilot') {
    // INTERMEDIATE: Hybrid - Student and AI work together
    finalXpReward += 5;
    finalDescription = `${customizedDescription} [Hybrid Approach: You architect the solution, AI helps implement it. Work together with AI.]`;
    finalLearningObjective = `${learningObjective} (Intermediate: Hybrid methodology. You design and plan, AI helps implement. Focus on code quality, architecture, and understanding the implementation.)`;
    finalToolTips.push('Plan your approach first', 'Use AI to implement your design', 'Review and refine AI-generated code', 'Understand both the what and the how');
  } else if (classType === '10x-architect') {
    // HARD: AI as a tool - Student does the work, AI provides help
    finalXpReward += 10;
    finalCoffeeCost += 5;
    finalDescription = `${customizedDescription} [Expert Mode: You write the code, AI provides guidance and help when stuck. Deep technical understanding required.]`;
    finalLearningObjective = `${learningObjective} (Expert: AI is just a tool. You write the code yourself, use AI for help, debugging, and learning. Deep technical understanding and problem-solving skills required.)`;
    finalToolTips.push('Write code yourself first', 'Use AI only when stuck or for guidance', 'Understand every line of code', 'Focus on deep technical knowledge', 'AI is a helper, not a crutch');
  }

  return {
    id: baseId,
    title: customizedTitle,
    description: finalDescription,
    learningObjective: finalLearningObjective,
    type,
    status: order === 0 ? 'available' : 'locked',
    order,
    coffeeCost: finalCoffeeCost,
    xpReward: finalXpReward,
    dependsOn,
    aiTool,
    toolInstructions,
    examplePrompts: customizedPrompts,
    promptTemplate: customizedTemplate,
    toolTips: finalToolTips,
    explanation: classType === 'vibe-surfer' 
      ? `${finalDescription} Let ${aiTool} generate the complete solution. Your job is to understand what it created.`
      : classType === 'co-pilot'
      ? `${finalDescription} Work with ${aiTool} to implement your design. You plan, AI helps execute.`
      : `${finalDescription} Write the code yourself. Use ${aiTool} only for help, debugging, or when you're stuck.`,
    bestPractices: classType === 'vibe-surfer'
      ? [
          'Let AI generate the complete solution',
          'Focus on understanding the generated code',
          'Ask AI to explain what it created',
          'Learn concepts, not just copy code',
          'Use AI prompts to learn best practices',
        ]
      : classType === 'co-pilot'
      ? [
          'Plan your approach before using AI',
          'Design the structure, let AI implement details',
          'Review and refine AI-generated code',
          'Understand both the architecture and implementation',
          'Work collaboratively with AI',
          'Focus on code quality and best practices',
        ]
      : [
          'Write code yourself first',
          'Use AI only when you need help',
          'Understand every line of code you write',
          'Focus on deep technical understanding',
          'Use AI for debugging and learning, not generation',
          'Solve problems yourself before asking AI',
        ],
  };
}

export function generateCompleteCurriculum(
  classType: ClassType,
  platform: Platform,
  stack: Stack
): MicroStep[] {
  const config = stackConfigs[stack];
  const steps: MicroStep[] = [];

  // PHASE 0: REQUIREMENTS & PLANNING (2 steps)
  steps.push(createStep(
    'plan-1',
    'Gather Requirements',
    `Define the requirements and features for your ${config.name} todo application.`,
    `Learn how to gather and document requirements. Learn how to use ChatGPT for requirement analysis.`,
    'configuration',
    0,
    0,
    10,
    [],
    'chatgpt',
    [
      'Step 1: Go to chat.openai.com',
      'Step 2: Start a new conversation',
      `Step 3: Ask: "Help me define requirements for a ${config.name} todo app"`,
      'Step 4: List features: add todos, mark complete, delete, filter, etc.',
      'Step 5: Document user stories and acceptance criteria',
      'Step 6: Review and refine requirements',
    ],
    [
      `What are the essential features for a ${config.name} todo application?`,
      `Help me create user stories for a todo app with ${platform === 'mobile' ? 'mobile' : 'web'} interface`,
      `What requirements should I consider for a ${config.framework} todo app?`,
    ],
    `Ask ChatGPT: "Help me define requirements for a ${config.name} todo application. I need to identify core features, user stories, acceptance criteria, and technical requirements. Consider ${platform === 'mobile' ? 'mobile UX' : 'web UX'} best practices."`,
    ['Be specific about your platform', 'Ask for user stories', 'Request acceptance criteria', 'Consider edge cases'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'plan-2',
    'Create Project Plan',
    `Create a development plan and timeline for your ${config.name} todo app.`,
    `Learn project planning and task breakdown. Learn how to use Claude for project planning.`,
    'configuration',
    1,
    5,
    15,
    ['plan-1'],
    'claude',
    [
      'Step 1: Go to claude.ai',
      'Step 2: Provide your requirements from the previous step',
      'Step 3: Ask: "Help me create a development plan for this todo app"',
      'Step 4: Break down into phases: Setup, Frontend, Backend, Testing, Deployment',
      'Step 5: Estimate time for each phase',
      'Step 6: Create a timeline',
    ],
    [
      `Create a development plan for a ${config.name} todo app`,
      `Break down the todo app development into phases and tasks`,
      `Help me estimate development time for a ${config.framework} todo app`,
    ],
    `Ask Claude: "Based on these requirements [paste requirements], help me create a development plan for my ${config.name} todo app. Break it down into phases, identify dependencies, estimate effort, and create a timeline."`,
    ['Provide context from requirements', 'Ask for phase breakdown', 'Request time estimates', 'Get dependency mapping'],
    config,
    classType,
    platform
  ));

  // PHASE 1: INITIALIZATION (5 steps)
  steps.push(createStep(
    'init-1',
    'Create Project Structure',
    `Set up the basic folder structure for your ${config.name} ${platform} application.`,
    `Understand project organization and folder structure best practices. Learn how to use ChatGPT for project planning.`,
    'configuration',
    1,
    0,
    10,
    [],
    'chatgpt',
    [
      'Step 1: Go to chat.openai.com',
      'Step 2: Start a new conversation',
      `Step 3: Ask: "What's the best folder structure for a ${config.name} ${platform} app?"`,
      'Step 4: Review ChatGPT\'s recommendations',
      'Step 5: Create the folders in your project',
      'Step 6: Ask follow-up questions if needed',
    ],
    [
      `What's the best folder structure for a ${config.name} ${platform} application?`,
      `How should I organize files in a ${platform} ${config.name} app?`,
      `Show me a recommended project structure for ${config.framework}`,
    ],
    `Ask ChatGPT: "What's the best folder structure for a ${config.name} ${platform} application? Include frontend and backend organization."`,
    ['Ask for best practices', 'Request examples', 'Consider scalability'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'init-2',
    platform === 'mobile' ? 'Initialize pubspec.yaml' : 'Initialize Package.json',
    classType === 'vibe-surfer' 
      ? `Let AI create ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} for you. [AI-Driven: Accept the complete generated file]`
      : classType === 'co-pilot'
      ? `Work with AI to set up ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} based on your requirements. [Hybrid: You plan dependencies, AI generates file]`
      : `Create ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} yourself, use AI only for reference. [Expert: Write it manually, AI helps explain]`,
    classType === 'vibe-surfer'
      ? `Learn dependency management by observing AI. Let Cursor generate ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} completely.`
      : classType === 'co-pilot'
      ? `Learn dependency management. Plan your dependencies, then use Cursor to generate ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'}.`
      : `Master dependency management. Write ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} yourself, use Cursor only for help.`,
    'configuration',
    2,
    5,
    15,
    ['init-1'],
    classType === 'vibe-surfer' ? 'cursor' : classType === 'co-pilot' ? 'cursor-composer' : 'cursor',
    classType === 'vibe-surfer'
      ? [
          'Step 1: Open Cursor editor',
          `Step 2: Create a new file called ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'}`,
          'Step 3: Press Cmd+K for inline edit',
          `Step 4: Ask: "Generate a complete ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} for ${config.name} todo app with all dependencies"`,
          'Step 5: Accept the complete generated file - AI did everything',
          'Step 6: Your job: Understand what dependencies were added',
        ]
      : classType === 'co-pilot'
      ? [
          'Step 1: Plan which dependencies you need first',
          'Step 2: Open Cursor and create the file',
          'Step 3: Press Cmd+I for Cursor Composer',
          `Step 4: Describe: "I need ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} with these dependencies: [list yours]"`,
          'Step 5: Review and refine the generated file',
          'Step 6: Work together with Cursor',
        ]
      : [
          'Step 1: Research dependencies yourself',
          `Step 2: Write ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} manually`,
          'Step 3: If unsure about a dependency, press Cmd+K',
          'Step 4: Ask: "What does this package do?" or "Is this the right version?"',
          'Step 5: Use Cursor only for learning, not generation',
          'Step 6: Understand every dependency you add',
        ],
    classType === 'vibe-surfer'
      ? [
          `Generate a complete ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} for ${config.name} with all dependencies`,
          `Create full ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} file with everything I need`,
        ]
      : classType === 'co-pilot'
      ? [
          `I need ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} with these dependencies: [list yours]`,
          `Help me create ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} for my ${config.name} app`,
        ]
      : [
          `What dependencies do I need for ${config.name}?`,
          `Help me understand ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} structure`,
        ],
    classType === 'vibe-surfer'
      ? `Use Cursor (Cmd+K): "Create a complete ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} file for a ${config.name} todo application. Include ALL necessary dependencies, devDependencies, and scripts. Generate everything for me."`
      : classType === 'co-pilot'
      ? `Use Cursor Composer (Cmd+I): "I need a ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} for ${config.name}. I want these dependencies: [list yours]. Help me create it with proper structure."`
      : `Use Cursor only for help: "I'm writing ${platform === 'mobile' ? 'pubspec.yaml' : 'package.json'} manually. Can you explain what each dependency does?" [Write it yourself]`,
    classType === 'vibe-surfer'
      ? ['Let Cursor generate everything', 'Accept the complete file', 'Focus on understanding dependencies']
      : classType === 'co-pilot'
      ? ['Plan your dependencies first', 'Work with Cursor Composer', 'Review and refine together']
      : ['Write it yourself', 'Use Cursor only for learning', 'Understand every dependency'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'init-3',
    platform === 'mobile' ? 'Configure Dart Analysis' : 'Set Up TypeScript Configuration',
    platform === 'mobile' ? 'Configure Dart for code analysis.' : 'Configure TypeScript for type safety.',
    platform === 'mobile' 
      ? 'Understand Dart configuration and its benefits. Learn how to use Gemini for Dart setup.'
      : 'Understand TypeScript configuration and its benefits. Learn how to use Gemini for TypeScript setup.',
    'configuration',
    3,
    5,
    15,
    ['init-2'],
    'gemini',
    [
      'Step 1: Go to gemini.google.com',
      'Step 2: Sign in with your Google account',
      `Step 3: Ask: "What's the best ${platform === 'mobile' ? 'Dart' : 'TypeScript'} configuration for ${config.framework}?"`,
      `Step 4: Review Gemini's ${platform === 'mobile' ? 'analysis_options.yaml' : 'tsconfig.json'} example`,
      'Step 5: Copy the configuration',
      `Step 6: Paste into your ${platform === 'mobile' ? 'analysis_options.yaml' : 'tsconfig.json'} file`,
    ],
    [
      `What's the best ${platform === 'mobile' ? 'Dart' : 'TypeScript'} configuration for ${config.framework}?`,
      `Show me a ${platform === 'mobile' ? 'analysis_options.yaml' : 'tsconfig.json'} for ${config.framework} with strict mode`,
    ],
    `Ask Gemini: "What ${platform === 'mobile' ? 'Dart' : 'TypeScript'} configuration should I use for ${config.framework}? Provide a complete ${platform === 'mobile' ? 'analysis_options.yaml' : 'tsconfig.json'} example."`,
    ['Request strict mode configuration', 'Ask about module resolution', 'Get examples'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'init-4',
    `Configure ${config.styling}`,
    `Set up ${config.styling} for styling.`,
    `Learn how to configure styling frameworks. Learn how to use Claude for configuration help.`,
    'configuration',
    4,
    5,
    15,
    ['init-2'],
    'claude',
    [
      'Step 1: Go to claude.ai',
      'Step 2: Sign in or create an account',
      `Step 3: Ask: "How do I set up ${config.styling} with ${config.framework}?"`,
      'Step 4: Review Claude\'s step-by-step instructions',
      'Step 5: Follow the installation steps',
      `Step 6: Ask about configuration files`,
      'Step 7: Implement the configuration',
    ],
    [
      `How do I set up ${config.styling} for a ${config.framework} project?`,
      `What's the best way to configure ${config.styling} with ${config.framework}?`,
    ],
    `Ask Claude: "Help me configure ${config.styling} for my ${config.framework} project. Provide setup instructions and configuration examples."`,
    ['Ask for complete setup instructions', 'Request configuration file examples', 'Get best practices'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'init-5',
    'Initialize Git Repository',
    'Set up version control with Git.',
    'Understand the importance of version control. Learn how to use ChatGPT for Git setup.',
    'git',
    5,
    5,
    15,
    ['init-1'],
    'chatgpt',
    [
      'Step 1: Go to chat.openai.com',
      'Step 2: Ask: "How do I initialize a Git repository for a [STACK] project?"',
      'Step 3: Get .gitignore recommendations',
      'Step 4: Follow the Git initialization steps',
      'Step 5: Create .gitignore file with ChatGPT\'s suggestions',
      'Step 6: Make your first commit',
    ],
    [
      `How do I initialize a Git repository for a ${config.name} project?`,
      `What should be in .gitignore for a ${config.framework} project?`,
    ],
    `Ask ChatGPT: "How do I set up Git for a ${config.name} project? Include .gitignore recommendations."`,
    ['Ask for .gitignore examples', 'Learn basic Git commands', 'Understand version control concepts'],
    config,
    classType,
    platform
  ));

  // PHASE 1.5: SYSTEM ARCHITECTURE (1 step)
  steps.push(createStep(
    'arch-1',
    'Design System Architecture',
    `Design the overall architecture for your ${config.name} todo application.`,
    `Understand system architecture and design patterns. Learn how to use Claude for architecture design.`,
    'configuration',
    6,
    10,
    25,
    ['init-5'],
    'claude',
    [
      'Step 1: Go to claude.ai',
      'Step 2: Describe your project: "I\'m building a todo app with [requirements]"',
      `Step 3: Ask: "Help me design the system architecture for a ${config.name} todo app"`,
      'Step 4: Review architecture diagrams and component structure',
      'Step 5: Discuss frontend-backend communication',
      'Step 6: Plan data flow and state management',
      'Step 7: Document the architecture',
    ],
    [
      `Design the system architecture for a ${config.name} todo app`,
      `What's the best architecture pattern for a ${config.framework} application?`,
      `Help me design the component structure and data flow for my todo app`,
    ],
    `Ask Claude: "Help me design the system architecture for my ${config.name} todo app. I need to understand: component structure, data flow, state management approach, API design, ${platform === 'mobile' ? 'mobile architecture patterns' : 'web architecture patterns'}, and scalability considerations. Please provide diagrams and explanations."`,
    ['Ask for architecture diagrams', 'Request design pattern recommendations', 'Discuss scalability', 'Plan for future features'],
    config,
    classType,
    platform
  ));

  // PHASE 2: THE SKELETON (7 steps - includes UI design)
  
  // Step 2.0: Design UI with AI Tools
  steps.push(createStep(
    'skeleton-0',
    'Design UI with AI Design Tools',
    `Create the UI design for your todo app using AI design tools before coding.`,
    `Learn UI/UX design principles and how to use AI design tools (Figma AI, Galileo AI, Uizard) for rapid prototyping.`,
    'code-generation',
    7,
    10,
    25,
    ['arch-1'],
    classType === 'vibe-surfer' ? 'galileo-ai' : classType === 'co-pilot' ? 'figma-ai' : 'uizard-ai',
    classType === 'vibe-surfer'
      ? [
          'Step 1: Go to galileo.ai or use the Figma plugin',
          'Step 2: Sign in with your account',
          'Step 3: Describe: "Create a complete todo app interface with header, input field, and todo list"',
          'Step 4: Let Galileo AI generate the complete design - no need to plan details yourself',
          'Step 5: Review the AI-generated design',
          'Step 6: If needed, ask AI to iterate: "Make it more modern" or "Add dark mode"',
          'Step 7: Export or screenshot the design',
          'Step 8: Use this AI-generated design as your complete reference - AI did the design work for you',
        ]
      : classType === 'co-pilot'
      ? [
          'Step 1: Plan your UI structure first: What components do you need?',
          'Step 2: Open Figma (figma.com) and create a new file',
          'Step 3: Use Figma AI "Make Design" to generate base designs',
          'Step 4: You refine: Adjust colors, spacing, typography to match your vision',
          'Step 5: Create a design system - you define the rules, AI helps implement',
          'Step 6: Review and iterate - you make design decisions, AI helps execute',
          'Step 7: Export design specs for development',
          'Step 8: Use as reference - you designed it, AI helped build it',
        ]
      : [
          'Step 1: Design your UI architecture first - plan components, layout, data flow',
          'Step 2: Go to uizard.io and sign in',
          'Step 3: Use "Text to Design" only as a starting point or reference',
          'Step 4: You design the complete UI structure yourself',
          'Step 5: Use Uizard to quickly prototype your design ideas',
          'Step 6: You make all design decisions - colors, spacing, typography',
          'Step 7: Use AI tools only to speed up manual work, not to design for you',
          'Step 8: Export your design - you created it, AI just helped with tools',
        ],
    [
      'Create a todo app interface with a clean, modern design',
      'Design a mobile-first todo list interface with dark mode',
      'Generate a web dashboard layout for todo management',
    ],
    classType === 'vibe-surfer'
      ? `Use Galileo AI: "Create a complete ${config.framework} todo app UI design with: header/title, input field for adding todos, scrollable list of todo items with checkboxes, completed state styling, ${config.styling} design system, and responsive layout for ${platform === 'mobile' ? 'mobile' : 'web'}. Make it modern and beautiful." [Let AI design everything for you]`
      : classType === 'co-pilot'
      ? `Plan your design first, then use Figma AI: "I want a ${config.framework} todo app with: header/title, input field, scrollable list, checkboxes, ${config.styling} design system. Generate a base design, then I'll refine it." [You design, AI helps build]`
      : `Design your UI architecture yourself. Use Uizard AI only as a reference: "Show me examples of todo app layouts" then design your own. [You design everything, AI is just a tool]`,
    classType === 'vibe-surfer'
      ? [
          'Let AI design everything - be descriptive in your prompt',
          'Ask AI to make it beautiful and modern',
          'Use the AI-generated design as-is',
          'Focus on understanding the design choices AI made',
        ]
      : classType === 'co-pilot'
      ? [
          'Plan your design structure first',
          'Use AI to generate base designs, then refine them yourself',
          'Make design decisions - colors, spacing, typography',
          'Work collaboratively with AI',
          'Create a design system you understand',
        ]
      : [
          'Design the complete UI architecture yourself',
          'Use AI tools only for prototyping and reference',
          'Make all design decisions yourself',
          'Understand every design choice',
          'AI is a tool, not a designer',
        ],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'skeleton-1',
    `Create ${config.framework === 'Flutter' ? 'Main' : 'App'} Component`,
    `Build the main ${config.framework === 'Flutter' ? 'app' : 'App'} component structure based on your UI design.`,
    `Learn ${config.framework} component structure. ${classType === 'vibe-surfer' ? 'Let Cursor generate the complete component for you.' : classType === 'co-pilot' ? 'Work with Cursor to implement your component design.' : 'Write the component yourself, use Cursor only for help when needed.'}`,
    'code-generation',
    8,
    10,
    20,
    ['skeleton-0'],
    'cursor',
    classType === 'vibe-surfer'
      ? [
          `Open Cursor and navigate to ${config.framework === 'Flutter' ? 'lib/main.dart' : 'src/App.tsx'}`,
          'Press Cmd+K to open inline edit',
          `Ask: "Create a complete ${config.framework} App component based on my design"`,
          'Let Cursor generate everything - accept the complete code',
          'Your job: Understand what Cursor created',
        ]
      : classType === 'co-pilot'
      ? [
          `Plan your App component structure first`,
          `Open Cursor and navigate to ${config.framework === 'Flutter' ? 'lib/main.dart' : 'src/App.tsx'}`,
          'Press Cmd+K for inline edit',
          `Describe your component design: "I need an App component with..."`,
          'Review Cursor\'s code and refine it to match your design',
          'Work together: You design, Cursor implements',
        ]
      : [
          `Design your App component structure yourself`,
          `Open ${config.framework === 'Flutter' ? 'lib/main.dart' : 'src/App.tsx'}`,
          'Write the component code yourself',
          'If stuck, press Cmd+K and ask: "Help me with this specific part"',
          'Use Cursor only for guidance, not generation',
          'Understand every line you write',
        ],
    classType === 'vibe-surfer'
      ? [
          `Create a complete ${config.framework} App component with title "My Todo App"`,
          `Generate the full App component with all styling`,
        ]
      : classType === 'co-pilot'
      ? [
          `I need an App component with title "My Todo App" and basic structure`,
          `Help me implement this App component design`,
        ]
      : [
          `Help me understand App component structure`,
          `What's the best way to structure this component?`,
        ],
    classType === 'vibe-surfer'
      ? `Create a complete ${config.framework} ${config.framework === 'Flutter' ? 'app' : 'App'} component that is the root of the application with a title "My Todo App" using ${config.styling} for styling. Generate everything for me.`
      : classType === 'co-pilot'
      ? `I want to create a ${config.framework} App component with title "My Todo App" using ${config.styling}. Help me implement this design.`
      : `I'm writing a ${config.framework} App component. Can you help me understand the best structure? [Write it yourself, use this for guidance]`,
    classType === 'vibe-surfer'
      ? ['Let AI generate everything', 'Accept the complete code', 'Focus on understanding it']
      : classType === 'co-pilot'
      ? ['Plan your structure first', 'Work with AI to implement', 'Review and refine']
      : ['Write code yourself', 'Use AI only for help', 'Understand everything'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'skeleton-2',
    'Build TodoList Component',
    `Create a component to display a list of todos using ${config.framework}, matching your UI design.`,
    `Learn component composition and props. ${classType === 'vibe-surfer' ? 'Let AI generate the complete component for you.' : classType === 'co-pilot' ? 'Design the component structure, let AI help implement it.' : 'Write the component yourself, use AI only for help with specific parts.'}`,
    'code-generation',
    9,
    10,
    25,
    ['skeleton-1'],
    platform === 'web' ? (classType === 'vibe-surfer' ? 'galileo-ai' : 'v0') : 'cursor',
    platform === 'web' 
      ? (classType === 'vibe-surfer'
        ? [
            'Step 1: Go to v0.dev or galileo.ai',
            'Step 2: Describe: "Create a complete TodoList component that displays todos"',
            'Step 3: Let AI generate the full component code',
            'Step 4: Copy the complete generated code',
            `Step 5: Paste into src/components/TodoList.tsx - AI did the work for you`,
          ]
        : [
            'Step 1: Plan your TodoList component structure first',
            'Step 2: Go to v0.dev',
            'Step 3: Describe your component design',
            'Step 4: Review AI-generated code and refine it',
            `Step 5: Adjust to match your design - you and AI work together`,
          ])
      : (classType === 'vibe-surfer'
        ? [
            'Step 1: Open Cursor editor',
            'Step 2: Create lib/widgets/todo_list.dart',
            'Step 3: Press Cmd+K',
            'Step 4: Ask: "Create a complete Flutter widget that displays a list of todos"',
            'Step 5: Accept the full generated code - let AI do it',
          ]
        : classType === 'co-pilot'
        ? [
            'Step 1: Design your TodoList widget structure',
            'Step 2: Open Cursor and create lib/widgets/todo_list.dart',
            'Step 3: Press Cmd+K and describe your design',
            'Step 4: Review and refine the generated code',
            'Step 5: Work together with Cursor',
          ]
        : [
            'Step 1: Write the TodoList widget yourself',
            'Step 2: Open lib/widgets/todo_list.dart',
            'Step 3: Code it manually',
            'Step 4: If stuck, press Cmd+K for help on specific parts',
            'Step 5: Use Cursor only for guidance',
          ]),
    classType === 'vibe-surfer'
      ? [
          `Create a complete TodoList component that displays todos with checkboxes`,
          `Generate the full component with all features`,
        ]
      : classType === 'co-pilot'
      ? [
          `I need a TodoList component that displays todos with checkboxes`,
          `Help me implement this component design`,
        ]
      : [
          `Help me understand TodoList component structure`,
          `What's the best approach for this component?`,
        ],
    classType === 'vibe-surfer'
      ? `Create a complete ${config.framework} TodoList component that takes a todos array as props, displays each todo with a checkbox, shows completed todos with strikethrough, uses ${config.styling} for styling, and is responsive. Generate everything for me.`
      : classType === 'co-pilot'
      ? `I want to create a ${config.framework} TodoList component that takes todos array, displays with checkboxes, shows completed state, uses ${config.styling}. Help me implement this.`
      : `I'm writing a TodoList component. Can you help me understand the best structure and patterns? [Write it yourself]`,
    classType === 'vibe-surfer'
      ? ['Let AI generate the complete component', 'Accept the full code', 'Focus on understanding it']
      : classType === 'co-pilot'
      ? ['Plan your component first', 'Work with AI to implement', 'Review and refine together']
      : ['Write the component yourself', 'Use AI only for guidance', 'Understand every line'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'skeleton-3',
    'Add State Management',
    `Implement state management for todo list using ${config.framework === 'Flutter' ? 'setState or Provider' : 'useState'}.`,
    `Understand ${config.framework === 'Flutter' ? 'Flutter' : 'React'} state management. ${classType === 'vibe-surfer' ? 'Let ChatGPT generate the complete state management code for you.' : classType === 'co-pilot' ? 'Work with ChatGPT to implement state management based on your design.' : 'Learn state management concepts, then write the code yourself. Use ChatGPT only for help when stuck.'}`,
    'code-generation',
    10,
    15,
    30,
    ['skeleton-2'],
    'chatgpt',
    classType === 'vibe-surfer'
      ? [
          'Step 1: Go to chat.openai.com',
          `Step 2: Ask: "Create complete state management code for my ${config.name} todo app using ${config.framework === 'Flutter' ? 'setState' : 'useState'}"`,
          'Step 3: Let ChatGPT generate the full implementation',
          'Step 4: Copy the complete code',
          `Step 5: Paste it into your ${config.framework === 'Flutter' ? 'main app' : 'App'} component`,
          'Step 6: Your job: Understand what ChatGPT created',
        ]
      : classType === 'co-pilot'
      ? [
          'Step 1: Plan your state management approach first',
          'Step 2: Go to chat.openai.com',
          `Step 3: Describe your design: "I need state management for todos using ${config.framework === 'Flutter' ? 'setState' : 'useState'}"`,
          'Step 4: Review ChatGPT\'s suggestions',
          'Step 5: Refine the code to match your architecture',
          `Step 6: Implement together - you design, ChatGPT helps code`,
        ]
      : [
          'Step 1: Study state management concepts first',
          'Step 2: Write the state management code yourself',
          'Step 3: If stuck, go to chat.openai.com',
          `Step 4: Ask: "Help me understand ${config.framework === 'Flutter' ? 'setState' : 'useState'} for this specific case"`,
          'Step 5: Use ChatGPT only for learning, not code generation',
          `Step 6: Write the implementation yourself based on what you learned`,
        ],
    classType === 'vibe-surfer'
      ? [
          `Create complete state management for my ${config.name} todo app`,
          `Generate full code for managing todos with ${config.framework === 'Flutter' ? 'setState' : 'useState'}`,
        ]
      : classType === 'co-pilot'
      ? [
          `I need state management for todos using ${config.framework === 'Flutter' ? 'setState' : 'useState'}`,
          `Help me implement state management for my todo app`,
        ]
      : [
          `Help me understand ${config.framework === 'Flutter' ? 'setState' : 'useState'} for managing todos`,
          `What's the best approach for state management in this case?`,
        ],
    classType === 'vibe-surfer'
      ? `"I'm building a ${config.name} todo app. Create complete state management code using ${config.framework === 'Flutter' ? 'setState' : 'useState'} to manage a todos array. I need: initialize empty array, add todos, toggle completed, delete todos. Generate the full implementation for me."`
      : classType === 'co-pilot'
      ? `"I'm building a ${config.name} todo app. Help me implement state management using ${config.framework === 'Flutter' ? 'setState' : 'useState'} for todos. I need: initialize array, add, toggle, delete. Work with me to implement this."`
      : `"I'm learning ${config.framework === 'Flutter' ? 'setState' : 'useState'} for managing todos. Can you explain the concepts and best practices? I'll write the code myself."`,
    classType === 'vibe-surfer'
      ? ['Let ChatGPT generate everything', 'Copy the complete code', 'Focus on understanding it']
      : classType === 'co-pilot'
      ? ['Plan your approach first', 'Work with ChatGPT to implement', 'Review and refine together']
      : ['Learn the concepts first', 'Write code yourself', 'Use ChatGPT only for help'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'skeleton-4',
    'Create Add Todo Form',
    `Build a form component to add new todos using ${config.framework}, matching your UI design.`,
    `Learn form handling and controlled components. ${classType === 'vibe-surfer' ? 'Let Cursor generate the complete form component for you.' : classType === 'co-pilot' ? 'Design the form structure, use Cursor Composer to help implement it.' : 'Write the form component yourself, use Cursor only for help with specific parts.'}`,
    'code-generation',
    11,
    15,
    30,
    ['skeleton-3'],
    classType === 'co-pilot' ? 'cursor-composer' : 'cursor',
    classType === 'vibe-surfer'
      ? [
          'Step 1: Open Cursor editor',
          `Step 2: Create ${config.framework === 'Flutter' ? 'lib/widgets/todo_form.dart' : 'src/components/TodoForm.tsx'}`,
          'Step 3: Press Cmd+K for inline edit',
          'Step 4: Ask: "Create a complete TodoForm component with input, submit button, and all functionality"',
          'Step 5: Let Cursor generate everything - accept the full code',
          'Step 6: Your job: Understand what Cursor created',
        ]
      : classType === 'co-pilot'
      ? [
          'Step 1: Plan your form component structure first',
          'Step 2: Press Cmd+I to open Cursor Composer',
          'Step 3: Describe your form design: "I need a TodoForm with..."',
          'Step 4: Cursor generates the component file',
          'Step 5: Review and refine the generated code to match your design',
          'Step 6: Work together: You design, Cursor implements',
        ]
      : [
          'Step 1: Design your form component yourself',
          `Step 2: Open Cursor and create ${config.framework === 'Flutter' ? 'lib/widgets/todo_form.dart' : 'src/components/TodoForm.tsx'}`,
          'Step 3: Write the form code yourself',
          'Step 4: If stuck, press Cmd+K and ask: "Help me with form validation" or specific parts',
          'Step 5: Use Cursor only for guidance, not generation',
          'Step 6: Understand every line you write',
        ],
    classType === 'vibe-surfer'
      ? [
          `Create a complete TodoForm component with input and submit button`,
          `Generate the full form component with all functionality`,
        ]
      : classType === 'co-pilot'
      ? [
          `I need a TodoForm component with input field and submit button`,
          `Help me implement this form component design`,
        ]
      : [
          `Help me understand form component structure`,
          `What's the best approach for form handling?`,
        ],
    classType === 'vibe-surfer'
      ? `Create a complete ${config.framework} TodoForm component that has an input field for todo text, a submit button, uses controlled components (value and onChange), calls onSubmit handler when form is submitted, and resets the form after submission. Generate everything for me.`
      : classType === 'co-pilot'
      ? `I want to create a ${config.framework} TodoForm component with input field, submit button, controlled components, onSubmit handler, and form reset. Help me implement this design.`
      : `I'm writing a TodoForm component. Can you help me understand form handling best practices? [Write it yourself]`,
    classType === 'vibe-surfer'
      ? ['Let Cursor generate everything', 'Accept the complete code', 'Focus on understanding it']
      : classType === 'co-pilot'
      ? ['Plan your form structure first', 'Work with Cursor Composer', 'Review and refine together']
      : ['Write the form yourself', 'Use Cursor only for help', 'Understand every line'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'skeleton-5',
    `Add Styling with ${config.styling}`,
    `Style your components using ${config.styling} ${platform === 'web' ? 'classes' : 'themes'} to match your AI-generated design.`,
    `Master styling with ${config.styling}. Learn how to use ${classType === 'vibe-surfer' ? 'Midjourney or DALL-E for color inspiration, then Gemini' : 'Figma AI design tokens, then Gemini'} for styling implementation.`,
    'code-generation',
    12,
    10,
    20,
    ['skeleton-4'],
    classType === 'vibe-surfer' ? 'midjourney' : classType === 'co-pilot' ? 'figma-ai' : 'gemini',
    classType === 'vibe-surfer'
      ? [
          'Step 1: Use Midjourney or DALL-E for color palette inspiration',
          'Step 2: Generate design concepts: "Modern todo app, color scheme, UI design"',
          'Step 3: Extract color palettes from generated images',
          'Step 4: Go to gemini.google.com',
          `Step 5: Ask: "How do I implement these colors in ${config.styling}?"`,
          'Step 6: Get styling code examples',
          `Step 7: Apply ${config.styling} to match your design`,
        ]
      : classType === 'co-pilot'
      ? [
          'Step 1: Open your Figma design from skeleton-0',
          'Step 2: Extract design tokens (colors, spacing, typography)',
          'Step 3: Use Figma AI to generate style guide',
          'Step 4: Go to gemini.google.com',
          `Step 5: Ask: "Convert these Figma design tokens to ${config.styling} classes"`,
          'Step 6: Get code examples for your design system',
          `Step 7: Apply ${config.styling} to match Figma design`,
        ]
      : [
          'Step 1: Go to gemini.google.com',
          'Step 2: Sign in with your Google account',
          `Step 3: Ask: "How do I style a ${config.framework} component with ${config.styling}?"`,
          'Step 4: Request specific styling examples',
          'Step 5: Ask about responsive design',
          'Step 6: Get code examples for your components',
          `Step 7: Apply ${config.styling} to your components`,
        ],
    [
      classType === 'vibe-surfer' 
        ? 'Generate color palette inspiration for a modern todo app'
        : classType === 'co-pilot'
        ? 'Convert Figma design tokens to Tailwind CSS classes'
        : `How do I center content and add padding with ${config.styling}?`,
      `Show me ${config.styling} ${platform === 'web' ? 'classes' : 'themes'} for a responsive card component`,
    ],
    classType === 'vibe-surfer'
      ? `First, use Midjourney: "Modern todo app UI design, color palette, ${config.styling} style" to get color inspiration. Then ask Gemini: "I have a ${config.framework} component and want to style it with ${config.styling} using these colors [paste colors]. I need centered layout, responsive design, and modern styling. Please provide ${platform === 'web' ? 'class' : 'theme'} examples."`
      : classType === 'co-pilot'
      ? `Use Figma AI to extract design tokens from your design, then ask Gemini: "Convert these Figma design tokens [paste tokens] to ${config.styling} classes for my ${config.framework} components. Include responsive design and component styling."`
      : `Ask Gemini: "I have a ${config.framework} component and want to style it with ${config.styling}. I need centered layout, responsive design, modern styling, and hover effects. Please provide ${platform === 'web' ? 'class' : 'theme'} examples."`,
    [
      classType === 'vibe-surfer' ? 'Use AI for design inspiration first' : classType === 'co-pilot' ? 'Extract design tokens from Figma' : '',
      `Ask for specific ${config.styling} ${platform === 'web' ? 'class combinations' : 'theme configurations'}`,
      'Request responsive design examples',
      'Get examples for common UI patterns',
      'Match your AI-generated design',
    ],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'skeleton-6',
    'Write Component Tests',
    `Create unit tests for your ${config.framework} components.`,
    `Learn testing best practices and TDD. Learn how to use ${classType === '10x-architect' ? 'Claude' : 'GitHub Copilot'} for test generation.`,
    'testing',
    13,
    20,
    40,
    ['skeleton-5'],
    classType === '10x-architect' ? 'claude' : 'github-copilot',
    classType === '10x-architect'
      ? [
          'Step 1: Go to claude.ai',
          'Step 2: Ask: "How do I write tests for Flutter/React components?"',
          'Step 3: Review testing strategy',
          'Step 4: Ask for code examples',
          'Step 5: Implement tests',
        ]
      : [
          'Step 1: Install GitHub Copilot extension',
          'Step 2: Open your component file',
          'Step 3: Create a test file',
          'Step 4: Write a comment: "// Test for Component that renders correctly"',
          'Step 5: Let Copilot generate the test code',
          'Step 6: Review and accept',
        ],
    [
      `// Test for TodoList component that renders todos`,
      `// Test for TodoItem component with ${platform === 'web' ? 'checkbox' : 'checkbox'} interaction`,
    ],
    `Write comments describing what you want to test: "// Test for [ComponentName] that renders without errors, displays correct content, handles user interactions, and shows loading states."`,
    ['Write descriptive comments', 'Let AI generate the test structure', 'Review generated tests'],
    config,
    classType,
    platform
  ));

  // PHASE 3: THE BRAIN (7 steps - includes authentication)
  
  // Step 3.0: Design Authentication System
  steps.push(createStep(
    'brain-0',
    'Design Authentication System',
    `Plan your authentication system for user registration and login.`,
    `Understand authentication concepts and security. ${classType === 'vibe-surfer' ? 'Let Claude design the complete auth system for you.' : classType === 'co-pilot' ? 'Work with Claude to design your auth architecture.' : 'Design the auth system yourself, use Claude for guidance on security best practices.'}`,
    'configuration',
    14,
    15,
    30,
    ['skeleton-6'],
    'claude',
    classType === 'vibe-surfer'
      ? [
          'Step 1: Go to claude.ai',
          'Step 2: Ask: "Design a complete authentication system for my todo app"',
          'Step 3: Let Claude generate the full auth architecture',
          'Step 4: Review the auth flow and security recommendations',
          'Step 5: Use Claude\'s design as your blueprint',
        ]
      : classType === 'co-pilot'
      ? [
          'Step 1: Plan your auth requirements first (registration, login, password reset)',
          'Step 2: Go to claude.ai',
          'Step 3: Describe your auth needs: "I need authentication with..."',
          'Step 4: Review Claude\'s suggestions and refine them',
          'Step 5: Work together to finalize the auth design',
        ]
      : [
          'Step 1: Design your authentication architecture yourself',
          'Step 2: Research auth patterns (JWT, sessions, OAuth)',
          'Step 3: Go to claude.ai only for security guidance',
          'Step 4: Ask: "What security best practices should I follow for authentication?"',
          'Step 5: Implement your design based on what you learned',
        ],
    classType === 'vibe-surfer'
      ? [
          'Design a complete authentication system for my todo app',
          'Generate full auth architecture with security',
        ]
      : classType === 'co-pilot'
      ? [
          'I need authentication with registration and login',
          'Help me design an auth system for my todo app',
        ]
      : [
          'What are authentication security best practices?',
          'Help me understand JWT vs session-based auth',
        ],
    classType === 'vibe-surfer'
      ? `Ask Claude: "Design a complete authentication system for my ${config.name} todo app. I need: user registration, login, password hashing, ${platform === 'mobile' ? 'Firebase Auth' : 'JWT tokens'}, protected routes, and security best practices. Generate the full architecture for me."`
      : classType === 'co-pilot'
      ? `Ask Claude: "I need to design authentication for my ${config.name} todo app. I want: registration, login, ${platform === 'mobile' ? 'Firebase Auth' : 'JWT tokens'}, protected routes. Help me design this architecture."`
      : `Ask Claude: "What are the security best practices for implementing authentication in a ${config.name} app? I'm designing it myself and need guidance on: password hashing, ${platform === 'mobile' ? 'Firebase Auth security' : 'JWT token management'}, and secure session handling."`,
    classType === 'vibe-surfer'
      ? ['Let Claude design everything', 'Use the complete auth architecture', 'Focus on understanding it']
      : classType === 'co-pilot'
      ? ['Plan your requirements first', 'Work with Claude to design', 'Review and refine together']
      : ['Design it yourself', 'Use Claude only for security guidance', 'Understand every security decision'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'brain-1',
    platform === 'mobile' ? 'Design Firebase Database Schema' : 'Design Database Schema',
    `Plan your ${platform === 'mobile' ? 'Firebase' : 'database'} structure for todos and users.`,
    `Understand ${platform === 'mobile' ? 'Firebase' : 'database'} design and relationships. Learn how to use Claude for architecture design.`,
    'configuration',
    15,
    15,
    30,
    ['brain-0'],
    'claude',
    [
      'Step 1: Go to claude.ai',
      'Step 2: Sign in or create an account',
      `Step 3: Describe your project: "I'm building a todo app with ${config.framework} frontend and ${platform === 'mobile' ? 'Firebase' : 'Node.js'} backend"`,
      `Step 4: Ask: "Help me design a ${platform === 'mobile' ? 'Firebase' : 'database'} schema for a todo application"`,
      `Step 5: Review Claude's suggestions for ${platform === 'mobile' ? 'collections and documents' : 'tables, fields, and relationships'}`,
      'Step 6: Ask about best practices and trade-offs',
      `Step 7: Request ${platform === 'mobile' ? 'Firestore' : 'SQL or Prisma'} schema examples`,
      'Step 8: Implement the schema in your project',
    ],
    [
      `Help me design a ${platform === 'mobile' ? 'Firebase Firestore' : 'database'} schema for a todo app. What ${platform === 'mobile' ? 'collections' : 'tables'} do I need?`,
      `What's the best way to structure a ${platform === 'mobile' ? 'Firestore' : 'database'} for todos with user authentication?`,
    ],
    `Provide context: "I'm building a todo application with user authentication, todos with title/description/completed status, categories or tags, and due dates. Help me design the ${platform === 'mobile' ? 'Firestore' : 'database'} schema. Consider what ${platform === 'mobile' ? 'collections/documents' : 'tables/fields'} I need, what relationships exist, and what indexes I should create."`,
    [
      'Ask for multiple approaches and trade-offs',
      platform === 'mobile' ? 'Request Firestore structure examples' : 'Request both SQL and NoSQL options',
      'Ask about normalization',
      'Consider scalability in your questions',
    ],
    config,
    classType,
    platform
  ));

  // Step 3.1: Build Authentication API
  steps.push(createStep(
    'brain-1.5',
    platform === 'mobile' ? 'Implement Firebase Authentication' : 'Create Authentication API',
    platform === 'mobile'
      ? 'Set up Firebase Authentication for user registration and login.'
      : 'Build authentication API endpoints for registration and login.',
    `Learn authentication implementation. ${classType === 'vibe-surfer' ? 'Let Cursor generate the complete auth API for you.' : classType === 'co-pilot' ? 'Design the auth endpoints, let Cursor help implement them.' : 'Write the auth API yourself, use Cursor only for help with specific parts.'}`,
    'code-generation',
    16,
    20,
    40,
    ['brain-1'],
    'cursor',
    classType === 'vibe-surfer'
      ? [
          platform === 'mobile'
            ? 'Step 1: Open Firebase Console and enable Authentication'
            : `Step 1: Open your API routes file`,
          'Step 2: Press Cmd+K in Cursor',
          platform === 'mobile'
            ? 'Step 3: Ask: "Set up complete Firebase Authentication for registration and login"'
            : 'Step 3: Ask: "Create complete authentication API with register and login endpoints"',
          'Step 4: Let Cursor generate everything',
          'Step 5: Accept the full implementation',
        ]
      : classType === 'co-pilot'
      ? [
          'Step 1: Plan your auth endpoints first (POST /register, POST /login)',
          platform === 'mobile'
            ? 'Step 2: Open Firebase Console'
            : `Step 2: Open your API routes file`,
          'Step 3: Press Cmd+K and describe your auth design',
          'Step 4: Review and refine Cursor\'s generated code',
          'Step 5: Work together to implement',
        ]
      : [
          'Step 1: Write the auth API yourself',
          platform === 'mobile'
            ? 'Step 2: Set up Firebase Auth manually'
            : `Step 2: Create auth endpoints manually`,
          'Step 3: If stuck, press Cmd+K for help on specific parts',
          'Step 4: Use Cursor only for guidance',
          'Step 5: Understand every line of auth code',
        ],
    classType === 'vibe-surfer'
      ? [
          platform === 'mobile'
            ? 'Set up complete Firebase Authentication'
            : 'Create complete authentication API with register and login',
        ]
      : classType === 'co-pilot'
      ? [
          platform === 'mobile'
            ? 'Help me implement Firebase Authentication'
            : 'Help me create authentication API endpoints',
        ]
      : [
          platform === 'mobile'
            ? 'Help me understand Firebase Auth setup'
            : 'Help me understand JWT token implementation',
        ],
    classType === 'vibe-surfer'
      ? platform === 'mobile'
        ? `Use Cursor: "Set up complete Firebase Authentication for my Flutter app. I need: user registration, email/password login, password reset, and secure authentication flow. Generate everything for me."`
        : `Use Cursor: "Create complete authentication API for my ${config.name} app. I need: POST /api/auth/register, POST /api/auth/login, password hashing with bcrypt, JWT token generation, and error handling. Generate the full implementation."`
      : classType === 'co-pilot'
      ? platform === 'mobile'
        ? `Use Cursor: "I need Firebase Authentication for registration and login. Help me implement this."`
        : `Use Cursor: "I need authentication API endpoints: POST /api/auth/register and POST /api/auth/login with JWT tokens. Help me implement this."`
      : platform === 'mobile'
      ? `Use Cursor only for help: "I'm setting up Firebase Auth. Can you help me understand the best practices?" [Implement it yourself]`
      : `Use Cursor only for help: "I'm writing auth API. Can you help me understand JWT token best practices?" [Write it yourself]`,
    classType === 'vibe-surfer'
      ? ['Let Cursor generate everything', 'Accept the complete auth code', 'Focus on understanding it']
      : classType === 'co-pilot'
      ? ['Plan your endpoints first', 'Work with Cursor to implement', 'Review and refine together']
      : ['Write the auth API yourself', 'Use Cursor only for guidance', 'Understand every security detail'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'brain-2',
    platform === 'mobile' ? 'Create Firebase Functions' : 'Create API Endpoints',
    platform === 'mobile' 
      ? 'Build Firebase Cloud Functions for CRUD operations.'
      : 'Build REST API endpoints for CRUD operations.',
    `Learn ${platform === 'mobile' ? 'Firebase Functions' : 'REST API'} design. Learn how to use Cursor to generate ${platform === 'mobile' ? 'functions' : 'API routes'}.`,
    'code-generation',
    17,
    20,
    40,
    ['brain-1.5'],
    'cursor',
    [
      `Open the ${platform === 'mobile' ? 'functions' : 'API route'} file`,
      'Press Cmd+K for inline edit',
      `Describe the ${platform === 'mobile' ? 'Cloud Function' : 'API endpoint'} you want`,
      `Generate ${platform === 'mobile' ? 'functions for' : 'GET, POST, PUT, DELETE endpoints'}`,
      'Review and accept the code',
    ],
    [
      platform === 'mobile' 
        ? 'Create a Firebase function that returns all todos from Firestore'
        : 'Create a GET endpoint that returns all todos from the database',
      platform === 'mobile'
        ? 'Build a Firebase function that creates a new todo and saves it to Firestore'
        : 'Build a POST endpoint that creates a new todo and saves it to the database',
    ],
    `Create ${platform === 'mobile' ? 'Firebase Cloud Functions' : 'REST API endpoints'} for todos: ${platform === 'mobile' ? 'getTodos, createTodo, updateTodo, deleteTodo' : 'GET /api/todos, POST /api/todos, PUT /api/todos/:id, DELETE /api/todos/:id'}. Use ${platform === 'mobile' ? 'Firebase Admin SDK' : 'Express.js'} and include error handling.`,
    ['Be specific about HTTP methods or function types', 'Include error handling in your prompt', 'Mention the database you\'re using'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'brain-3',
    platform === 'mobile' ? 'Connect Flutter to Firebase' : 'Connect Frontend to API',
    platform === 'mobile'
      ? 'Use Firebase SDK to connect your Flutter app to Firestore.'
      : 'Use fetch to connect your React app to the backend.',
    `Understand ${platform === 'mobile' ? 'Firebase' : 'async'} operations and ${platform === 'mobile' ? 'Firestore' : 'API'} integration. Learn how to use ${classType === 'co-pilot' ? 'Cursor Chat' : 'ChatGPT'} for integration help.`,
    'code-generation',
    19,
    20,
    40,
    ['brain-2.5'],
    classType === 'co-pilot' ? 'cursor-chat' : 'chatgpt',
    classType === 'co-pilot'
      ? [
          'Step 1: Open Cursor editor',
          'Step 2: Press Cmd+L to open chat',
          `Step 3: Ask: "How do I connect my ${config.framework} component to ${platform === 'mobile' ? 'Firebase Firestore' : 'a REST API endpoint'}?"`,
          'Step 4: Review Cursor\'s code examples',
          'Step 5: Implement the integration',
        ]
      : [
          'Step 1: Go to chat.openai.com',
          `Step 2: Ask: "How do I ${platform === 'mobile' ? 'connect Flutter to Firebase Firestore' : 'fetch data from my API endpoint'} in a ${config.framework} component?"`,
          'Step 3: Review code examples',
          'Step 4: Implement in your component',
        ],
    [
      platform === 'mobile'
        ? 'How do I read and write data to Firestore in Flutter?'
        : 'How do I fetch data from my API endpoint in a React component?',
      `What's the best way to handle ${platform === 'mobile' ? 'Firestore' : 'API'} calls with async/await in ${config.framework}?`,
    ],
    `Ask: "How do I connect my ${config.framework} component to ${platform === 'mobile' ? 'Firebase Firestore' : 'my REST API'}? I need to ${platform === 'mobile' ? 'read and write todos' : 'fetch todos from GET /api/todos'}, handle loading states, display error messages, and use async/await."`,
    ['Ask specific questions about your setup', 'Request code examples', 'Ask about error handling'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'brain-4',
    'Add Error Handling',
    `Implement proper error handling for ${platform === 'mobile' ? 'Firebase' : 'API'} calls and authentication.`,
    `Learn error handling patterns and user feedback. Learn how to use ${classType === '10x-architect' ? 'Claude' : 'ChatGPT'} for error handling patterns.`,
    'code-generation',
    20,
    15,
    30,
    ['brain-3'],
    classType === '10x-architect' ? 'claude' : 'chatgpt',
    [
      classType === '10x-architect' ? 'Step 1: Go to claude.ai' : 'Step 1: Go to chat.openai.com',
      `Step 2: Ask: "What's the best way to handle errors in ${config.framework} ${platform === 'mobile' ? 'Firebase' : 'API'} calls?"`,
      'Step 3: Review error handling patterns',
      'Step 4: Ask for code examples with try/catch',
      'Step 5: Learn about error boundaries or error widgets',
      'Step 6: Implement error handling in your code',
    ],
    [
      `What's the best way to handle errors in ${config.framework} ${platform === 'mobile' ? 'Firebase' : 'fetch API'} calls?`,
      `Show me how to display error messages to users in ${config.framework}`,
    ],
    `Ask: "What's the best way to handle errors in ${config.framework} ${platform === 'mobile' ? 'Firebase' : 'API'} calls? I need try/catch blocks for async functions, user-friendly error messages, error state management, and ${platform === 'web' ? 'error boundaries' : 'error widgets'} for component errors. Please provide code examples."`,
    ['Ask for complete error handling patterns', 'Request code examples', 'Learn about error boundaries/widgets'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'brain-5',
    'Write Integration Tests',
    `Test the full flow from frontend to ${platform === 'mobile' ? 'Firebase' : 'backend'}, including authentication.`,
    `Understand integration testing and E2E concepts. Learn how to use Claude for test strategy.`,
    'testing',
    21,
    25,
    50,
    ['brain-4'],
    'claude',
    [
      'Step 1: Go to claude.ai',
      `Step 2: Ask: "How do I write integration tests for a ${config.framework} app with ${platform === 'mobile' ? 'Firebase' : 'API calls'}?"`,
      'Step 3: Review Claude\'s testing strategy',
      'Step 4: Ask for code examples with testing libraries',
      `Step 5: Learn about ${platform === 'mobile' ? 'Firebase emulators' : 'mocking API calls'}`,
      'Step 6: Implement integration tests',
    ],
    [
      `How do I write integration tests for ${config.framework} components that ${platform === 'mobile' ? 'use Firebase' : 'call APIs'}?`,
      `What's the best way to ${platform === 'mobile' ? 'test Firebase integration' : 'mock API calls'} in ${config.framework} tests?`,
    ],
    `Ask Claude: "How do I write integration tests for my ${config.framework} todo app? I need to test user interactions (adding todos), ${platform === 'mobile' ? 'Firebase operations' : 'API calls'} (fetching, creating todos), state updates, and error handling. Please provide testing strategy and code examples."`,
    ['Ask for complete testing strategy', 'Request mocking examples', `Learn about testing libraries for ${config.framework}`],
    config,
    classType,
    platform
  ));

  // PHASE 3.5: CODE QUALITY & SECURITY (2 steps)
  steps.push(createStep(
    'quality-1',
    'Code Review & Refactoring',
    `Review and refactor your code for quality and maintainability.`,
    `Learn code review practices and refactoring techniques. Learn how to use ${classType === 'co-pilot' ? 'Cursor Chat' : 'Claude'} for code review.`,
    'code-generation',
    22,
    15,
    30,
    ['brain-5'],
    classType === 'co-pilot' ? 'cursor-chat' : 'claude',
    classType === 'co-pilot'
      ? [
          'Step 1: Open Cursor editor',
          'Step 2: Press Cmd+L to open chat',
          'Step 3: Select your code files',
          'Step 4: Ask: "Review this code and suggest improvements"',
          'Step 5: Review suggestions and refactor',
        ]
      : [
          'Step 1: Go to claude.ai',
          'Step 2: Paste your code',
          'Step 3: Ask: "Review this code and suggest refactoring improvements"',
          'Step 4: Review suggestions',
          'Step 5: Refactor based on recommendations',
        ],
    [
      'Review this code and suggest improvements for maintainability',
      'Help me refactor this component to follow best practices',
      'What code smells do you see in this code?',
    ],
    `Ask ${classType === 'co-pilot' ? 'Cursor Chat' : 'Claude'}: "Review my ${config.framework} todo app code. Check for: code quality, best practices, maintainability, performance issues, and suggest refactoring improvements. Focus on ${config.framework} patterns and conventions."`,
    ['Ask for specific improvements', 'Request best practice recommendations', 'Get refactoring suggestions'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'quality-2',
    'Security Audit',
    `Perform a security audit of your ${config.name} application.`,
    `Understand security best practices and common vulnerabilities. Learn how to use ${classType === '10x-architect' ? 'Perplexity' : 'Claude'} for security analysis.`,
    'configuration',
    20,
    20,
    40,
    ['quality-1'],
    classType === '10x-architect' ? 'perplexity' : 'claude',
    [
      classType === '10x-architect' ? 'Step 1: Go to perplexity.ai' : 'Step 1: Go to claude.ai',
      `Step 2: Ask: "What security vulnerabilities should I check for in a ${config.name} app?"`,
      'Step 3: Review common security issues',
      'Step 4: Check for: XSS, CSRF, SQL injection, authentication issues',
      'Step 5: Review environment variable handling',
      'Step 6: Fix identified security issues',
    ],
    [
      `What security vulnerabilities should I check for in a ${config.framework} app?`,
      `How do I secure API endpoints in a ${config.name} application?`,
      `What are common security issues in ${platform === 'mobile' ? 'mobile' : 'web'} apps?`,
    ],
    `Ask: "Perform a security audit for my ${config.name} todo app. Check for: authentication security, data validation, ${platform === 'mobile' ? 'mobile app security' : 'XSS/CSRF protection'}, API security, environment variable security, and ${platform === 'mobile' ? 'secure storage' : 'secure data transmission'}. Provide a checklist and recommendations."`,
    ['Request security checklist', 'Ask about OWASP top 10', 'Get specific recommendations', 'Learn about secure coding practices'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'quality-3',
    'Performance Testing',
    `Test and optimize the performance of your ${config.framework} application.`,
    `Understand performance testing and optimization. Learn how to use ${classType === '10x-architect' ? 'Phind' : 'Claude'} for performance analysis.`,
    'testing',
    21,
    20,
    40,
    ['quality-2'],
    classType === '10x-architect' ? 'phind' : 'claude',
    [
      classType === '10x-architect' ? 'Step 1: Go to phind.com' : 'Step 1: Go to claude.ai',
      `Step 2: Ask: "How do I test and optimize performance for a ${config.framework} app?"`,
      'Step 3: Learn about performance metrics',
      'Step 4: Use browser DevTools or profiling tools',
      'Step 5: Identify bottlenecks',
      'Step 6: Optimize slow components and API calls',
    ],
    [
      `How do I test performance for a ${config.framework} application?`,
      `What performance metrics should I track for a ${platform === 'mobile' ? 'mobile' : 'web'} app?`,
      `How do I optimize ${config.framework} app performance?`,
    ],
    `Ask: "How do I test and optimize performance for my ${config.framework} todo app? I need to: measure load times, identify bottlenecks, optimize API calls, ${platform === 'mobile' ? 'optimize mobile performance' : 'optimize bundle size'}, improve rendering performance, and set up performance monitoring. Provide tools and techniques."`,
    ['Ask for performance testing tools', 'Request optimization techniques', 'Learn about profiling', 'Get performance benchmarks'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'quality-4',
    'Write Documentation',
    `Create comprehensive documentation for your ${config.name} application.`,
    `Learn documentation best practices. Learn how to use ChatGPT for documentation.`,
    'configuration',
    22,
    10,
    20,
    ['quality-3'],
    'chatgpt',
    [
      'Step 1: Go to chat.openai.com',
      'Step 2: Ask: "Help me write documentation for my todo app"',
      'Step 3: Create README with setup instructions',
      'Step 4: Document API endpoints',
      'Step 5: Write code comments',
      'Step 6: Create user guide',
    ],
    [
      `Help me write a README for my ${config.name} todo app`,
      `How do I document ${config.framework} components?`,
      `Create API documentation for my todo app`,
    ],
    `Ask ChatGPT: "Help me write comprehensive documentation for my ${config.name} todo app. I need: README with setup instructions, API documentation, component documentation, deployment guide, and user guide. Provide templates and examples."`,
    ['Request documentation templates', 'Ask for best practices', 'Get examples', 'Learn about documentation tools'],
    config,
    classType,
    platform
  ));

  // PHASE 4: PRODUCTION (5 steps)
  steps.push(createStep(
    'prod-1',
    'Set Up Environment Variables',
    `Configure environment variables for different environments.`,
    `Understand environment configuration and security. Learn how to use ${classType === '10x-architect' ? 'Perplexity' : 'Gemini'} for environment setup.`,
    'configuration',
    23,
    10,
    20,
    ['quality-4'],
    classType === '10x-architect' ? 'perplexity' : 'gemini',
    [
      classType === '10x-architect' ? 'Step 1: Go to perplexity.ai' : 'Step 1: Go to gemini.google.com',
      `Step 2: Ask: "How do I set up environment variables for a ${config.name} app?"`,
      'Step 3: Learn about .env files',
      'Step 4: Get examples for different environments',
      'Step 5: Understand security best practices',
      'Step 6: Create .env files for your project',
    ],
    [
      'How do I set up environment variables for development and production?',
      `What should I put in .env files for a ${config.name} app?`,
    ],
    `Ask: "How do I set up environment variables for my ${config.name} application? I need .env files for different environments, how to access variables in code, security best practices, and what to include in .gitignore."`,
    ['Ask for .env file examples', 'Learn about security practices', 'Understand environment-specific configs'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'prod-2',
    'Configure CI/CD Pipeline',
    'Set up automated testing and deployment.',
    `Learn continuous integration and deployment practices. Learn how to use ${classType === '10x-architect' ? 'Phind' : 'Claude'} for CI/CD setup.`,
    'deployment',
    24,
    25,
    50,
    ['prod-1'],
    classType === '10x-architect' ? 'phind' : 'claude',
    [
      classType === '10x-architect' ? 'Step 1: Go to phind.com' : 'Step 1: Go to claude.ai',
      `Step 2: Ask: "How do I set up a CI/CD pipeline for a ${config.name} app?"`,
      'Step 3: Review CI/CD strategy and tools',
      'Step 4: Ask for GitHub Actions or similar examples',
      'Step 5: Learn about automated testing in CI',
      'Step 6: Set up your CI/CD pipeline',
    ],
    [
      `How do I set up GitHub Actions for my ${config.framework} app?`,
      `What's the best CI/CD pipeline for a ${platform === 'mobile' ? 'mobile' : 'full-stack'} app?`,
    ],
    `Ask: "How do I set up a CI/CD pipeline for my ${config.name} todo app? I need automated testing before deployment, build process, deployment to production, and GitHub Actions or similar. Please provide a complete setup guide."`,
    ['Ask for complete CI/CD strategy', 'Request configuration file examples', 'Learn about different CI/CD tools'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'prod-3',
    'Build for Production',
    `Optimize and build your ${config.framework} application for production.`,
    `Understand build processes and optimization. Learn how to use ${classType === 'co-pilot' ? 'Cursor Composer' : 'Cursor'} for build configuration.`,
    'deployment',
    25,
    15,
    30,
    ['prod-2'],
    classType === 'co-pilot' ? 'cursor-composer' : 'cursor',
    classType === 'co-pilot'
      ? [
          'Step 1: Press Cmd+I to open Cursor Composer',
          'Step 2: Describe build optimization needs',
          'Step 3: Cursor generates build config changes',
          'Step 4: Review all changes',
        ]
      : [
          `Step 1: Open ${platform === 'mobile' ? 'pubspec.yaml' : 'vite.config.ts'} or build config file`,
          'Step 2: Press Cmd+K for inline edit',
          'Step 3: Ask: "Optimize build configuration for production"',
          'Step 4: Review optimization suggestions',
          'Step 5: Run build command and test',
        ],
    [
      `Optimize my ${platform === 'mobile' ? 'Flutter' : 'Vite'} build configuration for production`,
      `Add code splitting and minification to my ${platform === 'mobile' ? 'Flutter' : 'build'}`,
    ],
    `Use ${classType === 'co-pilot' ? 'Cursor Composer' : 'Cursor inline edit'}: "Optimize my build configuration for production with code splitting, minification, tree shaking, asset optimization, and source maps for debugging."`,
    ['Ask for production optimizations', 'Request bundle size improvements', 'Test build output'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'prod-4',
    platform === 'mobile' ? 'Deploy to App Store/Play Store' : 'Deploy to Production',
    platform === 'mobile'
      ? 'Deploy your Flutter app to app stores.'
      : 'Deploy your application to a hosting platform.',
    `Learn ${platform === 'mobile' ? 'app store' : 'deployment'} strategies and ${platform === 'mobile' ? 'store' : 'platform'} configuration. Learn how to use ChatGPT for deployment help.`,
    'deployment',
    26,
    30,
    60,
    ['prod-3'],
    'chatgpt',
    [
      'Step 1: Go to chat.openai.com',
      `Step 2: Ask: "How do I deploy a ${config.name} app ${platform === 'mobile' ? 'to the App Store and Play Store' : 'to Vercel/Netlify'}?"`,
      'Step 3: Review deployment steps',
      'Step 4: Ask about platform-specific requirements',
      'Step 5: Learn about environment variables in production',
      `Step 6: Deploy your ${platform === 'mobile' ? 'app' : 'application'}`,
    ],
    [
      platform === 'mobile'
        ? 'How do I deploy my Flutter app to the App Store?'
        : 'How do I deploy my React app to Vercel?',
      `What's the best way to deploy a ${platform === 'mobile' ? 'mobile' : 'full-stack'} app?`,
    ],
    `Ask ChatGPT: "How do I deploy my ${config.name} todo app ${platform === 'mobile' ? 'to the App Store and Play Store' : 'to production'}? I need ${platform === 'mobile' ? 'store listing requirements, app signing, and submission process' : 'platform recommendations (Vercel, Netlify, etc.), step-by-step deployment process, environment variable setup, and domain configuration'}. Please provide a complete guide."`,
    ['Ask for platform-specific guides', 'Request step-by-step instructions', 'Learn about deployment best practices'],
    config,
    classType,
    platform
  ));

  steps.push(createStep(
    'prod-5',
    'Monitor and Optimize',
    'Set up monitoring and optimize performance.',
    `Understand production monitoring and optimization. Learn how to use ${classType === '10x-architect' ? 'Perplexity' : 'Claude'} for performance optimization.`,
    'deployment',
    27,
    20,
    40,
    ['prod-4'],
    classType === '10x-architect' ? 'perplexity' : 'claude',
    [
      classType === '10x-architect' ? 'Step 1: Go to perplexity.ai' : 'Step 1: Go to claude.ai',
      `Step 2: Ask: "How do I monitor and optimize a ${config.framework} app in production?"`,
      'Step 3: Review monitoring tools and strategies',
      'Step 4: Learn about performance optimization',
      'Step 5: Ask for code examples',
      'Step 6: Implement monitoring and optimizations',
    ],
    [
      `What tools should I use to monitor my ${config.framework} app in production?`,
      `How do I optimize ${config.framework} app performance?`,
    ],
    `Ask: "How do I monitor and optimize my ${config.framework} todo app in production? I need performance monitoring tools, error tracking, analytics setup, performance optimization techniques, and best practices for production apps."`,
    ['Ask for monitoring tool recommendations', 'Learn about performance metrics', 'Request optimization techniques'],
    config,
    classType,
    platform
  ));

  return steps;
}

