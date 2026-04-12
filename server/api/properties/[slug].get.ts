import { initSchema } from '../../database/db'

// Static fallback for when SQLite is unavailable (e.g. Vercel read-only filesystem)
const STATIC_PROPERTIES: Record<string, Record<string, unknown>> = {
  '303': {
    id: 1,
    slug: '303',
    name: '303',
    property_type: 'long_stay',
    tagline: 'A singular space. Yours for a season.',
    short_description: 'A meticulously restored residence designed for extended stays — private, architectural, and deeply considered.',
    description: 'Property 303 is an architectural retreat for those who choose to stay slowly. Stone floors, arched ceilings, and curated objects from three continents. Available for stays of 30 days and beyond.',
    bedrooms: 4,
    bathrooms: 3,
    sqm: 297,
    max_guests: 8,
    min_stay_days: 30,
    price_per_month: 18000,
    price_per_week: null,
    price_per_night: null,
    currency: 'CAD',
    location_city: 'Mont-Tremblant',
    location_region: 'Laurentides',
    location_country: 'Canada',
    location_description: 'Set within the Laurentians, 40 minutes north of Montréal. Private road access, surrounded by forest and a natural lake.',
    latitude: null,
    longitude: null,
    amenities: [],
    house_rules: [],
    is_published: 1,
    featured: 1,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    images: [],
  },
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug is required.' })

  try {
    await initSchema()
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
  } catch (err: any) {
    // If it's a real 404 (property not found), propagate it
    if (err?.statusCode === 404) throw err

    // SQLite unavailable (Vercel read-only filesystem) — serve static fallback
    const fallback = STATIC_PROPERTIES[slug]
    if (fallback) return fallback

    throw createError({ statusCode: 404, statusMessage: 'Property not found.' })
  }
})
