export default defineEventHandler((event) => {
  deleteCookie(event, 'bellaterra_admin', { path: '/' })
  return { success: true }
})
