# Drishya-Code Local Development Setup

## Quick Start Guide

### Step 1: Install Dependencies

Make sure you have Node.js 18+ installed. Check with:
```bash
node --version
npm --version
```

### Step 2: Start Development Environment

**On Windows:**
```bash
start-dev.bat
```

**On Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

The script will:
1. Install backend dependencies
2. Install frontend dependencies
3. Start backend server on port 3001
4. Start frontend on port 5173

### Step 3: Test the Application

1. Open your browser to http://localhost:5173
2. Select "Python" as the language
3. Try one of these sample codes:

**Simple Example:**
```python
x = 5
if x > 3:
    print("x is greater than 3")
```

**Loop Example:**
```python
for i in range(5):
    print(i)
```

**Function Example:**
```python
def add(a, b):
    return a + b

result = add(5, 3)
print(result)
```

4. Click "Visualize Code" to see the flowchart!

## Manual Setup (Alternative)

If the startup script doesn't work, run services manually:

### Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend will start on http://localhost:3001

### Frontend Application

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on http://localhost:5173

## Troubleshooting

### Port Already in Use

If port 3001 or 5173 is already in use:

**Backend (port 3001):**
- Edit `backend/server.ts` and change the PORT variable
- Update `frontend/.env.development` with the new backend URL

**Frontend (port 5173):**
- Vite will automatically try the next available port
- Check the terminal output for the actual port

### Dependencies Installation Fails

Try clearing npm cache:
```bash
npm cache clean --force
```

Then reinstall:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Backend Connection Error

Make sure:
1. Backend server is running (check http://localhost:3001/health)
2. Frontend `.env.development` has correct API URL
3. No firewall blocking localhost connections

### Flowchart Not Rendering

Check browser console for errors. Common issues:
- Mermaid syntax error (check backend logs)
- CORS error (backend should have CORS enabled)
- Network error (backend not running)

## Testing the API Directly

You can test the backend API using curl:

**Health Check:**
```bash
curl http://localhost:3001/health
```

**Code Analysis:**
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"code":"x = 5\nprint(x)","language":"python","userId":"test"}'
```

**Visualization:**
```bash
curl -X POST http://localhost:3001/api/visualize \
  -H "Content-Type: application/json" \
  -d '{"flowElements":[{"id":"start","type":"start","content":"Start","codeLines":[0],"children":[],"metadata":{"complexity":0,"nestingLevel":0}}],"preferences":{"theme":"light","complexity":"detailed","language":"english"}}'
```

## Next Steps

Once everything is running:

1. Try the sample Python files in the `examples/` folder
2. Experiment with different code structures
3. Check the browser console and backend logs for debugging
4. Explore the zoom and download features in the flowchart viewer

## Development Tips

- Backend auto-reloads on file changes (using ts-node)
- Frontend has hot module replacement (HMR)
- Check backend terminal for API request logs
- Use browser DevTools Network tab to debug API calls

## Need Help?

- Check the main README.md for project overview
- Review the design document in `.kiro/specs/drishya-code/design.md`
- Look at the tasks list in `.kiro/specs/drishya-code/tasks.md`
