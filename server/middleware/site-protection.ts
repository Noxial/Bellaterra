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

  // Authenticated admins can access everything without the visitor cookie
  const adminCookie = getCookie(event, 'bellaterra_admin')
  if (adminCookie === 'authenticated') return

  // Protection is ON by default — set SITE_PROTECTION_ENABLED=false to open the site
  const envOverride = process.env.SITE_PROTECTION_ENABLED
  const enabled = envOverride !== 'false' && envOverride !== '0'

  if (!enabled) return

  // Check visitor access cookie
  const cookie = getCookie(event, 'bellaterra_visitor')
  if (cookie === 'granted') return

  // Block API calls
  if (path.startsWith('/api/')) {
    throw createError({ statusCode: 401, statusMessage: 'Site is password protected.' })
  }

  // Redirect all other routes to the access gate
  await sendRedirect(event, `/access?redirect=${encodeURIComponent(path)}`, 302)
})
