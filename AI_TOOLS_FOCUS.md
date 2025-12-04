# AI Tools Focus - Core Learning System

## Overview

VibeQuest now focuses on **teaching students how to use AI tools effectively** at each step of building an application. Every step includes specific guidance on which AI tool to use and how to use it.

## Core Philosophy

**The goal is not just to build an app, but to learn how to leverage AI tools (Cursor, V0, Replit, etc.) to build apps efficiently.**

## AI Tools Covered

### 1. **Cursor** ⌨️
- **Use Case**: Writing code, refactoring, debugging, asking questions
- **Features**: 
  - Inline edit (Cmd+K / Ctrl+K)
  - Chat (Cmd+L)
  - Code generation and refactoring
- **When to Use**: General coding, debugging, understanding code

### 2. **V0 (Vercel)** 🎨
- **Use Case**: Generating React UI components with Tailwind CSS
- **Features**: 
  - Visual component generation
  - Copy-paste ready code
  - Tailwind CSS styling
- **When to Use**: UI components, landing pages, forms, layouts

### 3. **Cursor Composer** 🎼
- **Use Case**: Multi-file code generation
- **Features**: 
  - Generate multiple related files at once
  - Full feature implementation
  - Architecture changes
- **When to Use**: Creating complete features with multiple files

### 4. **Cursor Chat** 💬
- **Use Case**: Learning, debugging, code reviews
- **Features**: 
  - Ask questions about code
  - Get explanations
  - Request improvements
- **When to Use**: Understanding concepts, debugging, learning

### 5. **GitHub Copilot** 🤖
- **Use Case**: Autocomplete, code suggestions
- **Features**: 
  - Intelligent autocomplete
  - Code suggestions
  - Test generation
- **When to Use**: Boilerplate code, repetitive tasks

### 6. **Replit** 💻
- **Use Case**: Quick prototyping, testing
- **Features**: 
  - Online IDE
  - AI assistant
  - Immediate execution
- **When to Use**: Experimentation, learning, quick tests

## How It Works

### Step Structure

Each step now includes:

1. **AI Tool Assignment**: Which tool to use for this step
2. **Tool Instructions**: Step-by-step how to use the tool
3. **Example Prompts**: Real examples of prompts to use
4. **Prompt Template**: Template for writing effective prompts
5. **Pro Tips**: Tips for using the tool effectively

### Example Step

```typescript
{
  id: 'skeleton-1',
  title: 'Create App Component',
  aiTool: 'cursor',
  toolInstructions: [
    'Open Cursor and navigate to src/App.tsx',
    'Press Cmd+K to open inline edit',
    'Type your prompt describing the App component',
    'Review the generated code and accept if correct',
  ],
  examplePrompts: [
    'Create a React App component with a title "My Todo App" centered on the page',
    'Build the main App component with a header and container using Tailwind CSS',
  ],
  promptTemplate: `Create a React App component that:
- Is the root component of the application
- Has a title "My Todo App"
- Uses Tailwind CSS for styling
- Has a centered layout`,
  toolTips: [
    'Be specific about what you want in the component',
    'Mention styling preferences (Tailwind CSS)',
    'Review generated code before accepting',
  ],
}
```

## AI Tool Guide Component

The **AI Tool Guide** panel (middle column) shows:

- **Tool Information**: Name, description, use case
- **How to Use**: Step-by-step instructions
- **Example Prompts**: Real prompts for the current step
- **Prompt Template**: Template to follow
- **Pro Tips**: Best practices

## Learning Flow

1. **Student selects a step** → Sees which AI tool to use
2. **AI Tool Guide appears** → Shows how to use the tool
3. **Student follows instructions** → Uses the tool as guided
4. **Student writes prompts** → Based on examples and templates
5. **Code is generated** → Student reviews and learns
6. **Next step unlocks** → New tool or new use of same tool

## Benefits

✅ **Tool-Specific Learning**: Students learn each tool's strengths
✅ **Real Examples**: Actual prompts they can use
✅ **Best Practices**: Tips for effective tool usage
✅ **Progressive Learning**: Start simple, get more advanced
✅ **Practical Skills**: Learn tools they'll use in real projects

## Curriculum Examples

### Step 1: Create App Component
- **Tool**: Cursor (inline edit)
- **Learn**: How to use Cmd+K for quick code generation
- **Prompt**: "Create a React App component..."

### Step 2: Build TodoList Component
- **Tool**: V0
- **Learn**: How to use V0 for UI components
- **Prompt**: "Create a todo list component..."

### Step 3: Add State Management
- **Tool**: Cursor Chat
- **Learn**: How to ask questions and learn concepts
- **Prompt**: "How do I use useState to manage todos?"

### Step 4: Create Form Component
- **Tool**: Cursor Composer
- **Learn**: How to generate multiple files
- **Prompt**: "Create a TodoForm component with..."

### Step 5: Create API Endpoints
- **Tool**: Cursor
- **Learn**: How to generate API routes
- **Prompt**: "Create REST API endpoints for todos..."

## Key Features

1. **Tool-Specific Instructions**: Each step tells you exactly how to use the tool
2. **Example Prompts**: Real prompts you can copy and adapt
3. **Prompt Templates**: Structured templates for writing prompts
4. **Pro Tips**: Best practices for each tool
5. **Visual Guide**: AI Tool Guide panel shows everything you need

## Next Steps

Students will learn:
- ✅ Which tool to use for each task
- ✅ How to use each tool effectively
- ✅ How to write good prompts
- ✅ When to use which tool
- ✅ Best practices for AI-assisted development

This creates a **complete learning system** that teaches students not just to code, but to use AI tools effectively to build applications faster and better.

