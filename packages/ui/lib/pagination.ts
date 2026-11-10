// Pagination « distante » d'une grille — calculs **purs** (aucun DOM, aucun état).
//
// Le tableau ne découpe rien lui-même : `rows` contient **la page courante**, chargée par
// l'app. Ce module borne la page, calcule le nombre de pages et la plage globale des lignes
// affichées (numérotation des en-têtes de ligne, « lignes 401–800 sur 12 000 »).

export interface PageInfo {
  /** Page courante, bornée à `[1, pageCount]` */
  page: number
  /** Nombre de pages (toujours ≥ 1) */
  pageCount: number
  /** Décalage global de la première ligne affichée (0-based) */
  offset: number
  /** Numéro global (1-based) de la première ligne affichée — `0` si le total est nul */
  from: number
  /** Numéro global (1-based) de la dernière ligne affichée — `0` si le total est nul */
  to: number
}

export interface PageInfoOptions {
  /** Page demandée (1-based) — bornée au résultat */
  page: number
  /** Lignes par page (0 = pas de pagination) */
  pageSize: number
  /** Total de lignes, toutes pages confondues */
  total: number
  /** Lignes réellement fournies pour cette page (défaut : `pageSize`, ou `total` sans pagination) */
  loaded?: number
}

/**
 * Calcule l'état de pagination. Une page hors bornes est **ramenée** dans `[1, pageCount]`
 * (un total qui rétrécit après un filtre ne laisse pas la vue sur une page vide), et une
 * dernière page peut être partielle (`loaded` < `pageSize`).
 */
export const pageInfo = (options: PageInfoOptions): PageInfo => {
  const size = Math.max(0, Math.trunc(options.pageSize || 0))
  const total = Math.max(0, Math.trunc(options.total || 0))
  const pageCount = size > 0 ? Math.max(1, Math.ceil(total / size)) : 1

  const raw = Number.isFinite(options.page) ? Math.trunc(options.page) : 1
  const page = Math.min(Math.max(1, raw), pageCount)
  const offset = size > 0 ? (page - 1) * size : 0

  const loaded = Math.max(0, Math.trunc(options.loaded ?? (size > 0 ? size : total)))
  const from = total === 0 ? 0 : Math.min(offset + 1, total)
  const to = total === 0 ? 0 : Math.min(offset + loaded, total)

  return { page, pageCount, offset, from, to }
}
