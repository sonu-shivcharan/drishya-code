import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import './FlowchartRenderer.css';

interface FlowchartRendererProps {
  mermaidSyntax: string;
  onElementClick?: (elementId: string) => void;
  onElementHover?: (elementId: string | null) => void;
  theme?: 'light' | 'dark' | 'cultural';
}

export const FlowchartRenderer: React.FC<FlowchartRendererProps> = ({
  mermaidSyntax,
  onElementClick,
  onElementHover,
  theme = 'light',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
    });
  }, [theme]);

  useEffect(() => {
    const renderFlowchart = async () => {
      if (!containerRef.current || !mermaidSyntax) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Clear previous content
        containerRef.current.innerHTML = '';

        // Generate unique ID for this render
        const id = `mermaid-${Date.now()}`;

        console.log('Rendering Mermaid syntax:', mermaidSyntax);

        // Render the flowchart
        const { svg } = await mermaid.render(id, mermaidSyntax);

        console.log('Mermaid render result:', svg ? 'SVG generated' : 'No SVG');

        if (!svg || svg.trim() === '') {
          throw new Error('Mermaid returned empty SVG');
        }

        if (!containerRef.current) return;

        // Insert the SVG
        containerRef.current.innerHTML = svg;

        // Add click handlers to nodes
        const nodes = containerRef.current.querySelectorAll('.node');
        nodes.forEach((node) => {
          const nodeId = node.id;

          node.addEventListener('click', () => {
            if (onElementClick) {
              onElementClick(nodeId);
            }
          });

          node.addEventListener('mouseenter', () => {
            if (onElementHover) {
              onElementHover(nodeId);
            }
          });

          node.addEventListener('mouseleave', () => {
            if (onElementHover) {
              onElementHover(null);
            }
          });

          // Add cursor pointer style
          (node as HTMLElement).style.cursor = 'pointer';
        });

        console.log('Flowchart rendered successfully');
        setIsLoading(false);
      } catch (err) {
        console.error('Error rendering flowchart:', err);
        console.error('Mermaid syntax that failed:', mermaidSyntax);
        setError(err instanceof Error ? err.message : 'Failed to render flowchart');
        setIsLoading(false);
      }
    };

    renderFlowchart();
  }, [mermaidSyntax, onElementClick, onElementHover]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleDownload = () => {
    if (!containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowchart.svg';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flowchart-renderer-container">
      <div className="flowchart-header">
        <h3>Flowchart Visualization</h3>
        <div className="flowchart-controls">
          <button
            className="control-button"
            onClick={handleZoomOut}
            title="Zoom Out"
            disabled={zoom <= 0.5}
          >
            −
          </button>
          <button className="control-button" onClick={handleResetZoom} title="Reset Zoom">
            {Math.round(zoom * 100)}%
          </button>
          <button
            className="control-button"
            onClick={handleZoomIn}
            title="Zoom In"
            disabled={zoom >= 2}
          >
            +
          </button>
          <button className="control-button" onClick={handleDownload} title="Download SVG">
            ⬇️
          </button>
        </div>
      </div>

      <div className="flowchart-content">
        {isLoading && (
          <div className="flowchart-loading">
            <div className="spinner"></div>
            <p>Rendering flowchart...</p>
          </div>
        )}

        {error && (
          <div className="flowchart-error">
            <span className="error-icon">⚠️</span>
            <div>
              <h4>Failed to render flowchart</h4>
              <p>{error}</p>
              <details style={{ marginTop: '10px', fontSize: '12px' }}>
                <summary style={{ cursor: 'pointer' }}>Show Mermaid Syntax</summary>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {mermaidSyntax}
                </pre>
              </details>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div
            className="flowchart-wrapper"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <div ref={containerRef} className="mermaid-container" />
          </div>
        )}
      </div>
    </div>
  );
};
