import { initSchema } from '../../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const { property_id = 1, start_date, end_date, reason = 'blocked', notes } = await readBody(event)

  if (!start_date || !end_date) {
    throw createError({ statusCode: 400, statusMessage: 'start_date and end_date are required.' })
  }
  if (start_date >= end_date) {
    throw createError({ statusCode: 400, statusMessage: 'end_date must be after start_date.' })
  }

  const validReasons = ['booked', 'blocked', 'maintenance']
  if (!validReasons.includes(reason)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reason.' })
  }

  await db.sql`
    INSERT INTO availability_blocks (property_id, start_date, end_date, reason, notes)
    VALUES (${property_id}, ${start_date}, ${end_date}, ${reason}, ${notes ?? null})
  `

  return { success: true }
})
