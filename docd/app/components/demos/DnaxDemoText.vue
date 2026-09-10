<script setup lang="ts">
// Live demos for the Text page (state kept per page).
// One component per page — the `demo` prop selects which demo to render.
import { ref } from "vue"

defineProps<{
  /** Demo identifier to render */
  demo: "basic" | "lines" | "tag" | "transitions" | "generate" | "highlight" | "breathing"
}>()

const LONG =
  "The quick brown fox jumps over the lazy dog and keeps running through the fields, past the river and into the woods where the tall pines sway in the evening breeze."

// — transitions —
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
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-col">
    <q-text text="The quick brown fox jumps over the lazy dog." />
    <q-text>
      Slots accept <b>rich content</b> — <em>markup</em>, components,
      anything.
    </q-text>
  </div>

  <div v-else-if="demo === 'lines'" class="demo-col">
    <q-text :lines="1" :text="LONG" />
    <q-text :lines="2" :text="LONG" />
    <q-text :lines="3" :text="LONG" />
  </div>

  <div v-else-if="demo === 'tag'" class="demo-col">
    <q-text tag="h3" text="Rendered as an h3" />
    <q-text tag="span" text="Inline span element" />
    <q-text tag="p" text="Default paragraph tag" />
  </div>

  <div v-else-if="demo === 'transitions'" class="demo-transitions">
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

  <q-text v-else-if="demo === 'generate'" :text="LONG" generate />

  <q-text v-else-if="demo === 'highlight'" :text="LONG" highlight="fox" />

  <q-text v-else-if="demo === 'breathing'" :text="LONG" breathing />
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
