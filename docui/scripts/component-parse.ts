/**
 * Analyse statique (build-time) d'un SFC dnax.ui : extrait du source les
 * informations que le runtime Vue n'expose pas —
 * valeurs possibles des props, slots, events, methods.
 *
 * Utilisé par le module `modules/dnax-ui-meta.ts` pour générer un module virtuel
 * compact (`#build/dnax-ui-meta.mjs`) consommé par <DnaxApi>.
 * (Portage de l'ancien docs/app/composables/useComponentDocs.ts, sans Vue ni `?raw`.)
 */

/** Valeurs possibles (littéraux de chaînes) des props, analysées dans la source SFC. */
export const parsePropsValues = (source: string): Record<string, string[]> => {
  const out: Record<string, string[]> = {}

  const literalsOf = (type: string): string[] | undefined => {
    const lits = [...type.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((mm) => mm[1]!)
    return lits.length ? [...new Set(lits)] : undefined
  }

  // 1) type aliases : `type X = "a" | "b"` (lignes suivantes commençant par | )
  const aliasRe = /type\s+([A-Za-z_$][\w$]*)\s*=\s*((?:[^/\n]+|\n\s*\|[^\n]*)+)/g
  let m: RegExpExecArray | null
  while ((m = aliasRe.exec(source))) {
    const lits = literalsOf(m[2]!)
    if (lits) out[m[1]!] = lits
  }

  // 2) interface Props : prop?: "a" | "b" (inline) ou prop?: NomDAlias (résolu)
  const iface = source.match(/interface\s+Props\s*\{([\s\S]*?)\}/)
  if (iface) {
    const block = iface[1]!.replace(/\/\*[\s\S]*?\*\//g, "")
    const propRe = /([A-Za-z_$][\w$]*)\s*\??\s*:\s*([^\n]+?)\s*(?=\n|$)/g
    let pm: RegExpExecArray | null
    while ((pm = propRe.exec(block))) {
      const raw = pm[2]!.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "").trim()
      const inline = literalsOf(raw)
      if (inline) out[pm[1]!] = inline
      else {
        const names = raw
          .replace(/[()]/g, "")
          .split(/\s*\|\s*/)
          .map((t) => t.trim())
        const fromAlias = names
          .map((n) => out[n])
          .filter((v): v is string[] => Boolean(v))
          .flat()
        if (fromAlias.length) out[pm[1]!] = [...new Set(fromAlias)]
      }
    }
  }
  return out
}

/** Slots du composant : <slot /> (default) et <slot name="x" />. */
export const slotsOf = (source: string): { name: string }[] => {
  const slots: { name: string }[] = []
  const re = /<slot\b([^>]*?)(?:\/>|>)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(source))) {
    const name = m[1]?.match(/\bname\s*=\s*["']([^"']+)["']/)?.[1] ?? "default"
    if (!slots.some((s) => s.name === name)) slots.push({ name })
  }
  return slots
}

/** Events déclarés : defineEmits<{ ... }>() (noms + types des arguments). */
export const emitsOf = (source: string): { name: string; payload: string }[] => {
  const match = source.match(/defineEmits<\{([\s\S]*?)\}>\(\)/)
  if (!match) return []
  const block = match[1]!.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "")
  const events: { name: string; payload: string }[] = []
  let i = 0
  const isSep = (c: string) => c === "," || c === ";" || c === "\n"
  const isWs = (c: string) => c === " " || c === "\t" || c === "\r"
  while (i < block.length) {
    while (i < block.length && (isSep(block[i]!) || isWs(block[i]!))) i++
    if (i >= block.length) break
    let name: string
    if (block[i] === '"' || block[i] === "'") {
      const quote = block[i]!
      i++
      const ns = i
      while (i < block.length && block[i] !== quote) i++
      name = block.slice(ns, i)
      i++
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
    i++
    while (i < block.length && isWs(block[i]!)) i++
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
    const args = payload
      .split(",")
      .map((a) => a.trim().replace(/^[A-Za-z_$][\w$]*\s*:\s*/, ""))
      .filter(Boolean)
    events.push({ name, payload: args.join(", ") })
  }
  return events
}

/** Methods exposées : defineExpose({ ... }) — noms des clés exposées. */
export const methodsOf = (source: string): { name: string }[] => {
  const match = source.match(/defineExpose\(\{([\s\S]*?)\}\)/)
  if (!match) return []
  const block = match[1]!.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "")
  const methods: { name: string }[] = []
  const re = /(?:^|[,;\n])\s*([A-Za-z_$][\w$]*)\s*:/g
  let m: RegExpExecArray | null
  while ((m = re.exec(block))) methods.push({ name: m[1]! })
  return methods
}

export interface ComponentMeta {
  tag: string
  values: Record<string, string[]>
  slots: { name: string }[]
  events: { name: string; payload: string }[]
  methods: { name: string }[]
}

export const kebab = (exportName: string) =>
  `q-${exportName.replace(/^Q/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`

export const parseComponent = (exportName: string, source: string): ComponentMeta => ({
  tag: kebab(exportName),
  values: parsePropsValues(source),
  slots: slotsOf(source),
  events: emitsOf(source),
  methods: methodsOf(source),
})
