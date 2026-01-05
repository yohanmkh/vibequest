import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnhancedHUD } from '../components/EnhancedHUD';
import { DecisionModal } from '../components/DecisionModal';
import { VerificationModal } from '../components/VerificationModal';
import { 
  EnhancedGameResources, 
  DEFAULT_ENHANCED_RESOURCES,
  DecisionPoint,
  VerificationChallenge,
  VerificationResult
} from '../types/enhancedGameTypes';
import { todoAppDecisions, todoAppVerifications } from '../data/todoAppScenarios';

export function EnhancedDemo() {
  const [resources, setResources] = useState<EnhancedGameResources>(DEFAULT_ENHANCED_RESOURCES);
  const [currentDecision, setCurrentDecision] = useState<DecisionPoint | null>(null);
  const [currentVerification, setCurrentVerification] = useState<VerificationChallenge | null>(null);
  const [log, setLog] = useState<string[]>(['Welcome to VibeQuest Enhanced Demo!']);
  const [stepCounter, setStepCounter] = useState(1);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `[Step ${stepCounter}] ${message}`]);
    setStepCounter(prev => prev + 1);
  };

  const updateResources = (changes: Partial<EnhancedGameResources>) => {
    setResources(prev => ({ ...prev, ...changes }));
    
    // Log changes
    const changeLog: string[] = [];
    if (changes.sanity !== undefined) changeLog.push(`Sanity: ${changes.sanity > 0 ? '+' : ''}${changes.sanity}`);
    if (changes.coffee !== undefined) changeLog.push(`Coffee: ${changes.coffee > 0 ? '+' : ''}${changes.coffee}`);
    if (changes.xp !== undefined) changeLog.push(`XP: +${changes.xp}`);
    if (changes.techDebt !== undefined) changeLog.push(`Tech Debt: ${changes.techDebt > 0 ? '+' : ''}${changes.techDebt}`);
    if (changes.aiTrust !== undefined) changeLog.push(`AI Trust: ${changes.aiTrust > 0 ? '+' : ''}${changes.aiTrust}`);
    
    if (changeLog.length > 0) {
      addLog(`Resources updated: ${changeLog.join(', ')}`);
    }
  };

  const applyConsequences = (consequences: any) => {
    const changes: Partial<EnhancedGameResources> = {};
    
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
  };

  const handleDecisionSelect = (optionId: string) => {
    if (!currentDecision) return;
    
    const option = currentDecision.options.find(o => o.id === optionId);
    if (!option) return;
    
    addLog(`Decision: "${currentDecision.title}" - Selected: "${option.label}"`);
    addLog(`Result: ${option.reasoning}`);
    
    applyConsequences(option.consequences);
    setCurrentDecision(null);
  };

  const handleVerificationComplete = (result: VerificationResult) => {
    if (!currentVerification) return;
    
    addLog(`Verification: "${currentVerification.title}" - ${result.passed ? 'PASSED' : 'FAILED'} (Score: ${result.score}%)`);
    
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
  };

  const handleVerificationSkip = () => {
    addLog(`Verification skipped - Sanity penalty applied`);
    updateResources({
      sanity: Math.max(0, resources.sanity - 15),
      techDebt: Math.min(100, resources.techDebt + 10),
    });
    setCurrentVerification(null);
  };

  // Demo actions
  const triggerScopeCreepDecision = () => {
    setCurrentDecision(todoAppDecisions[0]); // Scope creep decision
    addLog('🚨 A decision point has appeared!');
  };

  const triggerCodeReviewDecision = () => {
    setCurrentDecision(todoAppDecisions[1]); // AI code review decision
    addLog('🤖 Time to review AI-generated code!');
  };

  const triggerUseStateVerification = () => {
    setCurrentVerification(todoAppVerifications[0]); // useState explanation
    addLog('🔍 Verification required before proceeding!');
  };

  const triggerUseEffectVerification = () => {
    setCurrentVerification(todoAppVerifications[1]); // useEffect explanation
    addLog('🔍 Explain this useEffect hook!');
  };

  const triggerPredictOutput = () => {
    setCurrentVerification(todoAppVerifications[2]); // Predict filter output
    addLog('🧠 What will this code output?');
  };

  const triggerSpotBug = () => {
    setCurrentVerification(todoAppVerifications[3]); // Spot the bug
    addLog('🐛 Find the bug in this code!');
  };

  const simulatePoorPrompt = () => {
    addLog('Used poor prompt: "make a website"');
    applyConsequences({
      sanityChange: -10,
      coffeeChange: -15,
      techDebtChange: 15,
      aiTrustChange: -10,
      xpChange: 5,
    });
  };

  const simulateGoodPrompt = () => {
    addLog('Used good prompt with context and requirements');
    applyConsequences({
      sanityChange: 5,
      coffeeChange: -10,
      techDebtChange: 0,
      aiTrustChange: 10,
      xpChange: 30,
    });
  };

  const simulateBlindCopyPaste = () => {
    addLog('⚠️ Blind copy-paste detected!');
    applyConsequences({
      techDebtChange: 20,
      aiTrustChange: -15,
      xpChange: 5,
    });
  };

  const simulateRefactoring = () => {
    addLog('Refactored messy code');
    applyConsequences({
      sanityChange: 5,
      coffeeChange: -20,
      techDebtChange: -25,
      codeQualityChange: 20,
      xpChange: 45,
    });
  };

  const takeCoffeeBreak = () => {
    addLog('☕ Taking a coffee break...');
    updateResources({
      coffee: Math.min(100, resources.coffee + 30),
      sanity: Math.min(100, resources.sanity + 10),
    });
  };

  const resetDemo = () => {
    setResources(DEFAULT_ENHANCED_RESOURCES);
    setLog(['Demo reset - Try different actions!']);
    setStepCounter(1);
    setCurrentDecision(null);
    setCurrentVerification(null);
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-white p-8">
      {/* Enhanced HUD */}
      <EnhancedHUD resources={resources} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">
            VibeQuest Enhanced Demo
          </h1>
          <p className="text-gray-400">Try the new game mechanics and see how decisions affect your stats!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actions Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Decision Triggers */}
            <div className="cyber-border bg-cyber-surface rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-cyber-primary">🎯 Decision Points</h2>
              <p className="text-sm text-gray-400 mb-4">
                Trigger real engineering decisions that impact your stats and future scenarios
              </p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={triggerScopeCreepDecision}
                  className="px-4 py-3 bg-cyber-bg hover:bg-cyber-primary/20 rounded cyber-border text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">🚨 Scope Creep</div>
                  <div className="text-xs text-gray-400">PM wants drag-and-drop</div>
                </motion.button>

                <motion.button
                  onClick={triggerCodeReviewDecision}
                  className="px-4 py-3 bg-cyber-bg hover:bg-cyber-primary/20 rounded cyber-border text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">🤖 AI Code Review</div>
                  <div className="text-xs text-gray-400">Review generated code</div>
                </motion.button>
              </div>
            </div>

            {/* Verification Triggers */}
            <div className="cyber-border bg-cyber-surface rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-cyber-primary">🔍 Verification Challenges</h2>
              <p className="text-sm text-gray-400 mb-4">
                Test your understanding of code before proceeding (required in Co-Pilot and 10x Architect modes)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={triggerUseStateVerification}
                  className="px-4 py-3 bg-cyber-bg hover:bg-cyber-primary/20 rounded cyber-border text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">Explain useState</div>
                  <div className="text-xs text-gray-400">Write explanation</div>
                </motion.button>

                <motion.button
                  onClick={triggerUseEffectVerification}
                  className="px-4 py-3 bg-cyber-bg hover:bg-cyber-primary/20 rounded cyber-border text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">Explain useEffect</div>
                  <div className="text-xs text-gray-400">Write explanation</div>
                </motion.button>

                <motion.button
                  onClick={triggerPredictOutput}
                  className="px-4 py-3 bg-cyber-bg hover:bg-cyber-primary/20 rounded cyber-border text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">Predict Output</div>
                  <div className="text-xs text-gray-400">Multiple choice</div>
                </motion.button>

                <motion.button
                  onClick={triggerSpotBug}
                  className="px-4 py-3 bg-cyber-bg hover:bg-cyber-primary/20 rounded cyber-border text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">🐛 Spot the Bug</div>
                  <div className="text-xs text-gray-400">Find the issue</div>
                </motion.button>
              </div>
            </div>

            {/* AI Usage Actions */}
            <div className="cyber-border bg-cyber-surface rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-cyber-primary">🤖 AI Usage Patterns</h2>
              <p className="text-sm text-gray-400 mb-4">
                Different AI usage behaviors have different consequences
              </p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={simulatePoorPrompt}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-900/50 rounded border border-red-800 text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">❌ Poor Prompt</div>
                  <div className="text-xs text-red-400">Vague, no context</div>
                </motion.button>

                <motion.button
                  onClick={simulateGoodPrompt}
                  className="px-4 py-3 bg-green-900/30 hover:bg-green-900/50 rounded border border-green-800 text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">✅ Good Prompt</div>
                  <div className="text-xs text-green-400">Specific, contextual</div>
                </motion.button>

                <motion.button
                  onClick={simulateBlindCopyPaste}
                  className="px-4 py-3 bg-yellow-900/30 hover:bg-yellow-900/50 rounded border border-yellow-800 text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">⚠️ Blind Copy-Paste</div>
                  <div className="text-xs text-yellow-400">No review</div>
                </motion.button>

                <motion.button
                  onClick={simulateRefactoring}
                  className="px-4 py-3 bg-purple-900/30 hover:bg-purple-900/50 rounded border border-purple-800 text-left text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-semibold mb-1">🔧 Refactor Code</div>
                  <div className="text-xs text-purple-400">Improve quality</div>
                </motion.button>
              </div>
            </div>

            {/* Utility Actions */}
            <div className="cyber-border bg-cyber-surface rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-cyber-primary">⚙️ Utilities</h2>
              <div className="flex gap-3">
                <motion.button
                  onClick={takeCoffeeBreak}
                  className="px-4 py-2 bg-amber-900/30 hover:bg-amber-900/50 rounded border border-amber-800 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ☕ Coffee Break
                </motion.button>

                <motion.button
                  onClick={resetDemo}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🔄 Reset Demo
                </motion.button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-1">
            <div className="cyber-border bg-cyber-surface rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-cyber-primary">📋 Activity Log</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
                {log.slice().reverse().map((entry, i) => (
                  <div
                    key={i}
                    className="text-xs bg-cyber-bg p-2 rounded border border-cyber-border text-gray-300"
                  >
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stat Explanation */}
        <div className="mt-8 cyber-border bg-cyber-surface rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-cyber-primary">📊 New Stats Explained</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-yellow-400 mb-1">⚠️ Tech Debt</div>
              <p className="text-gray-400">
                Accumulates from shortcuts, skipped tests, and unverified AI code. 
                High debt triggers refactor scenarios and blocks deployment.
              </p>
            </div>
            <div>
              <div className="font-semibold text-cyan-400 mb-1">🤖 AI Trust</div>
              <p className="text-gray-400">
                Reflects AI reliability based on your verification habits. 
                Low trust means more AI hallucinations and bugs.
              </p>
            </div>
            <div>
              <div className="font-semibold text-purple-400 mb-1">💎 Code Quality</div>
              <p className="text-gray-400">
                Improved by testing, refactoring, and code reviews. 
                High quality enables faster deployment and fewer bugs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DecisionModal
        decision={currentDecision}
        isOpen={currentDecision !== null}
        onSelect={handleDecisionSelect}
      />

      <VerificationModal
        challenge={currentVerification}
        isOpen={currentVerification !== null}
        onComplete={handleVerificationComplete}
        onSkip={handleVerificationSkip}
      />
    </div>
  );
}
