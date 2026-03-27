import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, extname } from 'node:path'

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided.' })
  }

  const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
  mkdirSync(uploadsDir, { recursive: true })

  const uploaded: string[] = []
  const errors: string[] = []

  for (const part of formData) {
    if (!part.filename || !part.data) continue

    const ext = extname(part.filename).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`${part.filename}: unsupported file type`)
      continue
    }

    if (part.data.length > MAX_FILE_SIZE) {
      errors.push(`${part.filename}: file too large (max 10MB)`)
      continue
    }

    const safeFilename = `${Date.now()}-${part.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    writeFileSync(resolve(uploadsDir, safeFilename), part.data)
    uploaded.push(`/uploads/${safeFilename}`)
  }

  if (!uploaded.length && errors.length) {
    throw createError({ statusCode: 400, statusMessage: errors.join('; ') })
  }

  return { success: true, files: uploaded, errors }
})
