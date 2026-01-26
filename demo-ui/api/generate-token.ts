import * as jose from 'jose';

// Type declaration for Edge Runtime environment
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Combined API data structure: { farmer, animals, cvcc, errors? }
    const combinedData = await request.json();

    // Get JWT private key from environment variable
    // @ts-ignore - process.env is available in Vercel Edge Runtime
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

    if (!JWT_PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error: JWT_PRIVATE_KEY not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract data from combined API response
    const { farmer, animals, cvcc } = combinedData;

    // Get primary farmer code for sub claim
    const primaryFarmerCode = Array.isArray(farmer) && farmer.length > 0
      ? farmer[0].farmerCode
      : 'unknown';

    // Build JWT payload with all PashuGPT data
    // The "data" field contains all farmer context for the LLM
    const payload = {
      sub: primaryFarmerCode,
      data: {
        // Farmer records from PashuGPT
        farmers: farmer || [],
        // Animal details for all tags associated with the farmer
        animals: animals || [],
        // CVCC data (if available)
        cvcc: cvcc || [],
      },
    };

    // Generate JWT token using jose library (Edge Runtime compatible)
    const privateKey = await jose.importPKCS8(JWT_PRIVATE_KEY.replace(/\\n/g, '\n'), 'RS256');

    // Sign the JWT with 24h expiration
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(privateKey);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
