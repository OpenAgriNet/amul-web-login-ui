import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const tagNo = req.query.tagNo as string;

  if (!tagNo) {
    return res.status(400).json({ error: 'tagNo is required' });
  }

  const PASHUGPT_TOKEN = process.env.PASHUGPT_TOKEN;

  if (!PASHUGPT_TOKEN) {
    return res.status(500).json({ error: 'Server configuration error: PASHUGPT_TOKEN not set' });
  }

  try {
    const response = await fetch(
      `https://api.amulpashudhan.com/configman/v1/PashuGPT/GetAnimalDetailsByTagNo?tagNo=${tagNo}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${PASHUGPT_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Fetch failed', message: String(err) });
  }
}
