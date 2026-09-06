<script setup lang="ts">
// QTiptap — éditeur de texte riche basé sur Tiptap v3 (https://tiptap.dev).
// API Quasar : v-model = HTML (<q-tiptap v-model="html" />).
// Barre d'outils intégrée : undo/redo, paragraphe + titres H1-H3, marques
// (gras/italique/souligné/barré/code), lien, listes, citation, bloc de code,
// séparateur et nettoyage de la mise en forme.
// SSR-safe : l'éditeur ProseMirror n'est créé qu'au montage (côté client).
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Editor, EditorContent } from "@tiptap/vue-3"
import { BubbleMenu } from "@tiptap/vue-3/menus"
import { DragHandle } from "@tiptap/extension-drag-handle-vue-3"
import { TableOfContents } from "@tiptap/extension-table-of-contents"
import { QTipTapTable, TableRow, TableHeader, TableCell } from "../lib/tiptap-table"
import StarterKit from "@tiptap/starter-kit"
// v3 : Color et TextStyle vivent dans @tiptap/extension-text-style
// (l'extension @tiptap/extension-color n'est qu'un alias de ré-export)
import { Color, TextStyle, FontSize } from "@tiptap/extension-text-style"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Mention from "@tiptap/extension-mention"
import { TaskList, QTipTapTaskItem } from "../lib/tiptap-task-list"
import { Icon } from "@iconify/vue"
import QDialog from "./QDialog.vue"
import QDialogHeader from "./QDialogHeader.vue"
import QDialogFooter from "./QDialogFooter.vue"
import QBtn from "./QBtn.vue"
import QInput from "./QInput.vue"
import QSelect from "./QSelect.vue"
import { icons } from "../lib/icons"

// Drag handle : config constante HORS du composant — évite la réinitialisation
// de la plugin à chaque rendu (préconisation doc Tiptap Vue). threshold
// négatif : la poignée vise facilement les blocs imbriqués (listes…).
const DRAG_HANDLE_NESTED = { edgeDetection: { threshold: -16 } }

// — Table des matières : ancre de chaque titre (remontée via @update:toc) —
interface QTiptapTocItem {
  id: string
  textContent: string
  level: number
  originalLevel: number
  itemIndex: number
  pos: number
  isActive: boolean
  isScrolledOver: boolean
}

interface Props {
  /** HTML édité (v-model) */
  modelValue?: string
  /** Affiche la barre d'outils (défaut : true) */
  toolbar?: boolean
  /** Texte affiché tant que le document est vide */
  placeholder?: string
  /** Items de mention (@) : { label, value } — filtre au fil de la frappe */
  mentions?: { label: string; value: string }[]
  /** Variante « filled » (fond grisé, sans bordure pleine) — défaut : contenu blanc bordé */
  filled?: boolean
  /** Hauteur minimale de la zone d'édition (défaut : 180px) */
  minHeight?: string
  /** Padding de la zone d'écriture (valeur CSS — défaut : 5% sur les 4 côtés) */
  padding?: string
  /** Compact (toolbar + zone réduites) */
  dense?: boolean
  /** Coins carrés (défaut : arrondi --q-radius) */
  square?: boolean
  /** Désactive entièrement (édition coupée + boutons grisés) */
  disable?: boolean
  /** Lecture seule : texte visible mais non éditable */
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  toolbar: true,
  placeholder: "Write something…",
  mentions: () => [],
  filled: false,
  minHeight: "180px",
  padding: "5%",
  dense: false,
  square: false,
  disable: false,
  readonly: false,
})

const emit = defineEmits<{
  "update:modelValue": [html: string]
  focus: []
  blur: []
  ready: [editor: Editor]
  /** Nouvelle table des matières (titres du document) — prête à afficher */
  "update:toc": [items: QTiptapTocItem[]]
}>()

// — Instance de l'éditeur (créée au montage uniquement → SSR-safe) —
const editor = ref<Editor>()
/** Dernière table des matières émise (pour usage interne / debug) */
const tocAnchors = ref<QTiptapTocItem[]>([])
/** Incrémenté à chaque transaction/sélection → recalcule l'état de la barre */
const tick = ref(0)
/** Dernière couleur choisie — rappelée quand la sélection n'a pas de couleur */
const picked = ref("#1d1d1d")

const isEditable = () => !props.disable && !props.readonly

// Style de la zone d'écriture : min-height + padding exposé en variable CSS
// (consommée par .q-tiptap__editor .ProseMirror dans styles/main.css)
const editorStyle = computed<Record<string, string>>(() => ({
  minHeight: props.minHeight,
  "--q-tiptap-content-padding": props.padding,
}))

onMounted(() => {
  const ed = new Editor({
    content: props.modelValue || "<p></p>",
    extensions: [
      TextStyle,
      FontSize,
      Color,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      TaskList,
      QTipTapTaskItem,
      QTipTapTable,
      TableRow,
      TableHeader,
      TableCell,
      Mention.configure({
        suggestion: {
          char: "@",
          startOfLine: false,
          allow: () => (props.mentions?.length ?? 0) > 0,
          items: ({ query }) => mentionItems(query),
          command: ({ editor, range, props: item }: any) => {
            editor.chain().focus().insertContentAt(range, [
              { type: "mention", attrs: { id: item.id, label: item.label } },
              { type: "text", text: " " },
            ]).run()
          },
          render: () => mentionPopupRender(),
        },
      }),
      TableOfContents.configure({
        onUpdate: (anchors: any[]) => {
          tocAnchors.value = anchors.map((a) => ({
            id: a.id,
            textContent: a.textContent,
            level: a.level,
            originalLevel: a.originalLevel,
            itemIndex: a.itemIndex,
            pos: a.pos,
            isActive: a.isActive,
            isScrolledOver: a.isScrolledOver,
          }))
          emit("update:toc", tocAnchors.value)
        },
      }),
      StarterKit.configure({
        // Titres limités à H1-H3 dans la barre (les niveaux 4-6 restent
        // lisibles via HTML mais pas proposés) — Link : pas d'ouverture au clic
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false },
      }),
    ],
    editable: isEditable(),
    onUpdate: ({ editor: instance }) => emit("update:modelValue", instance.getHTML()),
    onTransaction: () => { tick.value++ },
    onSelectionUpdate: () => { tick.value++ },
    onFocus: () => emit("focus"),
    onBlur: () => emit("blur"),
  })
  editor.value = ed
  emit("ready", ed)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  editor.value = undefined
})

// v-model externe → contenu (sans re-émettre ni perdre le curseur) :
// on ne réécrit le document que si le HTML a réellement changé.
watch(() => props.modelValue, (html) => {
  const ed = editor.value
  if (!ed || html === undefined) return
  const current = ed.getHTML()
  const next = html || "<p></p>"
  if (current === next) return
  // Cas « document vidé » : l'éditeur normalise en <p></p> — rien à réécrire
  if (current === "<p></p>" && (html === "" || html === "<p></p>")) return
  ed.commands.setContent(next, { emitUpdate: false })
})

// disable / readonly → editable
watch([() => props.disable, () => props.readonly], () => {
  editor.value?.setEditable(isEditable())
})

const showPlaceholder = computed(() => {
  void tick.value
  return !props.disable && !!editor.value?.isEmpty
})

// — Barre d'outils —
interface ToolSpec {
  label: string
  icon: string
  active?: (ed: Editor) => boolean
  disabled?: (ed: Editor) => boolean
  run: (ed: Editor) => void
  /** true → sélecteur de couleur natif (input type=color) à la place du bouton */
  kind?: "color"
}

interface ToolView {
  label: string
  icon: string
  active: boolean
  disabled: boolean
  run: () => void
  kind?: "color"
  /** Couleur courante du texte sélectionné ("" si aucune) — barre sous l'icône */
  swatch?: string
}

// — Couleur de texte : palette popover (un input type=color natif ne permet
//   pas de DÉSÉLECTIONNER — pas de valeur « aucune ») —
const PRESET_COLORS = [
  "#1d1d1d", "#6b7280", "#ffffff", "#ef4444", "#f97316", "#f59e0b",
  "#eab308", "#22c55e", "#10b981", "#06b6d4", "#3b82f6", "#6366f1",
  "#8b5cf6", "#ec4899",
] as const

const colorOpen = ref(false)
const paletteStyle = ref<Record<string, string>>({})

/** Couleur du texte sélectionné ("" si aucune) — recalculée à chaque transaction */
const paletteCurrent = computed(() => {
  void tick.value
  const ed = editor.value
  if (!ed) return ""
  const color = ed.getAttributes("textStyle").color
  return typeof color === "string" ? color : ""
})

const togglePalette = (event: MouseEvent) => {
  if (colorOpen.value) {
    colorOpen.value = false
    return
  }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const width = 224
  const left = Math.min(Math.max(rect.left, 8), window.innerWidth - width - 8)
  paletteStyle.value = { top: `${rect.bottom + 6}px`, left: `${left}px` }
  colorOpen.value = true
}

const applyColor = (hex: string) => {
  const ed = editor.value
  if (!ed) return
  picked.value = hex
  colorOpen.value = false
  ed.chain().focus().setColor(hex).run()
}

const removeColor = () => {
  const ed = editor.value
  if (!ed) return
  colorOpen.value = false
  ed.chain().focus().unsetColor().run()
}

const onColorInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.value) applyColor(input.value)
}

// Fermeture de la palette : clic à l'extérieur, Échap, blur de la fenêtre,
// resize/scroll (la palette est positionnée en fixed sous le bouton)
watch(colorOpen, (open) => {
  if (!open) return
  const onDown = (e: MouseEvent) => {
    const target = e.target as Node
    if (!document.querySelector(".q-tiptap__palette")?.contains(target)) {
      colorOpen.value = false
    }
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") colorOpen.value = false
  }
  const close = () => { colorOpen.value = false }
  document.addEventListener("mousedown", onDown)
  document.addEventListener("keydown", onKey)
  window.addEventListener("blur", close)
  window.addEventListener("resize", close)
  return () => {
    document.removeEventListener("mousedown", onDown)
    document.removeEventListener("keydown", onKey)
    window.removeEventListener("blur", close)
    window.removeEventListener("resize", close)
  }
})

// — Image / lien : saisie par URL dans un q-dialog (pas de window.prompt) —
const dialogOpen = ref(false)
const dialogMode = ref<"image" | "link">("image")
const dialogUrl = ref("")
const dialogAlt = ref("")
/** true quand l'image sélectionnée doit être remplacée (pas dupliquée) */
const replacingImage = ref(false)

const dialogTitle = computed(() =>
  dialogMode.value === "image" ? "Insert image" : "Insert link",
)
const dialogUrlLabel = computed(() =>
  dialogMode.value === "image" ? "Image URL" : "Link URL",
)
const dialogUrlPlaceholder = computed(() =>
  dialogMode.value === "image"
    ? "https://example.com/image.png"
    : "https://example.com/page",
)
const dialogSubmitLabel = computed(() =>
  dialogMode.value === "image" ? "Insert image" : "Insert link",
)

const openImageDialog = (ed: Editor) => {
  replacingImage.value = ed.isActive("image")
  const attrs = ed.getAttributes("image")
  dialogUrl.value = typeof attrs.src === "string" ? (attrs.src as string) : ""
  dialogAlt.value = typeof attrs.alt === "string" ? (attrs.alt as string) : ""
  dialogMode.value = "image"
  dialogOpen.value = true
}

const openLinkDialog = (ed: Editor) => {
  if (ed.state.selection.empty) return
  const href = ed.getAttributes("link").href
  dialogUrl.value = typeof href === "string" ? (href as string) : ""
  dialogMode.value = "link"
  dialogOpen.value = true
}

const submitDialog = () => {
  const ed = editor.value
  const value = dialogUrl.value.trim()
  if (!ed || !value) return
  dialogOpen.value = false
  if (dialogMode.value === "image") {
    const alt = dialogAlt.value.trim()
    const chain = ed.chain().focus()
    if (replacingImage.value) {
      const attrs: Record<string, unknown> = { src: value }
      if (alt) attrs.alt = alt
      chain.updateAttributes("image", attrs)
    }
    else {
      const opts: { src: string; alt?: string } = { src: value }
      if (alt) opts.alt = alt
      chain.setImage(opts)
    }
    chain.run()
  }
  else {
    ed.chain().focus().extendMarkRange("link").setLink({ href: value }).run()
  }
}


// — Mentions (@) : filtre des items { label, value } passés en prop —
interface MentionPopupItem {
  id: string
  label: string
}

const mentionItems = (query: string): MentionPopupItem[] => {
  const q = query.trim().toLowerCase()
  return (props.mentions ?? [])
    .filter(
      (item) =>
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q),
    )
    .map((item) => ({ id: item.value, label: item.label }))
}

// Popup de suggestion (DOM stylé dnax.ui) montée via props.mount → la plugin
// l'ancre au curseur, la repositionne (scroll/resize) et fournit unmount().
const mentionPopupRender = () => {
  let popup: HTMLElement | null = null
  let list: HTMLElement | null = null
  let unmount: (() => void) | null = null
  let current: { items: MentionPopupItem[]; command: (item: MentionPopupItem) => void } | null = null
  let index = 0

  const rows = () =>
    Array.from(list?.querySelectorAll<HTMLElement>(".q-tiptap__mention-item") ?? [])

  const highlight = () => {
    rows().forEach((row, i) =>
      row.classList.toggle("q-tiptap__mention-item--active", i === index),
    )
  }

  const selectItem = () => {
    const item = current?.items[index]
    if (item && current) current.command(item)
  }

  const renderList = (props: {
    items: MentionPopupItem[]
    command: (item: MentionPopupItem) => void
    mount: (el: HTMLElement) => () => void
  }) => {
    if (!popup) {
      popup = document.createElement("div")
      popup.className = "q-tiptap__mention"
      list = document.createElement("div")
      list.className = "q-tiptap__mention-list"
      popup.appendChild(list)
      unmount = props.mount(popup)
    }
    if (!list) return
    list.innerHTML = ""
    const items = props.items ?? []
    if (!items.length) {
      const empty = document.createElement("div")
      empty.className = "q-tiptap__mention-empty"
      empty.textContent = "No results"
      list.appendChild(empty)
      return
    }
    index = Math.min(index, items.length - 1)
    items.forEach((item, i) => {
      const row = document.createElement("button")
      row.type = "button"
      row.className = "q-tiptap__mention-item"
      row.textContent = `@${item.label}`
      row.addEventListener("mousedown", (e) => e.preventDefault())
      row.addEventListener("mouseenter", () => {
        index = i
        highlight()
      })
      row.addEventListener("click", () => {
        index = i
        selectItem()
      })
      list!.appendChild(row)
    })
    highlight()
  }

  return {
    onStart: (props: any) => {
      current = props
      index = 0
      renderList(props)
    },
    onUpdate: (props: any) => {
      current = props
      renderList(props)
    },
    onExit: () => {
      unmount?.()
      popup = null
      list = null
      unmount = null
      current = null
    },
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      const count = current?.items.length ?? 0
      if (!count) return false
      if (event.key === "ArrowDown") {
        event.preventDefault()
        index = (index + 1) % count
        highlight()
        return true
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        index = (index - 1 + count) % count
        highlight()
        return true
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault()
        selectItem()
        return true
      }
      return false
    },
  }
}

const HEADING_LEVELS = [1, 2, 3] as const
const ALIGNMENTS = ["left", "center", "right"] as const
// — Taille de police (sélecteur toolbar) —
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 40] as const

const FONT_SIZE_OPTIONS = [
  { label: "Default", value: "" },
  ...FONT_SIZES.map((size) => ({ label: `${size} px`, value: String(size) })),
]

const currentFontSize = computed(() => {
  void tick.value
  const ed = editor.value
  if (!ed) return ""
  const size = (ed.getAttributes("textStyle").fontSize as string | undefined) ?? ""
  const parsed = Number.parseInt(size, 10)
  return Number.isFinite(parsed) ? String(parsed) : ""
})

const onFontSizeUpdate = (value: unknown) => {
  const ed = editor.value
  if (!ed) return
  const size = String(value ?? "")
  if (!size) ed.chain().focus().unsetFontSize().run()
  else ed.chain().focus().setFontSize(`${size}px`).run()
}

const toolGroups = computed<{ id: string; items: ToolView[] }[]>(() => {
  void tick.value
  const ed = editor.value
  if (!ed) return []

  const resolve = (spec: ToolSpec): ToolView => {
    if (spec.kind === "color") {
      const current =
        typeof ed.getAttributes("textStyle").color === "string"
          ? (ed.getAttributes("textStyle").color as string)
          : ""
      return {
        label: spec.label,
        icon: spec.icon,
        kind: "color",
        active: !!current,
        disabled: !ed.isEditable,
        swatch: current || "transparent",
        run: () => {},
      }
    }
    return {
      label: spec.label,
      icon: spec.icon,
      active: spec.active?.(ed) ?? false,
      disabled: spec.disabled ? spec.disabled(ed) : !ed.isEditable,
      run: () => spec.run(ed),
    }
  }

  const groups: { id: string; tools: ToolSpec[] }[] = [
    {
      id: "history",
      tools: [
        {
          label: "Undo",
          icon: icons.undo2,
          disabled: (e) => !e.can().chain().undo().run(),
          run: (e) => { e.chain().focus().undo().run() },
        },
        {
          label: "Redo",
          icon: icons.redo2,
          disabled: (e) => !e.can().chain().redo().run(),
          run: (e) => { e.chain().focus().redo().run() },
        },
      ],
    },
    {
      id: "blocks",
      tools: [
        {
          label: "Paragraph",
          icon: icons.pilcrow,
          active: (e) => e.isActive("paragraph"),
          run: (e) => { e.chain().focus().setParagraph().run() },
        },
        ...HEADING_LEVELS.map((level) => ({
          label: `Heading ${level}`,
          icon: [icons.heading1, icons.heading2, icons.heading3][level - 1]!,
          active: (e: Editor) => e.isActive("heading", { level }),
          run: (e: Editor) => { e.chain().focus().toggleHeading({ level }).run() },
        })),
      ],
    },
    {
      id: "align",
      tools: ALIGNMENTS.map((align) => {
        const iconsByAlign = [icons.alignLeft, icons.alignCenter, icons.alignRight] as const
        return {
          label: `Align ${align}`,
          icon: iconsByAlign[ALIGNMENTS.indexOf(align)]!,
          // « left » est l'alignement implicite (aucun attribut posé)
          active: (e: Editor) => {
            const node = e.isActive("heading") ? "heading" : "paragraph"
            const textAlign = e.getAttributes(node).textAlign
            return (typeof textAlign === "string" ? textAlign : "left") === align
          },
          run: (e: Editor) => { e.chain().focus().setTextAlign(align).run() },
        }
      }),
    },
    {
      id: "font-size",
      tools: [],
    },
    {
      id: "marks",
      tools: [
        {
          label: "Bold",
          icon: icons.bold,
          active: (e) => e.isActive("bold"),
          run: (e) => { e.chain().focus().toggleBold().run() },
        },
        {
          label: "Italic",
          icon: icons.italic,
          active: (e) => e.isActive("italic"),
          run: (e) => { e.chain().focus().toggleItalic().run() },
        },
        {
          label: "Underline",
          icon: icons.underline,
          active: (e) => e.isActive("underline"),
          run: (e) => { e.chain().focus().toggleUnderline().run() },
        },
        {
          label: "Strikethrough",
          icon: icons.strikethrough,
          active: (e) => e.isActive("strike"),
          run: (e) => { e.chain().focus().toggleStrike().run() },
        },
        {
          label: "Inline code",
          icon: icons.code,
          active: (e) => e.isActive("code"),
          run: (e) => { e.chain().focus().toggleCode().run() },
        },
        {
          label: "Link",
          icon: icons.link,
          active: (e) => e.isActive("link"),
          disabled: (e) => !e.isEditable || e.state.selection.empty,
          run: openLinkDialog,
        },
        {
          label: "Remove link",
          icon: icons.unlink,
          active: (e) => e.isActive("link"),
          run: (e) => { e.chain().focus().extendMarkRange("link").unsetLink().run() },
        },
        {
          label: "Text color",
          icon: icons.palette,
          kind: "color",
          run: () => {},
        },
        {
          label: "Remove color",
          icon: icons.eraser,
          active: (e) => typeof e.getAttributes("textStyle").color === "string",
          run: (e) => { e.chain().focus().unsetColor().run() },
        },
      ],
    },
    {
      id: "blocks-list",
      tools: [
        {
          label: "Bullet list",
          icon: icons.list,
          active: (e) => e.isActive("bulletList"),
          run: (e) => { e.chain().focus().toggleBulletList().run() },
        },
        {
          label: "Ordered list",
          icon: icons.listOrdered,
          active: (e) => e.isActive("orderedList"),
          run: (e) => { e.chain().focus().toggleOrderedList().run() },
        },
        {
          label: "Task list",
          icon: icons.listChecks,
          active: (e) => e.isActive("taskList"),
          run: (e) => { e.chain().focus().toggleTaskList().run() },
        },
        {
          label: "Blockquote",
          icon: icons.quote,
          active: (e) => e.isActive("blockquote"),
          run: (e) => { e.chain().focus().toggleBlockquote().run() },
        },
        {
          label: "Code block",
          icon: icons.codeXml,
          active: (e) => e.isActive("codeBlock"),
          run: (e) => { e.chain().focus().toggleCodeBlock().run() },
        },
        {
          label: "Image URL",
          icon: icons.imagePlus,
          active: (e) => e.isActive("image"),
          run: openImageDialog,
        },
        {
          label: "Horizontal rule",
          icon: icons.minus,
          run: (e) => { e.chain().focus().setHorizontalRule().run() },
        },
      ],
    },
    {
      id: "clear",
      tools: [
        {
          label: "Clear formatting",
          icon: icons.removeFormatting,
          run: (e) => { e.chain().focus().clearNodes().unsetAllMarks().run() },
        },
      ],
    },
  ]

  return groups.map((g) => ({ id: g.id, items: g.tools.map(resolve) }))
})

// — Bubble menu (barre contextuelle sur sélection de texte) —
const bubbleShouldShow = (props: any): boolean => {
  const ed = props.editor as Editor | undefined
  if (!ed || !ed.isEditable) return false
  if (ed.isActive("codeBlock") || ed.isActive("image")) return false
  return !ed.state.selection.empty
}

const bubbleTools = computed(() => {
  void tick.value
  const ed = editor.value
  if (!ed) return []
  const tool = (
    label: string,
    icon: string,
    active: (e: Editor) => boolean,
    run: (e: Editor) => void,
  ) => ({ label, icon, active: active(ed), run: () => run(ed) })
  return [
    tool("Bold", icons.bold, (e) => e.isActive("bold"), (e) => { e.chain().focus().toggleBold().run() }),
    tool("Italic", icons.italic, (e) => e.isActive("italic"), (e) => { e.chain().focus().toggleItalic().run() }),
    tool("Underline", icons.underline, (e) => e.isActive("underline"), (e) => { e.chain().focus().toggleUnderline().run() }),
    tool("Strikethrough", icons.strikethrough, (e) => e.isActive("strike"), (e) => { e.chain().focus().toggleStrike().run() }),
    tool("Inline code", icons.code, (e) => e.isActive("code"), (e) => { e.chain().focus().toggleCode().run() }),
    tool("Link", icons.link, (e) => e.isActive("link"), openLinkDialog),
    tool("Remove link", icons.unlink, (e) => e.isActive("link"), (e) => { e.chain().focus().extendMarkRange("link").unsetLink().run() }),
    tool("Remove color", icons.eraser, () => !!paletteCurrent.value, (e) => { e.chain().focus().unsetColor().run() }),
    tool("Clear formatting", icons.removeFormatting, () => false, (e) => { e.chain().focus().clearNodes().unsetAllMarks().run() }),
  ]
})

// Focus programmatique (defineExpose)
const focusEditor = () => editor.value?.commands.focus()

// — Table des matières : scroll interne + accès aux ancres —
/** Scrolle l'éditeur (et son conteneur) jusqu'au titre dont l'id TOC est donné */
const scrollToHeading = (id: string) => {
  const ed = editor.value
  if (!ed) return
  const root = ed.view.dom as HTMLElement
  const byAttr = root.querySelector<HTMLElement>(`[data-toc-id="${id}"], [id="${id}"]`)
  const item = tocAnchors.value.find((a) => a.id === id)
  const byPos =
    typeof item?.pos === "number"
      ? (ed.view.nodeDOM(item.pos) as HTMLElement | null)
      : null
  ;(byAttr ?? byPos)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

/** Dernière table des matières connue (copie sérialisable) */
const getToc = () => tocAnchors.value.map((item) => ({ ...item }))

defineExpose({
  focus: focusEditor,
  scrollToHeading,
  getToc,
})
</script>

<template>
  <div
    class="q-tiptap"
    :class="{
      'q-tiptap--filled': filled,
      'q-tiptap--dense': dense,
      'q-tiptap--square': square,
      'q-tiptap--disable': disable,
    }"
  >
    <div v-if="toolbar && editor" class="q-tiptap__toolbar" role="toolbar" aria-label="Formatting">
      <div v-for="group in toolGroups" :key="group.id" class="q-tiptap__group">
        <div v-if="group.id === 'font-size'" class="q-tiptap__size" title="Font size">
          <q-select
            :model-value="currentFontSize"
            :options="FONT_SIZE_OPTIONS"
            emit-value
            option-value="value"
            option-label="label"
            dense
            outlined
            :disable="!editor.isEditable"
            aria-label="Font size"
            class="q-tiptap__font-size"
            @update:model-value="onFontSizeUpdate"
          />
        </div>
        <template v-if="group.id !== 'font-size'">
          <template v-for="tool in group.items" :key="tool.label">
          <button
            v-if="tool.kind !== 'color'"
            type="button"
            class="q-tiptap__tool"
            :class="{ 'q-tiptap__tool--active': tool.active }"
            :disabled="tool.disabled"
            :aria-label="tool.label"
            :aria-pressed="tool.active"
            :title="tool.label"
            @mousedown.prevent
            @click="tool.run"
          >
            <Icon :icon="tool.icon" aria-hidden="true" />
          </button>
          <button
            v-else-if="tool.kind === 'color'"
            type="button"
            class="q-tiptap__tool q-tiptap__tool--color"
            :class="{
              'q-tiptap__tool--active': tool.active,
              'q-tiptap__tool--disabled': tool.disabled,
            }"
            :disabled="tool.disabled"
            :aria-label="tool.label"
            :aria-haspopup="true"
            :aria-expanded="colorOpen ? 'true' : 'false'"
            :title="tool.label"
            @mousedown.prevent
            @click="togglePalette($event)"
          >
            <Icon :icon="tool.icon" aria-hidden="true" />
            <span class="q-tiptap__color-bar" :style="{ backgroundColor: tool.swatch }" />
          </button>
          </template>
        </template>
      </div>
    </div>

    <div class="q-tiptap__body">
      <span v-if="showPlaceholder" class="q-tiptap__placeholder" aria-hidden="true">
        {{ placeholder }}
      </span>
      <div class="q-tiptap__editor" :style="editorStyle">
        <editor-content :editor="editor" />
      </div>
    </div>
  </div>

  <!-- Drag handle : poignée pour déplacer les blocs (survol bord gauche) -->
  <DragHandle
    v-if="editor && !disable && !readonly"
    :editor="editor"
    :nested="DRAG_HANDLE_NESTED"
    plugin-key="qTipTapDragHandle"
  >
    <span class="q-tiptap__drag-handle">
      <Icon :icon="icons.gripVertical" aria-hidden="true" />
    </span>
  </DragHandle>

  <!-- Bubble menu : barre de formatage contextuelle (sélection de texte) -->
  <BubbleMenu v-if="editor" :editor="editor" :should-show="bubbleShouldShow">
    <div class="q-tiptap__bubble">
      <button
        v-for="tool in bubbleTools"
        :key="tool.label"
        type="button"
        class="q-tiptap__bubble-btn"
        :class="{ 'q-tiptap__bubble-btn--active': tool.active }"
        :disabled="!editor.isEditable"
        :aria-label="tool.label"
        :title="tool.label"
        @mousedown.prevent
        @click="tool.run"
      >
        <Icon :icon="tool.icon" aria-hidden="true" />
      </button>
      <span class="q-tiptap__bubble-sep" />
      <button
        type="button"
        class="q-tiptap__bubble-btn q-tiptap__tool--color"
        :class="{ 'q-tiptap__bubble-btn--active': !!paletteCurrent }"
        :disabled="!editor.isEditable"
        aria-label="Text color"
        title="Text color"
        @mousedown.prevent
        @click="togglePalette($event)"
      >
        <Icon :icon="icons.palette" aria-hidden="true" />
        <span class="q-tiptap__color-bar" :style="{ backgroundColor: paletteCurrent || 'transparent' }" />
      </button>
    </div>
  </BubbleMenu>

  <!-- Palette de couleurs (téléportée au body — la toolbar est dans un
       conteneur overflow:hidden qui clipperait un popover absolu) -->
  <Teleport to="body">
    <div
      v-if="colorOpen"
      class="q-tiptap__palette"
      role="dialog"
      aria-label="Text color"
      :style="paletteStyle"
    >
      <div class="q-tiptap__palette-title">Text color</div>
      <div class="q-tiptap__palette-swatches">
        <button
          v-for="color in PRESET_COLORS"
          :key="color"
          type="button"
          class="q-tiptap__swatch"
          :class="{ 'q-tiptap__swatch--active': paletteCurrent.toLowerCase() === color.toLowerCase() }"
          :style="{ backgroundColor: color }"
          :title="color"
          :aria-label="color"
          @mousedown.prevent
          @click="applyColor(color)"
        />
        <button
          type="button"
          class="q-tiptap__swatch q-tiptap__swatch--none"
          :class="{ 'q-tiptap__swatch--active': !paletteCurrent }"
          title="No color"
          aria-label="No color"
          @mousedown.prevent
          @click="removeColor"
        />
      </div>
      <label class="q-tiptap__palette-custom">
        <input
          type="color"
          :value="paletteCurrent || picked"
          aria-label="Custom color"
          @input="onColorInput"
        />
        <span>Custom…</span>
      </label>
    </div>
  </Teleport>

  <!-- Saisie image / lien par URL (composants dnax.ui, pas de prompt) -->
  <q-dialog v-model="dialogOpen">
    <q-dialog-header :title="dialogTitle" description="Paste a URL" show-close />
    <div class="q-tiptap__dialog">
      <q-input
        v-model="dialogUrl"
        outlined
        dense
        :label="dialogUrlLabel"
        :placeholder="dialogUrlPlaceholder"
      />
      <q-input
        v-if="dialogMode === 'image'"
        v-model="dialogAlt"
        outlined
        dense
        label="Alt text (optional)"
        placeholder="Accessible description"
      />
    </div>
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="dialogOpen = false" />
      <q-btn
        no-caps
        color="primary"
        :label="dialogSubmitLabel"
        :disable="!dialogUrl.trim()"
        @click="submitDialog"
      />
    </q-dialog-footer>
  </q-dialog>
</template>
