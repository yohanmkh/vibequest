# VibeQuest Enhancement Implementation Guide

## Quick Reference: What Was Created

### 1. Documentation
- `VIBEQUEST_ENHANCEMENTS.md` - Full enhancement proposal with detailed designs

### 2. New Type Definitions
- `src/types/enhancedGameTypes.ts` - Complete TypeScript interfaces for:
  - Enhanced game resources (techDebt, aiTrust, codeQuality)
  - Decision system types
  - Scenario/event system types
  - Verification challenge types
  - Prompt quality analysis types
  - Difficulty configuration types
  - Deliverables system types

### 3. Sample Data
- `src/data/todoAppScenarios.ts` - Concrete examples for React Todo App:
  - 4 decision points (scope creep, AI code review, testing, deployment)
  - 8 game scenarios (bugs, security, CI/CD, hallucinations, deadlines)
  - 5 verification challenges (useState, useEffect, filtering, bug spotting, refactoring)
  - 3 reflection checkpoints

### 4. New Components
- `src/components/EnhancedHUD.tsx` - Enhanced HUD showing new stats
- `src/components/DecisionModal.tsx` - Decision point UI with consequences
- `src/components/VerificationModal.tsx` - Code verification challenge UI

---

## Implementation Priority Order

### Phase 1: Core Stats (Estimated: 2-3 days)
**Goal:** Add meaningful stats that affect gameplay

1. **Update `gameStore.ts`**
```typescript
// Add to GameResources
techDebt: number;      // 0-100
aiTrust: number;       // 0-100  
codeQuality: number;   // 0-100

// Add actions
addTechDebt: (amount: number, reason: string) => void;
reduceTechDebt: (amount: number) => void;
updateAITrust: (delta: number) => void;
```

2. **Update `HUD.tsx`** 
- Replace with `EnhancedHUD.tsx` or merge functionality
- Show/hide stats based on player class and level

3. **Connect stats to existing mechanics**
- Modify `useGameEngine.ts` to update techDebt on task skip
- Modify AI code generation to factor in aiTrust

### Phase 2: Decision System (Estimated: 3-4 days)
**Goal:** Add decision points that interrupt learning flow

1. **Create decision engine**
```typescript
// src/engines/decisionEngine.ts
export function useDecisionEngine() {
  const checkForDecisions = (stepId: string, trigger: string) => GameScenario[];
  const resolveDecision = (decisionId: string, optionId: string) => void;
}
```

2. **Integrate into step flow**
- Modify `StepByStepView.tsx` to check for decisions before/after steps
- Show `DecisionModal` when triggered
- Apply consequences to game state

3. **Add decision data**
- Import decisions from `todoAppScenarios.ts`
- Create decision lookup by stepId

### Phase 3: Verification System (Estimated: 3-4 days)
**Goal:** Require understanding before advancing

1. **Add verification checkpoints**
- After AI generates code, trigger verification
- Block "Complete Step" until verification passed

2. **Implement verification logic**
```typescript
// In useEnhancedGameEngine.ts
const requiresVerification = (step: MicroStep): boolean;
const getVerificationForStep = (stepId: string): VerificationChallenge | null;
```

3. **Connect rewards**
- XP bonus for verification pass
- AI Trust bonus for catching bugs
- Penalty for skipping

### Phase 4: Scenario Events (Estimated: 4-5 days)
**Goal:** Random events that create tension

1. **Create scenario engine**
```typescript
// src/engines/scenarioEngine.ts
export function useScenarioEngine() {
  const checkTriggers = () => void; // Called on stat change, step completion
  const activeScenarios: GameScenario[];
  const resolveScenario = (id: string, optionId: string) => void;
}
```

2. **Implement trigger system**
- Stat threshold triggers (techDebt > 60)
- Step completion triggers
- Random chance triggers
- Decision consequence triggers

3. **Add scenario UI**
- Scenario notification toast
- Blocking vs non-blocking scenarios
- Priority queue for multiple scenarios

### Phase 5: Deliverables (Estimated: 2-3 days)
**Goal:** Real artifacts at the end

1. **Track deliverables**
```typescript
// Add to game state
deliverables: ProjectDeliverable[];
completionChecklist: ChecklistItem[];
```

2. **Generate artifacts**
- Auto-generate README from completed steps
- Compile architecture from component structure
- Summarize test coverage

3. **Export functionality**
- Download as ZIP
- Export to GitHub (stretch goal)

---

## Key Integration Points

### Existing File Modifications Needed

| File | Changes Required |
|------|-----------------|
| `src/store/gameStore.ts` | Add new stats, actions |
| `src/types/index.ts` | Import/export new types |
| `src/hooks/useEnhancedGameEngine.ts` | Add decision/scenario hooks |
| `src/components/StepByStepView.tsx` | Check for decisions/verifications |
| `src/App.tsx` | Add modal providers |
| `src/data/enhancedCurriculum.ts` | Add verification step references |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/engines/decisionEngine.ts` | Decision point logic |
| `src/engines/scenarioEngine.ts` | Event trigger system |
| `src/engines/promptAnalyzer.ts` | Prompt quality scoring |
| `src/engines/verificationEngine.ts` | Code understanding checks |
| `src/components/ScenarioModal.tsx` | Scenario event UI |
| `src/components/ReflectionModal.tsx` | Reflection checkpoint UI |

---

## Balancing Guidelines

### Stat Change Recommendations

| Action | Sanity | Coffee | TechDebt | AITrust | XP |
|--------|--------|--------|----------|---------|-----|
| Good prompt | +5 | -10 | 0 | +5 | 20-30 |
| Poor prompt | -10 | -15 | +5 | -5 | 5-10 |
| Skip verification | -15 | 0 | +10 | -10 | 0 |
| Pass verification | +5 | -5 | 0 | +10 | 30-50 |
| Catch AI bug | +10 | -10 | -5 | +15 | 40-60 |
| Accept bad code | 0 | 0 | +15 | -10 | 5 |
| Refactor code | +5 | -20 | -20 | +10 | 40 |
| Skip tests | 0 | +5 | +20 | 0 | 5 |
| Write tests | +5 | -25 | -10 | +5 | 35 |

### Class Difficulty Settings

| Class | Hidden Stats | Verification | Test Required | Scenarios |
|-------|--------------|--------------|---------------|-----------|
| Vibe Surfer | techDebt, aiTrust | Optional | None | Rare, gentle |
| Co-Pilot | None | Required | Unit tests | Regular |
| 10x Architect | None | Required + explain | Unit + Integration | Frequent |

---

## Testing the Enhancements

### Manual Test Checklist

- [ ] New stats display correctly in HUD
- [ ] Stats update when actions are taken
- [ ] Decision modal appears at correct triggers
- [ ] Decision consequences apply correctly
- [ ] Verification blocks progression when required
- [ ] Verification analysis matches concepts correctly
- [ ] Scenarios trigger on stat thresholds
- [ ] Scenario consequences chain correctly
- [ ] Low sanity triggers panic effects
- [ ] Low coffee blocks new tasks
- [ ] High tech debt triggers refactor scenarios

### Edge Cases to Test

1. What happens at 0 sanity?
2. What happens at 0 coffee?
3. Can tech debt exceed 100?
4. Do chained scenarios work (decision -> scenario)?
5. Timer expiration on timed decisions
6. Multiple scenarios triggering simultaneously

---

## Competition Differentiators

When presenting to judges, emphasize these unique aspects:

1. **Not a Tutorial** - Students make real engineering trade-offs
2. **AI Critique System** - Teaches responsible AI usage, not blind copying
3. **Consequence Chains** - Decisions have lasting impact
4. **Hidden Mechanics** - Tech debt reveals itself over time
5. **Professional Skills** - Teaches communication, scope management
6. **Real Artifacts** - Students leave with portfolio-ready deliverables

---

## Next Steps

1. Review `VIBEQUEST_ENHANCEMENTS.md` for full design details
2. Start with Phase 1 (Core Stats) - lowest risk, immediate impact
3. Playtest each phase before moving to next
4. Adjust balance values based on feedback
5. Consider A/B testing different difficulty curves
