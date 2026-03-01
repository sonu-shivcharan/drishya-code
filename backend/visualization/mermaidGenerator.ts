import {
  FlowElement,
  VisualizationRequest,
  VisualizationResponse,
  ElementMapping,
  InteractionPoint,
} from '../shared/types/interfaces';

/**
 * Mermaid.js Flowchart Generator
 * Converts flow elements into Mermaid.js syntax for visualization
 */
export class MermaidGenerator {
  private culturalColors = {
    light: {
      start: '#4CAF50',
      end: '#F44336',
      process: '#2196F3',
      decision: '#FF9800',
      loop: '#9C27B0',
      function: '#00BCD4',
    },
    dark: {
      start: '#66BB6A',
      end: '#EF5350',
      process: '#42A5F5',
      decision: '#FFA726',
      loop: '#AB47BC',
      function: '#26C6DA',
    },
    cultural: {
      start: '#FF9933', // Saffron
      end: '#138808', // Green
      process: '#000080', // Navy Blue
      decision: '#FF9933', // Saffron
      loop: '#138808', // Green
      function: '#000080', // Navy Blue
    },
  };

  /**
   * Generate Mermaid.js flowchart from flow elements
   */
  generate(request: VisualizationRequest): VisualizationResponse {
    const { flowElements, preferences } = request;

    // Build Mermaid syntax
    const mermaidLines: string[] = ['flowchart TD'];

    // Add styling based on theme
    const colors = this.culturalColors[preferences.theme];

    // Generate nodes
    const elementMapping: ElementMapping[] = [];
    const interactionPoints: InteractionPoint[] = [];

    flowElements.forEach((element, index) => {
      const nodeId = this.sanitizeId(element.id);
      const nodeContent = this.formatContent(element.content, preferences.complexity);
      const nodeShape = this.getNodeShape(element.type);

      // Create node definition
      const nodeDef = `    ${nodeId}${nodeShape.open}"${nodeContent}"${nodeShape.close}`;
      mermaidLines.push(nodeDef);

      // Add styling
      const color = colors[element.type] || colors.process;
      mermaidLines.push(`    style ${nodeId} fill:${color},stroke:#333,stroke-width:2px`);

      // Create element mapping
      elementMapping.push({
        elementId: element.id,
        mermaidNodeId: nodeId,
        codeLines: element.codeLines,
      });

      // Create interaction points
      interactionPoints.push(
        {
          elementId: element.id,
          type: 'click',
          action: 'highlightCode',
        },
        {
          elementId: element.id,
          type: 'hover',
          action: 'showTooltip',
        }
      );

      // Add connections to children
      if (element.children && element.children.length > 0) {
        element.children.forEach((childId) => {
          const childNodeId = this.sanitizeId(childId);
          mermaidLines.push(`    ${nodeId} --> ${childNodeId}`);
        });
      } else if (index < flowElements.length - 1) {
        // Auto-connect to next element if no explicit children
        const nextNodeId = this.sanitizeId(flowElements[index + 1].id);
        mermaidLines.push(`    ${nodeId} --> ${nextNodeId}`);
      }
    });

    const mermaidSyntax = mermaidLines.join('\n');

    return {
      mermaidSyntax,
      elementMapping,
      interactionPoints,
    };
  }

  /**
   * Get node shape based on element type
   */
  private getNodeShape(type: string): { open: string; close: string } {
    switch (type) {
      case 'start':
      case 'end':
        return { open: '([', close: '])' }; // Stadium shape
      case 'decision':
        return { open: '{', close: '}' }; // Diamond shape
      case 'process':
        return { open: '[', close: ']' }; // Rectangle
      case 'loop':
        return { open: '[[', close: ']]' }; // Subroutine shape
      case 'function':
        return { open: '[(', close: ')]' }; // Cylindrical shape
      default:
        return { open: '[', close: ']' };
    }
  }

  /**
   * Sanitize element ID for Mermaid
   */
  private sanitizeId(id: string): string {
    // Replace non-alphanumeric characters with underscore
    let sanitized = id.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Mermaid reserved keywords that need to be prefixed
    const reservedKeywords = [
      'end', 'start', 'stop', 'class', 'style', 'click', 
      'call', 'return', 'if', 'else', 'loop', 'alt', 'opt', 'par'
    ];
    
    // If the ID matches a reserved keyword, prefix it
    if (reservedKeywords.includes(sanitized.toLowerCase())) {
      sanitized = `node_${sanitized}`;
    }
    
    return sanitized;
  }

  /**
   * Format content based on complexity preference
   */
  private formatContent(content: string, complexity: 'simplified' | 'detailed'): string {
    if (complexity === 'simplified') {
      // Truncate long content
      if (content.length > 30) {
        return content.substring(0, 27) + '...';
      }
    }

    // Escape special characters for Mermaid
    // Keep it simple - just remove problematic characters
    return content
      .replace(/"/g, '')  // Remove double quotes
      .replace(/'/g, '')  // Remove single quotes
      .replace(/</g, '')
      .replace(/>/g, '')
      .replace(/&/g, 'and')
      .replace(/\n/g, ' ')  // Replace newlines with spaces
      .replace(/\s+/g, ' ')  // Collapse multiple spaces
      .trim();
  }

  /**
   * Generate Mermaid syntax with custom layout
   */
  generateWithLayout(
    flowElements: FlowElement[],
    layout: 'TD' | 'LR' | 'BT' | 'RL' = 'TD'
  ): string {
    const mermaidLines: string[] = [`flowchart ${layout}`];

    flowElements.forEach((element, index) => {
      const nodeId = this.sanitizeId(element.id);
      const nodeContent = this.formatContent(element.content, 'detailed');
      const nodeShape = this.getNodeShape(element.type);

      mermaidLines.push(`    ${nodeId}${nodeShape.open}${nodeContent}${nodeShape.close}`);

      if (index < flowElements.length - 1) {
        const nextNodeId = this.sanitizeId(flowElements[index + 1].id);
        mermaidLines.push(`    ${nodeId} --> ${nextNodeId}`);
      }
    });

    return mermaidLines.join('\n');
  }

  /**
   * Generate simplified flowchart for mobile devices
   */
  generateMobileOptimized(flowElements: FlowElement[]): string {
    // Use simplified content and vertical layout
    const simplified = flowElements.map((el) => ({
      ...el,
      content: el.content.length > 20 ? el.content.substring(0, 17) + '...' : el.content,
    }));

    return this.generateWithLayout(simplified, 'TD');
  }

  /**
   * Validate Mermaid syntax
   */
  validateSyntax(mermaidSyntax: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for required flowchart declaration
    if (!mermaidSyntax.startsWith('flowchart')) {
      errors.push('Missing flowchart declaration');
    }

    // Check for balanced brackets
    const openBrackets = (mermaidSyntax.match(/\[/g) || []).length;
    const closeBrackets = (mermaidSyntax.match(/\]/g) || []).length;

    if (openBrackets !== closeBrackets) {
      errors.push('Unbalanced brackets in node definitions');
    }

    // Check for valid connections
    const lines = mermaidSyntax.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('-->') && !line.trim().match(/^\w+\s+-->\s+\w+/)) {
        errors.push(`Invalid connection syntax at line ${index + 1}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Add subgraph for grouping related elements
   */
  addSubgraph(
    mermaidSyntax: string,
    groupName: string,
    elementIds: string[]
  ): string {
    const lines = mermaidSyntax.split('\n');
    const subgraphLines: string[] = [`    subgraph ${groupName}`];

    elementIds.forEach((id) => {
      const sanitizedId = this.sanitizeId(id);
      const nodeLine = lines.find((line) => line.trim().startsWith(sanitizedId));
      if (nodeLine) {
        subgraphLines.push(`    ${nodeLine.trim()}`);
      }
    });

    subgraphLines.push('    end');

    // Insert subgraph after flowchart declaration
    lines.splice(1, 0, ...subgraphLines);

    return lines.join('\n');
  }
}
