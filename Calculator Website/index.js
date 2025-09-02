const calculator = document.querySelector('.calculator');
const display = document.querySelector('.display');
const keys = calculator.querySelector('.calculator-keys');
var isNegative = false;
var isClean = true;

keys.addEventListener(
    'click',
    element => {

      if (element.target.matches('button')) {
        const key = element.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayNum = display.textContent;

        if (!action) {  // Number was pushed.

          if (calculator.dataset.previousKeyType === 'calculate')
            calculator.dataset.previousKeyType = 'clear';

          addToDisplay(keyContent);
          calculator.dataset.previousKeyType = 'number';

        } else {  // operator or function

          switch (action) {
            case 'clear':
              display.textContent = '0';
              calculator.dataset.previousKeyType = 'clear';
              break;

            case 'clear-entry':
              if (calculator.dataset.previousKeyType === 'calculate') {
                display.textContent = '0';
                calculator.dataset.previousKeyType = 'clear';

              } else

              if (display.textContent.length > 1) {
                display.textContent = displayNum.slice(0, -1);
                
              } else {
                display.textContent = '0';
                calculator.dataset.previousKeyType = 'clear';
              }
              
              break;
              
              case 'divide':
                addToDisplay('/');
                calculator.dataset.previousKeyType = 'operator';
                break;
                
                case 'multiply':
              addToDisplay('*');
              calculator.dataset.previousKeyType = 'operator';
              break;
              
              case 'subtract':
                addToDisplay('-');
                calculator.dataset.previousKeyType = 'operator';
                break;
                
                case 'add':
                  addToDisplay('+');
                  calculator.dataset.previousKeyType = 'operator';
                  break;
                  
                  case 'decimal-point':
              addToDisplay('.');
              calculator.dataset.previousKeyType = 'operator';
              break;
  
              case 'square-root':
                addToDisplay('sqrt(');
                calculator.dataset.previousKeyType = 'operator';
                break;
  
              case 'cubic-root':
                addToDisplay('cbrt(');
                calculator.dataset.previousKeyType = 'operator';
                break;
              
              case 'percent':
                addToDisplay('%');
                calculator.dataset.previousKeyType = 'operator';
                break;

            case 'sin':
              addToDisplay('sin(');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'cos':
              addToDisplay('cos(');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'tan':
              addToDisplay('tan(');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'log10':
              addToDisplay('log(');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'open-parenthesis':
              addToDisplay('(');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'close-parenthesis':
              addToDisplay(')');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'modulo':
              addToDisplay('mod');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'degrees':
              addToDisplay('deg(');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'power':
              addToDisplay('^');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'exp':
              addToDisplay('exp(');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'factorial':
              addToDisplay('!');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'pi':
              addToDisplay('\u03C0');
              calculator.dataset.previousKeyType = 'operator';
              break;

            case 'calculate':
              // Example usage:
              //  "1+2*3-4/5^6 = 6.999744"
              //  "((((1+2)*3)-4)/5)^6 = 1"
              //  "(1/999 999 999.999)×999 999 999.999"
              //  "sin(DEG(180))-cos(2pi)' = -1
              //  "1-(1^-26)"
              //  "-1*-1"

              let factor = Math.pow(10, 10);
              display.textContent = Math.round(calculate() * factor) / factor;
              calculator.dataset.previousKeyType = 'calculate';
              break;
          }
        }


        // helper function.
        function addToDisplay(str) {
          if (display.textContent.length < 30) {
            if (calculator.dataset.previousKeyType === 'clear' ||
                !calculator.dataset.previousKeyType)
              display.textContent = str;
            else
              display.textContent += str;
          }
        }
      }
    })

    // Global variable to hold the input expression
    let displayValue = '';

// Append a value to the display
function append(value) {
  displayValue += value;
}

// Clear the display
function clearDisplay() {
  displayValue = '';
}

// Delete the last character
function deleteLast() {
  displayValue = displayValue.slice(0, -1);
}

// Evaluate the expression without using eval()
function calculate() {
  try {
    const tokens = tokenize(display.textContent);
    const postfix = infixToPostfix(tokens);
    const result = evaluatePostfix(postfix);
    return result.toString();
  } catch (error) {
    return 'Error';
  }
}

// Tokenize the input expression
function tokenize(expression) {
  const regex = /(\d+(\.\d+)?|[+\-*/^()!'\u03C0'%]|sin|cos|tan|log|sqrt|cbrt|exp|deg|mod)/g;
  const tokens = expression.match(regex);

  if (tokens) {
    const processedTokens = [];
    tokens.forEach((token, i) => {

      if (  // negative numbers
          token === '-' &&
          (i === 0 || tokens[i - 1] === '(' || isOperator(tokens[i - 1]))) {
        // Negative sign followed by a number
        processedTokens.push('-' + tokens[i + 1]);
        tokens.splice(i + 1, 1);  // Skip the next token since it's merged

      } else {
        processedTokens.push(token);
      }
    });
    return processedTokens;
  }
  return [];
}

// Convert infix to postfix using Shunting Yard Algorithm
function infixToPostfix(tokens) {
  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
    '%': 3,
    mod: 3,
    sin: 4,
    cos: 4,
    tan: 4,
    log: 4,
    sqrt: 4,
    cbrt: 4,
    exp: 4,
    deg: 4,
    '!': 4,
    '\u03C0': 5,
  };
  const associativity = {
    '+': 'L',
    '-': 'L',
    '*': 'L',
    '/': 'L',
    '^': 'R',
  };
  const output = [];
  const operators = [];

  tokens.forEach(token => {
    if (!isNaN(token)) {
      // token is a number.

      output.push(parseFloat(token));

    } else if (token === '(') {
      operators.push(token);

    } else if (token === ')') {
      // Pop operators to the output until '(' is found
      while (operators.length && operators[operators.length - 1] !== '(') {
        output.push(operators.pop());
      }
      operators.pop();  // Remove '('

    } else {
      // token is an operator or function

      while (
          operators.length && operators[operators.length - 1] !== '(' &&
          (precedence[operators[operators.length - 1]] > precedence[token] ||
           (precedence[operators[operators.length - 1]] === precedence[token] &&
            associativity[token] === 'L'))) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  });

  // Pop any remaining operators to the output
  while (operators.length) {
    output.push(operators.pop());
  }

  return output;
}

// Evaluate postfix expression
function evaluatePostfix(postfix) {
  const stack = [];

  postfix.forEach(token => {

    if (typeof token === 'number') {
      stack.push(token);
    } else {
      if (isOperator(token)) {
        const b = stack.pop();
        const a = stack.pop();

        switch (token) {
          case '+':
            stack.push(a + b);
            break;

          case '-':
            stack.push(a - b);
            break;

          case '*':
            stack.push(a * b);
            break;

          case '/':
            stack.push(a / b);
            break;

          case '^':
            stack.push(Math.pow(a, b));
            break;

          case 'mod':
            stack.push(a % b);
            break;
        }

      } else if (['sin', 'cos', 'tan', 'log', 'sqrt', 'cbrt', 'exp', '!', '\u03C0', 'deg', '%']
                     .includes(token)) {
        const a = stack.pop();

        switch (token) {
          case 'deg':
            stack.push((a / 180) * Math.PI);
            break;
          
          case 'sin':
            stack.push(Math.sin(a));
            break;

          case 'cos':
            stack.push(Math.cos(a));
            break;

          case 'tan':
            stack.push(Math.tan(a));
            break;

          case 'log':
            stack.push(Math.log10(a));
            break;

          case 'sqrt':
            stack.push(Math.sqrt(a));
            break;

          case 'cbrt':
            stack.push(Math.cbrt(a));
            break;

          case 'exp':
            stack.push(Math.exp(a));
            break;

          case '!':
            stack.push(factorial(a));
            break;

          case '%':
            stack.push((a)/100);
            break;

          case '\u03C0':
            if (a) {
              stack.push(a * Math.PI)
            } else {
              stack.push(Math.PI)
            }
            break;
        }
      }
    }

  });

  return stack[0];
}

// --------------------------- Helper Functions -----------------------------
function isOperator(token) {
  return ['+', '-', '*', '/', '^', 'mod'].includes(token);
}

function factorial(n) {
  if (n < 0) return NaN;  // Factorial of negative numbers is undefined
  if (n === 0 || n === 1) return 1;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}


/* ------------------ Shunting Yard Algorithm Psuedocode ---------------------
- While there are tokens to be read:
-  Read a token
-  If it's a number add it to queue
-  If it's an operator
-    While there's an operator on the top of the stack with greater precedence:
-      Pop operators from the stack onto the output queue
-    Push the current operator onto the stack
-  If it's a left bracket push it onto the stack
-  If it's a right bracket
-    While there's not a left bracket at the top of the stack:
-      Pop operators from the stack onto the output queue.
-    Pop the left bracket from the stack and discard it
- While there are operators on the stack, pop them to the queue
*/