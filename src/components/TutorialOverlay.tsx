import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface TutorialOverlayProps {
  message: string;
  onClose: () => void;
}

export function TutorialOverlay({ message, onClose }: TutorialOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-4 right-4 z-50 max-w-md"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="cyber-border bg-cyber-surface p-4 rounded-lg cyber-glow"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-cyber-warning flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold mb-2 text-cyber-primary">Senior Dev Tip</h3>
                <p className="text-sm text-gray-300">{message}</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

