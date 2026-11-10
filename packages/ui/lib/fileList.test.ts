// Fichiers joints : règles d'`accept`, quota, icônes — testées sans navigateur ni DOM.
// Ces helpers sont la seule source de vérité (QFilePicker et QSpreadsheet `attachment`).
import { describe, expect, it } from "bun:test"
import {
  acceptsFile,
  attachmentsOf,
  fileIconKind,
  formatFileSize,
  selectFiles,
  type FileDescriptor,
} from "./fileList"

const file = (name: string, type = "", size = 1000): File =>
  new File([new Uint8Array(size)], name, { type })

const desc = (name: string, type = ""): FileDescriptor => ({ name, type, size: 0 })

describe("formatFileSize", () => {
  it("choisit l'unité lisible", () => {
    expect(formatFileSize(0)).toBe("0 o")
    expect(formatFileSize(512)).toBe("512 o")
    expect(formatFileSize(2048)).toBe("2 Ko")
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5 Mo")
    expect(formatFileSize(3 * 1024 * 1024 * 1024)).toBe("3.0 Go")
  })

  it("neutralise les valeurs invalides", () => {
    expect(formatFileSize(Number.NaN)).toBe("0 o")
    expect(formatFileSize(-12)).toBe("0 o")
  })
})

describe("acceptsFile", () => {
  it("accepte tout sans motif", () => {
    expect(acceptsFile(desc("a.bin"), "")).toBe(true)
    expect(acceptsFile(desc("a.bin"), undefined)).toBe(true)
    expect(acceptsFile(desc("a.bin"), "  ,  ")).toBe(true)
  })

  it("gère les jokers de type MIME", () => {
    expect(acceptsFile(desc("photo.png", "image/png"), "image/*")).toBe(true)
    expect(acceptsFile(desc("doc.pdf", "application/pdf"), "image/*")).toBe(false)
    expect(acceptsFile(desc("clip.mp4", "video/mp4"), "image/*, video/*")).toBe(true)
  })

  it("gère les extensions et les types complets", () => {
    expect(acceptsFile(desc("rapport.PDF"), ".pdf")).toBe(true)
    expect(acceptsFile(desc("rapport.txt"), ".pdf")).toBe(false)
    expect(acceptsFile(desc("a.bin", "Application/PDF"), "application/pdf")).toBe(true)
  })

  it("ignore un motif invalide (ni MIME, ni extension)", () => {
    expect(acceptsFile(desc("a.png", "image/png"), "image")).toBe(false)
  })
})

describe("fileIconKind", () => {
  it("classe par type MIME puis par extension", () => {
    expect(fileIconKind(desc("a.png", "image/png"))).toBe("image")
    expect(fileIconKind(desc("a.mp4", "video/mp4"))).toBe("video")
    expect(fileIconKind(desc("a.mp3", "audio/mpeg"))).toBe("audio")
    expect(fileIconKind(desc("a.zip", "application/zip"))).toBe("archive")
    expect(fileIconKind(desc("a.xlsx"))).toBe("spreadsheet")
    expect(fileIconKind(desc("a.ts"))).toBe("code")
    expect(fileIconKind(desc("a.bin"))).toBe("file")
  })
})

describe("selectFiles", () => {
  it("rejette par type, taille puis quota (dans cet ordre)", () => {
    const result = selectFiles(
      [file("a.png", "image/png"), file("b.pdf", "application/pdf"), file("c.png", "image/png", 5000)],
      { accept: "image/*", maxSize: 2000, maxFiles: 1 },
    )
    expect(result.accepted.map((f) => f.name)).toEqual(["a.png"])
    expect(result.rejected.map((r) => r.reason)).toEqual(["type", "size"])
  })

  it("tient compte des fichiers déjà présents dans le quota", () => {
    const result = selectFiles([file("a.png"), file("b.png")], { maxFiles: 3, current: 2 })
    expect(result.accepted.map((f) => f.name)).toEqual(["a.png"])
    expect(result.rejected.map((r) => r.reason)).toEqual(["count"])
  })

  it("sans quota, tout passe (ordre conservé)", () => {
    const result = selectFiles([file("a.png"), file("b.png")])
    expect(result.accepted.map((f) => f.name)).toEqual(["a.png", "b.png"])
    expect(result.rejected).toEqual([])
  })

  it("quota déjà atteint → tout est rejeté en `count`", () => {
    const result = selectFiles([file("a.png")], { maxFiles: 2, current: 2 })
    expect(result.accepted).toEqual([])
    expect(result.rejected.map((r) => r.reason)).toEqual(["count"])
  })
})

describe("attachmentsOf", () => {
  it("normalise un tableau et ignore les entrées invalides", () => {
    const list = attachmentsOf([
      { id: "a", name: "a.png", size: 1, type: "image/png" },
      { body: "pas un fichier" },
      null,
      { name: "b.pdf" },
    ])
    expect(list.map((att) => att.name)).toEqual(["a.png", "b.pdf"])
  })

  it("accepte un fichier seul (donnée posée à la main)", () => {
    expect(attachmentsOf({ name: "seul.pdf" }).map((att) => att.name)).toEqual(["seul.pdf"])
  })

  it("renvoie un tableau vide pour le vide ou une chaîne", () => {
    expect(attachmentsOf(null)).toEqual([])
    expect(attachmentsOf("")).toEqual([])
    expect(attachmentsOf([])).toEqual([])
    expect(attachmentsOf("a.png")).toEqual([])
  })
})
