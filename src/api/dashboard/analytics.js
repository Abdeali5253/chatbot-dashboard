export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.dashboardinfo.link');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  // ...your API logic...
}
