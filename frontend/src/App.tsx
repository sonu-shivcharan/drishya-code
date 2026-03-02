import { useState, useCallback } from 'react';
import { CodeEditor } from './components/CodeEditor/CodeEditor';
import { LanguageSelector } from './components/CodeEditor/LanguageSelector';
import { SampleSelector } from './components/SampleSelector/SampleSelector';
import { FlowchartRenderer } from './components/FlowchartRenderer/FlowchartRenderer';
import { ExplanationPanel } from './components/ExplanationPanel/ExplanationPanel';
import { analyzeCode } from './services/api/codeAnalysis';
import { generateVisualization } from './services/api/visualization';
import { getExplanation } from './services/api/explanation';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'java' | 'javascript' | 'cpp'>('python');
  const [mermaidSyntax, setMermaidSyntax] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ elements: number; complexity: number } | null>(null);
  const [explanation, setExplanation] = useState<{ text: string; tips: string[] } | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const handleVisualize = async () => {
    if (!code.trim()) {
      setError('Please enter some code to visualize');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStats(null);
    setExplanation(null);

    try {
      // Step 1: Analyze code
      const analysisResult = await analyzeCode({
        code,
        language,
        userId: 'demo-user',
      });
      console.log("analysisResult", analysisResult);
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
      console.log("visualizationResult", visualizationResult);

      setMermaidSyntax(visualizationResult.mermaidSyntax);
      setStats({
        elements: analysisResult.flowElements.length,
        complexity: analysisResult.complexity?.cyclomaticComplexity || 0,
      });

      // Step 3: Generate AI explanation
      setIsExplaining(true);
      try {
        const explanationResult = await getExplanation({
          code,
          flowElements: analysisResult.flowElements,
          complexity: analysisResult.complexity?.cyclomaticComplexity || 0,
        });

        setExplanation({
          text: explanationResult.explanation,
          tips: explanationResult.tips,
        });
      } catch (explainError) {
        console.error('Failed to generate explanation:', explainError);
        // Don't fail the whole visualization if explanation fails
      } finally {
        setIsExplaining(false);
      }
    } catch (err) {
      console.error('Visualization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to visualize code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = useCallback((sampleCode: string) => {
    setCode(sampleCode);
    setMermaidSyntax(''); // Clear previous visualization
    setError(null);
    setStats(null);
    setExplanation(null);
  }, []);

  const handleElementClick = useCallback((elementId: string) => {
    console.log('Element clicked:', elementId);
    // TODO: Implement code highlighting based on element
  }, []);

  const handleElementHover = useCallback((elementId: string | null) => {
    console.log('Element hovered:', elementId);
    // TODO: Implement hover tooltip
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎨 Drishya-Code</h1>
          <p>Transform your code into visual flowcharts</p>
        </div>
        {stats && (
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Elements:</span>
              <span className="stat-value">{stats.elements}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Complexity:</span>
              <span className="stat-value">{stats.complexity}</span>
            </div>
          </div>
        )}
      </header>

      <main className="app-main">
        <div className="app-sidebar">
          <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />

          <SampleSelector language={language} onSelectSample={handleLoadSample} />

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
            <>
              <FlowchartRenderer
                mermaidSyntax={mermaidSyntax}
                onElementClick={handleElementClick}
                onElementHover={handleElementHover}
                theme="cultural"
              />
              {explanation && (
                <ExplanationPanel
                  explanation={explanation.text}
                  tips={explanation.tips}
                  isLoading={isExplaining}
                />
              )}
              {isExplaining && !explanation && (
                <ExplanationPanel explanation="" tips={[]} isLoading={true} />
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h2>No Visualization Yet</h2>
              <p>Load an example or enter your code and click "Visualize Code"</p>
              <div className="empty-state-tips">
                <h3>Quick Tips:</h3>
                <ul>
                  <li>Click "Load Example Code" to try sample programs</li>
                  <li>Press Tab for indentation in the editor</li>
                  <li>Use Ctrl+Enter to quickly visualize</li>
                  <li>Zoom and download your flowcharts</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
