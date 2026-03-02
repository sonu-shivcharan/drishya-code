# Drishya-Code V1 Testing Guide

## ✅ What's Implemented

### Backend Features
- ✅ Python code parser with AST analysis
- ✅ Flow element extraction (loops, conditionals, functions)
- ✅ Complexity metrics (cyclomatic & cognitive)
- ✅ Mermaid.js visualization generator
- ✅ AI code explainer (no external API needed)
- ✅ Three API endpoints: `/api/analyze`, `/api/visualize`, `/api/explain`

### Frontend Features
- ✅ Code editor with line numbers and syntax highlighting
- ✅ Language selector (Python only for V1)
- ✅ Sample code library (8 Python examples)
- ✅ Flowchart renderer with zoom controls
- ✅ SVG download functionality
- ✅ AI explanation panel
- ✅ Stats display (elements count, complexity)
- ✅ Responsive design
- ✅ Custom scrollbars

## 🧪 Testing Steps

### 1. Start the Application

```bash
# Windows
start-dev.bat

# Linux/Mac
./start-dev.sh
```

This will start:
- Backend server on http://localhost:3001
- Frontend dev server on http://localhost:5173

### 2. Test Backend Endpoints

```bash
# Test health check
curl http://localhost:3001/health

# Test complete flow
node test-complete-flow.js

# Test explanation only
node test-explanation.js
```

### 3. Test Frontend UI

1. Open http://localhost:5173 in your browser
2. Click "Load Example Code" dropdown
3. Select any sample (e.g., "Factorial Calculator")
4. Click "Visualize Code" button
5. Verify:
   - Flowchart renders correctly
   - Stats show in header (elements count, complexity)
   - AI explanation appears below flowchart
   - Learning tips are displayed
   - Zoom controls work
   - Download SVG button works

### 4. Test Manual Code Entry

1. Clear the editor
2. Enter this code:
```python
def greet(name):
    if name:
        print(f"Hello, {name}!")
    else:
        print("Hello, World!")

greet("Drishya")
```
3. Press Ctrl+Enter or click "Visualize Code"
4. Verify flowchart and explanation generate correctly

### 5. Test Error Handling

1. Enter invalid Python code:
```python
def broken(
    print("missing closing parenthesis"
```
2. Click "Visualize Code"
3. Verify error message displays

## 📊 Sample Codes Available

1. **Hello World** - Simple print statements
2. **Simple Loop** - Basic for loop
3. **If-Else Statement** - Conditional logic
4. **Nested Conditions** - Multiple if-elif-else
5. **Function Definition** - Function with parameters
6. **Factorial Calculator** - Loop-based factorial
7. **Prime Number Checker** - Prime checking algorithm
8. **While Loop** - Countdown with while loop

## 🎨 Features to Demonstrate

### Code Analysis
- Automatic flow element detection
- Complexity calculation
- Syntax validation

### Visualization
- Clean Mermaid.js flowcharts
- Color-coded elements:
  - 🟢 Green: Start
  - 🔵 Blue: Process
  - 🟣 Purple: Loop
  - 🟡 Yellow: Decision
  - 🔴 Red: End
- Zoom in/out controls
- SVG download

### AI Explanation
- Program structure analysis
- Step-by-step flow explanation
- Learning tips based on complexity
- No external API required (demo-ready)

## 🐛 Known Issues (Fixed)

- ✅ Mermaid syntax with `#quot;` entities - FIXED
- ✅ Reserved keyword "end" causing parse errors - FIXED
- ✅ Loader showing indefinitely - FIXED
- ✅ Blank screen after visualization - FIXED
- ✅ CodeSample export issue - FIXED

## 📝 Notes

- Only Python is supported in V1
- Java, JavaScript, and C++ will be added in future versions
- AI explanations are rule-based (no LLM) for demo purposes
- Can be upgraded to use AWS Bedrock later
- All tests pass with no TypeScript errors

## 🚀 Ready for Demo!

The V1 is fully functional and ready to demonstrate:
1. Code-to-flowchart visualization
2. AI-powered explanations
3. Interactive UI with samples
4. Professional styling
5. Error handling
6. Responsive design

Enjoy showcasing Drishya-Code! 🎉
