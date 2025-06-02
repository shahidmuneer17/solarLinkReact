import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const handler: Handler = async (event) => {
  const address = event.queryStringParameters?.address;
  const apiKey = process.env.NEARMAP_API_KEY;

  if (!address || !apiKey) {
    return { statusCode: 400, body: 'Missing address or API key' };
  }

  try {
    const response = await fetch(`https://api.nearmap.com/roofai/v1/segment?address=${encodeURIComponent(address)}`, {
      headers: { Authorization: `ApiKey ${apiKey}` },
    });
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({
        roofShapes: data.sections || [],
        obstructions: data.obstructions || [],
      }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Nearmap fetch failed' }) };
  }
};

export { handler };
