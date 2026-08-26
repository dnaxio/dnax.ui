import type { InjectionKey, Ref } from "vue"

export interface QThemeColors {
  primary?: string
  secondary?: string
  accent?: string
  dark?: string
  positive?: string
  negative?: string
  info?: string
  warning?: string
}

export interface QTheme {
  colors?: QThemeColors
  /** Props par défaut par composant (clé = nom du composant, ex. "QBtn") */
  componentProps?: Record<string, Record<string, unknown>>
}

export const qConfigKey: InjectionKey<{ theme: Ref<QTheme> }> = Symbol("q-config")
