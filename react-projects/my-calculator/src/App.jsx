import React from 'react';
import Calculator from './Calculator'; // सुनिश्चित करें कि फाइल का पथ सही है
import './App.css'; // स्टाइल के लिए

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>डिजिटल कैलकुलेटर</h1> {/* Digital Calculator */}
      </header>
      <Calculator />
      {/* यहाँ आप उपयोग के लिए निर्देश डाल सकते हैं */}
      <div className="instructions">
        <h2>उपयोग के लिए निर्देश:</h2> {/* Instructions for Use: */}
        <ul>
          <li>अंक दबाकर नंबर दर्ज करें।</li> {/* Enter numbers by pressing the digits. */}
          <li>दशमलव बिंदु के लिए '.' दबाएं।</li> {/* Press '.' for the decimal point. */}
          <li>संक्रिया (जैसे +, -, *, /) करने के लिए ऑपरेटर बटन दबाएं।</li> {/* Press an operator button to perform an operation. */}
          <li>परिणाम देखने के लिए '=' दबाएं।</li> {/* Press '=' to see the result. */}
          <li>सभी गणना साफ़ करने के लिए 'AC' दबाएं।</li> {/* Press 'AC' to clear all calculations. */}
        </ul>
      </div>
    </div>
  );
}

export default App;