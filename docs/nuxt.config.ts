import { resolve } from "node:path";

export default defineNuxtConfig({
  extends: ["@baybreezy/docd"],
  // @dnax/ui : module Nuxt officiel (auto-import des composants Q* + styles/main.css)
  modules: ["@dnax/ui"],
  // Requis par le serveur MCP de Docd (useEvent hors requête)
  experimental: {
    asyncContext: true,
  },

  llms: {
    domain: process.env.NUXT_SITE_URL || "http://localhost:3000",
    title: process.env.NUXT_SITE_NAME || "DanxUI",
    description:
      "DanxUI — Design system Vue 3 : API Quasar, implémentation shadcn-vue.",
    full: {
      title: process.env.NUXT_SITE_NAME || "DanxUI Docs",
      description:
        "Documentation de DanxUI, le design system Vue 3 à double identité (API Quasar, implémentation shadcn-vue).",
    },
  },
});
