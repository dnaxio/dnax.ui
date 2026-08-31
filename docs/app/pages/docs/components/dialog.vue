<script setup lang="ts">
// Dialog — documentation complète de la famille :
// QDialog + QDialogHeader + QDialogFooter + QDialogTrigger + QDialogProvider.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const dialog = useComponent(() => "QDialog")
const dialogHeader = useComponent(() => "QDialogHeader")
const dialogFooter = useComponent(() => "QDialogFooter")
const dialogTrigger = useComponent(() => "QDialogTrigger")
const dialogProvider = useComponent(() => "QDialogProvider")

const dialogSource = componentSource("QDialog")
const dialogHeaderSource = componentSource("QDialogHeader")
const dialogFooterSource = componentSource("QDialogFooter")
const dialogTriggerSource = componentSource("QDialogTrigger")
const dialogProviderSource = componentSource("QDialogProvider")

const tag = componentTag("QDialog")

// — Démo interactive —
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

// — Démos des transitions —
const transition = ref<"fade" | "zoom" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "swipe-left" | "swipe-right">("fade")
const transitions = ["fade", "zoom", "slide-up", "slide-down", "slide-left", "slide-right", "swipe-left", "swipe-right"] as const
const openWith = (t: (typeof transitions)[number]) => {
  transition.value = t
  openT.value = true
}

const usageSimple = `<q-btn color="primary" label="Open dialog" @click="open = true" />
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
</q-dialog>`

const usageHeaderFooter = `<q-btn color="negative" outline label="Delete account" @click="openConfirm = true" />

<q-dialog v-model="openConfirm">
  <q-dialog-header title="Confirm deletion" description="This action cannot be undone." />
  <div class="demo-dialog-body">
    <p class="demo-p">
      QDialogHeader renders the title, an optional description and a close button;
      QDialogFooter hosts the action buttons at the bottom of the panel.
    </p>
  </div>
  <q-dialog-footer>
    <q-btn flat label="Cancel" @click="openConfirm = false" />
    <q-btn color="negative" label="Delete" @click="openConfirm = false" />
  </q-dialog-footer>
</q-dialog>`

const usageTransitions = `<div class="row">
  <q-btn v-for="t in transitions" :key="t" outline color="primary" no-caps :label="t" @click="openWith(t)" />
</div>

<q-dialog v-model="open" :transition="transition">
  <q-dialog-header :title="'Transition: ' + transition" description="Click the backdrop or press Escape to close." />
  <div class="body">
    <p class="demo-p">Same dialog, different <code>transition</code> each time.</p>
  </div>
</q-dialog>`

const usagePosition = `<q-btn outline label="Bottom dialog" @click="openBottom = true" />

<q-dialog v-model="openBottom" position="bottom" transition="slide-up">
  <q-dialog-header title="Now playing" description="A sheet-like dialog anchored to the bottom edge" />
  <div class="demo-dialog-body">
    <p class="demo-p">
      <code>position</code> accepts <code>standard | top | right | bottom | left</code>;
      the transition follows the position automatically unless <code>transition</code>
      overrides it (<code>fade | zoom | slide-up | …</code>).
    </p>
  </div>
</q-dialog>`

const usageMax = `<q-btn color="primary" label="Fullscreen dialog" @click="openMax = true" />

<q-dialog v-model="openMax" maximized>
  <q-dialog-header title="Settings" description="A maximized dialog covers the whole screen" />
  <div class="demo-dialog-body">
    <p class="demo-p">
      <code>maximized</code> stretches the panel edge-to-edge (100vw × 100dvh) with
      square corners — the iOS fullscreen pattern. The header and footer respect
      the safe-area insets.
    </p>
  </div>
  <q-dialog-footer>
    <q-btn flat label="Close" @click="openMax = false" />
    <q-btn color="primary" label="Save" @click="openMax = false" />
  </q-dialog-footer>
</q-dialog>`

const usageMaxTransitions = `<div class="row">
  <q-btn v-for="t in transitions" :key="t" outline color="primary" no-caps :label="t" @click="openMaxWith(t)" />
</div>

<div class="row">
  <q-btn v-for="d in durations" :key="d" flat color="primary" no-caps :label="d + 'ms'" :class="{ 'active': d === maxDuration }" @click="maxDuration = d" />
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
</q-dialog>`

const usageTrigger = `<q-btn color="primary" label="Open dialog" @click="open = true" />

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
</q-dialog>`

const usageHeader = `<q-dialog-header title="Settings" description="Tune your preferences" />

<!-- or with custom slots -->
<q-dialog-header>
  <template #title>
    <q-icon name="lucide:sparkles" color="primary" />
    <span>Custom title</span>
  </template>
  <template #description>Custom description</template>
</q-dialog-header>`

const usageFooter = `<q-dialog-footer>
  <q-btn flat label="Cancel" @click="open = false" />
  <q-btn color="primary" label="Confirm" @click="open = false" />
</q-dialog-footer>`

const usageProvider = `import { $q } from "@dnax/ui"

// Push a dialog onto the stack — <q-dialog-provider> renders it.
const confirm = $q.dialog.open({
  component: ConfirmDialog,      // SFC import or global component name
  title: "Confirm deletion",
  description: "This action cannot be undone.",
  persistent: true,
})

confirm
  .onOK(() => deleteAccount())
  .onCancel(() => console.log("cancelled"))`

const usagePluginComponent = `<script setup lang="ts">
import { useDialogPluginComponent } from "@dnax/ui"

const { open, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
<\/script>

<template>
  <!-- Le composant passé à $q.dialog.open() doit commencer par <q-dialog> -->
  <q-dialog v-model="open" @hide="onDialogHide">
    <q-dialog-header title="Confirm deletion" description="This action cannot be undone." />
    <div class="body">…</div>
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn color="negative" label="Delete" @click="onDialogOK" />
    </q-dialog-footer>
  </q-dialog>
</template>`

// — Scripts des démos (onglet "Script setup") —
const scriptOpen = `import { ref } from "vue"

const open = ref(false)`

const scriptSimple = `${scriptOpen}

const eventLog = ref("")`

const scriptConfirm = `import { ref } from "vue"

const openConfirm = ref(false)`

const scriptPosition = `import { ref } from "vue"

const openBottom = ref(false)`

const scriptMax = `import { ref } from "vue"

const openMax = ref(false)`

const scriptMaxTransitions = `import { ref } from "vue"

const openMaxT = ref(false)
const maxTransition = ref("fade")
const maxDuration = ref(200)
const durations = [100, 200, 350, 500, 800]
const transitions = ["fade", "zoom", "slide-up", "slide-down", "slide-left", "slide-right", "swipe-left", "swipe-right"]

const openMaxWith = (t) => {
  maxTransition.value = t
  openMaxT.value = true
}`

const scriptTransitions = `import { ref } from "vue"

const open = ref(false)
const transition = ref("fade")
const transitions = ["fade", "zoom", "slide-up", "slide-down", "slide-left", "slide-right", "swipe-left", "swipe-right"]

const openWith = (t) => {
  transition.value = t
  open.value = true
}`

const scriptTrigger = scriptOpen
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Dialog</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A modal overlay that focuses the user's attention on a single task. The family
      comprises five components: <b>&lt;q-dialog&gt;</b> (the overlay + panel),
      <b>&lt;q-dialog-header&gt;</b> (title and close button),
      <b>&lt;q-dialog-footer&gt;</b> (actions), <b>&lt;q-dialog-trigger&gt;</b>
      (declarative opener) and <b>&lt;q-dialog-provider&gt;</b> (renders the
      programmatic <code>$q.dialog</code> stack).
    </p>

    <!-- ═══════ QDialog ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QDialog — the modal</h2>

      <docs-demo :code="usageSimple" lang="html" filename="App.vue" :script="scriptSimple">
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
      </docs-demo>

      <h3 class="doc-h3">Header + footer</h3>
      <docs-demo :code="usageHeaderFooter" lang="html" filename="App.vue" :script="scriptConfirm">
        <q-btn color="negative" outline label="Delete account" @click="openConfirm = true" />

        <q-dialog v-model="openConfirm">
          <q-dialog-header title="Confirm deletion" description="This action cannot be undone." />
          <div class="demo-dialog-body">
            <p class="demo-p">
              QDialogHeader renders the title, an optional description and a close button;
              QDialogFooter hosts the action buttons at the bottom of the panel.
            </p>
          </div>
          <q-dialog-footer>
            <q-btn flat label="Cancel" @click="openConfirm = false" />
            <q-btn color="negative" label="Delete" @click="openConfirm = false" />
          </q-dialog-footer>
        </q-dialog>
      </docs-demo>

      <h3 class="doc-h3">Transitions</h3>
      <p class="doc-note">
        <code>transition</code> accepts <code>fade</code>, <code>zoom</code> and
        the four slide directions — try them all on the same dialog.
      </p>
      <docs-demo :code="usageTransitions" lang="html" filename="App.vue" :script="scriptTransitions">
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
      </docs-demo>

      <h3 class="doc-h3">Position &amp; transition</h3>
      <docs-demo :code="usagePosition" lang="html" filename="App.vue" :script="scriptPosition">
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
      </docs-demo>

      <h3 class="doc-h3">Maximized (fullscreen)</h3>
      <docs-demo :code="usageMax" lang="html" filename="App.vue" :script="scriptMax">
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
      </docs-demo>

      <h3 class="doc-h3">Maximized + transitions</h3>
      <docs-demo :code="usageMaxTransitions" lang="html" filename="App.vue" :script="scriptMaxTransitions">
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
              <code>transition-duration</code> in ms — each click re-opens the
              fullscreen panel with the chosen entrance animation and speed.
            </p>
          </div>
          <q-dialog-footer>
            <q-btn flat label="Close" @click="openMaxT = false" />
            <q-btn color="primary" label="Done" @click="openMaxT = false" />
          </q-dialog-footer>
        </q-dialog>
      </docs-demo>

      <p class="doc-note">
        Set <code>persistent</code> (or <code>no-backdrop-dismiss</code> /
        <code>no-esc-dismiss</code>) to prevent closing, <code>maximized</code> for a
        fullscreen dialog, <code>full-width</code> / <code>full-height</code> for edge-to-edge
        panels, and <code>radius</code> / <code>square</code> to control the corner rounding.
        The width can be tuned with <code>content-style</code>.
      </p>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="dialog" :source="dialogSource" />
    </section>

    <!-- ═══════ QDialogHeader ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QDialogHeader — title &amp; close</h2>
      <p class="doc-note">
        Sticky header with a <code>title</code>, an optional <code>description</code> and a
        close button (<code>show-close</code>, enabled by default). Custom content can be
        passed through the <code>#title</code> and <code>#description</code> slots.
      </p>
      <q-syntax :code="usageHeader" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="dialogHeader" :source="dialogHeaderSource" />
    </section>

    <!-- ═══════ QDialogFooter ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QDialogFooter — actions</h2>
      <p class="doc-note">
        Simple container for the action buttons at the bottom of the panel — usually a
        dismissive action on the left and a confirming one on the right.
      </p>
      <q-syntax :code="usageFooter" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="dialogFooter" :source="dialogFooterSource" />
    </section>

    <!-- ═══════ QDialogTrigger ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QDialogTrigger — declarative opener</h2>
      <p class="doc-note">
        A button that calls <code>setOpen(true)</code> on its parent
        <code>&lt;q-dialog&gt;</code>. Since the dialog content only mounts while open,
        the trigger is placed <b>inside</b> the dialog — for opening from the page, bind
        <code>v-model</code> to a regular button instead.
      </p>
      <docs-demo :code="usageTrigger" lang="html" filename="App.vue" :script="scriptTrigger">
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
      </docs-demo>
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="dialogTrigger" :source="dialogTriggerSource" />
    </section>

    <!-- ═══════ QDialogProvider ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QDialogProvider — programmatic dialogs</h2>
      <p class="doc-note">
        Renders the stack of programmatic dialogs pushed with
        <code>$q.dialog.open()</code>. It is mounted automatically by the outermost
        <code>&lt;q-config-provider&gt;</code> — no extra setup needed. The component
        passed in <code>component</code> is rendered <b>as-is</b>: it must start with
        a <code>&lt;q-dialog&gt;</code> root (Quasar-style) and drive it with
        <code>useDialogPluginComponent()</code>. Closing (backdrop, Esc, ×,
        <code>onDialogOK</code>, <code>onDialogCancel</code>) calls the matching
        resolver (<code>onOK</code>, <code>onCancel</code>, <code>onDismiss</code>)
        and removes the entry. Legacy components emitting
        <code>ok / cancel / dismiss / close</code> still work.
      </p>
      <q-syntax :code="usageProvider" lang="ts" filename="app.ts" copy />
      <h3 class="doc-h3">The dialog component</h3>
      <q-syntax :code="usagePluginComponent" lang="html" filename="ConfirmDialog.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="dialogProvider" :source="dialogProviderSource" />
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
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
.demo-dialog {
  width: 100%;
  max-width: 560px;
}

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

/* espace entre les blocs docs-demo */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
