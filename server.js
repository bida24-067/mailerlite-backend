const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Replace with your real MailerLite API key
const MAILERLITE_API_KEY = 'your-mailerlite-api-key';

app.use(bodyParser.json());

// CORS (allow frontend access)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Replace * with your domain in production
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Subscription endpoint
app.post('/subscribe', async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': MAILERLITE_API_KEY,
      },
      body: JSON.stringify({
        email,
        name,
        resubscribe: true
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: data });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('MailerLite error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
