export interface CodeSample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: 'python' | 'java' | 'javascript' | 'cpp';
}

export const pythonSamples: CodeSample[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Simple print statement',
    language: 'python',
    code: `print("Hello, Drishya-Code!")
x = 5
print(f"The value is {x}")`,
  },
  {
    id: 'simple-loop',
    title: 'Simple Loop',
    description: 'Basic for loop example',
    language: 'python',
    code: `for i in range(5):
    print(i)
    
print("Loop complete")`,
  },
  {
    id: 'conditional',
    title: 'If-Else Statement',
    description: 'Conditional logic example',
    language: 'python',
    code: `age = 18

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")`,
  },
  {
    id: 'nested-conditions',
    title: 'Nested Conditions',
    description: 'Multiple if-elif-else statements',
    language: 'python',
    code: `score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Your grade is: {grade}")`,
  },
  {
    id: 'function',
    title: 'Function Definition',
    description: 'Simple function with parameters',
    language: 'python',
    code: `def greet(name):
    if name:
        print(f"Hello, {name}!")
    else:
        print("Hello, World!")

greet("Drishya")
greet("")`,
  },
  {
    id: 'factorial',
    title: 'Factorial Calculator',
    description: 'Calculate factorial using loop',
    language: 'python',
    code: `def factorial(n):
    if n == 0 or n == 1:
        return 1
    
    result = 1
    for i in range(2, n + 1):
        result = result * i
    
    return result

number = 5
fact = factorial(number)
print(f"Factorial of {number} is {fact}")`,
  },
  {
    id: 'prime-check',
    title: 'Prime Number Checker',
    description: 'Check if a number is prime',
    language: 'python',
    code: `def is_prime(num):
    if num < 2:
        return False
    
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    
    return True

number = 17
if is_prime(number):
    print(f"{number} is prime")
else:
    print(f"{number} is not prime")`,
  },
  {
    id: 'while-loop',
    title: 'While Loop',
    description: 'Count down using while loop',
    language: 'python',
    code: `count = 5

while count > 0:
    print(f"Count: {count}")
    count = count - 1

print("Blast off!")`,
  },
];

export const getAllSamples = (): CodeSample[] => {
  return [...pythonSamples];
};

export const getSamplesByLanguage = (language: string): CodeSample[] => {
  switch (language) {
    case 'python':
      return pythonSamples;
    default:
      return [];
  }
};
