import { Request, Response } from 'express';

export async function pashugptFarmerHandler(req: Request, res: Response) {
  const mobileNumber = req.query.mobileNumber as string;

  if (!mobileNumber) {
    return res.status(400).json({ error: 'mobileNumber is required' });
  }

  const PASHUGPT_TOKEN = process.env.PASHUGPT_TOKEN;

  if (!PASHUGPT_TOKEN) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch(
      `https://api.amulpashudhan.com/configman/v1/PashuGPT/GetFarmerDetailsByMobile?mobileNumber=${mobileNumber}`,
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
    return res.status(500).json({ error: 'Failed to fetch farmer data' });
  }
}
