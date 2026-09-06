<script setup lang="ts">
// QEditorJs — éditeur par blocs basé sur Editor.js (https://editorjs.io).
// v-model = données JSON : { time?, blocks: [{ type, data }], version? }.
// Tools par défaut : paragraph, header (H1-H3), list (bullet/ordered),
// checklist, quote, code, delimiter. Extensible via la prop `tools`.
// SSR-safe : l'instance Editor.js n'est créée qu'au montage (client).
// Note : Editor.js v2 injecte lui-même ses styles à l'init (aucun import CSS
// nécessaire) ; les surcharges de thème vivent dans styles/main.css.
import { onBeforeUnmount, onMounted, ref, watch } from "vue"

interface QEditorJsBlock {
  type: string
  data: Record<string, unknown>
}

interface QEditorJsData {
  time?: number
  blocks: QEditorJsBlock[]
  version?: string
}

interface Props {
  /** Données du document (v-model) — { blocks: [{ type, data }] } */
  data?: QEditorJsData | null
  /** Placeholder du bloc par défaut */
  placeholder?: string
  /** Hauteur minimale de la zone d'édition (défaut : 220px) */
  minHeight?: string
  /** Lecture seule */
  readonly?: boolean
  /** Désactivé (lecture seule + style grisé) */
  disable?: boolean
  /** Tools supplémentaires (défaut : paragraph, header, list, checklist, quote, code, delimiter) */
  tools?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  placeholder: "Write something…",
  minHeight: "220px",
  readonly: false,
  disable: false,
  tools: () => ({}),
})

const emit = defineEmits<{
  "update:modelValue": [data: QEditorJsData]
  ready: [editor: unknown]
}>()

const holderEl = ref<HTMLElement | null>(null)
let editor: any = null
let lastJson = ""
let internal = false

const isEditable = () => !props.readonly && !props.disable

const emitData = async () => {
  if (!editor) return
  try {
    const saved: QEditorJsData = (await editor.save()) as QEditorJsData
    internal = true
    lastJson = JSON.stringify(saved)
    emit("update:modelValue", saved)
    internal = false
  }
  catch {
    /* document invalide — ignoré */
  }
}

onMounted(async () => {
  const mod = await import("@editorjs/editorjs")
  const EditorJS = mod.default
  // Les packages tools Editor.js n'embarquent pas tous des types TS
  // @ts-ignore
  const Header = (await import("@editorjs/header")).default
  // @ts-ignore
  const Paragraph = (await import("@editorjs/paragraph")).default
  // @ts-ignore
  const List = (await import("@editorjs/list")).default
  // @ts-ignore
  const Checklist = (await import("@editorjs/checklist")).default
  // @ts-ignore
  const Quote = (await import("@editorjs/quote")).default
  // @ts-ignore
  const Code = (await import("@editorjs/code")).default
  // @ts-ignore
  const Delimiter = (await import("@editorjs/delimiter")).default

  const defaults: Record<string, any> = {
    paragraph: { class: Paragraph },
    header: { class: Header, inlineToolbar: true, config: { levels: [1, 2, 3] } },
    list: { class: List, inlineToolbar: true },
    checklist: { class: Checklist, inlineToolbar: true },
    quote: { class: Quote, inlineToolbar: true },
    code: { class: Code },
    delimiter: { class: Delimiter },
  }

  editor = new EditorJS({
    holder: holderEl.value as HTMLElement,
    tools: { ...defaults, ...props.tools },
    data: props.data ?? undefined,
    placeholder: props.placeholder,
    readOnly: !isEditable(),
    onChange: () => { emitData() },
    onReady: () => { emit("ready", editor) },
  })
  emit("ready", editor)
})

// Changement externe → render (sans boucle : on compare au dernier JSON émis)
watch(
  () => props.data,
  (value) => {
    if (internal || !editor) return
    const json = value ? JSON.stringify(value) : ""
    if (json === lastJson) return
    editor.render(value ?? { time: Date.now(), blocks: [], version: "2.31.6" })
      .then(() => { lastJson = json })
      .catch(() => { /* ignore */ })
  },
)

onBeforeUnmount(() => {
  if (editor && typeof editor.destroy === "function") editor.destroy()
  editor = null
})

// — Méthodes exposées —
const save = () => editor?.save() as Promise<QEditorJsData> | undefined
const clear = () => editor?.clear()
const getEditor = () => editor

defineExpose({ save, clear, getEditor })
</script>

<template>
  <div
    class="q-editor-js"
    :class="{ 'q-editor-js--readonly': readonly || disable, 'q-editor-js--disable': disable }"
  >
    <div ref="holderEl" class="q-editor-js__holder" :style="{ minHeight }" />
  </div>
</template>
