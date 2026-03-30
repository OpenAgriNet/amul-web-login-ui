import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// OAN backend URL — the demo-ui proxies token requests through here
const OAN_API_URL = process.env.OAN_API_URL || 'http://localhost:8000';
const DEMO_UI_API_KEY = process.env.DEMO_UI_API_KEY || '';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'demo-ui-api' });
});

// Proxy token-for-phone to OAN backend
app.post('/api/auth/token-for-phone', async (req, res) => {
  try {
    const response = await fetch(
      `${OAN_API_URL}/api/auth/token-for-phone?api_key=${encodeURIComponent(DEMO_UI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(502).json({ error: 'Failed to reach OAN backend', message: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Environment check:`);
  console.log(`  OAN_API_URL: ${OAN_API_URL}`);
  console.log(`  DEMO_UI_API_KEY: ${DEMO_UI_API_KEY ? 'Set' : 'Missing'}`);
});
