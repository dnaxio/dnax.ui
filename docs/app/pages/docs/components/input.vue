<script setup lang="ts">
// Input — documentation for QInput.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const input = useComponent(() => "QInput")
const inputSource = componentSource("QInput")
const tag = componentTag("QInput")

// — Interactive demo state —
const text = ref("")
const email = ref("")
const password = ref("")
const age = ref<number | null>(null)
const outlinedVal = ref("")
const filledVal = ref("")
const borderlessVal = ref("")
const denseVal = ref("")
const clearMe = ref("Hello Dnax")
const message = ref("")
const username = ref("")
const hintEmail = ref("")
const errorEmail = ref("")
const bio = ref("")

const usageBasic = `<q-input v-model="text" label="Email" placeholder="you@example.com" />`

const usageTypes = `<q-input v-model="email" type="email" label="Email" placeholder="you@example.com" />
<q-input v-model="password" type="password" label="Password" />
<q-input v-model="age" type="number" label="Age" />`

const usageAutogrow = `<q-input v-model="bio" label="Bio" autogrow placeholder="Write a few lines…" />`

const usageVariants = `<q-input v-model="outlinedVal" label="Outlined" outlined />
<q-input v-model="filledVal" label="Filled" filled />
<q-input v-model="borderlessVal" label="Borderless" borderless />`

const usageDense = `<q-input v-model="denseVal" label="Dense pill" dense radius placeholder="Rounded" />`

const usageClear = `<q-input v-model="clearMe" label="Clearable" clearable />
<q-input v-model="message" label="Message" counter :maxlength="20" />`

const usageAffixes = `<q-input v-model="username" label="Username" prefix="@">
  <template #prepend><q-icon name="lucide:user" /></template>
  <template #append><q-icon name="lucide:badge-check" /></template>
</q-input>`

const usageHint = `<q-input v-model="hintEmail" label="Email" type="email" hint="We never share your email." />
<q-input v-model="errorEmail" label="Email" type="email" error error-message="Please enter a valid email address." />`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Input</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A single-line text field with a floating label, validation states, icons and
      affixes. <b>&lt;q-input&gt;</b> implements the Quasar field vocabulary —
      <code>outlined</code>, <code>filled</code>, <code>borderless</code>,
      <code>clearable</code>, <code>counter</code>, <code>dense</code> — plus a
      stacked label (<code>stack-label</code>), rounded corners (<code>radius</code>)
      and an auto-growing textarea (<code>autogrow</code>).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic usage</h2>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <div class="demo-field">
          <q-input v-model="text" label="Email" placeholder="you@example.com" />
        </div>
      </docs-demo>

      <h3 class="doc-h3">Field types</h3>
      <docs-demo :code="usageTypes" lang="html" filename="App.vue">
        <div class="demo-row">
          <div class="demo-col">
            <q-input v-model="email" type="email" label="Email" placeholder="you@example.com" />
          </div>
          <div class="demo-col">
            <q-input v-model="password" type="password" label="Password" />
          </div>
          <div class="demo-col">
            <q-input v-model="age" type="number" label="Age" />
          </div>
        </div>
      </docs-demo>

      <h3 class="doc-h3">Autogrow textarea</h3>
      <docs-demo :code="usageAutogrow" lang="html" filename="App.vue">
        <div class="demo-field">
          <q-input v-model="bio" label="Bio" autogrow placeholder="Write a few lines…" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Variants ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants &amp; density</h2>
      <p class="doc-note">
        The default field renders a bordered control with a white background.
        <code>outlined</code> makes the background transparent,
        <code>filled</code> switches to a gray underline style and
        <code>borderless</code> removes the border entirely.
      </p>

      <docs-demo :code="usageVariants" lang="html" filename="App.vue">
        <div class="demo-row">
          <div class="demo-col">
            <q-input v-model="outlinedVal" label="Outlined" outlined />
          </div>
          <div class="demo-col">
            <q-input v-model="filledVal" label="Filled" filled />
          </div>
          <div class="demo-col">
            <q-input v-model="borderlessVal" label="Borderless" borderless />
          </div>
        </div>
      </docs-demo>

      <h3 class="doc-h3">Dense &amp; radius</h3>
      <docs-demo :code="usageDense" lang="html" filename="App.vue">
        <div class="demo-field">
          <q-input v-model="denseVal" label="Dense pill" dense radius placeholder="Rounded" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Clearable & counter ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Clearable &amp; counter</h2>

      <docs-demo :code="usageClear" lang="html" filename="App.vue">
        <div class="demo-row">
          <div class="demo-col">
            <q-input v-model="clearMe" label="Clearable" clearable />
          </div>
          <div class="demo-col">
            <q-input v-model="message" label="Message" counter :maxlength="20" />
          </div>
        </div>
      </docs-demo>

      <h3 class="doc-h3">Icons &amp; affixes</h3>
      <p class="doc-note">
        Add leading/trailing icons through the <code>#prepend</code> /
        <code>#append</code> slots, or static text with <code>prefix</code> /
        <code>suffix</code>.
      </p>
      <docs-demo :code="usageAffixes" lang="html" filename="App.vue">
        <div class="demo-field">
          <q-input v-model="username" label="Username" prefix="@">
            <template #prepend><q-icon name="lucide:user" /></template>
            <template #append><q-icon name="lucide:badge-check" /></template>
          </q-input>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Hint & error ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Hint &amp; error</h2>

      <docs-demo :code="usageHint" lang="html" filename="App.vue">
        <div class="demo-row">
          <div class="demo-col">
            <q-input v-model="hintEmail" label="Email" type="email" hint="We never share your email." />
          </div>
          <div class="demo-col">
            <q-input v-model="errorEmail" label="Email" type="email" error error-message="Please enter a valid email address." />
          </div>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">API</h2>
      <docs-api :comp="input" :source="inputSource" />
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
.demo-field {
  width: 100%;
  max-width: 520px;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.demo-col {
  flex: 1 1 220px;
  min-width: 0;
}

/* espace entre les deux blocs docs-demo */
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
