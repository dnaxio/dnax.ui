<script setup lang="ts">
// Docs — plugin $q.dialog : dialogues composants programmatiques.
definePageMeta({ layout: "docs" })

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

$q.dialog({
  component: ConfirmDialog, // imported SFC or global component name
  componentProps: { title: "Delete?", message: "This action cannot be undone." },
  persistent: true,
})
  .onOK(() => console.log("confirmed"))
  .onCancel(() => console.log("cancelled"))`
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
        <code>description</code> (rendered by <code>QDialogHeader</code>),
        <code>fullscreen</code>, <code>class</code> and <code>persistent</code>.
        Returns a chainable controller with
        <code>onOK / onCancel / onDismiss</code> — the content component closes the
        dialog by emitting <code>ok</code>, <code>cancel</code>, <code>dismiss</code>
        or <code>close</code>.
      </p>
      <q-syntax :code="dialogCode" lang="ts" filename="confirm.ts" copy />
    </section>
  </div>
</template>
