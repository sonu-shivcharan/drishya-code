// API service for code analysis

export interface CodeAnalysisRequest {
  code: string;
  language: 'python' | 'java' | 'javascript' | 'cpp';
  userId: string;
}

export interface CodeAnalysisResponse {
  flowElements: any[];
  errors: any[];
  complexity: any;
  ast?: any;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const analyzeCode = async (
  request: CodeAnalysisRequest
): Promise<CodeAnalysisResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Code analysis failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Code analysis error:', error);
    throw error;
  }
};
