<script setup lang="ts">
// Docs — plugin $q.notify : toasts programmatiques.
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

const notifyCode = `const $q = usePlugin()

$q.notify.show({
  type: "positive", // positive | negative | warning | info
  message: "Saved successfully",
  caption: "All changes are up to date",
  position: "top",
  timeout: 2500,
})

// With an action
$q.notify.show({
  message: "New version available",
  actions: [{ label: "Update", handler: () => update() }],
})`

const usageDemo = `<div class="row">
  <q-btn no-caps color="positive" label="Success" @click="fire('success', 'Saved')" />
  <q-btn no-caps color="negative" label="Error" @click="fire('error', 'Failed')" />
  <q-btn no-caps color="warning" label="Warning" @click="fire('warning', 'Careful')" />
  <q-btn no-caps color="info" label="Info" @click="fire('info', 'Heads up')" />
</div>`

const fire = (type: "success" | "error" | "warning" | "info", message: string) => {
  $q.notify.show({ type, message, caption: "via $q.notify.show", position: "top-right", timeout: 2500 })
}
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Notify</h1>
    <p class="guide__lead">
      <code>$q.notify</code> fires toast notifications (vue-sonner) from anywhere —
      rendered by the automatically mounted <code>QNotifyProvider</code>.
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
        Options: <code>message</code>, <code>caption</code>, <code>icon</code>,
        <code>type</code> (<code>positive | negative | warning | info</code>),
        <code>position</code>, <code>timeout</code> and
        <code>actions</code> (button with handler).
      </p>
      <q-syntax :code="notifyCode" lang="ts" filename="notify.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue">
        <div class="guide-row">
          <q-btn no-caps color="positive" label="Success" @click="fire('success', 'Saved')" />
          <q-btn no-caps color="negative" label="Error" @click="fire('error', 'Failed')" />
          <q-btn no-caps color="warning" label="Warning" @click="fire('warning', 'Careful')" />
          <q-btn no-caps color="info" label="Info" @click="fire('info', 'Heads up')" />
        </div>
      </docs-demo>
    </section>
  </div>
</template>

<style scoped>
.guide-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
