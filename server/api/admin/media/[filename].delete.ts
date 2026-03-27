import { unlinkSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler((event) => {
  const filename = getRouterParam(event, 'filename')!

  // Security: prevent path traversal
  if (!filename || filename.includes('/') || filename.includes('..') || filename.includes('\\')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid filename.' })
  }

  const filePath = resolve(process.cwd(), 'public', 'uploads', filename)

  // Ensure resolved path is still within uploads dir
  const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
  if (!filePath.startsWith(uploadsDir)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid filename.' })
  }

  try {
    unlinkSync(filePath)
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'File not found.' })
  }

  return { success: true }
})
