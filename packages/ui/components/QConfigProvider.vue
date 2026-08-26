<script setup lang="ts">
// QConfigProvider — API Quasar : <q-config-provider :theme="{ colors: { primary: '#ff0000' }, componentProps: { QBtn: { radius: 'md' } } }">
// Fournit les couleurs du thème à tout le sous-arbre via des variables CSS locales
// (foreground calculé automatiquement), et des props par défaut par composant.
import { computed, inject, provide } from "vue"
import { qConfigKey } from "../lib/config"
import type { QTheme } from "../lib/config"
import { isRadiusScale, RADIUS_VALUES } from "../lib/useComponentProps"

interface Props {
  /** Thème : couleurs à surcharger + props par défaut par composant */
  theme?: QTheme
  /** Rend un div conteneur ; sinon fournit le thème sans élément DOM */
  render?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => ({}),
  render: true,
})

// Imbrication : le thème du parent est fusionné (le plus proche gagne)
const parent = inject(qConfigKey, null)

/** Fusionne deux maps de componentProps : par composant, le plus proche gagne par prop. */
const mergeComponentProps = (
  a?: Record<string, Record<string, unknown>>,
  b?: Record<string, Record<string, unknown>>,
): Record<string, Record<string, unknown>> => {
  const base = a ?? {}
  const self = b ?? {}
  const keys = new Set([...Object.keys(base), ...Object.keys(self)])
  const out: Record<string, Record<string, unknown>> = {}
  for (const key of keys) {
    out[key] = { ...base[key], ...self[key] }
  }
  return out
}

const mergedTheme = computed<QTheme>(() => ({
  colors: { ...parent?.theme.value.colors, ...props.theme.colors },
  componentProps: mergeComponentProps(parent?.theme.value.componentProps, props.theme.componentProps),
}))

provide(qConfigKey, { theme: mergedTheme })

/** Calcule un foreground lisible (blanc ou sombre) pour un fond donné. */
const textColorFor = (bg: string): string => {
  let hex = bg.trim().replace(/^#/, "")
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("")
  if (!/^[0-9a-f]{6}$/i.test(hex)) return "#ffffff"
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 150 ? "#1d1d1d" : "#ffffff"
}

const themeStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  for (const [token, value] of Object.entries(mergedTheme.value.colors ?? {})) {
    if (!value) continue
    style[`--${token}`] = value
    style[`--${token}-foreground`] = textColorFor(value)
  }
  // Arrondi global : composantProps.default.radius → --q-radius hérité par TOUS
  // les composants dont le CSS utilise var(--q-radius). Une prop/override
  // spécifique (useRadius) pose son propre --q-radius inline et prime.
  const global = mergedTheme.value.componentProps?.default?.radius
  if (isRadiusScale(global)) style["--q-radius"] = RADIUS_VALUES[global]
  return style
})
</script>

<template>
  <div v-if="render" class="q-config-provider" :style="themeStyle">
    <slot />
  </div>
  <slot v-else />
</template>
