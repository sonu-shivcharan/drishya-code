import React, { useState, useRef, useEffect } from 'react';
import './CodeEditor.css';

interface CodeEditorProps {
  code: string;
  language: 'python' | 'java' | 'javascript' | 'cpp';
  onChange: (code: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChange,
  onSubmit,
  isLoading = false,
  error = null,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [code]);

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Handle submit with Ctrl+Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  const getLanguageLabel = (lang: string): string => {
    const labels: Record<string, string> = {
      python: 'Python',
      java: 'Java',
      javascript: 'JavaScript',
      cpp: 'C++',
    };
    return labels[lang] || lang;
  };

  return (
    <div className="code-editor-container">
      <div className="code-editor-header">
        <h3>Code Editor</h3>
        <span className="language-badge">{getLanguageLabel(language)}</span>
      </div>

      <div className="code-editor-wrapper">
        <div className="line-numbers">
          {lineNumbers.map((num) => (
            <div key={num} className="line-number">
              {num}
            </div>
          ))}
        </div>

        <textarea
          ref={textareaRef}
          className="code-input"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyPress={handleKeyPress}
          placeholder={`Enter your ${getLanguageLabel(language)} code here...\n\nTip: Press Tab for indentation, Ctrl+Enter to visualize`}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>

      {error && (
        <div className="code-editor-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="code-editor-footer">
        <div className="code-stats">
          <span>Lines: {lineNumbers.length}</span>
          <span>Characters: {code.length}</span>
        </div>
        <button
          className="visualize-button"
          onClick={onSubmit}
          disabled={isLoading || !code.trim()}
        >
          {isLoading ? 'Processing...' : 'Visualize Code'}
        </button>
      </div>
    </div>
  );
};
