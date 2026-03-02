import React, { useState } from 'react';
import { getSamplesByLanguage } from '../../data/sampleCodes';
import type { CodeSample } from '../../data/sampleCodes';
import './SampleSelector.css';

interface SampleSelectorProps {
  language: 'python' | 'java' | 'javascript' | 'cpp';
  onSelectSample: (code: string) => void;
}

export const SampleSelector: React.FC<SampleSelectorProps> = ({ language, onSelectSample }) => {
  const [isOpen, setIsOpen] = useState(false);
  const samples = getSamplesByLanguage(language);

  const handleSelectSample = (sample: CodeSample) => {
    onSelectSample(sample.code);
    setIsOpen(false);
  };

  if (samples.length === 0) {
    return null;
  }

  return (
    <div className="sample-selector">
      <button className="sample-selector-button" onClick={() => setIsOpen(!isOpen)}>
        📝 Load Example Code
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="sample-dropdown">
          <div className="sample-dropdown-header">
            <h4>Example Code Snippets</h4>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>
          <div className="sample-list">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="sample-item"
                onClick={() => handleSelectSample(sample)}
              >
                <div className="sample-title">{sample.title}</div>
                <div className="sample-description">{sample.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
