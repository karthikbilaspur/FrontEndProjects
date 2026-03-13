// src/PasswordGenerator.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import './PasswordGenerator.jsx'; // Import your CSS

// Helper function to get a random item from an array or string
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16); // Default to a stronger length
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState('N/A'); // Initialize as N/A
  const [copyStatus, setCopyStatus] = useState(''); // For copy confirmation message

  const passwordInputRef = useRef(null); // Ref for direct input access

  // Define character sets
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:",.<>/?`~'; // More comprehensive symbols

  // Function to calculate password strength
  const calculateStrength = useCallback((pwd) => {
    let score = 0;
    if (!pwd || pwd.length === 0 || pwd === 'Please select at least one character type.') {
      return 'N/A';
    }

    // Length score
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (pwd.length >= 20) score++; // Even stronger for very long passwords

    // Character type scores
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    // Check for a range of symbols (need to escape special regex chars)
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd)) score++;

    // Entropy (simple approximation)
    let possibleChars = 0;
    if (includeLowercase) possibleChars += lowerChars.length;
    if (includeUppercase) possibleChars += upperChars.length;
    if (includeNumbers) possibleChars += numberChars.length;
    if (includeSymbols) possibleChars += symbolChars.length;
    
    // A simplified entropy measure to boost score for diverse charsets
    if (possibleChars > 60) score++; // e.g., all types included
    if (possibleChars > 80) score++; // very diverse

    // Classify based on score
    if (score < 4) return 'Weak';
    if (score < 7) return 'Moderate';
    return 'Strong';
  }, [includeLowercase, includeUppercase, includeNumbers, includeSymbols]);

  const generatePassword = useCallback(() => {
    let allAvailableChars = '';
    let guaranteedChars = [];
    let currentPasswordArray = [];

    // Build the pool of all possible characters and collect one guaranteed char from each selected type
    if (includeLowercase) {
      allAvailableChars += lowerChars;
      guaranteedChars.push(getRandomItem(lowerChars));
    }
    if (includeUppercase) {
      allAvailableChars += upperChars;
      guaranteedChars.push(getRandomItem(upperChars));
    }
    if (includeNumbers) {
      allAvailableChars += numberChars;
      guaranteedChars.push(getRandomItem(numberChars));
    }
    if (includeSymbols) {
      allAvailableChars += symbolChars;
      guaranteedChars.push(getRandomItem(symbolChars));
    }

    // Handle case where no character types are selected
    if (allAvailableChars.length === 0) {
      setPassword('Please select at least one character type.');
      setPasswordStrength('N/A');
      return;
    }

    // Add guaranteed characters to the password array
    // Take only as many guaranteed chars as the password length allows, to prevent overflow
    currentPasswordArray = guaranteedChars.slice(0, length);

    // Fill the rest of the password length randomly from the full pool
    for (let i = currentPasswordArray.length; i < length; i++) {
      currentPasswordArray.push(getRandomItem(allAvailableChars));
    }

    // Shuffle the array to mix guaranteed characters with random ones
    // Fisher-Yates (Knuth) shuffle algorithm
    for (let i = currentPasswordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentPasswordArray[i], currentPasswordArray[j]] = [currentPasswordArray[j], currentPasswordArray[i]]; // ES6 swap
    }

    const finalPassword = currentPasswordArray.join('');
    setPassword(finalPassword);
    setPasswordStrength(calculateStrength(finalPassword));
    setCopyStatus(''); // Reset copy status on new generation
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    calculateStrength,
  ]);

  // Effect to generate password on initial load and when dependencies change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    if (passwordInputRef.current && password) {
      // Modern way to copy (requires secure context - HTTPS)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(password)
         .then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus(''), 2000);
          })
         .catch(err => {
            console.error('Failed to copy password: ', err);
            // Fallback for older browsers or non-secure contexts
            passwordInputRef.current.select();
            document.execCommand('copy');
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus(''), 2000);
          });
      } else {
        // Fallback for older browsers (document.execCommand is deprecated but still works widely)
        passwordInputRef.current.select();
        document.execCommand('copy');
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      }
    }
  };

  // Determine strength indicator class
  const getStrengthClass = () => {
    switch (passwordStrength) {
      case 'Weak': return 'strength-weak';
      case 'Moderate': return 'strength-moderate';
      case 'Strong': return 'strength-strong';
      case 'N/A': return 'strength-na'; // New class for N/A state
      default: return '';
    }
  };

  return (
    <div className="password-generator-container">
      <h1>Secure Password Generator</h1>

      <div className="password-display-wrapper">
        <input
          type="text"
          value={password}
          readOnly
          ref={passwordInputRef} // Attach ref here
          className="password-input"
          placeholder="Generate a password..."
        />
        <button onClick={copyToClipboard} className="copy-button" disabled={!password || password === 'Please select at least one character type.'}>
          {copyStatus || 'Copy'}
        </button>
      </div>
      <div className={`password-strength ${getStrengthClass()}`}>
        Strength: {passwordStrength}
      </div>

      <div className="controls">
        <div className="control-group length-control">
          <label htmlFor="passwordLength">Password Length: <span>{length}</span></label>
          <input
            id="passwordLength"
            type="range"
            min="6"
            max="30"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
            />
            Include Uppercase Letters (A-Z)
          </label>
        </div>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
            />
            Include Lowercase Letters (a-z)
          </label>
        </div>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            Include Numbers (0-9)
          </label>
        </div>
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            Include Symbols (!@#$)
          </label>
        </div>

        <button onClick={generatePassword} className="generate-button">
          Generate New Password
        </button>
      </div>
    </div>
  );
}

export default PasswordGenerator;