// currency — saisie et formatage d'un montant en devise : analyse de la frappe (chiffres,
// séparateurs, signe), formatage avec groupement et décimales locales, position du symbole
// (`Intl.NumberFormat.formatToParts`), bornes et arrondi.
//
// Pur (aucun DOM) → testable hors navigateur, comme `lib/layout.ts` ou `lib/pagePadding.ts`.
// La saisie est conservée sous forme de **brouillon canonique** (`AmountDraft`) : signe,
// chiffres entiers, chiffres décimaux — indépendant de la locale, ce qui rend le parsing,
// l'émission et la restitution du curseur triviaux.

/** Ce qui peut partir dans un champ montant : vide, signe, chiffres, séparateurs. */
export interface AmountDraft {
  /** Montant négatif (signe « - » tapé) */
  negative: boolean
  /** Chiffres de la partie entière ("" si la saisie commence par le séparateur) */
  integer: string
  /** Chiffres de la partie décimale */
  fraction: string
  /** Un séparateur décimal a été tapé (pour conserver « 12, » à l'écran) */
  hasSeparator: boolean
}

export interface CurrencyOptions {
  /** Locale BCP-47 (ex. `"fr-FR"`) — sert au groupement, au séparateur et au symbole */
  locale?: string
  /** Code ISO 4217 (ex. `"EUR"`) — absent : montant « nu », sans devise */
  currency?: string
  /** Décimales forcées (défaut : celles de la devise, ex. 2 pour EUR, 0 pour JPY) */
  decimals?: number
  /** Le champ accepte un montant négatif */
  allowNegative?: boolean
  /** Affichage de la devise : symbole (défaut), code ISO ou nom localisé */
  currencyDisplay?: "symbol" | "code" | "name"
  /** Borne basse (appliquée au relâchement, pas pendant la frappe) */
  min?: number
  /** Borne haute (idem) */
  max?: number
}

/** Locale par défaut du design system (langue de QConfigProvider : "en" | "fr"). */
export function localeOf(lang?: string): string {
  if (!lang) return "en-US"
  if (lang === "fr") return "fr-FR"
  if (lang === "en") return "en-US"
  return lang.includes("-") ? lang : lang
}

/** Séparateurs (décimal et de groupement) et nombre de décimales d'une devise. */
export interface CurrencyFormat {
  /** Locale effectivement utilisée */
  locale: string
  /** Code ISO, ou "" pour un montant nu */
  currency: string
  /** Décimales retenues */
  decimals: number
  /** Séparateur décimal de la locale ("." ou ",") */
  decimal: string
  /** Espace (ou espace insécable) de groupement — "" si la locale n'en met pas */
  group: string
  /** Texte de la devise ("€", "EUR", "euro"…), "" si `currency` est absent */
  symbol: string
  /** La devise se place-t-elle avant (en-US) ou après (fr-FR) le montant ? */
  position: "before" | "after"
  /** Une espace sépare-t-elle la devise du montant ? ("12,50 €" oui, "$12.50" non) */
  spaced: boolean
}

/** Bornes numériques d'une devise via `Intl` (JPY → 0, EUR → 2…) */
const currencyDecimals = (locale: string, currency: string): number => {
  try {
    const resolved = new Intl.NumberFormat(locale, { style: "currency", currency }).resolvedOptions()
    return resolved.maximumFractionDigits ?? 2
  } catch {
    return 2
  }
}

/**
 * Réglages de formatage d'un champ montant : séparateurs et devise de la locale, décimale
 * retenue et place du symbole. `formatToParts` donne la position **réelle** du symbole
 * ("1 234,56 €" en français, "$1,234.56" en anglais) — inutile de la coder en dur.
 */
export function currencyFormat(options: CurrencyOptions = {}): CurrencyFormat {
  const locale = options.locale || localeOf()
  const currency = (options.currency || "").trim().toUpperCase()
  const display = options.currencyDisplay ?? "symbol"

  const decimals =
    typeof options.decimals === "number" && options.decimals >= 0
      ? Math.floor(options.decimals)
      : currency
        ? currencyDecimals(locale, currency)
        : 2

  let decimal = "."
  let group = ","
  let symbol = ""
  let position: "before" | "after" = "after"
  let spaced = true

  try {
    const bare = new Intl.NumberFormat(locale)
    bare.formatToParts(1234.5).forEach((part) => {
      if (part.type === "decimal") decimal = part.value
      if (part.type === "group") group = part.value
    })

    if (currency) {
      const parts = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        currencyDisplay: display,
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }).formatToParts(1234.5)
      const index = parts.findIndex((part) => part.type === "currency")
      symbol = parts[index]?.value ?? currency
      position = index <= 1 ? "before" : "after"
      const neighbour = parts[position === "before" ? index + 1 : index - 1]
      spaced = !neighbour || neighbour.type === "literal" ? /\s|\u00a0/.test(neighbour?.value ?? "") : false
    }
  } catch {
    /* locale ou devise inconnue : on garde les valeurs par défaut */
  }

  return { locale, currency, decimals, decimal, group, symbol, position, spaced }
}

/** Ajoute les séparateurs de groupes au chiffre (via `Intl`, sans décimales ni devise). */
function groupDigits(integer: string, format: CurrencyFormat): string {
  if (!integer) return ""
  const asNumber = Number(integer)
  if (!Number.isFinite(asNumber)) return integer
  try {
    return new Intl.NumberFormat(format.locale, { maximumFractionDigits: 0 }).format(asNumber)
  } catch {
    return integer
  }
}

/**
 * Analyse une frappe en brouillon : chiffres, un séparateur décimal et (si autorisé) un
 * signe. Le séparateur décimal est celui de la locale ; l'autre caractère (« . » ou « , »)
 * est accepté **quand c'est le dernier séparateur et qu'il est suivi d'au plus `decimals`
 * chiffres** — coller `"$1,234.56"` en en-US comme `"1.234,56 €"` en fr-FR donne donc le
 * bon montant, et un « . » isolé en fr-FR reste une décimale (← tolérance d'usage).
 */
export function parseAmount(text: string, options: CurrencyOptions = {}): AmountDraft {
  const format = currencyFormat(options)
  const source = String(text ?? "")

  // Emplacement du séparateur décimal : celui de la locale, sinon l'autre caractère
  // uniquement s'il est le dernier séparateur et suivi d'assez peu de chiffres.
  const other = format.decimal === "." ? "," : "."
  let separatorIndex = -1
  const localeIndex = source.lastIndexOf(format.decimal)
  const otherIndex = source.lastIndexOf(other)
  if (localeIndex >= 0) separatorIndex = localeIndex
  if (localeIndex < 0 && otherIndex >= 0 && format.decimals > 0) {
    const tail = source.slice(otherIndex + 1).replace(/[^0-9]/g, "")
    if (!source.slice(otherIndex + 1).includes(format.decimal) && tail.length <= format.decimals) {
      separatorIndex = otherIndex
    }
  }

  let negative = false
  let integer = ""
  let fraction = ""
  const hasSeparator = separatorIndex >= 0

  for (let i = 0; i < source.length; i++) {
    const char = source[i]!

    if (char === "-" || char === "\u2212") {
      // Un signe ne compte que sur une partie entière vide (les suivants sont ignorés)
      if (options.allowNegative && !integer && !fraction) negative = !negative
      continue
    }

    if (!/[0-9]/.test(char)) continue // séparateurs de groupe, devise, espaces… ignorés

    if (i > separatorIndex && hasSeparator) {
      if (fraction.length < format.decimals) fraction += char
    } else if (integer.length < 15) {
      integer += char
    }
  }

  return { negative: negative && options.allowNegative === true, integer, fraction, hasSeparator }
}

/** Montant d'un brouillon : `null` quand rien n'est saisi (`""`, `"-"`, `","`). */
export function draftValue(draft: AmountDraft): number | null {
  if (!draft.integer && !draft.fraction) return null
  const value = Number(`${draft.integer || "0"}.${draft.fraction || "0"}`)
  if (!Number.isFinite(value)) return null
  return draft.negative ? -value : value
}

/**
 * Arrondit au nombre de décimales de la devise (1,005 € → 1,01 €). Passer par la notation
 * exponentielle évite l'erreur binaire de `value * 10**n` : `Number("1.005e2")` vaut
 * exactement 100,5, donc l'arrondi est correct là où `Math.round(1.005 * 100)` donne 100.
 */
export function roundTo(value: number, decimals: number): number {
  const places = Math.max(0, Math.floor(decimals))
  if (!Number.isFinite(value)) return value
  const shifted = Number(`${value}e${places}`)
  if (!Number.isFinite(shifted)) return value
  return Number(`${Math.round(shifted)}e-${places}`)
}

/** Applique l'arrondi de la devise puis les bornes `min` / `max` (relâchement du champ). */
export function applyLimits(
  value: number | null,
  options: CurrencyOptions = {},
): number | null {
  if (value === null) return null
  const format = currencyFormat(options)
  let next = roundTo(value, format.decimals)
  if (typeof options.min === "number" && next < options.min) next = options.min
  if (typeof options.max === "number" && next > options.max) next = options.max
  return roundTo(next, format.decimals)
}

/**
 * Affichage d'une frappe : groupement de la partie entière, séparateur local, décimales
 * frappées — le séparateur final est conservé (« 12, » reste « 12, »). Le signe n'apparaît
 * que sur un montant non vide (« - » seul n'affiche rien d'utile, on le garde quand même).
 */
export function formatDraft(draft: AmountDraft, options: CurrencyOptions = {}): string {
  const format = currencyFormat(options)
  const grouped = groupDigits(draft.integer, format)
  const sign = draft.negative ? "-" : ""
  if (!draft.hasSeparator) return `${sign}${grouped}`
  return `${sign}${grouped}${format.decimal}${draft.fraction}`
}

/** Affichage d'un montant (état non focalisé) : décimales toujours complètes. */
export function formatAmount(value: number | null, options: CurrencyOptions = {}): string {
  if (value === null || !Number.isFinite(value)) return ""
  return formatDraft(draftFromValue(value, options), options)
}

/**
 * Brouillon correspondant à un montant : c'est ce qu'un champ affiche quand il prend la
 * main (au montage, à la sortie du champ, ou quand le modèle change de l'extérieur).
 * Décimales complétées et arrondies selon la devise.
 */
export function draftFromValue(value: number | null, options: CurrencyOptions = {}): AmountDraft {
  if (value === null || !Number.isFinite(value)) {
    return { negative: false, integer: "", fraction: "", hasSeparator: false }
  }

  const format = currencyFormat(options)
  const [integer = "0", fraction = ""] = roundTo(Math.abs(value), format.decimals)
    .toFixed(format.decimals)
    .split(".")

  return {
    negative: value < 0,
    integer,
    fraction: format.decimals > 0 ? (fraction || "").padEnd(format.decimals, "0") : "",
    hasSeparator: format.decimals > 0,
  }
}

/** Nombre de chiffres contenus dans `text` avant l'index `caret`. */
export function digitCountBefore(text: string, caret: number): number {
  let count = 0
  for (let i = 0; i < Math.min(caret, text.length); i++) if (/[0-9]/.test(text[i]!)) count++
  return count
}

/**
 * Index du curseur dans `text` placé après `digits` chiffres — la façon de ne pas perdre
 * l'utilisateur quand on reformate la valeur à chaque frappe.
 */
export function caretForDigitCount(text: string, digits: number): number {
  if (digits <= 0) return 0
  let count = 0
  for (let i = 0; i < text.length; i++) {
    if (/[0-9]/.test(text[i]!)) {
      count++
      if (count === digits) return i + 1
    }
  }
  return text.length
}

/** Montant enrichi d'un pas (`step`, ×10 avec `coarse`) puis borné. */
export function stepValue(
  value: number | null,
  step: number,
  direction: 1 | -1,
  coarse = false,
  options: CurrencyOptions = {},
): number | null {
  const increment = (Number.isFinite(step) && step > 0 ? step : 1) * (coarse ? 10 : 1)
  const base = value ?? 0
  return applyLimits(roundTo(base + direction * increment, currencyFormat(options).decimals), options)
}
