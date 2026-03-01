import { useState } from 'react';
import { CodeEditor } from './components/CodeEditor/CodeEditor';
import { LanguageSelector } from './components/CodeEditor/LanguageSelector';
import { FlowchartRenderer } from './components/FlowchartRenderer/FlowchartRenderer';
import { analyzeCode } from './services/api/codeAnalysis';
import { generateVisualization } from './services/api/visualization';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'java' | 'javascript' | 'cpp'>('python');
  const [mermaidSyntax, setMermaidSyntax] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);

  const handleVisualize = async () => {
    if (!code.trim()) {
      setError('Please enter some code to visualize');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Analyze code
      const analysisResult = await analyzeCode({
        code,
        language,
        userId: 'demo-user', // TODO: Get from auth
      });

      if (analysisResult.errors && analysisResult.errors.length > 0) {
        const criticalErrors = analysisResult.errors.filter((e) => e.severity === 'error');
        if (criticalErrors.length > 0) {
          setError(`Code has ${criticalErrors.length} error(s). Please fix them first.`);
          setIsLoading(false);
          return;
        }
      }

      // Step 2: Generate visualization
      const visualizationResult = await generateVisualization({
        flowElements: analysisResult.flowElements,
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english',
        },
      });

      setMermaidSyntax(visualizationResult.mermaidSyntax);
    } catch (err) {
      console.error('Visualization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to visualize code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleElementClick = (elementId: string) => {
    console.log('Element clicked:', elementId);
    // TODO: Implement code highlighting based on element
  };

  const handleElementHover = (elementId: string | null) => {
    console.log('Element hovered:', elementId);
    // TODO: Implement hover tooltip
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 Drishya-Code</h1>
        <p>Transform your code into visual flowcharts</p>
      </header>

      <main className="app-main">
        <div className="app-sidebar">
          <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />

          <CodeEditor
            code={code}
            language={language}
            onChange={setCode}
            onSubmit={handleVisualize}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <div className="app-content">
          {mermaidSyntax ? (
            <FlowchartRenderer
              mermaidSyntax={mermaidSyntax}
              onElementClick={handleElementClick}
              onElementHover={handleElementHover}
              theme="light"
            />
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h2>No Visualization Yet</h2>
              <p>Enter your code and click "Visualize Code" to see the flowchart</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
