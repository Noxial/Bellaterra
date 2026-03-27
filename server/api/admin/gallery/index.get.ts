import { initSchema } from '../../../database/db'

export default defineEventHandler(async () => {
  await initSchema()
  const db = useDatabase()
  const result = await db.sql`SELECT * FROM gallery_images ORDER BY sort_order ASC, id ASC`
  return result.rows ?? []
})
