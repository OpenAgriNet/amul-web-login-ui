import { Request, Response } from 'express';

async function fetchAnimalDetails(tagNo: string, token: string): Promise<{ tagNo: string; data?: any; error?: string }> {
  try {
    const response = await fetch(
      `https://api.amulpashudhan.com/configman/v1/PashuGPT/GetAnimalDetailsByTagNo?tagNo=${tagNo}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    const text = await response.text();
    if (!text) {
      return { tagNo, error: 'Empty response' };
    }
    return { tagNo, data: JSON.parse(text) };
  } catch (err) {
    return { tagNo, error: String(err) };
  }
}

async function fetchCvccDetails(tagNo: string, tokenNo: string, vendorNo: string): Promise<{ tagNo: string; data?: any; error?: string }> {
  try {
    const response = await fetch('https://api.amuldairy.com/ai_cattle_dtl.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token_no: tokenNo, vendor_no: vendorNo, tag_no: tagNo }),
    });
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Fix trailing comma issue
      const fixedText = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      data = JSON.parse(fixedText);
    }
    return { tagNo, data };
  } catch (err) {
    return { tagNo, error: String(err) };
  }
}

export async function pashugptCombinedHandler(req: Request, res: Response) {
  const mobileNumber = req.query.mobileNumber as string;
  const tagNo = req.query.tagNo as string;
  const tokenNo = req.query.tokenNo as string || process.env.PASHUGPT_TOKEN_2 || '';
  const vendorNo = req.query.vendorNo as string || '9999999';

  if (!mobileNumber && !tagNo) {
    return res.status(400).json({ error: 'At least mobileNumber or tagNo is required' });
  }

  const PASHUGPT_TOKEN = process.env.PASHUGPT_TOKEN;

  if (!PASHUGPT_TOKEN) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const results: {
    farmer?: any;
    animals?: any[];
    cvcc?: any[];
    errors?: string[];
  } = {};
  const errors: string[] = [];

  // First, fetch farmer data to get tag numbers
  if (mobileNumber) {
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
      results.farmer = await response.json();
    } catch (err) {
      errors.push(`Farmer API: ${String(err)}`);
    }
  }

  // Collect all tag numbers to fetch
  const allTagNumbers: Set<string> = new Set();

  // Add explicit tagNo if provided
  if (tagNo) {
    allTagNumbers.add(tagNo.trim());
  }

  // Extract tag numbers from farmer data
  if (Array.isArray(results.farmer)) {
    for (const farmer of results.farmer) {
      if (farmer.tagNo && typeof farmer.tagNo === 'string') {
        const tags = farmer.tagNo.split(',').map((t: string) => t.trim()).filter((t: string) => t);
        tags.forEach((t: string) => allTagNumbers.add(t));
      }
    }
  }

  // Fetch animal and CVCC details for all tag numbers in parallel
  if (allTagNumbers.size > 0) {
    const tagArray = Array.from(allTagNumbers);

    const [animalResults, cvccResults] = await Promise.all([
      Promise.all(tagArray.map((t) => fetchAnimalDetails(t, PASHUGPT_TOKEN))),
      Promise.all(tagArray.map((t) => fetchCvccDetails(t, tokenNo, vendorNo))),
    ]);

    results.animals = animalResults.filter((r) => r.data).map((r) => ({ tagNo: r.tagNo, ...r.data }));
    results.cvcc = cvccResults
      .filter((r) => r.data && r.data.msg === 'Success')
      .map((r) => ({ tagNo: r.tagNo, ...r.data }));

    // Collect errors
    animalResults.filter((r) => r.error).forEach((r) => errors.push(`Animal API (${r.tagNo}): ${r.error}`));
    cvccResults.filter((r) => r.error).forEach((r) => errors.push(`CVCC API (${r.tagNo}): ${r.error}`));
  }

  if (errors.length > 0) {
    results.errors = errors;
  }

  return res.status(200).json(results);
}
