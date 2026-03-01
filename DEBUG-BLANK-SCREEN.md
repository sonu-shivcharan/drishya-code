# 🔍 Debugging Blank Screen Issue

## Quick Checks

### 1. Open Browser Console (F12)
Look for these messages:
- "Rendering Mermaid syntax: ..." 
- "Mermaid render result: ..."
- "Flowchart rendered successfully"

### 2. Check for Errors
Look for red error messages in console. Common ones:
- "Mermaid returned empty SVG"
- "Parse error"
- "Syntax error"

### 3. Check Network Tab
- Go to Network tab in DevTools
- Look for `/api/visualize` request
- Check the response - should have `mermaidSyntax` field

## Recent Fixes Applied

### Fix 1: Simplified Content Escaping
- Removed all quotes from node content
- Removed special characters
- Wrapped content in double quotes in node definition

### Fix 2: Better Error Reporting
- Added console logs at each step
- Show actual Mermaid syntax in error message
- Check for empty SVG

### Fix 3: Proper Node Syntax
Changed from:
```
process_1[print(hello)]
```

To:
```
process_1["print hello"]
```

## Test the Fix

1. **Restart Backend**
   ```bash
   cd backend
   # Stop with Ctrl+C
   npm run dev
   ```

2. **Hard Refresh Frontend**
   - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Or clear browser cache

3. **Try Simple Code**
   ```python
   x = 5
   print(x)
   ```

4. **Check Console**
   - Should see "Flowchart rendered successfully"
   - Should see the flowchart appear

## If Still Blank

### Check 1: Is SVG Being Generated?
Open console and look for:
```
Mermaid render result: SVG generated
```

If you see "No SVG", the Mermaid library isn't generating output.

### Check 2: Is There an Error?
Look for error messages. If you see an error, expand the "Show Mermaid Syntax" section to see what syntax is failing.

### Check 3: Test Mermaid Directly
Open `test-mermaid.html` in your browser to test if Mermaid works at all.

## Expected Console Output

```
Rendering Mermaid syntax: flowchart TD
    start(["Start"])
    ...
Mermaid render result: SVG generated
Flowchart rendered successfully
```

## Common Issues

### Issue: "Parse error in Mermaid"
**Solution**: The syntax has invalid characters. Check the Mermaid syntax in the error details.

### Issue: "Mermaid returned empty SVG"
**Solution**: Mermaid rendered but produced nothing. Usually means syntax is valid but something else is wrong.

### Issue: Blank screen, no errors
**Solution**: 
1. Check if `mermaidSyntax` prop is actually being passed
2. Check React DevTools to see component state
3. Verify the FlowchartRenderer component is mounted

## Manual Test

Try this in browser console while on the page:

```javascript
// Check if mermaid is loaded
console.log(typeof mermaid);  // Should be 'object'

// Try rendering manually
const testSyntax = `flowchart TD
    A["Start"] --> B["End"]`;
    
mermaid.render('test-id', testSyntax).then(result => {
    console.log('Manual render result:', result);
});
```

## Get More Help

If still not working, provide:
1. Console output (all messages)
2. Network tab response for `/api/visualize`
3. Any error messages
4. Browser and version

---

**Latest Status**: Applied fixes for proper node syntax with quoted content
