// Imports de fichiers CSS en texte brut (Vite `?raw`) : utilisés pour injecter à
// l'exécution des feuilles tierces que l'on ne veut pas faire passer par PostCSS.
declare module "*.css?raw" {
  const src: string
  export default src
}

// Leaflet ne publie pas de types (ils vivent dans `@types/leaflet`, un paquet séparé) :
// le moteur `lib/mapLeaflet.ts` le manipule donc en `any`, comme le SDK MapTiler.
//
// ⚠️ Ce `default` est une commodité de **typage** : au runtime `leaflet` est un UMD, sans
// export ESM `default` garanti (selon la pré-bundlisation Vite). C'est pourquoi
// `lib/mapLeaflet.ts` importe en **dynamique** puis prend `leaflet.default ?? leaflet` —
// jamais un `import L from "leaflet"` statique (même piège que l'ancien `qrcode`, cf.
// `.memory/warnings.md`).
declare module "leaflet" {
  const leaflet: any
  export default leaflet
}
