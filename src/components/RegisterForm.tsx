import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { RegisterData } from '../types/auth';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

export function RegisterForm({ onSwitchToLogin, onRegisterSuccess }: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuthStore();
  const [data, setData] = useState<RegisterData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await register(data);
    if (success) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        onRegisterSuccess();
      }, 100);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="cyber-border bg-cyber-surface p-8 rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary bg-clip-text text-transparent">
            Join VibeQuest
          </h2>
          <p className="text-gray-400">Start your journey from Zero to Deploy</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-900/20 border border-red-800/50 rounded flex items-center gap-2 text-red-400"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-cyber-bg border border-cyber-border rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary"
                placeholder="coolcoder123"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-cyber-bg border border-cyber-border rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-cyber-bg border border-cyber-border rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-cyber-bg border border-cyber-border rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-cyber-primary to-cyber-secondary text-black font-bold rounded-lg cyber-glow-strong flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-cyber-primary hover:text-cyber-secondary font-semibold transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

