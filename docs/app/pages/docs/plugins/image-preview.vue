<script setup lang="ts">
// Docs — plugin $q.imagePreview : visionneuse plein écran programmatique.
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

const imagePreviewCode = `const $q = usePlugin()

$q.imagePreview.open({
  images: [
    "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1600&auto=format&fit=crop",
  ],
  index: 0,
  transition: "up",
  closeBtn: true,
  onDismiss: () => console.log("preview closed"),
}).goTo(1)`

const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1600&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=1600&auto=format&fit=crop",
]

const usageDemo = `<div class="row">
  <q-btn no-caps color="primary" label="Open preview" @click="fire" />
</div>`

const fire = () => {
  $q.imagePreview.open({
    images,
    index: 0,
    transition: "up",
    closeBtn: true,
  })
}
</script>

<template>
  <div class="guide">
    <h1 class="guide__title">Image Preview</h1>
    <p class="guide__lead">
      <code>$q.imagePreview</code> opens the fullscreen image viewer from anywhere —
      rendered by the automatically mounted <code>QImagePreviewProvider</code>.
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
        Same options as <code>&lt;q-image-preview&gt;</code> — <code>images</code>
        (string[] or <code>{ src }</code>[]), <code>index</code>,
        <code>transition</code>, <code>closeBtn</code>, <code>counter</code>… —
        plus <code>onDismiss</code>. The returned controller exposes
        <code>goTo(index)</code>.
      </p>
      <q-syntax :code="imagePreviewCode" lang="ts" filename="gallery.ts" copy />
    </section>

    <section class="guide__section">
      <h2 class="guide__h2">Live demo</h2>
      <docs-demo :code="usageDemo" lang="html" filename="App.vue">
        <div class="guide-row">
          <q-btn no-caps color="primary" label="Open preview" @click="fire" />
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
