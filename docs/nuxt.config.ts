// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  css: ['@/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', "@dnax/ui", "@nuxtjs/tailwindcss"]
})
