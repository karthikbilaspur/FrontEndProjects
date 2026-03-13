import React from 'react'
import ReactDOM from 'react-dom/client'
import PasswordGenerator from './PasswordGenerator.jsx' // Import your new component
import './index.css' // Keep global styles for body background, etc.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PasswordGenerator /> {/* Render your PasswordGenerator component */}
  </React.StrictMode>,
)