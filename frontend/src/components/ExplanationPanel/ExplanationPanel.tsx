import React from 'react';
import './ExplanationPanel.css';

interface ExplanationPanelProps {
  explanation: string;
  tips: string[];
  isLoading?: boolean;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  explanation,
  tips,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="explanation-panel">
        <div className="explanation-header">
          <h3>🤖 AI Explanation</h3>
        </div>
        <div className="explanation-loading">
          <div className="spinner-small"></div>
          <p>Generating explanation...</p>
        </div>
      </div>
    );
  }

  if (!explanation) {
    return null;
  }

  return (
    <div className="explanation-panel">
      <div className="explanation-header">
        <h3>🤖 AI Code Explanation</h3>
      </div>

      <div className="explanation-content">
        <div className="explanation-text">
          {explanation.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {tips && tips.length > 0 && (
          <div className="explanation-tips">
            <h4>💡 Learning Tips</h4>
            <ul>
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
