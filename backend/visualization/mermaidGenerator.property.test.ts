import * as fc from 'fast-check';
import { MermaidGenerator } from './mermaidGenerator';
import { FlowElement, VisualizationRequest } from '../shared/types/interfaces';

/**
 * Property-Based Tests for Mermaid Generator
 * Feature: drishya-code, Property 3: Control Flow Visualization Accuracy
 * 
 * Validates: Requirements 1.2, 1.3, 1.4
 */

describe('MermaidGenerator - Property-Based Tests', () => {
  const generator = new MermaidGenerator();

  // Arbitrary for generating flow elements
  const flowElementArbitrary = fc.record({
    id: fc.oneof(
      fc.constant('start'),
      fc.constant('end'),
      fc.string({ minLength: 1, maxLength: 10 }).map((s) => `process_${s}`),
      fc.string({ minLength: 1, maxLength: 10 }).map((s) => `decision_${s}`),
      fc.string({ minLength: 1, maxLength: 10 }).map((s) => `loop_${s}`)
    ),
    type: fc.oneof(
      fc.constant('start' as const),
      fc.constant('end' as const),
      fc.constant('process' as const),
      fc.constant('decision' as const),
      fc.constant('loop' as const),
      fc.constant('function' as const)
    ),
    content: fc.string({ minLength: 1, maxLength: 50 }),
    codeLines: fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 5 }),
    children: fc.array(fc.string(), { maxLength: 3 }),
    metadata: fc.record({
      complexity: fc.integer({ min: 0, max: 10 }),
      nestingLevel: fc.integer({ min: 0, max: 5 }),
    }),
  });

  describe('Property 3.1: Control flow visualization accuracy', () => {
    it('should always generate valid Mermaid syntax for any flow elements', () => {
      fc.assert(
        fc.property(
          fc.array(flowElementArbitrary, { minLength: 1, maxLength: 20 }),
          (flowElements) => {
            const request: VisualizationRequest = {
              flowElements: flowElements as FlowElement[],
              preferences: {
                theme: 'light',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result = generator.generate(request);

            // Should always produce output
            expect(result).toBeDefined();
            expect(result.mermaidSyntax).toBeDefined();
            expect(typeof result.mermaidSyntax).toBe('string');

            // Should start with flowchart declaration
            expect(result.mermaidSyntax).toContain('flowchart');

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly represent decision points with diamond shapes', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 10 }).map((s) => `decision_${s}`),
              type: fc.constant('decision' as const),
              content: fc.string({ minLength: 1, maxLength: 30 }),
              codeLines: fc.array(fc.integer({ min: 1, max: 50 }), { minLength: 1 }),
              children: fc.array(fc.string(), { maxLength: 2 }),
              metadata: fc.record({
                complexity: fc.integer({ min: 0, max: 5 }),
                nestingLevel: fc.integer({ min: 0, max: 3 }),
              }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (decisions) => {
            const request: VisualizationRequest = {
              flowElements: decisions as FlowElement[],
              preferences: {
                theme: 'light',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result = generator.generate(request);

            // All decision nodes should use diamond shape {}
            decisions.forEach((decision) => {
              const sanitizedId = decision.id.replace(/[^a-zA-Z0-9_]/g, '_');
              expect(result.mermaidSyntax).toContain(`${sanitizedId}{`);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly represent loops with appropriate shapes', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 10 }).map((s) => `loop_${s}`),
              type: fc.constant('loop' as const),
              content: fc.oneof(
                fc.constant('for i in range(10)'),
                fc.constant('while x < 10'),
                fc.constant('do...while')
              ),
              codeLines: fc.array(fc.integer({ min: 1, max: 50 }), { minLength: 1 }),
              children: fc.array(fc.string(), { maxLength: 2 }),
              metadata: fc.record({
                complexity: fc.integer({ min: 1, max: 5 }),
                nestingLevel: fc.integer({ min: 0, max: 3 }),
              }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (loops) => {
            const request: VisualizationRequest = {
              flowElements: loops as FlowElement[],
              preferences: {
                theme: 'light',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result = generator.generate(request);

            // All loop nodes should use subroutine shape [[]]
            loops.forEach((loop) => {
              const sanitizedId = loop.id.replace(/[^a-zA-Z0-9_]/g, '_');
              expect(result.mermaidSyntax).toContain(`${sanitizedId}[[`);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly represent function calls with distinct blocks', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 10 }).map((s) => `function_${s}`),
              type: fc.constant('function' as const),
              content: fc.string({ minLength: 1, maxLength: 30 }),
              codeLines: fc.array(fc.integer({ min: 1, max: 50 }), { minLength: 1 }),
              children: fc.array(fc.string(), { maxLength: 2 }),
              metadata: fc.record({
                complexity: fc.integer({ min: 0, max: 5 }),
                nestingLevel: fc.integer({ min: 0, max: 3 }),
              }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (functions) => {
            const request: VisualizationRequest = {
              flowElements: functions as FlowElement[],
              preferences: {
                theme: 'light',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result = generator.generate(request);

            // All function nodes should use cylindrical shape [()]
            functions.forEach((func) => {
              const sanitizedId = func.id.replace(/[^a-zA-Z0-9_]/g, '_');
              expect(result.mermaidSyntax).toContain(`${sanitizedId}[(`);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain element mapping consistency', () => {
      fc.assert(
        fc.property(
          fc.array(flowElementArbitrary, { minLength: 1, maxLength: 15 }),
          (flowElements) => {
            const request: VisualizationRequest = {
              flowElements: flowElements as FlowElement[],
              preferences: {
                theme: 'light',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result = generator.generate(request);

            // Element mapping should match input elements
            expect(result.elementMapping.length).toBe(flowElements.length);

            // Each element should have a mapping
            flowElements.forEach((element) => {
              const mapping = result.elementMapping.find((m) => m.elementId === element.id);
              expect(mapping).toBeDefined();
              expect(mapping?.codeLines).toEqual(element.codeLines);
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should create interaction points for all elements', () => {
      fc.assert(
        fc.property(
          fc.array(flowElementArbitrary, { minLength: 1, maxLength: 15 }),
          (flowElements) => {
            const request: VisualizationRequest = {
              flowElements: flowElements as FlowElement[],
              preferences: {
                theme: 'light',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result = generator.generate(request);

            // Should have click and hover interactions for each element
            flowElements.forEach((element) => {
              const clickPoint = result.interactionPoints.find(
                (p) => p.elementId === element.id && p.type === 'click'
              );
              const hoverPoint = result.interactionPoints.find(
                (p) => p.elementId === element.id && p.type === 'hover'
              );

              expect(clickPoint).toBeDefined();
              expect(hoverPoint).toBeDefined();
            });

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle all theme variations', () => {
      fc.assert(
        fc.property(
          fc.array(flowElementArbitrary, { minLength: 1, maxLength: 10 }),
          fc.oneof(fc.constant('light'), fc.constant('dark'), fc.constant('cultural')),
          (flowElements, theme) => {
            const request: VisualizationRequest = {
              flowElements: flowElements as FlowElement[],
              preferences: {
                theme: theme as 'light' | 'dark' | 'cultural',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result = generator.generate(request);

            // Should contain style definitions
            expect(result.mermaidSyntax).toContain('style');
            expect(result.mermaidSyntax).toContain('fill:');

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should properly escape special characters in content', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.string({ minLength: 1, maxLength: 10 }),
              type: fc.constant('process' as const),
              content: fc.string({ minLength: 1, maxLength: 30 }),
              codeLines: fc.array(fc.integer({ min: 1, max: 50 }), { minLength: 1 }),
              children: fc.constant([]),
              metadata: fc.record({
                complexity: fc.constant(0),
                nestingLevel: fc.constant(0),
              }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (elements) => {
            const request: VisualizationRequest = {
              flowElements: elements as FlowElement[],
              preferences: {
                theme: 'light',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result = generator.generate(request);

            // Should not contain unescaped special characters
            const lines = result.mermaidSyntax.split('\n');
            lines.forEach((line) => {
              if (line.includes('[') && line.includes(']')) {
                // Check that < and > are escaped
                if (line.includes('<') || line.includes('>')) {
                  expect(line).toMatch(/#lt;|#gt;/);
                }
              }
            });

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should generate valid syntax that passes validation', () => {
      fc.assert(
        fc.property(
          fc.array(flowElementArbitrary, { minLength: 2, maxLength: 10 }),
          (flowElements) => {
            const request: VisualizationRequest = {
              flowElements: flowElements as FlowElement[],
              preferences: {
                theme: 'light',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result = generator.generate(request);
            const validation = generator.validateSyntax(result.mermaidSyntax);

            // Generated syntax should be valid
            expect(validation.valid).toBe(true);
            expect(validation.errors).toHaveLength(0);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Layout consistency', () => {
    it('should generate consistent output for same input', () => {
      fc.assert(
        fc.property(
          fc.array(flowElementArbitrary, { minLength: 1, maxLength: 10 }),
          (flowElements) => {
            const request: VisualizationRequest = {
              flowElements: flowElements as FlowElement[],
              preferences: {
                theme: 'light',
                complexity: 'detailed',
                language: 'english',
              },
            };

            const result1 = generator.generate(request);
            const result2 = generator.generate(request);

            // Should produce identical results
            expect(result1.mermaidSyntax).toBe(result2.mermaidSyntax);
            expect(result1.elementMapping.length).toBe(result2.elementMapping.length);

            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
