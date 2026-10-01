// Validation de colonne de QSpreadsheet (`<q-spreadsheet>`).
//
// Vit dans `lib/` — et non dans le SFC — pour être **testable sans navigateur** : c'est
// exactement le code du composant, seul l'accès à ArkType est **injecté** (`ArkCheck`).
//
// Deux écritures possibles pour une colonne (ou une plage) :
//
//   { name: "score",    validation: { min: 0, max: 100, integer: true } }   // objet
//   { name: "priority", validation: "number < 4" }                         // expression ArkType
//
// Une **chaîne** est une expression ArkType : c'est le raccourci de `{ schema: "…" }`.
// Les deux formes se combinent (`{ required: true, schema: "number < 4" }`) et `message`
// surcharge le message de la règle qui échoue.

/** Règles de validation d'une colonne (ou d'une plage de cellules). */
export interface QSpreadsheetValidation {
  /** Valeur minimale (types numériques / entiers) */
  min?: number
  /** Valeur maximale (types numériques / entiers) */
  max?: number
  /** Exige un entier (si présent, valide les entiers) */
  integer?: boolean
  /** Expression régulière validée contre le texte */
  pattern?: string
  /** Champ obligatoire (vide refusé) */
  required?: boolean
  /** Valeurs autorisées (liste) */
  list?: any[]
  /** Message d'erreur affiché (sinon message générique) */
  message?: string
  /**
   * Expression **ArkType** — ex. `"number < 4"`,
   * `"number.integer & number >= 0 & number <= 100"`, `"string.email"`.
   * Équivalent d'une règle écrite directement en chaîne.
   */
  schema?: string
}

/**
 * Règle de validation : objet `{ min, max, … }` **ou** expression ArkType écrite
 * directement (`validation: "number < 4"`).
 */
export type QSpreadsheetValidationRule = QSpreadsheetValidation | string

/**
 * Vérification d'un schéma ArkType, **injectée** par le composant (import dynamique +
 * mémoïsation + `try/catch`) : renvoie un message d'erreur, ou `null` si la valeur passe.
 */
export type ArkCheck = (schema: string, value: unknown) => Promise<string | null>

/** Normalise une règle : une chaîne devient un schéma ArkType (`{ schema }`). */
export const normalizeValidation = (
  rule: QSpreadsheetValidationRule | undefined,
): QSpreadsheetValidation | undefined => (typeof rule === "string" ? { schema: rule } : rule)

/**
 * Valide une valeur contre une règle. Renvoie le message d'erreur, ou `null`.
 *
 * Ordre : `required` → vide toléré → `list` → `integer` → `min` / `max` → `pattern` →
 * `schema` (ArkType). Une valeur **vide** passe toutes les règles sauf `required`.
 * En `multiselect` (valeur = tableau), `list` s'applique **à chaque valeur** et un tableau
 * vide compte comme vide, donc `required` le refuse.
 */
export async function checkValidation(
  rule: QSpreadsheetValidationRule | undefined,
  value: any,
  arkCheck: ArkCheck,
): Promise<string | null> {
  const v = normalizeValidation(rule)
  if (!v) return null

  const multi = Array.isArray(value)
  const blank =
    value === null || value === undefined || value === "" || (multi && value.length === 0)
  if (v.required && blank) return v.message ?? "Required"
  if (blank) return null // champ vide autorisé (sauf required)

  if (v.list) {
    // Choix multiples : chacune des valeurs doit être dans la liste
    const values = multi ? value : [value]
    if (values.some((x) => !v.list!.some((y) => String(y) === String(x))))
      return v.message ?? "Not in the allowed list"
  }

  if (v.integer && typeof value === "number" && !Number.isInteger(value))
    return v.message ?? "Integer required"

  if (typeof value === "number") {
    if (v.min !== undefined && value < v.min) return v.message ?? `Value below minimum (${v.min})`
    if (v.max !== undefined && value > v.max) return v.message ?? `Value above maximum (${v.max})`
  }

  if (v.pattern && typeof value === "string" && !new RegExp(v.pattern).test(value))
    return v.message ?? "Value does not match the required format"

  if (v.schema) {
    const e = await arkCheck(v.schema, value)
    if (e) return v.message ?? e
  }

  return null
}
