export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, string>>(event)

  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, message: 'Invalid body.' })
  }

  const db = useDatabase()

  for (const [key, value] of Object.entries(body)) {
    // Only allow known setting keys
    if (!['protection_enabled', 'site_password'].includes(key)) continue
    await db.sql`
      INSERT INTO site_settings (key, value) VALUES (${key}, ${String(value)})
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `
  }

  return { success: true }
})
