export default defineNuxtConfig({
  devServer: {
    port: 2009,
  },
  // Clé MapTiler des démos `<q-map>`. Clé de **navigateur**, publique par nature (elle
  // part dans chaque requête de tuiles, donc dans le bundle client) : à restreindre par
  // domaine dans la console MapTiler plutôt qu'à cacher. Une variable d'environnement
  // `NUXT_PUBLIC_MAPTILER_API_KEY` la surcharge.
  runtimeConfig: {
    public: {
      maptilerApiKey: "ScyscoQenj0f6qac3eD6",
    },
  },
  extends: ["@baybreezy/docd"],
  // @dnax/ui est un *module* Nuxt (pas une layer) : son entrée racine est le
  // barrel runtime (index.ts → *.vue), que Node ne peut pas importer.
  // L'ajouter à `extends` fait charger packages/ui/index.ts par Node →
  // « Unknown file extension ".vue" ».
  modules: ["@dnax/ui", "./scripts/dnax-ui-meta"],
  // Composants locaux (blocs API + démos MDC) : noms plats, sans préfixe de dossier.
  components: [{ path: "~/components", pathPrefix: false }],
  css: ["~/assets/css/main.css"],
  llms: {
    domain: process.env.NUXT_SITE_URL || "http://localhost:3000",
    title: process.env.NUXT_SITE_NAME || "My Docs",
    description: "A starter documentation site powered by Docd.",
    full: {
      title: process.env.NUXT_SITE_NAME || "My Docs",
      description: "A starter documentation site powered by Docd.",
    },
  },
});
