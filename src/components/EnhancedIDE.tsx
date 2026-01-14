import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Terminal, Send, File, Folder, ChevronRight, ChevronDown, X, Play, Sparkles } from 'lucide-react';
import { FileNode } from '../types/enhanced';
import { useEnhancedGameEngine } from '../hooks/useEnhancedGameEngine';

interface EnhancedIDEProps {
  onCodeGenerated?: (files: string[]) => void;
}

// Code content stored separately to avoid template literal issues
const APP_CODE = [
  "import React, { useState } from 'react';",
  "import { TodoList } from './components/TodoList';",
  "import { AddTodo } from './components/AddTodo';",
  "import { Todo } from './types';",
  "",
  "function App() {",
  "  const [todos, setTodos] = useState<Todo[]>([]);",
  "",
  "  const addTodo = (text: string) => {",
  "    const newTodo: Todo = {",
  "      id: Date.now(),",
  "      text,",
  "      completed: false,",
  "    };",
  "    setTodos([...todos, newTodo]);",
  "  };",
  "",
  "  const toggleTodo = (id: number) => {",
  "    setTodos(todos.map(todo =>",
  "      todo.id === id ? { ...todo, completed: !todo.completed } : todo",
  "    ));",
  "  };",
  "",
  "  const deleteTodo = (id: number) => {",
  "    setTodos(todos.filter(todo => todo.id !== id));",
  "  };",
  "",
  "  return (",
  "    <div className=\"min-h-screen bg-gray-900 text-white p-8\">",
  "      <div className=\"max-w-md mx-auto\">",
  "        <h1 className=\"text-3xl font-bold mb-8\">My Todo App</h1>",
  "        <AddTodo onAdd={addTodo} />",
  "        <TodoList",
  "          todos={todos}",
  "          onToggle={toggleTodo}",
  "          onDelete={deleteTodo}",
  "        />",
  "      </div>",
  "    </div>",
  "  );",
  "}",
  "",
  "export default App;"
].join('\n');

const TODOLIST_CODE = [
  "import React from 'react';",
  "import { TodoItem } from './TodoItem';",
  "import { Todo } from '../types';",
  "",
  "interface TodoListProps {",
  "  todos: Todo[];",
  "  onToggle: (id: number) => void;",
  "  onDelete: (id: number) => void;",
  "}",
  "",
  "export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {",
  "  if (todos.length === 0) {",
  "    return (",
  "      <div className=\"text-center text-gray-500 py-8\">",
  "        No todos yet. Add one above!",
  "      </div>",
  "    );",
  "  }",
  "",
  "  return (",
  "    <div className=\"space-y-2\">",
  "      {todos.map(todo => (",
  "        <TodoItem",
  "          key={todo.id}",
  "          todo={todo}",
  "          onToggle={onToggle}",
  "          onDelete={onDelete}",
  "        />",
  "      ))}",
  "    </div>",
  "  );",
  "}"
].join('\n');

const TODOITEM_CODE = [
  "import React from 'react';",
  "import { Todo } from '../types';",
  "",
  "interface TodoItemProps {",
  "  todo: Todo;",
  "  onToggle: (id: number) => void;",
  "  onDelete: (id: number) => void;",
  "}",
  "",
  "export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {",
  "  return (",
  "    <div className=\"flex items-center gap-3 p-3 bg-gray-800 rounded-lg\">",
  "      <input",
  "        type=\"checkbox\"",
  "        checked={todo.completed}",
  "        onChange={() => onToggle(todo.id)}",
  "        className=\"w-5 h-5 rounded\"",
  "      />",
  "      <span className={todo.completed ? 'line-through text-gray-500' : ''}>",
  "        {todo.text}",
  "      </span>",
  "      <button",
  "        onClick={() => onDelete(todo.id)}",
  "        className=\"text-red-400 hover:text-red-300\"",
  "      >",
  "        Delete",
  "      </button>",
  "    </div>",
  "  );",
  "}"
].join('\n');

const ADDTODO_CODE = [
  "import React, { useState } from 'react';",
  "",
  "interface AddTodoProps {",
  "  onAdd: (text: string) => void;",
  "}",
  "",
  "export function AddTodo({ onAdd }: AddTodoProps) {",
  "  const [text, setText] = useState('');",
  "",
  "  const handleSubmit = (e: React.FormEvent) => {",
  "    e.preventDefault();",
  "    if (text.trim()) {",
  "      onAdd(text.trim());",
  "      setText('');",
  "    }",
  "  };",
  "",
  "  return (",
  "    <form onSubmit={handleSubmit} className=\"mb-6\">",
  "      <div className=\"flex gap-2\">",
  "        <input",
  "          type=\"text\"",
  "          value={text}",
  "          onChange={(e) => setText(e.target.value)}",
  "          placeholder=\"What needs to be done?\"",
  "          className=\"flex-1 px-4 py-2 bg-gray-800 rounded-lg\"",
  "        />",
  "        <button type=\"submit\" className=\"px-4 py-2 bg-blue-600 rounded-lg\">",
  "          Add",
  "        </button>",
  "      </div>",
  "    </form>",
  "  );",
  "}"
].join('\n');

const TYPES_CODE = [
  "export interface Todo {",
  "  id: number;",
  "  text: string;",
  "  completed: boolean;",
  "}",
  "",
  "export type FilterType = 'all' | 'active' | 'completed';"
].join('\n');

const PACKAGE_CODE = [
  "{",
  "  \"name\": \"my-todo-app\",",
  "  \"version\": \"1.0.0\",",
  "  \"scripts\": {",
  "    \"dev\": \"vite\",",
  "    \"build\": \"tsc && vite build\"",
  "  },",
  "  \"dependencies\": {",
  "    \"react\": \"^18.2.0\",",
  "    \"react-dom\": \"^18.2.0\"",
  "  }",
  "}"
].join('\n');

const todoAppFiles: Record<string, string> = {
  'src/App.tsx': APP_CODE,
  'src/components/TodoList.tsx': TODOLIST_CODE,
  'src/components/TodoItem.tsx': TODOITEM_CODE,
  'src/components/AddTodo.tsx': ADDTODO_CODE,
  'src/types/index.ts': TYPES_CODE,
  'package.json': PACKAGE_CODE,
};

const aiResponses: Record<string, { message: string; file: string }> = {
  'todo': { message: "I've created a complete TodoList component!", file: 'src/components/TodoList.tsx' },
  'add': { message: "Here's an AddTodo component with form handling!", file: 'src/components/AddTodo.tsx' },
  'item': { message: "I've built a TodoItem component!", file: 'src/components/TodoItem.tsx' },
  'app': { message: "Here's the main App component!", file: 'src/App.tsx' },
  'type': { message: "I've defined the TypeScript types!", file: 'src/types/index.ts' },
};

export function EnhancedIDE({ onCodeGenerated }: EnhancedIDEProps) {
  const { generateCodeFromPrompt, openFile, closeFile, getFileContent } = useEnhancedGameEngine();

  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; message: string; file?: string }>>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components']));
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ npm create vite@latest my-todo-app',
    '✓ Project created successfully',
    '$ cd my-todo-app && npm install',
    '✓ Dependencies installed',
    '$ npm run dev',
    '',
    '  VITE v5.0.0  ready in 234 ms',
    '',
    '  ➜  Local:   http://localhost:5173/',
  ]);
  const [selectedFile, setSelectedFile] = useState<string>('src/App.tsx');
  const [openFiles, setOpenFiles] = useState<string[]>(['src/App.tsx']);
  const [isRunning, setIsRunning] = useState(true);

  const currentFileContent = todoAppFiles[selectedFile] || getFileContent(selectedFile) || '// Select a file to view';

  const handleSend = () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user' as const, message: prompt };
    let aiMessage = { role: 'ai' as const, message: "I'll help you with that!", file: undefined as string | undefined };
    
    const lowerPrompt = prompt.toLowerCase();
    for (const [keyword, response] of Object.entries(aiResponses)) {
      if (lowerPrompt.includes(keyword)) {
        aiMessage = { role: 'ai' as const, ...response };
        if (response.file) {
          setSelectedFile(response.file);
          if (!openFiles.includes(response.file)) {
            setOpenFiles([...openFiles, response.file]);
          }
        }
        break;
      }
    }

    const generatedFiles = generateCodeFromPrompt(prompt);
    if (generatedFiles.length > 0) {
      const filePaths = generatedFiles.map((f) => f.filePath);
      aiMessage.message += ' Generated ' + generatedFiles.length + ' file(s).';
      if (onCodeGenerated) onCodeGenerated(filePaths);
    }

    setChatHistory([...chatHistory, userMessage, aiMessage]);
    setTerminalOutput([...terminalOutput, '$ # AI generating...', '✓ Code generated']);
    setPrompt('');
  };

  const handleFileClick = (filePath: string) => {
    setSelectedFile(filePath);
    if (!openFiles.includes(filePath)) {
      setOpenFiles([...openFiles, filePath]);
    }
    openFile(filePath);
  };

  const handleCloseFile = (filePath: string) => {
    const newOpenFiles = openFiles.filter(f => f !== filePath);
    setOpenFiles(newOpenFiles);
    closeFile(filePath);
    if (selectedFile === filePath && newOpenFiles.length > 0) {
      setSelectedFile(newOpenFiles[0]);
    }
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

  const handleRunCommand = (cmd: string) => {
    setTerminalOutput(prev => [...prev, '$ ' + cmd]);
    setTimeout(() => {
      if (cmd.includes('dev')) {
        setIsRunning(true);
        setTerminalOutput(prev => [...prev, '✓ Server started']);
      } else if (cmd.includes('build')) {
        setTerminalOutput(prev => [...prev, '✓ Build completed']);
      } else if (cmd.includes('test')) {
        setTerminalOutput(prev => [...prev, '✓ Tests passed (3/3)']);
      }
    }, 300);
  };

  const fileTree: FileNode[] = [
    {
      path: 'src', name: 'src', type: 'directory',
      children: [
        {
          path: 'src/components', name: 'components', type: 'directory',
          children: [
            { path: 'src/components/TodoList.tsx', name: 'TodoList.tsx', type: 'file' },
            { path: 'src/components/TodoItem.tsx', name: 'TodoItem.tsx', type: 'file' },
            { path: 'src/components/AddTodo.tsx', name: 'AddTodo.tsx', type: 'file' },
          ],
        },
        {
          path: 'src/types', name: 'types', type: 'directory',
          children: [
            { path: 'src/types/index.ts', name: 'index.ts', type: 'file' },
          ],
        },
        { path: 'src/App.tsx', name: 'App.tsx', type: 'file' },
      ],
    },
    { path: 'package.json', name: 'package.json', type: 'file' },
  ];

  const renderFileTree = (nodes: FileNode[], level = 0): JSX.Element[] => {
    return nodes.map((node) => {
      if (node.type === 'directory') {
        const isExpanded = expandedFolders.has(node.path);
        return (
          <div key={node.path}>
            <button
              className="flex items-center gap-1 p-1 hover:bg-cyber-surface rounded cursor-pointer text-xs w-full text-left"
              style={{ paddingLeft: level * 12 + 4 }}
              onClick={() => handleFolderToggle(node.path)}
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <Folder className="w-3 h-3 text-yellow-400" />
              <span>{node.name}</span>
            </button>
            {isExpanded && node.children && <div>{renderFileTree(node.children, level + 1)}</div>}
          </div>
        );
      } else {
        return (
          <button
            key={node.path}
            className={'flex items-center gap-1 p-1 hover:bg-cyber-surface rounded cursor-pointer text-xs w-full text-left ' + (selectedFile === node.path ? 'bg-cyber-primary/20' : '')}
            style={{ paddingLeft: level * 12 + 20 }}
            onClick={() => handleFileClick(node.path)}
          >
            <File className="w-3 h-3 text-blue-400" />
            <span>{node.name}</span>
          </button>
        );
      }
    });
  };

  const renderCode = (code: string): JSX.Element[] => {
    const keywords = ['import', 'export', 'function', 'const', 'let', 'return', 'if', 'else', 'from', 'default', 'interface', 'type'];
    const lines = code.split('\n');
    
    return lines.map((line, i) => {
      let html = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      // Highlight strings
      html = html.replace(/(".*?"|'.*?')/g, '<span class="text-green-400">$1</span>');
      
      // Highlight keywords
      keywords.forEach(kw => {
        html = html.replace(new RegExp('\\b(' + kw + ')\\b', 'g'), '<span class="text-purple-400">$1</span>');
      });

      return (
        <div key={i} className="flex hover:bg-white/5 leading-6">
          <span className="text-gray-600 w-10 text-right pr-4 text-xs select-none">{i + 1}</span>
          <code className="text-gray-300 whitespace-pre text-sm" dangerouslySetInnerHTML={{ __html: html || ' ' }} />
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col cyber-border bg-cyber-surface rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-2 border-b border-cyber-border bg-cyber-bg">
        <FileCode className="w-4 h-4 text-cyber-primary" />
        <span className="text-sm font-semibold">VS Code - Todo App</span>
        <div className="ml-auto flex items-center gap-2">
          {isRunning && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Running
            </span>
          )}
          <button onClick={() => handleRunCommand('npm run dev')} className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 hover:bg-green-500 rounded">
            <Play className="w-3 h-3" /> Run
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-48 border-r border-cyber-border bg-cyber-bg p-2 overflow-y-auto">
          <div className="text-xs text-gray-400 mb-2 font-semibold">EXPLORER</div>
          <div className="text-xs text-cyber-primary mb-2">📁 my-todo-app</div>
          {renderFileTree(fileTree)}
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-1 border-b border-cyber-border bg-cyber-bg px-2 py-1 overflow-x-auto">
            {openFiles.map((fp) => (
              <button
                key={fp}
                className={'flex items-center gap-1 px-3 py-1 text-xs ' + (selectedFile === fp ? 'bg-cyber-surface text-white border-t-2 border-cyber-primary' : 'text-gray-400 hover:bg-cyber-surface/50')}
                onClick={() => handleFileClick(fp)}
              >
                <File className="w-3 h-3" />
                <span>{fp.split('/').pop()}</span>
                <span 
                  onClick={(e) => { e.stopPropagation(); handleCloseFile(fp); }} 
                  className="ml-1 hover:text-red-400 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleCloseFile(fp); } }}
                  aria-label={`Close ${fp.split('/').pop()}`}
                >
                  <X className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto bg-[#1e1e1e] p-2 font-mono">
            {renderCode(currentFileContent)}
          </div>

          <div className="h-28 border-t border-cyber-border bg-black p-2 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-800 pb-1">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Terminal</span>
              <div className="ml-auto flex gap-1">
                <button onClick={() => handleRunCommand('npm run dev')} className="text-xs px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded">dev</button>
                <button onClick={() => handleRunCommand('npm run build')} className="text-xs px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded">build</button>
                <button onClick={() => handleRunCommand('npm test')} className="text-xs px-2 py-0.5 bg-gray-800 hover:bg-gray-700 rounded">test</button>
              </div>
            </div>
            <div className="text-xs font-mono space-y-0.5">
              {terminalOutput.slice(-10).map((line, i) => (
                <div key={i} className={line.startsWith('$') ? 'text-cyan-400' : line.startsWith('✓') ? 'text-green-400' : line.includes('http') ? 'text-blue-400' : 'text-gray-400'}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-52 border-l border-cyber-border flex flex-col bg-cyber-bg">
          <div className="p-2 border-b border-cyber-border flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyber-primary" />
            <span className="text-sm font-semibold">AI Assistant</span>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {chatHistory.length === 0 && (
              <div className="text-xs text-gray-400 space-y-2">
                <p className="text-cyber-primary font-semibold">💡 Try asking:</p>
                <p className="cursor-pointer hover:text-white" onClick={() => setPrompt('Create a todo list component')}>"todo list component"</p>
                <p className="cursor-pointer hover:text-white" onClick={() => setPrompt('Show me the App')}>"Show me App"</p>
                <p className="cursor-pointer hover:text-white" onClick={() => setPrompt('Define types')}>"Define types"</p>
              </div>
            )}
            
            {chatHistory.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={'p-2 rounded text-xs ' + (msg.role === 'user' ? 'bg-cyber-primary/20 ml-4' : 'bg-cyber-surface mr-4')}>
                <div className="font-semibold mb-1 text-gray-400">{msg.role === 'user' ? '👤 You' : '🤖 AI'}</div>
                {msg.message}
                {msg.file && (
                  <button className="mt-2 text-cyber-success hover:underline block" onClick={() => handleFileClick(msg.file!)}>
                    📄 Open {msg.file}
                  </button>
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
                placeholder="Ask AI..."
                className="flex-1 bg-cyber-surface border border-cyber-border rounded px-2 py-1.5 text-xs focus:outline-none focus:border-cyber-primary"
              />
              <button onClick={handleSend} disabled={!prompt.trim()} className="p-1.5 bg-cyber-primary text-black rounded hover:bg-cyber-primary/80 disabled:opacity-50" aria-label="Send">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
