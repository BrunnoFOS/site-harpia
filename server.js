import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST = join(__dirname, 'dist')
const PORT = parseInt(process.env.PORT || '3000')
const MAX_BODY_SIZE = 8 * 1024 // 8 KB

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

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '0',
}

// Simple in-memory rate limiter per IP — 10 requests / 60 s
const rateMap = new Map()
const RATE_LIMIT = 10
const RATE_WINDOW = 60_000

function isRateLimited(ip) {
  const now = Date.now()
  let entry = rateMap.get(ip)
  if (!entry || now - entry.start > RATE_WINDOW) {
    entry = { start: now, count: 1 }
    rateMap.set(ip, entry)
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

// Periodically clean stale entries to avoid memory leak
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateMap) {
    if (now - entry.start > RATE_WINDOW) rateMap.delete(ip)
  }
}, RATE_WINDOW)

function setSecurityHeaders(res) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(k, v)
  }
}

async function handleContact(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress
  if (isRateLimited(ip)) {
    res.writeHead(429, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Too many requests' }))
  }

  const WEBHOOK_URL = process.env.WEBHOOK_URL
  const WEBHOOK_AUTH = process.env.WEBHOOK_AUTH

  if (!WEBHOOK_URL || !WEBHOOK_AUTH) {
    console.error('Missing WEBHOOK_URL or WEBHOOK_AUTH environment variables')
    res.writeHead(500, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ error: 'Server configuration error' }))
  }

  let rawBody = ''
  for await (const chunk of req) {
    rawBody += chunk
    if (rawBody.length > MAX_BODY_SIZE) {
      res.writeHead(413, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Payload too large' }))
    }
  }

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
        timestamp: new Date().toISOString(),
        origin: 'website',
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
  const decoded = decodeURIComponent(url)
  const filePath = normalize(join(DIST, decoded === '/' ? 'index.html' : decoded))

  // Block path traversal
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }

  const ext = extname(filePath)

  try {
    const data = await readFile(filePath)
    const cacheControl = ext === '.html'
      ? 'no-cache'
      : 'public, max-age=31536000, immutable'
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': cacheControl,
    })
    res.end(data)
  } catch {
    // SPA fallback: serve index.html for any route
    try {
      const html = await readFile(join(DIST, 'index.html'))
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' })
      res.end(html)
    } catch {
      res.writeHead(404)
      res.end('Not found')
    }
  }
}

const server = createServer(async (req, res) => {
  setSecurityHeaders(res)

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
