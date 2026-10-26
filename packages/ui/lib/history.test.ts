// Historique undo/redo — le point critique est la **réactivité** : des piles en tableau
// simple laissent `canUndo` figé à `false` (boutons inertes, Ctrl+Z sans effet).
import { describe, expect, it } from "bun:test"
import { effect, nextTick } from "vue"
import { createHistory } from "./history"

describe("createHistory", () => {
  it("canUndo / canRedo sont réactifs (piles remplacées, pas mutées)", async () => {
    const h = createHistory<string>(10)
    const seen: boolean[] = []
    effect(() => {
      seen.push(h.canUndo.value)
    })
    expect(seen).toEqual([false])

    h.push("a")
    await nextTick()
    expect(seen.at(-1)).toBe(true)

    h.undo("b")
    await nextTick()
    expect(h.canRedo.value).toBe(true)
    expect(h.canUndo.value).toBe(false)

    h.redo("c")
    await nextTick()
    expect(h.canUndo.value).toBe(true)
    expect(seen).toContain(true)
  })

  it("dépile dans le bon ordre et empile l'état courant dans la pile opposée", () => {
    const h = createHistory<number>()
    h.push(1)
    h.push(2)

    expect(h.undo(99)).toBe(2)
    expect(h.undo(98)).toBe(1)
    expect(h.undo(97)).toBeNull()
    expect(h.canUndo.value).toBe(false)
    expect(h.canRedo.value).toBe(true)

    expect(h.redo(50)).toBe(98)
    expect(h.redo(51)).toBe(99)
    expect(h.redo(52)).toBeNull()
    expect(h.canUndo.value).toBe(true)
  })

  it("une nouvelle action vide la pile redo", () => {
    const h = createHistory<number>()
    h.push(1)
    h.undo(2)
    expect(h.canRedo.value).toBe(true)

    h.push(3)
    expect(h.canRedo.value).toBe(false)
    expect(h.redo(4)).toBeNull()
  })

  it("borne la pile à `limit` (la plus ancienne entrée est oubliée)", () => {
    const h = createHistory<number>(2)
    h.push(1)
    h.push(2)
    h.push(3)
    expect(h.undoStack.value).toEqual([2, 3])
    expect(h.undo(0)).toBe(3)
    expect(h.undo(0)).toBe(2)
    expect(h.undo(0)).toBeNull()
  })

  it("clear vide les deux piles", () => {
    const h = createHistory<number>()
    h.push(1)
    h.undo(2)
    h.clear()
    expect(h.canUndo.value).toBe(false)
    expect(h.canRedo.value).toBe(false)
  })
})
