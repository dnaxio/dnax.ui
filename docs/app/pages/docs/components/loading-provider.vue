<script setup lang="ts">
// Loading Provider — QLoadingProvider : overlay plein écran rendu par $q.loading.
import { ref } from "vue"
import { $q } from "@dnax/ui/runtime"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const loadingProvider = useComponent(() => "QLoadingProvider")
const loadingProviderSource = componentSource("QLoadingProvider")
const tag = componentTag("QLoadingProvider")

// — Démos —
const busyBasic = ref(false)
const busyCustom = ref(false)
const busyBoxed = ref(false)

const runBasic = () => {
  if (busyBasic.value) return
  busyBasic.value = true
  $q.loading.show({ message: "Loading…" })
  setTimeout(() => {
    $q.loading.hide()
    busyBasic.value = false
  }, 1800)
}

const runCustom = () => {
  if (busyCustom.value) return
  busyCustom.value = true
  $q.loading.show({
    message: "Uploading files…",
    icon: "lucide:loader-circle",
    spinnerColor: "primary",
    backgroundColor: "rgb(0 0 0 / 0.45)",
  })
  setTimeout(() => {
    $q.loading.hide()
    busyCustom.value = false
  }, 1800)
}

const runBoxed = () => {
  if (busyBoxed.value) return
  busyBoxed.value = true
  $q.loading.show({
    message: "Saving settings…",
    icon: "lucide:loader-circle",
    spinnerColor: "primary",
    boxed: true,
  })
  setTimeout(() => {
    $q.loading.hide()
    busyBoxed.value = false
  }, 1800)
}

const basicCode = `import { $q } from "@dnax/ui"

$q.loading.show({ message: "Loading…" })
// … plus tard
$q.loading.hide()`

const customCode = `$q.loading.show({
  message: "Uploading files…",
  icon: "lucide:loader-circle",
  spinnerColor: "primary",
  backgroundColor: "rgb(0 0 0 / 0.45)",
})

$q.loading.hide()`

const boxedCode = `$q.loading.show({
  message: "Saving settings…",
  icon: "lucide:loader-circle",
  spinnerColor: "primary",
  boxed: true, // keep the white card behind the icon
})`

// — Options de $q.loading —
const options = [
  { name: "message", type: "string", def: "—", desc: "Message under the spinner." },
  { name: "spinnerSize", type: "number", def: "48", desc: "Spinner size in px." },
  { name: "spinnerColor", type: "string", def: "primary", desc: "Token or hex color of the spinner." },
  { name: "messageColor", type: "string", def: "#1d1d1d", desc: "Message color." },
  { name: "backgroundColor", type: "string", def: "rgb(0 0 0 / .3)", desc: "Overlay background." },
  { name: "icon", type: "string", def: "—", desc: "Iconify icon replacing the spinner." },
  { name: "iconColor", type: "string", def: "spinnerColor", desc: "Icon color." },
  { name: "boxed", type: "boolean", def: "false", desc: "Keep the white card behind the icon (default: transparent)." },
  { name: "delay", type: "number", def: "0", desc: "Delay before showing (ms)." },
  { name: "group", type: "boolean", def: "false", desc: "Counted show/hide — hide only when every show is removed." },
]
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Loading Provider</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      The fullscreen loading overlay behind the <code>$q.loading</code> plugin.
      <b>&lt;q-loading-provider&gt;</b> listens to the <code>$q.loading</code>
      singleton and renders the overlay + spinner + message — it is mounted
      automatically by the outermost <code>&lt;q-config-provider&gt;</code>, so you
      usually never write it yourself: just call
      <code>$q.loading.show()</code> / <code>hide()</code>.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        <code>$q.loading.show(options)</code> displays the overlay;
        <code>$q.loading.hide()</code> removes it.
      </p>

      <docs-demo :code="basicCode" lang="ts" filename="api.ts">
        <div class="demo-actions">
          <q-btn unelevated color="primary" no-caps label="Show loading" :loading="busyBasic" @click="runBasic" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Custom ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom</h2>
      <p class="doc-note">
        <code>icon</code> replaces the spinner with a rotating Iconify icon;
        <code>message</code>, <code>spinnerColor</code> and
        <code>backgroundColor</code> style the overlay.
      </p>

      <docs-demo :code="customCode" lang="ts" filename="api.ts">
        <div class="demo-actions">
          <q-btn unelevated color="secondary" no-caps label="Upload (custom)" :loading="busyCustom" @click="runCustom" />
        </div>
      </docs-demo>
      <docs-demo :code="boxedCode" lang="ts" filename="api.ts">
        <div class="demo-actions">
          <q-btn unelevated color="dark" no-caps label="Save (boxed icon)" :loading="busyBoxed" @click="runBoxed" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Options ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">$q.loading options</h2>
      <div class="doc-table-wrap">
        <table class="doc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in options" :key="o.name">
              <td><code>{{ o.name }}</code></td>
              <td><code>{{ o.type }}</code></td>
              <td><code>{{ o.def }}</code></td>
              <td>{{ o.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="doc-note doc-note--top">
        <code>group</code> is handy for parallel requests: call
        <code>show()</code> once per request and <code>hide()</code> per completion —
        the overlay closes only when the last one finishes.
      </p>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QLoadingProvider</h2>
      <docs-api :comp="loadingProvider" :source="loadingProviderSource" />
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
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note--top {
  margin-top: 12px;
}
.doc-note code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.demo-actions {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
</style>
