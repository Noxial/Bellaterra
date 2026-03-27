import { initSchema } from '../database/db'

export default defineNitroPlugin(async () => {
  try {
    await initSchema()
  } catch (err) {
    console.warn('[bellaterra] DB init skipped (SQLite unavailable in this environment):', err)
  }
})
