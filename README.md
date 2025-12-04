# VibeQuest: Zero to Deploy

An educational RPG simulation that teaches software engineering students how to build applications using "Vibe Coding" (AI-assisted development).

## 🎮 Game Overview

VibeQuest is a game where you simulate the lifecycle of shipping software. The game adapts to your skill level, teaching you how to leverage AI tools (Cursor, Replit, V0) effectively at different stages of expertise.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## 🎯 Game Mechanics

### Resources

- **Sanity (HP)**: Decreases when AI hallucinates, builds fail, or you write bad prompts
- **Coffee (Mana)**: Required to execute "Vibe Checks" (generating code, refactoring, deploying)
- **XP**: Earned by completing tasks. Level up to unlock new phases!

### Three Classes

1. **Vibe Surfer (Easy)**: 100% AI Reliance
   - Focus on prompt battles and choosing the best prompts
   - Learn concepts without deep technical knowledge

2. **Co-Pilot (Intermediate)**: Hybrid Approach
   - You architect, AI builds
   - Code review challenges and drag-and-drop architecture

3. **10x Architect (Hard)**: Deep Technical Precision
   - AI is just a tool
   - Console warfare and hallucination hunting

### Four Phases

1. **Initialization**: Set up your development environment
2. **The Skeleton**: Build the frontend UI
3. **The Brain**: Connect to backend and database
4. **Production**: Deploy to production

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **State Management**: Zustand

## 📁 Project Structure

```
src/
├── components/       # UI components (HUD, IDE, BrowserPreview, etc.)
├── data/            # Curriculum data structures
├── hooks/           # Custom hooks (useGameEngine)
├── store/           # Zustand store for game state
├── styles/          # Global styles
├── types/           # TypeScript type definitions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## 🎨 Features

- **Dynamic Curriculum**: Adapts based on your selected class, platform, and stack
- **Resource Management**: Balance Sanity and Coffee to progress
- **Challenge System**: Multiple challenge types (prompt battles, code reviews, console warfare)
- **Tutorial System**: Senior Dev assistant provides tips and guidance
- **Cyberpunk Aesthetic**: Dark mode IDE theme with neon accents

## 🎓 Educational Value

Learn:
- How to write effective prompts for AI coding assistants
- Software development lifecycle (SDLC)
- Frontend vs Backend concepts
- Database integration
- Deployment and CI/CD
- Code review and debugging skills

## 🚧 Future Enhancements

- Sound effects for typing, success, and errors
- More challenge types
- Mini-games for coffee regeneration
- Achievement system
- Leaderboards
- Multiplayer mode

## 📝 License

MIT

---

Built with ❤️ for software engineering students

