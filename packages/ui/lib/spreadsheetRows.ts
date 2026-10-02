// **Limites du nombre de lignes** de QSpreadsheet (`<q-spreadsheet>`) : props `maxRows` /
// `minRows`. Elles bornent les opérations **utilisateur** (ajout / insertion / suppression de
// lignes, import CSV) — jamais les chargements programmatiques (`loadDocument`), comme
// `readonly` / `disable` bornent les éditions.
//
// Logique **pure**, testable hors navigateur — comme `spreadsheetZones.ts`.

/** Nombre de lignes qu'on peut encore **ajouter** avant `max` (`Infinity` si pas de limite). */
export function rowRoom(current: number, max?: number): number {
  if (typeof max !== "number" || !Number.isFinite(max)) return Number.POSITIVE_INFINITY
  return Math.max(0, max - current)
}

/** Peut-on ajouter `count` lignes à un document de `current` lignes ? */
export function canAddRows(current: number, count = 1, max?: number): boolean {
  return count <= rowRoom(current, max)
}

/** Nombre de lignes qu'on peut **retirer** au maximum avant d'atteindre `min` (plancher 0). */
export function removalsAllowed(current: number, min?: number): number {
  if (typeof min !== "number" || !Number.isFinite(min)) return Math.max(0, current)
  return Math.max(0, current - Math.max(0, min))
}

/** Peut-on retirer `count` lignes d'un document de `current` lignes (il en reste ≥ `min`) ? */
export function canRemoveRows(current: number, count = 1, min?: number): boolean {
  return count <= removalsAllowed(current, min)
}

/** Plafonne une liste de lignes à `max` (renvoie la **même** référence si rien à couper). */
export function clampRows<T>(rows: T[], max?: number): T[] {
  if (typeof max !== "number" || !Number.isFinite(max) || rows.length <= max) return rows
  return rows.slice(0, max)
}
