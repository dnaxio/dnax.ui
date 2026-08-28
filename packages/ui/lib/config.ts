import type { InjectionKey, Ref } from "vue"

/** Mode clair/sombre du thème */
export type ThemeMode = "light" | "dark" | "system"

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
  /** Mode clair/sombre : light | dark | system (défaut : system = préférence OS) */
  mode?: ThemeMode
  colors?: QThemeColors
  /** Props par défaut par composant (clé = nom du composant, ex. "QBtn") */
  componentProps?: Record<string, Record<string, unknown>>
}

export interface QConfigContext {
  theme: Ref<QTheme>
  /** true si le mode effectif est sombre (résout "system") */
  isDark: Readonly<Ref<boolean>>
}

export const qConfigKey: InjectionKey<QConfigContext> = Symbol("q-config")

/** True si les providers intégrés (dialog stack, notify) sont déjà rendus par un QConfigProvider ancêtre. */
export const qProvidersKey: InjectionKey<boolean> = Symbol("q-providers")
