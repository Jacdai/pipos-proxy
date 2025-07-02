export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-api-key, anthropic-version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { provider } = req.query;

  try {
    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization,
        },
        body: JSON.stringify(req.body),
      });
      
      const data = await response.json();
      res.status(200).json(data);
      
    } else if (provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': req.headers['x-api-key'],
          'anthropic-version': req.headers['anthropic-version'],
        },
        body: JSON.stringify(req.body),
      });
      
      const data = await response.json();
      res.status(200).json(data);
    } else {
      res.status(400).json({ error: 'Invalid provider' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
