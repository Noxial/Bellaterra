export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)

  if (!password) {
    throw createError({ statusCode: 400, message: 'Password is required.' })
  }

  // Check env var first (works on Vercel without DB)
  let correctPassword = process.env.SITE_PASSWORD

  if (!correctPassword) {
    try {
      const db = useDatabase()
      const row = await db.sql`SELECT value FROM site_settings WHERE key = 'site_password' LIMIT 1`
      correctPassword = row.rows?.[0]?.value as string | undefined
    } catch {
      // DB unavailable — fall through to default
    }
  }

  correctPassword ??= '%bellaterra%26'

  if (password !== correctPassword) {
    throw createError({ statusCode: 401, message: 'Incorrect access code.' })
  }

  setCookie(event, 'bellaterra_visitor', 'granted', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  return { success: true }
})
