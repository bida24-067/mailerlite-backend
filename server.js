const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Replace with your real MailerLite API key
const MAILERLITE_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZmM1MjM0ZmY0NWY3MjVlNzNkOWJlNDM4YWIxYjBmYjA2ZGQyYzRhODEyZTUxZjhiOWRiZTI4MzBmOWFlMDJlNzI0YjU5MmQxM2Y4NWIyNDYiLCJpYXQiOjE3NTA0Njg5NzIuMTUxODQyLCJuYmYiOjE3NTA0Njg5NzIuMTUxODQ0LCJleHAiOjQ5MDYxNDI1NzIuMTQ3NzIxLCJzdWIiOiIxNjE5NTY2Iiwic2NvcGVzIjpbXX0.Yivx4fXLb0M_H_flJOLbeLmWfpmc6dyNlyPj95ilPYmAOZ0L3g6dpdglv6ct0oQ2PCAicqDroBTEH_02TcP_h6TrrHaY4m3tusFMQzexrEdVdg9F7rX0R_0WAZC4Xny1K6xHETQ8cAy7PEGmlhFk8eq4yUGBf7Uyad9-YnsTLxHbB6xuABHZtB_9abUhRL-ur4VAP4Ui8ZdVm-Ms89JVmN6L9Q9PfnhJl0UNkeK6vi9Q942q0vG6piMk2vHiKKimOXKm7Ghsk_Q7wHIHk29vYWRs-4S8xoLGgIgcXUuRpk37tp9C5Me2cDY1X71ltZ66M_rdLQowLcO9qigvPAAqmY_6mq4_m0wbahCePPt-cnWMeYJ8sWepx0LYiHPUIR7J_Jolh8ezJITJBl6UlZPzdJr1OovFgiIyLqlIxoeUvbP3lopjnj7baZKL0yl3ygfg1iIKQGTIFo-sruP3Yt9FvFwpkyuLhhxZRselhTo29O4XB-FMNncYDH0Zo-ls-k6i_NT7jhAQ9CC-Ci7NQWTl5oAC2Ym89dF5rS5jml6VbePa38c-gKcuMQlwa8Cw_1j2jnvKRcO-kdbFyd-P2NWrqGqdvg58ANPX--9h5ZiAYPOwqBpb2h9RUwMuRHujHd_bwYZ58pwagm2iUmy2p27bEb-oo6Ve_PvaylMz2gvGioQ';

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
