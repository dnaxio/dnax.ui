// Tests unitaires de l'analyse du prop `view` de QLayout (matrice 3×3).
import { describe, expect, it } from "bun:test"
import { DEFAULT_LAYOUT_VIEW, parseView } from "./layout"

describe("parseView", () => {
  it("applique la vue par défaut sans argument", () => {
    const v = parseView()

    expect(v.view).toBe(DEFAULT_LAYOUT_VIEW)
    expect(v.view).toBe("hHh LpR fFf")
    expect(v.error).toBeUndefined()
    // Header et footer pleine largeur, drawers dans la rangée du milieu
    expect(v.gridTemplateAreas).toBe('"h h h" "l p r" "f f f"')
  })

  it("déduit l'aire de chaque zone", () => {
    const v = parseView("hHh LpR fFf")

    expect(v.zones.header.area).toBe("h")
    expect(v.zones.footer.area).toBe("f")
    expect(v.zones.left.area).toBe("l")
    expect(v.zones.right.area).toBe("r")
    expect(v.zones.page.area).toBe("p")
    expect(v.zones.page.cells).toEqual([[1, 1]])
  })

  it("lit la casse comme « reste en place » (majuscule) ou « défile » (minuscule)", () => {
    const fixed = parseView("hHh LpR fFf")
    expect(fixed.zones.header.fixed).toBe(true)
    expect(fixed.zones.footer.fixed).toBe(true)
    expect(fixed.zones.left.fixed).toBe(true)
    expect(fixed.zones.right.fixed).toBe(true)

    const flowing = parseView("hhh lpR fff")
    expect(flowing.zones.header.fixed).toBe(false)
    expect(flowing.zones.footer.fixed).toBe(false)
    expect(flowing.zones.left.fixed).toBe(false)
    expect(flowing.zones.right.fixed).toBe(true) // une seule majuscule suffit
    expect(flowing.gridTemplateAreas).toBe('"h h h" "l p r" "f f f"')
  })

  it("fait démarrer le drawer gauche au-dessus du header (lhh)", () => {
    const v = parseView("lhh LpR fff")

    expect(v.gridTemplateAreas).toBe('"l h h" "l p r" "f f f"')
    expect(v.zones.left.cells).toEqual([
      [0, 0],
      [1, 0],
    ])
    expect(v.zones.header.cells).toEqual([
      [0, 1],
      [0, 2],
    ])
  })

  it("fait descendre le drawer droit jusqu'au footer (ffR)", () => {
    const v = parseView("hhr lpR ffR")

    expect(v.gridTemplateAreas).toBe('"h h r" "l p r" "f f r"')
    expect(v.zones.right.cells).toEqual([
      [0, 2],
      [1, 2],
      [2, 2],
    ])
    expect(v.zones.right.fixed).toBe(true)
  })

  it("accepte les cellules vides (.)", () => {
    const v = parseView("hHh .p. fFf")

    expect(v.gridTemplateAreas).toBe('"h h h" ". p ." "f f f"')
    expect(v.zones.left.cells).toEqual([])
    expect(v.zones.left.area).toBeUndefined()
    expect(v.zones.right.cells).toEqual([])
  })

  it("marque la page « en place » si son p est majuscule", () => {
    expect(parseView("hhh LPR fff").zones.page.fixed).toBe(true)
    expect(parseView("hhh LpR fff").zones.page.fixed).toBe(false)
  })

  it("rejette une chaîne de mauvaise longueur", () => {
    const v = parseView("hHh lpR")

    expect(v.view).toBe(DEFAULT_LAYOUT_VIEW)
    expect(v.error).toContain("3 groupes de 3 caractères")
  })

  it("rejette une lettre inconnue", () => {
    const v = parseView("hHh xpR fFf")

    expect(v.view).toBe(DEFAULT_LAYOUT_VIEW)
    expect(v.error).toContain('lettre "x" inconnue')
  })

  it("rejette une zone hors de sa rangée", () => {
    const v = parseView("fhf LpR fFf")

    expect(v.view).toBe(DEFAULT_LAYOUT_VIEW)
    expect(v.error).toContain("rangée 1")
  })

  it("exige une page dans la rangée du milieu", () => {
    const v = parseView("hHh lrr fFf")

    expect(v.view).toBe(DEFAULT_LAYOUT_VIEW)
    expect(v.error).toContain('au moins un "p"')
  })

  it("rejette une zone non rectangulaire", () => {
    // `l` en (0,0) et (2,0) sans (1,0) : grid-template-areas serait invalide
    const v = parseView("lhr plr lfr")

    expect(v.view).toBe(DEFAULT_LAYOUT_VIEW)
    expect(v.error).toContain('zone "left"')
  })

  it("retombe toujours sur une vue utilisable", () => {
    const v = parseView("n'importe quoi")

    expect(v.error).toBeDefined()
    expect(v.zones.page.cells).toEqual([[1, 1]])
    expect(v.gridTemplateAreas).toBe('"h h h" "l p r" "f f f"')
  })
})
