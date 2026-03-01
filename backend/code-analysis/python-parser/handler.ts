import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PythonParser } from './parser';
import { CodeAnalysisRequest, CodeAnalysisResponse } from '../../shared/types/interfaces';

/**
 * Lambda handler for Python code analysis
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

    const request: CodeAnalysisRequest = JSON.parse(event.body);

    // Validate request
    if (!request.code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Code is required' }),
      };
    }

    if (request.language !== 'python') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'This endpoint only handles Python code' }),
      };
    }

    // Parse Python code
    const parser = new PythonParser();
    const result = parser.parse(request.code);

    // Validate syntax
    const syntaxErrors = parser.validateSyntax(request.code);
    const allErrors = [...result.errors, ...syntaxErrors];

    const response: CodeAnalysisResponse = {
      ast: result.ast,
      flowElements: result.flowElements,
      errors: allErrors,
      complexity: result.complexity,
    };

    // Log analytics (if userId provided)
    if (request.userId) {
      console.log('Code analysis completed', {
        userId: request.userId,
        language: request.language,
        linesOfCode: result.complexity.linesOfCode,
        complexity: result.complexity.cyclomaticComplexity,
        errorCount: allErrors.length,
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error processing Python code analysis:', error);

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
