/**
 * Serverless proxy for the contact form.
 * Keeps webhook URL and credentials out of the frontend bundle.
 *
 * Deploy on Vercel or Netlify as a serverless function.
 * Set environment variables:
 *   WEBHOOK_URL  — full n8n webhook URL
 *   WEBHOOK_AUTH — Basic auth header value (e.g. "Basic dXNlcjpwYXNz")
 */

// Vercel-style serverless handler
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const WEBHOOK_URL = process.env.WEBHOOK_URL
  const WEBHOOK_AUTH = process.env.WEBHOOK_AUTH

  if (!WEBHOOK_URL || !WEBHOOK_AUTH) {
    console.error('Missing WEBHOOK_URL or WEBHOOK_AUTH environment variables')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const body = req.body

    // Basic validation
    if (!body.nome || !body.email || !body.mensagem) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': WEBHOOK_AUTH,
      },
      body: JSON.stringify({
        nome: String(body.nome).slice(0, 200),
        email: String(body.email).slice(0, 200),
        empresa: String(body.empresa || '').slice(0, 200),
        interesse: String(body.interesse || '').slice(0, 100),
        mensagem: String(body.mensagem).slice(0, 2000),
        timestamp: body.timestamp || new Date().toISOString(),
        origin: body.origin || 'unknown',
      }),
    })

    if (response.ok) {
      return res.status(200).json({ success: true })
    } else {
      console.error('Webhook responded with:', response.status)
      return res.status(502).json({ error: 'Upstream error' })
    }
  } catch (error) {
    console.error('Contact proxy error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
