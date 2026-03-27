import { initSchema } from '../../../database/db'

export default defineEventHandler(async () => {
  await initSchema()
  const db = useDatabase()
  const result = await db.sql`
    SELECT * FROM availability_blocks ORDER BY start_date ASC
  `
  return result.rows ?? []
})
