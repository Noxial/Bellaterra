import { initSchema } from '../../../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid property ID.' })
  }

  const { url, alt_text = '' } = await readBody(event)

  if (!url) {
    throw createError({ statusCode: 400, statusMessage: 'Image URL is required.' })
  }

  // Get current max sort_order
  const maxSort = await db.sql`
    SELECT MAX(sort_order) as max_order FROM property_images WHERE property_id = ${Number(id)}
  `
  const nextOrder = (maxSort.rows?.[0]?.max_order ?? 0) + 1

  await db.sql`
    INSERT INTO property_images (property_id, url, alt_text, sort_order)
    VALUES (${Number(id)}, ${url}, ${alt_text ?? ''}, ${nextOrder})
  `

  return { success: true }
})
