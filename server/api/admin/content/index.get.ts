import { initSchema } from '../../../database/db'

export default defineEventHandler(async () => {
  await initSchema()
  const db = useDatabase()
  const result = await db.sql`SELECT * FROM page_content ORDER BY page, section, key`
  return result.rows ?? []
})
