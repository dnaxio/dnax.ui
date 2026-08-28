// Helpers docs : chargement de composant @dnax/ui + table de props runtime.
import { shallowRef, watchEffect } from "vue"

/** Balise kebab-case : QBtn → q-btn */
export const componentTag = (exportName: string) =>
  exportName.replace(/^Q/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

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
