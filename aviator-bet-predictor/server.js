const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// API endpoint for historical data
app.get('/api/history', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/data/history.json'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Aviator Predictor available at http://localhost:${PORT}/index.html`);
});