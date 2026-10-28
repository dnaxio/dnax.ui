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
 *
 * Les **littéraux de chaîne** sont laissés intacts (`"A1"` reste `"A1"`) et les
 * **identifiants** contenant des chiffres ne sont pas pris pour des références
 * (`LOG10(...)`, `price1`…).
 */
export const shiftFormulaRefs = (src: string, dr: number, dc: number): string =>
  splitFormulaSegments(src)
    .map((segment) => (segment.code ? shiftCodeRefs(segment.text, dr, dc) : segment.text))
    .join("")

/**
 * Requête de suggestion de **fonction** à la position du curseur.
 *
 * Ne suggère que si le curseur est en train de taper un identifiant de fonction :
 * hors littéral de chaîne, commençant un token (`=`, `(`, `,`, opérateur, espace…)
 * et **pas** au milieu d'une référence de cellule (`A` devant `1`). Retourne `""`
 * quand il n'y a rien à suggérer (ex. `=SUM(`).
 */
export function functionQueryAt(text: string, caret: number = text.length): string {
  if (!text.trim().startsWith("=")) return ""
  const end = Math.max(0, Math.min(caret, text.length))

  // Curseur dans une chaîne littérale → aucune suggestion
  let quote = ""
  for (let i = 0; i < end; i++) {
    const ch = text[i]!
    if (quote) {
      if (ch === quote) {
        if (text[i + 1] === quote) {
          i++
          continue
        }
        quote = ""
      }
      continue
    }
    if (ch === '"' || ch === "'") quote = ch
  }
  if (quote) return ""

  let start = end
  while (start > 0 && /[A-Za-z]/.test(text[start - 1]!)) start--
  if (start === end) return ""
  // « A » devant « 1 » : référence de cellule en cours de frappe, pas une fonction
  if (/[0-9]/.test(text[end] ?? "")) return ""
  // Doit commencer un token (évite `A1:B`, `$AB`, `sheet!SUM`…)
  const before = start > 0 ? text[start - 1]! : ""
  if (before && !/[=(,;\s+\-*/^%&<>]/.test(before)) return ""
  return text.slice(start, end).toLowerCase()
}

/** Pose d'une sous-séquence : les lettres de `query` apparaissent dans l'ordre. */
const isSubsequence = (query: string, name: string): boolean => {
  let i = 0
  for (const ch of name) {
    if (ch === query[i]) i++
    if (i === query.length) return true
  }
  return query.length === 0
}

/**
 * Classe des suggestions par pertinence :
 * égalité > préfixe > sous-chaîne > sous-séquence, puis nom le plus court,
 * puis ordre d'origine. `query` vide → aucun résultat.
 */
export function rankSuggestions<T extends { name: string }>(
  items: T[],
  query: string,
  limit = 8,
): T[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return items
    .map((item, index) => {
      const name = item.name.toLowerCase()
      const score = name === q
        ? 0
        : name.startsWith(q)
          ? 1
          : name.includes(q)
            ? 2
            : isSubsequence(q, name)
              ? 3
              : -1
      return { item, index, score, length: name.length }
    })
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => a.score - b.score || a.length - b.length || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.item)
}

/** Arguments d'une signature (`"range, criteria, [sum_range]"` → 3 entrées). */
export function signatureArgs(sig: string): string[] {
  return sig
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

export interface FunctionCallAtResult {
  /** Nom de la fonction (minuscules) */
  name: string
  /** Index de l'argument courant (0-based) */
  index: number
}

/**
 * Fonction (parmi `known`) dans les parenthèses de laquelle se trouve le curseur.
 * Gère l'imbrication, les littéraux et les virgules de chaque niveau.
 */
export function functionCallAt(
  text: string,
  caret: number,
  known: Iterable<string>,
): FunctionCallAtResult | null {
  const names = new Set([...known].map((name) => name.toLowerCase()))
  const end = Math.max(0, Math.min(caret, text.length))
  const stack: { name: string; index: number }[] = []
  let quote = ""
  for (let i = 0; i < end; i++) {
    const ch = text[i]!
    if (quote) {
      if (ch === quote) {
        if (text[i + 1] === quote) {
          i++
          continue
        }
        quote = ""
      }
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (ch === "(") {
      let j = i - 1
      while (j >= 0 && /[A-Za-z0-9_]/.test(text[j]!)) j--
      stack.push({ name: text.slice(j + 1, i).toLowerCase(), index: 0 })
      continue
    }
    if (ch === ")") {
      stack.pop()
      continue
    }
    if (ch === "," && stack.length) stack[stack.length - 1]!.index++
  }
  for (let k = stack.length - 1; k >= 0; k--) {
    const frame = stack[k]!
    if (names.has(frame.name)) return { name: frame.name, index: frame.index }
  }
  return null
}

/** Segments d'une formule : `code: false` = littéral de chaîne (guillemets simples/doubles). */
const splitFormulaSegments = (src: string): { code: boolean; text: string }[] => {
  const out: { code: boolean; text: string }[] = []
  let code = ""
  let i = 0
  while (i < src.length) {
    const ch = src[i]!
    if (ch !== '"' && ch !== "'") {
      code += ch
      i++
      continue
    }
    if (code) {
      out.push({ code: true, text: code })
      code = ""
    }
    let literal = ch
    i++
    while (i < src.length) {
      const c = src[i]!
      literal += c
      i++
      if (c !== ch) continue
      // Guillemet doublé = caractère littéral (cf. parseString du moteur)
      if (src[i] === ch) {
        literal += src[i]
        i++
        continue
      }
      break
    }
    out.push({ code: false, text: literal })
  }
  if (code) out.push({ code: true, text: code })
  return out
}

/** Décalage des références dans un segment de code (jamais dans une chaîne). */
const shiftCodeRefs = (code: string, dr: number, dc: number): string =>
  code.replace(
    /(\$?)([A-Za-z]{1,3})(\$?)(\d+)/g,
    (match: string, ca: string, letters: string, ra: string, digits: string, offset: number) => {
      // Borne gauche : la ref doit commencer un token (pas « LOG10 », « price1 »…)
      const before = offset > 0 ? code[offset - 1]! : ""
      if (before && /[A-Za-z0-9_.]/.test(before)) return match
      // Borne droite : pas de suite alphanumérique, pas un appel de fonction
      const after = code[offset + match.length] ?? ""
      if (after && /[A-Za-z0-9_(]/.test(after)) return match
      const col = colFromLetters(letters) + (ca === "$" ? 0 : dc)
      const row = Number(digits) - 1 + (ra === "$" ? 0 : dr)
      if (col < 0 || row < 0) return match
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

/** Heure du jour : `HH:MM` ou `HH:MM:SS` (toujours sur deux chiffres) */
export const TIME_OF_DAY = /^\d{2}:\d{2}(?::\d{2})?$/

/**
 * Décompose une **heure** saisie librement. Accepte `9`, `09:30`, `9:5`, `9h30`, `09:30:15`.
 *
 * - `null` → chaîne vide (cellule effacée) ;
 * - `undefined` → ce n'est pas une heure valide (`24:00`, `9:75`, `abc`…).
 *
 * Le parsing est volontairement **local** (pas de `Date`) : aucune conversion de fuseau ne
 * doit intervenir sur une heure de la journée.
 */
export function parseTimeOfDay(
  value: any,
): { hours: number; minutes: number; seconds: number } | null | undefined {
  if (value === null || value === undefined) return undefined
  const raw = String(value).trim()
  if (raw === "") return null
  const match = raw.match(/^(\d{1,2})(?:[:h](\d{1,2}))?(?::(\d{1,2}))?$/i)
  if (!match) return undefined
  const hours = Number(match[1])
  const minutes = match[2] === undefined ? 0 : Number(match[2])
  const seconds = match[3] === undefined ? 0 : Number(match[3])
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    !Number.isInteger(seconds) ||
    hours > 23 ||
    minutes > 59 ||
    seconds > 59
  ) {
    return undefined
  }
  return { hours, minutes, seconds }
}

const two = (n: number) => String(n).padStart(2, "0")

/**
 * Normalise une heure en `HH:MM` — les secondes ne sont conservées que si elles sont non
 * nulles (`HH:MM:SS`). `null` = vide, `undefined` = invalide (l'appelant garde l'ancienne
 * valeur, comme pour un nombre refusé).
 */
export function normalizeTime(value: any): string | null | undefined {
  const parsed = parseTimeOfDay(value)
  if (parsed === null || parsed === undefined) return parsed
  const base = `${two(parsed.hours)}:${two(parsed.minutes)}`
  return parsed.seconds ? `${base}:${two(parsed.seconds)}` : base
}

/** Secondes depuis minuit (séries d'auto-remplissage) — `undefined` si invalide */
export function timeToSeconds(value: any): number | undefined {
  const parsed = parseTimeOfDay(value)
  if (!parsed) return undefined
  return parsed.hours * 3600 + parsed.minutes * 60 + parsed.seconds
}

/** Secondes depuis minuit → `HH:MM` (`HH:MM:SS` si nécessaire), **modulo 24 h** */
export function secondsToTime(total: number): string {
  if (!Number.isFinite(total)) return "00:00"
  const day = 86400
  const normalized = ((Math.round(total) % day) + day) % day
  const hours = Math.floor(normalized / 3600)
  const minutes = Math.floor((normalized % 3600) / 60)
  const seconds = normalized % 60
  return seconds ? `${two(hours)}:${two(minutes)}:${two(seconds)}` : `${two(hours)}:${two(minutes)}`
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
