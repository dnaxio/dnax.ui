// Tests unitaires de la résolution du radius (échelle + style CSS).
import { describe, expect, it } from "bun:test"
import { RADIUS_VALUES, radiusStyle, radiusValue } from "./useComponentProps"

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
})
