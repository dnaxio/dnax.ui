// Helpers purs du tableur QSpreadsheet — extraits du composant pour être
// testables unitairement (bun test). Aucune dépendance DOM / Vue.

/** Index de colonne (0-based) → lettres Excel : 0 → "A", 25 → "Z", 26 → "AA" */
export const colLetter = (i: number): string => {
  let n = i
  let s = ""
  while (n >= 0) {
    s = String.fromCharCode(65 + (n % 26)) + s
    n = Math.floor(n / 26) - 1
  }
  return s
}

/** Lettres Excel → index de colonne 0-based : "A" → 0, "AA" → 26 */
export const colFromLetters = (s: string): number => {
  let n = 0
  for (const ch of s.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64)
  return n - 1
}

/** Cellule « vide » : null, undefined ou chaîne vide */
export const isBlankValue = (v: any): boolean =>
  v === null || v === undefined || v === ""

/**
 * Décale les références A1 non absolues d'une formule de (dr, dc) —
 * plages incluses, `$` préservés (copie / autofill).
 */
export const shiftFormulaRefs = (src: string, dr: number, dc: number): string =>
  src.replace(
    /(\$?)([A-Za-z]{1,3})(\$?)(\d+)/g,
    (_m: string, ca: string, L: string, ra: string, D: string) => {
      const col = colFromLetters(L) + (ca === "$" ? 0 : dc)
      const row = Number(D) - 1 + (ra === "$" ? 0 : dr)
      if (col < 0 || row < 0) return _m
      return ca + colLetter(col) + ra + (row + 1)
    },
  )

/** Date ISO AAAA-MM-JJ */
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Ajoute des jours à une date ISO (UTC, évite le décalage de fuseau) */
export const isoAddDays = (iso: string, days: number): string => {
  const d = new Date(iso + "T00:00:00Z")
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Échappe une valeur pour un CSV (quote si délimiteur / guillemet / newline) */
export const csvEscape = (s: unknown, delim: string): string => {
  const str = s === null || s === undefined ? "" : String(s)
  return str.includes(delim) || str.includes('"') || /[\n\r]/.test(str)
    ? '"' + str.replace(/"/g, '""') + '"'
    : str
}

/**
 * Décode une ligne CSV (guillemets doublés, délimiteur multi-caractère géré
 * comme un caractère unique ; retourne les cellules décodées).
 */
export const csvSplitLine = (line: string, delim = ","): string[] => {
  const out: string[] = []
  let cur = ""
  let inQ = false
  let i = 0
  const isDelim = (at: number) => line.startsWith(delim, at)
  while (i < line.length) {
    const ch = line[i]!
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i += 2
          continue
        }
        inQ = false
        i++
        continue
      }
      cur += ch
      i++
      continue
    }
    if (ch === '"') {
      inQ = true
      i++
      continue
    }
    if (isDelim(i)) {
      out.push(cur)
      cur = ""
      i += delim.length
      continue
    }
    cur += ch
    i++
  }
  out.push(cur)
  return out
}

/**
 * Parse un texte CSV complet (CRLF ou LF, guillemets) en lignes de cellules.
 */
export const parseCsv = (text: string, delim = ","): string[][] => {
  const lines: string[][] = []
  const current: string[] = []
  let cell = ""
  let inQ = false
  let sawDelim = false
  let i = 0
  const isDelim = (at: number) => text.startsWith(delim, at)
  const pushCell = () => {
    current.push(cell)
    cell = ""
  }
  while (i < text.length) {
    const ch = text[i]!
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i += 2
          continue
        }
        inQ = false
        i++
        continue
      }
      cell += ch
      i++
      continue
    }
    if (ch === '"') {
      inQ = true
      i++
      continue
    }
    if (isDelim(i)) {
      pushCell()
      sawDelim = true
      i += delim.length
      continue
    }
    if (ch === "\n") {
      pushCell()
      lines.push(current.splice(0))
      sawDelim = false
      i++
      continue
    }
    if (ch === "\r") {
      // les retours \r\n sont déjà gérés par le \n
      i++
      continue
    }
    cell += ch
    i++
  }
  pushCell()
  const onlyTrailingNewline = current.length === 1 && current[0] === "" && !sawDelim
  if (lines.length === 0 || !onlyTrailingNewline) lines.push(current)
  return lines
}

/** Colonnes déduites des clés d'un jeu de lignes (type texte) */
export const deriveCols = (
  rows: Record<string, any>[],
): { name: string; type: "text" }[] => {
  const keys = new Set<string>()
  for (const r of rows) Object.keys(r).forEach((k) => keys.add(k))
  return [...keys].map((k) => ({ name: k, type: "text" as const }))
}
