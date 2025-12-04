import { motion } from 'framer-motion';
import { User, LogOut, Trophy, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';

export function UserProfile() {
  const { user, logout } = useAuthStore();
  const { resources } = useGameStore();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-border bg-cyber-surface p-6 rounded-lg"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center">
          <User className="w-8 h-8 text-black" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-cyber-primary">{user.username}</h3>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <motion.button
          onClick={logout}
          className="p-2 cyber-border rounded hover:bg-cyber-bg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-5 h-5 text-gray-400" />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="cyber-border bg-cyber-bg p-3 rounded">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-cyber-warning" />
            <span className="text-xs text-gray-400">Level</span>
          </div>
          <p className="text-2xl font-bold text-cyber-primary">{user.stats.level}</p>
        </div>

        <div className="cyber-border bg-cyber-bg p-3 rounded">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-cyber-primary" />
            <span className="text-xs text-gray-400">Total XP</span>
          </div>
          <p className="text-2xl font-bold text-cyber-primary">{user.stats.totalXp}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Completed Steps</span>
          <span className="text-cyber-primary font-semibold">{user.stats.completedSteps}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Current Sanity</span>
          <span className="text-cyber-primary font-semibold">{resources.sanity}/100</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Current Coffee</span>
          <span className="text-cyber-primary font-semibold">{resources.coffee}/100</span>
        </div>
      </div>
    </motion.div>
  );
}

