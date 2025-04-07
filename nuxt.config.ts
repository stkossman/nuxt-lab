// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Список Продуктів',
      htmlAttrs: {
        lang: 'uk',
      }
    }
  },

  compatibilityDate: '2025-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
        tailwindcss(),
    ],
  },
});