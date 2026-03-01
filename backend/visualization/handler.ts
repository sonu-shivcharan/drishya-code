import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MermaidGenerator } from './mermaidGenerator';
import { VisualizationRequest, VisualizationResponse } from '../shared/types/interfaces';

/**
 * Lambda handler for flowchart visualization generation
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

    const request: VisualizationRequest = JSON.parse(event.body);

    // Validate request
    if (!request.flowElements || request.flowElements.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Flow elements are required' }),
      };
    }

    // Set default preferences if not provided
    const preferences = {
      theme: request.preferences?.theme || 'light',
      complexity: request.preferences?.complexity || 'detailed',
      language: request.preferences?.language || 'english',
    };

    // Generate Mermaid flowchart
    const generator = new MermaidGenerator();
    const startTime = Date.now();

    const response: VisualizationResponse = generator.generate({
      flowElements: request.flowElements,
      preferences,
    });

    const generationTime = Date.now() - startTime;

    // Validate generated syntax
    const validation = generator.validateSyntax(response.mermaidSyntax);
    if (!validation.valid) {
      console.warn('Generated Mermaid syntax has warnings:', validation.errors);
    }

    // Log performance metrics
    console.log('Flowchart generation completed', {
      elementCount: request.flowElements.length,
      generationTime,
      theme: preferences.theme,
      complexity: preferences.complexity,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...response,
        metadata: {
          generationTime,
          elementCount: request.flowElements.length,
          syntaxValid: validation.valid,
        },
      }),
    };
  } catch (error) {
    console.error('Error generating flowchart:', error);

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
