// Enhanced App component with step-by-step learning system
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { useAuthStore } from './store/authStore';
import { useEnhancedGameEngine } from './hooks/useEnhancedGameEngine';
import { useEnhancedFeatures } from './hooks/useEnhancedFeatures';
import { EnhancedHUD } from './components/EnhancedHUD';
import { ClassSelector } from './components/ClassSelector';
import { EnhancedIDE } from './components/EnhancedIDE';
import { StepByStepView } from './components/StepByStepView';
import { BrowserPreview } from './components/BrowserPreview';
import { TutorialOverlay } from './components/TutorialOverlay';
import { AIToolGuide } from './components/AIToolGuide';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { UserProfile } from './components/UserProfile';
import { DecisionModal } from './components/DecisionModal';
import { VerificationModal } from './components/VerificationModal';

type AuthView = 'login' | 'register';
type View = 'auth' | 'setup' | 'game';
type GameView = 'steps' | 'ide';

function App() {
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const { playerClass, platform, stack, resources, completedTasks } = useGameStore();
  const { currentStep, getCurrentCurriculum, fileSystem } = useEnhancedGameEngine();
  
  // Pass current step to get context-aware challenges
  const {
    currentDecision,
    currentVerification,
    availableDecisionTypes,
    availableVerificationTypes,
    handleDecisionSelect,
    handleVerificationComplete,
    handleVerificationSkip,
    triggerDecision,
    triggerVerification,
    triggerStepDecision,
    triggerStepVerification,
  } = useEnhancedFeatures({ currentStep });

  const [authView, setAuthView] = useState<AuthView>('login');
  const [view, setView] = useState<View>('auth');
  const [gameView, setGameView] = useState<GameView>('steps');
  const [tutorialMessage, setTutorialMessage] = useState<string | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  // Sync user stats with game progress - only update if values actually changed
  useEffect(() => {
    if (user && isAuthenticated) {
      const newStats = {
        totalXp: resources.xp,
        level: resources.level,
        completedSteps: completedTasks.length,
        currentClass: playerClass || undefined,
        currentPlatform: platform || undefined,
        currentStack: stack || undefined,
      };
      
      // Only update if stats actually changed
      const statsChanged = 
        user.stats.totalXp !== newStats.totalXp ||
        user.stats.level !== newStats.level ||
        user.stats.completedSteps !== newStats.completedSteps ||
        user.stats.currentClass !== newStats.currentClass ||
        user.stats.currentPlatform !== newStats.currentPlatform ||
        user.stats.currentStack !== newStats.currentStack;
      
      if (statsChanged) {
        updateUser({ stats: newStats });
      }
    }
  }, [user, isAuthenticated, resources.xp, resources.level, completedTasks.length, playerClass, platform, stack]);

  // Redirect based on auth state - this is the main routing logic
  useEffect(() => {
    if (isAuthenticated) {
      if (view === 'auth') {
        setView('setup');
      }
    } else {
      if (view !== 'auth') {
        setView('auth');
      }
    }
  }, [isAuthenticated]); // Only depend on isAuthenticated

  // Get the step to display in AI Tool Guide (currentStep or selectedStep or first available)
  const curriculum = getCurrentCurriculum();
  const displayStep = currentStep || 
    (selectedStepId ? curriculum.find(s => s.id === selectedStepId) : null) || 
    (curriculum.length > 0 ? curriculum[0] : null);

  const handleStartGame = () => {
    if (playerClass && platform && stack) {
      setView('game');
      setTutorialMessage(
        'Welcome to VibeQuest Enhanced! Follow the step-by-step guide to build your application from zero to deploy. Each step will teach you important concepts and best practices.'
      );
    }
  };

  const isSetupComplete = playerClass && platform && stack;

  // Get preview content from generated code
  const getPreviewContent = (): string | undefined => {
    if (!fileSystem?.files) return undefined;
    
    // Find App.tsx or main component file
    const findFileContent = (nodes: any[]): string | null => {
      for (const node of nodes) {
        if (node.type === 'file' && (node.path.includes('App.tsx') || node.path.includes('App.jsx') || node.path.includes('main.dart'))) {
          return node.content || null;
        }
        if (node.children) {
          const found = findFileContent(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const appContent = findFileContent(fileSystem.files);
    if (!appContent) return undefined;
    
    // Count generated files
    const countFiles = (nodes: any[]): number => {
      let count = 0;
      for (const node of nodes) {
        if (node.type === 'file') count++;
        if (node.children) count += countFiles(node.children);
      }
      return count;
    };
    
    const fileCount = countFiles(fileSystem.files);
    
    // For now, return a simple HTML representation
    // In a real implementation, this would compile and render the React/Flutter code
    return `
      <div style="padding: 20px; font-family: system-ui; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00d9ff; margin-bottom: 20px; text-align: center;">My Todo App</h1>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #666; margin: 0;">Your app preview will update as you build components.</p>
          <p style="color: #888; font-size: 12px; margin-top: 10px;">Generated files: ${fileCount}</p>
        </div>
        <div style="text-align: center; color: #999; font-size: 14px;">
          <p>Start building components to see them appear here!</p>
        </div>
      </div>
    `;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-cyber-bg relative">
      {isAuthenticated && <EnhancedHUD resources={resources} />}

      <AnimatePresence mode="wait">
        {view === 'auth' ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex items-center justify-center p-8"
          >
            {authView === 'login' ? (
              <LoginForm
                onSwitchToRegister={() => setAuthView('register')}
                onLoginSuccess={() => {}}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => setAuthView('login')}
                onRegisterSuccess={() => {}}
              />
            )}
          </motion.div>
        ) : view === 'setup' ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full overflow-auto"
            style={{ paddingTop: isAuthenticated ? '80px' : '0' }}
          >
            <div className="h-full w-full flex">
              <div className="flex-1 flex items-center justify-center p-8">
                <ClassSelector />
              </div>
              {user && (
                <div className="w-80 flex-shrink-0 p-4 border-l border-cyber-border">
                  <UserProfile />
                </div>
              )}
            </div>
            {isSetupComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
              >
                <motion.button
                  onClick={handleStartGame}
                  className="px-8 py-4 bg-gradient-to-r from-cyber-primary to-cyber-secondary text-black font-bold rounded-lg cyber-glow-strong"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Enhanced Quest
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full pt-20 flex flex-col"
          >
            {/* View Toggle */}
            <div className="flex items-center justify-between gap-2 p-2 border-b border-cyber-border">
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setGameView('steps')}
                  className={`px-4 py-2 rounded text-sm font-semibold ${
                    gameView === 'steps'
                      ? 'bg-cyber-primary text-black'
                      : 'bg-cyber-surface text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learning Path
                </motion.button>
                <motion.button
                  onClick={() => setGameView('ide')}
                  className={`px-4 py-2 rounded text-sm font-semibold ${
                    gameView === 'ide'
                      ? 'bg-cyber-primary text-black'
                      : 'bg-cyber-surface text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  IDE & Code
                </motion.button>
              </div>
              
              {/* Test Buttons - Step-specific and generic options */}
              <div className="flex items-center gap-2">
                {/* Primary: Step-specific challenges */}
                <button
                  onClick={triggerStepDecision}
                  className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
                  title={currentStep ? `Decision for: ${currentStep.title}` : 'Select a step first'}
                >
                  🎯 Step Decision
                </button>
                <button
                  onClick={triggerStepVerification}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                  title={currentStep ? `Verification for: ${currentStep.title}` : 'Select a step first'}
                >
                  ✓ Step Verification
                </button>
                
                {/* Divider */}
                <span className="text-gray-500">|</span>
                
                {/* Secondary: Generic type-based */}
                <select
                  onChange={(e) => e.target.value && triggerDecision(e.target.value as any)}
                  className="px-2 py-1 text-xs bg-purple-900/50 text-purple-300 rounded cursor-pointer border border-purple-700"
                  defaultValue=""
                >
                  <option value="" disabled>More...</option>
                  {availableDecisionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  onChange={(e) => e.target.value && triggerVerification(e.target.value as any)}
                  className="px-2 py-1 text-xs bg-blue-900/50 text-blue-300 rounded cursor-pointer border border-blue-700"
                  defaultValue=""
                >
                  <option value="" disabled>More...</option>
                  {availableVerificationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                
                {/* Current step indicator */}
                <span className="text-xs text-gray-400 max-w-[200px] truncate" title={currentStep?.title}>
                  {currentStep ? `📍 ${currentStep.title}` : '(no step selected)'}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
              {/* Left Side: Steps or IDE */}
              <div className="flex flex-col gap-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  {gameView === 'steps' ? (
                    <motion.div
                      key="steps"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex-1 overflow-hidden"
                    >
                      <StepByStepView 
                        onStepSelect={(stepId) => setSelectedStepId(stepId)}
                        onTriggerDecision={triggerDecision}
                        onTriggerVerification={triggerVerification}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ide"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex-1"
                    >
                      <EnhancedIDE
                        onCodeGenerated={(files) => {
                          setTutorialMessage(
                            `Great! I've generated ${files.length} file(s). Check them out in the file tree!`
                          );
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Middle: AI Tool Guide - CORE FOCUS */}
              <div className="flex-1 cyber-border bg-cyber-surface rounded-lg overflow-hidden">
                <div className="p-2 border-b border-cyber-border bg-cyber-primary/10">
                  <h3 className="text-sm font-bold text-cyber-primary">AI Tool Guide</h3>
                </div>
                <AIToolGuide step={displayStep} />
              </div>

              {/* Right Side: Browser Preview */}
              <div className="flex-1">
                <BrowserPreview content={getPreviewContent()} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Overlay */}
      {tutorialMessage && (
        <TutorialOverlay
          message={tutorialMessage}
          onClose={() => setTutorialMessage(null)}
        />
      )}

      {/* Decision Modal */}
      <DecisionModal
        decision={currentDecision}
        isOpen={!!currentDecision}
        onSelect={handleDecisionSelect}
      />

      {/* Verification Modal */}
      <VerificationModal
        challenge={currentVerification}
        isOpen={!!currentVerification}
        onComplete={handleVerificationComplete}
        onSkip={handleVerificationSkip}
      />
    </div>
  );
}

export default App;

