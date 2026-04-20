// Vercel Serverless Function: J-Quants API プロキシ
// エンドポイント: /api/jquants
//
// 使い方: ブラウザから下記のようにリクエスト
//   /api/jquants?path=/v1/prices/daily_quotes&date=20250120
//
// 環境変数 JQUANTS_API_KEY に J-Quants のAPIキーを設定してください。
// Vercel Dashboard → Settings → Environment Variables で追加。
// これによりキーがブラウザ側に露出しません。

export default async function handler(req, res) {
  // CORS ヘッダー（同一オリジンなら不要だが、開発時のため）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.JQUANTS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'JQUANTS_API_KEY environment variable not set',
      hint: 'Vercel Dashboard → Settings → Environment Variables で JQUANTS_API_KEY を追加してください'
    });
  }

  const { path, ...params } = req.query;
  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // パスが / で始まっていることを確認
  const cleanPath = path.startsWith('/') ? path : '/' + path;

  // 追加パラメータをクエリ文字列に
  const extraQs = new URLSearchParams(params).toString();
  const targetUrl = `https://api.jquants.com${cleanPath}${extraQs ? '?' + extraQs : ''}`;

  try {
    // まず Bearer 認証で試行（V1 方式、V2 キーでも通る場合あり）
    let response = await fetch(targetUrl, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    // 401 なら x-api-key ヘッダー方式で再試行（V2 方式）
    if (response.status === 401) {
      response = await fetch(targetUrl, {
        headers: { 'x-api-key': apiKey }
      });
    }

    const text = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', 'application/json');
    return res.send(text);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
