export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers['authorization'] || ''
  const token = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'))
    if (payload.exp < Date.now()) {
      return res.status(401).json({ error: 'Token expired' })
    }
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  return res.status(200).json({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 24,
    totalCustomers: 0,
    totalInquiries: 0,
    recentOrders: [],
    recentInquiries: [],
  })
}
