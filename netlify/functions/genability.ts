import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const handler: Handler = async (event) => {
  const address = event.queryStringParameters?.address;
  const token = process.env.GENABILITY_TOKEN;

  if (!address || !token) {
    return { statusCode: 400, body: 'Missing address or token' };
  }

  try {
    const response = await fetch('https://api.genability.com/rest/v1/forecast', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ systemSizeKw: data?.forecast?.systemSizeKw || 6.5 }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Genability fetch failed' }) };
  }
};

export { handler };
