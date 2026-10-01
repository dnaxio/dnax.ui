// themeVars — variables CSS du thème (couleurs, radius global, `vars` libres) pour les
// contenus téléportés (dialogs, bottom sheets) qui sortent du div .q-config-provider.
import { computed } from "vue"
import type { ComputedRef } from "vue"
import { contrastText } from "./colors"
import { isRadiusScale, RADIUS_VALUES } from "./useComponentProps"
import type { QTheme } from "./config"

/**
 * Variables CSS d'un thème : `--<token>` (+ `--<token>-foreground` calculé) pour
 * `colors`, `--q-radius` pour `componentProps.default.radius`, puis les `vars` libres
 * **en dernier** (elles ont le dernier mot). Pur → testable hors navigateur.
 */
export function themeVars(theme: QTheme): Record<string, string> {
  const style: Record<string, string> = {}

  for (const [token, value] of Object.entries(theme.colors ?? {})) {
    if (!value) continue
    style[`--${token}`] = value
    style[`--${token}-foreground`] = contrastText(value)
  }

  // Arrondi global : hérité par TOUS les composants dont le CSS lit var(--q-radius).
  // Une prop/override spécifique (`useRadius`) pose son propre --q-radius inline et prime.
  const global = theme.componentProps?.default?.radius
  if (isRadiusScale(global)) style["--q-radius"] = RADIUS_VALUES[global]

  // Échappatoire : toute variable CSS, avec ou sans préfixe `--`.
  for (const [name, value] of Object.entries(theme.vars ?? {})) {
    if (!value) continue
    style[name.startsWith("--") ? name : `--${name}`] = value
  }

  return style
}

/** Computed des variables du thème (cf. `themeVars`). */
export function themeVarsStyle(theme: ComputedRef<QTheme>): ComputedRef<Record<string, string>> {
  return computed(() => themeVars(theme.value))
}
