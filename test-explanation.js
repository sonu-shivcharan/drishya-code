// Quick test script for the explanation endpoint
const testCode = `def greet(name):
    print(f"Hello, {name}!")

greet("World")`;

const testFlowElements = [
  { id: 'start', type: 'start', content: 'Start', codeLines: [0] },
  { id: 'func_1', type: 'function', content: 'def greet(name)', codeLines: [1] },
  { id: 'process_1', type: 'process', content: 'print(f"Hello, {name}!")', codeLines: [2] },
  { id: 'process_2', type: 'process', content: 'greet("World")', codeLines: [4] },
  { id: 'end', type: 'end', content: 'End', codeLines: [4] }
];

fetch('http://localhost:3001/api/explain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: testCode,
    flowElements: testFlowElements,
    complexity: 2
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ Explanation API Test Successful!\n');
    console.log('Explanation:');
    console.log(data.explanation);
    console.log('\nTips:');
    data.tips.forEach(tip => console.log(`  - ${tip}`));
  })
  .catch(err => {
    console.error('❌ Test failed:', err.message);
  });
