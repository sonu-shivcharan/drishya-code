// API service for visualization generation

export interface VisualizationRequest {
  flowElements: any[];
  preferences: {
    theme: 'light' | 'dark' | 'cultural';
    complexity: 'simplified' | 'detailed';
    language: 'hindi' | 'hinglish' | 'marathi' | 'english';
  };
}

export interface VisualizationResponse {
  mermaidSyntax: string;
  elementMapping: any[];
  interactionPoints: any[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const generateVisualization = async (
  request: VisualizationRequest
): Promise<VisualizationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/visualize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Visualization failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Visualization error:', error);
    throw error;
  }
};
