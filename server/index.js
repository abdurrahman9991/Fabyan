// Basic Express backend for your Telegram Mini App

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// ⚠️ SECURITY: Paste your Telegram bot token here (keep this file secret!)
const TELEGRAM_BOT_TOKEN = '8208569657:AAGWVofqgpn1F2mH2sHKqwucZw4clT09aTA'; // <-- Replace with your bot token

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Example endpoint: Verify Telegram initData (for authentication)
const crypto = require('crypto');
function checkTelegramAuth(initData) {
    // Parse query string to object
    const params = {};
    initData.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[key] = decodeURIComponent(value);
    });
    const hash = params.hash;
    delete params.hash;

    // Sort and join params
    const dataCheckString = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('\n');

    // Create secret key
    const secret = crypto.createHmac('sha256', 'WebAppData').update(TELEGRAM_BOT_TOKEN).digest();
    // Calculate hash
    const calculatedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

    return calculatedHash === hash;
}

app.post('/api/verify', (req, res) => {
    const { initData } = req.body;
    if (!initData) return res.status(400).json({ ok: false, error: 'No initData' });

    const valid = checkTelegramAuth(initData);
    res.json({ ok: valid });
});

// Example endpoint: Handle withdraw request
app.post('/api/withdraw', (req, res) => {
    const { userId, method, number, amount } = req.body;
    // Here you would save the request to your database and process it
    // For demo, just return success
    res.json({ ok: true, message: 'Withdraw request received!' });
});

// Example endpoint: Get user data (mock)
app.get('/api/user/:id', (req, res) => {
    // Replace with real DB lookup
    res.json({
        id: req.params.id,
        balance: 120.5,
        completedTasks: 8
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});