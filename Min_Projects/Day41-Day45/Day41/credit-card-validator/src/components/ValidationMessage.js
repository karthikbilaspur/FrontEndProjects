import React from 'react';
import CardType from './CardType';

const ValidationMessage = ({ isValid, cardType, error }) => {
  if (error) {
    return <p className="error">{error}</p>;
  }

  if (isValid === null) return null;

  return (
    <p className={isValid ? 'valid' : 'invalid'}>
      {isValid ? 'Valid credit card number' : 'Invalid credit card number'}
      <CardType type={cardType} />
    </p>
  );
};

export default ValidationMessage;