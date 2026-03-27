import { initSchema } from '../../../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const imageId = getRouterParam(event, 'imageId')

  if (!imageId || isNaN(Number(imageId))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid image ID.' })
  }

  const existing = await db.sql`SELECT id FROM property_images WHERE id = ${Number(imageId)}`
  if (!existing.rows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found.' })
  }

  await db.sql`DELETE FROM property_images WHERE id = ${Number(imageId)}`

  return { success: true }
})
