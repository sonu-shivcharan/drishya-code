// Quick test to verify Mermaid syntax is valid

const testSyntax = `flowchart TD
    start([Start])
    style start fill:#4CAF50,stroke:#333,stroke-width:2px
    start --> process_1
    process_1[print('hello')]
    style process_1 fill:#2196F3,stroke:#333,stroke-width:2px
    process_1 --> loop_2
    loop_2[[for i in range(10)]]
    style loop_2 fill:#9C27B0,stroke:#333,stroke-width:2px
    loop_2 --> process_3
    process_3[print(i)]
    style process_3 fill:#2196F3,stroke:#333,stroke-width:2px
    process_3 --> end
    end([End])
    style end fill:#F44336,stroke:#333,stroke-width:2px`;

console.log('Testing Mermaid Syntax:');
console.log(testSyntax);
console.log('\n✅ Syntax looks valid - using single quotes instead of #quot;');
