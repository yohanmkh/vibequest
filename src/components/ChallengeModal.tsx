import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { Task } from '../types';
import { useState } from 'react';

interface ChallengeModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean) => void;
}

export function ChallengeModal({ task, isOpen, onClose, onComplete }: ChallengeModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<boolean | null>(null);

  if (!task || !task.challenge) return null;

  const challenge = task.challenge;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect =
      challenge.type === 'prompt-battle' || challenge.type === 'hallucination-hunter'
        ? selectedAnswer === challenge.correctAnswer
        : false;

    setResult(isCorrect);
    setTimeout(() => {
      onComplete(isCorrect);
      setResult(null);
      setSelectedAnswer(null);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="cyber-border bg-cyber-surface rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-cyber-primary">{task.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">{task.description}</p>

            {/* Prompt Battle */}
            {challenge.type === 'prompt-battle' && challenge.options && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 mb-4">{challenge.prompt}</p>
                {challenge.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full p-4 rounded cyber-border text-left ${
                      selectedAnswer === index
                        ? 'bg-cyber-primary/20 border-cyber-primary'
                        : 'bg-cyber-bg border-cyber-border hover:bg-cyber-surface'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedAnswer === index
                            ? 'border-cyber-primary bg-cyber-primary'
                            : 'border-gray-500'
                        }`}
                      />
                      <span className="text-sm">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Hallucination Hunter */}
            {challenge.type === 'hallucination-hunter' && challenge.options && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 mb-4">
                  AI suggests 3 libraries. 2 are fake. Pick the real one.
                </p>
                {challenge.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full p-4 rounded cyber-border text-left ${
                      selectedAnswer === index
                        ? 'bg-cyber-primary/20 border-cyber-primary'
                        : 'bg-cyber-bg border-cyber-border hover:bg-cyber-surface'
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm font-mono">{option}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Code Review */}
            {challenge.type === 'code-review' && challenge.code && (
              <div className="space-y-4">
                <div className="bg-black/50 p-4 rounded cyber-border">
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    <code>{challenge.code}</code>
                  </pre>
                </div>
                <p className="text-sm text-gray-400">
                  Find the bug in this code. What's wrong with it?
                </p>
                <input
                  type="text"
                  placeholder="Describe the bug..."
                  className="w-full bg-cyber-bg border border-cyber-border rounded px-4 py-2 text-sm focus:outline-none focus:border-cyber-primary"
                />
              </div>
            )}

            {/* Result Display */}
            {result !== null && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-4 p-4 rounded flex items-center gap-3"
                style={{
                  backgroundColor: result ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                }}
              >
                {result ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-cyber-success" />
                    <span className="text-cyber-success font-bold">Correct! Well done!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-cyber-danger" />
                    <span className="text-cyber-danger font-bold">Wrong answer. Try again!</span>
                  </>
                )}
              </motion.div>
            )}

            {/* Submit Button */}
            {result === null && (
              <motion.button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="mt-6 w-full py-3 bg-cyber-primary text-black font-bold rounded hover:bg-cyber-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: selectedAnswer !== null ? 1.02 : 1 }}
                whileTap={{ scale: selectedAnswer !== null ? 0.98 : 1 }}
              >
                Submit Answer
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

