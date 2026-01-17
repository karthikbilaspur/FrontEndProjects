export const validateCardNumber = (cardNumber) => {
  const cardNumberWithoutSpaces = cardNumber.replace(/\s+/g, '');
  if (!/^\d+$/.test(cardNumberWithoutSpaces)) {
    return false;
  }

  const sum = cardNumberWithoutSpaces
    .split('')
    .reverse()
    .map((digit, index) => {
      let num = parseInt(digit);
      if (index % 2 !== 0) {
        num *= 2;
        if (num > 9) {
          num -= 9;
        }
        return num;
      }
      return num;
    })
    .reduce((acc, num) => acc + num, 0);

  return sum % 10 === 0;
};