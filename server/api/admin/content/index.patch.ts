import { initSchema } from '../../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const { page, section, key, value, type = 'text' } = await readBody(event)

  if (!page || !section || !key) {
    throw createError({ statusCode: 400, statusMessage: 'page, section, and key are required.' })
  }

  // Check if row exists
  const existing = await db.sql`
    SELECT id FROM page_content WHERE page = ${page} AND section = ${section} AND key = ${key}
  `

  if (existing.rows?.length) {
    await db.sql`
      UPDATE page_content
      SET value = ${value ?? null}, type = ${type}, updated_at = CURRENT_TIMESTAMP
      WHERE page = ${page} AND section = ${section} AND key = ${key}
    `
  } else {
    await db.sql`
      INSERT INTO page_content (page, section, key, value, type, updated_at)
      VALUES (${page}, ${section}, ${key}, ${value ?? null}, ${type}, CURRENT_TIMESTAMP)
    `
  }

  return { success: true }
})
