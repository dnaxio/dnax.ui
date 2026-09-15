// Module virtuel généré au build par `scripts/dnax-ui-meta.ts`.
declare module "#build/dnax-ui-meta.mjs" {
  import type { ComponentMeta } from "./scripts/component-parse"
  import type { MarkMeta } from "./scripts/mark-parse"

  const meta: Record<string, ComponentMeta | undefined>
  export default meta
  /** API de chaque marque de graphique (`lib/chart.ts` → `MARK_OPTIONS`) */
  export const marks: Record<string, MarkMeta | undefined>
}
