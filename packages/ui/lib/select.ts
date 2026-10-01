// Coercitions défensives des composants de sélection (QSelect, QAutocomplete) (`lib/select.ts`).
//
// Un `v-model` ou des `options` mal formés ne doivent **jamais** casser le rendu : un
// `list.map is not a function` dans un `computed` du template tue tout le popup, sans
// message utile. Cas réel : `<q-select multiple v-model="x">` avec `x` initialisé à
// `false` (défaut d'un `ref` booléen, retour d'un `&&`, config non chargée) — le garde
// `=== null`/`=== undefined` ne l'attrape pas, puis `false.map(...)` jette. Idem
// `:options` arrivant `false` (`props.options.map` / `.filter` / `.find`).
//
// Pur (aucun DOM) → testable hors navigateur, comme `lib/pagePadding.ts`.

/**
 * Tableau des options. `options` doit être un tableau : toute autre valeur (ex. `false`,
 * `0`, un objet isolé) est traitée comme **vide** plutôt que de faire planter
 * `normalizedOptions`.
 */
export const optionsOf = (value: unknown): any[] => (Array.isArray(value) ? value : [])

/**
 * Tableau de sélection dérivé du `v-model` :
 * - `null` / `undefined` → rien ;
 * - `multiple` → le modèle **doit** être un tableau ; une valeur scalaire (ex. `false`)
 *   vaut « rien de sélectionné » (et non une sélection de cette valeur) ;
 * - mode simple → on emballe la valeur.
 */
export const selectionOf = (value: unknown, multiple: boolean): any[] => {
  if (value === undefined || value === null) return []
  if (multiple) return Array.isArray(value) ? value : []
  return [value]
}
