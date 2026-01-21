export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const mobileNumber = url.searchParams.get('mobileNumber');

  if (!mobileNumber) {
    return new Response(JSON.stringify({ error: 'mobileNumber is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const PASHUGPT_TOKEN = process.env.PASHUGPT_TOKEN;

  if (!PASHUGPT_TOKEN) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
