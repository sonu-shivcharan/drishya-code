# 🚀 Drishya-Code Quick Start

Get up and running in 2 minutes!

## Option 1: Automated Setup (Recommended)

### Windows
```bash
start-dev.bat
```

### Linux/Mac
```bash
chmod +x start-dev.sh
./start-dev.sh
```

That's it! The script will:
- ✅ Install all dependencies
- ✅ Start backend on http://localhost:3001
- ✅ Start frontend on http://localhost:5173
- ✅ Open your browser automatically

## Option 2: Using npm scripts

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev
```

## Option 3: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Try It Out!

1. Open http://localhost:5173
2. Paste this Python code:

```python
def greet(name):
    if name:
        print(f"Hello, {name}!")
    else:
        print("Hello, World!")

greet("Drishya")
```

3. Click "Visualize Code"
4. See your code as a beautiful flowchart! 🎨

## What's Working?

✅ Python code parsing
✅ Flowchart generation
✅ Interactive visualization
✅ Zoom controls
✅ Download as SVG
✅ Error detection

## What's Next?

Check out the example files in `examples/`:
- `simple-loop.py` - Basic loops
- `conditional.py` - If/else statements
- `sample-python.py` - Functions and complex logic

## Troubleshooting

**Port already in use?**
- Backend: Edit `backend/server.ts` PORT variable
- Frontend: Vite will auto-select next available port

**Can't connect to backend?**
- Check http://localhost:3001/health
- Verify backend terminal shows "server running"
- Check `frontend/.env.development` has correct URL

**Need help?**
- See SETUP.md for detailed instructions
- Check browser console for errors
- Review backend terminal logs

## Development Commands

```bash
# Run tests
npm run test:all

# Run property-based tests
npm run test:property

# Build for production
npm run build:all

# Format code
npm run format

# Lint code
npm run lint
```

Happy coding! 🎉
