/**
 * Analyse statique (build-time) de `packages/ui/lib/chart.ts` : extrait l'**API de chaque
 * marque de graphique** — les options de `QChartMark` réellement acceptées par la marque
 * (`MARK_OPTIONS`), avec leur type et leur description (JSDoc).
 *
 * Utilisé par le module `scripts/dnax-ui-meta.ts` pour générer le module virtuel
 * `#build/dnax-ui-meta.mjs`, consommé par <DnaxMarkApi> (`:dnax-mark-api{mark="bar"}`).
 */

/** Une option d'une marque, telle qu'affichée dans la table de doc */
export interface MarkOptionMeta {
  /** Nom de la clé dans l'objet marque (ex. "strokeWidth") */
  key: string
  /** Type TypeScript déclaré dans `QChartMark` (ex. "number | QChartChannel") */
  type: string
  /** Description (JSDoc), sans le préfixe « `bar` : » propre à une autre marque */
  description: string
  /** Valeurs littérales acceptées, quand la source en déclare */
  values?: string[]
}

/** Description d'une marque de graphique */
export interface MarkMeta {
  /** Type de la marque (`line`, `area`, `bar`, `dot`, `image`, `text`, `rule`) */
  type: string
  /** Options acceptées, dans l'ordre de `MARK_OPTIONS` */
  options: MarkOptionMeta[]
}

/** Champs de l'interface `QChartMark`, dans l'ordre du fichier source */
const interfaceFields = (source: string): Map<string, { type: string; description: string; values?: string[] }> => {
  const out = new Map<string, { type: string; description: string; values?: string[] }>()
  const block = source.match(/export\s+interface\s+QChartMark\s*\{([\s\S]*?)\n\}/)
  if (!block) return out

  // Chaque champ : un bloc JSDoc optionnel suivi de `nom?: type` (le type peut contenir
  // un littéral de chaînes : `"ellipsis" | "clip"`, ou une union multi-ligne).
  const fieldRe = /(?:\/\*\*([\s\S]*?)\*\/\s*)?([A-Za-z_$][\w$]*)\??\s*:\s*([^\n]+)/g
  let m: RegExpExecArray | null
  while ((m = fieldRe.exec(block[1]!))) {
    const doc = (m[1] ?? "")
      .split("\n")
      .map((line) => line.replace(/^\s*\*?\s?/, "").trimEnd())
      .join(" ")
      .trim()
    const type = (m[3] ?? "").trim()
    const literals = [...type.matchAll(/"([^"]*)"/g)].map((x) => x[1]!)
    out.set(m[2]!, {
      type,
      description: doc,
      values: literals.length ? [...new Set(literals)] : undefined,
    })
  }
  return out
}

/** `MARK_OPTIONS` : les clés acceptées par chaque marque (source de vérité) */
const markOptions = (source: string): Record<string, string[]> => {
  const out: Record<string, string[]> = {}
  const block = source.match(/export\s+const\s+MARK_OPTIONS\s*=\s*\{([\s\S]*?)\n\}\s*as const/)
  if (!block) return out
  // Une marque par ligne (les tableaux multi-lignes se terminent par `],`)
  const entryRe = /^\s*([A-Za-z]+)\s*:\s*\[([\s\S]*?)\]/gm
  let m: RegExpExecArray | null
  while ((m = entryRe.exec(block[1]!))) {
    out[m[1]!] = [...m[2]!.matchAll(/"([^"]+)"/g)].map((x) => x[1]!)
  }
  return out
}

/** Retire le préfixe propre à une marque : « `image` : largeur en pixels » → « largeur… » */
const stripMarkPrefix = (doc: string) => doc.replace(/^`[a-z]+`\s*:\s*/, "")

/**
 * API de chaque marque de `lib/chart.ts` (source lue au build).
 * Renvoie un objet vide si le fichier ne correspond plus au format attendu : la doc
 * affiche alors seulement l'API de `<q-chart>` (dégradation douce, build non cassé).
 */
export const parseMarks = (source: string): Record<string, MarkMeta> => {
  const fields = interfaceFields(source)
  const options = markOptions(source)
  const out: Record<string, MarkMeta> = {}
  for (const [type, keys] of Object.entries(options)) {
    out[type] = {
      type,
      options: keys
        .filter((key) => fields.has(key))
        .map((key) => {
          const field = fields.get(key)!
          return {
            key,
            type: field.type,
            description: stripMarkPrefix(field.description),
            values: field.values,
          }
        }),
    }
  }
  return out
}
