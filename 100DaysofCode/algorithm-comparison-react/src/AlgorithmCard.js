// src/AlgorithmCard.js
import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

function AlgorithmCard({ algorithm }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <>
      <h3>
        {algorithm.name}
        {algorithm.link && (
          <a href={algorithm.link} target="_blank" rel="noopener noreferrer" className="external-link">
            <i className="fas fa-external-link-alt"></i>
          </a>
        )}
        {algorithm.codeExample && (
          <button className="code-toggle-btn" onClick={() => setShowCode(!showCode)}>
            {showCode? 'Hide Code' : 'Show Code'}
          </button>
        )}
      </h3>
      {algorithm.codeExample && showCode && (
        <pre className="code-example">
          {algorithm.codeExample.trim()}
        </pre>
      )}
      <div className="algorithm-details">
        <ul>
          {Object.entries(algorithm.details).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// PropTypes validation for AlgorithmCard
AlgorithmCard.propTypes = {
  algorithm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string,
    details: PropTypes.objectOf(PropTypes.string).isRequired,
    codeExample: PropTypes.string,
  }).isRequired,
};

export default AlgorithmCard;