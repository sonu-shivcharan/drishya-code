// API service for AI code explanation

export interface ExplanationRequest {
  code: string;
  flowElements: any[];
  complexity?: number;
  elementId?: string;
}

export interface ExplanationResponse {
  explanation: string;
  tips: string[];
  elementExplanation?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const getExplanation = async (
  request: ExplanationRequest
): Promise<ExplanationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Explanation failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Explanation error:', error);
    throw error;
  }
};
