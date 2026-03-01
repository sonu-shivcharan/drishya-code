#!/bin/bash

# Test script for Drishya-Code API

echo "🧪 Testing Drishya-Code API..."
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s http://localhost:3001/health | json_pp
echo ""

# Test code analysis
echo "2. Testing code analysis endpoint..."
curl -s -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "x = 5\nif x > 3:\n    print(\"yes\")",
    "language": "python",
    "userId": "test-user"
  }' | json_pp
echo ""

echo "✅ API tests complete!"
