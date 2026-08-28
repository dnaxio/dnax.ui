// Helpers docs : chargement de composant @dnax/ui + table de props runtime.
import { shallowRef, watchEffect } from "vue"

// Sources SFC brutes des composants de la lib (analyse slots/events/methods).
// Chemin relatif depuis ce fichier (docs/app/composables) → racine du monorepo.
const rawSources = import.meta.glob("../../../packages/ui/components/*.vue", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

/** Source brute du SFC (ex. "QAccordion" → contenu de QAccordion.vue). */
export const componentSource = (exportName: string): string | undefined => {
  const key = `../../../packages/ui/components/${exportName}.vue`
  const direct = rawSources[key]
  if (direct !== undefined) return direct
  const bySuffix = Object.entries(rawSources).find(([k]) => k.endsWith(`/${exportName}.vue`))
  return bySuffix?.[1]
}

/** Balise kebab-case complète : QBtn → q-btn, QInputPassword → q-input-password */
export const componentTag = (exportName: string) =>
  `q-${exportName.replace(/^Q/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`

const typeName = (t: unknown): string => {
  const list = Array.isArray(t) ? t : t ? [t] : []
  if (list.length === 0) return "any"
  return [...new Set(list.map((c: any) => c?.name ?? "unknown"))].join(" | ")
}

const defaultValue = (def: unknown): string => {
  if (def === undefined || def === null) return "—"
  if (typeof def === "function") {
    try {
      return JSON.stringify(def())
    } catch {
      return "() => …"
    }
  }
  return String(def)
}

/** Table des props d'un composant (lue sur sa définition runtime) */
export const propsTableOf = (
  comp: any,
): { name: string; type: string; required: boolean; default: string }[] => {
  if (!comp?.props) return []
  return Object.entries(comp.props).map(([key, def]) => {
    const d = typeof def === "object" && def !== null ? (def as any) : { type: def }
    return {
      name: key,
      type: typeName(d.type),
      required: !!d.required,
      default: defaultValue(d.default),
    }
  })
}

/** Charge un composant depuis @dnax/ui par son export (ex. "QBtn") */
export const useComponent = (exportName: () => string | undefined) => {
  const comp = shallowRef<any>(null)
  watchEffect(async () => {
    comp.value = null
    const name = exportName()
    if (!name) return
    const mod = await import("@dnax/ui/runtime")
    comp.value = (mod as any)[name] ?? null
  })
  return comp
}

// ══════════════════════════════════════════════════════════════════════
// Slots / Events / Methods — analysés depuis la source SFC (le runtime Vue
// n'expose ni les slots ni les emits déclarés en forme typée).
// ══════════════════════════════════════════════════════════════════════

export interface SlotDoc {
  name: string
}

/** Slots du composant : <slot /> (default) et <slot name="x" />. */
export const slotsOf = (source?: string): SlotDoc[] => {
  if (!source) return []
  const slots: SlotDoc[] = []
  const re = /<slot\b([^>]*?)(?:\/>|>)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(source))) {
    const name = m[1]?.match(/\bname\s*=\s*["']([^"']+)["']/)?.[1] ?? "default"
    if (!slots.some((s) => s.name === name)) slots.push({ name })
  }
  return slots
}

export interface EventDoc {
  name: string
  /** Types des arguments émis (ex. "string | string[] | undefined") */
  payload: string
}

/** Events : defineEmits<{...}> typé (source) ; repli sur comp.emits (forme runtime). */
export const emitsOf = (comp: any, source?: string): EventDoc[] => {
  const fromSource = parseEmitsFromSource(source)
  if (fromSource.length) return fromSource
  const emits = comp?.emits
  if (Array.isArray(emits)) return emits.map((name: string) => ({ name, payload: "" }))
  if (emits && typeof emits === "object")
    return Object.keys(emits).map((name) => ({ name, payload: "" }))
  return []
}

/** Parse le bloc defineEmits<{ ... }>() (entrées séparées par , ou ;). */
const parseEmitsFromSource = (source?: string): EventDoc[] => {
  if (!source) return []
  const match = source.match(/defineEmits<\{([\s\S]*?)\}>\(\)/)
  if (!match) return []
  // Retire les commentaires (JSDoc entre les entrées) avant analyse
  const block = match[1]!.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "")
  return parseEmitsBlock(block)
}

/** Mini-parseur d'entrées `"name": [args]` (noms quotés avec ':', séparateurs , ; ou retours ligne). */
const parseEmitsBlock = (block: string): EventDoc[] => {
  const events: EventDoc[] = []
  let i = 0
  const isSep = (c: string) => c === "," || c === ";" || c === "\n"
  const isWs = (c: string) => c === " " || c === "\t" || c === "\r"
  while (i < block.length) {
    while (i < block.length && (isSep(block[i]!) || isWs(block[i]!))) i++
    if (i >= block.length) break
    // Nom : entre guillemets (peut contenir ':') ou identifiant simple
    let name: string
    if (block[i] === '"' || block[i] === "'") {
      const quote = block[i]!
      i++
      const ns = i
      while (i < block.length && block[i] !== quote) i++
      name = block.slice(ns, i)
      i++ // guillemet fermant
    }
    else {
      const ns = i
      while (i < block.length && /[A-Za-z0-9_.$-]/.test(block[i]!)) i++
      name = block.slice(ns, i)
    }
    while (i < block.length && isWs(block[i]!)) i++
    if (!name || block[i] !== ":") {
      i++
      continue
    }
    i++ // ':'
    while (i < block.length && isWs(block[i]!)) i++
    // Valeur : tuple [..] (parenthèses/tableaux imbriqués) ou expression simple
    let payload = ""
    if (block[i] === "[") {
      let depth = 0
      const vstart = i
      while (i < block.length) {
        if (block[i] === "[") depth++
        else if (block[i] === "]") {
          depth--
          if (depth === 0) {
            i++
            break
          }
        }
        i++
      }
      payload = block.slice(vstart + 1, i - 1)
    }
    else {
      const vstart = i
      while (i < block.length && !isSep(block[i]!)) i++
      payload = block.slice(vstart, i)
    }
    // Nettoie : retire les noms d'arguments (`value: string` → `string`)
    const args = payload
      .split(",")
      .map((a) => a.trim().replace(/^[A-Za-z_$][\w$]*\s*:\s*/, ""))
      .filter(Boolean)
    events.push({ name, payload: args.join(", ") })
  }
  return events
}

export interface MethodDoc {
  name: string
}

/** Methods exposées : defineExpose({ ... }) — noms des clés exposées. */
export const methodsOf = (source?: string): MethodDoc[] => {
  if (!source) return []
  const match = source.match(/defineExpose\(\{([\s\S]*?)\}\)/)
  if (!match) return []
  // Retire les commentaires avant analyse
  const block = match[1]!.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "")
  const methods: MethodDoc[] = []
  const re = /(?:^|[,;\n])\s*([A-Za-z_$][\w$]*)\s*:/g
  let m: RegExpExecArray | null
  while ((m = re.exec(block))) methods.push({ name: m[1]! })
  return methods
}
