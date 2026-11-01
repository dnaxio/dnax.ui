// Auto-extension d'un textarea : le plafond `maxRows` doit être **respecté au pixel**
// (hauteur = lignes × line-height + paddings) et le défilement ne s'activer que
// lorsque le contenu dépasse — sinon un champ collé à son plafond clignote.
import { describe, expect, it } from "bun:test"
import {
  DEFAULT_LINE_HEIGHT_RATIO,
  textareaCap,
  textareaMetrics,
  textareaSizing,
} from "./textarea"

const metrics = { fontSize: 14, lineHeight: 20, paddingTop: 0, paddingBottom: 0 }

describe("textareaMetrics", () => {
  it("résout des valeurs px", () => {
    expect(
      textareaMetrics({
        fontSize: "14px",
        lineHeight: "20px",
        paddingTop: "8px",
        paddingBottom: "12px",
      }),
    ).toEqual({ fontSize: 14, lineHeight: 20, paddingTop: 8, paddingBottom: 12 })
  })

  it("replie `line-height: normal` sur fontSize × 1.4", () => {
    const m = textareaMetrics({ fontSize: "16px", lineHeight: "normal" })
    expect(m.lineHeight).toBeCloseTo(16 * DEFAULT_LINE_HEIGHT_RATIO)
  })

  it("replie les valeurs absentes ou invalides", () => {
    const m = textareaMetrics({})
    expect(m).toEqual({ fontSize: 14, lineHeight: 14 * DEFAULT_LINE_HEIGHT_RATIO, paddingTop: 0, paddingBottom: 0 })
  })

  it("ignore les paddings négatifs ou non numériques", () => {
    expect(textareaMetrics({ paddingTop: "-4px", paddingBottom: "auto" })).toEqual({
      fontSize: 14,
      lineHeight: 14 * DEFAULT_LINE_HEIGHT_RATIO,
      paddingTop: 0,
      paddingBottom: 0,
    })
  })
})

describe("textareaCap", () => {
  it("vaut lignes × line-height + paddings", () => {
    expect(textareaCap({ ...metrics, paddingTop: 10, paddingBottom: 6 }, 3)).toBe(76)
  })

  it("vaut Infinity sans plafond", () => {
    expect(textareaCap(metrics, 0)).toBe(Number.POSITIVE_INFINITY)
    expect(textareaCap(metrics, -2)).toBe(Number.POSITIVE_INFINITY)
  })
})

describe("textareaSizing", () => {
  it("prend la hauteur du contenu quand il tient sous le plafond", () => {
    expect(textareaSizing(metrics, 40, 5)).toEqual({ height: 40, overflowY: "hidden", capped: false })
  })

  it("plafonne et active le défilement au-delà de maxRows", () => {
    expect(textareaSizing(metrics, 300, 5)).toEqual({ height: 100, overflowY: "auto", capped: true })
  })

  it("ne plafonne pas quand maxRows vaut 0", () => {
    expect(textareaSizing(metrics, 300, 0)).toEqual({ height: 300, overflowY: "hidden", capped: false })
  })

  it("défile dès que le contenu dépasse, sans marge", () => {
    // 100 px pile = plafond : pas encore de défilement (évite le clignotement)
    expect(textareaSizing(metrics, 100, 5).overflowY).toBe("hidden")
    expect(textareaSizing(metrics, 101, 5).overflowY).toBe("auto")
  })

  it("normalise un scrollHeight invalide ou négatif", () => {
    expect(textareaSizing(metrics, -10, 5).height).toBe(0)
    expect(textareaSizing(metrics, Number.NaN, 5).height).toBe(0)
  })
})
