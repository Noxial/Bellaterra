import { initSchema } from '../../database/db'

export default defineEventHandler(async (event) => {
  // Simple key check — admin pages use this with x-admin-key header
  const adminKey = getHeader(event, 'x-admin-key')
  const expectedKey = process.env.ADMIN_KEY ?? 'bellaterra-admin'
  if (adminKey !== expectedKey) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized.' })
  }

  await initSchema()
  const db = useDatabase()
  const { status } = getQuery(event)

  const result = (status && status !== 'all')
    ? await db.sql`SELECT * FROM inquiries WHERE status = ${status as string} ORDER BY created_at DESC LIMIT 200`
    : await db.sql`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 200`

  return (result.rows ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    addons: row.addons ? (() => { try { return JSON.parse(row.addons as string) } catch { return [] } })() : [],
  }))
})
