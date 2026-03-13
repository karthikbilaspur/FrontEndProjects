import React, { useState, useEffect, useCallback } from 'react'; // useCallback को इम्पोर्ट करें

function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [operator, setOperator] = useState(null);
  const [firstOperand, setFirstOperand] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [activeOperator, setActiveOperator] = useState(null);

  // वास्तविक गणना फ़ंक्शन - इसे पहले परिभाषित करें क्योंकि अन्य फ़ंक्शन इसे उपयोग करते हैं
  const operate = useCallback((num1, num2, op) => {
    if (op === '+') return num1 + num2;
    if (op === '-') return num1 - num2;
    if (op === '*') return num1 * num2;
    if (op === '/') {
      if (num2 === 0) {
        alert("त्रुटि: 0 से भाग नहीं दे सकते!"); // 0 से भाग देने पर अलर्ट
        // clearCalculator(); // यहां clearCalculator को कॉल करने से circular dependency हो सकती है
        // इसके बजाय, error state या एक साफ मान लौटाएं
        return NaN; // NaN एक अच्छा संकेत है कि गणना विफल रही
      }
      return num1 / num2;
    }
    return num2;
  }, []); // operate के पास कोई dependency नहीं है

  // AC (सभी क्लियर) फंक्शन
  const clearCalculator = useCallback(() => {
    setDisplayValue('0');
    setExpression('');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setActiveOperator(null);
  }, []); // clearCalculator के पास कोई dependency नहीं है

  // CE (क्लियर एंट्री) फंक्शन
  const handleClearEntry = useCallback(() => {
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }

    if (expression.length > 0) {
      setExpression(prev => {
        let newExpression = prev.trim();
        if (newExpression.endsWith(' +') || newExpression.endsWith(' -') ||
            newExpression.endsWith(' *') || newExpression.endsWith(' /')) {
          return newExpression.slice(0, -2).trim();
        }
        return newExpression.slice(0, -1);
      });
    }
    setActiveOperator(null);
  }, [displayValue, expression]); // displayValue और expression पर निर्भर करता है

  // ऑपरेशन हैंडल करें (+, -, *, /, =)
  const performOperation = useCallback((nextOperator) => {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
      setExpression(prev => prev === ''? String(inputValue) : prev);
    } else if (operator) {
      const result = operate(firstOperand, inputValue, operator);
      setDisplayValue(String(result));
      setFirstOperand(result);
      setExpression(String(result));
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator === '='? null : nextOperator);
    setActiveOperator(nextOperator!== '='? nextOperator : null);

    if (nextOperator!== '=') {
        if (expression.endsWith(' + ') || expression.endsWith(' - ') ||
            expression.endsWith(' * ') || expression.endsWith(' / ')) {
            setExpression(prev => prev.slice(0, -3) + ' ' + nextOperator + ' ');
        } else {
            setExpression(prev => prev + ' ' + nextOperator + ' ');
        }
    }
  }, [displayValue, firstOperand, operator, expression, operate]); // इन सभी state और operate पर निर्भर करता है

  // इनपुट नंबर को हैंडल करें
  const inputDigit = useCallback((digit) => {
    setActiveOperator(null);
    if (waitingForSecondOperand || displayValue === '0') {
      setDisplayValue(String(digit));
      setWaitingForSecondOperand(false);

      if (waitingForSecondOperand && firstOperand!== null && operator!== null) {
          setExpression(prev => prev.trim() + ' ' + digit);
      } else if (displayValue === '0' && expression === '') {
          setExpression(String(digit));
      } else {
          setExpression(prev => prev + digit);
      }
    } else {
      setDisplayValue(displayValue + digit);
      setExpression(prev => prev + digit);
    }
  }, [displayValue, waitingForSecondOperand, firstOperand, operator, expression]); // इन सभी state पर निर्भर करता है

  // दशमलव बिंदु को हैंडल करें
  const inputDecimal = useCallback(() => {
    setActiveOperator(null);
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      setExpression(prev => prev + '0.');
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
      setExpression(prev => prev + '.');
    }
  }, [displayValue, waitingForSecondOperand, expression]); // इन सभी state पर निर्भर करता है

  // कीबोर्ड इवेंट लिसनर के लिए useEffect
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (/\d/.test(key)) {
        inputDigit(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (['+', '-', '*', '/'].includes(key)) {
        performOperation(key);
      } else if (key === '=' || key === 'Enter') {
        event.preventDefault();
        performOperation('=');
      } else if (key === 'Backspace') {
        handleClearEntry();
      } else if (key === 'Escape') {
        clearCalculator();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, performOperation, handleClearEntry, clearCalculator]); // अब dependencies में useCallback द्वारा wrap किए गए functions शामिल हैं

  return (
    <div className="calculator">
      <div className="calculator-expression">{expression || '0'}</div> {/* Fix: expression || '0' for initial display */}
      <div className="calculator-display">{displayValue}</div>

      <div className="calculator-buttons">
        {/* AC और CE बटन */}
        <button className="all-clear" onClick={clearCalculator}>AC</button>
        <button className="clear-entry" onClick={handleClearEntry}>CE</button>

        {/* ऑपरेटर बटन - इन्हें grid flow के लिए सही जगह पर रखें */}
        <button className={`operator ${activeOperator === '/' ? 'active' : ''}`} onClick={() => performOperation('/')}>/</button>
        <button className={`operator ${activeOperator === '*' ? 'active' : ''}`} onClick={() => performOperation('*')}>*</button>

        {[7, 8, 9].map((digit) => (
          <button key={digit} onClick={() => inputDigit(digit)}>{digit}</button>
        ))}
        <button className={`operator ${activeOperator === '-' ? 'active' : ''}`} onClick={() => performOperation('-')}>-</button>

        {[4, 5, 6].map((digit) => (
          <button key={digit} onClick={() => inputDigit(digit)}>{digit}</button>
        ))}
        <button className={`operator ${activeOperator === '+' ? 'active' : ''}`} onClick={() => performOperation('+')}>+</button>

        {[1, 2, 3].map((digit) => (
          <button key={digit} onClick={() => inputDigit(digit)}>{digit}</button>
        ))}
        <button className="equal-sign" onClick={() => performOperation('=')}>=</button>

        <button className="zero-btn" onClick={() => inputDigit(0)}>0</button>
        <button onClick={inputDecimal}>.</button>
        {/*
          पहले के कोड में 1,2,3 के बाद '+' ऑपरेटर था, लेकिन '=' बटन अब 0 और '.' के बाद आ रहा है।
          अगर आप एक standard 4x5 कैलकुलेटर लेआउट चाहते हैं, तो बटन के क्रम को adjust करना होगा।
          मैंने इसे इस तरह रखा है कि 0, . के बाद '=' आए, फिर यह CSS grid के साथ काम करेगा
          अगर आप '+', '-', '*', '/' को दाहिनी ओर रखना चाहते हैं, तो आपको grid-column या button के order को adjust करना होगा।
        */}
      </div>
    </div>
  );
}

export default Calculator;