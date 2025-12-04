/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0e27',
          surface: '#151932',
          border: '#2a3a5c',
          primary: '#00d9ff',
          secondary: '#7c3aed',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

