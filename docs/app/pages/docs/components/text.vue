<script setup lang="ts">
// Text — documentation du composant QText : texte avec troncature multi-lignes + transitions.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const text = useComponent(() => "QText")
const textSource = componentSource("QText")
const tag = componentTag("QText")

const LONG = "The quick brown fox jumps over the lazy dog and keeps running through the fields, past the river and into the woods where the tall pines sway in the evening breeze."

// — Démo transitions —
const effect = ref("fade")
const effects = [
  { label: "Fade", value: "fade" },
  { label: "Fade up", value: "fade-up" },
  { label: "Fade down", value: "fade-down" },
  { label: "Fade left", value: "fade-left" },
  { label: "Fade right", value: "fade-right" },
  { label: "Zoom", value: "zoom" },
  { label: "Blur", value: "blur" },
  { label: "Slide up", value: "slide-up" },
  { label: "Slide down", value: "slide-down" },
  { label: "Slide left", value: "slide-left" },
  { label: "Slide right", value: "slide-right" },
]
const phrases = [
  "Hello, world!",
  "Build amazing UIs.",
  "Transitions make text alive.",
  "Stay curious ✨",
]
const phraseIndex = ref(0)
const phrase = ref(phrases[0])
const nextPhrase = () => {
  phraseIndex.value = (phraseIndex.value + 1) % phrases.length
  phrase.value = phrases[phraseIndex.value]
}

const usageBasic = `<q-text text="The quick brown fox jumps over the lazy dog." />

<!-- Le slot remplace la prop text (tout contenu) -->
<q-text>
  Slots accept <b>rich content</b> — <em>markup</em>, components, anything.
</q-text>`

const usageLines = `<div class="col">
  <q-text :lines="1" :text="LONG" />
  <q-text :lines="2" :text="LONG" />
  <q-text :lines="3" :text="LONG" />
</div>
<!-- Hover a truncated line: the full text appears in the tooltip (title). -->`

const usageGenerate = `<q-text :text="LONG" generate />
<!-- Chaque mot se révèle en séquence : blur + fondu + translation, une seule fois. -->`

const usageHighlight = `<q-text :text="LONG" highlight="fox" />
<!-- Le marqueur se dessine de gauche à droite — couleur via --q-highlight-color. -->`

const usageBreathing = `<q-text :text="LONG" breathing />
<!-- Chaque mot s'estompe en cascade, en boucle — durée via --q-breathe-duration. -->`

const usageTag = `<q-text tag="h3" text="Rendered as an h3" />
<q-text tag="span" text="Inline span element" />
<q-text tag="p" text="Default paragraph tag" />`

const usageTransitions = `<q-select
  v-model="effect"
  :options="effects"
  emit-value
  option-label="label"
  option-value="value"
  outlined
  dense
  label="Effect"
/>
<q-btn flat no-caps icon="refresh-cw" label="Change text" @click="next()" />

<q-text :text="phrase" :transition="effect" :transition-duration="400" tag="h3" />`

const scriptLines = `import { ref } from "vue"

const LONG = "The quick brown fox jumps over the lazy dog and keeps running through the fields, past the river and into the woods where the tall pines sway in the evening breeze."`

const scriptTransitions = `import { ref } from "vue"

const effect = ref("fade")
const effects = [
  { label: "Fade", value: "fade" },
  { label: "Fade up", value: "fade-up" },
  { label: "Fade down", value: "fade-down" },
  { label: "Fade left", value: "fade-left" },
  { label: "Fade right", value: "fade-right" },
  { label: "Zoom", value: "zoom" },
  { label: "Blur", value: "blur" },
  { label: "Slide up", value: "slide-up" },
  { label: "Slide down", value: "slide-down" },
  { label: "Slide left", value: "slide-left" },
  { label: "Slide right", value: "slide-right" },
]
const phrases = ["Hello, world!", "Build amazing UIs.", "Transitions make text alive.", "Stay curious ✨"]
const i = ref(0)
const phrase = ref(phrases[0])
const next = () => {
  i.value = (i.value + 1) % phrases.length
  phrase.value = phrases[i.value]
}`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Text</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A paragraph element with built-in <b>multi-line truncation</b> and
      <b>animated transitions</b>: set <code>lines</code> to clamp the text to
      that many lines with an ellipsis (full content on hover via
      <code>title</code>), pass <code>transition</code> (fade, zoom, slide…) to
      animate the text each time it changes, <code>breathing</code> for a
      soft word-by-word pulse, <code>generate</code> to reveal it word by word,
      or <code>highlight</code> to draw a marker over a substring. For captions
      overlaid on images, see
      <a class="doc-link" href="/docs/components/text-caption">QTextCaption</a>.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Pass the text through the <code>text</code> prop, or use the default slot
        for rich content.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-text text="The quick brown fox jumps over the lazy dog." />
          <q-text>
            Slots accept <b>rich content</b> — <em>markup</em>, components,
            anything.
          </q-text>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Line clamping ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Line clamping</h2>
      <p class="doc-note">
        <code>lines</code> truncates to 1, 2, 3… lines with an ellipsis. Hover a
        truncated paragraph: the <code>title</code> attribute reveals the full
        text.
      </p>

      <docs-demo :code="usageLines" lang="html" filename="App.vue" :script="scriptLines">
        <div class="demo-col">
          <q-text :lines="1" :text="LONG" />
          <q-text :lines="2" :text="LONG" />
          <q-text :lines="3" :text="LONG" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Tags ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Element tag</h2>
      <p class="doc-note">
        <code>tag</code> changes the rendered element (default
        <code>p</code>) — useful for headings or inline text.
      </p>

      <docs-demo :code="usageTag" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-text tag="h3" text="Rendered as an h3" />
          <q-text tag="span" text="Inline span element" />
          <q-text tag="p" text="Default paragraph tag" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Transitions ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Transitions</h2>
      <p class="doc-note">
        <code>transition</code> replays an animation whenever the
        <code>text</code> prop changes: <code>fade</code>, directional fades,
        <code>zoom</code>, <code>blur</code> or <code>slide-*</code> — tune the
        speed with <code>transition-duration</code>. Animations respect
        <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageTransitions" lang="html" filename="App.vue" :script="scriptTransitions">
        <div class="demo-transitions">
          <div class="demo-transitions__controls">
            <q-select
              v-model="effect"
              :options="effects"
              emit-value
              option-label="label"
              option-value="value"
              outlined
              dense
              label="Effect"
              class="demo-transitions__select"
            />
            <q-btn flat no-caps icon="lucide:refresh-cw" label="Change text" @click="nextPhrase" />
          </div>
          <q-text
            :text="phrase"
            :transition="effect"
            :transition-duration="400"
            tag="h3"
            class="demo-transitions__text"
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Generate ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Generate</h2>
      <p class="doc-note">
        <code>generate</code> reveals the words one by one — blur + fade + a
        slight rise — like text being generated live (Inspira text-generate
        style). Replays when <code>text</code> changes; respects
        <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageGenerate" lang="html" filename="App.vue" :script="scriptLines">
        <q-text :text="LONG" generate />
      </docs-demo>
    </section>

    <!-- ═══════ Highlight ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Highlight</h2>
      <p class="doc-note">
        <code>highlight</code> marks a substring of <code>text</code> with a
        marker that draws itself from left to right (Inspira highlight-text
        style). Tune the color with the <code>--q-highlight-color</code> CSS
        variable; respects <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageHighlight" lang="html" filename="App.vue" :script="scriptLines">
        <q-text :text="LONG" highlight="fox" />
      </docs-demo>
    </section>

    <!-- ═══════ Breathing ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Breathing</h2>
      <p class="doc-note">
        <code>breathing</code> makes each word fade out and back in a gentle,
        continuous loop with a cascade delay — the Inspira breathing-text look.
        Tune the cycle with the <code>--q-breathe-duration</code> CSS variable;
        respects <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageBreathing" lang="html" filename="App.vue" :script="scriptLines">
        <q-text :text="LONG" breathing />
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QText API</h2>
      <docs-api :comp="text" :source="textSource" />
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
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
.doc-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}
.doc-link:hover {
  text-decoration: underline;
}

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  margin: 0 auto;
}

.demo-transitions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.demo-transitions__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.demo-transitions__select {
  width: 180px;
}
.demo-transitions__text {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--primary);
}
</style>
