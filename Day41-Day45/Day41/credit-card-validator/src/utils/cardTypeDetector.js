import { cardTypes } from '../constants/cardTypes';

export const detectCardType = (cardNumber) => {
  const cardNumberWithoutSpaces = cardNumber.replace(/\s+/g, '');
  return cardTypes.find((type) => type.regex.test(cardNumberWithoutSpaces))?.name;
};