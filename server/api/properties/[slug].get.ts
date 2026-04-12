export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug is required.' })

  const db = useDatabase()

  const propResult = await db.sql`
    SELECT * FROM properties WHERE slug = ${slug} AND is_published = 1 LIMIT 1
  `
  const property = propResult.rows?.[0]
  if (!property) throw createError({ statusCode: 404, statusMessage: 'Property not found.' })

  const imagesResult = await db.sql`
    SELECT * FROM property_images WHERE property_id = ${property.id as number} ORDER BY sort_order ASC
  `

  return {
    ...property,
    amenities: property.amenities ? (() => { try { return JSON.parse(property.amenities as string) } catch { return [] } })() : [],
    house_rules: property.house_rules ? (() => { try { return JSON.parse(property.house_rules as string) } catch { return [] } })() : [],
    images: imagesResult.rows ?? [],
  }
})
