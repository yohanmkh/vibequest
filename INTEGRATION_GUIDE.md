# Integration Guide: Enhanced VibeQuest

## Quick Start

To use the enhanced version with step-by-step learning:

### Option 1: Replace App Component (Recommended)

```typescript
// In src/main.tsx, change:
import App from './App.tsx'
// To:
import App from './AppEnhanced.tsx'
```

### Option 2: Add Toggle Between Modes

Add a toggle in the setup screen to choose between classic and enhanced modes.

## What's New

### Enhanced Features

1. **Step-by-Step Learning Path**
   - 21 detailed micro-steps
   - Clear learning objectives
   - Best practices and pitfalls
   - Progress tracking

2. **Real Code Generation**
   - AI-simulated code generation
   - File system integration
   - Code templates
   - Prompt quality assessment

3. **Dynamic File System**
   - Real file tree
   - File creation/editing
   - Status tracking
   - Git-like indicators

4. **Enhanced IDE**
   - File tree navigation
   - Multiple file tabs
   - Code editor
   - Terminal simulation
   - AI chat integration

## Architecture

### Core Engines

- **CodeGenerator**: Simulates AI code generation
- **FileSystemManager**: Manages project files

### Enhanced Hooks

- **useEnhancedGameEngine**: Manages step progression and code generation

### Enhanced Components

- **EnhancedIDE**: Advanced IDE with file system
- **StepByStepView**: Learning path visualization

### Enhanced Data

- **enhancedCurriculum**: Detailed step-by-step curriculum

## Usage Flow

1. Student selects class/platform/stack
2. Views learning path with all steps
3. Clicks "Start Step" on a step
4. IDE opens with step context
5. Student writes prompts in AI chat
6. Code is generated and added to file tree
7. Student reviews generated code
8. Clicks "Complete Step" when done
9. Next step unlocks
10. Repeat until all steps complete

## Customization

### Adding New Steps

Edit `src/data/enhancedCurriculum.ts`:

```typescript
{
  id: 'new-step-id',
  title: 'Step Title',
  description: 'Step description',
  learningObjective: 'What student learns',
  type: 'code-generation',
  status: 'locked',
  order: 22,
  coffeeCost: 15,
  xpReward: 30,
  dependsOn: ['previous-step-id'],
  codeTemplate: { /* ... */ },
  bestPractices: ['Practice 1', 'Practice 2'],
  commonPitfalls: ['Pitfall 1'],
}
```

### Adding Code Templates

Edit `src/engines/codeGenerator.ts`:

```typescript
this.codeTemplates.set('template-id', {
  filePath: 'path/to/{ComponentName}.tsx',
  content: 'template code with {placeholders}',
  language: 'tsx',
  editable: true,
  placeholders: [/* ... */],
});
```

### Customizing File System

Edit `src/engines/fileSystemManager.ts` to change:
- Initial project structure
- File organization
- Status tracking

## Testing

The enhanced system is ready to use. Test by:

1. Running `npm install`
2. Running `npm run dev`
3. Selecting class/platform/stack
4. Starting a step
5. Generating code with prompts
6. Completing steps

## Troubleshooting

### Type Errors

If you see TypeScript errors, ensure:
- All types are imported from `../types/enhanced`
- File paths are correct
- Dependencies are installed

### File System Not Updating

Check that:
- `fileSystemManager` is being used correctly
- State is being updated with `setFileSystem`
- Files are being added with `addFile()`

### Steps Not Unlocking

Verify:
- Dependencies are completed
- Resources (coffee) are sufficient
- Step status is correct

## Next Enhancements

Future improvements can include:
- Live code execution
- Git workflow simulation
- Testing system
- Deployment pipeline
- Real AI integration

## Support

For issues or questions, refer to:
- `ENHANCEMENT_PLAN.md` - Detailed enhancement plan
- `ENHANCEMENT_SUMMARY.md` - Summary of changes
- Code comments in engine files

