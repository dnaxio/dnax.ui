// Texte d'une valeur de cellule pour les surfaces **textuelles** du tableur :
// barre de formule (`fx`) et moteur de recherche (Find).
//
// Piège visé : `String(valeur)` sur un objet/tableau produit « [object Object] ». Les types
// à valeur structurée (`attachment`, et tout futur type objet) doivent donc passer par ici
// au lieu d'un `String()` sauvage.
import { attachmentsOf } from "./fileList"

/** Valeur affichable en texte : `null`/objet → `""`, tableau → éléments joints. */
const plain = (value: unknown): string => {
  if (value === null || value === undefined) return ""
  if (Array.isArray(value)) {
    return value
      .map((entry) => (entry === null || entry === undefined || typeof entry === "object" ? "" : String(entry)))
      .filter((text) => text !== "")
      .join(", ")
  }
  if (typeof value === "object") return ""
  return String(value)
}

/**
 * Contenu de la **barre de formule** pour une cellule.
 * `attachment` → `""` (la valeur est un tableau d'objets : rien de pertinent à éditer).
 */
export const fxTextFor = (value: unknown, type?: string): string => {
  if (type === "attachment") return ""
  return plain(value)
}

/**
 * Texte indexé par la **recherche** (Find & Replace).
 * `attachment` → les **noms de fichiers**, pour pouvoir chercher par nom.
 */
export const searchTextFor = (value: unknown, type?: string): string => {
  if (type === "attachment") {
    return attachmentsOf(value)
      .map((att) => att.name)
      .join(", ")
  }
  return plain(value)
}
