// $q.localStorage / $q.sessionStorage — stockage web façon Quasar
// (https://quasar.dev/quasar-plugins/web-storage).
//
// Les valeurs sont sérialisées avec leur type d'origine (Date, RegExp, number,
// boolean, string, objets/tableaux) grâce à un encodage préfixé — le format
// `__q_*` est volontairement IDENTIQUE à celui de Quasar : des clés écrites par
// une app Quasar restent lisibles par dnax.ui et inversement.
//
// Autres types (undefined, null, bigint, symbol, fonction) : stockés sous forme
// de string (comportement Quasar).
//
// SSR-safe : côté serveur (ou quand le Web Storage est indisponible — mode
// privé, iframe sandbox…), toutes les méthodes deviennent des no-op et
// getItem/getIndex/getKey renvoient null, getAll {}, getAllKeys [].

export interface QWebStorage {
  /** true si la clé existe */
  has(key: string): boolean
  /** Alias de has() */
  hasItem(key: string): boolean
  /** Nombre de clés stockées */
  getLength(): number
  /** Valeur (typée) de la clé, ou null si absente */
  getItem<T = unknown>(key: string): T | null
  /** Valeur (typée) stockée à l'index donné (ordre du Web Storage), ou null */
  getIndex<T = unknown>(index: number): T | null
  /** Clé stockée à l'index donné, ou null */
  getKey(index: number): string | null
  /** Toutes les entrées : { clé: valeur typée } */
  getAll(): Record<string, unknown>
  /** Toutes les clés, dans l'ordre du Web Storage */
  getAllKeys(): string[]
  /** Stocke une valeur (sérialisation typée) — alias de setItem() */
  set(key: string, value: unknown): void
  /** Stocke une valeur (sérialisation typée) */
  setItem(key: string, value: unknown): void
  /** Supprime la clé — alias de removeItem() */
  remove(key: string): void
  /** Supprime la clé */
  removeItem(key: string): void
  /** Vide tout le stockage */
  clear(): void
  /** true si le stockage est vide */
  isEmpty(): boolean
}

// — Sérialisation typée (format compatible Quasar) —
// Encode : `__q_<type>|<payload>` — tout type supporté ré-encode ses données
// pour que le Web Storage (qui ne stocke que des strings) restitue le type.

function encode(value: unknown): string {
  if (value instanceof Date) return `__q_date|${value.getTime()}`
  if (value instanceof RegExp) return `__q_expr|${value.source}`
  switch (typeof value) {
    case "number": return `__q_numb|${value}`
    case "boolean": return `__q_bool|${value ? "1" : "0"}`
    case "string": return `__q_strn|${value}`
    case "function": return `__q_strn|${value.toString()}`
    case "object":
      if (value !== null) return `__q_objt|${JSON.stringify(value)}`
      break
  }
  // Type non supporté (undefined, null, bigint, symbol…) : stocké tel quel
  // (le Web Storage le convertit en string — même résultat côté lecture).
  return String(value)
}

const NUMBER_RE = /^-?\d+$/

function decode(value: string): unknown {
  // Valeur non encodée par nous (< préfixe, ou préfixe inconnu) : telle quelle
  if (value.length < 9) return value
  const type = value.slice(0, 8)
  const source = value.slice(9)

  switch (type) {
    case "__q_date": {
      // Horodatage numérique (format actuel) ou string ISO (anciens formats)
      return new Date(NUMBER_RE.test(source) ? Number.parseInt(source, 10) : source)
    }
    case "__q_expr":
      return new RegExp(source)
    case "__q_numb":
      return Number(source)
    case "__q_bool":
      return source === "1"
    case "__q_strn":
      return source
    case "__q_objt": {
      try {
        return JSON.parse(source)
      }
      catch {
        // Payload corrompu → valeur brute plutôt que de faire planter getItem()
        return value
      }
    }
    default:
      return value
  }
}

// Instance no-op pour SSR / Web Storage indisponible (miroir de Quasar :
// getEmptyStorage) — jamais de throw ni d'accès à window.
function emptyStorage(): QWebStorage {
  const noop = () => {}
  return {
    has: () => false,
    hasItem: () => false,
    getLength: () => 0,
    getItem: () => null,
    getIndex: () => null,
    getKey: () => null,
    getAll: () => ({}),
    getAllKeys: () => [],
    set: noop,
    setItem: noop,
    remove: noop,
    removeItem: noop,
    clear: noop,
    isEmpty: () => true,
  }
}

function init(type: "local" | "session"): QWebStorage {
  try {
    if (typeof window === "undefined") return emptyStorage()
    const ws = type === "local" ? window.localStorage : window.sessionStorage
    if (!ws) return emptyStorage()

    const get = (key: string): unknown => {
      const item = ws.getItem(key)
      return item === null ? null : decode(item)
    }

    return {
      has: (key) => ws.getItem(key) !== null,
      hasItem: (key) => ws.getItem(key) !== null,
      getLength: () => ws.length,
      getItem: <T = unknown>(key: string): T | null => get(key) as T | null,
      getIndex: <T = unknown>(index: number): T | null =>
        index < ws.length ? (get(ws.key(index) as string) as T | null) : null,
      getKey: (index) => (index < ws.length ? ws.key(index) : null),
      getAll: () => {
        const result: Record<string, unknown> = {}
        for (let i = 0; i < ws.length; i++) {
          const key = ws.key(i) as string
          result[key] = get(key)
        }
        return result
      },
      getAllKeys: () => {
        const result: string[] = []
        for (let i = 0; i < ws.length; i++) result.push(ws.key(i) as string)
        return result
      },
      set: (key, value) => ws.setItem(key, encode(value)),
      setItem: (key, value) => ws.setItem(key, encode(value)),
      remove: (key) => ws.removeItem(key),
      removeItem: (key) => ws.removeItem(key),
      clear: () => ws.clear(),
      isEmpty: () => ws.length === 0,
    }
  }
  catch {
    // Accès bloqué (mode privé, cookies désactivés…) → instance no-op
    return emptyStorage()
  }
}

/** $q.localStorage — stockage persistant (API Quasar Web Storage) */
export const localStorage: QWebStorage = init("local")

/** $q.sessionStorage — stockage par session (API Quasar Web Storage) */
export const sessionStorage: QWebStorage = init("session")
