import React, { useState } from 'react';
import CardInput from './CardInput';
import CardType from './CardType';
import ValidationMessage from './ValidationMessage';
import { detectCardType } from '../utils/cardTypeDetector';
import { validateCardNumber } from '../utils/luhnValidator';

const CreditCardValidator = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [error, setError] = useState(null);

  const handleCardNumberChange = (value) => {
    setCardNumber(value);
    setError(null);
  };

  const handleValidate = () => {
    if (!cardNumber) {
      setError('Please enter a card number');
      return;
    }

    const isValid = validateCardNumber(cardNumber);
    const cardType = detectCardType(cardNumber);
    setIsValid(isValid);
    setCardType(cardType);
  };

  return (
    <div className="credit-card-validator">
      <h1>Credit Card Validator</h1>
      <CardInput value={cardNumber} onChange={handleCardNumberChange} />
      <button onClick={handleValidate}>Validate</button>
      <ValidationMessage isValid={isValid} cardType={cardType} error={error} />
    </div>
  );
};

export default CreditCardValidator;