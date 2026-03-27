export default defineEventHandler((event) => {
  deleteCookie(event, 'bellaterra_visitor', { path: '/' })
  return { success: true }
})
