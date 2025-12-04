import { motion } from 'framer-motion';
import { Lightbulb, Code, MessageSquare, Zap, BookOpen } from 'lucide-react';
import { AI_TOOLS } from '../types/aiTools';
import { MicroStep } from '../types/enhanced';

interface AIToolGuideProps {
  step: MicroStep | null;
}

export function AIToolGuide({ step }: AIToolGuideProps) {
  if (!step) {
    return (
      <div className="p-4 text-center text-gray-400">
        <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a step to see which AI tool to use</p>
        <p className="text-xs mt-2 text-gray-500">Click "Start Step" on any step to begin</p>
      </div>
    );
  }

  if (!step.aiTool) {
    return (
      <div className="p-4 text-center text-gray-400">
        <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-semibold mb-2">{step.title}</p>
        <p className="text-xs text-gray-500 mb-4">{step.description}</p>
        <div className="cyber-border bg-cyber-surface p-3 rounded text-left">
          <p className="text-xs text-cyber-primary mb-2">💡 Tip:</p>
          <p className="text-xs text-gray-300">
            This step doesn't require an AI tool. Follow the instructions in the step description to complete it manually.
          </p>
        </div>
      </div>
    );
  }

  const toolInfo = AI_TOOLS[step.aiTool as keyof typeof AI_TOOLS];

  if (!toolInfo) {
    return (
      <div className="p-4 text-center text-gray-400">
        <p className="text-sm font-semibold mb-2">{step.title}</p>
        <p className="text-xs text-gray-500 mb-2">AI Tool: {step.aiTool}</p>
        <p className="text-xs text-red-400">Tool information not found. Available tools: {Object.keys(AI_TOOLS).join(', ')}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Tool Header */}
        <div className="cyber-border bg-cyber-surface p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{toolInfo.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-cyber-primary">{toolInfo.name}</h3>
              <p className="text-sm text-gray-400">{toolInfo.description}</p>
            </div>
          </div>
          <div className="mt-3 p-2 bg-cyber-bg rounded">
            <p className="text-xs text-gray-400 mb-1">Use Case:</p>
            <p className="text-sm text-cyber-primary">{toolInfo.useCase}</p>
          </div>
        </div>

        {/* Current Step Context */}
        <div className="cyber-border bg-cyber-surface p-4 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyber-warning" />
            Current Step: {step.title}
          </h4>
          <p className="text-sm text-gray-300">{step.description}</p>
        </div>

        {/* How to Use */}
        <div className="cyber-border bg-cyber-surface p-4 rounded-lg">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyber-primary" />
            Step-by-Step: How to Use {toolInfo.name}
          </h4>
          <ol className="space-y-3">
            {step.toolInstructions && step.toolInstructions.length > 0 ? (
              step.toolInstructions.map((instruction, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 text-sm p-2 bg-cyber-bg rounded"
                >
                  <span className="text-cyber-primary font-bold text-lg flex-shrink-0 w-6 h-6 rounded-full bg-cyber-primary/20 flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-gray-300 flex-1">{instruction}</span>
                </motion.li>
              ))
            ) : (
              toolInfo.howToUse.map((instruction, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 text-sm p-2 bg-cyber-bg rounded"
                >
                  <span className="text-cyber-primary font-bold text-lg flex-shrink-0 w-6 h-6 rounded-full bg-cyber-primary/20 flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-gray-300 flex-1">{instruction}</span>
                </motion.li>
              ))
            )}
          </ol>
        </div>

        {/* Example Prompts */}
        <div className="cyber-border bg-cyber-surface p-4 rounded-lg">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyber-primary" />
            Example Prompts for This Step
          </h4>
          <div className="space-y-2">
            {step.examplePrompts && step.examplePrompts.length > 0 ? (
              step.examplePrompts.map((prompt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 bg-cyber-bg rounded border-l-2 border-cyber-primary"
                >
                  <p className="text-sm text-gray-300 font-mono">{prompt}</p>
                </motion.div>
              ))
            ) : (
              toolInfo.examplePrompts.slice(0, 3).map((prompt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 bg-cyber-bg rounded border-l-2 border-cyber-primary"
                >
                  <p className="text-sm text-gray-300 font-mono">{prompt}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Prompt Template */}
        {step.promptTemplate && (
          <div className="cyber-border bg-cyber-surface p-4 rounded-lg">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-cyber-primary" />
              Prompt Template
            </h4>
            <div className="p-3 bg-cyber-bg rounded">
              <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                {step.promptTemplate}
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="cyber-border bg-cyber-surface p-4 rounded-lg">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-cyber-warning" />
            Pro Tips
          </h4>
          <ul className="space-y-2">
            {step.toolTips && step.toolTips.length > 0 ? (
              step.toolTips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-cyber-warning">💡</span>
                  <span className="text-gray-300">{tip}</span>
                </li>
              ))
            ) : (
              toolInfo.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-cyber-warning">💡</span>
                  <span className="text-gray-300">{tip}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Best For */}
        <div className="cyber-border bg-cyber-surface p-4 rounded-lg">
          <h4 className="font-bold mb-3">Best For</h4>
          <div className="flex flex-wrap gap-2">
            {toolInfo.bestFor.map((use, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-cyber-primary/20 text-cyber-primary rounded text-xs"
              >
                {use}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

