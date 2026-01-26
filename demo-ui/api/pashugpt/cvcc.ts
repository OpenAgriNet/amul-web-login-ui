import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token_no, vendor_no, tag_no } = req.body;

  if (!token_no || !vendor_no || !tag_no) {
    return res.status(400).json({ error: 'token_no, vendor_no, and tag_no are required' });
  }

  try {
    const response = await fetch('https://api.amuldairy.com/ai_cattle_dtl.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token_no, vendor_no, tag_no }),
    });

    const text = await response.text();

    // The API returns malformed JSON with trailing comma, try to fix it
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Try to fix trailing comma issue
      const fixedText = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      data = JSON.parse(fixedText);
    }

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch CVCC data', message: String(err) });
  }
}
