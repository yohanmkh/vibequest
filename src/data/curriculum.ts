import { Curriculum } from '../types';

export const curricula: Curriculum[] = [
  // Vibe Surfer - Web - React/Node
  {
    class: 'vibe-surfer',
    platform: 'web',
    stack: 'react-node',
    phases: [
      {
        id: 'initialization',
        title: 'Initialization',
        description: 'Set up your development environment and project structure.',
        tasks: [
          {
            id: 'init-1',
            title: 'Choose Your Stack',
            description: 'Select React + Node.js for your web application.',
            type: 'setup',
            status: 'available',
            coffeeCost: 0,
            xpReward: 10,
          },
          {
            id: 'init-2',
            title: 'npm init Speed Run',
            description: 'Type "npm init -y" in the terminal as fast as you can!',
            type: 'setup',
            status: 'locked',
            coffeeCost: 5,
            xpReward: 15,
          },
        ],
      },
      {
        id: 'skeleton',
        title: 'The Skeleton',
        description: 'Build the frontend UI using AI-powered tools.',
        tasks: [
          {
            id: 'skeleton-1',
            title: 'Prompt Battle: Landing Page',
            description: 'Choose the best prompt to generate a beautiful landing page.',
            type: 'prompt-battle',
            status: 'locked',
            coffeeCost: 10,
            xpReward: 25,
            challenge: {
              type: 'prompt-battle',
              prompt: 'Create a landing page for a SaaS product',
              options: [
                'make a website',
                'Create a modern, responsive landing page for a SaaS product with a hero section, features grid, and CTA button. Use Tailwind CSS for styling.',
                'landing page with tailwind',
              ],
              correctAnswer: 1,
            },
          },
          {
            id: 'skeleton-2',
            title: 'CSS Clash',
            description: 'Fix overlapping divs using Tailwind classes.',
            type: 'css-clash',
            status: 'locked',
            coffeeCost: 15,
            xpReward: 30,
            challenge: {
              type: 'css-clash',
              code: '<div class="flex"><div class="w-full">Left</div><div class="w-full">Right</div></div>',
              correctAnswer: 'flex-wrap',
            },
          },
        ],
      },
      {
        id: 'brain',
        title: 'The Brain',
        description: 'Connect your frontend to a backend API and database.',
        tasks: [
          {
            id: 'brain-1',
            title: 'Schema Panic',
            description: 'Map the JSON response to the correct TypeScript interface.',
            type: 'schema-panic',
            status: 'locked',
            coffeeCost: 20,
            xpReward: 40,
            challenge: {
              type: 'schema-panic',
              schema: { id: 'number', name: 'string', email: 'string' },
            },
          },
        ],
      },
      {
        id: 'production',
        title: 'Production',
        description: 'Deploy your application to production.',
        tasks: [
          {
            id: 'prod-1',
            title: 'The CI/CD Gauntlet',
            description: 'Fix failing tests in the deployment pipeline.',
            type: 'ci-cd-gauntlet',
            status: 'locked',
            coffeeCost: 30,
            sanityCost: 10,
            xpReward: 50,
            challenge: {
              type: 'ci-cd-gauntlet',
              error: 'Test failed: Expected 2 but got 3',
            },
          },
        ],
      },
    ],
  },
  // Co-Pilot - Web - React/Node
  {
    class: 'co-pilot',
    platform: 'web',
    stack: 'react-node',
    phases: [
      {
        id: 'initialization',
        title: 'Initialization',
        description: 'Set up your development environment and project structure.',
        tasks: [
          {
            id: 'init-1',
            title: 'Architecture Planning',
            description: 'Design your component structure before coding.',
            type: 'drag-drop',
            status: 'available',
            coffeeCost: 5,
            xpReward: 15,
          },
        ],
      },
      {
        id: 'skeleton',
        title: 'The Skeleton',
        description: 'Build the frontend UI with code review challenges.',
        tasks: [
          {
            id: 'skeleton-1',
            title: 'Code Review: Component Bug',
            description: 'Find the subtle bug in this React component before approving the PR.',
            type: 'code-review',
            status: 'locked',
            coffeeCost: 15,
            xpReward: 35,
            challenge: {
              type: 'code-review',
              code: `function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}`,
              bug: 'Missing prop validation / TypeScript types',
            },
          },
        ],
      },
      {
        id: 'brain',
        title: 'The Brain',
        description: 'Connect your frontend to a backend API and database.',
        tasks: [
          {
            id: 'brain-1',
            title: 'API Integration Review',
            description: 'Review the API integration code for potential issues.',
            type: 'code-review',
            status: 'locked',
            coffeeCost: 20,
            xpReward: 40,
            challenge: {
              type: 'code-review',
              code: `async function fetchUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}`,
              bug: 'Missing error handling',
            },
          },
        ],
      },
      {
        id: 'production',
        title: 'Production',
        description: 'Deploy your application to production.',
        tasks: [
          {
            id: 'prod-1',
            title: 'The CI/CD Gauntlet',
            description: 'Fix failing tests in the deployment pipeline.',
            type: 'ci-cd-gauntlet',
            status: 'locked',
            coffeeCost: 30,
            sanityCost: 15,
            xpReward: 60,
            challenge: {
              type: 'ci-cd-gauntlet',
              error: 'TypeError: Cannot read property "map" of undefined',
            },
          },
        ],
      },
    ],
  },
  // 10x Architect - Web - React/Node
  {
    class: '10x-architect',
    platform: 'web',
    stack: 'react-node',
    phases: [
      {
        id: 'initialization',
        title: 'Initialization',
        description: 'Set up your development environment with precision.',
        tasks: [
          {
            id: 'init-1',
            title: 'Console Warfare: Dependency Hell',
            description: 'Fix the npm dependency conflict error.',
            type: 'console-warfare',
            status: 'available',
            coffeeCost: 10,
            xpReward: 20,
            challenge: {
              type: 'console-warfare',
              error: 'npm ERR! peer dep missing: react@^18.0.0, required by react-dom@18.2.0',
              correctAnswer: 'npm install react@^18.0.0',
            },
          },
        ],
      },
      {
        id: 'skeleton',
        title: 'The Skeleton',
        description: 'Build the frontend with deep technical challenges.',
        tasks: [
          {
            id: 'skeleton-1',
            title: 'Hallucination Hunter',
            description: 'AI suggests 3 libraries. 2 are fake. Pick the real one.',
            type: 'hallucination-hunter',
            status: 'locked',
            coffeeCost: 20,
            xpReward: 45,
            challenge: {
              type: 'hallucination-hunter',
              options: ['react-fast-refresh', 'react-hot-loader', 'react-refresh'],
              correctAnswer: 2,
            },
          },
          {
            id: 'skeleton-2',
            title: 'Console Warfare: Build Error',
            description: 'Fix the TypeScript compilation error.',
            type: 'console-warfare',
            status: 'locked',
            coffeeCost: 25,
            xpReward: 50,
            challenge: {
              type: 'console-warfare',
              error: "TS2322: Type 'string' is not assignable to type 'number'",
              correctAnswer: 'Fix type annotation',
            },
          },
        ],
      },
      {
        id: 'brain',
        title: 'The Brain',
        description: 'Connect your frontend to a backend API and database.',
        tasks: [
          {
            id: 'brain-1',
            title: 'Console Warfare: Database Connection',
            description: 'Fix the database connection error.',
            type: 'console-warfare',
            status: 'locked',
            coffeeCost: 30,
            xpReward: 60,
            challenge: {
              type: 'console-warfare',
              error: 'ECONNREFUSED 127.0.0.1:5432',
              correctAnswer: 'Start PostgreSQL service',
            },
          },
        ],
      },
      {
        id: 'production',
        title: 'Production',
        description: 'Deploy your application to production.',
        tasks: [
          {
            id: 'prod-1',
            title: 'The CI/CD Gauntlet',
            description: 'Fix multiple failing tests and deployment issues.',
            type: 'ci-cd-gauntlet',
            status: 'locked',
            coffeeCost: 40,
            sanityCost: 20,
            xpReward: 80,
            challenge: {
              type: 'ci-cd-gauntlet',
              error: 'Multiple test failures: Memory leak detected, Type errors, API timeout',
            },
          },
        ],
      },
    ],
  },
];

export function getCurriculum(
  playerClass: string,
  platform: string,
  stack: string
): Curriculum | null {
  return (
    curricula.find(
      (c) =>
        c.class === playerClass &&
        c.platform === platform &&
        c.stack === stack
    ) || null
  );
}

