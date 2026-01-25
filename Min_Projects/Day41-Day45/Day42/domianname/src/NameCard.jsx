import React from 'react';
import PropTypes from 'prop-types';

const nameCheapUrl = "https://www.namecheap.com/domains/registration/results/?domain=";

const NameCard = ({ suggestedName }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      className="card-link"
      href={`${nameCheapUrl}${suggestedName}`}
    >
      <div className="result-name-card">
        <p className="result-name">{suggestedName}</p>
      </div>
    </a>
  );
};

NameCard.propTypes = {
  suggestedName: PropTypes.string.isRequired,
};

export default NameCard;