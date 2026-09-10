// Imports de fichiers CSS en texte brut (Vite `?raw`) : utilisés pour injecter à
// l'exécution des feuilles tierces que l'on ne veut pas faire passer par PostCSS.
declare module "*.css?raw" {
  const src: string
  export default src
}
