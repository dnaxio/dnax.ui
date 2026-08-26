/** Tokens de couleur du design system (définis en :root dans styles/main.css) */
export const TOKEN_COLORS = ["primary", "secondary", "accent", "dark", "positive", "negative", "info", "warning"] as const

export const isTokenColor = (c?: string): c is string =>
  !!c && (TOKEN_COLORS as readonly string[]).includes(c)

/** Token → var(--token), sinon valeur directe (hex, rgb(), nom CSS) */
export const colorValue = (c: string): string => (isTokenColor(c) ? `var(--${c})` : c)

/** Couleur de texte lisible (blanc ou sombre) pour un fond donné */
export const contrastText = (bg: string): string => {
  let hex = bg.trim().replace(/^#/, "")
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("")
  if (!/^[0-9a-f]{6}$/i.test(hex)) return "#ffffff"
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 150 ? "#1d1d1d" : "#ffffff"
}

/** Foreground associé : var(--token-foreground) pour un token, contraste calculé pour une couleur libre */
export const foregroundFor = (color: string): string =>
  isTokenColor(color) ? `var(--${color}-foreground)` : contrastText(color)
