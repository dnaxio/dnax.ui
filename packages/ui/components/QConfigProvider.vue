<script setup lang="ts">
// QConfigProvider — API Quasar : <q-config-provider :theme="{ colors: { primary: '#ff0000' }, componentProps: { QBtn: { radius: 'md' } } }">
// Fournit les couleurs du thème à tout le sous-arbre via des variables CSS locales
// (foreground calculé automatiquement), des props par défaut par composant,
// et rend automatiquement la pile de dialogues programmatiques ($q.dialog)
// via QDialogProvider — rien à monter de plus.
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch } from "vue"
import QDialogProvider from "./QDialogProvider.vue"
import QNotifyProvider from "./QNotifyProvider.vue"
import QLoadingProvider from "./QLoadingProvider.vue"
import QBottomSheetProvider from "./QBottomSheetProvider.vue"
import { qConfigKey, qProvidersKey } from "../lib/config"
import type { QConfigContext, QTheme, ThemeMode } from "../lib/config"
import { isRadiusScale, RADIUS_VALUES } from "../lib/useComponentProps"

interface Props {
  /**
   * Thème : objet { mode, colors, componentProps } ou raccourci
   * "light" | "dark" | "system" (mode seul).
   * Ex. : <q-config-provider theme="dark" /> ou
   * :theme="{ mode: 'dark', colors: { primary: '#ff0000' }, componentProps: { QBtn: { radius: 'md' } } }"
   */
  theme?: QTheme | ThemeMode
  /** Rend un div conteneur ; sinon fournit le thème sans élément DOM */
  render?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => ({}),
  render: true,
})

// Imbrication : le thème du parent est fusionné (le plus proche gagne)
const parent = inject(qConfigKey, null)

/** Normalise la prop theme : string (mode) ou objet */
const normalizeTheme = (t: QTheme | ThemeMode | undefined): QTheme =>
  typeof t === "string" ? { mode: t } : (t ?? {})

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

const mergedTheme = computed<QTheme>(() => {
  const self = normalizeTheme(props.theme)
  const parentTheme = parent?.theme.value
  return {
    mode: self.mode ?? parentTheme?.mode ?? "system",
    colors: { ...parentTheme?.colors, ...self.colors },
    componentProps: mergeComponentProps(parentTheme?.componentProps, self.componentProps),
  }
})

// — Mode clair/sombre —
const systemDark = ref(false)
let mql: MediaQueryList | null = null
const updateSystem = () => {
  systemDark.value = mql?.matches ?? false
}

onMounted(() => {
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    mql = window.matchMedia("(prefers-color-scheme: dark)")
    updateSystem()
    mql.addEventListener("change", updateSystem)
  }
})
onBeforeUnmount(() => {
  mql?.removeEventListener("change", updateSystem)
})

/** Mode effectif : light | dark | system résolu */
const isDark = computed<boolean>(() => {
  const mode = mergedTheme.value.mode
  if (mode === "dark") return true
  if (mode === "light") return false
  return systemDark.value
})

// Applique .dark sur le conteneur ET sur <html> (les overlays téléportés au body
// — dialog, sheets — doivent aussi passer en sombre)
watch(
  isDark,
  (dark) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", dark)
    }
  },
  { immediate: true },
)

provide<QConfigContext>(qConfigKey, { theme: mergedTheme, isDark })

// Providers intégrés ($q.dialog + $q.notify) : rendus UNE fois par le
// QConfigProvider le plus externe (les imbriqués ne re-rendent pas → pas de doublons)
const hasProviders = inject(qProvidersKey, false)
provide(qProvidersKey, true)
const isProvidersRoot = computed(() => !hasProviders)

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
  const style: Record<string, string> = {
    "color-scheme": isDark.value ? "dark" : "light",
  }
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
  <q-dialog-provider v-if="isProvidersRoot">
    <q-bottom-sheet-provider />
    <q-notify-provider />
    <q-loading-provider />
    <div v-if="render" class="q-config-provider" :class="{ dark: isDark }" :style="themeStyle">
      <slot />
    </div>
    <slot v-else />
  </q-dialog-provider>
  <div v-else-if="render" class="q-config-provider" :class="{ dark: isDark }" :style="themeStyle">
    <slot />
  </div>
  <slot v-else />
</template>
