import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST = join(__dirname, 'dist')
const PORT = parseInt(process.env.PORT || '3000')

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
}

async function handleContact(req, res) {
  const WEBHOOK_URL = process.env.WEBHOOK_URL
  const WEBHOOK_AUTH = process.env.WEBHOOK_AUTH

  if (!WEBHOOK_URL || !WEBHOOK_AUTH) {
    console.error('Missing WEBHOOK_URL or WEBHOOK_AUTH environment variables')
    res.writeHead(500, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Server configuration error' }))
  }

  let rawBody = ''
  for await (const chunk of req) rawBody += chunk
  let body
  try {
    body = JSON.parse(rawBody)
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Invalid JSON' }))
  }

  if (!body.nome || !body.email || !body.mensagem) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Missing required fields' }))
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Invalid email format' }))
  }

  try {
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
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: true }))
    } else {
      console.error('Webhook responded with:', response.status)
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Upstream error' }))
    }
  } catch (err) {
    console.error('Contact proxy error:', err)
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Internal server error' }))
  }
}

async function serveStatic(req, res) {
  const url = req.url.split('?')[0]
  let filePath = join(DIST, url === '/' ? 'index.html' : url)
  const ext = extname(filePath)

  try {
    const data = await readFile(filePath)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  } catch {
    // SPA fallback: serve index.html for any route
    try {
      const html = await readFile(join(DIST, 'index.html'))
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(html)
    } catch {
      res.writeHead(404)
      res.end('Not found')
    }
  }
}

const server = createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/contact') {
    return handleContact(req, res)
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    return serveStatic(req, res)
  }

  res.writeHead(405)
  res.end('Method not allowed')
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`HarpiaHub running on port ${PORT}`)
})
