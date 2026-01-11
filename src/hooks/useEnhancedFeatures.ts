// Enhanced hook to manage game features with dynamic, context-aware challenges
import { useState, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { 
  DecisionPoint, 
  VerificationChallenge, 
  VerificationResult,
  Consequences 
} from '../types/enhancedGameTypes';
import { MicroStep } from '../types/enhanced';
import { 
  getContextualDecision, 
  getContextualVerification,
  getRandomDecision,
  getRandomVerification,
  getAvailableDecisions,
  getAvailableVerifications
} from '../data/dynamicChallenges';
import {
  getDecisionForStep,
  getVerificationForStep
} from '../data/stepChallenges';

interface UseEnhancedFeaturesProps {
  currentStep?: MicroStep | null;
}

export function useEnhancedFeatures(props?: UseEnhancedFeaturesProps) {
  const { playerClass, platform, stack, resources, updateResources } = useGameStore();
  const [currentDecision, setCurrentDecision] = useState<DecisionPoint | null>(null);
  const [currentVerification, setCurrentVerification] = useState<VerificationChallenge | null>(null);

  // Build game context for dynamic challenges
  const gameContext = useMemo(() => ({
    playerClass,
    platform,
    stack,
    currentStep: props?.currentStep || null,
  }), [playerClass, platform, stack, props?.currentStep]);

  // Get available challenge types for current context
  const availableDecisionTypes = useMemo(
    () => getAvailableDecisions(gameContext),
    [gameContext]
  );

  const availableVerificationTypes = useMemo(
    () => getAvailableVerifications(gameContext),
    [gameContext]
  );

  const applyConsequences = useCallback((consequences: Consequences) => {
    const changes: Partial<typeof resources> = {};
    
    if (consequences.sanityChange) {
      changes.sanity = Math.max(0, Math.min(100, resources.sanity + consequences.sanityChange));
    }
    if (consequences.coffeeChange) {
      changes.coffee = Math.max(0, Math.min(100, resources.coffee + consequences.coffeeChange));
    }
    if (consequences.xpChange) {
      changes.xp = resources.xp + consequences.xpChange;
    }
    if (consequences.techDebtChange) {
      changes.techDebt = Math.max(0, Math.min(100, resources.techDebt + consequences.techDebtChange));
    }
    if (consequences.aiTrustChange) {
      changes.aiTrust = Math.max(0, Math.min(100, resources.aiTrust + consequences.aiTrustChange));
    }
    if (consequences.codeQualityChange) {
      changes.codeQuality = Math.max(0, Math.min(100, resources.codeQuality + consequences.codeQualityChange));
    }
    
    updateResources(changes);
  }, [resources, updateResources]);

  const handleDecisionSelect = useCallback((optionId: string) => {
    if (!currentDecision) return;
    
    const option = currentDecision.options.find(o => o.id === optionId);
    if (!option) return;
    
    console.log('📊 Decision made:', optionId, 'Consequences:', option.consequences);
    applyConsequences(option.consequences);
    setCurrentDecision(null);
  }, [currentDecision, applyConsequences]);

  const handleVerificationComplete = useCallback((result: VerificationResult) => {
    if (!currentVerification) return;
    
    console.log('✅ Verification result:', result.passed ? 'PASSED' : 'FAILED');
    
    if (result.passed) {
      updateResources({
        xp: resources.xp + currentVerification.xpReward,
        aiTrust: Math.min(100, resources.aiTrust + currentVerification.aiTrustBonus),
      });
    } else {
      updateResources({
        sanity: Math.max(0, resources.sanity - 10),
      });
    }
    
    setCurrentVerification(null);
  }, [currentVerification, resources, updateResources]);

  const handleVerificationSkip = useCallback(() => {
    console.log('⏭️ Verification skipped - applying penalty');
    updateResources({
      sanity: Math.max(0, resources.sanity - 15),
      techDebt: Math.min(100, resources.techDebt + 10),
    });
    setCurrentVerification(null);
  }, [resources, updateResources]);

  // Trigger a specific type of decision with current context
  const triggerDecision = useCallback((type?: 'scope-creep' | 'ai-review' | 'testing-approach' | 'tech-choice') => {
    console.log('🎯 Triggering decision type:', type || 'random');
    console.log('📋 Context:', { 
      class: playerClass, 
      platform, 
      stack, 
      step: props?.currentStep?.title 
    });
    
    let decision: DecisionPoint;
    if (type) {
      decision = getContextualDecision(type, gameContext);
    } else {
      decision = getRandomDecision(gameContext);
    }
    
    console.log('🎯 Generated decision:', decision.title);
    setCurrentDecision(decision);
  }, [gameContext, playerClass, platform, stack, props?.currentStep?.title]);

  // Trigger a specific type of verification with current context
  const triggerVerification = useCallback((type?: 'state-management' | 'component-structure' | 'spot-the-bug' | 'predict-output') => {
    console.log('✓ Triggering verification type:', type || 'random');
    console.log('📋 Context:', { 
      class: playerClass, 
      platform, 
      stack, 
      step: props?.currentStep?.title 
    });
    
    let verification: VerificationChallenge;
    if (type) {
      verification = getContextualVerification(type, gameContext);
    } else {
      verification = getRandomVerification(gameContext);
    }
    
    console.log('✓ Generated verification:', verification.title);
    setCurrentVerification(verification);
  }, [gameContext, playerClass, platform, stack, props?.currentStep?.title]);

  // Trigger random decision appropriate for current step
  const triggerRandomDecision = useCallback(() => {
    const decision = getRandomDecision(gameContext);
    console.log('🎲 Random decision:', decision.title);
    setCurrentDecision(decision);
  }, [gameContext]);

  // Trigger random verification appropriate for current step
  const triggerRandomVerification = useCallback(() => {
    const verification = getRandomVerification(gameContext);
    console.log('🎲 Random verification:', verification.title);
    setCurrentVerification(verification);
  }, [gameContext]);

  // NEW: Trigger step-specific decision (based on current step)
  const triggerStepDecision = useCallback(() => {
    if (!props?.currentStep) {
      console.log('⚠️ No current step, using random decision');
      return triggerRandomDecision();
    }
    
    const decision = getDecisionForStep({
      step: props.currentStep,
      playerClass,
      platform,
      stack,
    });
    
    if (decision) {
      console.log('📋 Step-specific decision for:', props.currentStep.title);
      console.log('🎯 Decision:', decision.title);
      setCurrentDecision(decision);
    } else {
      console.log('⚠️ No decision for this step, using random');
      triggerRandomDecision();
    }
  }, [props?.currentStep, playerClass, platform, stack, triggerRandomDecision]);

  // NEW: Trigger step-specific verification (based on current step)
  const triggerStepVerification = useCallback(() => {
    if (!props?.currentStep) {
      console.log('⚠️ No current step, using random verification');
      return triggerRandomVerification();
    }
    
    const verification = getVerificationForStep({
      step: props.currentStep,
      playerClass,
      platform,
      stack,
    });
    
    if (verification) {
      console.log('📋 Step-specific verification for:', props.currentStep.title);
      console.log('✓ Verification:', verification.title);
      setCurrentVerification(verification);
    } else {
      console.log('⚠️ No verification for this step, using random');
      triggerRandomVerification();
    }
  }, [props?.currentStep, playerClass, platform, stack, triggerRandomVerification]);

  return {
    // State
    currentDecision,
    currentVerification,
    
    // Context info
    availableDecisionTypes,
    availableVerificationTypes,
    gameContext,
    currentStep: props?.currentStep,
    
    // Actions
    handleDecisionSelect,
    handleVerificationComplete,
    handleVerificationSkip,
    triggerDecision,
    triggerVerification,
    triggerRandomDecision,
    triggerRandomVerification,
    
    // NEW: Step-specific triggers
    triggerStepDecision,
    triggerStepVerification,
    
    // Direct setters (for custom challenges)
    setCurrentDecision,
    setCurrentVerification,
  };
}
