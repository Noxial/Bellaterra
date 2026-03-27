import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },

  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt'],

  googleFonts: {
    families: {
      'Noto Sans': [300, 400, 600],
      'Cormorant Garamond': [300, 400, 600],
    },
    display: 'swap',
    preload: true,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Bellaterra — A space can become a memory.',
      meta: [
        {
          name: 'description',
          content:
            'Bellaterra creates, renovates, and manages beautifully designed properties for guests who believe that where you stay shapes how you feel.',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  nitro: {
    experimental: {
      database: true,
    },
    database: {
      default: {
        connector: 'sqlite',
        options: { name: 'db' },
      },
    },
  },
})
