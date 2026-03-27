import { initSchema } from '../../database/db'

export default defineEventHandler(async () => {
  await initSchema()
  const db = useDatabase()

  // Use gallery_images if any have been added; fall back to property_images
  const galleryResult = await db.sql`
    SELECT id, url, alt_text, category, sort_order FROM gallery_images ORDER BY sort_order ASC, id ASC
  `

  if (galleryResult.rows?.length) {
    return galleryResult.rows
  }

  const propResult = await db.sql`
    SELECT id, url, alt_text, category, sort_order FROM property_images ORDER BY sort_order ASC, id ASC
  `
  return propResult.rows ?? []
})
