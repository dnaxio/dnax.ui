// Mode clair/sombre de la doc : état partagé (singleton) + persistance localStorage.
import { ref, watch } from "vue"

export type ThemeMode = "light" | "dark" | "system"

const STORAGE_KEY = "dnax-ui-theme-mode"

const mode = ref<ThemeMode>("system")

// Init depuis localStorage (client only)
if (typeof window !== "undefined") {
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === "light" || saved === "dark" || saved === "system") mode.value = saved
}

watch(mode, (m) => {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, m)
})

const setMode = (m: ThemeMode) => {
  mode.value = m
}

/** Cycle light → dark → system → light */
const cycleMode = () => {
  const order: ThemeMode[] = ["light", "dark", "system"]
  mode.value = order[(order.indexOf(mode.value) + 1) % order.length] ?? "system"
}

export const useThemeMode = () => ({ mode, setMode, cycleMode })
