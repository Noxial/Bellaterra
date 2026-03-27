export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    },
    mounted(el: HTMLElement, binding) {
      if (!import.meta.client) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const rect = el.getBoundingClientRect()
      // Skip elements already in the viewport on page load
      if (rect.top < window.innerHeight * 0.92) return

      const delay: number = binding.value?.delay ?? 0
      const type: string = binding.value?.type ?? 'up'

      const cls = type === 'scale' ? 'reveal-scale' : type === 'left' ? 'reveal-left' : 'reveal'
      el.classList.add(cls)
      if (delay) el.style.transitionDelay = `${delay}ms`

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // Clear delay after animation fires so it doesn't block future transitions
            setTimeout(() => {
              (entry.target as HTMLElement).style.transitionDelay = ''
            }, delay + 900)
            observer.disconnect()
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
      )
      observer.observe(el)
    },
  })
})
