// Tests unitaires des variables CSS du thème (`themeVars`) — partagées par
// QConfigProvider et les providers d'overlays téléportés.
import { describe, expect, it } from "bun:test"
import { themeVars } from "./themeVars"

describe("themeVars", () => {
  it("expose les couleurs en `--token` + `--token-foreground`", () => {
    const style = themeVars({ colors: { primary: "#1976d2" } })
    expect(style["--primary"]).toBe("#1976d2")
    // foreground lisible calculé (clair sur fond sombre)
    expect(style["--primary-foreground"]).toBe("#ffffff")
  })

  it("traduit `componentProps.default.radius` en `--q-radius`", () => {
    expect(themeVars({ componentProps: { default: { radius: "md" } } })["--q-radius"]).toBe("8px")
  })

  it("ignore un `default.radius` non-échelle (`true` = forme native)", () => {
    expect(themeVars({ componentProps: { default: { radius: true } } })["--q-radius"]).toBeUndefined()
  })

  it("pose les `vars` libres, avec ou sans préfixe `--`", () => {
    const style = themeVars({ vars: { "--q-field-bg": "#eef7ee", "q-field-bg-filled": "red" } })
    expect(style["--q-field-bg"]).toBe("#eef7ee")
    expect(style["--q-field-bg-filled"]).toBe("red")
  })

  it("donne le dernier mot aux `vars` sur les tokens de `colors`", () => {
    const style = themeVars({ colors: { primary: "#111" }, vars: { "--primary": "#222" } })
    expect(style["--primary"]).toBe("#222")
  })

  it("ignore les valeurs vides", () => {
    const style = themeVars({ colors: { primary: "" }, vars: { "--x": "" } })
    expect(style["--primary"]).toBeUndefined()
    expect(style["--x"]).toBeUndefined()
  })

  it("renvoie un objet vide pour un thème vide", () => {
    expect(themeVars({})).toEqual({})
  })
})
