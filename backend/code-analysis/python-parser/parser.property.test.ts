import * as fc from 'fast-check';
import { PythonParser } from './parser';

/**
 * Property-Based Tests for Python Parser
 * Feature: drishya-code, Property 2: Multi-Language Parsing Completeness
 * 
 * Validates: Requirements 1.5, 9.1, 9.5
 */

describe('PythonParser - Property-Based Tests', () => {
  const parser = new PythonParser();

  describe('Property 2.1: Python parsing completeness', () => {
    it('should successfully parse any valid Python code without crashing', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              fc.constant('x = 5'),
              fc.constant('y = 10'),
              fc.constant('print("hello")'),
              fc.constant('if x > 5:\n    print("yes")'),
              fc.constant('for i in range(10):\n    print(i)'),
              fc.constant('def func():\n    pass'),
              fc.constant('# comment'),
              fc.constant('')
            ),
            { minLength: 0, maxLength: 20 }
          ),
          (codeLines) => {
            const code = codeLines.join('\n');

            // Should not throw
            const result = parser.parse(code);

            // Should always return a result
            expect(result).toBeDefined();
            expect(result.flowElements).toBeDefined();
            expect(result.errors).toBeDefined();
            expect(result.complexity).toBeDefined();

            // Should always have start and end elements
            expect(result.flowElements.length).toBeGreaterThanOrEqual(2);
            expect(result.flowElements[0].type).toBe('start');
            expect(result.flowElements[result.flowElements.length - 1].type).toBe('end');

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain semantic accuracy - all flow elements should have valid code line references', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              fc.constant('x = 5'),
              fc.constant('if True:\n    pass'),
              fc.constant('for i in range(5):\n    print(i)')
            ),
            { minLength: 1, maxLength: 10 }
          ),
          (codeLines) => {
            const code = codeLines.join('\n');
            const totalLines = code.split('\n').length;

            const result = parser.parse(code);

            // All flow elements should have valid line numbers
            result.flowElements.forEach((element) => {
              element.codeLines.forEach((lineNum) => {
                expect(lineNum).toBeGreaterThanOrEqual(0);
                expect(lineNum).toBeLessThanOrEqual(totalLines);
              });
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify control flow structures', () => {
      fc.assert(
        fc.property(
          fc.record({
            ifStatements: fc.integer({ min: 0, max: 5 }),
            forLoops: fc.integer({ min: 0, max: 5 }),
            whileLoops: fc.integer({ min: 0, max: 3 }),
            functions: fc.integer({ min: 0, max: 3 }),
          }),
          (counts) => {
            const codeLines: string[] = [];

            // Generate if statements
            for (let i = 0; i < counts.ifStatements; i++) {
              codeLines.push(`if x > ${i}:\n    pass`);
            }

            // Generate for loops
            for (let i = 0; i < counts.forLoops; i++) {
              codeLines.push(`for i in range(${i + 1}):\n    pass`);
            }

            // Generate while loops
            for (let i = 0; i < counts.whileLoops; i++) {
              codeLines.push(`while x < ${i + 10}:\n    x += 1`);
            }

            // Generate functions
            for (let i = 0; i < counts.functions; i++) {
              codeLines.push(`def func${i}():\n    pass`);
            }

            const code = codeLines.join('\n');
            const result = parser.parse(code);

            // Count detected structures
            const detectedIfs = result.flowElements.filter((el) => el.type === 'decision').length;
            const detectedLoops = result.flowElements.filter((el) => el.type === 'loop').length;
            const detectedFuncs = result.flowElements.filter((el) => el.type === 'function')
              .length;

            // Should detect at least some of each structure type
            expect(detectedIfs).toBeGreaterThanOrEqual(counts.ifStatements);
            expect(detectedLoops).toBeGreaterThanOrEqual(counts.forLoops + counts.whileLoops);
            expect(detectedFuncs).toBeGreaterThanOrEqual(counts.functions);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate complexity metrics consistently', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.oneof(
              fc.constant('x = 5'),
              fc.constant('if x > 5:\n    pass'),
              fc.constant('for i in range(10):\n    pass')
            ),
            { minLength: 1, maxLength: 15 }
          ),
          (codeLines) => {
            const code = codeLines.join('\n');

            const result = parser.parse(code);

            // Complexity should be non-negative
            expect(result.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(0);
            expect(result.complexity.cognitiveComplexity).toBeGreaterThanOrEqual(0);
            expect(result.complexity.linesOfCode).toBeGreaterThanOrEqual(0);

            // Cyclomatic complexity should be at least 1 for any code
            if (code.trim().length > 0) {
              expect(result.complexity.cyclomaticComplexity).toBeGreaterThanOrEqual(1);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle list comprehensions without errors', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 20 }),
          fc.oneof(fc.constant('**2'), fc.constant('*2'), fc.constant('+1')),
          (limit, operation) => {
            const code = `result = [x${operation} for x in range(${limit})]`;

            const result = parser.parse(code);

            // Should parse without critical errors
            const criticalErrors = result.errors.filter((e) => e.severity === 'error');
            expect(criticalErrors).toHaveLength(0);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve code structure - parsing twice should yield same results', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constant('x = 5\nif x > 3:\n    print(x)'), { minLength: 1, maxLength: 3 }),
          (codeLines) => {
            const code = codeLines.join('\n');

            const result1 = parser.parse(code);
            const result2 = parser.parse(code);

            // Should produce consistent results
            expect(result1.flowElements.length).toBe(result2.flowElements.length);
            expect(result1.complexity.cyclomaticComplexity).toBe(
              result2.complexity.cyclomaticComplexity
            );

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property: Syntax validation correctness', () => {
    it('should detect all unmatched brackets', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 0, max: 9 }),
          (open, close) => {
            fc.pre(open !== close); // Only test unmatched cases

            const openBrackets = '('.repeat(open);
            const closeBrackets = ')'.repeat(close);
            const code = `print(${openBrackets}x${closeBrackets})`;

            const errors = parser.validateSyntax(code);

            // Should detect the mismatch
            expect(errors.length).toBeGreaterThan(0);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should accept valid code with matched brackets', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }),
          (depth) => {
            const openBrackets = '('.repeat(depth);
            const closeBrackets = ')'.repeat(depth);
            const code = `result = ${openBrackets}x + 1${closeBrackets}`;

            const errors = parser.validateSyntax(code);

            // Should not report bracket errors
            const bracketErrors = errors.filter((e) => e.message.includes('parentheses'));
            expect(bracketErrors).toHaveLength(0);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
