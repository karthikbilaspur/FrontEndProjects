// src/App.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import './App.css';
import { algorithmData } from './AlgorithmData';
import AlgorithmCard from './AlgorithmCard';
import ComparisonTable from './ComparisonTable';

// Debounce hook (custom hook for debouncing logic)
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function MainAppContent() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for filters/search, initialized from URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedAlgo1, setSelectedAlgo1] = useState(searchParams.get('compare1') || '');
  const [selectedAlgo2, setSelectedAlgo2] = useState(searchParams.get('compare2') || '');

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [comparisonMessage, setComparisonMessage] = useState({ type: '', text: '' });
  const [comparisonResult, setComparisonResult] = useState(null);

  // Flatten algorithm data for easier lookup and dropdown population
  const allAlgorithmsFlat = useMemo(() => {
    const flat = [];
    algorithmData.forEach(typeGroup => {
      typeGroup.algorithms.forEach(algo => {
        flat.push({...algo, type: typeGroup.type });
      });
    });
    return flat;
  }, []);

  // Update URL whenever filters/search/comparison selections change
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedType!== 'all') params.type = selectedType;
    if (selectedAlgo1) params.compare1 = selectedAlgo1;
    if (selectedAlgo2) params.compare2 = selectedAlgo2;
    setSearchParams(params);
  }, [searchTerm, selectedType, selectedAlgo1, selectedAlgo2, setSearchParams]);

  // Filtered algorithms for the main display (using debounced search term)
  const filteredAlgorithmData = useMemo(() => {
    return algorithmData.map(typeGroup => {
      const filteredAlgos = typeGroup.algorithms.filter(algo => {
        const matchesSearch = algo.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                              Object.values(algo.details).some(detail => detail.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
        const matchesType = selectedType === 'all' || typeGroup.type === selectedType;
        return matchesSearch && matchesType;
      });
      return {...typeGroup, algorithms: filteredAlgos };
    }).filter(typeGroup => typeGroup.algorithms.length > 0);
  }, [debouncedSearchTerm, selectedType]);

  const uniqueTypes = useMemo(() => {
    const types = new Set();
    algorithmData.forEach(typeGroup => types.add(typeGroup.type));
    return Array.from(types);
  }, []);

  // Handle comparison (memoized to prevent unnecessary re-creations)
  const handleCompare = useCallback(() => {
    setComparisonMessage({ type: '', text: '' });
    setComparisonResult(null);

    if (!selectedAlgo1 ||!selectedAlgo2) {
      setComparisonMessage({ type: 'error', text: 'Please select two algorithms to compare!' });
      return;
    }
    if (selectedAlgo1 === selectedAlgo2) {
      setComparisonMessage({ type: 'error', text: 'Please select two *different* algorithms to compare!' });
      return;
    }

    const algo1 = allAlgorithmsFlat.find(algo => algo.name === selectedAlgo1);
    const algo2 = allAlgorithmsFlat.find(algo => algo.name === selectedAlgo2);

    if (algo1 && algo2) {
      setComparisonResult({ algo1, algo2 });
      setComparisonMessage({ type: 'info', text: 'Comparison ready!' });
    } else {
      setComparisonMessage({ type: 'error', text: 'Error: Could not find one or both selected algorithms.' });
    }
  }, [selectedAlgo1, selectedAlgo2, allAlgorithmsFlat]);

  // Re-run comparison if selected algorithms change (e.g., from URL)
  useEffect(() => {
    if (selectedAlgo1 && selectedAlgo2 && selectedAlgo1!== selectedAlgo2) {
      handleCompare();
    } else if (!selectedAlgo1 ||!selectedAlgo2 || selectedAlgo1 === selectedAlgo2) {
      // Clear comparison if selection is invalid or incomplete
      setComparisonResult(null);
      setComparisonMessage({ type: '', text: '' }); // Also clear message
    }
  }, [selectedAlgo1, selectedAlgo2, handleCompare]);

  const handleGoToComparison = () => {
    document.getElementById('comparison-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      <h1>Algorithm Comparison</h1>

      <div className="controls-container">
        <input
          type="text"
          id="search-input"
          placeholder="Search algorithms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select id="type-filter" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="all">Filter by Type (All)</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button onClick={() => { setSearchTerm(''); setSelectedType('all'); }}>Clear Filters</button>
        <button onClick={handleGoToComparison}>Go to Comparison <i className="fas fa-arrow-down"></i></button>
      </div>

      <div id="algorithm-sections">
        {filteredAlgorithmData.length === 0 && (
          <p id="no-results" style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2em' }}>
            No algorithms match your criteria.
          </p>
        )}
        {filteredAlgorithmData.map(typeGroup => (
          <div key={typeGroup.type} className="algorithm-type">
            <h2>{typeGroup.type}</h2>
            <p>{typeGroup.description}</p>
            {typeGroup.algorithms.map(algo => (
              <AlgorithmCard key={algo.name} algorithm={algo} />
            ))}
          </div>
        ))}
      </div>

      <div id="comparison-section">
        <h2>Algorithm Comparison Tool</h2>
        <p>Select any two algorithms to compare their key characteristics side-by-side!</p>
        <div className="comparison-controls">
          <select value={selectedAlgo1} onChange={(e) => setSelectedAlgo1(e.target.value)}>
            <option value="">Select Algorithm 1</option>
            {algorithmData.map(typeGroup => (
              <optgroup key={typeGroup.type} label={typeGroup.type}>
                {typeGroup.algorithms.map(algo => (
                  <option key={algo.name} value={algo.name}>{algo.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <select value={selectedAlgo2} onChange={(e) => setSelectedAlgo2(e.target.value)}>
            <option value="">Select Algorithm 2</option>
            {algorithmData.map(typeGroup => (
              <optgroup key={typeGroup.type} label={typeGroup.type}>
                {typeGroup.algorithms.map(algo => (
                  <option key={algo.name} value={algo.name}>{algo.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <button onClick={handleCompare}>Compare</button>
        </div>
        {comparisonMessage.text && (
          <div className={`message ${comparisonMessage.type}`}>
            {comparisonMessage.text}
          </div>
        )}
        <div id="comparison-table-container">
          {comparisonResult && (
            <ComparisonTable algo1={comparisonResult.algo1} algo2={comparisonResult.algo2} />
          )}
        </div>
      </div>
    </div>
  );
}

// Main App component to include Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainAppContent />} />
      </Routes>
    </Router>
  );
}

export default App;