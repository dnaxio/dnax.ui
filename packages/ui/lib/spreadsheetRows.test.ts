// Tests unitaires des **limites de lignes** (`lib/spreadsheetRows.ts`) : `maxRows` / `minRows`.
import { describe, expect, it } from "bun:test"
import { canAddRows, canRemoveRows, clampRows, removalsAllowed, rowRoom } from "./spreadsheetRows"

describe("rowRoom / canAddRows", () => {
  it("sans max : illimité", () => {
    expect(rowRoom(3, undefined)).toBe(Number.POSITIVE_INFINITY)
    expect(canAddRows(3, 99, undefined)).toBe(true)
  })

  it("borne par le max", () => {
    expect(rowRoom(0, 1)).toBe(1)
    expect(rowRoom(1, 1)).toBe(0)
    expect(rowRoom(5, 1)).toBe(0)
    expect(canAddRows(0, 1, 1)).toBe(true)
    expect(canAddRows(1, 1, 1)).toBe(false)
    expect(canAddRows(0, 2, 1)).toBe(false)
  })

  it("ignore un max non fini (Infinity / NaN)", () => {
    expect(rowRoom(4, Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY)
    expect(rowRoom(4, Number.NaN)).toBe(Number.POSITIVE_INFINITY)
  })
})

describe("removalsAllowed / canRemoveRows", () => {
  it("sans min : on peut tout retirer", () => {
    expect(removalsAllowed(3, undefined)).toBe(3)
    expect(canRemoveRows(3, 3, undefined)).toBe(true)
  })

  it("plancher par le min", () => {
    expect(removalsAllowed(3, 1)).toBe(2)
    expect(removalsAllowed(1, 1)).toBe(0)
    expect(removalsAllowed(0, 1)).toBe(0)
    expect(canRemoveRows(3, 2, 1)).toBe(true)
    expect(canRemoveRows(3, 3, 1)).toBe(false)
  })
})

describe("clampRows", () => {
  it("tronque au-delà du max", () => {
    expect(clampRows([1, 2, 3], 2)).toEqual([1, 2])
    expect(clampRows([1], 5)).toEqual([1])
  })

  it("renvoie la **même** référence si rien à couper (ou sans max)", () => {
    const rows = [1, 2]
    expect(clampRows(rows, 2)).toBe(rows)
    expect(clampRows(rows, 5)).toBe(rows)
    expect(clampRows(rows, undefined)).toBe(rows)
  })
})
