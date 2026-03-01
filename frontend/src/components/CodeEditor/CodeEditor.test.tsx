import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeEditor } from './CodeEditor';

describe('CodeEditor', () => {
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    code: '',
    language: 'python' as const,
    onChange: mockOnChange,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render code editor', () => {
    render(<CodeEditor {...defaultProps} />);

    expect(screen.getByText('Code Editor')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('should display code in textarea', () => {
    const code = 'print("Hello World")';
    render(<CodeEditor {...defaultProps} code={code} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(code);
  });

  it('should call onChange when code is typed', () => {
    render(<CodeEditor {...defaultProps} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'x = 5' } });

    expect(mockOnChange).toHaveBeenCalledWith('x = 5');
  });

  it('should call onSubmit when button is clicked', () => {
    render(<CodeEditor {...defaultProps} code="x = 5" />);

    const button = screen.getByText('Visualize Code');
    fireEvent.click(button);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('should disable button when loading', () => {
    render(<CodeEditor {...defaultProps} isLoading={true} />);

    const button = screen.getByText('Processing...');
    expect(button).toBeDisabled();
  });

  it('should disable button when code is empty', () => {
    render(<CodeEditor {...defaultProps} code="" />);

    const button = screen.getByText('Visualize Code');
    expect(button).toBeDisabled();
  });

  it('should display error message', () => {
    const error = 'Syntax error on line 5';
    render(<CodeEditor {...defaultProps} error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('should show correct language label', () => {
    const { rerender } = render(<CodeEditor {...defaultProps} language="python" />);
    expect(screen.getByText('Python')).toBeInTheDocument();

    rerender(<CodeEditor {...defaultProps} language="javascript" />);
    expect(screen.getByText('JavaScript')).toBeInTheDocument();

    rerender(<CodeEditor {...defaultProps} language="java" />);
    expect(screen.getByText('Java')).toBeInTheDocument();

    rerender(<CodeEditor {...defaultProps} language="cpp" />);
    expect(screen.getByText('C++')).toBeInTheDocument();
  });

  it('should display line numbers', () => {
    const code = 'line 1\nline 2\nline 3';
    render(<CodeEditor {...defaultProps} code={code} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should display code statistics', () => {
    const code = 'x = 5\ny = 10';
    render(<CodeEditor {...defaultProps} code={code} />);

    expect(screen.getByText(/Lines: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Characters: 11/)).toBeInTheDocument();
  });

  it('should handle tab key for indentation', () => {
    render(<CodeEditor {...defaultProps} code="" />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;

    fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab' });

    expect(mockOnChange).toHaveBeenCalledWith('    ');
  });
});
