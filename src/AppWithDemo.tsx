import { useState } from 'react';
import { EnhancedDemo } from './demo/EnhancedDemo';
import App from './App';

type AppMode = 'main' | 'demo';

function AppWithDemo() {
  const [mode, setMode] = useState<AppMode>(() => {
    // Check URL param
    const params = new URLSearchParams(window.location.search);
    return params.get('demo') === 'true' ? 'demo' : 'main';
  });

  // Update URL when mode changes
  const switchMode = (newMode: AppMode) => {
    setMode(newMode);
    const url = new URL(window.location.href);
    if (newMode === 'demo') {
      url.searchParams.set('demo', 'true');
    } else {
      url.searchParams.delete('demo');
    }
    window.history.pushState({}, '', url);
  };

  if (mode === 'demo') {
    return (
      <>
        <EnhancedDemo />
        <button
          onClick={() => switchMode('main')}
          className="fixed bottom-4 right-4 px-4 py-2 bg-cyber-primary text-black rounded-lg font-semibold hover:bg-cyber-primary/90 transition-colors z-50"
        >
          ← Back to Main App
        </button>
      </>
    );
  }

  return (
    <>
      <App />
      <button
        onClick={() => switchMode('demo')}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary text-black rounded-lg font-semibold hover:opacity-90 transition-opacity z-50 animate-pulse"
      >
        🚀 Try Enhanced Demo
      </button>
    </>
  );
}

export default AppWithDemo;
