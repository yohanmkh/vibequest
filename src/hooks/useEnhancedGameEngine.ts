// Enhanced game engine with step-by-step workflow
import { useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getEnhancedCurriculum, getStepById, getNextStep } from '../data/enhancedCurriculum';
import { codeGenerator } from '../engines/codeGenerator';
import { fileSystemManager } from '../engines/fileSystemManager';
import { MicroStep, GeneratedCode, FileSystemState } from '../types/enhanced';

export function useEnhancedGameEngine() {
  const {
    playerClass,
    platform,
    stack,
    resources,
    consumeCoffee,
    consumeSanity,
    updateResources,
    regenerateCoffee,
    completeTask,
  } = useGameStore();

  const [currentStep, setCurrentStep] = useState<MicroStep | null>(null);
  const [fileSystem, setFileSystem] = useState<FileSystemState | null>(null);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode[]>([]);

  // Initialize file system when stack is selected
  useEffect(() => {
    if (stack && !fileSystem) {
      const fs = fileSystemManager.initializeProject(stack);
      setFileSystem(fs);
    }
  }, [stack, fileSystem]);

  // Auto-regenerate coffee
  useEffect(() => {
    const interval = setInterval(() => {
      regenerateCoffee();
    }, 2000);
    return () => clearInterval(interval);
  }, [regenerateCoffee]);

  // Get current curriculum
  const getCurrentCurriculum = useCallback(() => {
    if (!playerClass || !platform || !stack) return [];
    return getEnhancedCurriculum(playerClass, platform, stack);
  }, [playerClass, platform, stack]);

  // Start a step
  const startStep = useCallback(
    (stepId: string): boolean => {
      const step = getStepById(stepId);
      if (!step) return false;

      // Check dependencies
      if (step.dependsOn) {
        const allCompleted = step.dependsOn.every((depId) =>
          useGameStore.getState().completedTasks.includes(depId)
        );
        if (!allCompleted) {
          return false;
        }
      }

      // Check resources
      if (!consumeCoffee(step.coffeeCost)) {
        return false;
      }

      setCurrentStep(step);
      return true;
    },
    [consumeCoffee]
  );

  // Generate code from prompt
  const generateCodeFromPrompt = useCallback(
    (prompt: string): GeneratedCode[] => {
      if (!currentStep) return [];

      const quality = codeGenerator.assessPromptQuality(prompt);
      const codes = codeGenerator.generateFromPrompt(prompt, { step: currentStep });

      // Add generated files to file system
      codes.forEach((code) => {
        fileSystemManager.addFile(code);
      });

      // Update file system state
      setFileSystem(fileSystemManager.getState());
      setGeneratedCode(codes);

      // Update resources based on prompt quality
      const sanityChange = quality >= 0.7 ? 0 : -10;
      const xpGained = quality >= 0.7 ? 30 : 10;

      if (sanityChange < 0) {
        consumeSanity(Math.abs(sanityChange));
      }

      updateResources({
        xp: resources.xp + xpGained,
        sanity: Math.max(0, resources.sanity + sanityChange),
      });

      return codes;
    },
    [currentStep, consumeSanity, updateResources, resources]
  );

  // Complete current step
  const completeCurrentStep = useCallback(() => {
    if (!currentStep) return;

    completeTask(currentStep.id);
    updateResources({
      xp: resources.xp + currentStep.xpReward,
    });

    // Get next step
    const nextStep = getNextStep(currentStep.id);
    setCurrentStep(nextStep);
  }, [currentStep, completeTask, updateResources, resources]);

  // Update file content
  const updateFileContent = useCallback((filePath: string, content: string) => {
    fileSystemManager.updateFile(filePath, content);
    setFileSystem(fileSystemManager.getState());
  }, []);

  // Open file
  const openFile = useCallback((filePath: string) => {
    fileSystemManager.openFile(filePath);
    setFileSystem(fileSystemManager.getState());
  }, []);

  // Close file
  const closeFile = useCallback((filePath: string) => {
    fileSystemManager.closeFile(filePath);
    setFileSystem(fileSystemManager.getState());
  }, []);

  // Get file content
  const getFileContent = useCallback((filePath: string): string | null => {
    return fileSystemManager.getFileContent(filePath);
  }, []);

  // Validate step completion
  const validateStep = useCallback(
    (step: MicroStep): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (step.validationRules) {
        step.validationRules.forEach((rule) => {
          switch (rule.type) {
            case 'file-exists':
              const file = fileSystemManager.getFileContent(rule.value);
              if (!file) {
                errors.push(rule.errorMessage);
              }
              break;
            case 'code-contains':
              // Check if code contains required elements
              const allFiles = fileSystemManager.getAllFiles();
              const hasCode = allFiles.some((f) =>
                f.content?.includes(rule.value)
              );
              if (!hasCode) {
                errors.push(rule.errorMessage);
              }
              break;
          }
        });
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    },
    []
  );

  return {
    getCurrentCurriculum,
    currentStep,
    startStep,
    completeCurrentStep,
    generateCodeFromPrompt,
    fileSystem,
    updateFileContent,
    openFile,
    closeFile,
    getFileContent,
    validateStep,
    generatedCode,
    resources,
  };
}

