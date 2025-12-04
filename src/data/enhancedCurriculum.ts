// Enhanced curriculum with granular step-by-step tasks
import { MicroStep } from '../types/enhanced';
import { generateCompleteCurriculum } from './curriculumGenerator';

// Generate all curricula using the generator
export const enhancedCurricula: Record<string, MicroStep[]> = {
  // VIBE SURFER - EASY MODE
  'vibe-surfer-web-react-node': generateCompleteCurriculum('vibe-surfer', 'web', 'react-node'),
  'vibe-surfer-mobile-flutter-firebase': generateCompleteCurriculum('vibe-surfer', 'mobile', 'flutter-firebase'),
  'vibe-surfer-web-nextjs-prisma': generateCompleteCurriculum('vibe-surfer', 'web', 'nextjs-prisma'),

  // CO-PILOT - INTERMEDIATE MODE
  'co-pilot-web-react-node': generateCompleteCurriculum('co-pilot', 'web', 'react-node'),
  'co-pilot-mobile-flutter-firebase': generateCompleteCurriculum('co-pilot', 'mobile', 'flutter-firebase'),
  'co-pilot-web-nextjs-prisma': generateCompleteCurriculum('co-pilot', 'web', 'nextjs-prisma'),

  // 10X ARCHITECT - EXPERT MODE
  '10x-architect-web-react-node': generateCompleteCurriculum('10x-architect', 'web', 'react-node'),
  '10x-architect-mobile-flutter-firebase': generateCompleteCurriculum('10x-architect', 'mobile', 'flutter-firebase'),
  '10x-architect-web-nextjs-prisma': generateCompleteCurriculum('10x-architect', 'web', 'nextjs-prisma'),
};

export function getEnhancedCurriculum(
  playerClass: string,
  platform: string,
  stack: string
): MicroStep[] {
  const key = `${playerClass}-${platform}-${stack}`;
  const curriculum = enhancedCurricula[key];
  
  // If exact match not found, try to find a similar one
  if (!curriculum) {
    // Fallback to vibe-surfer-web-react-node as default
    return enhancedCurricula['vibe-surfer-web-react-node'] || [];
  }
  
  return curriculum;
}

export function getStepById(stepId: string): MicroStep | null {
  for (const steps of Object.values(enhancedCurricula)) {
    const step = steps.find((s) => s.id === stepId);
    if (step) return step;
  }
  return null;
}

export function getNextStep(currentStepId: string): MicroStep | null {
  for (const steps of Object.values(enhancedCurricula)) {
    const currentIndex = steps.findIndex((s) => s.id === currentStepId);
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      return steps[currentIndex + 1];
    }
  }
  return null;
}

