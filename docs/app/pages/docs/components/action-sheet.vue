<script setup lang="ts">
// Action Sheet — documentation complète de QActionSheet.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const actionSheet = useComponent(() => "QActionSheet")
const actionSheetSource = componentSource("QActionSheet")

const tag = componentTag("QActionSheet")

// — Démo interactive —
const open = ref(false)
const openPlan = ref(false)
const result = ref("")
const last = ref("")

const shareOptions = ref([
  { label: "Copy link", icon: "lucide:link", value: "copy" },
  { label: "Email", icon: "lucide:mail", value: "email", description: "Send a message" },
  { label: "Messages", icon: "lucide:message-circle", value: "messages" },
  { label: "More options", icon: "lucide:ellipsis", description: "No value — the option itself is emitted" },
])

const planOptions = ref([
  { label: "Free", value: "free", icon: "lucide:gift" },
  { label: "Pro", value: "pro", icon: "lucide:zap", color: "primary", description: "Best value" },
  { label: "Enterprise", value: "enterprise", icon: "lucide:building-2", color: "#d97706" },
])

const onSelect = (value: any) => {
  result.value = typeof value === "string" ? value : (value?.label ?? JSON.stringify(value))
}

const usageOptions = `<q-btn color="primary" icon="lucide:share-2" label="Share" @click="open = true" />

<q-action-sheet
  v-model="open"
  title="Share to"
  :options="shareOptions"
  @select="onSelect"
/>
<p v-if="result" class="demo-action-result">Selected: <code>{{ result }}</code></p>`

const usageEvents = `<q-btn outline label="Choose a plan" @click="openPlan = true" />

<q-action-sheet
  v-model="openPlan"
  title="Upgrade plan"
  cancel="Dismiss"
  :options="planOptions"
  @select="last = 'select: ' + $event"
  @cancel="last = 'cancel'"
/>
<p v-if="last" class="demo-action-result">Last event: <code>{{ last }}</code></p>`

// — Scripts des démos (onglet "Script setup") —
const scriptOptions = `import { ref } from "vue"

const open = ref(false)
const result = ref("")

const shareOptions = ref([
  { label: "Copy link", icon: "lucide:link", value: "copy" },
  { label: "Email", icon: "lucide:mail", value: "email", description: "Send a message" },
  { label: "Messages", icon: "lucide:message-circle", value: "messages" },
  { label: "More options", icon: "lucide:ellipsis", description: "No value — the option itself is emitted" },
])

const onSelect = (value) => {
  result.value = typeof value === "string" ? value : (value?.label ?? JSON.stringify(value))
}`

const scriptEvents = `import { ref } from "vue"

const openPlan = ref(false)
const last = ref("")

const planOptions = ref([
  { label: "Free", value: "free", icon: "lucide:gift" },
  { label: "Pro", value: "pro", icon: "lucide:zap", color: "primary", description: "Best value" },
  { label: "Enterprise", value: "enterprise", icon: "lucide:building-2", color: "#d97706" },
])`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Action Sheet</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      An iOS-style action sheet presents a list of options on top of the current screen.
      The options are passed as a prop array, the selection is emitted through
      <code>@select</code>, and the component also exposes <code>@cancel</code> with a
      customizable cancel button.
    </p>

    <!-- ═══════ QActionSheet ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QActionSheet — options list</h2>

      <docs-demo :code="usageOptions" lang="html" filename="App.vue" :script="scriptOptions">
        <q-btn color="primary" icon="lucide:share-2" label="Share" @click="open = true" />

        <q-action-sheet
          v-model="open"
          title="Share to"
          :options="shareOptions"
          @select="onSelect"
        />
        <p v-if="result" class="demo-action-result">Selected: <code>{{ result }}</code></p>
      </docs-demo>

      <h3 class="doc-h3">Select &amp; cancel events</h3>
      <docs-demo :code="usageEvents" lang="html" filename="App.vue" :script="scriptEvents">
        <q-btn outline label="Choose a plan" @click="openPlan = true" />

        <q-action-sheet
          v-model="openPlan"
          title="Upgrade plan"
          cancel="Dismiss"
          :options="planOptions"
          @select="last = 'select: ' + $event"
          @cancel="last = 'cancel'"
        />
        <p v-if="last" class="demo-action-result">Last event: <code>{{ last }}</code></p>
      </docs-demo>

      <p class="doc-note">
        Each option supports an <code>icon</code> (left), an <code>icon-right</code>,
        a <code>color</code> for the label and a <code>description</code>. On selection the
        sheet closes and emits <code>@select</code> with the option's <code>value</code> —
        or the option object itself when no <code>value</code> is set. The cancel button
        emits <code>@cancel</code>; its default label is <code>Annuler</code> — pass a
        string to change it (e.g. <code>cancel="Dismiss"</code>) or
        <code>cancel="false"</code> to hide it.
      </p>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="actionSheet" :source="actionSheetSource" />
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
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
.demo-action {
  width: 100%;
  max-width: 560px;
}
.demo-action-result {
  margin: 10px 0 0;
  font-size: 13px;
  color: #8b93a1;
}

/* espace entre les blocs docs-demo */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
</style>
