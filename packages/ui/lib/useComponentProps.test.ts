// Tests unitaires de la résolution du radius (échelle + style CSS).
//
// Ajout (2026-11-01) : `radius: true` était documenté « true = md » sur QCard / QDialog /
// QSyntax / QTable sans poser le moindre style → surface carrée, silencieusement.
// `radiusStyleNative` comble ce trou ; `radiusStyle` reste volontairement inchangé
// (`true` → undefined) pour ne pas injecter un `--q-radius` global qui fuirait aux
// enfants des champs/boutons (cf. `.memory/decisions.md`).
import { describe, expect, it } from "bun:test"
import {
  RADIUS_VALUES,
  isRadiusScale,
  radiusStyle,
  radiusStyleNative,
  radiusValue,
} from "./useComponentProps"

describe("radiusValue", () => {
  it("traduit chaque barreau de l'échelle", () => {
    expect(radiusValue("none")).toBe("0px")
    expect(radiusValue("xs")).toBe("2px")
    expect(radiusValue("sm")).toBe("4px")
    expect(radiusValue("md")).toBe("8px")
    expect(radiusValue("lg")).toBe("16px")
  })

  it("ne traduit ni la forme native (true) ni l'absence de valeur", () => {
    expect(radiusValue(true)).toBeUndefined()
    expect(radiusValue(false)).toBeUndefined()
    expect(radiusValue(undefined)).toBeUndefined()
  })

  it("reste aligné sur RADIUS_VALUES", () => {
    for (const [scale, value] of Object.entries(RADIUS_VALUES)) {
      expect(radiusValue(scale as keyof typeof RADIUS_VALUES)).toBe(value)
    }
  })
})

describe("radiusStyle", () => {
  it("pose --q-radius pour une valeur d'échelle", () => {
    expect(radiusStyle("lg")).toEqual({ "--q-radius": "16px" })
  })

  it("ne pose rien pour true (forme native) ou undefined", () => {
    expect(radiusStyle(true)).toBeUndefined()
    expect(radiusStyle(undefined)).toBeUndefined()
  })

  it("gère aussi none (carre) et l'échelle basse", () => {
    expect(radiusStyle("none")).toEqual({ "--q-radius": "0px" })
    expect(radiusStyle("sm")).toEqual({ "--q-radius": "4px" })
  })
})

describe("isRadiusScale", () => {
  it("reconnaît les échelles et rejette le reste", () => {
    expect(isRadiusScale("md")).toBe(true)
    expect(isRadiusScale("none")).toBe(true)
    expect(isRadiusScale("12px")).toBe(false)
    expect(isRadiusScale(true)).toBe(false)
    expect(isRadiusScale(undefined)).toBe(false)
  })
})

describe("RADIUS_VALUES", () => {
  it("couvre toute l'échelle, croissante", () => {
    expect(Object.keys(RADIUS_VALUES)).toEqual(["none", "xs", "sm", "md", "lg"])
    expect(RADIUS_VALUES.none).toBe("0px")
    expect(RADIUS_VALUES.lg).toBe("16px")
  })
})

describe("radiusStyleNative (composants « true = échelle »)", () => {
  it("convertit `true` en md par défaut", () => {
    expect(radiusStyleNative(true)).toEqual({ "--q-radius": "8px" })
  })

  it("accepte une autre échelle par défaut", () => {
    expect(radiusStyleNative(true, "lg")).toEqual({ "--q-radius": "16px" })
  })

  it("transmet une échelle telle quelle", () => {
    expect(radiusStyleNative("sm")).toEqual({ "--q-radius": "4px" })
    expect(radiusStyleNative("none")).toEqual({ "--q-radius": "0px" })
  })

  it("laisse undefined inchangé", () => {
    expect(radiusStyleNative(undefined)).toBeUndefined()
  })
})
