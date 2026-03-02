import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CodeExplainer } from './explainer';

interface ExplanationRequest {
  code: string;
  flowElements: any[];
  complexity?: number;
  elementId?: string; // Optional: explain specific element
}

interface ExplanationResponse {
  explanation: string;
  tips: string[];
  elementExplanation?: string;
}

/**
 * Lambda handler for AI code explanation
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  try {
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const request: ExplanationRequest = JSON.parse(event.body);

    // Validate request
    if (!request.code || !request.flowElements) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Code and flow elements are required' }),
      };
    }

    // Generate explanation
    const explainer = new CodeExplainer();
    const explanation = explainer.explainCode(request.code, request.flowElements);
    const tips = explainer.generateTips(
      request.flowElements,
      request.complexity || 0
    );

    let elementExplanation: string | undefined;
    if (request.elementId) {
      const element = request.flowElements.find((el) => el.id === request.elementId);
      if (element) {
        elementExplanation = explainer.explainElement(element, request.flowElements);
      }
    }

    const response: ExplanationResponse = {
      explanation,
      tips,
      elementExplanation,
    };

    console.log('Explanation generated successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error generating explanation:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
