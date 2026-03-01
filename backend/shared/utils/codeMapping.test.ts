import { CodeLineMapper, createCodeLineMapping } from './codeMapping';
import { FlowElement } from '../types/interfaces';

describe('CodeLineMapper', () => {
  let mapper: CodeLineMapper;

  beforeEach(() => {
    mapper = new CodeLineMapper();
  });

  const sampleFlowElements: FlowElement[] = [
    {
      id: 'start',
      type: 'start',
      content: 'Start',
      codeLines: [0],
      children: [],
      metadata: { complexity: 0, nestingLevel: 0 },
    },
    {
      id: 'process_1',
      type: 'process',
      content: 'x = 5',
      codeLines: [1],
      children: [],
      metadata: { complexity: 0, nestingLevel: 0 },
    },
    {
      id: 'decision_1',
      type: 'decision',
      content: 'if x > 3',
      codeLines: [2, 3],
      children: [],
      metadata: { complexity: 1, nestingLevel: 0 },
    },
    {
      id: 'process_2',
      type: 'process',
      content: 'print(x)',
      codeLines: [3],
      children: [],
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

  describe('buildMapping', () => {
    it('should build bidirectional mapping', () => {
      mapper.buildMapping(sampleFlowElements);

      expect(mapper.getElementsForLine(1)).toContain('process_1');
      expect(mapper.getLinesForElement('process_1')).toContain(1);
    });

    it('should handle multiple elements on same line', () => {
      mapper.buildMapping(sampleFlowElements);

      const elementsOnLine3 = mapper.getElementsForLine(3);
      expect(elementsOnLine3).toContain('decision_1');
      expect(elementsOnLine3).toContain('process_2');
    });

    it('should handle multi-line elements', () => {
      mapper.buildMapping(sampleFlowElements);

      const lines = mapper.getLinesForElement('decision_1');
      expect(lines).toHaveLength(2);
      expect(lines).toContain(2);
      expect(lines).toContain(3);
    });
  });

  describe('getElementsForLine', () => {
    beforeEach(() => {
      mapper.buildMapping(sampleFlowElements);
    });

    it('should return elements for a given line', () => {
      const elements = mapper.getElementsForLine(1);
      expect(elements).toEqual(['process_1']);
    });

    it('should return empty array for unmapped line', () => {
      const elements = mapper.getElementsForLine(999);
      expect(elements).toEqual([]);
    });
  });

  describe('getLinesForElement', () => {
    beforeEach(() => {
      mapper.buildMapping(sampleFlowElements);
    });

    it('should return lines for a given element', () => {
      const lines = mapper.getLinesForElement('process_1');
      expect(lines).toEqual([1]);
    });

    it('should return empty array for unknown element', () => {
      const lines = mapper.getLinesForElement('unknown');
      expect(lines).toEqual([]);
    });
  });

  describe('getMultiLineElements', () => {
    beforeEach(() => {
      mapper.buildMapping(sampleFlowElements);
    });

    it('should identify multi-line elements', () => {
      const multiLine = mapper.getMultiLineElements();
      expect(multiLine).toContain('decision_1');
      expect(multiLine).not.toContain('process_1');
    });
  });

  describe('getLineRange', () => {
    beforeEach(() => {
      mapper.buildMapping(sampleFlowElements);
    });

    it('should return line range for element', () => {
      const range = mapper.getLineRange('decision_1');
      expect(range).toEqual({ start: 2, end: 3 });
    });

    it('should return same start and end for single-line element', () => {
      const range = mapper.getLineRange('process_1');
      expect(range).toEqual({ start: 1, end: 1 });
    });

    it('should return null for unknown element', () => {
      const range = mapper.getLineRange('unknown');
      expect(range).toBeNull();
    });
  });

  describe('isLineMapped', () => {
    beforeEach(() => {
      mapper.buildMapping(sampleFlowElements);
    });

    it('should return true for mapped line', () => {
      expect(mapper.isLineMapped(1)).toBe(true);
    });

    it('should return false for unmapped line', () => {
      expect(mapper.isLineMapped(999)).toBe(false);
    });
  });

  describe('getStats', () => {
    beforeEach(() => {
      mapper.buildMapping(sampleFlowElements);
    });

    it('should return mapping statistics', () => {
      const stats = mapper.getStats();

      expect(stats.totalElements).toBe(5);
      expect(stats.totalMappedLines).toBeGreaterThan(0);
      expect(stats.multiLineElements).toBe(1);
      expect(stats.averageLinesPerElement).toBeGreaterThan(0);
    });
  });

  describe('JSON serialization', () => {
    beforeEach(() => {
      mapper.buildMapping(sampleFlowElements);
    });

    it('should export to JSON', () => {
      const json = mapper.toJSON();

      expect(json.lineToElement).toBeDefined();
      expect(json.elementToLine).toBeDefined();
      expect(json.elementToLine['process_1']).toEqual([1]);
    });

    it('should import from JSON', () => {
      const json = mapper.toJSON();
      const newMapper = new CodeLineMapper();

      newMapper.fromJSON(json);

      expect(newMapper.getElementsForLine(1)).toEqual(mapper.getElementsForLine(1));
      expect(newMapper.getLinesForElement('process_1')).toEqual(
        mapper.getLinesForElement('process_1')
      );
    });

    it('should maintain data integrity through serialization', () => {
      const json = mapper.toJSON();
      const newMapper = new CodeLineMapper();
      newMapper.fromJSON(json);

      const originalStats = mapper.getStats();
      const newStats = newMapper.getStats();

      expect(newStats).toEqual(originalStats);
    });
  });

  describe('createCodeLineMapping helper', () => {
    it('should create mapper with elements', () => {
      const mapper = createCodeLineMapping(sampleFlowElements);

      expect(mapper.getElementsForLine(1)).toContain('process_1');
      expect(mapper.getLinesForElement('process_1')).toContain(1);
    });
  });
});
