import { initSchema } from '../../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const { status } = getQuery(event)

  const result = status && status !== 'all'
    ? await db.sql`SELECT * FROM inquiries WHERE status = ${status as string} ORDER BY created_at DESC LIMIT 500`
    : await db.sql`SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 500`

  return (result.rows ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    addons: row.addons
      ? (() => { try { return JSON.parse(row.addons as string) } catch { return [] } })()
      : [],
  }))
})
