import { initSchema } from '../../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) throw createError({ statusCode: 400, statusMessage: 'Invalid ID.' })

  const existing = await db.sql`SELECT id FROM gallery_images WHERE id = ${Number(id)}`
  if (!existing.rows?.length) throw createError({ statusCode: 404, statusMessage: 'Image not found.' })

  await db.sql`DELETE FROM gallery_images WHERE id = ${Number(id)}`
  return { success: true }
})
