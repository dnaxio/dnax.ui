<script setup lang="ts">
// Loading — famille complète : QLoading (overlay plein écran déclaratif, v-model)
// + QLoadingProvider (rend l'état du plugin $q.loading).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const loading = useComponent(() => "QLoading")
const loadingSource = componentSource("QLoading")
const loadingProvider = useComponent(() => "QLoadingProvider")
const loadingProviderSource = componentSource("QLoadingProvider")

const tag = componentTag("QLoading")

// — Démos —
const busyBasic = ref(false)
const busyCustom = ref(false)
const busyBoxed = ref(false)

const run = (key: "basic" | "custom" | "boxed") => {
  const refs = { basic: busyBasic, custom: busyCustom, boxed: busyBoxed }
  const target = refs[key]
  if (target.value) return
  target.value = true
  setTimeout(() => (target.value = false), 1800)
}

const basicCode = `<q-loading v-model="busyBasic" message="Loading…" />
<q-btn unelevated color="primary" no-caps label="Show loading" @click="busyBasic = true" />`

const customCode = `<q-loading
  v-model="busyCustom"
  message="Uploading files…"
  icon="lucide:loader-circle"
  spinner-color="primary"
  background-color="rgb(0 0 0 / 0.45)"
/>`

const boxedCode = `<q-loading
  v-model="busyBoxed"
  message="Saving settings…"
  icon="lucide:loader-circle"
  spinner-color="primary"
  boxed
/>`

const providerCode = `<q-loading-provider />
<!-- renders $q.loading.show({ message: "…" }) — see Plugins API -->`

// — Scripts des démos (refs accompagnant les templates) —
const scriptBasic = `import { ref } from "vue"

const busyBasic = ref(false)`

const scriptCustom = `import { ref } from "vue"

const busyCustom = ref(false)`

const scriptBoxed = `import { ref } from "vue"

const busyBoxed = ref(false)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Loading</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      The fullscreen loading overlay, in two parts: <b>&lt;q-loading&gt;</b>, the
      declarative component driven by a boolean <code>v-model</code>, and
      <b>&lt;q-loading-provider&gt;</b>, the component that renders the state of the
      <code>$q.loading</code> plugin — mounted automatically by
      <code>&lt;q-config-provider&gt;</code>. Both share the same visual options
      (spinner or icon + message, transparent or boxed).
    </p>

    <!-- ═══════ QLoading ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">q-loading — declarative, with v-model</h2>
      <p class="doc-note">
        Bind a boolean with <code>v-model</code> to show or hide the overlay.
      </p>

      <h3 class="doc-h3">Basic</h3>
      <docs-demo :code="basicCode" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-actions">
          <q-loading v-model="busyBasic" message="Loading…" />
          <q-btn unelevated color="primary" no-caps label="Show loading" :loading="busyBasic" @click="run('basic')" />
        </div>
      </docs-demo>

      <h3 class="doc-h3">Custom icon &amp; colors</h3>
      <p class="doc-note">
        <code>icon</code> replaces the spinner with a rotating Iconify icon on a
        transparent overlay; <code>message</code>, <code>spinner-color</code> and
        <code>background-color</code> style it.
      </p>
      <docs-demo :code="customCode" lang="html" filename="App.vue" :script="scriptCustom">
        <div class="demo-actions">
          <q-loading
            v-model="busyCustom"
            message="Uploading files…"
            icon="lucide:loader-circle"
            spinner-color="primary"
            background-color="rgb(0 0 0 / 0.45)"
          />
          <q-btn unelevated color="secondary" no-caps label="Upload (custom)" :loading="busyCustom" @click="run('custom')" />
        </div>
      </docs-demo>

      <h3 class="doc-h3">Boxed icon</h3>
      <p class="doc-note">
        <code>boxed</code> keeps the white card behind the icon (default:
        transparent).
      </p>
      <docs-demo :code="boxedCode" lang="html" filename="App.vue" :script="scriptBoxed">
        <div class="demo-actions">
          <q-loading
            v-model="busyBoxed"
            message="Saving settings…"
            icon="lucide:loader-circle"
            spinner-color="primary"
            boxed
          />
          <q-btn unelevated color="dark" no-caps label="Save (boxed icon)" :loading="busyBoxed" @click="run('boxed')" />
        </div>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="loading" :source="loadingSource" />
    </section>

    <!-- ═══════ QLoadingProvider ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">q-loading-provider — the plugin overlay</h2>
      <p class="doc-note">
        Renders the fullscreen overlay from the <code>$q.loading</code> plugin state
        (<code>show()</code> / <code>hide()</code>, plus <code>delay</code> and
        <code>group</code> options). Mounted automatically by the outermost
        <code>&lt;q-config-provider&gt;</code> — standalone usage (app without
        <code>QConfigProvider</code>):
      </p>
      <q-syntax :code="providerCode" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
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
