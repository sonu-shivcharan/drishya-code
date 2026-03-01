import { FlowElement } from '../types/interfaces';

/**
 * Bidirectional mapping between code lines and flow elements
 */
export class CodeLineMapper {
  private lineToElementMap: Map<number, string[]> = new Map();
  private elementToLineMap: Map<string, number[]> = new Map();

  /**
   * Build bidirectional mapping from flow elements
   */
  buildMapping(flowElements: FlowElement[]): void {
    this.lineToElementMap.clear();
    this.elementToLineMap.clear();

    flowElements.forEach((element) => {
      // Map element to lines
      this.elementToLineMap.set(element.id, element.codeLines);

      // Map lines to element
      element.codeLines.forEach((lineNum) => {
        if (!this.lineToElementMap.has(lineNum)) {
          this.lineToElementMap.set(lineNum, []);
        }
        this.lineToElementMap.get(lineNum)!.push(element.id);
      });
    });
  }

  /**
   * Get flow element IDs for a given code line
   */
  getElementsForLine(lineNumber: number): string[] {
    return this.lineToElementMap.get(lineNumber) || [];
  }

  /**
   * Get code lines for a given flow element ID
   */
  getLinesForElement(elementId: string): number[] {
    return this.elementToLineMap.get(elementId) || [];
  }

  /**
   * Get all elements that span multiple lines
   */
  getMultiLineElements(): string[] {
    const multiLineElements: string[] = [];

    this.elementToLineMap.forEach((lines, elementId) => {
      if (lines.length > 1) {
        multiLineElements.push(elementId);
      }
    });

    return multiLineElements;
  }

  /**
   * Get line range for an element
   */
  getLineRange(elementId: string): { start: number; end: number } | null {
    const lines = this.elementToLineMap.get(elementId);

    if (!lines || lines.length === 0) {
      return null;
    }

    return {
      start: Math.min(...lines),
      end: Math.max(...lines),
    };
  }

  /**
   * Check if a line is mapped to any element
   */
  isLineMapped(lineNumber: number): boolean {
    return this.lineToElementMap.has(lineNumber);
  }

  /**
   * Get mapping statistics
   */
  getStats(): {
    totalElements: number;
    totalMappedLines: number;
    multiLineElements: number;
    averageLinesPerElement: number;
  } {
    const multiLineElements = this.getMultiLineElements();
    const totalLines = Array.from(this.elementToLineMap.values()).reduce(
      (sum, lines) => sum + lines.length,
      0
    );

    return {
      totalElements: this.elementToLineMap.size,
      totalMappedLines: this.lineToElementMap.size,
      multiLineElements: multiLineElements.length,
      averageLinesPerElement:
        this.elementToLineMap.size > 0 ? totalLines / this.elementToLineMap.size : 0,
    };
  }

  /**
   * Export mapping as JSON
   */
  toJSON(): {
    lineToElement: Record<number, string[]>;
    elementToLine: Record<string, number[]>;
  } {
    return {
      lineToElement: Object.fromEntries(this.lineToElementMap),
      elementToLine: Object.fromEntries(this.elementToLineMap),
    };
  }

  /**
   * Import mapping from JSON
   */
  fromJSON(data: {
    lineToElement: Record<number, string[]>;
    elementToLine: Record<string, number[]>;
  }): void {
    this.lineToElementMap = new Map(
      Object.entries(data.lineToElement).map(([k, v]) => [parseInt(k), v])
    );
    this.elementToLineMap = new Map(Object.entries(data.elementToLine));
  }
}

/**
 * Helper function to create mapping from flow elements
 */
export function createCodeLineMapping(flowElements: FlowElement[]): CodeLineMapper {
  const mapper = new CodeLineMapper();
  mapper.buildMapping(flowElements);
  return mapper;
}
