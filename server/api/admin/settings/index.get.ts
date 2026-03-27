export default defineEventHandler(async () => {
  const db = useDatabase()
  const rows = await db.sql`SELECT key, value FROM site_settings`
  const settings: Record<string, string> = {}
  for (const row of rows.rows ?? []) {
    settings[row.key as string] = row.value as string
  }
  return settings
})
