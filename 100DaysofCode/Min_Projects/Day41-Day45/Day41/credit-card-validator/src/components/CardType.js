import React from 'react';

const CardType = ({ type }) => {
  if (!type) return null;

  return (
    <p>
      Card Type: <span className={`card-type ${type.toLowerCase()}`}>{type}</span>
    </p>
  );
};

export default CardType;