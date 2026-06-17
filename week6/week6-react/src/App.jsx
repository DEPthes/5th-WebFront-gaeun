import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  const handleNumber = (num) => {
    if (display === '0' || isFinished) {
      setDisplay(num);
      setIsFinished(false);
    } else {
      setDisplay(display + num);
    }
    setEquation(equation + num);
  };

  const handleOperator = (op) => {
    setIsFinished(false);
    setEquation(equation + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleCalculate = () => {
    try {
      const sanitizeEq = equation.replace(/×/g, '*').replace(/÷/g, '/');
      const result = new Function(`return ${sanitizeEq}`)();

      if (isNaN(result) || !isFinite(result)) {
        setDisplay('오류');
      } else {
        setDisplay(String(Number(result.toFixed(4))));
      }
    } catch (error) {
      setDisplay('오류');
    }

    setEquation('');
    setIsFinished(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsFinished(false);
  };

  return (
    <div className="calculator-container">
      <div className="display-panel">
        <div className="equation-view">{equation || ' '}</div>

        <div
          className="display-view"
          style={{
            fontSize:
              display.length > 15
                ? "20px"
                : display.length > 10
                ? "28px"
                : "40px"
          }}
        >
          {display}
        </div>
      </div>

      <div className="button-panel">
        <button className="btn func-btn" onClick={handleClear}>C</button>
        <button className="btn op-btn" onClick={() => handleOperator('÷')}>÷</button>
        <button className="btn op-btn" onClick={() => handleOperator('×')}>×</button>
        <button className="btn op-btn" onClick={() => handleOperator('-')}>-</button>

        <button className="btn num-btn" onClick={() => handleNumber('7')}>7</button>
        <button className="btn num-btn" onClick={() => handleNumber('8')}>8</button>
        <button className="btn num-btn" onClick={() => handleNumber('9')}>9</button>
        <button className="btn op-btn" onClick={() => handleOperator('+')}>+</button>

        <button className="btn num-btn" onClick={() => handleNumber('4')}>4</button>
        <button className="btn num-btn" onClick={() => handleNumber('5')}>5</button>
        <button className="btn num-btn" onClick={() => handleNumber('6')}>6</button>

        <button className="btn equal-btn" onClick={handleCalculate}>
          =
        </button>

        <button className="btn num-btn" onClick={() => handleNumber('1')}>1</button>
        <button className="btn num-btn" onClick={() => handleNumber('2')}>2</button>
        <button className="btn num-btn" onClick={() => handleNumber('3')}>3</button>

        <button
          className="btn num-btn zero-btn"
          onClick={() => handleNumber('0')}
        >
          0
        </button>
      </div>
    </div>
  );
}