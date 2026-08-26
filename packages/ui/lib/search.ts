import Fuse from "fuse.js"

export interface SearchOptions {
  /** Clés à chercher (chemins "a.b", ou clés simples) */
  keys?: string[]
  /** Seuil de tolérance fuse.js : 0 = exact, 1 = tout matche (défaut 0.4) */
  threshold?: number
}

export interface Searcher<T> {
  search: (query: string) => T[]
}

/**
 * Chercheur flou basé sur Fuse.js, orienté autocomplete.
 * - ignoreLocation : le motif peut matcher n'importe où dans le texte
 * - shouldSort : résultats triés par score de pertinence
 */
export function createSearcher<T>(items: T[], options: SearchOptions = {}): Searcher<T> {
  const keys = options.keys ?? []
  const fuse = new Fuse<T>(items, {
    keys,
    threshold: options.threshold ?? 0.4,
    ignoreLocation: true,
    shouldSort: true,
  })

  return {
    search(query) {
      const q = query.trim()
      if (!q || keys.length === 0) return items
      return fuse.search(q).map((r) => r.item)
    },
  }
}
