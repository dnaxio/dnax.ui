<script setup lang="ts">
// Tiptap — documentation du composant QTiptap : éditeur riche Tiptap v3,
// v-model = HTML, toolbar complète + bubble menu + drag handle + mentions.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const editor = useComponent(() => "QTiptap")
const editorSource = componentSource("QTiptap")
const tag = componentTag("QTiptap")

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

// — Démo v-model —
const html = ref(INITIAL)

const usageModel = `<q-tiptap v-model="html" :mentions="mentions" />`

const scriptModel = `import { ref } from "vue"

const html = ref("<p>Hello <strong>Tiptap</strong> — this editor is bound with <em>v-model</em>.</p>")

const mentions = [
  { label: "Ada Lovelace", value: "ada" },
  { label: "Grace Hopper", value: "grace" },
  { label: "Alan Turing", value: "alan" },
]`

// — Démo UI contextuelle (bubble + drag handle) —
const richHtml = ref(RICH)

const usageContext = `<q-tiptap v-model="richHtml" :mentions="mentions" />`

const scriptContext = `import { ref } from "vue"

const richHtml = ref("<h1>…</h1><ul>…</ul>")`

// — Table des matières —
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

const usageToc = `<q-tiptap ref="tocEditor" v-model="tocHtml" @update:toc="onToc" />`

const scriptToc = `import { ref } from "vue"

const toc = ref([])
const tocEditor = ref(null)
const tocHtml = ref("<h1>Intro</h1><p>…</p><h2>Getting started</h2>…")

const onToc = (items) => {
  toc.value = items
}

const scrollTo = (id) => {
  tocEditor.value?.scrollToHeading(id) // scroll interne à l'éditeur
}`
const mentionHtml = ref("<p>Type @ to mention someone — try it!</p>")

const usageMentions = `<q-tiptap v-model="mentionHtml" :mentions="people" />`

const scriptMentions = `const people = [
  { label: "Ada Lovelace", value: "ada" },
  { label: "Grace Hopper", value: "grace" },
  { label: "Alan Turing", value: "alan" },
]`

const outputMention = `<span data-type="mention" data-id="ada" data-label="Ada Lovelace">@Ada Lovelace</span>`

// — Variantes / états —
const emptyHtml = ref("")
const paddingHtml = ref("<p>Same content, two paddings: default above, a custom one below.</p>")
const stateHtml = ref("<p>An editable <strong>square</strong> editor (top) and a disabled one (bottom).</p>")

const usageVariants = `<q-tiptap v-model="html" min-height="140px" placeholder="Write something…" />

<q-tiptap v-model="html" filled dense min-height="120px" />

<q-tiptap v-model="emptyHtml" min-height="140px" placeholder="Type to reveal the placeholder…" />`

const scriptVariants = `import { ref } from "vue"

const html = ref("<p>Hello <strong>Tiptap</strong></p>")
const emptyHtml = ref("")`

const usagePadding = `<q-tiptap v-model="paddingHtml" />

<q-tiptap v-model="paddingHtml" padding="18px 22px 6%" />`

const scriptPadding = `import { ref } from "vue"

const paddingHtml = ref("<p>Same content, two paddings.</p>")`

const usageStates = `<q-tiptap v-model="stateHtml" square />

<q-tiptap v-model="stateHtml" square toolbar disable min-height="140px" />`

const scriptStates = `import { ref } from "vue"

const stateHtml = ref("<p>An editable <strong>square</strong> editor and a disabled one.</p>")`

const usageReadonly = `<q-tiptap
  :model-value="readonlyHtml"
  readonly
  min-height="120px"
/>`

const readonlyHtml = "<h2>Read-only document</h2><p>Rendered by Tiptap but not editable — <strong>selection</strong> and <em>copy</em> still work.</p>"
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Tiptap</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A full-featured rich text editor powered by <b>Tiptap v3</b> (ProseMirror).
      <b>&lt;q-tiptap&gt;</b> is a <code>v-model</code> component that reads and
      writes <b>HTML</b>. It ships with everything built-in: a complete toolbar
      (undo/redo, headings, alignment, marks, text color, links, bullet / ordered
      / task lists, blockquote, code blocks, images), a contextual
      <b>bubble menu</b> on text selection, a <b>drag handle</b> to re-order
      blocks, and <code>@mentions</code> when a list is provided. Styled with the
      design tokens in light &amp; dark; SSR-safe (the ProseMirror editor is only
      created client-side).
    </p>

    <!-- ═══════ v-model & contenu ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">v-model &amp; content</h2>
      <p class="doc-note">
        Bind an HTML string with <code>v-model</code>. The editor emits
        <code>@update:model-value</code> on every change and only rewrites the
        document when the external value really differs — no cursor jump, no
        feedback loop. The value is plain, renderable HTML
        (<code>v-html</code> safe to display anywhere), ready to store in a
        database.
      </p>

      <docs-demo :code="usageModel" lang="html" filename="App.vue" :script="scriptModel">
        <div class="demo-col">
          <q-tiptap v-model="html" :mentions="MENTIONS" />
          <div class="demo-output">
            <div class="demo-output__label">Output (v-model)</div>
            <div class="demo-output__html" v-html="html" />
          </div>
        </div>
      </docs-demo>

      <p class="doc-note">
        On the server (SSR/SSG) or before hydration, the area renders empty —
        the editor boots on the client (<code>onMounted</code>). <code>disable</code>
        / <code>readonly</code> set the document to read-only and disable the
        toolbar, bubble menu and drag handle.
      </p>
    </section>

    <!-- ═══════ Toolbar ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Toolbar</h2>
      <p class="doc-note">
        The built-in toolbar (prop <code>toolbar</code>, default
        <code>true</code>) covers the everyday formatting needs, grouped:
      </p>
      <ul class="doc-list">
        <li><b>History</b> — undo / redo.</li>
        <li><b>Blocks</b> — paragraph, headings H1-H3, alignment left / center / right.</li>
        <li><b>Marks</b> — font size, bold, italic, underline, strike, inline code, link / remove link, text color (palette), remove color.</li>
        <li><b>Blocks &amp; insert</b> — bullet list, ordered list, task list (with <code>q-checkbox</code>), blockquote, code block, image (URL), horizontal rule.</li>
        <li><b>Clear</b> — remove all formatting from the selection.</li>
      </ul>
      <p class="doc-note">
        Images and links are entered through a proper <code>q-dialog</code> with
        <code>q-input</code> fields (never <code>window.prompt</code>); the text
        color picker opens a small palette with presets, a
        <b>“No color”</b> swatch to remove the color, and a custom color input.
      </p>
    </section>

    <!-- ═══════ UI contextuelle ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Bubble menu &amp; drag handle</h2>
      <p class="doc-note">
        No extra code needed:
      </p>
      <ul class="doc-list">
        <li><b>Bubble menu</b> — select text: a floating bar appears with bold, italic, underline, strike, inline code, link (dialog), remove color and clear formatting. Clicks never lose the selection.</li>
        <li><b>Drag handle</b> — hover the <b>left edge</b> of any block: a grip appears. Drag to move paragraphs, headings, list items, images… even nested items (lists, checklists).</li>
      </ul>
      <p class="doc-note">
        Try it below: hover the left edge of the heading or a list item to drag
        it, select the centered paragraph to trigger the bubble menu, check a
        task box:
      </p>

      <docs-demo :code="usageContext" lang="html" filename="App.vue" :script="scriptContext">
        <q-tiptap v-model="richHtml" :mentions="MENTIONS" />
      </docs-demo>
    </section>

    <!-- ═══════ Table of contents ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Table of contents</h2>
      <p class="doc-note">
        &lt;q-tiptap&gt; tracks every heading and re-emits the list on each change
        through <code>@update:toc</code> — each item carries
        <code>id</code>, <code>textContent</code>, <code>level</code>,
        <code>originalLevel</code>, <code>itemIndex</code>, <code>pos</code>,
        <code>isActive</code> and <code>isScrolledOver</code>. Render the list
        however you want (below: live, level-indented, click to scroll):
      </p>

      <docs-demo :code="usageToc" lang="html" filename="App.vue" :script="scriptToc">
        <div class="demo-toc">
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
      </docs-demo>
    </section>

    <!-- ═══════ Mentions ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Mentions</h2>
      <p class="doc-note">
        Pass a list of <code>{ label, value }</code> items with the
        <code>mentions</code> prop — typing <code>@</code> opens a popup anchored
        at the caret, filtered live on <code>label</code> or <code>value</code>.
        Navigate with <code>↑</code>/<code>↓</code>, confirm with
        <code>Enter</code>/<code>Tab</code>, or click. When the prop is empty the
        feature is inactive.
      </p>

      <docs-demo :code="usageMentions" lang="html" filename="App.vue" :script="scriptMentions">
        <q-tiptap v-model="mentionHtml" :mentions="MENTIONS" />
      </docs-demo>

      <p class="doc-note">
        The mention is stored as a node with <code>data-id</code> /
        <code>data-label</code>, so the HTML round-trips losslessly:
      </p>
      <q-syntax :code="outputMention" lang="html" filename="output.html" copy />
    </section>

    <!-- ═══════ Variantes & états ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants &amp; states</h2>
      <p class="doc-note">
        <code>min-height</code> sizes the editing area,
        <code>placeholder</code> shows while the document is empty,
        <code>filled</code> switches to the soft background variant and
        <code>dense</code> tightens the toolbar.
        <code>padding</code> (CSS value, default <code>5%</code> on all four
        sides) controls the padding of the writing area, and everything is
        tunable per editor.
      </p>

      <docs-demo :code="usageVariants" lang="html" filename="App.vue" :script="scriptVariants">
        <div class="demo-col">
          <q-tiptap v-model="html" min-height="140px" placeholder="Write something…" />
          <q-tiptap v-model="html" filled dense min-height="120px" />
          <q-tiptap v-model="emptyHtml" min-height="140px" placeholder="Type to reveal the placeholder…" />
        </div>
      </docs-demo>

      <h3 class="doc-h3">Read-only &amp; disabled</h3>
      <p class="doc-note">
        <code>readonly</code> keeps the text visible (selection / copy allowed)
        but disables editing, the toolbar, bubble menu and drag handle;
        <code>disable</code> additionally greys everything out and blocks pointer
        events.
      </p>

      <docs-demo :code="usageReadonly" lang="html" filename="App.vue">
        <q-tiptap :model-value="readonlyHtml" readonly min-height="120px" />
      </docs-demo>

      <h3 class="doc-h3">Padding</h3>
      <p class="doc-note">
        <code>padding</code> accepts any CSS padding for the writing area. The
        default is <code>5%</code> on all four sides (top, right, bottom,
        left). Compare the default (top) with a custom padding (bottom,
        <code>18px 22px 6%</code>):
      </p>

      <docs-demo :code="usagePadding" lang="html" filename="App.vue" :script="scriptPadding">
        <div class="demo-col">
          <q-tiptap v-model="paddingHtml" />
          <q-tiptap v-model="paddingHtml" padding="18px 22px 6%" />
        </div>
      </docs-demo>

      <h3 class="doc-h3">Square, no toolbar &amp; disabled</h3>
      <p class="doc-note">
        <code>square</code> removes the corner radius, <code>toolbar="false"</code>
        hides the toolbar (content only), and <code>disable</code> greys the
        whole editor out and blocks pointer events:
      </p>

      <docs-demo :code="usageStates" lang="html" filename="App.vue" :script="scriptStates">
        <div class="demo-col">
          <q-tiptap v-model="stateHtml" square />
          <q-tiptap v-model="stateHtml" square toolbar disable min-height="140px" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QTiptap API</h2>
      <docs-api :comp="editor" :source="editorSource" />
    </section>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.demo-output code,
.doc-lead code,
.doc-list code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
.doc-list {
  margin: 0 0 16px;
  padding-left: 1.2em;
  font-size: 14px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 700px;
}
.doc-list li {
  margin: 2px 0;
}

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
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
</style>
