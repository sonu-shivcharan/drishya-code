import { MermaidGenerator } from './mermaidGenerator';
import { FlowElement, VisualizationRequest } from '../shared/types/interfaces';

describe('MermaidGenerator', () => {
  let generator: MermaidGenerator;

  beforeEach(() => {
    generator = new MermaidGenerator();
  });

  const sampleFlowElements: FlowElement[] = [
    {
      id: 'start',
      type: 'start',
      content: 'Start',
      codeLines: [0],
      children: ['process_1'],
      metadata: { complexity: 0, nestingLevel: 0 },
    },
    {
      id: 'process_1',
      type: 'process',
      content: 'x = 5',
      codeLines: [1],
      children: ['decision_1'],
      metadata: { complexity: 0, nestingLevel: 0 },
    },
    {
      id: 'decision_1',
      type: 'decision',
      content: 'if x > 3',
      codeLines: [2],
      children: ['process_2', 'end'],
      metadata: { complexity: 1, nestingLevel: 0 },
    },
    {
      id: 'process_2',
      type: 'process',
      content: 'print(x)',
      codeLines: [3],
      children: ['end'],
      metadata: { complexity: 0, nestingLevel: 1 },
    },
    {
      id: 'end',
      type: 'end',
      content: 'End',
      codeLines: [4],
      children: [],
      metadata: { complexity: 0, nestingLevel: 0 },
    },
  ];

  describe('generate', () => {
    it('should generate valid Mermaid syntax', () => {
      const request: VisualizationRequest = {
        flowElements: sampleFlowElements,
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english',
        },
      };

      const result = generator.generate(request);

      expect(result.mermaidSyntax).toContain('flowchart TD');
      expect(result.elementMapping).toHaveLength(sampleFlowElements.length);
      expect(result.interactionPoints.length).toBeGreaterThan(0);
    });

    it('should use correct shapes for different element types', () => {
      const request: VisualizationRequest = {
        flowElements: sampleFlowElements,
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english',
        },
      };

      const result = generator.generate(request);

      // Start/End should use stadium shape ([])
      expect(result.mermaidSyntax).toContain('start([Start])');
      expect(result.mermaidSyntax).toContain('end([End])');

      // Decision should use diamond shape {}
      expect(result.mermaidSyntax).toContain('decision_1{if x #gt; 3}');

      // Process should use rectangle []
      expect(result.mermaidSyntax).toContain('process_1[x = 5]');
    });

    it('should apply theme colors', () => {
      const request: VisualizationRequest = {
        flowElements: sampleFlowElements,
        preferences: {
          theme: 'cultural',
          complexity: 'detailed',
          language: 'hindi',
        },
      };

      const result = generator.generate(request);

      // Should contain style definitions
      expect(result.mermaidSyntax).toContain('style');
      expect(result.mermaidSyntax).toContain('fill:');
    });

    it('should create element mappings', () => {
      const request: VisualizationRequest = {
        flowElements: sampleFlowElements,
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english',
        },
      };

      const result = generator.generate(request);

      result.elementMapping.forEach((mapping) => {
        expect(mapping.elementId).toBeDefined();
        expect(mapping.mermaidNodeId).toBeDefined();
        expect(mapping.codeLines).toBeDefined();
        expect(Array.isArray(mapping.codeLines)).toBe(true);
      });
    });

    it('should create interaction points', () => {
      const request: VisualizationRequest = {
        flowElements: sampleFlowElements,
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english',
        },
      };

      const result = generator.generate(request);

      // Should have click and hover interactions for each element
      const clickPoints = result.interactionPoints.filter((p) => p.type === 'click');
      const hoverPoints = result.interactionPoints.filter((p) => p.type === 'hover');

      expect(clickPoints.length).toBe(sampleFlowElements.length);
      expect(hoverPoints.length).toBe(sampleFlowElements.length);
    });

    it('should handle simplified complexity', () => {
      const longContent = 'This is a very long content that should be truncated in simplified mode';
      const elements: FlowElement[] = [
        {
          id: 'process_1',
          type: 'process',
          content: longContent,
          codeLines: [1],
          children: [],
          metadata: { complexity: 0, nestingLevel: 0 },
        },
      ];

      const request: VisualizationRequest = {
        flowElements: elements,
        preferences: {
          theme: 'light',
          complexity: 'simplified',
          language: 'english',
        },
      };

      const result = generator.generate(request);

      // Content should be truncated
      expect(result.mermaidSyntax).toContain('...');
    });

    it('should escape special characters', () => {
      const elements: FlowElement[] = [
        {
          id: 'process_1',
          type: 'process',
          content: 'if x > 5 && y < 10',
          codeLines: [1],
          children: [],
          metadata: { complexity: 0, nestingLevel: 0 },
        },
      ];

      const request: VisualizationRequest = {
        flowElements: elements,
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english',
        },
      };

      const result = generator.generate(request);

      // Special characters should be escaped
      expect(result.mermaidSyntax).toContain('#gt;');
      expect(result.mermaidSyntax).toContain('#lt;');
    });
  });

  describe('generateWithLayout', () => {
    it('should generate flowchart with specified layout', () => {
      const layouts: Array<'TD' | 'LR' | 'BT' | 'RL'> = ['TD', 'LR', 'BT', 'RL'];

      layouts.forEach((layout) => {
        const result = generator.generateWithLayout(sampleFlowElements, layout);
        expect(result).toContain(`flowchart ${layout}`);
      });
    });

    it('should default to TD layout', () => {
      const result = generator.generateWithLayout(sampleFlowElements);
      expect(result).toContain('flowchart TD');
    });
  });

  describe('generateMobileOptimized', () => {
    it('should generate simplified flowchart for mobile', () => {
      const result = generator.generateMobileOptimized(sampleFlowElements);

      expect(result).toContain('flowchart TD');
      expect(result).toBeDefined();
    });

    it('should truncate long content for mobile', () => {
      const longElements: FlowElement[] = [
        {
          id: 'process_1',
          type: 'process',
          content: 'This is a very long process description that needs truncation',
          codeLines: [1],
          children: [],
          metadata: { complexity: 0, nestingLevel: 0 },
        },
      ];

      const result = generator.generateMobileOptimized(longElements);
      expect(result).toContain('...');
    });
  });

  describe('validateSyntax', () => {
    it('should validate correct Mermaid syntax', () => {
      const validSyntax = `flowchart TD
    start([Start])
    end([End])
    start --> end`;

      const result = generator.validateSyntax(validSyntax);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing flowchart declaration', () => {
      const invalidSyntax = `start([Start])
    end([End])`;

      const result = generator.validateSyntax(invalidSyntax);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing flowchart declaration');
    });

    it('should detect unbalanced brackets', () => {
      const invalidSyntax = `flowchart TD
    start([Start)
    end([End])`;

      const result = generator.validateSyntax(invalidSyntax);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('brackets'))).toBe(true);
    });
  });

  describe('addSubgraph', () => {
    it('should add subgraph to existing Mermaid syntax', () => {
      const baseSyntax = `flowchart TD
    start([Start])
    process_1[Process 1]
    end([End])`;

      const result = generator.addSubgraph(baseSyntax, 'MainFlow', ['start', 'process_1']);

      expect(result).toContain('subgraph MainFlow');
      expect(result).toContain('end');
    });
  });

  describe('edge cases', () => {
    it('should handle empty flow elements', () => {
      const request: VisualizationRequest = {
        flowElements: [],
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english',
        },
      };

      const result = generator.generate(request);

      expect(result.mermaidSyntax).toContain('flowchart TD');
      expect(result.elementMapping).toHaveLength(0);
    });

    it('should handle single element', () => {
      const request: VisualizationRequest = {
        flowElements: [sampleFlowElements[0]],
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english',
        },
      };

      const result = generator.generate(request);

      expect(result.elementMapping).toHaveLength(1);
    });

    it('should handle elements with no children', () => {
      const elements: FlowElement[] = [
        {
          id: 'process_1',
          type: 'process',
          content: 'Standalone process',
          codeLines: [1],
          children: [],
          metadata: { complexity: 0, nestingLevel: 0 },
        },
        {
          id: 'process_2',
          type: 'process',
          content: 'Another process',
          codeLines: [2],
          children: [],
          metadata: { complexity: 0, nestingLevel: 0 },
        },
      ];

      const request: VisualizationRequest = {
        flowElements: elements,
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english',
        },
      };

      const result = generator.generate(request);

      // Should auto-connect sequential elements
      expect(result.mermaidSyntax).toContain('-->');
    });
  });
});
