import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Code2, 
  HelpCircle,
  Zap,
  Bot
} from 'lucide-react';
import { 
  VerificationChallenge, 
  VerificationResult, 
  VerificationMode 
} from '../types/enhancedGameTypes';

interface VerificationModalProps {
  challenge: VerificationChallenge | null;
  isOpen: boolean;
  onComplete: (result: VerificationResult) => void;
  onSkip?: () => void; // Optional skip (costs sanity)
}

export function VerificationModal({ 
  challenge, 
  isOpen, 
  onComplete,
  onSkip 
}: VerificationModalProps) {
  const [userInput, setUserInput] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && challenge) {
      setStartTime(Date.now());
      setUserInput('');
      setSelectedAnswer(null);
      setShowHint(false);
      setResult(null);
    }
  }, [isOpen, challenge?.id]);

  if (!challenge) return null;

  const handleSubmit = () => {
    const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
    const analysisResult = analyzeResponse(challenge, userInput, selectedAnswer);
    
    // Check for time bonus
    if (challenge.timeBonus && elapsed <= challenge.timeBonus.seconds) {
      analysisResult.feedback.push(`⚡ Time bonus! Completed in ${Math.round(elapsed)}s`);
    }

    setResult(analysisResult);

    // Delay completion to show result
    setTimeout(() => {
      onComplete(analysisResult);
    }, 3000);
  };

  const analyzeResponse = (
    challenge: VerificationChallenge, 
    textInput: string,
    multipleChoice: string | null
  ): VerificationResult => {
    const feedback: string[] = [];
    let score = 0;
    const conceptsMatched: string[] = [];
    const conceptsMissed: string[] = [];

    switch (challenge.mode) {
      case 'explain-code': {
        if (!challenge.requiredConcepts) break;
        
        const inputLower = textInput.toLowerCase();
        
        for (const concept of challenge.requiredConcepts) {
          // Check for concept or related words
          const conceptWords = concept.toLowerCase().split(' ');
          const hasConceptWord = conceptWords.some(word => 
            inputLower.includes(word) || 
            inputLower.includes(word.replace('-', ' '))
          );
          
          if (hasConceptWord) {
            conceptsMatched.push(concept);
            score += 100 / challenge.requiredConcepts.length;
          } else {
            conceptsMissed.push(concept);
          }
        }

        if (textInput.length < 30) {
          feedback.push('Your explanation is too short. Try to be more detailed.');
          score = Math.min(score, 50);
        }

        if (conceptsMatched.length === challenge.requiredConcepts.length) {
          feedback.push('✅ Excellent! You covered all key concepts.');
        } else if (conceptsMatched.length > 0) {
          feedback.push(`Good start! You mentioned ${conceptsMatched.length}/${challenge.requiredConcepts.length} concepts.`);
        }
        break;
      }

      case 'predict-output': {
        if (multipleChoice === challenge.expectedOutput) {
          score = 100;
          feedback.push('✅ Correct! You understood the code behavior.');
        } else {
          score = 0;
          feedback.push(`❌ Incorrect. The correct answer was: ${challenge.expectedOutput}`);
          feedback.push('Review the code carefully - trace through each line.');
        }
        break;
      }

      case 'spot-the-bug': {
        const inputLower = textInput.toLowerCase();
        const bugDescription = challenge.bugLocation?.description.toLowerCase() || '';
        
        // Check if they identified the bug area
        const bugKeywords = bugDescription.split(' ').filter(w => w.length > 3);
        const matchedKeywords = bugKeywords.filter(kw => inputLower.includes(kw));
        
        if (matchedKeywords.length >= bugKeywords.length * 0.5) {
          score = 100;
          feedback.push('✅ Great catch! You identified the bug correctly.');
        } else if (matchedKeywords.length > 0) {
          score = 50;
          feedback.push('You\'re on the right track, but missed some details.');
        } else {
          score = 20;
          feedback.push(`The bug was: ${challenge.bugLocation?.description}`);
        }
        break;
      }

      case 'refactor-challenge': {
        // Check for refactoring goals
        if (challenge.refactorGoals) {
          for (const goal of challenge.refactorGoals) {
            const goalKeywords = goal.toLowerCase().split(' ').filter(w => w.length > 3);
            const hasGoalIndicators = goalKeywords.some(kw => 
              textInput.toLowerCase().includes(kw)
            );
            
            if (hasGoalIndicators) {
              conceptsMatched.push(goal);
              score += 100 / challenge.refactorGoals.length;
            } else {
              conceptsMissed.push(goal);
            }
          }
        }
        
        if (score >= 75) {
          feedback.push('✅ Great refactoring! You addressed the key issues.');
        } else if (score >= 50) {
          feedback.push('Good effort, but there\'s room for improvement.');
        }
        break;
      }
    }

    const passed = score >= 60;

    return {
      passed,
      score: Math.round(score),
      feedback,
      conceptsMatched,
      conceptsMissed,
      bonusAwarded: passed ? (showHint ? undefined : 'No hints used') : undefined,
    };
  };

  const handleShowHint = () => {
    setShowHint(true);
  };

  const renderModeContent = () => {
    switch (challenge.mode) {
      case 'explain-code':
        return (
          <>
            {/* Code Display */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-200 whitespace-pre-wrap">
                {challenge.codeToExplain}
              </pre>
            </div>

            {/* Explanation Input */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Your explanation:
              </label>
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Explain what this code does and why..."
                className="w-full h-32 bg-cyber-bg text-gray-200 rounded-lg p-3 border border-cyber-border focus:border-cyber-primary focus:outline-none resize-none"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>{userInput.length} characters</span>
                <span>Aim for 50+ characters with key concepts</span>
              </div>
            </div>

            {/* Concept Hints */}
            {showHint && challenge.requiredConcepts && (
              <div className="bg-cyber-bg rounded-lg p-3 mb-4 border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">Hint: Try to mention these concepts</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {challenge.requiredConcepts.map((concept, i) => (
                    <span key={i} className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case 'predict-output':
        return (
          <>
            {/* Code Display */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-200 whitespace-pre-wrap">
                {challenge.codeToRun}
              </pre>
            </div>

            {/* Multiple Choice */}
            <div className="space-y-2 mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                What will be logged to the console?
              </label>
              {challenge.outputOptions?.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full p-3 rounded-lg text-left font-mono transition-all ${
                    selectedAnswer === option
                      ? 'bg-cyber-primary/20 border-cyber-primary cyber-border'
                      : 'bg-cyber-bg cyber-border hover:border-cyber-primary/50'
                  }`}
                >
                  <span className="text-gray-300">{option}</span>
                </button>
              ))}
            </div>
          </>
        );

      case 'spot-the-bug':
        return (
          <>
            {/* Buggy Code Display */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-200">
                {challenge.buggyCode?.split('\n').map((line, i) => (
                  <div 
                    key={i} 
                    className={`${
                      challenge.bugLocation?.line === i + 1 
                        ? 'bg-red-900/30 border-l-2 border-red-500 pl-2 -ml-2' 
                        : ''
                    }`}
                  >
                    <span className="text-gray-500 mr-3 select-none">{i + 1}</span>
                    {line}
                  </div>
                ))}
              </pre>
            </div>

            {/* Bug Description Input */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Describe the bug you found:
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="What's wrong with this code?"
                className="w-full h-24 bg-cyber-bg text-gray-200 rounded-lg p-3 border border-cyber-border focus:border-cyber-primary focus:outline-none resize-none"
              />
            </div>

            {showHint && (
              <div className="bg-cyber-bg rounded-lg p-3 mb-4 border border-yellow-500/30">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">
                    Hint: Look at line {challenge.bugLocation?.line}
                  </span>
                </div>
              </div>
            )}
          </>
        );

      case 'refactor-challenge':
        return (
          <>
            {/* Messy Code Display */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
              <pre className="text-gray-200 whitespace-pre-wrap">
                {challenge.messyCode}
              </pre>
            </div>

            {/* Refactoring Goals */}
            <div className="bg-cyber-bg rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-400 mb-2">Refactoring goals:</div>
              <ul className="space-y-1">
                {challenge.refactorGoals?.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-cyber-primary">•</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Refactored Code Input */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Your refactored code:
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Write your improved version..."
                className="w-full h-48 bg-gray-900 text-gray-200 rounded-lg p-3 border border-cyber-border focus:border-cyber-primary focus:outline-none resize-none font-mono text-sm"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getModeIcon = (mode: VerificationMode) => {
    switch (mode) {
      case 'explain-code': return <Code2 className="w-5 h-5" />;
      case 'predict-output': return <Zap className="w-5 h-5" />;
      case 'spot-the-bug': return <Bot className="w-5 h-5" />;
      case 'refactor-challenge': return <Code2 className="w-5 h-5" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  const canSubmit = () => {
    switch (challenge.mode) {
      case 'explain-code':
      case 'spot-the-bug':
      case 'refactor-challenge':
        return userInput.length >= 10;
      case 'predict-output':
        return selectedAnswer !== null;
      default:
        return false;
    }
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
            className="cyber-border bg-cyber-surface rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyber-primary/20 rounded-lg text-cyber-primary">
                  {getModeIcon(challenge.mode)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-cyber-primary">{challenge.title}</h2>
                  <p className="text-sm text-gray-400">{challenge.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyber-primary" />
                <span className="text-sm text-cyber-primary">{challenge.xpReward} XP</span>
                <Bot className="w-4 h-4 text-cyan-400 ml-2" />
                <span className="text-sm text-cyan-400">+{challenge.aiTrustBonus}</span>
              </div>
            </div>

            {/* Content */}
            {!result ? (
              <>
                {renderModeContent()}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!showHint && challenge.requiredConcepts && (
                      <button
                        onClick={handleShowHint}
                        className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300"
                      >
                        <Lightbulb className="w-4 h-4" />
                        Show Hint
                      </button>
                    )}
                    {onSkip && (
                      <button
                        onClick={onSkip}
                        className="text-sm text-gray-500 hover:text-gray-400"
                      >
                        Skip (costs sanity)
                      </button>
                    )}
                  </div>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={!canSubmit()}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      canSubmit()
                        ? 'bg-cyber-primary text-black hover:bg-cyber-primary/90'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    whileHover={canSubmit() ? { scale: 1.02 } : {}}
                    whileTap={canSubmit() ? { scale: 0.98 } : {}}
                  >
                    Submit Answer
                  </motion.button>
                </div>
              </>
            ) : (
              /* Result Display */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`p-4 rounded-lg border ${
                  result.passed 
                    ? 'bg-green-900/30 border-green-500' 
                    : 'bg-red-900/30 border-red-500'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {result.passed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    <span className={`text-lg font-bold ${
                      result.passed ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {result.passed ? 'Verification Passed!' : 'Needs Improvement'}
                    </span>
                    <span className="ml-auto text-sm text-gray-400">
                      Score: {result.score}/100
                    </span>
                  </div>

                  <div className="space-y-2">
                    {result.feedback.map((fb, i) => (
                      <p key={i} className="text-sm text-gray-300">{fb}</p>
                    ))}
                  </div>

                  {result.conceptsMatched.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {result.conceptsMatched.map((c, i) => (
                        <span key={i} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                          ✓ {c}
                        </span>
                      ))}
                      {result.conceptsMissed.map((c, i) => (
                        <span key={i} className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                          ✗ {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {result.bonusAwarded && (
                    <div className="mt-3 text-sm text-yellow-400">
                      ⭐ Bonus: {result.bonusAwarded}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
