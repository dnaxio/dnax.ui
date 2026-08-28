<script setup lang="ts">
// QSyntax — bloc de code avec coloration syntaxique Shiki (https://shiki.style).
// <q-syntax code="const a = 1" lang="ts" theme="github-dark" filename="app.ts" copy />
// code peut venir de la prop `code` ou du slot par défaut.
// Rendu côté client : le code brut s'affiche en fallback, puis est surligné.
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue"
import { createHighlighter, type Highlighter } from "shiki"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"

const DEFAULT_THEME = "github-dark-default"

// Langages chargés par défaut (grammaires chargées à la demande par Shiki).
// Les autres langages sont chargés via loadLanguage ; repli sur "text" si inconnu.
const DEFAULT_LANGS = [
  "vue", "ts", "js", "tsx", "jsx", "html", "css", "scss", "json", "jsonc",
  "bash", "markdown", "yaml", "python", "go", "rust", "sql",
]

interface Props {
  /** Code à afficher (sinon contenu du slot par défaut) */
  code?: string
  /** Langage Shiki : vue, ts, js, html, css, json, bash, markdown, yaml… */
  lang?: string
  /** Thème Shiki (défaut : github-dark-default) */
  theme?: string
  /** Nom de fichier affiché dans la barre de titre */
  filename?: string
  /** Bouton copier */
  copy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  lang: "text",
  theme: DEFAULT_THEME,
  filename: "",
  copy: false,
})

const slots = useSlots()

// Texte du slot par défaut (si pas de prop code)
const slotCode = computed(() => {
  const extract = (children: unknown): string => {
    if (typeof children === "string") return children
    if (Array.isArray(children)) return children.map(extract).join("")
    if (children && typeof children === "object" && "children" in children) {
      return extract((children as { children: unknown }).children)
    }
    return ""
  }
  return (slots.default?.() ?? []).map((v) => extract(v.children)).join("")
})

const source = computed(() => props.code ?? slotCode.value)

// Highlighter singleton : une seule instance pour toute l'application
let highlighterPromise: Promise<Highlighter> | null = null
const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: [DEFAULT_THEME],
    langs: DEFAULT_LANGS,
    engine: createJavaScriptRegexEngine(),
  })
  return highlighterPromise
}

const html = ref("")
const highlighted = ref(false)
const error = ref(false)

const highlight = async () => {
  const code = source.value
  if (!code) {
    html.value = ""
    highlighted.value = false
    return
  }
  try {
    const highlighter = await getHighlighter()

    // Thème custom chargé à la demande
    let theme = props.theme
    if (theme !== DEFAULT_THEME) {
      try {
        await highlighter.loadTheme(theme as never)
      } catch {
        theme = DEFAULT_THEME
      }
    }

    // Langage custom chargé à la demande ; repli sur "text"
    let lang = props.lang
    if (lang !== "text" && !highlighter.getLoadedLanguages().includes(lang)) {
      try {
        await highlighter.loadLanguage(lang as never)
      } catch {
        lang = "text"
      }
    }

    try {
      html.value = highlighter.codeToHtml(code, { lang, theme })
    } catch {
      html.value = highlighter.codeToHtml(code, { lang, theme: DEFAULT_THEME })
    }
    highlighted.value = true
    error.value = false
  }
  catch (e) {
    console.error("[QSyntax]", e)
    error.value = true
  }
}

watch(() => [source.value, props.lang, props.theme], () => {
  highlighted.value = false
  highlight()
})
onMounted(highlight)

// — Copier —
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined
const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(source.value)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1600)
  }
  catch {
    /* presse-papiers indisponible */
  }
}
onBeforeUnmount(() => clearTimeout(copyTimer))
</script>

<template>
  <div class="q-syntax" :class="{ 'q-syntax--error': error }">
    <div v-if="filename || copy" class="q-syntax__bar">
      <span v-if="filename" class="q-syntax__filename">
        <Icon :icon="icons.fileCode" aria-hidden="true" />
        {{ filename }}
      </span>
      <button
        v-if="copy"
        type="button"
        class="q-syntax__copy"
        :class="{ 'q-syntax__copy--done': copied }"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="onCopy"
      >
        <Icon :icon="copied ? icons.check : icons.copy" aria-hidden="true" />
        {{ copied ? "Copied" : "Copy" }}
      </button>
    </div>

    <div v-if="highlighted" class="q-syntax__body" v-html="html" />
    <pre v-else class="q-syntax__plain"><code>{{ source }}</code></pre>
  </div>
</template>
