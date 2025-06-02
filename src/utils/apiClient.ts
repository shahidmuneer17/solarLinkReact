export const fetchRoofData = async (address: string) => {
  const response = await fetch(`/api/nearmap?address=${encodeURIComponent(address)}`);
  return response.json();
};

export const fetchSystemSize = async (address: string) => {
  const response = await fetch(`/api/genability?address=${encodeURIComponent(address)}`);
  return response.json();
};

export const fetchOpenAIPlacement = async (roofData: any, systemSize: number) => {
  const response = await fetch(`/api/openai-placement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roofData, systemSize }),
  });
  return response.json();
};
