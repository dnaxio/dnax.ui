// Libellés et locale des composants de date (QDatePicker / QDateCalendar).
//
// La langue vient du `QConfigProvider` (`lang`, défaut "en") et arrive ici via
// `useConfigLang()`. On ne s'appuie **pas** sur la locale du navigateur : le rendu
// doit être déterministe (serveur ↔ client) et suivre la langue choisie dans l'app.
import type { QAppLang } from "./config"

/** Clés d'interface des composants de date. */
export type DateUiKey =
  | "today"
  | "prevMonth"
  | "nextMonth"
  | "chooseMonth"
  | "prevYear"
  | "nextYear"
  | "selectDate"
  | "clear"
  | "close"

const DATE_UI: Record<QAppLang, Record<DateUiKey, string>> = {
  en: {
    today: "Today",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    chooseMonth: "Choose month",
    prevYear: "Previous year",
    nextYear: "Next year",
    selectDate: "Select a date",
    clear: "Clear",
    close: "Close",
  },
  fr: {
    today: "Aujourd'hui",
    prevMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    chooseMonth: "Choisir le mois",
    prevYear: "Année précédente",
    nextYear: "Année suivante",
    selectDate: "Sélectionner une date",
    clear: "Effacer",
    close: "Fermer",
  },
}

/** Locale BCP 47 associée à la langue de l'app (déterministe, contrairement à `undefined`). */
export function dateLocale(lang: QAppLang): string {
  return lang === "fr" ? "fr-FR" : "en-US"
}

/** Libellés d'interface des composants de date. */
export function dateLabels(lang: QAppLang): Record<DateUiKey, string> {
  return DATE_UI[lang] ?? DATE_UI.en
}

/** Abréviation : initiale en majuscule, sans point final (`dim.` → `Dim`). */
function shortName(value: string): string {
  const clean = value.replace(/[.,]+$/, "").trim()
  return clean.charAt(0).toUpperCase() + clean.slice(1)
}

/**
 * Jours de la semaine abrégés, en commençant par `firstDayOfWeek`
 * (0 = dimanche, 1 = lundi).
 */
export function weekdayShortNames(locale: string, firstDayOfWeek = 1): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" })
  // 2024-01-07 est un dimanche — référence stable, indépendante de la date du jour.
  const names = Array.from({ length: 7 }, (_, i) =>
    shortName(fmt.format(new Date(2024, 0, 7 + i))),
  )
  const start = ((firstDayOfWeek % 7) + 7) % 7
  return Array.from({ length: 7 }, (_, i) => names[(start + i) % 7]!)
}

/** Mois abrégés, dans l'ordre de l'année (`Janv.` / `Jan`). */
export function monthShortNames(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: "short" })
  return Array.from({ length: 12 }, (_, i) => shortName(fmt.format(new Date(2024, i, 1))))
}

/** En-tête du calendrier : « janvier 2026 » / « January 2026 ». */
export function monthYearLabel(locale: string, year: number, month: number): string {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })
    .format(new Date(year, month, 1))
}
