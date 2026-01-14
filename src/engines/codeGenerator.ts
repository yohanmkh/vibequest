// Code generation engine that simulates AI code generation
import { CodeTemplate, GeneratedCode } from '../types/enhanced';

export class CodeGenerator {
  private codeTemplates: Map<string, CodeTemplate> = new Map();
  
  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    // React Component Template
    this.codeTemplates.set('react-component', {
      filePath: 'src/components/{ComponentName}.tsx',
      content: `import React from 'react';

interface {ComponentName}Props {
  // Add props here
}

export function {ComponentName}({ }: {ComponentName}Props) {
  return (
    <div className="p-4">
      <h2>{ComponentName}</h2>
      {/* Add content here */}
    </div>
  );
}`,
      language: 'tsx',
      editable: true,
      placeholders: [
        {
          id: 'ComponentName',
          type: 'component',
          hint: 'Component name (PascalCase)',
        },
      ],
    });

    // API Route Template
    this.codeTemplates.set('api-route', {
      filePath: 'src/api/{routeName}.ts',
      content: `import { Request, Response } from 'express';

export async function {handlerName}(req: Request, res: Response) {
  try {
    // Add your logic here
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}`,
      language: 'typescript',
      editable: true,
      placeholders: [
        {
          id: 'routeName',
          type: 'variable',
          hint: 'Route name (kebab-case)',
        },
        {
          id: 'handlerName',
          type: 'function',
          hint: 'Handler function name (camelCase)',
        },
      ],
    });

    // Test Template
    this.codeTemplates.set('test-file', {
      filePath: 'src/__tests__/{componentName}.test.tsx',
      content: `import { render, screen } from '@testing-library/react';
import { {ComponentName} } from '../components/{ComponentName}';

describe('{ComponentName}', () => {
  it('renders correctly', () => {
    render(<{ComponentName} />);
    expect(screen.getByText('{ComponentName}')).toBeInTheDocument();
  });
});`,
      language: 'tsx',
      editable: true,
      placeholders: [
        {
          id: 'ComponentName',
          type: 'component',
          hint: 'Component name',
        },
        {
          id: 'componentName',
          type: 'variable',
          hint: 'Component name (camelCase)',
        },
      ],
    });
  }

  /**
   * Generate code from a template
   */
  generateFromTemplate(
    templateId: string,
    replacements: Record<string, string>
  ): GeneratedCode | null {
    const template = this.codeTemplates.get(templateId);
    if (!template) return null;

    let content = template.content;
    let filePath = template.filePath;

    // Replace placeholders
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      content = content.replace(regex, value);
      filePath = filePath.replace(regex, value);
    });

    return {
      filePath,
      content,
      language: template.language,
      timestamp: Date.now(),
      generatedBy: 'ai',
    };
  }

  /**
   * Generate code based on a prompt (simulated AI response)
   */
  generateFromPrompt(prompt: string, _context: unknown): GeneratedCode[] {
    const results: GeneratedCode[] = [];
    
    // Analyze prompt and generate appropriate code
    if (prompt.toLowerCase().includes('component')) {
      const componentName = this.extractComponentName(prompt) || 'MyComponent';
      const code = this.generateFromTemplate('react-component', {
        ComponentName: componentName,
      });
      if (code) results.push(code);
    }

    if (prompt.toLowerCase().includes('api') || prompt.toLowerCase().includes('endpoint')) {
      const routeName = this.extractRouteName(prompt) || 'users';
      const handlerName = this.toCamelCase(routeName);
      const code = this.generateFromTemplate('api-route', {
        routeName,
        handlerName,
      });
      if (code) results.push(code);
    }

    return results;
  }

  /**
   * Assess prompt quality and return a score (0-1)
   */
  assessPromptQuality(prompt: string): number {
    let score = 0;
    
    // Length check (longer prompts are usually better)
    if (prompt.length > 50) score += 0.2;
    if (prompt.length > 100) score += 0.1;
    
    // Specificity indicators
    if (prompt.includes('with')) score += 0.1;
    if (prompt.includes('using')) score += 0.1;
    if (prompt.includes('for')) score += 0.1;
    
    // Technical terms
    const techTerms = ['component', 'function', 'api', 'endpoint', 'database', 'styling', 'responsive'];
    techTerms.forEach(term => {
      if (prompt.toLowerCase().includes(term)) score += 0.05;
    });
    
    // Best practices
    if (prompt.includes('TypeScript')) score += 0.1;
    if (prompt.includes('Tailwind')) score += 0.1;
    if (prompt.includes('test')) score += 0.1;
    
    return Math.min(1, score);
  }

  /**
   * Generate a realistic error based on code
   */
  generateError(_code: string, errorType: 'syntax' | 'type' | 'runtime' | 'logic'): string {
    const errors = {
      syntax: "SyntaxError: Unexpected token '}'",
      type: "TypeError: Cannot read property 'map' of undefined",
      runtime: "ReferenceError: 'variableName' is not defined",
      logic: "Error: Component is missing required prop 'onClick'",
    };
    
    return errors[errorType] || errors.runtime;
  }

  private extractComponentName(prompt: string): string | null {
    const match = prompt.match(/(?:create|build|make)\s+(?:a\s+)?([A-Z][a-zA-Z]*\s*Component?)/i);
    return match ? match[1].replace(/\s+/g, '') : null;
  }

  private extractRouteName(prompt: string): string | null {
    const match = prompt.match(/(?:api|endpoint|route)\s+(?:for\s+)?([a-z-]+)/i);
    return match ? match[1] : null;
  }

  private toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  /**
   * Get code suggestions based on current code
   */
  getCodeSuggestions(code: string, language: string): string[] {
    const suggestions: string[] = [];
    
    if (language === 'tsx' || language === 'jsx') {
      if (!code.includes('import React')) {
        suggestions.push("Add 'import React from \"react\"' at the top");
      }
      if (code.includes('function') && !code.includes('export')) {
        suggestions.push("Consider exporting this component");
      }
      if (code.includes('onClick') && !code.includes('handle')) {
        suggestions.push("Consider using a handler function for onClick");
      }
    }
    
    return suggestions;
  }
}

export const codeGenerator = new CodeGenerator();

