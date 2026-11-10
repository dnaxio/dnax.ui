// Fichiers joints — helpers **purs** partagés par `QFilePicker` et `QSpreadsheet`
// (type de cellule `attachment`). Aucun DOM : les règles `accept` sont exactement celles
// de l'attribut HTML (`image/*`, `application/pdf`, `.pdf`…) pour que le filtre du
// sélecteur et la validation programmatique disent la même chose.

/** Raison d'un rejet de sélection. */
export type FileRejectionReason = "type" | "size" | "count"

export interface FileRejection {
  file: File
  reason: FileRejectionReason
}

/** Ce dont les helpers ont besoin — un vrai `File` y satisfait. */
export interface FileDescriptor {
  name: string
  type: string
  size: number
}

const ARCHIVE_EXT = /\.(zip|rar|7z|tar|gz|bz2|xz|tgz)$/
const SPREADSHEET_EXT = /\.(xlsx|xls|csv|ods|tsv)$/
const CODE_EXT =
  /\.(json|js|mjs|cjs|ts|jsx|tsx|html?|xml|css|scss|sass|less|vue|py|java|c|cpp|h|hpp|sh|bash|yml|yaml|toml|ini|go|rs|php|rb|swift|kt)$/

/** Famille d'icône d'un fichier (le composant la mappe sur `icons.*`). */
export type FileIconKind =
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "spreadsheet"
  | "code"
  | "file"

export const fileIconKind = (file: Pick<FileDescriptor, "name" | "type">): FileIconKind => {
  const type = (file.type ?? "").toLowerCase()
  const name = (file.name ?? "").toLowerCase()
  if (type.startsWith("video/")) return "video"
  if (type.startsWith("audio/")) return "audio"
  if (ARCHIVE_EXT.test(name) || /zip|compressed/.test(type)) return "archive"
  if (SPREADSHEET_EXT.test(name) || type.includes("spreadsheet") || type.includes("excel")) {
    return "spreadsheet"
  }
  if (CODE_EXT.test(name)) return "code"
  if (type.startsWith("image/")) return "image"
  return "file"
}

/** Taille lisible : `o` / `Ko` / `Mo` / `Go`. */
export const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 o"
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} Go`
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} Mo`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${bytes} o`
}

/**
 * Le fichier correspond-il à `accept` ? Mêmes règles que l'attribut HTML : liste
 * séparée par des virgules, `type/*`, type MIME complet ou extension (`.pdf`).
 * `accept` vide/absent → tout passe.
 */
export const acceptsFile = (
  file: Pick<FileDescriptor, "name" | "type">,
  accept?: string,
): boolean => {
  const patterns = (accept ?? "")
    .split(",")
    .map((pattern) => pattern.trim().toLowerCase())
    .filter(Boolean)
  if (patterns.length === 0) return true

  const name = (file.name ?? "").toLowerCase()
  const type = (file.type ?? "").toLowerCase()

  return patterns.some((pattern) => {
    // `image/*`, `video/*`… (et `application/*` par généralisation)
    if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1))
    if (pattern.startsWith(".")) return name.endsWith(pattern)
    if (pattern.includes("/")) return type === pattern
    return false
  })
}

export interface FileSelectionOptions {
  /** Motif `accept` de la colonne (voir `acceptsFile`) */
  accept?: string
  /** Taille maximale par fichier, en octets (0/absent = illimité) */
  maxSize?: number
  /** Nombre maximum de fichiers au total (0/absent = illimité) */
  maxFiles?: number
  /** Fichiers déjà présents (réduit le quota restant) */
  current?: number
}

export interface FileSelection {
  accepted: File[]
  rejected: FileRejection[]
}

/**
 * Filtre une sélection : par type, par taille, puis par quota — dans cet ordre, pour que
 * le motif de rejet soit le plus précis possible. L'ordre des fichiers acceptés est celui
 * de `incoming`.
 */
export const selectFiles = (
  incoming: File[],
  options: FileSelectionOptions = {},
): FileSelection => {
  const accepted: File[] = []
  const rejected: FileRejection[] = []

  const valid: File[] = []
  for (const file of incoming) {
    if (options.maxSize && options.maxSize > 0 && file.size > options.maxSize) {
      rejected.push({ file, reason: "size" })
      continue
    }
    if (!acceptsFile(file, options.accept)) {
      rejected.push({ file, reason: "type" })
      continue
    }
    valid.push(file)
  }

  const quota = options.maxFiles && options.maxFiles > 0 ? options.maxFiles : Number.POSITIVE_INFINITY
  const remaining = Math.max(0, quota - Math.max(0, options.current ?? 0))
  for (const [index, file] of valid.entries()) {
    if (index < remaining) accepted.push(file)
    else rejected.push({ file, reason: "count" })
  }

  return { accepted, rejected }
}

// ─── Fichiers stockés dans une cellule (`attachment`) ───

/** Forme minimale d'un fichier stocké (ce qu'une cellule `attachment` contient). */
export interface AttachmentLike {
  id?: string
  name: string
  size?: number
  type?: string
  url?: string
}

/** L'entrée ressemble-t-elle à un fichier stocké ? (tolérance des données importées) */
export const isAttachment = (value: unknown): value is AttachmentLike =>
  !!value && typeof value === "object" && typeof (value as { name?: unknown }).name === "string"

/**
 * Valeur d'une cellule `attachment` normalisée en tableau : un fichier **seul** est accepté
 * (donnée posée à la main ou importée), tout le reste est ignoré.
 */
export const attachmentsOf = (value: unknown): AttachmentLike[] => {
  if (Array.isArray(value)) return value.filter(isAttachment)
  return isAttachment(value) ? [value] : []
}
