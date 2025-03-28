// API service for fetching prediction data
class AviatorAPI {
    constructor() {
        this.baseUrl = '/data';
    }

    async getHistoricalData() {
        try {
            const response = await fetch(`${this.baseUrl}/history.json`);
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch historical data:', error);
            return {
                historicalData: [],
                statistics: {
                    winRate: 0,
                    avgWinMultiplier: 0,
                    avgLossMultiplier: 0,
                    bestStreak: 0
                }
            };
        }
    }

    async getLiveOdds() {
        // Simulate API call with random data
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    currentMultiplier: (Math.random() * 3 + 1).toFixed(2),
                    confidence: Math.floor(Math.random() * 20) + 80,
                    timestamp: new Date().toISOString()
                });
            }, 500);
        });
    }

    async getResponsibleTips() {
        return [
            "Never bet more than 5% of your bankroll in a single round",
            "Set loss limits before you start playing",
            "Take regular breaks every 30 minutes",
            "Don't chase losses - accept them as part of the game",
            "Only play with money you can afford to lose"
        ];
    }
}

export default new AviatorAPI();