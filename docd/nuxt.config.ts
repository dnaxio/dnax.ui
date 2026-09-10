export default defineNuxtConfig({
  extends: ["@baybreezy/docd"],
  // Le module @dnax/ui auto-importe les composants Q* + les styles globaux ;
  // le module local génère les métadonnées d'API (#build/dnax-ui-meta.mjs).
  modules: ["@dnax/ui", "./scripts/dnax-ui-meta"],
  // Composants locaux (blocs API + démos MDC) : noms plats, sans préfixe de dossier.
  components: [{ path: "~/components", pathPrefix: false }],
  css: ["~/assets/css/main.css"],
  llms: {
    domain: process.env.NUXT_SITE_URL || "http://localhost:3000",
    title: process.env.NUXT_SITE_NAME || "Dnax UI",
    description:
      "Dnax UI — a Vue 3 design system with a Quasar-style public API, built with shadcn-vue techniques.",
    full: {
      title: process.env.NUXT_SITE_NAME || "Dnax UI",
      description:
        "Dnax UI — 100+ Vue 3 components with a Quasar-style API, plugins, directives and guides.",
    },
  },
  vite: {
    server: {
      allowedHosts: ["localhost", "127.0.0.1","ui.dnax.io"]
    }
  }
});
