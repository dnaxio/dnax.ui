// Imports de fichiers CSS en texte brut (Vite `?raw`) : utilisés pour injecter à
// l'exécution des feuilles tierces que l'on ne veut pas faire passer par PostCSS.
declare module "*.css?raw" {
  const src: string
  export default src
}

// Leaflet ne publie pas de types (ils vivent dans `@types/leaflet`, un paquet séparé) :
// le moteur `lib/mapLeaflet.ts` le manipule donc en `any`, comme le SDK MapTiler.
declare module "leaflet" {
  const leaflet: any
  export default leaflet
}

// Même situation pour `qrcode` (=`@types/qrcode` séparé) : seul `create()` est utilisé
// (matrice de modules) — le rendu est fait par dnax.ui (`lib/qrcode.ts`).
declare module "qrcode" {
  const qrcode: {
    create: (
      text: string,
      options?: { errorCorrectionLevel?: "L" | "M" | "Q" | "H"; version?: number },
    ) => { modules: { size: number; data: ArrayLike<number> } }
  }
  export default qrcode
}
