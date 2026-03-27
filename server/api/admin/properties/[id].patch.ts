import { initSchema } from '../../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid property ID.' })
  }

  const existing = await db.sql`SELECT id FROM properties WHERE id = ${Number(id)}`
  if (!existing.rows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Property not found.' })
  }

  const b = await readBody(event)

  await db.sql`
    UPDATE properties SET
      name                 = ${b.name ?? null},
      property_type        = ${b.property_type ?? null},
      tagline              = ${b.tagline ?? null},
      short_description    = ${b.short_description ?? null},
      description          = ${b.description ?? null},
      bedrooms             = ${b.bedrooms ?? null},
      bathrooms            = ${b.bathrooms ?? null},
      sqm                  = ${b.sqm ?? null},
      max_guests           = ${b.max_guests ?? null},
      min_stay_days        = ${b.min_stay_days ?? null},
      price_per_month      = ${b.price_per_month ?? null},
      price_per_week       = ${b.price_per_week ?? null},
      currency             = ${b.currency ?? 'CAD'},
      location_city        = ${b.location_city ?? null},
      location_region      = ${b.location_region ?? null},
      location_country     = ${b.location_country ?? null},
      location_description = ${b.location_description ?? null},
      amenities            = ${b.amenities ? JSON.stringify(b.amenities) : null},
      house_rules          = ${b.house_rules ? JSON.stringify(b.house_rules) : null},
      is_published         = ${b.is_published ?? 1},
      featured             = ${b.featured ?? 0},
      updated_at           = CURRENT_TIMESTAMP
    WHERE id = ${Number(id)}
  `

  return { success: true }
})
