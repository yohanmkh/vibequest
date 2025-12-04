import { motion } from 'framer-motion';
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Phase, Task } from '../types';
import { useGameEngine } from '../hooks/useGameEngine';

interface PhaseSelectorProps {
  onTaskSelect: (task: Task) => void;
}

export function PhaseSelector({ onTaskSelect }: PhaseSelectorProps) {
  const { currentPhase, playerClass, platform, stack } = useGameStore();
  const { getCurrentCurriculum } = useGameEngine();

  const curriculum = getCurrentCurriculum();

  if (!curriculum) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">Please select your class, platform, and stack first.</p>
      </div>
    );
  }

  const phases: Phase[] = ['initialization', 'skeleton', 'brain', 'production'];
  const phaseNames: Record<Phase, string> = {
    initialization: 'Initialization',
    skeleton: 'The Skeleton',
    brain: 'The Brain',
    production: 'Production',
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-cyber-primary mb-4">Development Phases</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phaseId) => {
          const phase = curriculum.phases.find((p) => p.id === phaseId);
          const isActive = currentPhase === phaseId;
          const isUnlocked = phases.indexOf(phaseId) <= phases.indexOf(currentPhase);

          return (
            <motion.div
              key={phaseId}
              className={`cyber-border bg-cyber-surface p-4 rounded-lg cursor-pointer ${
                isActive ? 'cyber-glow border-cyber-primary' : ''
              } ${!isUnlocked ? 'opacity-50' : ''}`}
              whileHover={isUnlocked ? { scale: 1.05 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{phaseNames[phaseId]}</h3>
                {isActive ? (
                  <PlayCircle className="w-5 h-5 text-cyber-primary" />
                ) : isUnlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-cyber-success" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <p className="text-sm text-gray-400 mb-3">{phase?.description}</p>
              <div className="space-y-2">
                {phase?.tasks.map((task) => (
                  <motion.button
                    key={task.id}
                    onClick={() => isUnlocked && onTaskSelect(task)}
                    disabled={!isUnlocked || task.status === 'locked'}
                    className={`w-full text-left p-2 rounded text-xs cyber-border ${
                      task.status === 'completed'
                        ? 'bg-cyber-success/20 border-cyber-success'
                        : task.status === 'in-progress'
                        ? 'bg-cyber-primary/20 border-cyber-primary'
                        : 'bg-cyber-bg border-cyber-border'
                    } ${!isUnlocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyber-primary/10'}`}
                    whileHover={isUnlocked ? { x: 4 } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <span>{task.title}</span>
                      <span className="text-cyber-warning">{task.coffeeCost}☕</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

