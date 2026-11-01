// Auto-extension d'un textarea — calculs **purs** (aucun DOM).
//
// Le composant mesure (`getComputedStyle` + `scrollHeight`) puis délègue ici la
// décision de hauteur : plafond de `maxRows` lignes, défilement au-delà. Tester ces
// règles sans navigateur évite de dépendre d'une vraie mise en page.

/** Métriques d'un textarea, en px (résolues depuis les styles calculés). */
export interface TextareaMetrics {
  fontSize: number
  lineHeight: number
  paddingTop: number
  paddingBottom: number
}

/** Sous-ensemble de `CSSStyleDeclaration` utile (valeurs CSS en texte). */
export interface TextareaComputedStyle {
  fontSize?: string
  lineHeight?: string
  paddingTop?: string
  paddingBottom?: string
}

/** Ratio de repli quand `line-height: normal` n'expose aucune valeur exploitable. */
export const DEFAULT_LINE_HEIGHT_RATIO = 1.4

const toPx = (raw: string | undefined, fallback: number): number => {
  const n = Number.parseFloat(String(raw ?? ""))
  return Number.isFinite(n) && n > 0 ? n : fallback
}

/** Résout des styles calculés en métriques px (`normal` → `fontSize × 1.4`). */
export const textareaMetrics = (style: TextareaComputedStyle): TextareaMetrics => {
  const fontSize = toPx(style.fontSize, 14)
  const lineHeight = toPx(style.lineHeight, fontSize * DEFAULT_LINE_HEIGHT_RATIO)
  return {
    fontSize,
    lineHeight,
    paddingTop: toPx(style.paddingTop, 0),
    paddingBottom: toPx(style.paddingBottom, 0),
  }
}

/** Hauteur maximale (px) de `maxRows` lignes — `Infinity` si `maxRows <= 0`. */
export const textareaCap = (metrics: TextareaMetrics, maxRows: number): number =>
  maxRows > 0
    ? metrics.lineHeight * maxRows + metrics.paddingTop + metrics.paddingBottom
    : Number.POSITIVE_INFINITY

export interface TextareaSizing {
  /** Hauteur à appliquer, en px */
  height: number
  /** Débordement vertical à appliquer */
  overflowY: "auto" | "hidden"
  /** Le contenu dépasse le plafond `maxRows` : le champ défile */
  capped: boolean
}

/** Hauteur à appliquer pour un `scrollHeight` mesuré, plafonnée à `maxRows` lignes. */
export const textareaSizing = (
  metrics: TextareaMetrics,
  scrollHeight: number,
  maxRows = 0,
): TextareaSizing => {
  const full = Number.isFinite(scrollHeight) ? Math.max(scrollHeight, 0) : 0
  const cap = textareaCap(metrics, maxRows)
  const capped = full > cap
  return { height: Math.min(full, cap), overflowY: capped ? "auto" : "hidden", capped }
}
