# Sample Python Code for Testing Drishya-Code

def calculate_factorial(n):
    """Calculate factorial of a number"""
    if n == 0 or n == 1:
        return 1
    else:
        result = 1
        for i in range(2, n + 1):
            result = result * i
        return result

def is_prime(num):
    """Check if a number is prime"""
    if num < 2:
        return False
    
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    
    return True

# Main program
number = 5
factorial = calculate_factorial(number)
print(f"Factorial of {number} is {factorial}")

if is_prime(number):
    print(f"{number} is a prime number")
else:
    print(f"{number} is not a prime number")
