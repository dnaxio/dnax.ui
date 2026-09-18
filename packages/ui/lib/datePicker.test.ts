// Tests unitaires du placement du panneau ancré (mode `popover` de QDatePicker).
import { describe, expect, it } from "bun:test"
import {
  POPOVER_CARET_INSET,
  POPOVER_FALLBACK_WIDTH,
  POPOVER_GAP,
  POPOVER_VIEWPORT_MARGIN,
  placePopover,
} from "./datePicker"

const viewport = { width: 1280, height: 800 }

/** Champ de 320px de large, centré horizontalement */
const anchorAt = (top: number, left = 400, width = 320) => ({
  top,
  bottom: top + 40,
  left,
  width,
})

describe("placePopover", () => {
  it("ouvre sous le champ quand la place est suffisante", () => {
    const p = placePopover({ anchor: anchorAt(100), viewport })

    expect(p.direction).toBe("down")
    expect(p.top).toBe(140 + POPOVER_GAP)
    expect(p.bottom).toBeNull()
    // 800 - 140 - 8 = 652 px visibles sous le champ, moins l'écart
    expect(p.maxHeight).toBe(800 - 140 - POPOVER_VIEWPORT_MARGIN - POPOVER_GAP)
  })

  it("bascule au-dessus du champ quand le bas manque de place", () => {
    const p = placePopover({ anchor: anchorAt(700), viewport })

    expect(p.direction).toBe("up")
    expect(p.top).toBeNull()
    // Bord bas : distance entre le bas de la fenêtre et le haut du champ, plus l'écart
    expect(p.bottom).toBe(800 - 700 + POPOVER_GAP)
    expect(p.maxHeight).toBe(700 - POPOVER_VIEWPORT_MARGIN - POPOVER_GAP)
  })

  it("reste en dessous quand les deux côtés sont à égalité", () => {
    // 380px de chaque côté : `below >= above` tranche pour le bas
    const p = placePopover({ anchor: anchorAt(380), viewport })
    expect(p.direction).toBe("down")
  })

  it("recadre le panneau dans la fenêtre sur un champ collé à droite", () => {
    const p = placePopover({
      anchor: anchorAt(100, 1150, 320),
      viewport,
      panelWidth: 360,
    })

    // 1280 - 360 - 8 = 912 : le panneau ne dépasse pas le bord droit
    expect(p.left).toBe(912)
    // La flèche suit le centre du champ, ramenée à 16px du coin droit
    expect(p.caret).toBe(360 - POPOVER_CARET_INSET)
  })

  it("colle le panneau au bord gauche et suit le centre du champ", () => {
    const p = placePopover({
      anchor: anchorAt(100, 0, 200),
      viewport,
      panelWidth: 360,
    })

    expect(p.left).toBe(POPOVER_VIEWPORT_MARGIN)
    // Centre du champ (100) → 92px depuis le bord gauche du panneau (8)
    expect(p.caret).toBe(100 - POPOVER_VIEWPORT_MARGIN)
  })

  it("ramène la flèche dans le panneau quand le champ sort par la gauche", () => {
    const p = placePopover({
      anchor: anchorAt(100, -500, 200),
      viewport,
      panelWidth: 360,
    })

    expect(p.left).toBe(POPOVER_VIEWPORT_MARGIN)
    expect(p.caret).toBe(POPOVER_CARET_INSET)
  })

  it("utilise la largeur de repli tant que le panneau n'est pas mesuré", () => {
    const p = placePopover({ anchor: anchorAt(100), viewport })
    expect(p.left + POPOVER_FALLBACK_WIDTH).toBeLessThanOrEqual(
      viewport.width - POPOVER_VIEWPORT_MARGIN,
    )
  })

  it("borne la largeur à la fenêtre et garde la flèche dans le panneau", () => {
    const p = placePopover({
      anchor: anchorAt(100, 0, 300),
      viewport: { width: 320, height: 800 },
      panelWidth: 520,
    })

    // Largeur utile = 320 - 2 × 8 = 304
    expect(p.left).toBe(POPOVER_VIEWPORT_MARGIN)
    expect(p.caret).toBeGreaterThanOrEqual(POPOVER_CARET_INSET)
    expect(p.caret).toBeLessThanOrEqual(304 - POPOVER_CARET_INSET)
  })

  it("réduit l'écart et borne la hauteur quand la place manque en bas", () => {
    // Fenêtre courte : 202px sous le champ (< 220px visés), plus qu'au-dessus
    const p = placePopover({ anchor: anchorAt(170), viewport: { width: 1280, height: 420 }, gap: 24 })

    expect(p.direction).toBe("down")
    // L'écart demandé (24px) est rogné : plus de place au panneau
    expect(p.top).toBe(210)
    expect(p.maxHeight).toBe(420 - 210 - POPOVER_VIEWPORT_MARGIN)
  })

  it("ne renvoie jamais une hauteur négative", () => {
    // Fenêtre plus courte que les marges : tout est dégénéré mais reste utilisable
    const p = placePopover({ anchor: anchorAt(0), viewport: { width: 8, height: 0 } })

    expect(p.maxHeight).toBeGreaterThanOrEqual(0)
    expect(p.left).toBe(POPOVER_VIEWPORT_MARGIN)
    expect(p.caret).toBeGreaterThanOrEqual(POPOVER_CARET_INSET)
  })
})
