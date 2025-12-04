import { motion } from 'framer-motion';
import { Sparkles, Code, Rocket } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { PlayerClass, Platform, Stack } from '../types';

export function ClassSelector() {
  const { playerClass, platform, stack, setPlayerClass, setPlatform, setStack } = useGameStore();

  const classes: Array<{ id: PlayerClass; name: string; icon: any; description: string }> = [
    {
      id: 'vibe-surfer',
      name: 'Vibe Surfer',
      icon: Sparkles,
      description: '100% AI Reliance. Focus on prompts and concepts.',
    },
    {
      id: 'co-pilot',
      name: 'Co-Pilot',
      icon: Code,
      description: 'Hybrid approach. You architect, AI builds.',
    },
    {
      id: '10x-architect',
      name: '10x Architect',
      icon: Rocket,
      description: 'Deep technical precision. AI is just a tool.',
    },
  ];

  const platforms: Array<{ id: Platform; name: string }> = [
    { id: 'web', name: 'Web' },
    { id: 'mobile', name: 'Mobile' },
  ];

  const stacks: Array<{ id: Stack; name: string }> = [
    { id: 'react-node', name: 'React + Node.js' },
    { id: 'flutter-firebase', name: 'Flutter + Firebase' },
    { id: 'nextjs-prisma', name: 'Next.js + Prisma' },
  ];

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">
            VibeQuest
          </h1>
          <p className="text-xl text-gray-400">Zero to Deploy</p>
        </div>

        {/* Class Selection */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Choose Your Class</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map((cls) => {
              const Icon = cls.icon;
              const isSelected = playerClass === cls.id;
              return (
                <motion.button
                  key={cls.id}
                  onClick={() => setPlayerClass(cls.id)}
                  className={`cyber-border bg-cyber-surface p-6 rounded-lg text-left ${
                    isSelected ? 'cyber-glow border-cyber-primary' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-8 h-8 text-cyber-primary mb-3" />
                  <h3 className="text-xl font-bold mb-2">{cls.name}</h3>
                  <p className="text-sm text-gray-400">{cls.description}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Platform Selection */}
        {playerClass && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Choose Your Platform</h2>
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((plat) => {
                const isSelected = platform === plat.id;
                return (
                  <motion.button
                    key={plat.id}
                    onClick={() => setPlatform(plat.id)}
                    className={`cyber-border bg-cyber-surface p-4 rounded-lg ${
                      isSelected ? 'cyber-glow border-cyber-primary' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="text-lg font-bold">{plat.name}</h3>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Stack Selection */}
        {platform && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Choose Your Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stacks.map((s) => {
                const isSelected = stack === s.id;
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => setStack(s.id)}
                    className={`cyber-border bg-cyber-surface p-4 rounded-lg ${
                      isSelected ? 'cyber-glow border-cyber-primary' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="text-lg font-bold">{s.name}</h3>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

