const calculateTipButton = document.getElementById('calculate-tip');
const resultElement = document.getElementById('result');

calculateTipButton.addEventListener('click', () => {
  const billAmount = parseFloat(document.getElementById('bill-amount').value);
  const serviceQuality = parseFloat(document.getElementById('service-quality').value);

  if (isNaN(billAmount) || billAmount <= 0) {
    alert('Please enter a valid bill amount');
    return;
  }

  const tipAmount = billAmount * serviceQuality;
  const totalAmount = billAmount + tipAmount;

  resultElement.textContent = `Tip Amount: ₹${tipAmount.toFixed(2)}
  Total Amount: ₹${totalAmount.toFixed(2)}`;
});