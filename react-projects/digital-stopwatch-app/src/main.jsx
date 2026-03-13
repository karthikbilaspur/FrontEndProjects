// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import Stopwatch from './Stopwatch.jsx' // Import your new component
import './index.css' // Keep global styles for body background, etc.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Stopwatch /> {/* Render your Stopwatch component */}
  </React.StrictMode>,
)