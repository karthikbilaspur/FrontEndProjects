// src/Stopwatch.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Stopwatch.css'; // Import component-specific CSS

// Helper to format time from milliseconds
const formatTime = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10); // Display two digits for milliseconds

  const pad = (num) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
};

// --- Stopwatch Component ---
function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // Current stopwatch time in milliseconds
  const [laps, setLaps] = useState([]); // Array of lap times
  const [theme, setTheme] = useState(() => localStorage.getItem('stopwatchTheme') || 'light');
  const [autoResetAfterPause, setAutoResetAfterPause] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState(null); // Timestamp when paused
  const [isResetAllowed, setIsResetAllowed] = useState(false); // To enable reset button only when not 0

  const intervalRef = useRef(null); // Reference to the interval ID
  const lastLapTimeRef = useRef(0); // Time at which the last lap was recorded

  // --- Handlers - Defined First to avoid declaration issues ---

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
    setPauseStartTime(null);
    setIsResetAllowed(false); // Disable reset button immediately
  }, []); // No dependencies for reset, as it just sets initial state

  const handleStartPause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      setPauseStartTime(Date.now()); // Record pause start time
    } else {
      setIsRunning(true);
      setPauseStartTime(null); // Clear pause start time when resuming
    }
  }, [isRunning]);

  const handleLap = useCallback(() => {
    if (isRunning) {
      const lapTime = time - lastLapTimeRef.current;
      setLaps((prevLaps) => [
      ...prevLaps,
        {
          id: prevLaps.length + 1,
          lap: formatTime(lapTime),
          total: formatTime(time),
          lapMs: lapTime,
          totalMs: time,
        },
      ]);
      lastLapTimeRef.current = time; // Update last lap time
    }
  }, [isRunning, time]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light'? 'dark' : 'light'));
  }, []);

  const handleToggleAutoReset = useCallback(() => {
    setAutoResetAfterPause((prev) =>!prev);
  }, []);

  const handleExportLaps = () => {
    if (laps.length === 0) {
      alert('No lap times to export!');
      return;
    }

    // Create CSV content
    const headers = ['Lap Number', 'Lap Time', 'Total Time'];
    const csvRows = [
      headers.join(','),
    ...laps.map(lap => `${lap.id},"${lap.lap}","${lap.total}"`)
    ];
    const csvString = csvRows.join('\n');

    // Create a Blob and download it
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download!== undefined) { // Feature detection for download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `stopwatch_laps_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Your browser does not support downloading files directly. Please copy the text from the console.');
      console.log(csvString);
    }
  };

  // --- Load state from Local Storage on mount ---
  useEffect(() => {
    const savedIsRunning = JSON.parse(localStorage.getItem('stopwatchIsRunning'));
    const savedTime = JSON.parse(localStorage.getItem('stopwatchTime'));
    const savedLaps = JSON.parse(localStorage.getItem('stopwatchLaps'));
    const savedTheme = localStorage.getItem('stopwatchTheme');
    const savedLastLapTime = JSON.parse(localStorage.getItem('stopwatchLastLapTime'));
    const savedAutoResetSetting = JSON.parse(localStorage.getItem('stopwatchAutoReset'));

    if (savedIsRunning!== null) setIsRunning(savedIsRunning);
    if (savedTime!== null) setTime(savedTime);
    if (savedLaps!== null) setLaps(savedLaps);
    if (savedTheme) setTheme(savedTheme);
    if (savedLastLapTime!== null) lastLapTimeRef.current = savedLastLapTime;
    if (savedAutoResetSetting!== null) setAutoResetAfterPause(savedAutoResetSetting);

    // If it was running when last closed, restart the timer
    if (savedIsRunning && savedTime!== null) {
      const timeWhenClosed = savedTime;
      const closedAt = JSON.parse(localStorage.getItem('stopwatchClosedAt'));
      if (closedAt) {
        const timeElapsedSinceClosed = Date.now() - closedAt;
        setTime(timeWhenClosed + timeElapsedSinceClosed);
      }
    }
  }, []);

  // --- Handle main timer interval ---
  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time; // Adjust for already elapsed time
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10); // Update every 10ms for smooth milliseconds
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current); // Cleanup on unmount or isRunning change
  }, [isRunning, time]);

  // --- Persist state to Local Storage ---
  useEffect(() => {
    localStorage.setItem('stopwatchIsRunning', JSON.stringify(isRunning));
    localStorage.setItem('stopwatchTime', JSON.stringify(time));
    localStorage.setItem('stopwatchLaps', JSON.stringify(laps));
    localStorage.setItem('stopwatchTheme', theme);
    localStorage.setItem('stopwatchLastLapTime', JSON.stringify(lastLapTimeRef.current));
    localStorage.setItem('stopwatchAutoReset', JSON.stringify(autoResetAfterPause));

    if (!isRunning) {
      localStorage.setItem('stopwatchClosedAt', JSON.stringify(Date.now()));
    } else {
      localStorage.removeItem('stopwatchClosedAt'); // Clear if running
    }

    // Enable Reset button only if time is not zero or there are laps
    setIsResetAllowed(time > 0 || laps.length > 0);

  }, [isRunning, time, laps, theme, autoResetAfterPause]);

  // --- Apply theme to body class ---
  useEffect(() => {
    document.body.className = theme === 'dark'? 'dark-theme' : '';
  }, [theme]);

  // --- Auto-reset logic ---
  useEffect(() => {
    let autoResetTimer;
    if (!isRunning && pauseStartTime && autoResetAfterPause) {
      // Set a timer for 5 seconds (5000ms) after pause
      autoResetTimer = setTimeout(() => {
        if (!isRunning) { // Double check it's still paused
          handleReset(); // handleReset is now declared before this point
          setPauseStartTime(null); // Clear pause start time
        }
      }, 5000); // 5 seconds
    }
    return () => clearTimeout(autoResetTimer);
  }, [isRunning, pauseStartTime, autoResetAfterPause, handleReset]); // Added handleReset to dependencies

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') { // Spacebar for Start/Pause
        event.preventDefault(); // Prevent scrolling
        handleStartPause();
      } else if (event.code === 'KeyL' || event.code === 'NumpadEnter') { // 'L' or NumpadEnter for Lap
        event.preventDefault();
        handleLap();
      } else if (event.code === 'KeyR' &&!isRunning) { // 'R' for Reset (only when not running)
        event.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleStartPause, handleLap, handleReset, isRunning]); // Dependencies for useCallback functions

  // --- JSX Render ---
  return (
    <div className={`stopwatch-container ${theme}`}>
      <div className="stopwatch-header">
        <h1 className="stopwatch-title">Digital Stopwatch</h1>
        <button className="theme-toggle-button" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light'? '🌙' : '☀️'}
        </button>
      </div>

      <div className="time-display">
        {formatTime(time)}
      </div>

      <div className="controls">
        <button
          className={`control-button start-pause ${isRunning? 'pause' : 'start'}`}
          onClick={handleStartPause}
        >
          {isRunning? 'Pause' : (time === 0 && laps.length === 0? 'Start' : 'Resume')}
        </button>
        <button
          className="control-button lap-button"
          onClick={handleLap}
          disabled={!isRunning}
        >
          Lap
        </button>
        <button
          className="control-button reset-button"
          onClick={handleReset}
          disabled={!isResetAllowed}
        >
          Reset
        </button>
      </div>

      <div className="settings">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={autoResetAfterPause}
            onChange={handleToggleAutoReset}
          />
          <span className="checkmark"></span>
          Auto-reset 5s after pause
        </label>
        <button className="export-laps-button" onClick={handleExportLaps} disabled={laps.length === 0}>
          Export Laps ({laps.length})
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps-container">
          <h2 className="laps-title">Laps</h2>
          <ul className="laps-list">
            {laps.map((lap, index) => (
              <li key={lap.id} className="lap-item">
                <span className="lap-number">Lap {lap.id}:</span>
                <span className="lap-time">{lap.lap}</span>
                <span className="total-time">(Total: {lap.total})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Stopwatch;