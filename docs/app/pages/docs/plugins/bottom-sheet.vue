<script setup lang="ts">
// Docs — plugin $q.bottomSheet : panneau bas programmatique.
import { ref } from "vue"
import { usePlugin } from "@dnax/ui/runtime"
import DemoShareSheet from "~/components/DemoShareSheet.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const $q = usePlugin()

const setupCode = `import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

// Legacy: app.use(QPlugin) → this.$q anywhere
import { QPlugin } from "@dnax/ui"`

const providersCode = `<q-config-provider>
  <!-- rend automatiquement QDialogProvider, QNotifyProvider, QLoadingProvider,
       QBottomSheetProvider et QImagePreviewProvider -->
  <NuxtPage />
</q-config-provider>`

const bottomSheetCode = `const $q = usePlugin()

$q.bottomSheet.open({
  component: ShareSheet,          // SFC importé OU nom de composant global
  componentProps: { file: "report.pdf" },
  title: "Share",
  height: "60%",                  // hauteur du panneau (sinon max-height 90vh)
  rounded: "24px",                // coins hauts arrondis
  translucent: true,              // fond frosté (ou :translucent="70")
  transition: "zoom",             // slide-up (défaut) | fade | zoom
  dragThreshold: 60,              // seuil de drag pour fermer (défaut 80)
})
  .onOK((data) => console.log("choice:", data))
  .onCancel(() => console.log("cancelled"))`

const optionsCode = `<q-bottom-sheet v-model="open" height="70%" transition="fade" drag-threshold="60">
  <template #trigger>
    <q-btn color="primary" label="Open" />
  </template>
  <q-bottom-sheet-header title="Settings" description="Same options as the plugin" />
  <div class="body">…</div>
  <q-bottom-sheet-footer>
    <q-btn flat label="Close" @click="open = false" />
  </q-bottom-sheet-footer>
</q-bottom-sheet>`

const scriptOptions = `import { ref } from "vue"

const open = ref(false)`

const fullSheetCode = `<script setup lang="ts">
// Le composant DOIT commencer par <q-bottom-sheet> (pattern Quasar) :
// open est fourni par useBottomSheetPluginComponent() (déjà true).
import { useBottomSheetPluginComponent } from "@dnax/ui/runtime"

const { open, onDialogHide, onDialogOK, onDialogCancel } = useBottomSheetPluginComponent()
<\/script>

<template>
  <q-bottom-sheet v-model="open" @hide="onDialogHide">
    <q-bottom-sheet-header title="Confirm" description="This cannot be undone." />
    <div class="body">…</div>
    <q-bottom-sheet-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn color="negative" label="Delete" @click="onDialogOK" />
    </q-bottom-sheet-footer>
  </q-bottom-sheet>
</template>`

// — Démo live —
const log = ref<string[]>([])
const openSheet = () => {
  $q.bottomSheet
    .open({
      component: DemoShareSheet,
      componentProps: { file: "quarterly-report.pdf" },
      title: "Share file",
      description: "Choose where to send it",
      height: "62%",
      rounded: "24px",
      translucent: true,
      transition: "zoom",
    })
    .onOK((data) => {
      log.value.unshift(`ok → ${JSON.stringify(data)}`)
    })
    .onCancel(() => {
      log.value.unshift("cancel")
    })
    .onDismiss(() => {
      log.value.unshift("dismiss (backdrop / Esc / drag)")
    })
}
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Bottom Sheet</h1>
    <p class="guide__lead">
      <code>$q.bottomSheet</code> opens a bottom-anchored panel (built-in
      safe-area) — same principle as <code>$q.dialog</code>, rendered by the
      automatically mounted <code>QBottomSheetProvider</code>. Drag down,
      backdrop, <code>Esc</code> and browser back all dismiss it.
    </p>

    <section class="guide__section">
      <h2 class="guide__h2">Setup</h2>
      <p class="guide__note">
        Get <code>$q</code> with the <code>usePlugin()</code> composable, or install
        the <code>QPlugin</code> for a global <code>this.$q</code> access.
      </p>
      <q-syntax :code="setupCode" lang="ts" filename="app.vue" copy />
      <p class="guide__note">
        The providers are rendered automatically by the outermost
        <code>&lt;q-config-provider&gt;</code>:
      </p>
      <q-syntax :code="providersCode" lang="html" filename="app.vue" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Usage</h2>
      <p class="guide__note">
        Pass an SFC (or a global component name) in <code>component</code>. Two
        patterns, like <code>$q.dialog</code>:
        <b>without</b> <code>title</code> / <code>description</code> the
        component <b>is</b> the sheet — it renders a
        <code>&lt;q-bottom-sheet v-model="open"&gt;</code> root driven by
        <code>useBottomSheetPluginComponent()</code> (<code>open</code> is
        already <code>true</code>, no <code>v-model</code> to set);
        <b>with</b> them, the provider wraps the panel + header and your
        component provides the body, resolving <code>@ok / @cancel /
        @dismiss</code>.
      </p>
      <q-syntax :code="bottomSheetCode" lang="ts" filename="share.ts" copy />

      <p class="guide__note">Sheet component (auto pattern — root required):</p>
      <q-syntax
        :code="fullSheetCode"
        lang="html"
        filename="MySheet.vue"
        copy
      />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Options</h2>
      <p class="guide__note">
        Everything is tunable: <code>height</code> (fixed panel height),
        <code>width</code>, <code>rounded</code> (<code>true</code> / CSS
        value), <code>dark</code>, <code>translucent</code> (frosted glass,
        true = 70% or a percentage), <code>persistent</code> (no backdrop / Esc
        close), <code>dragThreshold</code> (px before drag dismisses) and
        <code>transition</code> — <code>slide-up</code> (default),
        <code>fade</code> or <code>zoom</code> (+ optional
        <code>transitionDuration</code> in ms). The same options exist on the
        declarative <code>&lt;q-bottom-sheet&gt;</code>.
      </p>
      <q-syntax :code="optionsCode" lang="html" filename="App.vue" :script="scriptOptions" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live example</h2>
      <p class="guide__note">
        A real content component (<code>DemoShareSheet</code>) pushed through
        <code>$q.bottomSheet.open()</code> with
        <code>height="62%"</code>, <code>rounded="24px"</code>,
        <code>translucent</code> and <code>transition="zoom"</code> — try a
        target (OK), Cancel, and the backdrop / drag-down.
      </p>
      <div class="guide-row">
        <q-btn unelevated no-caps color="primary" icon="lucide:share-2" label="Share file…" @click="openSheet" />
      </div>
      <div v-if="log.length" class="demo-log">
        <p class="demo-log__label">Results</p>
        <p v-for="(entry, i) in log" :key="i" class="demo-log__entry"><code>{{ entry }}</code></p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.guide-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.demo-log {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.demo-log__label {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8b93a1;
}
.demo-log__entry {
  margin: 0;
  font-size: 13px;
  color: #5b6472;
}
.demo-log__entry code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 6px;
  border-radius: 5px;
}
</style>
