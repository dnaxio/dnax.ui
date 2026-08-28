// themeVarsStyle — variables CSS du thème (couleurs + radius) pour les contenus
// téléportés (dialogs, bottom sheets) qui sortent du div .q-config-provider.
import { computed } from "vue"
import type { ComputedRef } from "vue"
import { contrastText } from "./colors"
import { isRadiusScale, RADIUS_VALUES } from "./useComponentProps"
import type { QTheme } from "./config"

/** Computed des variables --token / --token-foreground / --q-radius du thème. */
export function themeVarsStyle(theme: ComputedRef<QTheme>): ComputedRef<Record<string, string>> {
  return computed(() => {
    const style: Record<string, string> = {}
    for (const [token, value] of Object.entries(theme.value.colors ?? {})) {
      if (!value) continue
      style[`--${token}`] = value
      style[`--${token}-foreground`] = contrastText(value)
    }
    const global = theme.value.componentProps?.default?.radius
    if (isRadiusScale(global)) style["--q-radius"] = RADIUS_VALUES[global]
    return style
  })
}
