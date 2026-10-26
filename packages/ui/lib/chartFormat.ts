// Formatage des valeurs de `<q-chart>` (axes, info-bulles, étiquettes, tableaux).
//
// Le traducteur (`chartToECharts`) reste **pur** : ce module ne lit ni le DOM ni la locale
// du navigateur. La locale vient de la prop `locale` (défaut : `fr-FR`, cohérent avec le
// reste du design system), éventuellement surchargée par un format.
//
// Rien n'est formaté tant que l'appelant ne demande rien : sans `format`, une valeur sort
// telle quelle (`String(value)`), donc aucun changement de comportement rétroactif.

/** Format « court » : une chaîne suffit (`format: "compact"`) */
export type QChartFormatKind =
  | "number"
  | "decimal"
  | "percent"
  | "compact"
  | "currency"
  | "date"
  | "time"
  | "datetime"

/** Contexte passé aux formateurs (fonction ou objet) */
export interface QChartFormatContext {
  /** Locale de repli (celle du graphique) */
  locale?: string
  /** Index de la donnée dans sa marque */
  index?: number
  /** Ligne d'origine */
  row?: any
  /** Nom de la série / de la catégorie, si connu */
  name?: string
}

/** Format complet (objet) */
export interface QChartFormatOptions {
  /** Famille de formatage */
  style?: QChartFormatKind
  /** Locale BCP 47 (`fr-FR`, `en-US`…) — prioritaire sur celle du graphique */
  locale?: string
  /** Devise ISO 4217 pour `currency` (`XOF` par défaut → « F CFA ») */
  currency?: string
  /** Fuseau horaire IANA (`Africa/Dakar`…) pour les formats de date */
  timeZone?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  /** `date` / `datetime` : style de la partie date */
  dateStyle?: "full" | "long" | "medium" | "short"
  /** `time` / `datetime` : style de la partie heure */
  timeStyle?: "full" | "long" | "medium" | "short"
  /** Texte ajouté avant / après la valeur formatée */
  prefix?: string
  suffix?: string
}

/** Un format : chaîne courte, objet d'options, ou fonction `(value, ctx) => string` */
export type QChartFormat =
  | QChartFormatKind
  | QChartFormatOptions
  | ((value: any, ctx?: QChartFormatContext) => string)

/** Locale par défaut de tous les formats (l'application peut la changer par prop) */
export const DEFAULT_LOCALE = "fr-FR"

/** Devise par défaut : franc CFA (lisible en `fr-FR` : « 1 234 F CFA ») */
export const DEFAULT_CURRENCY = "XOF"

const isObject = (v: any): v is QChartFormatOptions => v !== null && typeof v === "object"

/** Normalise un format en options exploitables (`undefined` si aucun format demandé) */
export function normalizeFormat(
  format: QChartFormat | undefined,
): QChartFormatOptions | undefined {
  if (format === undefined || format === null) return undefined
  if (typeof format === "string") return { style: format }
  if (typeof format === "function") return undefined
  if (isObject(format)) return format
  return undefined
}

/** Nombre fini ? (`null`, `""`, `NaN` sont écartés) */
const finite = (v: any): v is number => typeof v === "number" && Number.isFinite(v)

/** `value` → `Date` (nombre = timestamp, chaîne = ISO / date lisible) */
function toDate(value: any): Date | undefined {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value
  if (finite(value)) {
    // Un timestamp en **secondes** (API usuelles) est ramené en millisecondes.
    const ms = Math.abs(value) < 1e11 ? value * 1000 : value
    const d = new Date(ms)
    return Number.isNaN(d.getTime()) ? undefined : d
  }
  if (typeof value === "string" && value.trim() !== "") {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? undefined : d
  }
  return undefined
}

const dateFormatted = (value: any, options: QChartFormatOptions, locale: string): string | undefined => {
  const date = toDate(value)
  if (!date) return undefined
  const style = options.style
  const opts: Intl.DateTimeFormatOptions = { timeZone: options.timeZone }
  if (style === "date" || style === "datetime") {
    opts.dateStyle = options.dateStyle ?? (style === "datetime" ? "short" : "medium")
  }
  if (style === "time" || style === "datetime") {
    opts.timeStyle = options.timeStyle ?? "short"
  }
  return new Intl.DateTimeFormat(locale, opts).format(date)
}

const numberFormatted = (value: any, options: QChartFormatOptions, locale: string): string | undefined => {
  const style = options.style ?? "number"
  if (typeof value === "boolean") return String(value)
  if (!finite(value)) return undefined
  const digits: Intl.NumberFormatOptions = {}
  if (options.minimumFractionDigits !== undefined) digits.minimumFractionDigits = options.minimumFractionDigits
  if (options.maximumFractionDigits !== undefined) digits.maximumFractionDigits = options.maximumFractionDigits
  if (style === "compact") {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: options.maximumFractionDigits ?? 1,
    }).format(value)
  }
  if (style === "currency") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: options.currency ?? DEFAULT_CURRENCY,
      ...digits,
    }).format(value)
  }
  if (style === "percent") {
    // La valeur est **déjà en pourcentage** (42 → « 42 % ») : `Intl` multiplie par 100,
    // on divise donc avant (et non l'inverse, qui donnerait 4200 %).
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: options.maximumFractionDigits ?? 1,
      ...digits,
    }).format(value / 100)
  }
  // `number` / `decimal` / style absent : nombre localisé
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    ...digits,
  }).format(value)
}

/** Formate une valeur selon `format`.
 *
 *  - `undefined` / `null` → chaîne vide ;
 *  - sans `format` → `String(value)` (aucun formatage implicite) ;
 *  - `percent` attend une valeur **en pourcentage** (`42` → « 42 % ») ;
 *  - `currency` utilise `XOF` (F CFA) par défaut ;
 *  - une date peut être un `Date`, un timestamp (s/ms) ou une chaîne ISO. */
export function formatValue(
  value: any,
  format?: QChartFormat,
  ctx: QChartFormatContext = {},
): string {
  if (typeof format === "function") {
    const out = format(value, ctx)
    return out === undefined || out === null ? "" : String(out)
  }
  if (value === undefined || value === null || value === "") return ""
  const options = normalizeFormat(format)
  if (!options) return String(value)
  const locale = options.locale ?? ctx.locale ?? DEFAULT_LOCALE
  const temporal =
    options.style === "date" || options.style === "time" || options.style === "datetime"
  const text = temporal
    ? (dateFormatted(value, options, locale) ?? String(value))
    : (numberFormatted(value, options, locale) ?? String(value))
  return `${options.prefix ?? ""}${text}${options.suffix ?? ""}`
}

/** Un format de pourcentage sans `%` (pour composer soi-même un libellé) */
export function formatPercent(value: any, format?: QChartFormat, ctx?: QChartFormatContext): string {
  const options = normalizeFormat(format)
  const merged: QChartFormat = { ...(options ?? {}), style: "percent" }
  return formatValue(value, merged, ctx)
}


/** Formateur ECharts pour un axe (`axisLabel.formatter`), ou `undefined` si rien n'est demandé. */
export function axisFormatter(
  format: QChartFormat | undefined,
  ctx: QChartFormatContext = {},
): ((value: any) => string) | undefined {
  if (format === undefined || format === null) return undefined
  return (value: any) => formatValue(value, format, ctx)
}

/** Graduation d'un axe **temporel** selon sa granularité.
 *  `auto` (défaut) laisse le moteur choisir : aucune fonction n'est renvoyée. */
export function timeTickFormatter(
  unit: "auto" | "day" | "week" | "month" | "quarter" | "year" | undefined,
  locale = DEFAULT_LOCALE,
  timeZone?: string,
): ((value: any) => string) | undefined {
  if (!unit || unit === "auto") return undefined
  return (value: any) => {
    const date = toDate(value)
    if (!date) return String(value ?? "")
    if (unit === "quarter") {
      const quarter = Math.floor(date.getUTCMonth() / 3) + 1
      const year = String(date.getUTCFullYear()).slice(2)
      return `T${quarter} ${year}`
    }
    const opts: Intl.DateTimeFormatOptions = { timeZone }
    if (unit === "day" || unit === "week") {
      opts.day = "numeric"
      opts.month = "short"
    } else if (unit === "month") {
      opts.month = "short"
      opts.year = "2-digit"
    } else {
      opts.year = "numeric"
    }
    return new Intl.DateTimeFormat(locale, opts).format(date)
  }
}
