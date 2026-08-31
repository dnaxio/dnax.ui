<script setup lang="ts">
// Docs — plugin $q.dialog : dialogues composants programmatiques.
import { ref } from "vue"
import { usePlugin } from "@dnax/ui/runtime"
import DemoConfirmDialog from "~/components/DemoConfirmDialog.vue"

definePageMeta({ layout: "docs" })

const $q = usePlugin()

// — Démo interactive —
const log = ref<string[]>([])
const openDemo = () => {
  $q.dialog
    .open({
      component: DemoConfirmDialog,
      componentProps: {
        title: "Delete account?",
        message: "This action is irreversible — all your data will be removed.",
        confirmLabel: "Delete account",
        color: "negative",
      },
    })
    .onOK((data) => {
      log.value.unshift(`ok → ${data}`)
    })
    .onCancel(() => {
      log.value.unshift("cancel")
    })
    .onDismiss(() => {
      log.value.unshift("dismiss (backdrop / Esc / ×)")
    })
}

const setupCode = `import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

// Legacy: app.use(QPlugin) → this.$q anywhere
import { QPlugin } from "@dnax/ui"`

const providersCode = `<q-config-provider>
  <!-- rend automatiquement QDialogProvider, QNotifyProvider, QLoadingProvider,
       QBottomSheetProvider et QImagePreviewProvider -->
  <NuxtPage />
</q-config-provider>`

const dialogCode = `const $q = usePlugin()

$q.dialog.open({
  component: ConfirmDialog, // SFC importé OU nom de composant global
  componentProps: { title: "Delete?", message: "This action cannot be undone." },
  persistent: true,
})
  .onOK(() => console.log("confirmed"))
  .onCancel(() => console.log("cancelled"))`

const componentCode = `<script setup lang="ts">
// Le composant DOIT commencer par <q-dialog> (pattern Quasar) :
// il reçoit open (v-model) + les helpers via useDialogPluginComponent().
import { useDialogPluginComponent } from "@dnax/ui"

const { open, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
<\/script>

<template>
  <q-dialog v-model="open" @hide="onDialogHide">
    <q-dialog-header title="Confirm deletion" description="This action cannot be undone." />
    <div class="body">…</div>
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn color="negative" label="Delete" @click="onDialogOK" />
    </q-dialog-footer>
  </q-dialog>
</template>`
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Dialog</h1>
    <p class="guide__lead">
      <code>$q.dialog</code> pushes a component-based modal dialog — rendered by the
      automatically mounted <code>QDialogProvider</code>.
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
        Pass an SFC (or a global component name) in <code>component</code>, with
        optional <code>componentProps</code>, <code>title</code> /
        <code>description</code>, <code>fullscreen</code>, <code>class</code> and
        <code>persistent</code>. Returns a chainable controller with
        <code>onOK / onCancel / onDismiss</code>.
      </p>
      <q-syntax :code="dialogCode" lang="ts" filename="confirm.ts" copy />

      <h2 class="guide__h2">The dialog component</h2>
      <p class="guide__note">
        <b>Quasar-style contract</b>: the component passed to
        <code>$q.dialog.open()</code> must render a <code>&lt;q-dialog&gt;</code>
        as its <b>root</b>, driven by <code>useDialogPluginComponent()</code> — it
        provides <code>open</code> (bind to <code>v-model</code>, already
        <code>true</code> so the dialog opens on mount), and
        <code>onDialogHide</code> (bind to <code>@hide</code>) so backdrop / Esc /
        × close resolves <code>onDismiss</code>. Call <code>onDialogOK(data)</code>
        or <code>onDialogCancel()</code> from your actions. Legacy components that
        emit <code>ok / cancel / dismiss / close</code> still work.
      </p>
      <q-syntax :code="componentCode" lang="html" filename="ConfirmDialog.vue" copy />

      <h2 class="guide__h2">Live example</h2>
      <p class="guide__note">
        A real dialog component (<code>DemoConfirmDialog</code>) pushed through
        <code>$q.dialog.open()</code> — try OK (async with loading), Cancel, and
        the backdrop / Esc.
      </p>
      <div class="demo-row">
        <q-btn unelevated no-caps color="negative" icon="lucide:trash-2" label="Delete account…" @click="openDemo" />
      </div>
      <div v-if="log.length" class="demo-log">
        <p class="demo-log__label">Results</p>
        <p v-for="(entry, i) in log" :key="i" class="demo-log__entry"><code>{{ entry }}</code></p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-row {
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
