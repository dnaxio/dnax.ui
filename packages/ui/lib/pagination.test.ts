// Pagination distante : bornes, nombre de pages, plage globale des lignes.
// Les cas qui cassent en pratique : total qui rétrécit (page hors bornes), dernière page
// partielle, `pageSize` désactivé, total nul.
import { describe, expect, it } from "bun:test"
import { pageInfo } from "./pagination"

describe("pageInfo", () => {
  it("calcule la première page", () => {
    expect(pageInfo({ page: 1, pageSize: 400, total: 1200 })).toEqual({
      page: 1,
      pageCount: 3,
      offset: 0,
      from: 1,
      to: 400,
    })
  })

  it("décale la plage sur les pages suivantes", () => {
    expect(pageInfo({ page: 3, pageSize: 400, total: 1200 })).toEqual({
      page: 3,
      pageCount: 3,
      offset: 800,
      from: 801,
      to: 1200,
    })
  })

  it("gère une dernière page partielle", () => {
    expect(pageInfo({ page: 2, pageSize: 400, total: 500 })).toEqual({
      page: 2,
      pageCount: 2,
      offset: 400,
      from: 401,
      to: 500,
    })
  })

  it("tient compte des lignes réellement chargées", () => {
    // La page 2 n'a reçu que 80 lignes (chargement partiel) : la plage le reflète
    expect(pageInfo({ page: 2, pageSize: 400, total: 1200, loaded: 80 })).toMatchObject({
      from: 401,
      to: 480,
    })
  })

  it("borne une page trop haute ou trop basse", () => {
    expect(pageInfo({ page: 99, pageSize: 400, total: 1200 }).page).toBe(3)
    expect(pageInfo({ page: 0, pageSize: 400, total: 1200 }).page).toBe(1)
    expect(pageInfo({ page: -5, pageSize: 400, total: 1200 }).page).toBe(1)
    expect(pageInfo({ page: Number.NaN, pageSize: 400, total: 1200 }).page).toBe(1)
  })

  it("sans pagination : une seule page, tout est affiché", () => {
    expect(pageInfo({ page: 1, pageSize: 0, total: 250 })).toEqual({
      page: 1,
      pageCount: 1,
      offset: 0,
      from: 1,
      to: 250,
    })
  })

  it("total nul : from/to à 0", () => {
    expect(pageInfo({ page: 1, pageSize: 400, total: 0 })).toEqual({
      page: 1,
      pageCount: 1,
      offset: 0,
      from: 0,
      to: 0,
    })
  })

  it("ne dépasse jamais le total", () => {
    // `loaded` plus grand que le quota (données incohérentes) → plage bornée au total
    expect(pageInfo({ page: 1, pageSize: 400, total: 10, loaded: 400 }).to).toBe(10)
  })
})
