const priceEl = document.getElementById('btc-price');
const changeEl = document.getElementById('btc-change');
const updatedEl = document.getElementById('btc-updated');

let lastPrice = null;

const formatUSD = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const formatTime = (date) =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

const setChange = (current) => {
  if (lastPrice === null) {
    changeEl.textContent = '';
    return;
  }

  const diff = current - lastPrice;
  const percentage = (diff / lastPrice) * 100;
  const prefix = diff >= 0 ? '+' : '';
  changeEl.textContent = `${prefix}${percentage.toFixed(2)}%`;
  changeEl.style.color = diff >= 0 ? '#2ec5ff' : '#ff9f9f';
};

const updatePrice = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    if (!response.ok) {
      throw new Error('Price request failed');
    }
    const data = await response.json();
    const price = data.bitcoin.usd;
    priceEl.textContent = formatUSD(price);
    setChange(price);
    updatedEl.textContent = `Updated ${formatTime(new Date())}`;
    lastPrice = price;
  } catch (error) {
    priceEl.textContent = 'Live price unavailable';
    changeEl.textContent = '';
    updatedEl.textContent = '';
  }
};

updatePrice();
setInterval(updatePrice, 60000);
