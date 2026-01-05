# 🚀 Enhanced Demo Quick Start Guide

## How to Access the Demo

The development server is now running at **http://localhost:5175**

### Two Ways to View:

1. **Main App with Demo Button**
   - Go to: http://localhost:5175
   - Click the pulsing "🚀 Try Enhanced Demo" button in the bottom right
   
2. **Direct Demo Link**
   - Go to: http://localhost:5175?demo=true
   - Opens directly in demo mode

---

## What You'll See

### Enhanced HUD (Top of Screen)
- **Sanity** (green/yellow/red) - Mental health bar
- **Coffee** (amber) - Energy points
- **Level & XP** (cyan) - Progress tracker
- **Tech Debt** ⚠️ (yellow/red) - NEW! Hidden cost of shortcuts
- **AI Trust** 🤖 (cyan) - NEW! AI reliability score
- **Code Quality** 💎 (purple) - NEW! Overall code health

### Interactive Sections

#### 1. 🎯 Decision Points
Click these to trigger realistic engineering scenarios:

- **🚨 Scope Creep** - PM wants drag-and-drop feature mid-sprint
  - Test: Choose between accepting, deferring, or negotiating
  - Watch how each choice affects your stats differently
  
- **🤖 AI Code Review** - AI generated messy code
  - Test: Ship it, refactor manually, or ask AI to improve
  - See the trade-offs between speed and quality

#### 2. 🔍 Verification Challenges
These simulate the "verify understanding" mechanic:

- **Explain useState** - Type-to-explain challenge
  - Try it: Write an explanation mentioning "state", "array", "type"
  - Pass = Big XP + AI Trust boost
  - Skip = Sanity penalty + Tech Debt
  
- **Explain useEffect** - More advanced explanation
  - Must mention: "side effect", "dependency array", "mount"
  
- **Predict Output** - Multiple choice quiz
  - Tests if you actually understand the code
  
- **🐛 Spot the Bug** - Find the issue in AI-generated code
  - Pro tip: Check line 9 for the onClick bug

#### 3. 🤖 AI Usage Patterns
Simulate different ways of using AI:

- **❌ Poor Prompt** - "make a website"
  - Result: Lose sanity, coffee, AI trust; gain tech debt
  
- **✅ Good Prompt** - Specific with context
  - Result: Gain XP, AI trust; minimal coffee cost
  
- **⚠️ Blind Copy-Paste** - No review
  - Result: Big tech debt penalty, lose AI trust
  
- **🔧 Refactor Code** - Improve AI output
  - Result: Reduce tech debt, gain quality + XP

#### 4. ⚙️ Utilities
- **☕ Coffee Break** - Restore coffee and sanity
- **🔄 Reset Demo** - Start over

---

## What to Look For

### Stat Interactions

1. **Low Sanity (<30)** 
   - Notice the red pulsing brain icon
   - "Panic Mode!" warning appears
   - In real game: AI would generate buggier code

2. **Low Coffee (<20)**
   - Orange warning appears
   - "Need a break!" message
   - In real game: Can't start new tasks

3. **High Tech Debt (>60)**
   - Red warning indicator
   - "Refactor needed!" alert
   - In real game: Blocks deployment, triggers scenarios

4. **Low AI Trust (<40)**
   - Icon changes color to red/yellow
   - "AI less reliable" warning
   - In real game: More hallucinations, fake packages

### Decision Flow Example

Try this sequence:
1. Click "🚨 Scope Creep"
2. Read the scenario (PM wants feature mid-sprint)
3. Select "Accept the change" (suboptimal choice)
4. Read the reasoning reveal (explains why it's bad)
5. Watch stats update: -15 sanity, -20 coffee, +25 tech debt
6. Check activity log (bottom right) for summary

### Verification Flow Example

Try this sequence:
1. Click "Explain useState"
2. In the modal, type an explanation
3. Try first with bad answer: "it's a thing"
   - Result: FAILED, lose sanity
4. Click again, this time mention "state", "array", "type", "setter"
   - Result: PASSED, gain 30 XP + AI Trust

---

## Real Game Integration

In the actual game, these mechanics trigger automatically:

- **Decisions** appear before/after certain steps
- **Verifications** required after AI generates code
- **Scenarios** trigger based on stats (e.g., tech debt > 60)
- **Stats** persist across sessions
- **Consequences** chain (one decision unlocks future scenarios)

---

## Key Features Demonstrated

### ✅ What's Working
- [x] Enhanced HUD with 6 stats
- [x] Decision modal with timer (optional)
- [x] Consequence system
- [x] Verification challenges (4 types)
- [x] Reasoning reveals
- [x] Activity logging
- [x] Stat-based warnings
- [x] Different UI states (passing/failing)

### 🚧 Not Yet Implemented (from full proposal)
- [ ] Scenario engine (random events)
- [ ] Stat threshold triggers
- [ ] Decision consequence chains
- [ ] Prompt quality analyzer
- [ ] Blind paste detector
- [ ] Reflection checkpoints
- [ ] Deliverables tracking
- [ ] Achievement system

---

## Testing Tips

### See Stats in Action:
1. Click "Poor Prompt" 3-4 times
   - Watch sanity drop, tech debt rise
2. Notice panic warnings appear
3. Click "Refactor Code"
   - See tech debt drop significantly
4. Take a coffee break
   - Stats recover

### Decision Consequences:
1. Try both options in scope creep decision
2. Compare the reasoning explanations
3. Notice optimal choices marked with ⭐

### Verification System:
1. Try skipping a verification (costs sanity!)
2. Try passing with a good answer (big rewards)
3. Use hints (reduces bonus but helps)

---

## Activity Log

Bottom right panel shows everything that happens:
- Resources changes with amounts
- Decision choices and outcomes
- Verification pass/fail
- Reasoning explanations

Perfect for understanding cause and effect!

---

## Next Steps

After testing the demo:

1. Review `VIBEQUEST_ENHANCEMENTS.md` for full design
2. Check `IMPLEMENTATION_GUIDE.md` for integration plan
3. Look at `src/types/enhancedGameTypes.ts` for all interfaces
4. See `src/data/todoAppScenarios.ts` for more scenarios

## Questions to Consider

1. Are the stat changes balanced? Too harsh? Too easy?
2. Are decision scenarios realistic and engaging?
3. Is the verification system too hard? Too easy?
4. Do the consequences feel meaningful?
5. What other scenarios would you like to see?

---

**Enjoy exploring! The goal is to make engineering judgment fun and educational.** 🎮
