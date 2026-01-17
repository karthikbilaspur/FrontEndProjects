import React from 'react';
import PropTypes from 'prop-types';
import NameCard from './NameCard';

const ResultContainer = ({ suggestedNames }) => {
  if (suggestedNames.length === 0) {
    return null;
  }

  const suggestedNamesJsx = suggestedNames.map((suggestedName) => (
    <NameCard key={suggestedName} suggestedName={suggestedName} />
  ));

  return <div className="results-container">{suggestedNamesJsx}</div>;
};

ResultContainer.propTypes = {
  suggestedNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ResultContainer;