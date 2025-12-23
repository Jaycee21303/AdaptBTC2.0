const chartCanvas = document.getElementById('btc-chart');
const resetButton = document.getElementById('reset-zoom');

if (chartCanvas) {
  const formatUSD = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  const buildChart = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=max'
      );
      if (!response.ok) {
        throw new Error('Chart request failed');
      }
      const data = await response.json();
      const points = data.prices.map(([timestamp, price]) => ({
        x: timestamp,
        y: price,
      }));

      const chart = new Chart(chartCanvas, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'BTC/USD',
              data: points,
              borderColor: '#2ec5ff',
              backgroundColor: 'rgba(46, 197, 255, 0.15)',
              fill: true,
              pointRadius: 0,
              borderWidth: 2,
              tension: 0.2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => formatUSD(context.parsed.y),
              },
            },
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: 'x',
              },
              pan: {
                enabled: true,
                mode: 'x',
              },
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'year',
              },
              ticks: {
                color: '#6c7b8a',
              },
            },
            y: {
              ticks: {
                color: '#6c7b8a',
                callback: (value) => formatUSD(value),
              },
            },
          },
        },
      });

      resetButton?.addEventListener('click', () => {
        chart.resetZoom();
      });
    } catch (error) {
      chartCanvas.parentElement.innerHTML =
        '<p>Unable to load price history right now. Please refresh later.</p>';
    }
  };

  buildChart();
}
