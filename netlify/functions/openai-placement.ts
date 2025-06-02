import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const handler: Handler = async (event) => {
  const { roofData, systemSize } = JSON.parse(event.body || '{}');
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!roofData || !systemSize || !openaiKey) {
    return { statusCode: 400, body: 'Missing required data or API key' };
  }

  try {
    const messages = [
      { role: 'system', content: 'You are a solar panel placement expert. Follow real-world install logic.' },
      {
        role: 'user',
        content: `Given this roof data: ${JSON.stringify(roofData)} and target system size: ${systemSize} kW, generate a JSON array of panel positions in clean rows, avoiding obstructions, prioritizing south/southwest/west roof faces.`,
      },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        temperature: 0.3,
      }),
    });

    const result = await response.json();
    const layout = JSON.parse(result.choices[0].message.content);

    return {
      statusCode: 200,
      body: JSON.stringify(layout),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI placement failed' }) };
  }
};

export { handler };
