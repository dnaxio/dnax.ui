<script setup lang="ts">
// Live demos for the Tiptap page (state kept per page).
// One component per page — the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "model" | "context" | "toc" | "mentions" | "variants" | "readonly" | "padding" | "states"
}>()

const INITIAL = `<p>Hello <strong>Tiptap</strong> — this editor is bound with <em>v-model</em>.</p>
<ul>
  <li><p>Undo / redo, headings, lists, links…</p></li>
  <li><p>The output below updates on every change.</p></li>
</ul>`

const RICH = `<h1>Product announcement</h1>
<p style="text-align: center;">A <strong>centered</strong> paragraph — hover its left edge to grab it, select it to see the bubble menu.</p>
<ul>
  <li><p>Bullet list item</p></li>
  <li><p>Another bullet</p></li>
</ul>
<ol>
  <li><p>First step</p></li>
  <li><p>Second step</p></li>
</ol>
<p>Ship checklist:</p>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked="checked"><span></span></label><div><p>Ship the feature</p></div></li>
  <li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>Write the docs</p></div></li>
</ul>
<blockquote><p>A quoted idea worth keeping.</p></blockquote>
<p>Inline <code>code</code> and a <a href="https://tiptap.dev" target="_blank" rel="noopener">link</a>.</p>`

const MENTIONS = [
  { label: "Ada Lovelace", value: "ada" },
  { label: "Grace Hopper", value: "grace" },
  { label: "Alan Turing", value: "alan" },
]

// — v-model & content —
const html = ref(INITIAL)

// — bubble menu & drag handle —
const richHtml = ref(RICH)

// — table of contents —
const tocItems = ref<{ id: string; textContent: string; level: number }[]>([])
const tocHtml = ref(
  "<h1>Introduction</h1><p>The first chapter.</p><h2>Getting started</h2><p>Install and configure.</p><h3>Installation</h3><p>One command.</p><h2>API</h2><p>Props and events.</p>",
)

const tocEditor = ref<{ scrollToHeading?: (id: string) => void } | null>(null)

const onToc = (items: { id: string; textContent: string; level: number }[]) => {
  tocItems.value = items
}

const scrollToToc = (id: string) => {
  tocEditor.value?.scrollToHeading?.(id)
}

// — mentions —
const mentionHtml = ref("<p>Type @ to mention someone — try it!</p>")

// — variants & states —
const emptyHtml = ref("")
const paddingHtml = ref("<p>Same content, two paddings: default above, a custom one below.</p>")
const stateHtml = ref("<p>An editable <strong>square</strong> editor (top) and a disabled one (bottom).</p>")

const readonlyHtml = "<h2>Read-only document</h2><p>Rendered by Tiptap but not editable — <strong>selection</strong> and <em>copy</em> still work.</p>"
</script>

<template>
  <div v-if="demo === 'model'" class="demo-col">
    <q-tiptap v-model="html" :mentions="MENTIONS" />
    <div class="demo-output">
      <div class="demo-output__label">Output (v-model)</div>
      <div class="demo-output__html" v-html="html" />
    </div>
  </div>

  <q-tiptap v-else-if="demo === 'context'" v-model="richHtml" :mentions="MENTIONS" />

  <div v-else-if="demo === 'toc'" class="demo-toc">
    <q-tiptap ref="tocEditor" v-model="tocHtml" @update:toc="onToc" />
    <div class="demo-toc__panel">
      <div class="demo-toc__title">On this page</div>
      <p v-if="!tocItems.length" class="demo-toc__empty">
        No headings yet — add a title (H1-H3) to generate the list.
      </p>
      <button
        v-for="item in tocItems"
        :key="item.id"
        type="button"
        class="demo-toc__item"
        :style="{ paddingLeft: 8 + (item.level - 1) * 14 + 'px' }"
        @click="scrollToToc(item.id)"
      >
        {{ item.textContent }}
      </button>
    </div>
  </div>

  <q-tiptap v-else-if="demo === 'mentions'" v-model="mentionHtml" :mentions="MENTIONS" />

  <div v-else-if="demo === 'variants'" class="demo-col">
    <q-tiptap v-model="html" min-height="140px" placeholder="Write something…" />
    <q-tiptap v-model="html" filled dense min-height="120px" />
    <q-tiptap v-model="emptyHtml" min-height="140px" placeholder="Type to reveal the placeholder…" />
  </div>

  <q-tiptap v-else-if="demo === 'readonly'" :model-value="readonlyHtml" readonly min-height="120px" />

  <div v-else-if="demo === 'padding'" class="demo-col">
    <q-tiptap v-model="paddingHtml" />
    <q-tiptap v-model="paddingHtml" padding="18px 22px 6%" />
  </div>

  <div v-else-if="demo === 'states'" class="demo-col">
    <q-tiptap v-model="stateHtml" square />
    <q-tiptap v-model="stateHtml" square toolbar disable min-height="140px" />
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  max-width: 640px;
}

.demo-output {
  border: 1px dashed var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
}

.demo-output__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
  margin-bottom: 6px;
}

.demo-output__html :deep(h1),
.demo-output__html :deep(h2),
.demo-output__html :deep(h3) {
  margin: 0.4em 0;
}

.demo-output__html :deep(p) {
  margin: 0.3em 0;
}

.demo-toc {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 16px;
  align-items: start;
}

.demo-toc__panel {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.06);
}

.demo-toc__title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
  padding: 2px 6px 6px;
}

.demo-toc__empty {
  margin: 0;
  padding: 4px 6px;
  font-size: 12px;
  font-style: italic;
  color: #8b93a1;
}

.demo-toc__item {
  display: block;
  text-align: left;
  padding: 5px 6px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--foreground);
  font-size: 12px;
  cursor: pointer;
}

.demo-toc__item:hover {
  background: rgba(25, 118, 210, 0.1);
  color: var(--primary);
}

@media (max-width: 720px) {
  .demo-toc {
    grid-template-columns: 1fr;
  }
}
</style>
