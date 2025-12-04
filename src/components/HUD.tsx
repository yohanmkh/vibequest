import { motion } from 'framer-motion';
import { Coffee, Brain, Zap, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function HUD() {
  const { resources } = useGameStore();

  const sanityPercentage = (resources.sanity / 100) * 100;
  const coffeePercentage = (resources.coffee / 100) * 100;
  const xpPercentage = ((resources.xp % 100) / 100) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="flex items-center gap-4">
        {/* Sanity Bar */}
        <div className="flex-1 cyber-border bg-cyber-surface p-2 rounded">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-cyber-primary" />
            <span className="text-xs font-semibold">Sanity</span>
            <span className="text-xs text-cyber-primary ml-auto">{resources.sanity}/100</span>
          </div>
          <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-danger to-red-600"
              initial={{ width: 0 }}
              animate={{ width: `${sanityPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Coffee Bar */}
        <div className="flex-1 cyber-border bg-cyber-surface p-2 rounded">
          <div className="flex items-center gap-2 mb-1">
            <Coffee className="w-4 h-4 text-cyber-warning" />
            <span className="text-xs font-semibold">Coffee</span>
            <span className="text-xs text-cyber-warning ml-auto">{resources.coffee}/100</span>
          </div>
          <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-600 to-cyber-warning"
              initial={{ width: 0 }}
              animate={{ width: `${coffeePercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* XP & Level */}
        <div className="cyber-border bg-cyber-surface p-2 rounded min-w-[120px]">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-cyber-primary" />
            <span className="text-xs font-semibold">Level {resources.level}</span>
            <Trophy className="w-4 h-4 text-cyber-success ml-auto" />
          </div>
          <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1 text-center">{resources.xp} XP</div>
        </div>
      </div>
    </div>
  );
}

