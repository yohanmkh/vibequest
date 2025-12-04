import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface BrowserPreviewProps {
  content?: string;
}

export function BrowserPreview({ content }: BrowserPreviewProps) {
  return (
    <div className="h-full flex flex-col cyber-border bg-cyber-surface">
      <div className="flex items-center gap-2 p-2 border-b border-cyber-border">
        <Globe className="w-4 h-4 text-cyber-primary" />
        <span className="text-sm font-semibold">Preview</span>
        <div className="ml-auto flex gap-1">
          <div className="w-3 h-3 rounded-full bg-cyber-danger"></div>
          <div className="w-3 h-3 rounded-full bg-cyber-warning"></div>
          <div className="w-3 h-3 rounded-full bg-cyber-success"></div>
        </div>
      </div>
      <div className="flex-1 p-8 bg-white overflow-y-auto">
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 mt-20"
          >
            <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Your app preview will appear here</p>
            <p className="text-sm mt-2">Start coding to see the magic happen!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

