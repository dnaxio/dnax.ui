// registerIcons — embarque les icônes du design system dans le bundle.
//
// Par défaut, `@iconify/vue` va chercher chaque icône **à la demande** sur
// `api.iconify.design`. En SSR cela ne rend que la coquille
// `<svg class="iconify iconify--lucide">` (les `<path>` arrivent après le fetch
// client) et, sans réseau, **aucune** icône n'apparaît. Enregistrer une collection
// locale (`addCollection`) supprime la requête pour toutes les icônes de
// `lib/iconSet.ts` (fichier généré par `scripts/gen-icon-set.ts`).
//
// - Appelé automatiquement par le module Nuxt `@dnax/ui` (option `icons`, défaut `true`).
// - À appeler soi-même quand le module n'est pas utilisé (Vite/Nuxt manuel).
// - Idempotent, et `addCollection` **fusionne** avec une collection déjà enregistrée
//   sous le même préfixe : plusieurs appels (design system + extras d'une app) sont
//   sans danger.
import { addCollection } from "@iconify/vue"
import { lucideIconSet } from "./iconSet"
import type { IconSetJson } from "./icons"

let registered = false

/** Enregistre les icônes du design system auprès d'Iconify (idempotent). */
export const registerIcons = (): void => {
  if (registered) return
  registered = true
  addCollection(lucideIconSet)
}

/** `true` si `registerIcons()` a déjà été appelé. */
export const iconsRegistered = (): boolean => registered

/**
 * Enregistre une collection Iconify **supplémentaire** (icônes propres à une app, à un
 * site de docs…). Fusionne avec la collection déjà chargée — même préfixe compris.
 */
export const registerIconSet = (set: IconSetJson): void => {
  addCollection(set)
}
