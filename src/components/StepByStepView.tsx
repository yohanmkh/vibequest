import { motion } from 'framer-motion';
import { CheckCircle2, Lock, PlayCircle, BookOpen, Lightbulb, AlertCircle } from 'lucide-react';
import { MicroStep } from '../types/enhanced';
import { useEnhancedGameEngine } from '../hooks/useEnhancedGameEngine';
import { useGameStore } from '../store/gameStore';

interface StepByStepViewProps {
  onStepSelect?: (stepId: string) => void;
}

export function StepByStepView({ onStepSelect }: StepByStepViewProps) {
  const { getCurrentCurriculum, currentStep, startStep, completeCurrentStep, validateStep } =
    useEnhancedGameEngine();
  const { completedTasks, resources } = useGameStore();

  const curriculum = getCurrentCurriculum();
  const currentStepIndex = currentStep
    ? curriculum.findIndex((s) => s.id === currentStep.id)
    : -1;

  const handleStepClick = (step: MicroStep) => {
    if (step.status === 'available' || step.status === 'in-progress') {
      startStep(step.id);
    }
  };

  const handleCompleteStep = () => {
    if (currentStep) {
      const validation = validateStep(currentStep);
      if (validation.valid) {
        completeCurrentStep();
      } else {
        // Show validation errors
        alert(`Please fix these issues:\n${validation.errors.join('\n')}`);
      }
    }
  };

  const isStepUnlocked = (step: MicroStep): boolean => {
    if (step.status === 'available' || step.status === 'in-progress') return true;
    if (!step.dependsOn) return step.status === 'available';
    return step.dependsOn.every((depId) => completedTasks.includes(depId));
  };

  const getStepStatus = (step: MicroStep) => {
    if (completedTasks.includes(step.id)) return 'completed';
    if (currentStep?.id === step.id) return 'in-progress';
    if (isStepUnlocked(step)) return 'available';
    return 'locked';
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">
          Your Learning Path
        </h2>
        <p className="text-gray-400 mb-6">
          Follow these steps to build your application from zero to deploy
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm text-cyber-primary">
              {completedTasks.length} / {curriculum.length} steps
            </span>
          </div>
          <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedTasks.length / curriculum.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {curriculum.map((step, index) => {
            const status = getStepStatus(step);
            const isCurrent = currentStep?.id === step.id;
            const isCompleted = status === 'completed';
            const isLocked = status === 'locked';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`cyber-border bg-cyber-surface p-4 rounded-lg cursor-pointer ${
                  isCurrent ? 'cyber-glow border-cyber-primary' : ''
                } ${isLocked ? 'opacity-50' : ''}`}
                onClick={() => {
                  if (!isLocked && onStepSelect) {
                    onStepSelect(step.id);
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-10 h-10 rounded-full bg-cyber-success flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-10 h-10 rounded-full bg-cyber-primary flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-black" />
                      </div>
                    ) : isLocked ? (
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cyber-surface border-2 border-cyber-border flex items-center justify-center">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{step.title}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-cyber-warning">{step.coffeeCost}☕</span>
                        <span className="text-cyber-primary">{step.xpReward} XP</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-3">{step.description}</p>

                    {/* Learning Objective */}
                    <div className="flex items-start gap-2 mb-3 p-2 bg-cyber-bg rounded">
                      <BookOpen className="w-4 h-4 text-cyber-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Learning Objective:</p>
                        <p className="text-xs text-cyber-primary">{step.learningObjective}</p>
                      </div>
                    </div>

                    {/* Best Practices */}
                    {step.bestPractices && step.bestPractices.length > 0 && (
                      <div className="flex items-start gap-2 mb-3 p-2 bg-cyber-bg rounded">
                        <Lightbulb className="w-4 h-4 text-cyber-warning flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Best Practices:</p>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {step.bestPractices.map((practice, i) => (
                              <li key={i}>• {practice}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Common Pitfalls */}
                    {step.commonPitfalls && step.commonPitfalls.length > 0 && (
                      <div className="flex items-start gap-2 mb-3 p-2 bg-red-900/20 rounded border border-red-800/50">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-red-400 mb-1">Common Pitfalls:</p>
                          <ul className="text-xs text-red-300 space-y-1">
                            {step.commonPitfalls.map((pitfall, i) => (
                              <li key={i}>⚠ {pitfall}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {isCurrent && (
                      <div className="flex gap-2 mt-4">
                        <motion.button
                          onClick={handleCompleteStep}
                          className="px-4 py-2 bg-cyber-success text-white rounded text-sm font-semibold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Complete Step
                        </motion.button>
                        {resources.coffee < step.coffeeCost && (
                          <span className="text-xs text-cyber-warning self-center">
                            Need {step.coffeeCost} coffee (have {resources.coffee})
                          </span>
                        )}
                      </div>
                    )}

                    {!isCurrent && !isLocked && !isCompleted && (
                      <motion.button
                        onClick={() => handleStepClick(step)}
                        disabled={resources.coffee < step.coffeeCost}
                        className="mt-4 px-4 py-2 bg-cyber-primary text-black rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: resources.coffee >= step.coffeeCost ? 1.05 : 1 }}
                        whileTap={{ scale: resources.coffee >= step.coffeeCost ? 0.95 : 1 }}
                      >
                        Start Step
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

