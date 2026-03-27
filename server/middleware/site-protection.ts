// Cache to avoid a DB round-trip on every request
let _cache: { enabled: boolean; ts: number } | null = null
const CACHE_TTL = 30_000 // 30 seconds

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Always allow: static assets, nuxt internals, admin area, auth endpoints, access page
  if (
    path.startsWith('/_nuxt') ||
    path.startsWith('/uploads') ||
    path.startsWith('/favicon') ||
    path.startsWith('/__nuxt') ||
    path.startsWith('/admin') ||
    path.startsWith('/api/admin') ||
    path.startsWith('/api/auth/access') ||
    path === '/access'
  ) return

  // Refresh cache if stale
  const now = Date.now()
  if (!_cache || now - _cache.ts > CACHE_TTL) {
    try {
      const db = useDatabase()
      const row = await db.sql`SELECT value FROM site_settings WHERE key = 'protection_enabled' LIMIT 1`
      const enabled = row.rows?.[0]?.value === '1'
      _cache = { enabled, ts: now }
    } catch {
      // DB not ready yet (e.g. cold start) — allow through
      return
    }
  }

  if (!_cache.enabled) return

  // Check visitor access cookie
  const cookie = getCookie(event, 'bellaterra_visitor')
  if (cookie === 'granted') return

  // Block API calls cleanly
  if (path.startsWith('/api/')) {
    throw createError({ statusCode: 401, statusMessage: 'Site is password protected.' })
  }

  // Redirect to the access gate, preserving the original URL
  const redirectTo = `/access?redirect=${encodeURIComponent(path)}`
  await sendRedirect(event, redirectTo, 302)
})
