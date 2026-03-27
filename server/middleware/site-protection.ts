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

  // Check env var first (fast path — no DB needed)
  const envEnabled = process.env.SITE_PROTECTION_ENABLED
  let enabled: boolean

  if (envEnabled !== undefined) {
    enabled = envEnabled === 'true' || envEnabled === '1'
  } else {
    // Fall back to DB (local dev only)
    try {
      const db = useDatabase()
      const row = await db.sql`SELECT value FROM site_settings WHERE key = 'protection_enabled' LIMIT 1`
      enabled = row.rows?.[0]?.value === '1'
    } catch {
      enabled = false
    }
  }

  if (!enabled) return

  // Check visitor access cookie
  const cookie = getCookie(event, 'bellaterra_visitor')
  if (cookie === 'granted') return

  // Block API calls cleanly
  if (path.startsWith('/api/')) {
    throw createError({ statusCode: 401, statusMessage: 'Site is password protected.' })
  }

  // Redirect to access gate, preserving the original URL
  await sendRedirect(event, `/access?redirect=${encodeURIComponent(path)}`, 302)
})
