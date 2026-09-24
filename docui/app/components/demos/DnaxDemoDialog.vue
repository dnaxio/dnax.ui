<script setup lang="ts">
// Démos live de la page Dialog (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "simple" | "header-footer" | "transitions" | "position" | "maximized" | "maximized-transitions" | "content" | "trigger"
}>()

const open = ref(false)
const openConfirm = ref(false)
const openBottom = ref(false)
const openT = ref(false)
const openMax = ref(false)
const openMaxT = ref(false)
const maxTransition = ref<(typeof transitions)[number]>("fade")
const maxDuration = ref(200)
const durations = [100, 200, 350, 500, 800] as const
const openMaxWith = (t: (typeof transitions)[number]) => {
  maxTransition.value = t
  openMaxT.value = true
}
const eventLog = ref("")

const transition = ref<"fade" | "zoom" | "slide-up" | "slide-down" | "sheet-up" | "sheet-down" | "slide-left" | "slide-right" | "swipe-left" | "swipe-right">("fade")
const transitions = ["fade", "zoom", "slide-up", "slide-down", "sheet-up", "sheet-down", "slide-left", "slide-right", "swipe-left", "swipe-right"] as const
const openWith = (t: (typeof transitions)[number]) => {
  transition.value = t
  openT.value = true
}

const openScroll = ref(false)
const scrollParagraphs = Array.from({ length: 12 }, (_, i) => {
  const base = [
    "A scrollable body keeps the header and footer fixed while the content moves.",
    "The panel is a flex column capped at 90vh; the scrollable body shrinks and scrolls internally.",
    "In maximized dialogs the panel never scrolls (overflow: hidden) — scrollable is required.",
    "Overscroll-behavior: contain stops the page behind from bouncing on iOS.",
    "The header and footer are toolbar bars, matching the app chrome (q-header / q-footer).",
  ]
  return `${i + 1}. ${base[i % base.length] ?? ""}`
})
</script>

<template>
  <template v-if="demo === 'simple'">
    <q-btn color="primary" label="Open dialog" @click="open = true" />
    <p v-if="eventLog" class="demo-dialog-log">Last event: <code>{{ eventLog }}</code></p>

    <q-dialog v-model="open" @show="eventLog = 'show'" @hide="eventLog = 'hide'">
      <div class="demo-dialog-body">
        <h3 class="demo-dialog-title">Welcome</h3>
        <p class="demo-p">
          This dialog is driven by a boolean <code>v-model</code>. Click the backdrop,
          press <code>Escape</code>, or use the buttons below to close it.
        </p>
        <div class="demo-dialog-actions">
          <q-btn flat label="Cancel" @click="open = false" />
          <q-btn color="primary" label="Got it" @click="open = false" />
        </div>
      </div>
    </q-dialog>
  </template>

  <template v-else-if="demo === 'header-footer'">
    <q-btn color="negative" outline label="Delete account" @click="openConfirm = true" />

    <q-dialog v-model="openConfirm">
      <q-dialog-header title="Confirm deletion" description="This action cannot be undone." show-close />
      <div class="demo-dialog-body">
        <p class="demo-p">
          QDialogHeader renders the title, an optional description and a close button;
          QDialogFooter hosts the action buttons at the bottom of the panel.
        </p>
      </div>
      <q-dialog-footer>
        <q-btn flat label="Cancel" @click="openConfirm = false" />
        <q-btn color="negative" label="Delete" @click="openConfirm = false" />
        <q-btn flat round dense icon="lucide:x" v-close aria-label="Close (v-close)" />
      </q-dialog-footer>
    </q-dialog>
  </template>

  <template v-else-if="demo === 'transitions'">
    <div class="demo-row">
      <q-btn
        v-for="t in transitions"
        :key="t"
        outline
        color="primary"
        no-caps
        :label="t"
        @click="openWith(t)"
      />
    </div>

    <q-dialog v-model="openT" :transition="transition">
      <q-dialog-header
        :title="'Transition: ' + transition"
        description="Click the backdrop or press Escape to close."
      />
      <div class="demo-dialog-body">
        <p class="demo-p">Same dialog, different <code>transition</code> each time.</p>
      </div>
    </q-dialog>
  </template>

  <template v-else-if="demo === 'position'">
    <q-btn outline label="Bottom dialog" @click="openBottom = true" />

    <q-dialog v-model="openBottom" position="bottom" transition="slide-up">
      <q-dialog-header title="Now playing" description="A sheet-like dialog anchored to the bottom edge" />
      <div class="demo-dialog-body">
        <p class="demo-p">
          <code>position</code> accepts <code>standard | top | right | bottom | left</code>;
          the transition follows the position automatically unless <code>transition</code>
          overrides it (<code>fade | zoom | slide-up | …</code>).
        </p>
      </div>
    </q-dialog>
  </template>

  <template v-else-if="demo === 'maximized'">
    <q-btn color="primary" label="Fullscreen dialog" @click="openMax = true" />

    <q-dialog v-model="openMax" maximized>
      <q-dialog-header title="Settings" description="A maximized dialog covers the whole screen" />
      <div class="demo-dialog-body">
        <p class="demo-p">
          <code>maximized</code> stretches the panel edge-to-edge (100vw × 100dvh)
          with square corners — the iOS fullscreen pattern. The header and footer
          respect the safe-area insets.
        </p>
      </div>
      <q-dialog-footer>
        <q-btn flat label="Close" @click="openMax = false" />
        <q-btn color="primary" label="Save" @click="openMax = false" />
      </q-dialog-footer>
    </q-dialog>
  </template>

  <template v-else-if="demo === 'maximized-transitions'">
    <div class="demo-row">
      <q-btn v-for="t in transitions" :key="t" outline color="primary" no-caps :label="t" @click="openMaxWith(t)" />
    </div>
    <div class="demo-row">
      <q-btn
        v-for="d in durations"
        :key="d"
        flat
        color="primary"
        no-caps
        :label="d + 'ms'"
        :class="{ 'demo-btn--active': d === maxDuration }"
        @click="maxDuration = d"
      />
    </div>

    <q-dialog v-model="openMaxT" maximized :transition="maxTransition" :transition-duration="maxDuration">
      <q-dialog-header :title="'Maximized · ' + maxTransition + ' · ' + maxDuration + 'ms'" description="Fullscreen + transition + duration" />
      <div class="demo-dialog-body">
        <p class="demo-p">
          Combine <code>maximized</code>, any <code>transition</code> and a
          <code>transition-duration</code> in ms — each click re-opens the fullscreen
          panel with the chosen entrance animation and speed.
        </p>
      </div>
      <q-dialog-footer>
        <q-btn flat label="Close" @click="openMaxT = false" />
        <q-btn color="primary" label="Done" @click="openMaxT = false" />
      </q-dialog-footer>
    </q-dialog>
  </template>

  <template v-else-if="demo === 'content'">
    <q-btn color="primary" outline label="Scrollable dialog" @click="openScroll = true" />
    <q-dialog v-model="openScroll">
      <q-dialog-header title="Terms of service" description="Scroll to read the full agreement" show-close />
      <q-dialog-content scrollable>
        <div class="demo-dialog-body">
          <p v-for="p in scrollParagraphs" :key="p" class="demo-p">{{ p }}</p>
        </div>
      </q-dialog-content>
      <q-dialog-footer>
        <q-btn flat label="Cancel" @click="openScroll = false" />
        <q-btn unelevated no-caps color="primary" label="Accept" @click="openScroll = false" />
      </q-dialog-footer>
    </q-dialog>
  </template>

  <template v-else-if="demo === 'trigger'">
    <q-btn color="primary" label="Open dialog" @click="open = true" />

    <q-dialog v-model="open">
      <q-dialog-header title="Trigger demo" description="QDialogTrigger renders inside the dialog slot" />
      <div class="demo-dialog-body">
        <p class="demo-p">
          The trigger calls <code>setOpen(true)</code> on its parent dialog. Because the
          dialog content only mounts while open, it is typically placed inside the dialog
          (for example to open a nested confirmation) — for opening from the page, bind
          <code>v-model</code> to a regular button.
        </p>
        <q-dialog-trigger label="Trigger button" />
      </div>
    </q-dialog>
  </template>
</template>

<style scoped>
/* contenu du panneau (rendu dans le slot de q-dialog) */
.demo-dialog-body {
  padding: 16px 20px;
}
.demo-dialog-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
}
.demo-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
}
.demo-dialog-log {
  margin-top: 10px;
  font-size: 13px;
  color: #8b93a1;
}
.demo-btn--active {
  background: rgb(25 118 210 / 0.12);
  border-radius: 8px;
}
</style>
