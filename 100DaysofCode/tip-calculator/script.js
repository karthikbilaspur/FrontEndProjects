const currencySymbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€'
};

let billHistory = [];
let selectedCurrency = 'INR'; // default currency
let currentLanguage = 'en';

const languages = {
    en: {
        billAmount: 'Bill Amount',
        tipPercentage: 'Tip Percentage',
        serviceCharge: 'Service Charge',
        tax: 'Tax (%)',
        discount: 'Discount (%)',
        splitBill: 'Split Bill',
        paymentMethod: 'Payment Method',
        calculate: 'Calculate',
        reset: 'Reset',
        print: 'Print Invoice',
        tipAmount: 'Tip Amount',
        tipPerPerson: 'Tip per Person',
        totalAmount: 'Total Amount',
        totalBillBreakdown: 'Bill Breakdown'
    },
    hi: {
        billAmount: 'बिल राशि',
        tipPercentage: 'टिप प्रतिशत',
        serviceCharge: 'सेवा शुल्क',
        tax: 'कर (%)',
        discount: 'छूट (%)',
        splitBill: 'बिल विभाजन',
        paymentMethod: 'भुगतान विधि',
        calculate: 'गणना करें',
        reset: 'रीसेट',
        print: 'इनवॉइस प्रिंट करें',
        tipAmount: 'टिप राशि',
        tipPerPerson: 'प्रति व्यक्ति टिप',
        totalAmount: 'कुल राशि',
        totalBillBreakdown: 'बिल विवरण'
    },
    kn: {
        billAmount: 'ಬಿಲ್ ಮೊತ್ತ',
        tipPercentage: 'ಟಿಪ್ ಶೇಕಡಾವಾರು',
        serviceCharge: 'ಸೇವಾ ಶುಲ್ಕ',
        tax: 'ತೆರಿಗೆ (%)',
        discount: 'ರಿಯಾಯಿತಿ (%)',
        splitBill: 'ಬಿಲ್ ವಿಭಜನೆ',
        paymentMethod: 'ಪಾವತಿ ವಿಧಾನ',
        calculate: 'ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ',
        reset: 'ಮರುಹೊಂದಿಸಿ',
        print: 'ಇನ್‌ವಾಯ್ಸ್ ಮುದ್ರಿಸಿ',
        tipAmount: 'ಟಿಪ್ ಮೊತ್ತ',
        tipPerPerson: 'ಪ್ರತಿ ವ್ಯಕ್ತಿಗೆ ಟಿಪ್',
        totalAmount: 'ಒಟ್ಟು ಮೊತ್ತ',
        totalBillBreakdown: 'ಬಿಲ್ ವಿವರ'
    }
};

// Function to format currency
const formatCurrency = (amount) => {
    return `${currencySymbols[selectedCurrency]}${amount.toFixed(2)}`;
};

// Function to calculate bill
const calculateBill = () => {
    try {
        const billAmount = parseFloat(document.getElementById('bill-amount').value);
        if (isNaN(billAmount) || billAmount <= 0) {
            throw new Error('Invalid bill amount');
        }

        let tipPercentage;
        if (document.getElementById('tip-percentage').value === 'custom') {
            tipPercentage = parseFloat(document.getElementById('custom-tip').value);
            if (isNaN(tipPercentage) || tipPercentage < 0) {
                throw new Error('Invalid custom tip percentage');
            }
        } else {
            tipPercentage = parseFloat(document.getElementById('tip-percentage').value);
        }

        const serviceCharge = parseFloat(document.getElementById('service-charge').value) || 0;
        const tax = parseFloat(document.getElementById('tax').value) || 0;
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const splitBill = parseInt(document.getElementById('split-bill').value);
        if (isNaN(splitBill) || splitBill <= 0) {
            throw new Error('Invalid number of people');
        }

        const subtotal = billAmount;
        const taxAmount = (subtotal * tax) / 100;
        const discountAmount = (subtotal * discount) / 100;
        const tipAmount = (subtotal * tipPercentage) / 100;
        const totalAmount = subtotal + taxAmount + serviceCharge - discountAmount + tipAmount;
        const tipPerPerson = tipAmount / splitBill;
        const totalPerPerson = totalAmount / splitBill;

        const billBreakdown = `
            Subtotal: ${formatCurrency(subtotal)}
            Tax (${tax}%): ${formatCurrency(taxAmount)}
            Service Charge: ${formatCurrency(serviceCharge)}
            Discount (${discount}%): -${formatCurrency(discountAmount)}
            Tip (${tipPercentage}%): ${formatCurrency(tipAmount)}
            Total: ${formatCurrency(totalAmount)}
        `;

        document.getElementById('tip-amount').innerText = `${languages[currentLanguage].tipAmount}: ${formatCurrency(tipAmount)}`;
        document.getElementById('tip-per-person').innerText = `${languages[currentLanguage].tipPerPerson}: ${formatCurrency(tipPerPerson)}`;
        document.getElementById('total-amount').innerText = `${languages[currentLanguage].totalAmount}: ${formatCurrency(totalAmount)}`;
        document.getElementById('total-bill-breakdown').innerText = `${languages[currentLanguage].totalBillBreakdown}:\n${billBreakdown}`;

        billHistory.push({
            billAmount,
            tipPercentage,
            serviceCharge,
            tax,
            discount,
            splitBill,
            totalAmount
        });

        document.getElementById('share-btn').style.display = 'block';
        document.getElementById('save-btn').style.display = 'block';
    } catch (error) {
        document.getElementById('tip-amount').innerText = '';
        document.getElementById('tip-per-person').innerText = '';
        document.getElementById('total-amount').innerText = `Error: ${error.message}`;
        document.getElementById('total-bill-breakdown').innerText = '';
    }
};

// Update language
function updateLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-lang]').forEach((element) => {
        const key = element.getAttribute('data-lang');
        element.innerText = languages[lang][key];
    });
}

// Event listeners
document.getElementById('tip-percentage').addEventListener('change', () => {
    const tipPercentage = document.getElementById('tip-percentage').value;
    if (tipPercentage === 'custom') {
        document.getElementById('custom-tip').style.display = 'block';
    } else {
        document.getElementById('custom-tip').style.display = 'none';
    }
});

document.getElementById('calculate-btn').addEventListener('click', (e) => {
    e.preventDefault();
    calculateBill();
});

document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('bill-amount').value = '';
    document.getElementById('tip-percentage').value = '10';
    document.getElementById('custom-tip').value = '';
    document.getElementById('service-charge').value = '';
    document.getElementById('tax').value = '';
    document.getElementById('discount').value = '';
    document.getElementById('split-bill').value = '1';
    document.getElementById('payment-method').value = 'cash';
    document.getElementById('tip-amount').innerText = '';
    document.getElementById('tip-per-person').innerText = '';
    document.getElementById('total-amount').innerText = '';
    document.getElementById('total-bill-breakdown').innerText = '';
});

document.getElementById('print-btn').addEventListener('click', () => {
    const billBreakdown = document.getElementById('total-bill-breakdown').innerText;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>Invoice</h1>');
    printWindow.document.write('<pre>' + billBreakdown + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});

document.getElementById('language-selector').addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

// Initialize language
updateLanguage(currentLanguage);

document.getElementById('payment-method').addEventListener('change', function() {
  var paymentMethod = this.value;
  if (paymentMethod === 'card') {
    document.getElementById('card-payment').style.display = 'block';
  } else {
    document.getElementById('card-payment').style.display = 'none';
  }
});

document.getElementById('generate-qr').addEventListener('click', function(event) {
  event.preventDefault();
  var qrInput = document.getElementById('qr-input').value;
  var qrcode = new QRCode(document.getElementById('qr-code'), {
    text: qrInput,
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });

    // Clear input field after generating QR code
    document.getElementById('qr-input').value = '';
});