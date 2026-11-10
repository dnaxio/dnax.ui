<script setup lang="ts">
// Live demos for the Spreadsheet page (per-page state).
// One component per page, the `demo` prop selects which demo to render.
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue"

const props = defineProps<{
  /** Identifier of the demo to render */
  demo:
    | "inline"
    | "people"
    | "types"
    | "time"
    | "choice"
    | "rawOptions"
    | "locked"
    | "prefill"
    | "prefillFormula"
    | "rowLimit"
    | "changes"
    | "formulas"
    | "errors"
    | "autocalc"
    | "power"
    | "filter"
    | "freeze"
    | "sheets"
    | "export"
    | "findImport"
    | "layout"
    | "events"
    | "big"
    | "variants"
    | "attachment"
    | "slots"
    | "pagination"
    | "loading"
    | "size"
}>()

// — Demos —
const peopleColumns = [
  { name: "firstName", label: "First name", width: 110 },
  { name: "lastName", label: "Last name", width: 120 },
  {
    name: "department",
    label: "Department",
    type: "select" as const,
    chip: true,
    width: 150,
    options: [
      { value: "management", label: "Management", color: "#fee2e2" },
      { value: "sales", label: "Sales", color: "#dbeafe" },
      { value: "operations", label: "Operations", color: "#dcfce7" },
      { value: "it", label: "IT", color: "#ede9fe" },
      { value: "finance", label: "Finance", color: "#fef9c3" },
    ],
  },
  { name: "active", label: "Active", type: "boolean" as const, width: 90 },
]

const peopleRows = ref([
  { firstName: "John", lastName: "Doe", department: "management", active: true },
  { firstName: "Jane", lastName: "Smith", department: "sales", active: true },
  { firstName: "Bob", lastName: "Johnson", department: "operations", active: false },
  { firstName: "Alice", lastName: "Brown", department: "it", active: true },
  { firstName: "Charlie", lastName: "Davis", department: "finance", active: false },
  { firstName: "Emma", lastName: "Wilson", department: "sales", active: true },
  { firstName: "David", lastName: "Lee", department: "operations", active: true },
  { firstName: "Grace", lastName: "Martin", department: "management", active: false },
  { firstName: "Hank", lastName: "Garcia", department: "it", active: true },
  { firstName: "Ivy", lastName: "Clark", department: "finance", active: true },
  { firstName: "Jack", lastName: "Rodriguez", department: "sales", active: false },
])

const columnsSummary = computed(() => peopleColumns)

// — Inline editing example —
const inlineColumns = [
  { name: "firstName", label: "First name", width: 130, editable: true },
  { name: "lastName", label: "Last name", width: 140, editable: true },
  { name: "age", label: "Age", type: "integer" as const, width: 90, editable: true },
]
// `any[]` : les lignes reçoivent une `_key` injectée par le composant (cf. `_key`)
const inlineRows = ref<any[]>([
  { firstName: "Ada", lastName: "Lovelace", age: 36 },
  { firstName: "Grace", lastName: "Hopper", age: 85 },
  { firstName: "Alan", lastName: "Turing", age: 41 },
])
const inlineLog = ref("")
const onInlineChange = (e: any) => {
  inlineLog.value =
    e.column + " (row " + (e.row + 1) + "): " + JSON.stringify(e.oldValue) + " → " + JSON.stringify(e.newValue)
}

// — Cell types demo —
const typesColumns = [
  { name: "product", label: "Product", width: 150 },
  {
    name: "category",
    label: "Category",
    type: "select" as const,
    chip: true,
    width: 140,
    options: [
      { value: "tea", label: "Tea", color: "positive" },
      { value: "beer", label: "Beer", color: "warning" },
      { value: "condiment", label: "Condiment", color: "info" },
      { value: "seafood", label: "Seafood", color: "accent" },
    ],
  },
  {
    name: "price",
    label: "Price",
    type: "number" as const,
    width: 110,
    format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)),
  },
  {
    name: "stock",
    label: "Stock",
    type: "integer" as const,
    width: 90,
  },
  {
    // Labels NUMÉRIQUES : le brouillon d'édition doit rester une string
    // (sinon `.trim()` casse — cf. correctif `draft` / `fxSource` dans QSpreadsheet).
    name: "rating",
    label: "Rating",
    type: "select" as const,
    width: 100,
    options: [
      { value: 1, label: 1 },
      { value: 2, label: 2 },
      { value: 3, label: 3 },
      { value: 4, label: 4 },
      { value: 5, label: 5 },
    ],
  },
  { name: "inStock", label: "In stock", type: "boolean" as const, width: 90 },
  {
    name: "email",
    label: "Email",
    type: "email" as const,
    width: 220,
  },
  {
    name: "website",
    label: "Website",
    type: "url" as const,
    width: 210,
  },
  {
    name: "bestBefore",
    label: "Best before",
    type: "date" as const,
    width: 150,
  },
  {
    name: "opensAt",
    label: "Opens at",
    type: "time" as const,
    width: 120,
  },
  {
    name: "lastCheck",
    label: "Last check",
    type: "datetime" as const,
    width: 170,
    format: (v: any) =>
      v == null || v === ""
        ? ""
        : new Date(v).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          }),
  },
]

const typesRows = ref([
  { product: "Chai", category: "tea", price: 18, stock: 39, rating: 4, inStock: true, email: "hello@dnax.dev", website: "https://dnax.dev", bestBefore: "2026-12-31", opensAt: "09:00", lastCheck: "2026-09-07T09:30" },
  { product: "Chang", category: "beer", price: 19, stock: 17, rating: 3, inStock: true, email: "beer@dnax.dev", website: "https://example.com", bestBefore: "2026-09-30", opensAt: "09:30", lastCheck: "2026-09-06T14:05" },
  { product: "Aniseed Syrup", category: "condiment", price: 10, stock: 13, rating: 5, inStock: false, email: "sales@dnax.dev", website: "https://example.org", bestBefore: "2027-06-30", opensAt: "10:00", lastCheck: "2026-09-01T08:45" },
  { product: "Ikura", category: "seafood", price: 31, stock: 0, rating: 2, inStock: false, email: "fish@dnax.dev", website: "https://example.net", bestBefore: "2026-11-15", opensAt: "08:15", lastCheck: "2026-08-28T16:20" },
  { product: "Mishi Kobe Niku", category: "seafood", price: 97, stock: 29, rating: 5, inStock: true, email: "mishi@dnax.dev", website: "https://dnax.dev/blog", bestBefore: "2026-08-20", opensAt: "12:45", lastCheck: "2026-08-20T11:10" },
])

// — Time demo: `time` columns (native hour picker), hour series on autofill —
const timeColumns = [
  { name: "task", label: "Task", width: 190 },
  { name: "day", label: "Day", type: "date" as const, width: 150 },
  { name: "start", label: "Starts", type: "time" as const, width: 110 },
  { name: "end", label: "Ends", type: "time" as const, width: 110 },
]
const timeRows = ref([
  { task: "Stand-up", day: "2026-09-07", start: "09:00", end: "09:15" },
  { task: "Design review", day: "2026-09-07", start: "09:30", end: "10:30" },
  { task: "Sprint planning", day: "2026-09-07", start: "11:00", end: "12:00" },
  { task: "Lunch", day: "2026-09-07", start: "12:30", end: "13:30" },
  { task: "", day: "2026-09-07", start: null, end: null },
  { task: "", day: "2026-09-07", start: null, end: null },
])

// — Attachment demo : fichiers joints (`accept`, `multiple`, `maxFiles`) —
const attachmentColumns = [
  {
    name: "shots",
    label: "Screenshots",
    type: "attachment" as const,
    accept: "image/*",
    multiple: true,
    maxFiles: 3,
    width: 260,
  },
  {
    name: "contract",
    label: "Contract",
    type: "attachment" as const,
    accept: ".pdf,.docx",
    width: 210,
  },
]
const attachmentRows = ref([
  {
    shots: [
      { id: "shot-1", name: "login.png", size: 24_576, type: "image/png" },
      { id: "shot-2", name: "dashboard.png", size: 61_440, type: "image/png" },
    ],
    contract: { id: "doc-1", name: "nda-2026.pdf", size: 184_320, type: "application/pdf" },
  },
  { shots: [], contract: null },
  { shots: [], contract: null },
])
const lastFiles = ref("")
const lastClick = ref("")

const onAttach = (payload: {
  files: File[]
  attachments: { name: string }[]
  rejected: { file: File; reason: string }[]
}) => {
  if (payload.rejected.length) {
    lastFiles.value = `${payload.rejected.length} rejected (${payload.rejected.map((r) => r.reason).join(", ")})`
    return
  }
  lastFiles.value =
    payload.files.map((file) => file.name).join(", ") ||
    payload.attachments.map((att) => att.name).join(", ")
}

// Clic sur une puce : c'est l'app qui ouvre l'aperçu (ici, on journalise)
const onAttachClick = (payload: {
  row: number
  column: string
  attachment: { name: string }
  rowData: Record<string, any>
}) => {
  lastClick.value = `${payload.attachment.name} → ${payload.column} (row ${payload.row + 1})`
}

// — Slots demo : cellule et en-tête personnalisés (`#cell-<nom>` / `#head-<nom>`) —
const slotColumns = [
  { name: "task", label: "Task", width: 200 },
  { name: "status", label: "Status", width: 150 },
  { name: "progress", label: "Progress", type: "number" as const, width: 150 },
]
const slotRows = ref([
  { task: "Design tokens", status: "done", progress: 100 },
  { task: "Spreadsheet", status: "doing", progress: 65 },
  { task: "Documentation", status: "todo", progress: 10 },
])
const statusLabel: Record<string, string> = { done: "Done", doing: "In progress", todo: "To do" }

// — Pagination demo : 2 400 lignes « côté serveur », 50 par page —
const allClients = Array.from({ length: 2400 }, (_, i) => ({
  id: i + 1,
  client: `Client ${String(i + 1).padStart(4, "0")}`,
  country: ["FR", "US", "DE", "SN", "CA"][i % 5],
  amount: Math.round((((i * 37) % 900) + 100) * 100) / 100,
}))
const PAGINATION_SIZE = 50
const paginationColumns = [
  { name: "id", label: "ID", type: "number" as const, width: 90 },
  { name: "client", label: "Client", width: 190 },
  { name: "country", label: "Country", width: 110 },
  { name: "amount", label: "Amount", type: "number" as const, width: 140 },
]
const paginatedPage = ref(1)
const paginatedRows = ref(allClients.slice(0, PAGINATION_SIZE))
const paginationLog = ref("")
const paginationLoading = ref(false)

/** Pagination **distante** : on ne remplace que la page courante (ici, API simulée) */
const onPageChange = (payload: { page: number; offset: number; pageSize: number; totalRows: number }) => {
  paginationLoading.value = true
  paginationLog.value = `loading page ${payload.page}…`
  setTimeout(() => {
    paginatedRows.value = allClients.slice(payload.offset, payload.offset + payload.pageSize)
    paginationLoading.value = false
    const last = payload.offset + paginatedRows.value.length
    paginationLog.value = `page ${payload.page} → rows ${payload.offset + 1}–${last} of ${payload.totalRows}`
  }, 450)
}

// — Loading demo : barre indéterminée en haut + voile (prop `loading`) —
const loadingColumns = [
  { name: "order", label: "Order", width: 120 },
  { name: "client", label: "Client", width: 170 },
  { name: "amount", label: "Amount", type: "number" as const, width: 120 },
]
const loadingRows = ref([
  { order: "SO-1042", client: "Acme", amount: 1250 },
  { order: "SO-1043", client: "Globex", amount: 890 },
  { order: "SO-1044", client: "Initech", amount: 2140 },
])
const loadingDemo = ref(false)
const loadingLog = ref("")
let loadingTimer: ReturnType<typeof setTimeout> | undefined

/** Simule un rechargement : `loading` pendant ~900 ms, puis nouvelles données */
const reloadDemo = () => {
  if (loadingDemo.value) return
  loadingDemo.value = true
  loadingLog.value = "loading…"
  loadingTimer = setTimeout(() => {
    loadingRows.value = loadingRows.value.map((r) => ({ ...r, amount: r.amount + 10 }))
    loadingDemo.value = false
    loadingLog.value = "loaded — amounts +10"
  }, 900)
}
onUnmounted(() => clearTimeout(loadingTimer))

// — Size demo : `sizeCell` (presets + valeur en px) —
const sizeColumns = [
  { name: "task", label: "Task", width: 150 },
  { name: "hours", label: "Hours", type: "number" as const, width: 80 },
]
const sizeRows = ref([
  { task: "Design tokens", hours: 12 },
  { task: "Grid engine", hours: 34 },
])
const sizePresets = [
  { value: "sm" as const, label: "sm — rows 28px" },
  { value: "md" as const, label: "md — rows 32px (défaut)" },
  { value: "lg" as const, label: "lg — rows 40px" },
  { value: 66, label: "66 — hauteur en px" },
]

// — Choice demo : choix unique (`select`) vs choix multiples (`multiselect`) —
const choiceColumns = [
  { name: "task", label: "Task", width: 180 },
  {
    name: "priority",
    label: "Priority",
    type: "select" as const,
    chip: true,
    width: 140,
    options: [
      { value: "low", label: "Low", color: "#dcfce7" },
      { value: "medium", label: "Medium", color: "#fef9c3" },
      { value: "high", label: "High", color: "#fee2e2" },
    ],
  },
  {
    name: "tags",
    label: "Tags (chip)",
    type: "multiselect" as const,
    chip: true,
    width: 250,
    options: [
      { value: "design", label: "Design", color: "#ede9fe" },
      { value: "frontend", label: "Frontend", color: "#dbeafe" },
      { value: "backend", label: "Backend", color: "#dcfce7" },
      { value: "docs", label: "Docs", color: "#f1f5f9" },
      { value: "urgent", label: "Urgent", color: "#fee2e2" },
    ],
  },
  {
    name: "reviewers",
    label: "Reviewers (labels)",
    type: "multiselect" as const,
    width: 210,
    options: [
      { value: "ada", label: "Ada" },
      { value: "grace", label: "Grace" },
      { value: "alan", label: "Alan" },
      { value: "edsger", label: "Edsger" },
    ],
  },
]

const choiceRows = ref([
  { task: "Landing hero", priority: "high", tags: ["design", "frontend"], reviewers: ["ada", "grace"] },
  { task: "Checkout API", priority: "medium", tags: ["backend"], reviewers: ["alan"] },
  { task: "Docs rewrite", priority: "low", tags: ["docs", "design"], reviewers: [] },
  { task: "Hotfix payment", priority: "high", tags: ["backend", "urgent"], reviewers: ["ada", "edsger"] },
  { task: "Design tokens", priority: "medium", tags: ["design", "docs"], reviewers: ["grace"] },
])

// — Options brutes d'API mappées par `optionLabel` / `optionValue` —
// (forme `{ _id, name, value }` : le libellé affiché est `name`, la valeur stockée `_id`)
const rawUsers = [
  { _id: "u_8f3a", name: "Ada Lovelace", value: "ADA" },
  { _id: "u_1b2c", name: "Alan Turing", value: "ALAN" },
  { _id: "u_7d11", name: "Grace Hopper", value: "GRACE" },
  { _id: "u_5e90", name: "Edsger Dijkstra", value: "EDSGER" },
]
const rawColumns = [
  { name: "task", label: "Task", width: 200 },
  {
    name: "owner",
    label: "Owner",
    type: "select" as const,
    chip: true,
    width: 160,
    options: rawUsers,
    optionLabel: "name",
    optionValue: "_id",
  },
  {
    name: "reviewers",
    label: "Reviewers",
    type: "multiselect" as const,
    options: rawUsers,
    optionLabel: "name",
    optionValue: "_id",
  },
]
const rawRows = ref([
  { task: "Landing hero", owner: "u_8f3a", reviewers: ["u_1b2c", "u_7d11"] },
  { task: "Checkout API", owner: "u_1b2c", reviewers: ["u_5e90"] },
  { task: "Docs rewrite", owner: "u_7d11", reviewers: [] },
])

// — Verrouillage de cellules (`lockedRanges` + `cellReadonly`) —
const lockCols = [
  { name: "task", label: "Task", width: 220 },
  {
    name: "total",
    label: "Total",
    type: "number" as const,
    width: 110,
    // Verrouillée dès qu'elle porte une valeur — une cellule **vide** reste éditable.
    cellReadonly: (val: any) => val !== null && val !== undefined && val !== "",
  },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    width: 130,
    options: [
      { value: "todo", label: "To do" },
      { value: "doing", label: "Doing" },
      { value: "done", label: "Done" },
    ],
  },
]
const lockRows = ref([
  { task: "Row 0 is locked by lockedRanges — even the empty cells", total: "", status: "" },
  { task: "Editable row", total: "", status: "todo" },
  { task: "Locked by cellReadonly (has a value)", total: 128, status: "done" },
])
// Verrou d'une **ligne entière** — même ses cellules vides (`lockedRanges`)
const lockRanges = [{ row: 0 }]

// — Préremplissage (`prefill`) — appliqué **automatiquement** au chargement.
const prefillCols = [
  { name: "task", label: "Task", width: 210 },
  { name: "owner", label: "Owner", width: 120 },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    width: 130,
    options: [
      { value: "todo", label: "To do" },
      { value: "doing", label: "Doing" },
      { value: "done", label: "Done" },
    ],
  },
  { name: "total", label: "Total", type: "number" as const, width: 90 },
]
const prefillRows = ref([
  { task: "Existing row — empty cells get filled, filled ones are kept", owner: "", status: "", total: "" },
  { task: "Second row (owner + status already set)", owner: "Ada", status: "doing", total: "" },
])
// Zones : une colonne entière, une autre colonne, et une cellule précise.
const prefillFills = [
  { column: "status", value: "todo" },
  { column: "total", value: 0 },
  { row: 0, column: "owner", value: "—" },
]
// L'événement `prefill` signale l'application (auto ou manuelle) et le nombre de cellules.
const prefillLog = ref("")
const onPrefill = (e: { count: number; mode: string }) => {
  prefillLog.value = `${e.count} cell(s) · ${e.mode}`
}

// — Préremplissage par **formule dynamique** (`prefill` + `value` fonction) —
const pfCols = [
  { name: "task", label: "Task", width: 190 },
  { name: "effectif", label: "Effectif", type: "number" as const, width: 110 },
  { name: "total", label: "Total", type: "number" as const, width: 110 },
]
const pfRows = ref([
  { task: "Alpha", effectif: 10, total: "" },
  { task: "Bravo", effectif: 20, total: "" },
  { task: "", effectif: "", total: "" },
])
// `fx` = **formule** (prioritaire sur `value`) ; une fonction reçoit le contexte et peut
// bâtir une formule dont la plage dépend du document (`rowCount`).
const pfFills = [
  { row: 2, column: "task", value: "Σ Total" },
  {
    row: 2,
    column: "total",
    fx: (ctx: any) => {
      const L = ctx.letterOf("effectif")
      return `SUM(${L}1:${L}${ctx.rowCount - 1})`
    },
  },
]

// — Limite de lignes (`maxRows` / `minRows`) — feuille **figée** à une ligne —
const limitCols = [
  { name: "label", label: "Label", width: 180 },
  { name: "qty", label: "Qty", type: "number" as const, width: 90 },
]
const limitRows = ref([{ label: "Only one row", qty: 1 }])

// — Suivi des modifications (dirty + delta) —
const changeColumns = [
  { name: "task", label: "Task", width: 180 },
  { name: "owner", label: "Owner", width: 130 },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    chip: true,
    width: 120,
    options: [
      { value: "todo", label: "To do", color: "#e0e7ff" },
      { value: "doing", label: "Doing", color: "#fef9c3" },
      { value: "done", label: "Done", color: "#dcfce7" },
    ],
  },
]
const changeRows = ref([
  { task: "Landing hero", owner: "Ada", status: "done" },
  { task: "Checkout API", owner: "Grace", status: "doing" },
  { task: "Docs rewrite", owner: "Alan", status: "todo" },
])
const changeDirty = ref(false)
const changeSet = ref<any>(null)
const changeGrid = useTemplateRef<{ acceptChanges: () => void; revertChanges: () => void }>(
  "changeGrid",
)
/** Vue lisible du delta (les lignes sont résumées à ce qui bouge) */
const changesJson = computed(() => {
  const c = changeSet.value
  if (!c) return "{}"
  return JSON.stringify(
    {
      dirty: c.dirty,
      count: c.count,
      rows: {
        added: c.rows.added.map((r: any) => r.row.task),
        updated: c.rows.updated.map((u: any) => ({ key: u.key, columns: u.columns })),
        deleted: c.rows.deleted.map((r: any) => r.row.task),
      },
      sheets: {
        added: c.sheets.added.map((s: any) => s.key),
        updated: c.sheets.updated.map((u: any) => ({ key: u.key, changed: u.changed })),
        deleted: c.sheets.deleted.map((s: any) => s.key),
      },
      extras: c.extras,
    },
    null,
    2,
  )
})

// — A1 formulas demo —
const formulaColumns = [
  { name: "item", label: "Item", width: 140 },
  { name: "qty", label: "Qty", type: "integer" as const, width: 80 },
  { name: "price", label: "Price", type: "number" as const, width: 110, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "total", label: "Total", type: "number" as const, width: 130, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "share", label: "Share", type: "number" as const, width: 110, format: (v: any) => (v == null ? "" : Math.round(Number(v) * 100) + "%") },
]

const formulaRows = ref([
  { item: "Apples", qty: 6, price: 1.5, total: "=B1*C1", share: "=D1/$D$5" },
  { item: "Bananas", qty: 12, price: 0.4, total: "=B2*C2", share: "=D2/$D$5" },
  { item: "Cherries", qty: 30, price: 0.25, total: "=B3*C3", share: "=D3/$D$5" },
  { item: "Dates", qty: 8, price: 3, total: "=B4*C4", share: "=D4/$D$5" },
  { item: "Total", qty: null, price: null, total: "=SUM(D1:D4)", share: "=SUM(E1:E4)" },
])

// — Auto-calc demo : la colonne `total` se calcule dès que `qty` + `price` sont saisis —
const autoCalcColumns = [
  { name: "item", label: "Item", width: 150 },
  { name: "qty", label: "Qty", type: "integer" as const, width: 80 },
  // Nom de colonne « snake_case » : `=qty*unit_price` fonctionne (cf. identifiants étendus)
  { name: "unit_price", label: "Unit price", type: "number" as const, width: 110, format: (v: any) => (v == null || v === "" ? "" : "$" + Number(v).toFixed(2)) },
  { name: "total", label: "Total (auto)", type: "number" as const, width: 140, format: (v: any) => (v == null || v === "" ? "" : "$" + Number(v).toFixed(2)) },
]
const autoCalcRows = ref([
  { item: "Apples", qty: 6, unit_price: 1.5, total: "=qty*unit_price" },
  { item: "Bananas", qty: 12, unit_price: 0.4, total: "=qty*unit_price" },
  // `unit_price` manquant → `total` reste vide ; il se calcule dès la saisie du prix
  { item: "Cherries", qty: 30, unit_price: null, total: "" },
  // ligne neuve : qty + unit_price suffisent, `total` se remplit tout seul
  { item: "", qty: null, unit_price: null, total: "" },
])

// — Errors demo : chaque code d'erreur + panneau de détail au clic —
const errorColumns = [
  { name: "case", label: "Case", width: 150 },
  { name: "a", label: "A", type: "number" as const, width: 70 },
  { name: "b", label: "B", type: "number" as const, width: 70 },
  { name: "formula", label: "Formula", width: 190 },
]
const errorRows = ref([
  { case: "Division by zero", a: 6, b: 0, formula: "=B1/C1" },
  { case: "Unknown column", a: 2, b: 3, formula: "=B2*missing" },
  { case: "Unknown function", a: 1, b: 2, formula: "=NOPE(B3)" },
  { case: "Syntax error", a: 4, b: 5, formula: "=B4**C4" },
  { case: "Out of the grid", a: 1, b: 1, formula: "=Z99" },
  { case: "Circular reference", a: 3, b: 3, formula: "=D6" },
  { case: "Working formula", a: 3, b: 2.5, formula: "=B7*C7" },
])
const formulaErrorLog = ref("")
const formulaErrorCount = ref(0)
/** `@error` : une erreur de formule = un événement, avec tout le contexte */
const onFormulaError = (e: { ref: string; code: string; message: string }) => {
  formulaErrorCount.value += 1
  formulaErrorLog.value = `${e.ref} · ${e.code} — ${e.message}`
}

// — Context menu, formatting & autofill demo —
const opsColumns = [
  { name: "item", label: "Item", width: 140 },
  { name: "qty", label: "Qty", type: "integer" as const, width: 80 },
  { name: "price", label: "Price", type: "number" as const, width: 110, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "start", label: "Start", type: "date" as const, width: 140 },
  { name: "kickoff", label: "Kickoff", type: "time" as const, width: 110 },
]
const opsRows = ref([
  { item: "Design", qty: 1, price: 1200, start: "2026-09-01", kickoff: "09:00" },
  { item: "Build", qty: 2, price: 800, start: "2026-09-02", kickoff: "10:00" },
  { item: "Ship", qty: 3, price: 300, start: "2026-09-03", kickoff: "11:00" },
  { item: "", qty: null, price: null, start: null, kickoff: null },
  { item: "", qty: null, price: null, start: null, kickoff: null },
])

// — Filters & freeze panes —
const filterCols = [
  { name: "name", label: "Employee", width: 140 },
  {
    name: "dept",
    label: "Department",
    type: "select" as const,
    chip: true,
    width: 150,
    options: [
      { value: "management", label: "Management", color: "#fee2e2" },
      { value: "sales", label: "Sales", color: "#dbeafe" },
      { value: "operations", label: "Operations", color: "#dcfce7" },
      { value: "it", label: "IT", color: "#ede9fe" },
      { value: "finance", label: "Finance", color: "#fef9c3" },
    ],
  },
  { name: "level", label: "Level", type: "integer" as const, width: 80 },
  { name: "active", label: "Active", type: "boolean" as const, width: 90 },
]
const filterDepts = ["management", "sales", "operations", "it", "finance"]
const filterRows = ref(
  Array.from({ length: 34 }, (_, i) => ({
    name: "Employee " + (i + 1),
    dept: filterDepts[i % filterDepts.length]!,
    level: (i % 6) + 1,
    active: i % 3 !== 0,
  })),
)

// — Large dataset (virtualization) —
const bigCols = [
  { name: "id", label: "ID", type: "integer" as const, width: 80 },
  { name: "label", label: "Label", width: 190 },
  { name: "value", label: "Value", type: "number" as const, width: 120, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
  { name: "on", label: "On", type: "boolean" as const, width: 90 },
]
const bigRows = ref(
  Array.from({ length: 2000 }, (_, i) => ({
    id: i + 1,
    label: "Row " + (i + 1),
    value: (i % 97) * 1.5,
    on: i % 2 === 0,
  })),
)

// — Find & Replace + CSV import —
const importCols = [
  { name: "code", label: "Code", width: 100 },
  { name: "label", label: "Label", width: 240 },
]
const importRows = ref([
  { code: "X1", label: "Nothing imported yet — click the button." },
  { code: "X2", label: "…" },
])
const CSV_SAMPLE = `code,label\nA1,Alpha\nB2,Beta\nC3,Gamma`

// — Layout, conditional formatting & validation —
const layoutCols = [
  { name: "task", label: "Task", width: 240 },
  { name: "score", label: "Score (0–100)", type: "integer" as const, width: 130, validation: { min: 0, max: 100, integer: true, message: "Score must be an integer between 0 and 100" } },
  // Règle écrite **directement** : expression ArkType — équivalent de `{ schema: "number < 4" }`
  { name: "priority", label: "Priority (< 4)", type: "number" as const, width: 130, validation: "number < 4" },
  { name: "owner", label: "Owner", width: 130 },
]
const layoutRows = ref([
  { task: "Write the release notes (long text to wrap on several lines when Wrap text is on)", score: 92, priority: 1, owner: "Ada" },
  { task: "Run the regression suite", score: 78, priority: 2, owner: "Grace" },
  { task: "Review pull requests", score: 101, priority: 4, owner: "Katherine" },
  { task: "Update the changelog", score: 64, priority: 3, owner: "Margaret" },
  { task: "Plan next sprint", score: 88, priority: 1, owner: "Ada" },
])

// — Multi-sheet workbook & export —
const wbSheets = ref([
  {
    key: "staff",
    name: "Staff",
    columns: [
      { name: "name", label: "Employee", width: 160 },
      {
        name: "dept",
        label: "Department",
        type: "select" as const,
        chip: true,
        width: 140,
        options: [
          { value: "sales", label: "Sales", color: "#dbeafe" },
          { value: "it", label: "IT", color: "#ede9fe" },
          { value: "finance", label: "Finance", color: "#fef9c3" },
        ],
      },
      { name: "score", label: "Score", type: "integer" as const, width: 90 },
    ],
    rows: [
      { name: "Ada Lovelace", dept: "it", score: 9 },
      { name: "Grace Hopper", dept: "it", score: 10 },
      { name: "Katherine J.", dept: "finance", score: 7 },
      { name: "Margaret H.", dept: "sales", score: 8 },
    ],
  },
  {
    key: "budget",
    name: "Budget",
    columns: [
      { name: "item", label: "Item", width: 150 },
      { name: "qty", label: "Qty", type: "integer" as const, width: 80 },
      { name: "price", label: "Price", type: "number" as const, width: 110, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
      { name: "total", label: "Total", type: "number" as const, width: 120, format: (v: any) => (v == null ? "" : "$" + Number(v).toFixed(2)) },
    ],
    rows: [
      { item: "Servers", qty: 2, price: 1200, total: "=B1*C1" },
      { item: "Licences", qty: 12, price: 90, total: "=B2*C2" },
      { item: "Hosting", qty: 12, price: 30, total: "=B3*C3" },
      { item: "Total", qty: null, price: null, total: "=SUM(D1:D3)" },
    ],
  },
])
const wbJson = ref("")
const copyWbJson = () => {
  wbJson.value = wbRef.value?.toJSON() ?? ""
}

// — Events demo —
const eventsCols = [
  { name: "task", label: "Task", width: 220, editable: true },
  {
    name: "status",
    label: "Status",
    type: "select" as const,
    chip: true,
    width: 140,
    options: [
      { value: "todo", label: "To do", color: "#e2e8f0" },
      { value: "doing", label: "In progress", color: "#bfdbfe" },
      { value: "done", label: "Done", color: "#bbf7d0" },
    ],
  },
]

const eventsRows = ref([
  { task: "Design the spreadsheet API", status: "done" },
  { task: "Implement cell editing", status: "done" },
  { task: "Write the docs page", status: "doing" },
  { task: "Ship the release", status: "todo" },
])

const log = ref("")
const onCellChange = (e: any) => {
  log.value = `cell-change  ${e.column} (row ${e.row + 1}): ${JSON.stringify(e.oldValue)} → ${JSON.stringify(e.newValue)}`
}
const onSelectionChange = (e: any) => {
  if (!e) return
  log.value = `selection    ${e.rows}×${e.cols} @ row ${e.row + 1} / col ${e.column}`
}
const onStructureChange = (e: any) => {
  log.value = `structure    ${e.reason} — ${e.rows.length} row(s)`
}

// — Grid refs (pre-setup of the filter / formatting demos) —
const filterDemo = ref()
const opsDemo = ref()
const wbRef = ref()
const findDemo = ref()
const layoutDemo = ref()

onMounted(() => {
  if (props.demo === "filter") {
    filterDemo.value?.setFilterOnly?.("dept", ["it"])
  }
  if (props.demo === "power") {
    // Pre-formatting applied to the first row of the context-menu demo
    const ops = opsDemo.value
    if (ops && typeof ops.select === "function" && typeof ops.setBgColorSelection === "function") {
      ops.select(0, "item")
      ops.setBgColorSelection("#dbeafe")
      ops.select(0, "qty")
      ops.setBgColorSelection("#fef9c3")
      ops.select(1, "item")
      ops.setBgColorSelection("#dcfce7")
      ops.select(0, "item")
    }
  }
})
</script>

<template>
  <div v-if="demo === 'inline'">
    <q-spreadsheet
      v-model:rows="inlineRows"
      :columns="inlineColumns"
      height="200px"
      bordered
      @cell-change="onInlineChange"
    />
    <p class="demo-p demo-log">Last change: {{ inlineLog || "— double-click Ada's first name" }}</p>
    <!-- `ClientOnly` : les `_key` sont générés à l'exécution (uuid) → éviter un
         écart de texte entre le HTML prérendu et l'hydratation. -->
    <ClientOnly>
      <p class="demo-p demo-log">
        Injected row key: <code>{{ inlineRows[0]?._key ?? "—" }}</code>
      </p>
    </ClientOnly>
  </div>

  <q-spreadsheet
    v-else-if="demo === 'people'"
    v-model:rows="peopleRows"
    :columns="columnsSummary"
    height="340px"
    bordered
  />

  <q-spreadsheet
    v-else-if="demo === 'types'"
    v-model:rows="typesRows"
    :columns="typesColumns"
    height="250px"
    bordered
    :default-col-width="120"
  />

  <div v-else-if="demo === 'time'">
    <q-spreadsheet
      v-model:rows="timeRows"
      :columns="timeColumns"
      height="240px"
      bordered
    />
    <p class="demo-p demo-log">
      stored → <code>start</code>: {{ JSON.stringify(timeRows[0]?.start) }} ·
      <code>end</code>: {{ JSON.stringify(timeRows[0]?.end) }} — double-click a time cell to open
      the native picker; drag the fill handle from two times to continue the hour series.
    </p>
  </div>

  <div v-else-if="demo === 'choice'">
    <q-spreadsheet
      v-model:rows="choiceRows"
      :columns="choiceColumns"
      height="230px"
      bordered
    />
    <p class="demo-p demo-log">
      stored → <code>priority</code>: {{ JSON.stringify(choiceRows[0]?.priority) }} ·
      <code>tags</code>: {{ JSON.stringify(choiceRows[0]?.tags) }} ·
      <code>reviewers</code>: {{ JSON.stringify(choiceRows[0]?.reviewers) }}
    </p>
  </div>

  <div v-else-if="demo === 'rawOptions'">
    <q-spreadsheet
      v-model:rows="rawRows"
      :columns="rawColumns"
      height="230px"
      bordered
    />
    <p class="demo-p demo-log">
      stored → <code>owner</code>: {{ JSON.stringify(rawRows[0]?.owner) }} ·
      <code>reviewers</code>: {{ JSON.stringify(rawRows[0]?.reviewers) }} — the grid shows the
      <code>name</code>s, <code>rows</code> keeps the <code>_id</code>s.
    </p>
  </div>

  <div v-else-if="demo === 'locked'">
    <q-spreadsheet
      v-model:rows="lockRows"
      :columns="lockCols"
      :locked-ranges="lockRanges"
      height="230px"
      bordered
    />
    <p class="demo-p demo-log">
      <code>lockedRanges</code> locks row 0 — <strong>even its empty cells</strong> ·
      <code>cellReadonly</code> locks the <code>total</code> column as soon as it holds a value.
      Selecting and copying still work.
    </p>
  </div>

  <div v-else-if="demo === 'prefill'">
    <q-spreadsheet
      v-model:rows="prefillRows"
      :columns="prefillCols"
      :prefill="prefillFills"
      height="230px"
      bordered
      @prefill="onPrefill"
    />
    <p class="demo-p demo-log">
      Applied <strong>automatically on load</strong> (empty cells only) — <code>@prefill</code>:
      {{ prefillLog || "—" }}. Add a row with “+” to see a new row born pre-filled. Existing
      values are never overwritten.
    </p>
  </div>

  <div v-else-if="demo === 'prefillFormula'">
    <q-spreadsheet
      v-model:rows="pfRows"
      :columns="pfCols"
      :prefill="pfFills"
      height="230px"
      bordered
    />
    <p class="demo-p demo-log">
      Filled <strong>automatically on load</strong> — the totals row gets the formula
      <code>=SUM(B1:B2)</code>, whose range comes from <code>rowCount</code>.
    </p>
  </div>

  <div v-else-if="demo === 'rowLimit'">
    <q-spreadsheet
      v-model:rows="limitRows"
      :columns="limitCols"
      :max-rows="1"
      :min-rows="1"
      height="120px"
      bordered
    />
    <p class="demo-p demo-log">
      <code>:max-rows="1" :min-rows="1"</code> freezes the sheet at one row — “+”, “Insert
      row” and “Delete rows” are disabled.
    </p>
  </div>

  <div v-else-if="demo === 'changes'">
    <q-spreadsheet
      ref="changeGrid"
      v-model:rows="changeRows"
      v-model:dirty="changeDirty"
      v-model:changes="changeSet"
      :columns="changeColumns"
      height="200px"
      bordered
    />
    <div class="demo-tools">
      <button class="demo-btn" type="button" @click="changeGrid?.acceptChanges()">
        acceptChanges() — saved
      </button>
      <button class="demo-btn" type="button" @click="changeGrid?.revertChanges()">
        revertChanges() — discard
      </button>
      <span class="demo-meta">dirty = <code>{{ changeDirty }}</code></span>
    </div>
    <pre class="demo-json">{{ changesJson }}</pre>
  </div>

  <q-spreadsheet
    v-else-if="demo === 'formulas'"
    v-model:rows="formulaRows"
    :columns="formulaColumns"
    height="260px"
    bordered
  />

  <div v-else-if="demo === 'autocalc'">
    <q-spreadsheet
      v-model:rows="autoCalcRows"
      :columns="autoCalcColumns"
      height="220px"
      bordered
    />
    <p class="demo-p demo-log">
      <code>auto-formula</code> (on by default): type a <strong>unit price</strong> in the
      <em>Cherries</em> row, or fill the last row — the <strong>Total</strong> cell receives the
      column formula (<code>=qty*unit_price</code>) and computes as soon as its references are
      set.
    </p>
  </div>

  <div v-else-if="demo === 'errors'">
    <q-spreadsheet
      v-model:rows="errorRows"
      :columns="errorColumns"
      height="260px"
      bordered
      @error="onFormulaError"
    />
    <p class="demo-p demo-log">
      Click any red cell: the panel gives the <strong>code</strong>, the cell reference, the
      <strong>reason</strong> and the raw formula. <kbd>Escape</kbd>, a click outside or a
      scroll closes it. Hover shows the same text as a native tooltip.
    </p>
    <p class="demo-p demo-log">
      <code>@error</code> — <strong>{{ formulaErrorCount }}</strong> captured.
      <template v-if="formulaErrorLog">Last: <code>{{ formulaErrorLog }}</code></template>
    </p>
  </div>

  <q-spreadsheet
    v-else-if="demo === 'power'"
    ref="opsDemo"
    v-model:rows="opsRows"
    :columns="opsColumns"
    height="250px"
    bordered
  />

  <q-spreadsheet
    v-else-if="demo === 'filter'"
    ref="filterDemo"
    v-model:rows="filterRows"
    :columns="filterCols"
    height="260px"
    bordered
  />

  <q-spreadsheet
    v-else-if="demo === 'freeze'"
    v-model:rows="filterRows"
    :columns="filterCols"
    height="240px"
    :frozen-rows="1"
    :frozen-cols="1"
    bordered
  />

  <q-spreadsheet
    v-else-if="demo === 'sheets'"
    ref="wbRef"
    v-model:sheets="wbSheets"
    height="250px"
    bordered
  />

  <div v-else-if="demo === 'export'">
    <q-spreadsheet ref="wbRef" v-model:sheets="wbSheets" height="250px" bordered />
    <div class="demo-tools">
      <button class="demo-btn" type="button" @click="copyWbJson">Show JSON</button>
      <button class="demo-btn" type="button" @click="wbRef?.exportJson()">Download JSON</button>
      <button class="demo-btn" type="button" @click="wbRef?.exportCsv()">Download CSV</button>
    </div>
    <pre v-if="wbJson" class="demo-json">{{ wbJson }}</pre>
  </div>

  <div v-else-if="demo === 'findImport'">
    <q-spreadsheet
      ref="findDemo"
      v-model:rows="importRows"
      :columns="importCols"
      height="200px"
      bordered
    />
    <div class="demo-tools">
      <button class="demo-btn" type="button" @click="findDemo?.openFind()">
        Open Find (Ctrl+F)
      </button>
      <button
        class="demo-btn"
        type="button"
        @click="findDemo?.importCsv(CSV_SAMPLE, { headers: true })"
      >
        Import sample CSV
      </button>
    </div>
  </div>

  <div v-else-if="demo === 'layout'">
    <q-spreadsheet
      ref="layoutDemo"
      v-model:rows="layoutRows"
      :columns="layoutCols"
      height="230px"
      bordered
    />
    <div class="demo-tools">
      <button class="demo-btn" type="button" @click="layoutDemo?.toggleWrapSelection()">
        Wrap text (selection)
      </button>
      <button class="demo-btn" type="button" @click="layoutDemo?.mergeCells()">
        Merge selection
      </button>
    </div>
  </div>

  <div v-else-if="demo === 'events'">
    <q-spreadsheet
      v-model:rows="eventsRows"
      :columns="eventsCols"
      height="230px"
      flat
      @cell-change="onCellChange"
      @selection-change="onSelectionChange"
      @structure-change="onStructureChange"
    />
    <p class="demo-p demo-log">Last event: {{ log || "— click a cell" }}</p>
  </div>

  <q-spreadsheet
    v-else-if="demo === 'big'"
    v-model:rows="bigRows"
    :columns="bigCols"
    height="40vh"
    bordered
  />

  <div v-else-if="demo === 'variants'">
    <q-spreadsheet
      v-model:rows="peopleRows"
      :columns="columnsSummary"
      height="200px"
      :show-toolbar="false"
      :show-row-numbers="false"
      dense
      flat
      bordered
    />
    <div class="demo-col-spacer" />
    <q-spreadsheet
      v-model:rows="peopleRows"
      :columns="columnsSummary"
      height="200px"
      :show-toolbar="false"
      :show-column-headers="false"
      readonly
    />
  </div>
  <div v-else-if="demo === 'attachment'">
    <q-spreadsheet
      v-model:rows="attachmentRows"
      :columns="attachmentColumns"
      height="230px"
      bordered
      @files="onAttach"
      @attachment-click="onAttachClick"
    />
    <p class="demo-p demo-log">
      <code>accept</code> is enforced (screenshots: images only, 3 max · contract: pdf/docx,
      one file). <code>@files</code> → {{ lastFiles || "—" }} ·
      <code>@attachment-click</code> → {{ lastClick || "—" }}
    </p>
  </div>

  <div v-else-if="demo === 'slots'">
    <q-spreadsheet v-model:rows="slotRows" :columns="slotColumns" height="210px" bordered>
      <template #head-status="{ column }">
        <span class="demo-head">
          <q-icon name="lucide:activity" size="14px" />
          {{ column.label }}
        </span>
      </template>
      <template #cell-status="{ value }">
        <span class="demo-status" :class="`demo-status--${value}`">
          {{ statusLabel[value] || value }}
        </span>
      </template>
      <template #cell-progress="{ value, setValue }">
        <span class="demo-progress" @click.stop="setValue(Math.min(100, Number(value || 0) + 10))">
          <span class="demo-progress__bar" :style="{ width: `${value || 0}%` }" />
          <span class="demo-progress__pct">{{ value }}%</span>
        </span>
      </template>
    </q-spreadsheet>
    <p class="demo-p demo-log">
      <code>#cell-&lt;name&gt;</code> replaces one column's cells (with <code>value</code> /
      <code>setValue</code>), <code>#head-&lt;name&gt;</code> its header. Click the bar to +10%.
    </p>
  </div>

  <div v-else-if="demo === 'pagination'">
    <q-spreadsheet
      v-model:rows="paginatedRows"
      v-model:page="paginatedPage"
      :columns="paginationColumns"
      :page-size="50"
      :total-rows="allClients.length"
      :loading="paginationLoading"
      height="240px"
      bordered
      @page-change="onPageChange"
    />
    <p class="demo-p demo-log">
      Remote pagination — the grid only ever holds <strong>50 rows</strong>; row headers are
      numbered globally (page 2 starts at 51) and a veil covers the grid while loading.
      {{ paginationLog || "Click › in the status bar to load the next page." }}
    </p>
  </div>

  <div v-else-if="demo === 'loading'">
    <q-spreadsheet
      v-model:rows="loadingRows"
      :columns="loadingColumns"
      :loading="loadingDemo"
      height="200px"
      bordered
    />
    <div class="demo-tools">
      <button class="demo-btn" type="button" :disabled="loadingDemo" @click="reloadDemo">
        {{ loadingDemo ? "Loading…" : "Reload the page" }}
      </button>
      <span class="demo-meta">
        <code>:loading</code> = <code>{{ loadingDemo }}</code>
        <template v-if="loadingLog"> — {{ loadingLog }}</template>
      </span>
    </div>
    <p class="demo-p demo-log">
      A thin <strong>indeterminate bar</strong> at the top of the card is the loading signal;
      the veil below it blocks clicks and edits, while the toolbar, status bar and pager stay
      usable.
    </p>
  </div>

  <div v-else-if="demo === 'size'" class="demo-size">
    <div v-for="preset in sizePresets" :key="String(preset.value)" class="demo-size__item">
      <q-spreadsheet
        :rows="sizeRows"
        :columns="sizeColumns"
        :size-cell="preset.value"
        height="170px"
        :show-toolbar="false"
        bordered
      />
      <span class="demo-p demo-log">{{ preset.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.demo-size {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}
.demo-size__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.demo-head {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.demo-status {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  background: rgb(0 0 0 / 0.08);
}
.demo-status--done {
  background: color-mix(in srgb, var(--positive) 18%, transparent);
  color: var(--positive);
}
.demo-status--doing {
  background: color-mix(in srgb, var(--primary) 16%, transparent);
  color: var(--primary);
}
.demo-status--todo {
  background: rgb(0 0 0 / 0.07);
  color: rgb(0 0 0 / 0.55);
}
.demo-progress {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  cursor: pointer;
}
.demo-progress__bar {
  display: block;
  height: 8px;
  min-width: 2px;
  border-radius: 999px;
  background: var(--primary);
}
.demo-progress__pct {
  font-size: 11.5px;
  color: rgb(0 0 0 / 0.55);
}
.demo-log {
  margin-top: 10px;
  font-size: 13px;
  color: #5b6472;
}
.demo-col-spacer {
  height: 14px;
}
.demo-tools {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.demo-btn {
  padding: 5px 12px;
  border: 1px solid rgb(0 0 0 / 0.14);
  border-radius: 7px;
  background: #fff;
  color: var(--foreground);
  font: inherit;
  font-size: 12.5px;
  cursor: pointer;
}
.demo-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.demo-json {
  max-height: 220px;
  overflow: auto;
  margin: 0;
  padding: 10px 12px;
  border: 1px dashed var(--border, rgb(0 0 0 / 0.2));
  border-radius: 8px;
  background: rgb(0 0 0 / 0.03);
  font-size: 11.5px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
