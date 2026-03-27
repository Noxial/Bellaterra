export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  if (path.startsWith('/api/admin') && !path.includes('/auth/')) {
    const cookie = getCookie(event, 'bellaterra_admin')
    if (cookie !== 'authenticated') {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized.' })
    }
  }
})
