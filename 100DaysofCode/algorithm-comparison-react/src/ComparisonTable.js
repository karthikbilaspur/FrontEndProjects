// src/ComparisonTable.js
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

function ComparisonTable({ algo1, algo2 }) {
  // Collect all unique feature keys from both algorithms
  const allFeatureKeys = new Set();
  Object.keys(algo1.details).forEach(key => allFeatureKeys.add(key));
  Object.keys(algo2.details).forEach(key => allFeatureKeys.add(key));

  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>{algo1.name}</th>
          <th>{algo2.name}</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(allFeatureKeys).map(key => (
          <tr key={key}>
            <td><strong>{key}</strong></td>
            <td>{algo1.details[key] || 'N/A'}</td>
            <td>{algo2.details[key] || 'N/A'}</td>
          </tr>
        ))}
        {(algo1.link || algo2.link) && (
          <tr>
            <td><strong>More Info</strong></td>
            <td>
              {algo1.link? (
                <a href={algo1.link} target="_blank" rel="noopener noreferrer">
                  {algo1.name} Wikipedia <i className="fas fa-external-link-alt"></i>
                </a>
              ) : 'N/A'}
            </td>
            <td>
              {algo2.link? (
                <a href={algo2.link} target="_blank" rel="noopener noreferrer">
                  {algo2.name} Wikipedia <i className="fas fa-external-link-alt"></i>
                </a>
              ) : 'N/A'}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

// PropTypes validation for ComparisonTable
ComparisonTable.propTypes = {
  algo1: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string,
    details: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  algo2: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string,
    details: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default ComparisonTable;