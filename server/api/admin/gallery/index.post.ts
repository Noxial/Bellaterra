import { initSchema } from '../../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const { url, alt_text = '', category = 'interior', sort_order = 0 } = await readBody(event)

  if (!url) throw createError({ statusCode: 400, statusMessage: 'url is required.' })

  const result = await db.sql`
    INSERT INTO gallery_images (url, alt_text, category, sort_order)
    VALUES (${url}, ${alt_text}, ${category}, ${sort_order})
  `
  return { success: true, id: result.lastInsertRowid }
})
