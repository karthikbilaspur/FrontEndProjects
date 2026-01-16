export const cardTypes = [
  {
    name: 'Visa',
    regex: /^4/,
  },
  {
    name: 'Mastercard',
    regex: /^5[1-5]/,
  },
  {
    name: 'American Express',
    regex: /^3[47]/,
  },
  {
    name: 'Discover',
    regex: /^6(?:011|5)/,
  },
];