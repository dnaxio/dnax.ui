// qrcode — encodage QR et tracé SVG. Le moteur d'encodage est la dépendance `qrcode`
// (déjà présente, sans types — cf. `shims.d.ts`) : elle fournit la matrice de modules, ce
// module la traduit en **chemin SVG** (une suite de rectangles horizontaux, bien plus
// compact qu'un carré par module) — d'où un rendu net à toutes les tailles, thémable et
// rendable en SSR.
//
// Pur (aucun DOM) → testable hors navigateur, comme `lib/pagePadding.ts`.
import QRCode from "qrcode"

/** Niveau de correction d'erreur : L (~7 %) → H (~30 %) */
export type QrEcc = "L" | "M" | "Q" | "H"

/** Matrice de modules : `data[y * size + x]` vaut 1 pour un module sombre */
export interface QrMatrix {
  /** Côté de la matrice, en modules (21, 25, 29… : 4 × version + 17) */
  size: number
  /** Modules, ligne par ligne */
  data: ArrayLike<number>
}

export interface QrEncodeOptions {
  /** Correction d'erreur (défaut `"M"`) */
  ecc?: QrEcc
  /** Version forcée du QR (1 → 40). Par défaut la plus petite qui contient la donnée. */
  version?: number
}

/** Un module est-il sombre ? (`x`/`y` hors matrice → clair, jamais d'exception) */
export const isDark = (matrix: QrMatrix, x: number, y: number): boolean => {
  if (x < 0 || y < 0 || x >= matrix.size || y >= matrix.size) return false
  return matrix.data[y * matrix.size + x] === 1
}

/**
 * Encode une valeur en matrice QR. `undefined` quand la donnée ne tient pas (trop longue
 * pour la correction d'erreur demandée) : à l'appelant de décider quoi afficher.
 */
export function encodeQr(value: string, options: QrEncodeOptions = {}): QrMatrix | undefined {
  if (typeof value !== "string" || value === "") return undefined

  try {
    const settings: Record<string, unknown> = { errorCorrectionLevel: options.ecc ?? "M" }
    if (typeof options.version === "number") settings.version = options.version

    return QRCode.create(value, settings).modules
  } catch {
    return undefined
  }
}

/** Côté total de l'image (matrice + zone de silence), en modules */
export function qrTotalSize(matrix: QrMatrix, margin = 0): number {
  return matrix.size + 2 * Math.max(0, Math.floor(margin))
}

/**
 * Chemin SVG de la matrice : une sous-forme par **plage horizontale** de modules sombres
 * (`M x y h largeur v1 h-largeur z`). `margin` ajoute la zone de silence, en modules — le
 * QR doit garder un fond clair autour de lui pour être lisible par un lecteur.
 */
export function qrPath(matrix: QrMatrix, margin = 0): string {
  const offset = Math.max(0, Math.floor(margin))
  const parts: string[] = []

  for (let y = 0; y < matrix.size; y++) {
    let x = 0
    while (x < matrix.size) {
      if (!isDark(matrix, x, y)) {
        x++
        continue
      }

      let run = 1
      while (x + run < matrix.size && isDark(matrix, x + run, y)) run++

      const px = x + offset
      const py = y + offset
      parts.push(`M${px} ${py}h${run}v1h-${run}z`)
      x += run
    }
  }

  return parts.join("")
}

/** `viewBox` du rendu (matrice + zone de silence) */
export function qrViewBox(matrix: QrMatrix, margin = 0): string {
  const total = qrTotalSize(matrix, margin)
  return `0 0 ${total} ${total}`
}

/** Taille CSS : nombre → px, chaîne CSS telle quelle, sinon `160px`. */
export function qrSize(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return `${value}px`
  if (typeof value === "string" && value.trim() !== "") return value.trim()
  return "160px"
}

/** Échappe un texte destiné à un attribut d'un SVG **sérialisé** (chaîne, pas template). */
export const svgEscape = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

/** SVG complet (chaîne) — pour un téléchargement, un presse-papier ou un `<img src>`. */
export function qrSvg(
  matrix: QrMatrix,
  options: { margin?: number; color?: string; background?: string; label?: string } = {},
): string {
  const margin = options.margin ?? 0
  const total = qrTotalSize(matrix, margin)
  const color = options.color || "#000"
  const background = options.background || "#fff"
  const label = options.label ? ` aria-label="${svgEscape(options.label)}"` : ""

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${qrViewBox(matrix, margin)}" ` +
    `width="${total}" height="${total}" role="img"${label}>` +
    `<rect width="${total}" height="${total}" fill="${svgEscape(background)}"/>` +
    `<path d="${qrPath(matrix, margin)}" fill="${svgEscape(color)}" shape-rendering="crispEdges"/>` +
    `</svg>`
  )
}
