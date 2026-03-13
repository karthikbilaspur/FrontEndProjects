const calculateButton = document.getElementById('calculate');
const resultElement = document.getElementById('result');

calculateButton.addEventListener('click', () => {
  const principal = parseFloat(document.getElementById('principal').value);
  const rate = parseFloat(document.getElementById('rate').value);
  const time = parseFloat(document.getElementById('time').value);

  if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
    alert('Please enter valid inputs');
    return;
  }

  const interest = (principal * rate * time) / 100;
  const amount = principal + interest;

  resultElement.textContent = `Interest: ₹${interest.toFixed(2)}
  Amount: ₹${amount.toFixed(2)}`;
});