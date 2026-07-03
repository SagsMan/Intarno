export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body || {}

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'softwareclone100@gmail.com'
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456'

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const tokenPayload = {
      id: 1,
      email: ADMIN_EMAIL,
      name: 'Intarno Admin',
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url')

    return res.status(200).json({
      token,
      admin: {
        id: 1,
        email: ADMIN_EMAIL,
        name: 'Intarno Admin',
      },
    })
  }

  return res.status(401).json({ error: 'Invalid credentials' })
}
