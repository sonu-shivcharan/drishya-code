import { FlowElement, AbstractSyntaxTree, CodeError, ComplexityMetrics } from '../../shared/types/interfaces';

/**
 * Python Code Parser
 * Parses Python code and extracts flow elements for visualization
 */

export class PythonParser {
  /**
   * Parse Python code and extract flow elements
   */
  parse(code: string): {
    ast: AbstractSyntaxTree;
    flowElements: FlowElement[];
    errors: CodeError[];
    complexity: ComplexityMetrics;
  } {
    try {
      // TODO: Implement actual Python AST parsing
      // For now, return a basic structure
      const lines = code.split('\n');
      const flowElements = this.extractFlowElements(code);
      const complexity = this.calculateComplexity(code);

      return {
        ast: {
          language: 'python',
          rootNode: {
            type: 'Module',
            children: [],
            position: { line: 1, column: 0, endLine: lines.length, endColumn: 0 },
            semanticInfo: {},
          },
          metadata: {
            totalLines: lines.length,
            totalNodes: flowElements.length,
          },
        },
        flowElements,
        errors: [],
        complexity,
      };
    } catch (error) {
      return {
        ast: {
          language: 'python',
          rootNode: {
            type: 'Module',
            children: [],
            position: { line: 0, column: 0, endLine: 0, endColumn: 0 },
            semanticInfo: {},
          },
          metadata: { totalLines: 0, totalNodes: 0 },
        },
        flowElements: [],
        errors: [
          {
            line: 0,
            column: 0,
            message: error instanceof Error ? error.message : 'Unknown parsing error',
            type: 'syntax',
            severity: 'error',
          },
        ],
        complexity: { cyclomaticComplexity: 0, cognitiveComplexity: 0, linesOfCode: 0 },
      };
    }
  }

  /**
   * Extract flow elements from Python code
   */
  private extractFlowElements(code: string): FlowElement[] {
    const elements: FlowElement[] = [];
    const lines = code.split('\n');

    // Add start element
    elements.push({
      id: 'start',
      type: 'start',
      content: 'Start',
      codeLines: [0],
      children: [],
      metadata: { complexity: 0, nestingLevel: 0 },
    });

    let elementId = 1;

    // Simple pattern matching for basic constructs
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNumber = i + 1;

      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue;

      // Detect if statements
      if (line.startsWith('if ') || line.includes(' if ')) {
        elements.push({
          id: `decision_${elementId++}`,
          type: 'decision',
          content: line.replace(':', ''),
          codeLines: [lineNumber],
          children: [],
          metadata: { complexity: 1, nestingLevel: this.getNestingLevel(lines[i]) },
        });
      }
      // Detect loops
      else if (line.startsWith('for ') || line.startsWith('while ')) {
        elements.push({
          id: `loop_${elementId++}`,
          type: 'loop',
          content: line.replace(':', ''),
          codeLines: [lineNumber],
          children: [],
          metadata: { complexity: 2, nestingLevel: this.getNestingLevel(lines[i]) },
        });
      }
      // Detect function definitions
      else if (line.startsWith('def ')) {
        elements.push({
          id: `function_${elementId++}`,
          type: 'function',
          content: line.replace(':', ''),
          codeLines: [lineNumber],
          children: [],
          metadata: { complexity: 1, nestingLevel: this.getNestingLevel(lines[i]) },
        });
      }
      // Regular process statements
      else if (line && !line.endsWith(':')) {
        elements.push({
          id: `process_${elementId++}`,
          type: 'process',
          content: line,
          codeLines: [lineNumber],
          children: [],
          metadata: { complexity: 0, nestingLevel: this.getNestingLevel(lines[i]) },
        });
      }
    }

    // Add end element
    elements.push({
      id: 'end',
      type: 'end',
      content: 'End',
      codeLines: [lines.length],
      children: [],
      metadata: { complexity: 0, nestingLevel: 0 },
    });

    return elements;
  }

  /**
   * Calculate nesting level based on indentation
   */
  private getNestingLevel(line: string): number {
    const leadingSpaces = line.length - line.trimStart().length;
    return Math.floor(leadingSpaces / 4); // Assuming 4 spaces per indent
  }

  /**
   * Calculate complexity metrics
   */
  private calculateComplexity(code: string): ComplexityMetrics {
    const lines = code.split('\n').filter((line) => line.trim() && !line.trim().startsWith('#'));

    // Simple cyclomatic complexity: count decision points
    const decisionPoints = (code.match(/\b(if|elif|for|while|and|or)\b/g) || []).length;
    const cyclomaticComplexity = decisionPoints + 1;

    // Cognitive complexity: weighted by nesting
    let cognitiveComplexity = 0;
    lines.forEach((line) => {
      const nesting = this.getNestingLevel(line);
      if (line.trim().match(/\b(if|elif|for|while)\b/)) {
        cognitiveComplexity += 1 + nesting;
      }
    });

    return {
      cyclomaticComplexity,
      cognitiveComplexity,
      linesOfCode: lines.length,
    };
  }

  /**
   * Validate Python syntax
   */
  validateSyntax(code: string): CodeError[] {
    const errors: CodeError[] = [];
    const lines = code.split('\n');

    // Basic syntax validation
    let openParens = 0;
    let openBrackets = 0;
    let openBraces = 0;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for unmatched parentheses
      for (const char of line) {
        if (char === '(') openParens++;
        if (char === ')') openParens--;
        if (char === '[') openBrackets++;
        if (char === ']') openBrackets--;
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
      }

      // Check for invalid indentation
      if (line.length > 0 && line[0] === ' ') {
        const spaces = line.length - line.trimStart().length;
        if (spaces % 4 !== 0) {
          errors.push({
            line: lineNumber,
            column: 0,
            message: 'Inconsistent indentation (expected multiple of 4 spaces)',
            type: 'syntax',
            severity: 'warning',
          });
        }
      }
    });

    // Check for unmatched brackets at end
    if (openParens !== 0) {
      errors.push({
        line: lines.length,
        column: 0,
        message: 'Unmatched parentheses',
        type: 'syntax',
        severity: 'error',
      });
    }
    if (openBrackets !== 0) {
      errors.push({
        line: lines.length,
        column: 0,
        message: 'Unmatched brackets',
        type: 'syntax',
        severity: 'error',
      });
    }
    if (openBraces !== 0) {
      errors.push({
        line: lines.length,
        column: 0,
        message: 'Unmatched braces',
        type: 'syntax',
        severity: 'error',
      });
    }

    return errors;
  }
}
