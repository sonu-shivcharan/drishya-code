# Pre-Demo Checklist for Drishya-Code V1

## ✅ Before Starting Demo

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Start the Application
```bash
# From root directory
# Windows:
start-dev.bat

# Linux/Mac:
./start-dev.sh
```

### 3. Verify Services Running
- [ ] Backend running on http://localhost:3001
- [ ] Frontend running on http://localhost:5173
- [ ] No console errors in terminal

### 4. Quick Health Check
```bash
# Test backend health
curl http://localhost:3001/health

# Should return: {"status":"ok","timestamp":"..."}
```

### 5. Open Browser
- [ ] Navigate to http://localhost:5173
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools

## 🎯 Demo Script

### Part 1: Introduction (30 seconds)
"Drishya-Code transforms Python code into visual flowcharts with AI-powered explanations, making it easier for students to understand program flow."

### Part 2: Load Sample Code (30 seconds)
1. Click "Load Example Code" button
2. Select "Factorial Calculator"
3. Show the code in the editor
4. Point out the line numbers and syntax

### Part 3: Generate Visualization (1 minute)
1. Click "Visualize Code" button
2. Watch the loading animation
3. Point out the flowchart elements:
   - Green start node
   - Blue process nodes
   - Yellow decision nodes
   - Purple loop nodes
   - Red end node
4. Show the stats in header (elements count, complexity)

### Part 4: AI Explanation (1 minute)
1. Scroll down to the explanation panel
2. Read the program structure analysis
3. Point out the step-by-step flow
4. Highlight the learning tips

### Part 5: Interactive Features (1 minute)
1. Use zoom controls (+ and -)
2. Click "Download SVG" button
3. Show the downloaded flowchart
4. Try another sample (e.g., "Prime Number Checker")

### Part 6: Manual Code Entry (1 minute)
1. Clear the editor
2. Type a simple program:
```python
name = "Drishya"
if name:
    print(f"Hello, {name}!")
else:
    print("Hello, World!")
```
3. Press Ctrl+Enter to visualize
4. Show the instant flowchart generation

### Part 7: Error Handling (30 seconds)
1. Enter invalid code:
```python
def broken(
    print("error"
```
2. Click visualize
3. Show the error message

## 🎨 Key Features to Highlight

### Technical Features
- ✅ AST-based Python parsing
- ✅ Automatic flow element detection
- ✅ Complexity calculation
- ✅ Mermaid.js visualization
- ✅ Rule-based AI explanations
- ✅ No external API dependencies

### User Experience
- ✅ Clean, modern UI
- ✅ 8 ready-to-use examples
- ✅ Keyboard shortcuts (Ctrl+Enter)
- ✅ Zoom and download controls
- ✅ Responsive design
- ✅ Real-time error feedback

### Educational Value
- ✅ Visual learning aid
- ✅ Step-by-step explanations
- ✅ Learning tips
- ✅ Complexity metrics
- ✅ Interactive exploration

## 🐛 Troubleshooting

### Backend Not Starting
```bash
cd backend
npm install
npm run dev
```

### Frontend Not Starting
```bash
cd frontend
npm install
npm run dev
```

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3001 | xargs kill -9
```

### Visualization Not Showing
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for API calls
4. Refresh the page

## 📊 Expected Results

### Analysis Endpoint
- Input: Python code
- Output: Flow elements, complexity, errors
- Response time: < 500ms

### Visualization Endpoint
- Input: Flow elements
- Output: Mermaid syntax, element mapping
- Response time: < 200ms

### Explanation Endpoint
- Input: Code, flow elements, complexity
- Output: Explanation text, learning tips
- Response time: < 100ms

## ✨ Demo Success Criteria

- [ ] All 8 sample codes visualize correctly
- [ ] AI explanations generate for all samples
- [ ] Zoom controls work smoothly
- [ ] SVG download produces valid files
- [ ] Error handling works for invalid code
- [ ] Manual code entry works
- [ ] Keyboard shortcuts work
- [ ] Stats display correctly
- [ ] No console errors
- [ ] Responsive design works on different screen sizes

## 🎉 Post-Demo

### Questions to Anticipate
1. **Q: Can it handle other languages?**
   A: V1 supports Python. Java, JavaScript, and C++ coming in future versions.

2. **Q: Does it use real AI?**
   A: V1 uses rule-based explanations. Can be upgraded to AWS Bedrock/OpenAI.

3. **Q: Can students save their work?**
   A: Not in V1. User accounts and saving coming in future versions.

4. **Q: How complex code can it handle?**
   A: Tested with up to 100+ lines. Handles nested loops, functions, conditionals.

5. **Q: Is it mobile-friendly?**
   A: Yes! Responsive design works on tablets and phones.

### Next Steps to Mention
- V2: Java support
- V3: JavaScript support
- V4: C++ support
- V5: AWS deployment with user accounts
- Future: Real-time collaboration, code execution, quizzes

## 📝 Notes

- Keep demo under 5-7 minutes
- Focus on visual appeal and ease of use
- Emphasize educational value
- Show error handling briefly
- End with a complex example (factorial or prime checker)
- Have backup samples ready
- Test everything 5 minutes before demo

**Good luck with the demo! 🚀**
