import { computed, inject, toValue } from "vue"
import type { ComputedRef, MaybeRefOrGetter } from "vue"
import { qConfigKey } from "./config"

/** Échelle de rayon : none (carré) → lg (très arrondi) */
export type RadiusScale = "none" | "xs" | "sm" | "md" | "lg"

/** Prop `radius` : booléen (forme native du composant, ex. pilule) ou échelle */
export type RadiusProp = boolean | RadiusScale

export const RADIUS_VALUES: Record<RadiusScale, string> = {
  none: "0px",
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "16px",
}

export const isRadiusScale = (v: unknown): v is RadiusScale =>
  v === "none" || v === "xs" || v === "sm" || v === "md" || v === "lg"

/**
 * Props par défaut d'un composant depuis `theme.componentProps` :
 * `default` (appliqué à tous) puis `<Nom>` (spécifique, prioritaire).
 * Déjà fusionnés avec le parent par QConfigProvider — le plus proche gagne.
 */
export function useComponentProps(name: string): ComputedRef<Record<string, unknown>> {
  const config = inject(qConfigKey, null)
  return computed(() => {
    const all = config?.theme.value.componentProps ?? {}
    const base = all.default ?? {}
    const specific = all[name] ?? {}
    return { ...base, ...specific }
  })
}

/**
 * Prop `radius` effective : prop explicite > composantProps.<Nom> > composantProps.default > undefined.
 * `own` doit être un getter (() => props.radius) pour rester réactif quand la
 * prop change (cas des wrappers comme QInputPassword qui transmettent radius).
 * `undefined` = pas d'arrondi (hérite du `--q-radius` global, 0 par défaut).
 */
export function useRadius(
  name: string,
  own: MaybeRefOrGetter<RadiusProp | undefined> = undefined,
): ComputedRef<RadiusProp | undefined> {
  const defaults = useComponentProps(name)
  return computed(() => toValue(own) ?? (defaults.value.radius as RadiusProp | undefined))
}

/** Style `--q-radius` à poser sur la racine du composant pour une valeur d'échelle. */
export function radiusStyle(radius: RadiusProp | undefined): Record<string, string> | undefined {
  return isRadiusScale(radius) ? { "--q-radius": RADIUS_VALUES[radius] } : undefined
}
