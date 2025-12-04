import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { getCurriculum } from '../data/curriculum';
import { VibeCheckResult } from '../types';

export function useGameEngine() {
  const {
    playerClass,
    platform,
    stack,
    currentPhase,
    resources,
    consumeCoffee,
    consumeSanity,
    updateResources,
    regenerateCoffee,
  } = useGameStore();

  // Auto-regenerate coffee
  useEffect(() => {
    const interval = setInterval(() => {
      regenerateCoffee();
    }, 2000); // Regenerate 1 coffee every 2 seconds

    return () => clearInterval(interval);
  }, [regenerateCoffee]);

  const getCurrentCurriculum = useCallback(() => {
    if (!playerClass || !platform || !stack) return null;
    return getCurriculum(playerClass, platform, stack);
  }, [playerClass, platform, stack]);

  const executeVibeCheck = useCallback(
    (promptQuality: number, coffeeCost: number): VibeCheckResult => {
      if (!consumeCoffee(coffeeCost)) {
        return {
          success: false,
          message: 'Not enough coffee! Take a break and regenerate.',
          sanityChange: 0,
          coffeeChange: 0,
          xpGained: 0,
        };
      }

      const threshold = 0.7;
      const success = promptQuality >= threshold;
      const sanityChange = success ? 0 : -10;
      const xpGained = success ? 20 : 5;

      if (sanityChange < 0) {
        consumeSanity(Math.abs(sanityChange));
      }

      updateResources({
        xp: resources.xp + xpGained,
        sanity: Math.max(0, resources.sanity + sanityChange),
      });

      return {
        success,
        message: success
          ? 'Great prompt! The AI generated exactly what you needed.'
          : 'The AI hallucinated. Your prompt was too vague. Try being more specific.',
        sanityChange,
        coffeeChange: -coffeeCost,
        xpGained,
        bug: success
          ? undefined
          : 'Generated code has a type error. Fix it manually.',
      };
    },
    [consumeCoffee, consumeSanity, updateResources, resources]
  );

  const checkAnswer = useCallback(
    (
      taskId: string,
      answer: number | string,
      correctAnswer: number | string,
      coffeeCost: number
    ): VibeCheckResult => {
      if (!consumeCoffee(coffeeCost)) {
        return {
          success: false,
          message: 'Not enough coffee!',
          sanityChange: 0,
          coffeeChange: 0,
          xpGained: 0,
        };
      }

      const isCorrect = answer === correctAnswer;
      const sanityChange = isCorrect ? 0 : -15;
      const xpGained = isCorrect ? 30 : 5;

      if (sanityChange < 0) {
        consumeSanity(Math.abs(sanityChange));
      }

      updateResources({
        xp: resources.xp + xpGained,
        sanity: Math.max(0, resources.sanity + sanityChange),
      });

      return {
        success: isCorrect,
        message: isCorrect
          ? 'Correct! You nailed it!'
          : 'Wrong answer. The AI tricked you. Lose sanity.',
        sanityChange,
        coffeeChange: -coffeeCost,
        xpGained,
      };
    },
    [consumeCoffee, consumeSanity, updateResources, resources]
  );

  return {
    getCurrentCurriculum,
    executeVibeCheck,
    checkAnswer,
    resources,
  };
}

