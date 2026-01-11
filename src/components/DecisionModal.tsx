import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Coffee, 
  Brain, 
  Zap,
  Bot,
  Code2,
  Star
} from 'lucide-react';
import { DecisionPoint, DecisionOption, Consequences } from '../types/enhancedGameTypes';

interface DecisionModalProps {
  decision: DecisionPoint | null;
  isOpen: boolean;
  onSelect: (optionId: string) => void;
  onClose?: () => void; // Optional for non-blocking decisions
}

export function DecisionModal({ decision, isOpen, onSelect, onClose }: DecisionModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);
  const [confirmedOption, setConfirmedOption] = useState<DecisionOption | null>(null);

  // Timer logic
  useEffect(() => {
    if (!decision?.timeLimit || !isOpen) {
      setTimeRemaining(null);
      return;
    }

    setTimeRemaining(decision.timeLimit);
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          // Auto-select first option on timeout
          if (!selectedOption) {
            handleConfirm(decision.options[0].id);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [decision, isOpen]);

  // Reset state when decision changes
  useEffect(() => {
    setSelectedOption(null);
    setShowReasoning(false);
    setConfirmedOption(null);
  }, [decision?.id]);

  if (!decision) return null;

  const handleConfirm = (optionId: string) => {
    const option = decision.options.find(o => o.id === optionId);
    if (!option) return;

    setConfirmedOption(option);
    setShowReasoning(true);

    // Wait for reasoning reveal, then close
    setTimeout(() => {
      onSelect(optionId);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderConsequences = (consequences: Consequences) => {
    const items: { icon: React.ReactNode; text: string; color: string }[] = [];

    if (consequences.sanityChange) {
      items.push({
        icon: <Brain className="w-3 h-3" />,
        text: `${consequences.sanityChange > 0 ? '+' : ''}${consequences.sanityChange}`,
        color: consequences.sanityChange > 0 ? 'text-green-400' : 'text-red-400',
      });
    }
    if (consequences.coffeeChange) {
      items.push({
        icon: <Coffee className="w-3 h-3" />,
        text: `${consequences.coffeeChange > 0 ? '+' : ''}${consequences.coffeeChange}`,
        color: consequences.coffeeChange > 0 ? 'text-green-400' : 'text-amber-400',
      });
    }
    if (consequences.xpChange) {
      items.push({
        icon: <Zap className="w-3 h-3" />,
        text: `+${consequences.xpChange} XP`,
        color: 'text-cyan-400',
      });
    }
    if (consequences.techDebtChange) {
      items.push({
        icon: <AlertTriangle className="w-3 h-3" />,
        text: `${consequences.techDebtChange > 0 ? '+' : ''}${consequences.techDebtChange} Debt`,
        color: consequences.techDebtChange > 0 ? 'text-red-400' : 'text-green-400',
      });
    }
    if (consequences.aiTrustChange) {
      items.push({
        icon: <Bot className="w-3 h-3" />,
        text: `${consequences.aiTrustChange > 0 ? '+' : ''}${consequences.aiTrustChange} Trust`,
        color: consequences.aiTrustChange > 0 ? 'text-cyan-400' : 'text-red-400',
      });
    }
    if (consequences.codeQualityChange) {
      items.push({
        icon: <Code2 className="w-3 h-3" />,
        text: `${consequences.codeQualityChange > 0 ? '+' : ''}${consequences.codeQualityChange} Quality`,
        color: consequences.codeQualityChange > 0 ? 'text-purple-400' : 'text-red-400',
      });
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, i) => (
          <span key={i} className={`flex items-center gap-1 text-xs ${item.color}`}>
            {item.icon}
            {item.text}
          </span>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="cyber-border bg-cyber-surface rounded-lg p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto scrollbar-thin"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-cyber-primary">{decision.title}</h2>
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  {decision.category.replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {timeRemaining !== null && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                    timeRemaining < 30 ? 'bg-red-900/50 text-red-400' : 'bg-cyber-bg text-gray-300'
                  }`}>
                    <Clock className={`w-4 h-4 ${timeRemaining < 30 ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-mono">{formatTime(timeRemaining)}</span>
                  </div>
                )}
                {onClose && !showReasoning && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Scenario Description */}
            <div className="bg-cyber-bg rounded-lg p-4 mb-6 border border-cyber-border">
              <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                {decision.scenario}
              </p>
            </div>

            {/* Options */}
            {!showReasoning ? (
              <div className="space-y-3 mb-6">
                {decision.options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full p-4 rounded-lg cyber-border text-left transition-all ${
                      selectedOption === option.id
                        ? 'bg-cyber-primary/20 border-cyber-primary cyber-glow'
                        : 'bg-cyber-bg border-cyber-border hover:border-cyber-primary/50'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedOption === option.id
                            ? 'border-cyber-primary bg-cyber-primary'
                            : 'border-gray-500'
                        }`}
                      >
                        {selectedOption === option.id && (
                          <CheckCircle2 className="w-3 h-3 text-black" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{option.label}</span>
                          {option.isOptimal && (
                            <span className="flex items-center gap-1 text-xs text-cyber-success bg-cyber-success/20 px-1.5 py-0.5 rounded">
                              <Star className="w-3 h-3" />
                              Optimal
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{option.description}</p>
                        {renderConsequences(option.consequences)}
                        {option.skillDemonstrated && (
                          <div className="mt-2 text-xs text-purple-400">
                            🎯 Demonstrates: {option.skillDemonstrated.replace('-', ' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              // Reasoning Reveal
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className={`p-4 rounded-lg border ${
                  confirmedOption?.isOptimal 
                    ? 'bg-green-900/30 border-green-500' 
                    : 'bg-yellow-900/30 border-yellow-500'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {confirmedOption?.isOptimal ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className={`font-semibold ${
                      confirmedOption?.isOptimal ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {confirmedOption?.isOptimal ? 'Good Decision!' : 'Learning Opportunity'}
                    </span>
                  </div>
                  <p className="text-gray-200 whitespace-pre-line">
                    {confirmedOption?.reasoning}
                  </p>
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-400">
                  Applying consequences...
                </div>
              </motion.div>
            )}

            {/* Confirm Button */}
            {!showReasoning && (
              <motion.button
                onClick={() => selectedOption && handleConfirm(selectedOption)}
                disabled={!selectedOption}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  selectedOption
                    ? 'bg-cyber-primary text-black hover:bg-cyber-primary/90'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={selectedOption ? { scale: 1.02 } : {}}
                whileTap={selectedOption ? { scale: 0.98 } : {}}
              >
                Confirm Decision
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Smaller inline decision for less critical choices
export function InlineDecision({ 
  decision, 
  onSelect 
}: { 
  decision: DecisionPoint; 
  onSelect: (optionId: string) => void;
}) {
  return (
    <div className="cyber-border bg-cyber-surface rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-cyber-warning" />
        <span className="font-semibold text-sm">{decision.title}</span>
      </div>
      <p className="text-xs text-gray-400 mb-3">{decision.scenario}</p>
      <div className="flex flex-wrap gap-2">
        {decision.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="px-3 py-1.5 text-xs bg-cyber-bg hover:bg-cyber-primary/20 rounded cyber-border transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
