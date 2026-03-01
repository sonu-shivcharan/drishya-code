# Drishya-Code

An AI-powered educational platform that transforms complex programming code into interactive visual flowcharts with vernacular language explanations.

## Overview

Drishya-Code democratizes computer science education for students in Tier-2 and Tier-3 cities in India by converting code into instant visual flowcharts and providing explanations in Hindi, Hinglish, and Marathi.

## Features

- **Code-to-Flowchart Conversion**: Instantly visualize Python, Java, JavaScript, and C++ code as interactive flowcharts
- **Vernacular AI Tutor**: Get explanations in Hindi, Hinglish, and Marathi with culturally relevant examples
- **Visual Error Debugging**: See errors highlighted directly in flowcharts with vernacular explanations
- **Viva Mode**: Practice interview skills with interactive quizzes based on your code
- **Bidirectional Linking**: Click between code and flowchart elements for seamless navigation
- **Audio-Visual Sync**: Listen to explanations with synchronized flowchart highlighting
- **Offline Support**: Access previously generated diagrams without internet

## Project Structure

```
drishya-code/
├── frontend/          # React.js frontend application
├── backend/           # AWS Lambda functions
├── infrastructure/    # AWS CDK infrastructure as code
├── tests/            # Integration and property-based tests
└── docs/             # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Quick Start (Local Development)

1. **Clone the repository**
```bash
git clone <repository-url>
cd drishya-code
```

2. **Run the development environment**

For Windows:
```bash
start-dev.bat
```

For Linux/Mac:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

This will:
- Install all dependencies
- Start the backend server on http://localhost:3001
- Start the frontend on http://localhost:5173

3. **Open your browser**
Navigate to http://localhost:5173 and start visualizing code!

### Manual Setup

If you prefer to run services separately:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Current Features

✅ Python code parsing and analysis
✅ Interactive flowchart generation
✅ Code editor with line numbers
✅ Language selection (Python supported)
✅ Zoom and download controls
✅ Error detection and display

🚧 Coming Soon:
- JavaScript, Java, C++ parsers
- Vernacular language support
- Audio explanations
- Viva Mode (Interactive quizzes)
- Visual debugging

## Development

### Running Tests

```bash
# Frontend tests
cd frontend && npm test

# Backend unit tests
cd backend && npm test

# Backend property tests
cd backend && npm run test:property

# Integration tests
cd tests && npm test
```

### Deployment

```bash
cd infrastructure
npm run deploy
```

## Tech Stack

- **Frontend**: React.js, TypeScript, Vite, Mermaid.js
- **Backend**: AWS Lambda, Node.js, TypeScript
- **AI Services**: Amazon Bedrock (Llama 3), Amazon Polly
- **Infrastructure**: AWS CDK, API Gateway, DynamoDB, S3, Cognito
- **Testing**: Jest, fast-check (property-based testing)

## Documentation

- [Requirements](.kiro/specs/drishya-code/requirements.md)
- [Design Document](.kiro/specs/drishya-code/design.md)
- [Implementation Tasks](.kiro/specs/drishya-code/tasks.md)

## License

MIT
