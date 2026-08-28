<script setup lang="ts">
// Docs — Plugins API : $q.dialog / $q.bottomSheet / $q.notify / $q.loading.
definePageMeta({ layout: "docs" })

const setupCode = `import { usePlugin } from "@dnax/ui"

const $q = usePlugin()

// Legacy: app.use(QPlugin) → this.$q anywhere
import { QPlugin } from "@dnax/ui"`

const dialogCode = `const $q = usePlugin()

$q.dialog({
  component: ConfirmDialog, // imported SFC or global component name
  componentProps: { title: "Delete?", message: "This action cannot be undone." },
  persistent: true,
})
  .onOK(() => console.log("confirmed"))
  .onCancel(() => console.log("cancelled"))`

const bottomSheetCode = `const $q = usePlugin()

$q.bottomSheet({
  component: ShareSheet,
  componentProps: { file },
  title: "Share",
  rounded: true,
})
  .onOK((data) => console.log("choice:", data))`

const notifyCode = `const $q = usePlugin()

$q.notify({
  type: "positive", // positive | negative | warning | info
  message: "Saved successfully",
  caption: "All changes are up to date",
  position: "top",
  timeout: 2500,
})

// With an action
$q.notify({
  message: "New version available",
  actions: [{ label: "Update", handler: () => update() }],
})`

const loadingCode = `const $q = usePlugin()

$q.loading.show({
  message: "Uploading…",
  spinnerColor: "primary",
})
// … then
$q.loading.hide()`

const providersCode = `<q-config-provider>
  <!-- rend automatiquement QDialogProvider, QNotifyProvider,
       QLoadingProvider et QBottomSheetProvider -->
  <NuxtPage />
</q-config-provider>`
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Plugins API</h1>
    <p class="guide__lead">
      Programmatic access to components through the <code>$q</code> singleton:
      dialog, bottom sheet, notify and loading — no template markup needed.
    </p>

    <section class="guide__section">
      <h2 class="guide__h2" id="setup">Setup</h2>
      <p class="guide__note">
        Get <code>$q</code> with the <code>usePlugin()</code> composable, or install
        the <code>QPlugin</code> for a global <code>this.$q</code> access.
      </p>
      <q-syntax :code="setupCode" lang="ts" filename="app.vue" copy />
      <p class="guide__note">
        The providers (<code>QDialogProvider</code>, <code>QNotifyProvider</code>,
        <code>QLoadingProvider</code>, <code>QBottomSheetProvider</code>) are rendered
        automatically by the outermost <code>&lt;q-config-provider&gt;</code>:
      </p>
      <q-syntax :code="providersCode" lang="html" filename="app.vue" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2" id="dialog">Dialog</h2>
      <p class="guide__note">
        Opens a component-based dialog: pass an SFC (or a global component name) in
        <code>component</code>. Returns a chainable controller with
        <code>onOK / onCancel / onDismiss</code>.
      </p>
      <q-syntax :code="dialogCode" lang="ts" filename="confirm.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2" id="bottom-sheet">Bottom Sheet</h2>
      <p class="guide__note">
        Bottom panel anchored to the bottom edge (built-in safe-area) — same principle
        as <code>$q.dialog</code>, with panel options (width, rounding, drag).
      </p>
      <q-syntax :code="bottomSheetCode" lang="ts" filename="share.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2" id="notify">Notify</h2>
      <p class="guide__note">
        Toast notification (vue-sonner) with color type, position and actions.
      </p>
      <q-syntax :code="notifyCode" lang="ts" filename="notify.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2" id="loading">Loading</h2>
      <p class="guide__note">
        Counted fullscreen overlay: <code>show()</code> / <code>hide()</code>.
      </p>
      <q-syntax :code="loadingCode" lang="ts" filename="upload.ts" copy />
    </section>
  </div>
</template>

<style scoped>
.guide {
  max-width: 760px;
}
.guide__title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--foreground);
}
.guide__lead {
  margin: 12px 0 0;
  font-size: 15.5px;
  line-height: 1.65;
  color: #5b6472;
}
.guide__section {
  margin-top: 32px;
}
.guide__h2 {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}
.guide__note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.guide__note code,
.guide__lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
