// Tests unitaires de l'encodage QR et du tracé SVG (`<q-qrcode>`).
import { describe, expect, it } from "bun:test"
import {
  encodeQr,
  isDark,
  qrPath,
  qrSize,
  qrSvg,
  qrTotalSize,
  qrViewBox,
  svgEscape,
  type QrMatrix,
} from "./qrcode"

/** Matrice carrée décrite par des lignes de `.` (clair) et `#` (sombre) */
const matrixOf = (rows: string[]): QrMatrix => ({
  size: rows.length,
  data: rows.flatMap((row) => [...row].map((char) => (char === "#" ? 1 : 0))),
})

describe("encodeQr", () => {
  it("encode une valeur en matrice carrée (4 × version + 17)", () => {
    const matrix = encodeQr("https://dnax.io")
    expect(matrix).toBeDefined()
    expect(matrix!.size % 4).toBe(1)
    expect(matrix!.size).toBeGreaterThanOrEqual(21)
    expect(matrix!.data.length).toBe(matrix!.size * matrix!.size)
  })

  it("encode en QR (finders de coin : 7 modules sombres puis un clair)", () => {
    const matrix = encodeQr("hello")
    // Coins haut-gauche, haut-droit et bas-gauche : 7 sombres, puis 1 clair
    for (let i = 0; i < 7; i++) {
      expect(isDark(matrix!, i, 0)).toBe(true)
      expect(isDark(matrix!, 0, i)).toBe(true)
    }
    expect(isDark(matrix!, 7, 0)).toBe(false)
  })

  it("grandit avec la charge utile et le niveau de correction", () => {
    const small = encodeQr("hi", { ecc: "L" })!
    const long = encodeQr("x".repeat(300), { ecc: "H" })!
    expect(long.size).toBeGreaterThan(small.size)
  })

  it("rend `undefined` sur une valeur vide ou trop longue (jamais d'exception)", () => {
    expect(encodeQr("")).toBeUndefined()
    expect(encodeQr("y".repeat(5000), { ecc: "H" })).toBeUndefined()
  })
})

describe("qrPath / qrViewBox / qrTotalSize", () => {
  const matrix = matrixOf([".#..", "###.", "..#.", ".##."])

  it("trace une sous-forme par plage horizontale", () => {
    expect(qrPath(matrix)).toBe("M1 0h1v1h-1z" + "M0 1h3v1h-3z" + "M2 2h1v1h-1z" + "M1 3h2v1h-2z")
  })

  it("décale le tracé de la zone de silence", () => {
    expect(qrPath(matrix, 2)).toBe("M3 2h1v1h-1z" + "M2 3h3v1h-3z" + "M4 4h1v1h-1z" + "M3 5h2v1h-2z")
  })

  it("garde une matrice vide silencieuse", () => {
    expect(qrPath(matrixOf(["....", "...."]))).toBe("")
  })

  it("expose la taille totale et le viewBox", () => {
    expect(qrTotalSize(matrix)).toBe(4)
    expect(qrTotalSize(matrix, 4)).toBe(12)
    expect(qrViewBox(matrix, 4)).toBe("0 0 12 12")
  })

  it("lit les modules hors matrice comme clairs", () => {
    expect(isDark(matrix, -1, 0)).toBe(false)
    expect(isDark(matrix, 0, 99)).toBe(false)
  })
})

describe("qrSize / svgEscape / qrSvg", () => {
  const matrix = matrixOf([".#", "#."])

  it("normalise la taille CSS", () => {
    expect(qrSize(200)).toBe("200px")
    expect(qrSize("12rem")).toBe("12rem")
    expect(qrSize(undefined)).toBe("160px")
    expect(qrSize(0)).toBe("160px")
  })

  it("échappe ce qui part dans un SVG sérialisé", () => {
    expect(svgEscape(`<b title="x">&`)).toBe("&lt;b title=&quot;x&quot;&gt;&amp;")
  })

  it("sérialise un SVG complet (fond, tracé, étiquette)", () => {
    const svg = qrSvg(matrix, { margin: 1, color: "#111", background: "#fff", label: "QR" })

    expect(svg).toContain('viewBox="0 0 4 4"')
    expect(svg).toContain('<rect width="4" height="4" fill="#fff"/>')
    expect(svg).toContain('d="M2 1h1v1h-1zM1 2h1v1h-1z"')
    expect(svg).toContain('fill="#111"')
    expect(svg).toContain('aria-label="QR"')
    expect(svg).toContain('role="img"')
  })
})
