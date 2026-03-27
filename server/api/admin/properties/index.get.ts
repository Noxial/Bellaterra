import { initSchema } from '../../../database/db'

export default defineEventHandler(async () => {
  await initSchema()
  const db = useDatabase()

  const propertiesResult = await db.sql`
    SELECT * FROM properties ORDER BY created_at ASC
  `
  const properties = propertiesResult.rows ?? []

  // Fetch images for each property
  const enriched = await Promise.all(
    properties.map(async (prop: any) => {
      const imagesResult = await db.sql`
        SELECT * FROM property_images WHERE property_id = ${prop.id} ORDER BY sort_order ASC
      `
      return { ...prop, images: imagesResult.rows ?? [] }
    })
  )

  return enriched
})
