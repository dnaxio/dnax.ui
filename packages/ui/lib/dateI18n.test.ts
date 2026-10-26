// Libellés / locale des composants de date — pilotés par le `lang` du provider.
import { describe, expect, it } from "bun:test"
import {
  dateLabels,
  dateLocale,
  monthShortNames,
  monthYearLabel,
  weekdayShortNames,
} from "./dateI18n"

describe("dateLocale", () => {
  it("mappe la langue de l'app sur une locale BCP 47 déterministe", () => {
    expect(dateLocale("fr")).toBe("fr-FR")
    expect(dateLocale("en")).toBe("en-US")
  })
})

describe("dateLabels", () => {
  it("« Today » devient « Aujourd'hui » en français", () => {
    expect(dateLabels("fr").today).toBe("Aujourd'hui")
    expect(dateLabels("en").today).toBe("Today")
  })

  it("couvre les libellés du panneau et de la navigation", () => {
    expect(dateLabels("fr").selectDate).toBe("Sélectionner une date")
    expect(dateLabels("fr").clear).toBe("Effacer")
    expect(dateLabels("fr").close).toBe("Fermer")
    expect(dateLabels("fr").prevMonth).toBe("Mois précédent")
    expect(dateLabels("fr").nextMonth).toBe("Mois suivant")
    expect(dateLabels("en").selectDate).toBe("Select a date")
  })

  it("retombe sur l'anglais pour une langue inconnue (JS non typé)", () => {
    expect(dateLabels("de" as never).today).toBe("Today")
  })
})

describe("weekdayShortNames", () => {
  it("suit la locale demandée, pas celle du navigateur", () => {
    expect(weekdayShortNames("fr-FR", 1)[0]).toMatch(/^lun/i)
    expect(weekdayShortNames("en-US", 1)[0]).toMatch(/^mon/i)
  })

  it("commence par le jour demandé (0 = dimanche)", () => {
    const monday = weekdayShortNames("en-US", 1)
    const sunday = weekdayShortNames("en-US", 0)
    expect(sunday[0]).toMatch(/^sun/i)
    expect(sunday[0]).toBe(monday[6])
    expect(sunday[6]).toBe(monday[5])
  })

  it("rend 7 jours sans point final ni minuscule initiale", () => {
    const names = weekdayShortNames("fr-FR")
    expect(names).toHaveLength(7)
    for (const name of names) {
      expect(name.endsWith(".")).toBe(false)
      expect(name[0]).toBe(name[0]!.toUpperCase())
    }
  })
})

describe("monthShortNames", () => {
  it("rend les 12 mois dans la langue demandée", () => {
    const fr = monthShortNames("fr-FR")
    const en = monthShortNames("en-US")
    expect(fr).toHaveLength(12)
    expect(en).toEqual([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ])
    expect(fr[0]).toMatch(/^janv/i)
    expect(fr[11]).toMatch(/^déc/i)
  })
})

describe("monthYearLabel", () => {
  it("en-tête long dans la langue demandée", () => {
    expect(monthYearLabel("en-US", 2026, 0)).toBe("January 2026")
    expect(monthYearLabel("fr-FR", 2026, 0)).toContain("janvier 2026")
  })
})
