import { motion } from 'framer-motion';
import { 
  Coffee, 
  Brain, 
  Zap, 
  Trophy, 
  AlertTriangle, 
  Bot, 
  Code2,
  Flame
} from 'lucide-react';
import { EnhancedGameResources, calculateBurnoutRisk, calculateDeploymentReadiness } from '../types/enhancedGameTypes';

interface EnhancedHUDProps {
  resources: EnhancedGameResources;
  hiddenStats?: (keyof EnhancedGameResources)[];
  showAdvancedStats?: boolean;
}

export function EnhancedHUD({ 
  resources, 
  hiddenStats = [], 
  showAdvancedStats = true 
}: EnhancedHUDProps) {
  const sanityPercentage = (resources.sanity / 100) * 100;
  const coffeePercentage = (resources.coffee / 100) * 100;
  const xpPercentage = ((resources.xp % 100) / 100) * 100;
  const techDebtPercentage = (resources.techDebt / 100) * 100;
  const aiTrustPercentage = (resources.aiTrust / 100) * 100;
  const codeQualityPercentage = (resources.codeQuality / 100) * 100;
  
  // Computed stats
  const burnoutRisk = calculateBurnoutRisk(resources);
  const deploymentReadiness = calculateDeploymentReadiness(resources);

  // Determine bar colors based on values
  const getSanityColor = (value: number) => {
    if (value > 60) return 'from-green-500 to-green-400';
    if (value > 30) return 'from-yellow-500 to-yellow-400';
    return 'from-red-600 to-red-500';
  };

  const getCoffeeColor = (value: number) => {
    if (value > 40) return 'from-amber-600 to-amber-500';
    if (value > 20) return 'from-orange-600 to-orange-500';
    return 'from-red-600 to-red-500';
  };

  const getTechDebtColor = (value: number) => {
    if (value < 30) return 'from-green-500 to-green-400';
    if (value < 60) return 'from-yellow-500 to-yellow-400';
    return 'from-red-600 to-red-500';
  };

  const getAITrustColor = (value: number) => {
    if (value > 70) return 'from-blue-500 to-cyan-400';
    if (value > 40) return 'from-yellow-500 to-yellow-400';
    return 'from-red-600 to-red-500';
  };

  const isStatHidden = (stat: keyof EnhancedGameResources) => hiddenStats.includes(stat);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="flex flex-wrap items-start gap-3">
        {/* Primary Stats Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sanity Bar */}
          <div className="cyber-border bg-cyber-surface p-2 rounded min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <Brain className={`w-4 h-4 ${resources.sanity < 30 ? 'text-red-500 animate-pulse' : 'text-cyber-primary'}`} />
              <span className="text-xs font-semibold">Sanity</span>
              <span className="text-xs text-cyber-primary ml-auto">{resources.sanity}/100</span>
            </div>
            <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getSanityColor(resources.sanity)}`}
                initial={{ width: 0 }}
                animate={{ width: `${sanityPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {resources.sanity < 30 && (
              <div className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Panic Mode!
              </div>
            )}
          </div>

          {/* Coffee Bar */}
          <div className="cyber-border bg-cyber-surface p-2 rounded min-w-[140px]">
            <div className="flex items-center gap-2 mb-1">
              <Coffee className={`w-4 h-4 ${resources.coffee < 20 ? 'text-red-500' : 'text-cyber-warning'}`} />
              <span className="text-xs font-semibold">Coffee</span>
              <span className="text-xs text-cyber-warning ml-auto">{resources.coffee}/100</span>
            </div>
            <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getCoffeeColor(resources.coffee)}`}
                initial={{ width: 0 }}
                animate={{ width: `${coffeePercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {resources.coffee < 20 && (
              <div className="text-xs text-orange-400 mt-1">☕ Need a break!</div>
            )}
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

        {/* Secondary Stats Row (if not hidden) */}
        {showAdvancedStats && (
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tech Debt */}
            {!isStatHidden('techDebt') && (
              <div className="cyber-border bg-cyber-surface p-2 rounded min-w-[130px]">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className={`w-4 h-4 ${resources.techDebt > 60 ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`} />
                  <span className="text-xs font-semibold">Tech Debt</span>
                  <span className="text-xs text-yellow-500 ml-auto">{resources.techDebt}%</span>
                </div>
                <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getTechDebtColor(resources.techDebt)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${techDebtPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {resources.techDebt > 60 && (
                  <div className="text-xs text-red-400 mt-1">⚠️ Refactor needed!</div>
                )}
              </div>
            )}

            {/* AI Trust */}
            {!isStatHidden('aiTrust') && (
              <div className="cyber-border bg-cyber-surface p-2 rounded min-w-[130px]">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className={`w-4 h-4 ${resources.aiTrust > 70 ? 'text-cyan-400' : resources.aiTrust > 40 ? 'text-yellow-500' : 'text-red-500'}`} />
                  <span className="text-xs font-semibold">AI Trust</span>
                  <span className="text-xs text-cyan-400 ml-auto">{resources.aiTrust}%</span>
                </div>
                <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getAITrustColor(resources.aiTrust)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${aiTrustPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {resources.aiTrust < 40 && (
                  <div className="text-xs text-red-400 mt-1">🤖 AI less reliable</div>
                )}
              </div>
            )}

            {/* Code Quality */}
            {!isStatHidden('codeQuality') && (
              <div className="cyber-border bg-cyber-surface p-2 rounded min-w-[130px]">
                <div className="flex items-center gap-2 mb-1">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold">Quality</span>
                  <span className="text-xs text-purple-400 ml-auto">{resources.codeQuality}%</span>
                </div>
                <div className="h-2 bg-cyber-bg rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${codeQualityPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Indicators */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Burnout Warning */}
          {burnoutRisk > 60 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="cyber-border bg-red-900/50 border-red-500 p-2 rounded flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-xs text-red-400">Burnout Risk: {burnoutRisk}%</span>
            </motion.div>
          )}

          {/* Deployment Readiness */}
          {deploymentReadiness < 50 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="cyber-border bg-yellow-900/50 border-yellow-500 p-2 rounded flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-yellow-400">Not Deploy Ready</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for mobile or when space is limited
export function CompactHUD({ resources }: { resources: EnhancedGameResources }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-2 pointer-events-none">
      <div className="flex items-center justify-center gap-4 bg-cyber-surface/90 backdrop-blur-sm cyber-border rounded-lg p-2 mx-auto w-fit">
        <div className="flex items-center gap-1">
          <Brain className={`w-4 h-4 ${resources.sanity < 30 ? 'text-red-500' : 'text-cyan-400'}`} />
          <span className="text-xs font-mono">{resources.sanity}</span>
        </div>
        <div className="flex items-center gap-1">
          <Coffee className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-mono">{resources.coffee}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono">Lv{resources.level}</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className={`w-4 h-4 ${resources.techDebt > 60 ? 'text-red-500' : 'text-yellow-500'}`} />
          <span className="text-xs font-mono">{resources.techDebt}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Bot className={`w-4 h-4 ${resources.aiTrust > 70 ? 'text-cyan-400' : 'text-yellow-500'}`} />
          <span className="text-xs font-mono">{resources.aiTrust}%</span>
        </div>
      </div>
    </div>
  );
}
