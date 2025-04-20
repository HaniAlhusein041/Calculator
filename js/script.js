        // Calculator state
        let firstOperand = null;
        let secondOperand = null;
        let currentOperation = null;
        let shouldResetScreen = false;
        let lastButtonWasOperator = false;

        // DOM elements
        const display = document.getElementById('display');
        const errorDisplay = document.getElementById('error');
        const numberButtons = document.querySelectorAll('[id^="one"], [id^="two"], [id^="three"], [id^="four"], [id^="five"], [id^="six"], [id^="seven"], [id^="eight"], [id^="nine"], [id^="zero"]');
        const operatorButtons = document.querySelectorAll('.operator:not(#equals)');
        const equalsButton = document.getElementById('equals');
        const clearButton = document.getElementById('clear');
        const decimalButton = document.getElementById('decimal');
        const backspaceButton = document.getElementById('backspace');

        // Event listeners
        numberButtons.forEach(button => {
            button.addEventListener('click', () => appendNumber(button.textContent));
        });

        operatorButtons.forEach(button => {
            button.addEventListener('click', () => setOperation(button.textContent));
        });

        equalsButton.addEventListener('click', evaluate);
        clearButton.addEventListener('click', clear);
        decimalButton.addEventListener('click', appendDecimal);
        backspaceButton.addEventListener('click', backspace);

        // Keyboard support
        window.addEventListener('keydown', handleKeyboardInput);

        // Basic math functions
        function add(a, b) {
            return a + b;
        }

        function subtract(a, b) {
            return a - b;
        }

        function multiply(a, b) {
            return a * b;
        }

        function divide(a, b) {
            if (b === 0) {
                errorDisplay.textContent = "Nice try, but you can't divide by zero!";
                return null;
            }
            return a / b;
        }

        // Operate function
        function operate(operator, a, b) {
            a = Number(a);
            b = Number(b);
            
            switch (operator) {
                case '+':
                    return add(a, b);
                case '-':
                    return subtract(a, b);
                case '×':
                    return multiply(a, b);
                case '÷':
                    return divide(a, b);
                default:
                    return null;
            }
        }

        // Display functions
        function appendNumber(number) {
            if (display.textContent === '0' || shouldResetScreen) {
                resetScreen();
            }
            
            // If last button was an operator, start new number
            if (lastButtonWasOperator) {
                resetScreen();
                lastButtonWasOperator = false;
            }
            
            display.textContent += number;
        }

        function appendDecimal() {
            if (shouldResetScreen) resetScreen();
            if (display.textContent.includes('.')) return;
            if (display.textContent === '') display.textContent = '0';
            display.textContent += '.';
        }

        function resetScreen() {
            display.textContent = '';
            shouldResetScreen = false;
            errorDisplay.textContent = '';
        }

        function backspace() {
            if (display.textContent.length === 1 || 
                (display.textContent.length === 2 && display.textContent.startsWith('-'))) {
                display.textContent = '0';
            } else if (display.textContent !== '0') {
                display.textContent = display.textContent.slice(0, -1);
            }
        }

        function clear() {
            display.textContent = '0';
            firstOperand = null;
            secondOperand = null;
            currentOperation = null;
            shouldResetScreen = false;
            errorDisplay.textContent = '';
            lastButtonWasOperator = false;
        }

        function setOperation(operator) {
            if (currentOperation !== null && !shouldResetScreen) {
                evaluate();
            }
            
            firstOperand = display.textContent;
            currentOperation = operator;
            shouldResetScreen = true;
            lastButtonWasOperator = true;
        }

        function evaluate() {
            if (currentOperation === null || shouldResetScreen) return;
            
            secondOperand = display.textContent;
            const result = operate(currentOperation, firstOperand, secondOperand);
            
            if (result === null) {
                // Error already displayed by divide function
                return;
            }
            
            display.textContent = roundResult(result);
            currentOperation = null;
            shouldResetScreen = true;
            lastButtonWasOperator = false;
        }

        function roundResult(number) {
            return Math.round(number * 100000) / 100000;
        }

        function handleKeyboardInput(e) {
            if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
            if (e.key === '.') appendDecimal();
            if (e.key === '=' || e.key === 'Enter') evaluate();
            if (e.key === 'Backspace') backspace();
            if (e.key === 'Escape') clear();
            if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                const operatorMap = {
                    '+': '+',
                    '-': '-',
                    '*': '×',
                    '/': '÷'
                };
                setOperation(operatorMap[e.key]);
            }
        }