bash

cat << 'EOF'
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.JQUANTS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'JQUANTS_API_KEY not set' });
  }

  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const cleanPath = path.startsWith('/') ? path : '/' + path;
  const qs = new URLSearchParams(params).toString();
  const targetUrl = `https://api.jquants.com${cleanPath}${qs ? '?' + qs : ''}`;

  // V2: x-api-key ヘッダーで認証
  let response = await fetch(targetUrl, {
    headers: { 'x-api-key': apiKey }
  });

  // 失敗したら Bearer 方式も試す（V1互換）
  if (response.status === 401 || response.status === 403) {
    response = await fetch(targetUrl, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
  }

  const text = await response.text();
  res.status(response.status);
  res.setHeader('Content-Type', 'application/json');
  return res.send(text);
}
EOF
出力

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.JQUANTS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'JQUANTS_API_KEY not set' });
  }

  const { path, ...params } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const cleanPath = path.startsWith('/') ? path : '/' + path;
  const qs = new URLSearchParams(params).toString();
  const targetUrl = `https://api.jquants.com${cleanPath}${qs ? '?' + qs : ''}`;

  // V2: x-api-key ヘッダーで認証
  let response = await fetch(targetUrl, {
    headers: { 'x-api-key': apiKey }
  });

  // 失敗したら Bearer 方式も試す（V1互換）
  if (response.status === 401 || response.status === 403) {
    response = await fetch(targetUrl, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
  }

  const text = await response.text();
  res.status(response.status);
  res.setHeader('Content-Type', 'application/json');
  return res.send(text);
}
