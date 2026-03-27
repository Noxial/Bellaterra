import { initSchema } from '../../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid inquiry ID.' })
  }

  const body = await readBody(event)
  const { status, admin_notes, internal_notes } = body
  const notes = internal_notes ?? admin_notes ?? undefined

  const validStatuses = ['pending', 'new', 'in_progress', 'completed', 'archived']
  if (status && !validStatuses.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid status value.' })
  }

  // Verify inquiry exists
  const existing = await db.sql`SELECT id FROM inquiries WHERE id = ${Number(id)}`
  if (!existing.rows?.length) {
    throw createError({ statusCode: 404, statusMessage: 'Inquiry not found.' })
  }

  if (status !== undefined && notes !== undefined) {
    await db.sql`
      UPDATE inquiries
      SET status = ${status}, internal_notes = ${notes ?? null}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number(id)}
    `
  } else if (status !== undefined) {
    await db.sql`
      UPDATE inquiries
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number(id)}
    `
  } else if (notes !== undefined) {
    await db.sql`
      UPDATE inquiries
      SET internal_notes = ${notes ?? null}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number(id)}
    `
  }

  return { success: true }
})
