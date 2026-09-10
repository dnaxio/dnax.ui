// Helpers docs : métadonnées des composants dnax.ui pour <DnaxApi>.
// - props (nom/type/défaut/required) : lues sur la définition runtime du composant
// - valeurs possibles / slots / events / methods : générées au build par
//   `modules/dnax-ui-meta.ts` (analyse statique des SFC) → `#build/dnax-ui-meta.mjs`
import { shallowRef, watchEffect } from "vue"
import type { ComponentMeta } from "../../scripts/component-parse"
import componentMetaMap from "#build/dnax-ui-meta.mjs"

/** Table des métadonnées par export (ex. "QBtn") — générée au build. */
const META = componentMetaMap as unknown as Record<string, ComponentMeta | undefined>

/** Métadonnées statiques d'un composant (slots, events, methods, valeurs de props). */
export const componentMeta = (exportName: string): ComponentMeta | undefined => META[exportName]

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
      const v = def()
      const s = JSON.stringify(v)
      if (s === undefined) return "() => …"
      // Tableaux d'objets/classes non sérialisables (ex. modules) → forme courte
      if (
        Array.isArray(v) &&
        v.length > 0 &&
        v.every((x) => x === null || typeof x === "object" || typeof x === "function")
      )
        return `() => [${v.length} items]`
      return s.length > 60 ? s.slice(0, 57) + "…" : s
    } catch {
      return "() => …"
    }
  }
  // Chaînes entre guillemets (visible aussi pour la chaîne vide "") :
  if (typeof def === "string") {
    return def.length > 60 ? `"${def.slice(0, 57)}…"` : `"${def}"`
  }
  const s = String(def)
  return s.length > 60 ? s.slice(0, 57) + "…" : s
}

/** Table des props d'un composant (runtime) enrichie des valeurs possibles (build). */
export const propsTableOf = (
  comp: any,
  values: Record<string, string[]> = {},
): { name: string; type: string; required: boolean; default: string; values?: string[] }[] => {
  if (!comp?.props) return []
  return Object.entries(comp.props).map(([key, def]) => {
    const d = typeof def === "object" && def !== null ? (def as any) : { type: def }
    return {
      name: key,
      type: typeName(d.type),
      required: !!d.required,
      default: defaultValue(d.default),
      values: values[key],
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
