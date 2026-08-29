<script setup lang="ts">
// Input Tag — QInputTag : champ de tags (Entrée ajoute, × retire, Backspace retire le dernier).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const inputTag = useComponent(() => "QInputTag")
const inputTagSource = componentSource("QInputTag")
const tag = componentTag("QInputTag")

// — Démos —
const emails = ref(["ada@dnax.dev", "grace@dnax.dev"])
const features = ref(["Wi-Fi", "GPS"])
const limited = ref(["alpha"])
const lastEvent = ref("")

const usageBasic = `<q-input-tag
  v-model="tags"
  label="Emails"
  placeholder="Type and press Enter"
  outlined
/>`

const usageEvents = `<q-input-tag
  v-model="tags"
  label="Features"
  placeholder="Add a feature…"
  outlined
  @add="lastEvent = 'added: ' + $event"
  @remove="lastEvent = 'removed: ' + $event"
/>
<p class="demo-p demo-event">Last event: {{ lastEvent }}</p>`

const usageStates = `<q-input-tag v-model="tags" label="Max 3 tags" :max-tags="3" outlined />
<q-input-tag v-model="tags" label="Filled & dense" filled dense />
<q-input-tag v-model="tags" label="Disabled" disable outlined />`

const scriptData = `import { ref } from "vue"

const tags = ref(["ada@dnax.dev", "grace@dnax.dev"])`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Input Tag</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A text field that collects <b>tags</b> as chips — inspired by the reka-ui
      TagsInput pattern. Press <kbd>Enter</kbd> (or a comma) to add the current
      text, <kbd>Backspace</kbd> on an empty field to remove the last tag, use the
      arrows to navigate between tags, <b>double-click</b> a tag to edit it,
      or <b>paste</b> a comma/semicolon-separated list to add several at once.
      <b>&lt;q-input-tag&gt;</b> keeps the same field vocabulary as
      <code>q-input</code> (<code>outlined</code>, <code>filled</code>,
      <code>dense</code>, <code>error</code>…).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        The <code>v-model</code> is an array of strings. Add with Enter/comma,
        remove with <code>×</code>, Backspace or Delete, navigate with the arrows,
        double-click a tag to edit it, or paste a list — try pasting
        <code>vue, nuxt, tailwind</code> in the field below.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-field">
          <q-input-tag
            v-model="emails"
            label="Emails"
            placeholder="Type and press Enter"
            outlined
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Events ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Events</h2>
      <p class="doc-note">
        <code>add</code> and <code>remove</code> fire with the affected tag —
        useful for validation or backend sync.
      </p>

      <docs-demo :code="usageEvents" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-field">
          <q-input-tag
            v-model="features"
            label="Features"
            placeholder="Add a feature…"
            outlined
            @add="lastEvent = 'added: ' + $event"
            @remove="lastEvent = 'removed: ' + $event"
          />
          <p class="demo-p demo-event">Last event: {{ lastEvent || "—" }}</p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ States ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Max, variants &amp; states</h2>
      <p class="doc-note">
        <code>max-tags</code> limits the count, <code>filled</code>/<code>dense</code>
        change the look, <code>disable</code> locks the field.
      </p>

      <docs-demo :code="usageStates" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-col">
          <q-input-tag v-model="limited" label="Max 3 tags" :max-tags="3" outlined />
          <q-input-tag v-model="features" label="Filled & dense" filled dense />
          <q-input-tag v-model="emails" label="Disabled" disable outlined />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QInputTag API</h2>
      <docs-api :comp="inputTag" :source="inputTagSource" />
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
.doc-note code,
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.demo-field {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 420px;
  margin: 0 auto;
}
.demo-event {
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
</style>
