import express, { Request, Response } from 'express';
import cors from 'cors';
import { PythonParser } from './code-analysis/python-parser/parser';
import { MermaidGenerator } from './visualization/mermaidGenerator';
import { CodeExplainer } from './ai-explanation/explainer';
import {
  CodeAnalysisRequest,
  CodeAnalysisResponse,
  VisualizationRequest,
  VisualizationResponse,
} from './shared/types/interfaces';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Code analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const request: CodeAnalysisRequest = req.body;

    // Validate request
    if (!request.code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!['python', 'java', 'javascript', 'cpp'].includes(request.language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    // For now, only Python is implemented
    if (request.language !== 'python') {
      return res.status(400).json({
        error: `${request.language} parser not yet implemented. Please use Python for now.`,
      });
    }

    // Parse code
    const parser = new PythonParser();
    const result = parser.parse(request.code);
    const syntaxErrors = parser.validateSyntax(request.code);

    const response: CodeAnalysisResponse = {
      ast: result.ast,
      flowElements: result.flowElements,
      errors: [...result.errors, ...syntaxErrors],
      complexity: result.complexity,
    };

    console.log(`Code analysis completed: ${result.flowElements.length} elements, ${response.errors.length} errors`);

    res.json(response);
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Visualization endpoint
app.post('/api/visualize', async (req: Request, res: Response) => {
  try {
    const request: VisualizationRequest = req.body;

    // Validate request
    if (!request.flowElements || !Array.isArray(request.flowElements)) {
      return res.status(400).json({ error: 'Flow elements are required' });
    }

    // Set default preferences
    const preferences = {
      theme: request.preferences?.theme || 'light',
      complexity: request.preferences?.complexity || 'detailed',
      language: request.preferences?.language || 'english',
    };

    // Generate visualization
    const generator = new MermaidGenerator();
    const response: VisualizationResponse = generator.generate({
      flowElements: request.flowElements,
      preferences,
    });

    // Validate syntax
    const validation = generator.validateSyntax(response.mermaidSyntax);
    if (!validation.valid) {
      console.warn('Generated Mermaid syntax has warnings:', validation.errors);
    }

    console.log(`Visualization generated: ${request.flowElements.length} elements`);

    res.json(response);
  } catch (error) {
    console.error('Visualization error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// AI Explanation endpoint
app.post('/api/explain', async (req: Request, res: Response) => {
  try {
    const { code, flowElements, complexity, elementId } = req.body;

    // Validate request
    if (!code || !flowElements) {
      return res.status(400).json({ error: 'Code and flow elements are required' });
    }

    // Generate explanation
    const explainer = new CodeExplainer();
    const explanation = explainer.explainCode(code, flowElements);
    const tips = explainer.generateTips(flowElements, complexity || 0);

    let elementExplanation: string | undefined;
    if (elementId) {
      const element = flowElements.find((el: any) => el.id === elementId);
      if (element) {
        elementExplanation = explainer.explainElement(element, flowElements);
      }
    }

    console.log('Explanation generated successfully');

    res.json({
      explanation,
      tips,
      elementExplanation,
    });
  } catch (error) {
    console.error('Explanation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Drishya-Code backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/analyze`);
  console.log(`   - POST http://localhost:${PORT}/api/visualize`);
  console.log(`   - POST http://localhost:${PORT}/api/explain`);
  console.log(`   - GET  http://localhost:${PORT}/health`);
});

export default app;
