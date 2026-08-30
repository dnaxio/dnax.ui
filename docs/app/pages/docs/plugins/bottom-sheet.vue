<script setup lang="ts">
// Docs — plugin $q.bottomSheet : panneau bas programmatique.
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

const bottomSheetCode = `const $q = usePlugin()

$q.bottomSheet({
  component: ShareSheet,
  componentProps: { file },
  title: "Share",
  rounded: true,
})
  .onOK((data) => console.log("choice:", data))`
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Bottom Sheet</h1>
    <p class="guide__lead">
      <code>$q.bottomSheet</code> opens a bottom-anchored panel (built-in safe-area)
      — same principle as <code>$q.dialog</code>, rendered by the automatically
      mounted <code>QBottomSheetProvider</code>.
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
        Options: <code>component</code> (SFC or global name),
        <code>componentProps</code>, <code>title</code> / <code>description</code>,
        <code>width</code>, <code>height</code>, <code>rounded</code>,
        <code>dark</code>, <code>translucent</code> (frosted glass),
        <code>persistent</code> and <code>dragThreshold</code> (drag to close).
        Returns a chainable controller (<code>onOK / onCancel / onDismiss</code>).
      </p>
      <q-syntax :code="bottomSheetCode" lang="ts" filename="share.ts" copy />
    </section>
  </div>
</template>
