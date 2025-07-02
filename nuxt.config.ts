import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts', 
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Auto-imports configuration
  imports: {
    dirs: [
      'composables/**',
      'stores/**',
      'utils/**'
    ]
  },
  
  // Configuration PWA
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },
    manifest: {
      name: 'CivActu - Démocratie Participative',
      short_name: 'CivActu',
      description: 'Application citoyenne pour la démocratie participative',
      theme_color: '#3B82F6',
      background_color: '#FFFFFF',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: 'icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: 'icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: 'icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        },
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },
  
  // Configuration API
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001/api/v1',
      wsUrl: process.env.WS_URL || 'ws://localhost:3001',
      appName: 'CivActu',
      appVersion: '1.0.0',
      mapboxToken: process.env.MAPBOX_TOKEN,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY
    }
  },
  
  // CSS Framework
  css: ['~/assets/css/main.css'],
  
  // SSR Configuration
  ssr: true
})