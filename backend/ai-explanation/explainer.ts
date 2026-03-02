import { FlowElement } from '../shared/types/interfaces';

/**
 * AI Code Explainer
 * Generates simple explanations for code without external AI APIs
 * For demo purposes - can be replaced with Bedrock/OpenAI later
 */

export class CodeExplainer {
  /**
   * Generate explanation for the entire code
   */
  explainCode(code: string, flowElements: FlowElement[]): string {
    const elementCount = flowElements.length;
    
    let explanation = `This program has ${elementCount} main components:\n\n`;
    
    // Analyze flow elements
    const decisions = flowElements.filter(el => el.type === 'decision');
    const loops = flowElements.filter(el => el.type === 'loop');
    const functions = flowElements.filter(el => el.type === 'function');
    
    if (functions.length > 0) {
      explanation += `📦 Functions: ${functions.length}\n`;
      functions.forEach(fn => {
        explanation += `   - ${fn.content}\n`;
      });
      explanation += '\n';
    }
    
    if (decisions.length > 0) {
      explanation += `🔀 Conditional Statements: ${decisions.length}\n`;
      decisions.forEach(dec => {
        explanation += `   - ${dec.content}\n`;
      });
      explanation += '\n';
    }
    
    if (loops.length > 0) {
      explanation += `🔄 Loops: ${loops.length}\n`;
      loops.forEach(loop => {
        explanation += `   - ${loop.content}\n`;
      });
      explanation += '\n';
    }
    
    explanation += `\n💡 Program Flow:\n`;
    explanation += `1. The program starts execution\n`;
    
    let step = 2;
    flowElements.slice(1, -1).forEach(element => {
      if (element.type === 'function') {
        explanation += `${step}. Defines a function: ${element.content}\n`;
      } else if (element.type === 'decision') {
        explanation += `${step}. Makes a decision: ${element.content}\n`;
      } else if (element.type === 'loop') {
        explanation += `${step}. Repeats: ${element.content}\n`;
      } else if (element.type === 'process') {
        explanation += `${step}. Executes: ${element.content}\n`;
      }
      step++;
    });
    
    explanation += `${step}. Program ends\n`;
    
    return explanation;
  }

  /**
   * Generate explanation for a specific flow element
   */
  explainElement(element: FlowElement, _context: FlowElement[]): string {
    let explanation = '';
    
    switch (element.type) {
      case 'start':
        explanation = '🚀 This is where the program begins execution.';
        break;
        
      case 'end':
        explanation = '🏁 This is where the program completes execution.';
        break;
        
      case 'process':
        explanation = `⚙️ This step executes: "${element.content}"\n\n`;
        explanation += this.explainProcessStatement(element.content);
        break;
        
      case 'decision':
        explanation = `🔀 This is a decision point: "${element.content}"\n\n`;
        explanation += 'The program checks a condition and chooses different paths based on whether it\'s true or false.';
        break;
        
      case 'loop':
        explanation = `🔄 This is a loop: "${element.content}"\n\n`;
        explanation += 'The program repeats the code inside this loop multiple times until a condition is met.';
        break;
        
      case 'function':
        explanation = `📦 This defines a function: "${element.content}"\n\n`;
        explanation += 'A function is a reusable block of code that can be called multiple times with different inputs.';
        break;
        
      default:
        explanation = `This is a ${element.type} element: ${element.content}`;
    }
    
    return explanation;
  }

  /**
   * Explain a process statement
   */
  private explainProcessStatement(statement: string): string {
    const lower = statement.toLowerCase();
    
    if (lower.includes('print')) {
      return 'This displays output to the screen.';
    }
    
    if (lower.includes('=') && !lower.includes('==')) {
      return 'This assigns a value to a variable, storing it in memory for later use.';
    }
    
    if (lower.includes('return')) {
      return 'This returns a value from a function back to where it was called.';
    }
    
    if (lower.includes('input')) {
      return 'This gets input from the user.';
    }
    
    if (lower.includes('append') || lower.includes('add')) {
      return 'This adds an item to a collection.';
    }
    
    return 'This performs an operation or calculation.';
  }

  /**
   * Generate learning tips based on code complexity
   */
  generateTips(flowElements: FlowElement[], complexity: number): string[] {
    const tips: string[] = [];
    
    const hasLoops = flowElements.some(el => el.type === 'loop');
    const hasDecisions = flowElements.some(el => el.type === 'decision');
    const hasFunctions = flowElements.some(el => el.type === 'function');
    
    if (hasFunctions) {
      tips.push('💡 Functions help organize code into reusable pieces');
    }
    
    if (hasLoops) {
      tips.push('🔄 Loops let you repeat actions without writing the same code multiple times');
    }
    
    if (hasDecisions) {
      tips.push('🔀 Conditional statements let your program make decisions');
    }
    
    if (complexity > 5) {
      tips.push('⚠️ This code has moderate complexity - try breaking it into smaller functions');
    } else if (complexity <= 2) {
      tips.push('✅ This code is simple and easy to understand');
    }
    
    tips.push('📚 Try modifying the code to see how the flowchart changes');
    
    return tips;
  }
}
