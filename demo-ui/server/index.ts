import express from 'express';
import cors from 'cors';
import { generateTokenHandler } from './handlers/generate-token';
import { pashugptFarmerHandler } from './handlers/pashugpt/farmer';
import { pashugptAnimalHandler } from './handlers/pashugpt/animal';
import { pashugptCombinedHandler } from './handlers/pashugpt/combined';
import { pashugptCvccHandler } from './handlers/pashugpt/cvcc';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'demo-ui-api' });
});

// API Routes - matching Vercel serverless function structure
app.post('/api/generate-token', generateTokenHandler);
app.get('/api/pashugpt/farmer', pashugptFarmerHandler);
app.get('/api/pashugpt/animal', pashugptAnimalHandler);
app.get('/api/pashugpt/combined', pashugptCombinedHandler);
app.post('/api/pashugpt/cvcc', pashugptCvccHandler);

// Proxy for Amul APIs - forwards requests to Amul API
app.use('/api/amul', async (req, res) => {
  try {
    const targetUrl = `https://farmer.amulamcs.com${req.path}`;
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-apiversion': req.headers['x-apiversion'] as string || '1.0.1',
      },
    };

    // Copy Authorization header if present
    if (req.headers.authorization) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': req.headers.authorization as string,
      };
    }

    // Add body for POST/PUT requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', message: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📝 Environment check:`);
  console.log(`   JWT_PRIVATE_KEY: ${process.env.JWT_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   PASHUGPT_TOKEN: ${process.env.PASHUGPT_TOKEN ? '✅ Set' : '❌ Missing'}`);
});
