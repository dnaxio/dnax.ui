// numericKeyboard — clavier numérique (pavé à l'écran) : disposition des touches et règles de
// saisie (chiffres, séparateur décimal, effacement, longueur maximale, zéros de tête).
//
// Pur (aucun DOM) → testable hors navigateur, comme `lib/pagePadding.ts`. La valeur manipulée
// est une **chaîne** : c'est ce qui conserve les zéros de tête d'un code (0406) et évite les
// arrondis flottants d'un montant.

/** Nature d'une touche — sert au style et à l'action */
export type KeypadKeyKind = "digit" | "separator" | "backspace" | "clear" | "empty"

export interface KeypadKey {
  /** Identifiant de la touche : `"0"`–`"9"`, `"separator"`, `"backspace"`, `"clear"`, `""` */
  key: string
  kind: KeypadKeyKind
  /** Texte affiché (le séparateur affiche celui de la locale) */
  label: string
  /** Libellé accessible quand la touche n'est pas un chiffre */
  ariaLabel?: string
}

export type KeypadMode = "numeric" | "decimal"

export interface KeypadOptions {
  /** `numeric` (défaut : code, téléphone) ou `decimal` (montants : touche séparateur) */
  mode?: KeypadMode
  /** Ajoute une touche « tout effacer » si une case est libre (`numeric`) */
  clearable?: boolean
  /** Séparateur décimal affiché — `,` par défaut (français), `.` en anglais */
  decimalSeparator?: string
}

/**
 * Les 12 touches du pavé (3 × 4). En mode `numeric` la case en bas à gauche est libre —
 * elle accueille la touche « C » quand `clearable` est demandé ; en mode `decimal` elle
 * porte le séparateur, il n'y a donc pas de place pour « C » (voir `clear()`).
 */
export function keypadLayout(options: KeypadOptions = {}): KeypadKey[] {
  const separator = (options.decimalSeparator ?? ",").slice(0, 1) || ","
  const mode = options.mode === "decimal" ? "decimal" : "numeric"

  const digit = (value: string): KeypadKey => ({ key: value, kind: "digit", label: value })

  return [
    digit("1"),
    digit("2"),
    digit("3"),
    digit("4"),
    digit("5"),
    digit("6"),
    digit("7"),
    digit("8"),
    digit("9"),
    mode === "decimal"
      ? { key: "separator", kind: "separator", label: separator, ariaLabel: `Séparateur décimal (${separator})` }
      : options.clearable
        ? { key: "clear", kind: "clear", label: "C", ariaLabel: "Tout effacer" }
        : { key: "", kind: "empty", label: "" },
    digit("0"),
    { key: "backspace", kind: "backspace", label: "⌫", ariaLabel: "Effacer le dernier chiffre" },
  ]
}

/** Les dix chiffres d'une disposition de pavé, dans l'ordre canonique */
export const keypadDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const

/**
 * Une permutation aléatoire de `0`-`9` (Fisher–Yates), pour un pavé à **disposition
 * aléatoire** (anti-observation : un code tapé sous les yeux d'un tiers).
 *
 * `rng` est injectable (tests, graine) ; par défaut `Math.random`. Le mélange porte sur les
 * chiffres **entre eux** : c'est `applyDigitOrder` qui les répartit ensuite dans les cellules,
 * en laissant les touches d'édition (séparateur, `C`, `⌫`) à leur place.
 */
export function shuffledDigits(rng: () => number = Math.random): string[] {
  const digits = [...keypadDigits]
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const swap = digits[i]!
    digits[i] = digits[j]!
    digits[j] = swap
  }
  return digits
}

/**
 * Répartit des chiffres (`order`, une permutation de `0`-`9`) dans les cellules « chiffre »
 * d'une disposition, les autres touches restant à leur place. Si `order` est plus courte que le
 * nombre de cellules, les cellules surnuméraires gardent leur chiffre d'origine.
 */
export function applyDigitOrder(keys: KeypadKey[], order: readonly string[]): KeypadKey[] {
  let index = 0
  return keys.map((key) => {
    if (key.kind !== "digit") return key
    const value = order[index++]
    return value ? { ...key, key: value, label: value } : key
  })
}

export interface KeypadPressOptions extends KeypadOptions {
  /** Longueur maximale, en **chiffres** (le séparateur ne compte pas) — 0 = illimité */
  maxLength?: number
  /** Nombre maximal de décimales après le séparateur — 0 = illimité */
  maxDecimals?: number
  /** Interdit un second séparateur (défaut) — `false` pour l'autoriser ? Jamais utile. */
  allowMultipleSeparators?: boolean
}

/** Nombre de chiffres d'une valeur de pavé (séparateur exclu) */
export const digitCount = (value: string): number => (value.match(/[0-9]/g) ?? []).length

/** Nombre de décimales saisies après le séparateur (`-1` s'il n'y en a pas) */
export const decimalCount = (value: string, separator = ","): number => {
  const index = value.indexOf(separator)
  return index === -1 ? -1 : digitCount(value.slice(index + 1))
}

/**
 * Applique une touche à une valeur et renvoie la nouvelle valeur.
 *
 * - `backspace` retire le dernier caractère, `clear` vide la valeur ;
 * - un chiffre au-delà de `maxLength` (en chiffres) est ignoré ;
 * - le séparateur s'insère au plus une fois, et « 0, » est posé si le champ est vide ;
 * - `maxDecimals` borne les décimales (les chiffres surnuméraires sont ignorés) ;
 * - en mode `decimal` (montants), un « 0 » seul est **remplacé** par le chiffre suivant
 *   (saisie façon calculatrice) ; en mode `numeric` (code, téléphone) il est **conservé**,
 *   pour ne pas perdre les zéros de tête.
 */
export function pressKey(
  value: string,
  key: string,
  options: KeypadPressOptions = {},
): string {
  const current = typeof value === "string" ? value : ""
  const separator = (options.decimalSeparator ?? ",").slice(0, 1) || ","
  const mode = options.mode === "decimal" ? "decimal" : "numeric"
  const maxDigits = typeof options.maxLength === "number" && options.maxLength > 0 ? options.maxLength : Infinity
  const maxDecimals =
    typeof options.maxDecimals === "number" && options.maxDecimals >= 0 ? options.maxDecimals : Infinity

  if (key === "backspace") return current.slice(0, -1)
  if (key === "clear") return ""

  if (key === "separator") {
    if (mode !== "decimal" || maxDecimals === 0) return current
    if (current.includes(separator)) return current
    if (!current) return `0${separator}`
    return current.endsWith(separator) ? current : `${current}${separator}`
  }

  if (!/^[0-9]$/.test(key)) return current

  // Décimales déjà complètes → le chiffre est ignoré
  const decimals = decimalCount(current, separator)
  if (decimals >= 0 && decimals >= maxDecimals) return current
  if (digitCount(current) >= maxDigits) return current

  // Calculatrice : « 0 » seul est remplacé (montants), sauf derrière le séparateur (« 0,5 »)
  if (mode === "decimal" && current === "0") return key

  return `${current}${key}`
}

/** Applique une suite de touches (utile aux tests et à une saisie programmée) */
export function pressKeys(value: string, keys: string[], options: KeypadPressOptions = {}): string {
  return keys.reduce((acc, key) => pressKey(acc, key, options), value)
}
