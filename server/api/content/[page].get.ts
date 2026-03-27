import { initSchema } from '../../database/db'

/**
 * Public content endpoint — no auth required.
 * Returns all page_content rows for a given page as a flat key→value map.
 * The key is `section::key` to keep it unambiguous.
 */
export default defineEventHandler(async (event) => {
  const page = getRouterParam(event, 'page')
  if (!page) throw createError({ statusCode: 400, statusMessage: 'Page is required.' })

  await initSchema()
  const db = useDatabase()

  const result = await db.sql`
    SELECT section, key, value, type FROM page_content WHERE page = ${page}
  `

  const map: Record<string, string> = {}
  for (const row of (result.rows ?? []) as { section: string; key: string; value: string; type: string }[]) {
    map[`${row.section}::${row.key}`] = row.value ?? ''
  }

  return map
})
