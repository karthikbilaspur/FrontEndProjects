export const formatInput = (value) => {
  const cardNumberWithoutSpaces = value.replace(/\s+/g, '');
  return cardNumberWithoutSpaces.replace(/(\d{4})(?=\d)/g, '$1 ');
};