<script setup lang="ts">
// Docs — plugin $q.loading : overlay plein écran compté.
import { usePlugin } from "@dnax/ui/runtime"
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

const loadingCode = `const $q = usePlugin()

$q.loading.show({
  message: "Uploading…",
  spinnerColor: "primary",
})
// … then
$q.loading.hide()`

const usageDemo = `<div class="row">
  <q-btn no-caps color="primary" label="Show 2s" @click="fire" />
</div>`

const fire = () => {
  $q.loading.show({ message: "Loading…", spinnerColor: "primary" })
  setTimeout(() => $q.loading.hide(), 2000)
}
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Loading</h1>
    <p class="guide__lead">
      <code>$q.loading</code> shows a counted fullscreen overlay — rendered by the
      automatically mounted <code>QLoadingProvider</code>.
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
        <code>show()</code> is <b>counted</b>: call it several times and
        <code>hide()</code> once to keep it visible. Options: <code>message</code>,
        <code>icon</code>, <code>spinnerColor</code>, <code>boxed</code>,
        <code>transparent</code>.
      </p>
      <q-syntax :code="loadingCode" lang="ts" filename="upload.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue">
        <div class="guide-row">
          <q-btn no-caps color="primary" label="Show for 2s" @click="fire" />
        </div>
      </docs-demo>
    </section>
  </div>
</template>

<style scoped>
.guide-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
