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
  // added more card types
  {
    name: 'JCB',
    regex: /^(?:2131|1800|21)/,
  },
  {
    name: 'Diners Club',
    regex: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
  },
];