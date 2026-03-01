import { PythonParser } from './parser';

describe('PythonParser', () => {
  let parser: PythonParser;

  beforeEach(() => {
    parser = new PythonParser();
  });

  describe('parse', () => {
    it('should parse simple Python code', () => {
      const code = `x = 5
y = 10
print(x + y)`;

      const result = parser.parse(code);

      expect(result.flowElements.length).toBeGreaterThan(0);
      expect(result.flowElements[0].type).toBe('start');
      expect(result.flowElements[result.flowElements.length - 1].type).toBe('end');
      expect(result.errors).toHaveLength(0);
    });

    it('should detect if statements', () => {
      const code = `if x > 5:
    print("greater")`;

      const result = parser.parse(code);
      const decisionElements = result.flowElements.filter((el) => el.type === 'decision');

      expect(decisionElements.length).toBeGreaterThan(0);
      expect(decisionElements[0].content).toContain('if');
    });

    it('should detect loops', () => {
      const code = `for i in range(10):
    print(i)`;

      const result = parser.parse(code);
      const loopElements = result.flowElements.filter((el) => el.type === 'loop');

      expect(loopElements.length).toBeGreaterThan(0);
      expect(loopElements[0].content).toContain('for');
    });

    it('should detect function definitions', () => {
      const code = `def add(a, b):
    return a + b`;

      const result = parser.parse(code);
      const functionElements = result.flowElements.filter((el) => el.type === 'function');

      expect(functionElements.length).toBeGreaterThan(0);
      expect(functionElements[0].content).toContain('def');
    });

    it('should handle list comprehensions', () => {
      const code = `squares = [x**2 for x in range(10)]`;

      const result = parser.parse(code);

      expect(result.errors).toHaveLength(0);
      expect(result.flowElements.length).toBeGreaterThan(0);
    });

    it('should handle decorators', () => {
      const code = `@decorator
def my_function():
    pass`;

      const result = parser.parse(code);

      expect(result.errors).toHaveLength(0);
      expect(result.flowElements.some((el) => el.type === 'function')).toBe(true);
    });

    it('should handle context managers', () => {
      const code = `with open('file.txt') as f:
    content = f.read()`;

      const result = parser.parse(code);

      expect(result.errors).toHaveLength(0);
      expect(result.flowElements.length).toBeGreaterThan(0);
    });

    it('should skip comments and empty lines', () => {
      const code = `# This is a comment
x = 5

# Another comment
y = 10`;

      const result = parser.parse(code);
      const processElements = result.flowElements.filter((el) => el.type === 'process');

      // Should only have 2 process elements (x = 5 and y = 10)
      expect(processElements.length).toBe(2);
    });
  });

  describe('calculateComplexity', () => {
    it('should calculate cyclomatic complexity', () => {
      const code = `if x > 5:
    print("a")
elif x > 3:
    print("b")
else:
    print("c")`;

      const result = parser.parse(code);

      expect(result.complexity.cyclomaticComplexity).toBeGreaterThan(1);
    });

    it('should calculate cognitive complexity with nesting', () => {
      const code = `if x > 5:
    if y > 3:
        print("nested")`;

      const result = parser.parse(code);

      expect(result.complexity.cognitiveComplexity).toBeGreaterThan(
        result.complexity.cyclomaticComplexity
      );
    });

    it('should count lines of code correctly', () => {
      const code = `x = 5
y = 10
# comment
print(x + y)`;

      const result = parser.parse(code);

      expect(result.complexity.linesOfCode).toBe(3); // Excludes comment
    });
  });

  describe('validateSyntax', () => {
    it('should detect unmatched parentheses', () => {
      const code = `print("hello"`;

      const errors = parser.validateSyntax(code);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes('parentheses'))).toBe(true);
    });

    it('should detect unmatched brackets', () => {
      const code = `arr = [1, 2, 3`;

      const errors = parser.validateSyntax(code);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes('brackets'))).toBe(true);
    });

    it('should detect inconsistent indentation', () => {
      const code = `if True:
  print("2 spaces")
    print("4 spaces")`;

      const errors = parser.validateSyntax(code);

      expect(errors.some((e) => e.message.includes('indentation'))).toBe(true);
    });

    it('should pass valid Python code', () => {
      const code = `def add(a, b):
    return a + b

result = add(5, 3)
print(result)`;

      const errors = parser.validateSyntax(code);

      expect(errors).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty code', () => {
      const code = '';

      const result = parser.parse(code);

      expect(result.flowElements.length).toBe(2); // start and end
      expect(result.errors).toHaveLength(0);
    });

    it('should handle code with only comments', () => {
      const code = `# Comment 1
# Comment 2`;

      const result = parser.parse(code);

      expect(result.flowElements.length).toBe(2); // start and end
    });

    it('should handle very long lines', () => {
      const longLine = 'x = ' + '1 + '.repeat(100) + '1';

      const result = parser.parse(longLine);

      expect(result.errors).toHaveLength(0);
    });

    it('should handle nested structures', () => {
      const code = `for i in range(10):
    if i % 2 == 0:
        for j in range(i):
            print(j)`;

      const result = parser.parse(code);

      expect(result.flowElements.some((el) => el.metadata.nestingLevel > 1)).toBe(true);
    });
  });
});
