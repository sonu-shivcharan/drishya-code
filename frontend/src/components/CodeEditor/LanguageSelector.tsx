import React from 'react';
import './LanguageSelector.css';

interface LanguageSelectorProps {
  selectedLanguage: 'python' | 'java' | 'javascript' | 'cpp';
  onLanguageChange: (language: 'python' | 'java' | 'javascript' | 'cpp') => void;
}

const languages = [
  { value: 'python' as const, label: 'Python', icon: '🐍' },
  { value: 'java' as const, label: 'Java', icon: '☕' },
  { value: 'javascript' as const, label: 'JavaScript', icon: '📜' },
  { value: 'cpp' as const, label: 'C++', icon: '⚙️' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="language-selector">
      <label className="language-selector-label">Select Language:</label>
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.value}
            className={`language-button ${selectedLanguage === lang.value ? 'active' : ''}`}
            onClick={() => onLanguageChange(lang.value)}
          >
            <span className="language-icon">{lang.icon}</span>
            <span className="language-label">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
