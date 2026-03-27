import { initSchema } from '../database/db'

export default defineNitroPlugin(async () => {
  await initSchema()
})
