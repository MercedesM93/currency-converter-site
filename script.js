const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

const currencyList = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "INR", "ZAR"];

const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amount = document.getElementById('amount');
const result = document.getElementById('result');
const convertBtn = document.getElementById('convert');

currencyList.forEach(curr => {
  const option1 = document.createElement('option');
  option1.value = curr;
  option1.textContent = curr;
  fromCurrency.appendChild(option1);

  const option2 = document.createElement('option');
  option2.value = curr;
  option2.textContent = curr;
  toCurrency.appendChild(option2);
});

fromCurrency.value = 'USD';
toCurrency.value = 'EUR';

convertBtn.addEventListener('click', async () => {
  const base = fromCurrency.value;
  const target = toCurrency.value;
  const amountValue = parseFloat(amount.value);

  if (isNaN(amountValue)) {
    result.textContent = 'Please enter a valid number';
    return;
  }

  const response = await fetch(`${API_URL}${base}`);
  const data = await response.json();
  const rate = data.rates[target];
  const converted = (amountValue * rate).toFixed(2);

  result.textContent = `${amountValue} ${base} = ${converted} ${target}`;
});
