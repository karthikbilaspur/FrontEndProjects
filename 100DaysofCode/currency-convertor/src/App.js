import React from "react";
import Converter from "./components/Converter";
import "./App.css";

function App() {
  return (
    <div className="App">
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">

      <h1>💱 Currency Converter</h1>
      <Converter />
    </div>
    </div>
  );
}

export default App;