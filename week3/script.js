// 1. 필요한 요소
const display = document.querySelector('.result');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';      
let previousInput = '';   
let operator = null;       
let shouldResetScreen = false; 

// 2. 클릭 이벤트 리스너
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        // AC (초기화) 버튼 처리
        if (value === 'AC') {
            resetCalculator();
        } 
        // = (결과) 버튼 처리
        else if (value === '=') {
            evaluate();
        } 
        // %, +/- 같은 특수 기능 처리
        else if (button.classList.contains('btn-func') && isNaN(value)) {
            handleSpecialFunc(value);
        }
        // 연산자 버튼 처리
        else if (button.classList.contains('btn-operator')) {
            handleOperator(value);
        } 
        // 숫자 및 소수점 처리
        else {
            handleNumber(value);
        }
        
        updateDisplay();
    });
});

// 숫자를 화면에 표시하는 함수
function handleNumber(num) {
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = num;
        shouldResetScreen = false;
    } else {
        // 소수점 중복 방지
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
    }
}

// 연산자 처리 함수
function handleOperator(nextOperator) {
    if (operator !== null) evaluate(); 
    
    previousInput = currentInput;
    operator = nextOperator;
    shouldResetScreen = true;
}

// 실제 계산 수행 함수
function evaluate() {
    if (operator === null || shouldResetScreen) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷': 
            if (current === 0) {
                alert("0으로 나눌 수 없어요!");
                resetCalculator();
                return;
            }
            result = prev / current; 
            break;
        default: return;
    }

    currentInput = result.toString();
    operator = null;
    shouldResetScreen = true;
}

// 초기화 함수
function resetCalculator() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetScreen = false;
}

// 특수 기능 (+/-, % 등) 간단 처리
function handleSpecialFunc(func) {
    if (func === '+/-') {
        currentInput = (parseFloat(currentInput) * -1).toString();
    } else if (func === '%') {
        currentInput = (parseFloat(currentInput) / 100).toString();
    }
}

// 화면 업데이트 함수
function updateDisplay() {
    display.textContent = currentInput;
}