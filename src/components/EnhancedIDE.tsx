import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Terminal, MessageSquare, Send, File, Folder, ChevronRight, ChevronDown, X } from 'lucide-react';
import { FileNode } from '../types/enhanced';
import { useEnhancedGameEngine } from '../hooks/useEnhancedGameEngine';

interface EnhancedIDEProps {
  onCodeGenerated?: (files: string[]) => void;
}

export function EnhancedIDE({ onCodeGenerated }: EnhancedIDEProps) {
  const {
    fileSystem,
    currentStep,
    generateCodeFromPrompt,
    updateFileContent,
    openFile,
    closeFile,
    getFileContent,
  } = useEnhancedGameEngine();

  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; message: string; files?: string[] }>>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['$ npm run dev']);

  const selectedFile = fileSystem?.selectedFile || null;
  const openFiles = fileSystem?.openFiles || [];
  const fileTree = fileSystem?.files || [];

  const handleSend = () => {
    if (!prompt.trim() || !currentStep) return;

    // Add user message
    const userMessage = { role: 'user' as const, message: prompt };
    setChatHistory([...chatHistory, userMessage]);

    // Generate code
    const generatedFiles = generateCodeFromPrompt(prompt);
    const filePaths = generatedFiles.map((f) => f.filePath);

    // Add AI response
    const aiMessage = {
      role: 'ai' as const,
      message: `I've generated ${generatedFiles.length} file(s) for you. Check the file tree!`,
      files: filePaths,
    };
    setChatHistory([...chatHistory, userMessage, aiMessage]);

    // Open first generated file
    if (generatedFiles.length > 0) {
      openFile(generatedFiles[0].filePath);
    }

    // Update terminal
    setTerminalOutput([
      ...terminalOutput,
      `✓ Generated ${generatedFiles.length} file(s)`,
      '✓ Files added to project',
    ]);

    // Notify parent
    if (onCodeGenerated) {
      onCodeGenerated(filePaths);
    }

    setPrompt('');
  };

  const handleFileClick = (filePath: string) => {
    openFile(filePath);
  };

  const handleFolderToggle = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (nodes: FileNode[], level = 0): JSX.Element[] => {
    return nodes.map((node) => {
      if (node.type === 'directory') {
        const isExpanded = expandedFolders.has(node.path);
        return (
          <div key={node.path}>
            <div
              className="flex items-center gap-1 p-1 hover:bg-cyber-surface rounded cursor-pointer text-xs"
              style={{ paddingLeft: `${level * 12 + 4}px` }}
              onClick={() => handleFolderToggle(node.path)}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <Folder className="w-3 h-3 text-cyber-warning" />
              <span>{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div>{renderFileTree(node.children, level + 1)}</div>
            )}
          </div>
        );
      } else {
        const isOpen = openFiles.includes(node.path);
        const isSelected = selectedFile === node.path;
        return (
          <div
            key={node.path}
            className={`flex items-center gap-1 p-1 hover:bg-cyber-surface rounded cursor-pointer text-xs ${
              isSelected ? 'bg-cyber-primary/20' : ''
            }`}
            style={{ paddingLeft: `${level * 12 + 20}px` }}
            onClick={() => handleFileClick(node.path)}
          >
            <File className="w-3 h-3 text-cyber-primary" />
            <span className={node.status === 'new' ? 'text-cyber-success' : node.status === 'modified' ? 'text-cyber-warning' : ''}>
              {node.name}
            </span>
            {node.status === 'new' && (
              <span className="ml-auto text-xs text-cyber-success">new</span>
            )}
            {node.status === 'modified' && (
              <span className="ml-auto text-xs text-cyber-warning">M</span>
            )}
          </div>
        );
      }
    });
  };

  const currentFileContent = selectedFile ? getFileContent(selectedFile) : null;

  return (
    <div className="h-full flex flex-col cyber-border bg-cyber-surface">
      {/* Top Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-cyber-border">
        <FileCode className="w-4 h-4 text-cyber-primary" />
        <span className="text-sm font-semibold">IDE</span>
        {currentStep && (
          <span className="ml-auto text-xs text-gray-400">
            Step: {currentStep.title}
          </span>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 border-r border-cyber-border bg-cyber-bg p-2 overflow-y-auto scrollbar-thin">
          <div className="text-xs text-gray-400 mb-2 font-semibold">Explorer</div>
          {renderFileTree(fileTree)}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          {openFiles.length > 0 && (
            <div className="flex items-center gap-1 border-b border-cyber-border bg-cyber-bg p-1 overflow-x-auto">
              {openFiles.map((filePath) => {
                const file = fileSystem?.files
                  ? findFileInTree(fileSystem.files, filePath)
                  : null;
                const isActive = selectedFile === filePath;
                return (
                  <div
                    key={filePath}
                    className={`flex items-center gap-1 px-3 py-1 rounded-t text-xs cursor-pointer ${
                      isActive
                        ? 'bg-cyber-surface border-t border-l border-r border-cyber-border'
                        : 'hover:bg-cyber-surface/50'
                    }`}
                    onClick={() => openFile(filePath)}
                  >
                    <File className="w-3 h-3" />
                    <span>{filePath.split('/').pop()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeFile(filePath);
                      }}
                      className="ml-1 hover:text-cyber-danger"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin bg-cyber-bg">
            {currentFileContent ? (
              <div className="font-mono text-sm">
                {currentFileContent.split('\n').map((line, i) => (
                  <div key={i} className="flex">
                    <span className="text-gray-500 w-10 text-right mr-4 text-xs select-none">
                      {i + 1}
                    </span>
                    <code className="text-gray-300 flex-1">{line || ' '}</code>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-20">
                <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a file to view its contents</p>
                {currentStep && (
                  <p className="text-xs mt-2">
                    Current step: {currentStep.title}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Terminal */}
          <div className="h-32 border-t border-cyber-border bg-black/50 p-2 overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-cyber-success" />
              <span className="text-xs text-gray-400">Terminal</span>
            </div>
            <div className="text-xs font-mono space-y-1">
              {terminalOutput.map((line, i) => (
                <div key={i} className={line.startsWith('$') ? 'text-cyber-primary' : line.startsWith('✓') ? 'text-cyber-success' : 'text-gray-400'}>
                  {line}
                </div>
              ))}
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
                {currentStep ? (
                  <>
                    <p className="mb-2">Step: {currentStep.title}</p>
                    <p className="text-gray-500">{currentStep.description}</p>
                    <p className="mt-4 text-cyber-primary">
                      Learning: {currentStep.learningObjective}
                    </p>
                  </>
                ) : (
                  'Start a conversation with your AI assistant...'
                )}
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
                {msg.files && msg.files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.files.map((file, idx) => (
                      <div key={idx} className="text-cyber-success text-xs">
                        ✓ {file}
                      </div>
                    ))}
                  </div>
                )}
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
                placeholder={currentStep ? `Prompt for: ${currentStep.title}` : 'Type your prompt...'}
                className="flex-1 bg-cyber-bg border border-cyber-border rounded px-2 py-1 text-xs focus:outline-none focus:border-cyber-primary"
                disabled={!currentStep}
              />
              <button
                onClick={handleSend}
                disabled={!currentStep || !prompt.trim()}
                className="p-1 bg-cyber-primary text-black rounded hover:bg-cyber-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
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

function findFileInTree(nodes: FileNode[], filePath: string): FileNode | null {
  for (const node of nodes) {
    if (node.path === filePath) return node;
    if (node.children) {
      const found = findFileInTree(node.children, filePath);
      if (found) return found;
    }
  }
  return null;
}

