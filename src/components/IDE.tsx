import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Terminal, MessageSquare, Send } from 'lucide-react';
import { Task } from '../types';

interface IDEProps {
  task: Task | null;
  onVibeCheck: (prompt: string) => void;
}

export function IDE({ onVibeCheck }: IDEProps) {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; message: string }>>([]);
  const [files, setFiles] = useState([
    { name: 'App.tsx', content: '// Your app code here', open: true },
    { name: 'index.css', content: '/* Styles */', open: false },
  ]);

  const handleSend = () => {
    if (!prompt.trim()) return;

    setChatHistory([...chatHistory, { role: 'user', message: prompt }]);
    onVibeCheck(prompt);
    setPrompt('');
  };

  return (
    <div className="h-full flex flex-col cyber-border bg-cyber-surface">
      {/* Top Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-cyber-border">
        <FileCode className="w-4 h-4 text-cyber-primary" />
        <span className="text-sm font-semibold">IDE</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-48 border-r border-cyber-border bg-cyber-bg p-2 overflow-y-auto scrollbar-thin">
          <div className="text-xs text-gray-400 mb-2">Files</div>
          {files.map((file) => (
            <div
              key={file.name}
              className={`p-2 rounded text-xs cursor-pointer mb-1 ${
                file.open ? 'bg-cyber-primary/20 text-cyber-primary' : 'hover:bg-cyber-surface'
              }`}
              onClick={() =>
                setFiles(files.map((f) => (f.name === file.name ? { ...f, open: !f.open } : f)))
              }
            >
              {file.name}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
            {files
              .find((f) => f.open)
              ?.content.split('\n')
              .map((line, i) => (
                <div key={i} className="flex">
                  <span className="text-gray-500 w-8 text-right mr-2 text-xs">{i + 1}</span>
                  <code className="text-sm text-gray-300">{line}</code>
                </div>
              ))}
          </div>

          {/* Terminal */}
          <div className="h-32 border-t border-cyber-border bg-black/50 p-2 overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-cyber-success" />
              <span className="text-xs text-gray-400">Terminal</span>
            </div>
            <div className="text-xs font-mono text-green-400">
              $ npm run dev
              <br />
              <span className="text-gray-500">Server running on http://localhost:5173</span>
            </div>
          </div>
        </div>

        {/* AI Chat */}
        <div className="w-80 border-l border-cyber-border flex flex-col">
          <div className="p-2 border-b border-cyber-border flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyber-primary" />
            <span className="text-sm font-semibold">AI Assistant</span>
          </div>
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-2">
            {chatHistory.length === 0 && (
              <div className="text-xs text-gray-400 text-center mt-4">
                Start a conversation with your AI assistant...
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-2 rounded text-xs ${
                  msg.role === 'user'
                    ? 'bg-cyber-primary/20 ml-auto max-w-[80%]'
                    : 'bg-cyber-surface mr-auto max-w-[80%]'
                }`}
              >
                {msg.message}
              </motion.div>
            ))}
          </div>
          <div className="p-2 border-t border-cyber-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your prompt..."
                className="flex-1 bg-cyber-bg border border-cyber-border rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary"
              />
              <button
                onClick={handleSend}
                className="p-1 bg-cyber-primary text-black rounded hover:bg-cyber-primary/80"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

