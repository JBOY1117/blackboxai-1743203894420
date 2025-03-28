import AviatorAPI from './api.js';

// Initialize Chart.js for predictions
const ctx = document.getElementById('predictionChart').getContext('2d');
const predictionChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({length: 20}, (_, i) => i + 1),
        datasets: [{
            label: 'Prediction Curve',
            data: Array(20).fill(1),
            borderColor: 'rgb(234, 179, 8)',
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return value + 'x';
                    }
                }
            }
        }
    }
});

// Load historical data and statistics
async function loadHistoricalData() {
    const data = await AviatorAPI.getHistoricalData();
    console.log('Historical data loaded:', data);
    // TODO: Implement historical data visualization
}

// Generate prediction data with API integration
async function generatePredictionData() {
    try {
        const liveData = await AviatorAPI.getLiveOdds();
        const base = parseFloat(liveData.currentMultiplier);
        return Array.from({length: 20}, (_, i) => {
            const noise = (Math.random() - 0.5) * 0.3;
            return Math.max(1, base + (i * 0.05) + noise);
        });
    } catch (error) {
        console.error('Prediction error:', error);
        return Array(20).fill(1);
    }
}

// Update live data with API integration
async function updateLiveData() {
    try {
        // Update prediction chart
        const newData = await generatePredictionData();
        predictionChart.data.datasets[0].data = newData;
        predictionChart.update();
        
        // Update odds display from API
        const liveData = await AviatorAPI.getLiveOdds();
        document.querySelector('.text-green-400').textContent = `${liveData.currentMultiplier}x`;
        document.querySelector('.text-amber-400').textContent = `${liveData.confidence}%`;
        
        // Update bankroll warning
        checkBankrollSafety();
    } catch (error) {
        console.error('Update error:', error);
    }
}

// Check if bet amount exceeds safe threshold
function checkBankrollSafety() {
    const betInput = document.querySelector('input[type="number"]');
    const betAmount = parseFloat(betInput.value) || 0;
    const bankroll = 1000;
    const percentage = (betAmount / bankroll * 100).toFixed(1);
    
    if (percentage > 5) {
        betInput.classList.add('border-red-500');
        betInput.classList.remove('border-gray-600');
        showWarningToast('Bet amount exceeds 5% of bankroll!');
    } else {
        betInput.classList.remove('border-red-500');
        betInput.classList.add('border-gray-600');
    }
}

// Show warning toast message
function showWarningToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize the application
loadHistoricalData();

// Update every 3 seconds
setInterval(updateLiveData, 3000);

// Initial update
updateLiveData();

// Bankroll management event listener
document.querySelector('input[type="number"]').addEventListener('input', checkBankrollSafety);