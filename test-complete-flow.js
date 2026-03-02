// Complete integration test for Drishya-Code V1
const API_BASE = 'http://localhost:3001';

const testCode = `def factorial(n):
    if n == 0 or n == 1:
        return 1
    
    result = 1
    for i in range(2, n + 1):
        result = result * i
    
    return result

number = 5
fact = factorial(number)
print(f"Factorial of {number} is {fact}")`;

console.log('🧪 Testing Drishya-Code V1 Complete Flow\n');
console.log('=' .repeat(50));

// Step 1: Analyze Code
console.log('\n📊 Step 1: Analyzing code...');
fetch(`${API_BASE}/api/analyze`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: testCode,
    language: 'python',
    userId: 'test-user'
  })
})
  .then(res => res.json())
  .then(analysisResult => {
    console.log(`✅ Analysis complete: ${analysisResult.flowElements.length} elements found`);
    console.log(`   Complexity: ${analysisResult.complexity.cyclomaticComplexity}`);
    
    // Step 2: Generate Visualization
    console.log('\n🎨 Step 2: Generating visualization...');
    return fetch(`${API_BASE}/api/visualize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flowElements: analysisResult.flowElements,
        preferences: {
          theme: 'light',
          complexity: 'detailed',
          language: 'english'
        }
      })
    })
      .then(res => res.json())
      .then(vizResult => ({ analysisResult, vizResult }));
  })
  .then(({ analysisResult, vizResult }) => {
    console.log('✅ Visualization generated');
    console.log(`   Mermaid syntax length: ${vizResult.mermaidSyntax.length} chars`);
    
    // Step 3: Generate Explanation
    console.log('\n🤖 Step 3: Generating AI explanation...');
    return fetch(`${API_BASE}/api/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: testCode,
        flowElements: analysisResult.flowElements,
        complexity: analysisResult.complexity.cyclomaticComplexity
      })
    })
      .then(res => res.json())
      .then(explainResult => ({ analysisResult, vizResult, explainResult }));
  })
  .then(({ analysisResult, vizResult, explainResult }) => {
    console.log('✅ Explanation generated');
    console.log(`   Tips count: ${explainResult.tips.length}`);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS PASSED!\n');
    
    console.log('📋 Summary:');
    console.log(`   - Flow Elements: ${analysisResult.flowElements.length}`);
    console.log(`   - Complexity: ${analysisResult.complexity.cyclomaticComplexity}`);
    console.log(`   - Mermaid Syntax: ${vizResult.mermaidSyntax.length} chars`);
    console.log(`   - Explanation: ${explainResult.explanation.length} chars`);
    console.log(`   - Tips: ${explainResult.tips.length}`);
    
    console.log('\n💡 Explanation Preview:');
    console.log(explainResult.explanation.split('\n').slice(0, 5).join('\n'));
    console.log('   ...\n');
    
    console.log('💡 Tips:');
    explainResult.tips.forEach(tip => console.log(`   - ${tip}`));
    
    console.log('\n✨ Drishya-Code V1 is ready for demo!');
  })
  .catch(err => {
    console.error('\n❌ Test failed:', err.message);
    console.error('Make sure the backend server is running on port 3001');
  });
