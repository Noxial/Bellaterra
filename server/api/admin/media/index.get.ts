import { readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(() => {
  const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
  try {
    const files = readdirSync(uploadsDir)
      .filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
      .map(filename => {
        const stat = statSync(resolve(uploadsDir, filename))
        return {
          filename,
          url: `/uploads/${filename}`,
          size: stat.size,
          createdAt: stat.birthtime,
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return files
  } catch {
    return []
  }
})
