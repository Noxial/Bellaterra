import { initSchema } from '../../database/db'

export default defineEventHandler(async (event) => {
  await initSchema()
  const db = useDatabase()
  const body = await readBody(event)

  // Validation
  const errors: Record<string, string> = {}
  if (!body.first_name?.trim()) errors.first_name = 'First name is required.'
  if (!body.last_name?.trim()) errors.last_name = 'Last name is required.'
  if (!body.email?.trim()) errors.email = 'Email is required.'
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.email = 'Please enter a valid email address.'
  if (!body.inquiry_type) errors.inquiry_type = 'Please select an inquiry type.'

  if (Object.keys(errors).length) {
    throw createError({ statusCode: 400, data: { errors }, message: 'Validation failed.' })
  }

  await db.sql`
    INSERT INTO inquiries (
      first_name, last_name, email, phone, company,
      inquiry_type, arrival_date, departure_date, date_flexibility,
      num_guests, bedrooms_needed, primary_use, budget_range,
      addons, experience_description, special_requirements,
      how_heard, preferred_contact, status
    ) VALUES (
      ${body.first_name.trim()},
      ${body.last_name.trim()},
      ${body.email.trim().toLowerCase()},
      ${body.phone ?? null},
      ${body.company ?? null},
      ${body.inquiry_type},
      ${body.arrival_date ?? null},
      ${body.departure_date ?? null},
      ${body.date_flexibility ?? null},
      ${body.num_guests ?? null},
      ${body.bedrooms_needed ?? null},
      ${body.primary_use ?? null},
      ${body.budget_range ?? null},
      ${Array.isArray(body.addons) ? JSON.stringify(body.addons) : null},
      ${body.experience_description ?? null},
      ${body.special_requirements ?? null},
      ${body.how_heard ?? null},
      ${body.preferred_contact ?? null},
      'new'
    )
  `

  setResponseStatus(event, 201)
  return { success: true, message: 'Your inquiry has been received. We will be in touch within 48 hours.' }
})
