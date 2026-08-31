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
    .onOK((data) => log.value.unshift(`ok → ${data}`))
    .onCancel(() => log.value.unshift("cancel"))
    .onDismiss(() => log.value.unshift("dismiss (backdrop / Esc / ×)"))
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
        provides <code>open</code> (bind to <code>v-model</code>), and
        <code>onDialogHide</code> (bind to <code>@hide</code>) so backdrop / Esc /
        × close resolves <code>onDismiss</code>. Call <code>onDialogOK(data)</code>
        or <code>onDialogCancel()</code> from your actions. Legacy components that
        emit <code>ok / cancel / dismiss / close</code> still work.
      </p>
      <q-syntax :code="componentCode" lang="html" filename="ConfirmDialog.vue" copy />
    </section>
  </div>
</template>
