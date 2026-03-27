export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)
  const expected = process.env.ADMIN_PASSWORD ?? '%bellaterra%26'
  if (password !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password.' })
  }
  setCookie(event, 'bellaterra_admin', 'authenticated', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return { success: true }
})
