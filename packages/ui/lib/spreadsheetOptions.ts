// Options de cellule de QSpreadsheet (`<q-spreadsheet>`, colonnes `select` / `multiselect`).
//
// Une colonne reçoit `options` — par défaut sous la forme `{ value, label, color? }`. Avec
// `optionLabel` / `optionValue`, **n'importe quelle forme d'objet** est acceptée (ex. le
// `[{ _id, name }]` renvoyé par une API) : on la **normalise une seule fois** vers la forme
// interne. C'est le point clé — badge, info-bulle, éditeur, tri, filtre et copie/CSV lisent
// tous la même forme, donc aucun risque d'incohérence entre deux sites.
//
// Pur (aucun DOM) → testable hors navigateur, comme `spreadsheetValidation.ts`.

import { optionsOf } from "./select"

/** Option interne normalisée : la **seule** forme lue par le composant. */
export interface QSpreadsheetCellOption {
  /**
   * Valeur stockée dans la cellule. Doit être **primitive** (string / number / boolean),
   * unique dans la liste : le composant compare les valeurs par `===` et le document est
   * sérialisé par `toJSON()`.
   */
  value: any
  /**
   * Libellé affiché. Les nombres sont acceptés (`{ value: 1, label: 1 }` pour une note, un
   * niveau…) : le composant les normalise en string partout où il fait des opérations de
   * chaîne (recherche, filtre, tri, éditeur).
   */
  label: string | number
  /** Couleur du badge (token ou hex, ex. "positive", "#22c55e") */
  color?: string
}

/**
 * Accès à un champ d'une option : nom de clé (`"name"`, `"_id"`) **ou** fonction
 * (`(o) => o.name`), comme l'`option-label` / `option-value` de `<q-select>`.
 */
export type QSpreadsheetOptionAccessor = string | ((opt: any) => any)

const read = (opt: any, accessor: QSpreadsheetOptionAccessor | undefined): any =>
  typeof accessor === "function" ? accessor(opt) : accessor === undefined ? undefined : opt?.[accessor]

/**
 * Normalise les options d'une colonne vers `{ value, label, color? }`.
 *
 * - `optionLabel` / `optionValue` : clé ou fonction — défauts `"label"` / `"value"` (donc une
 *   colonne déjà écrite sous la forme `{ value, label }` n'est pas modifiée) ;
 * - une option **primitive** (`"a"`, `3`) devient `{ value, label: String(value) }` ;
 * - `label` absent → repli sur `String(value)` ;
 * - `color` est **transmis tel quel** (la couleur est une décision de présentation) ;
 * - `options` qui n'est pas un tableau → `[]` (jamais d'exception).
 */
export function normalizeCellOptions(
  options: unknown,
  optionLabel?: QSpreadsheetOptionAccessor,
  optionValue?: QSpreadsheetOptionAccessor,
): QSpreadsheetCellOption[] {
  return optionsOf(options).map((opt): QSpreadsheetCellOption => {
    if (opt === null || typeof opt !== "object") {
      return { value: opt, label: String(opt ?? "") }
    }

    const value = read(opt, optionValue ?? "value")
    const label = read(opt, optionLabel ?? "label")

    const out: QSpreadsheetCellOption = {
      value,
      label: label === undefined || label === null ? String(value ?? "") : label,
    }
    if (opt.color !== undefined) out.color = opt.color
    return out
  })
}
