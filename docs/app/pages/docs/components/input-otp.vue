<script setup lang="ts">
// Input OTP — documentation du composant QInputOtp :
// code à usage unique, une case par caractère.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const inputOtp = useComponent(() => "QInputOtp")
const inputOtpSource = componentSource("QInputOtp")
const tag = componentTag("QInputOtp")

// — Démos —
const code = ref("")
const phone = ref("")
const grouped = ref("")
const secret = ref("")
const locked = ref("")
const lastComplete = ref("")

const usageBasic = `<q-input-otp v-model="code" :length="6" label="Verification code" />
<p class="demo-p demo-value">Code: {{ code || "—" }}</p>`

const usageNumeric = `<q-input-otp
  v-model="phone"
  :length="4"
  numeric
  autofocus
  label="Phone code"
  hint="Enter the 4-digit code sent by SMS"
/>`

const usageGrouped = `<q-input-otp
  v-model="grouped"
  :length="6"
  :group-every="3"
  separator="-"
  label="Promo code"
/>`

const usageMasked = `<q-input-otp v-model="secret" :length="6" password label="Masked code" />`

const usageStates = `<q-input-otp v-model="code" :length="4" dense label="Dense" />
<q-input-otp v-model="code" :length="4" filled label="Filled" />
<q-input-otp v-model="code" :length="4" size="sm" label="Small" />
<q-input-otp v-model="locked" :length="4" disable label="Disabled" />
<q-input-otp v-model="code" :length="4" readonly label="Readonly" />
<q-input-otp v-model="code" :length="4" error error-message="Wrong code" />`

const usageComplete = `<q-input-otp
  v-model="code"
  :length="6"
  label="Complete to fire the event"
  @complete="lastComplete = $event"
/>
<p class="demo-p demo-value">Last complete: {{ lastComplete || "—" }}</p>`

const scriptBasic = `import { ref } from "vue"

const code = ref("")`

const scriptNumeric = `import { ref } from "vue"

const phone = ref("")`

const scriptGrouped = `import { ref } from "vue"

const grouped = ref("")`

const scriptMasked = `import { ref } from "vue"

const secret = ref("")`

const scriptStates = `import { ref } from "vue"

const code = ref("")
const locked = ref("")`

const scriptComplete = `import { ref } from "vue"

const code = ref("")
const lastComplete = ref("")`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Input OTP</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A one-time-password field: one box per character with automatic advance,
      <kbd>Backspace</kbd> navigation, arrow keys, paste of the full code and a
      <code>complete</code> event. <b>&lt;q-input-otp&gt;</b> reuses the field
      vocabulary of <code>q-input</code> (<code>label</code>, <code>outlined</code>,
      <code>filled</code>, <code>dense</code>, <code>error</code>…).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        The <code>v-model</code> is a string. Type a character to fill a box and
        jump to the next one; <kbd>Backspace</kbd> clears the current box, then
        the previous one. Click a box to select its content and type over it.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-field">
          <q-input-otp v-model="code" :length="6" label="Verification code" />
          <p class="demo-p demo-value">Code: {{ code || "—" }}</p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Numeric ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Numeric &amp; autofocus</h2>
      <p class="doc-note">
        <code>numeric</code> only accepts digits and sets
        <code>inputmode="numeric"</code> (numeric keypad on mobile);
        <code>autofocus</code> focuses the first box on mount.
      </p>

      <docs-demo :code="usageNumeric" lang="html" filename="App.vue" :script="scriptNumeric">
        <div class="demo-field">
          <q-input-otp
            v-model="phone"
            :length="4"
            numeric
            autofocus
            label="Phone code"
            hint="Enter the 4-digit code sent by SMS"
          />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Grouped & masked ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Grouped &amp; masked</h2>
      <p class="doc-note">
        <code>group-every</code> + <code>separator</code> insert a label between
        groups (promo codes, license keys); <code>password</code> masks the
        characters.
      </p>

      <docs-demo :code="usageGrouped" lang="html" filename="App.vue" :script="scriptGrouped">
        <div class="demo-field">
          <q-input-otp
            v-model="grouped"
            :length="6"
            :group-every="3"
            separator="-"
            label="Promo code"
          />
        </div>
      </docs-demo>

      <h3 class="doc-h3">Masked</h3>
      <docs-demo :code="usageMasked" lang="html" filename="App.vue" :script="scriptMasked">
        <div class="demo-field">
          <q-input-otp v-model="secret" :length="6" password label="Masked code" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ States ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants &amp; states</h2>
      <p class="doc-note">
        Same look vocabulary as <code>q-input</code>: <code>dense</code>,
        <code>filled</code>, <code>size</code> (sm / md / lg), <code>disable</code>,
        <code>readonly</code>, <code>error</code> + <code>error-message</code>.
      </p>

      <docs-demo :code="usageStates" lang="html" filename="App.vue" :script="scriptStates">
        <div class="demo-col">
          <q-input-otp v-model="code" :length="4" dense label="Dense" />
          <q-input-otp v-model="code" :length="4" filled label="Filled" />
          <q-input-otp v-model="code" :length="4" size="sm" label="Small" />
          <q-input-otp v-model="locked" :length="4" disable label="Disabled" />
          <q-input-otp v-model="code" :length="4" readonly label="Readonly" />
          <q-input-otp v-model="code" :length="4" error error-message="Wrong code" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Complete ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Complete event</h2>
      <p class="doc-note">
        <code>complete</code> fires as soon as every box is filled — handy to
        auto-submit the verification.
      </p>

      <docs-demo :code="usageComplete" lang="html" filename="App.vue" :script="scriptComplete">
        <div class="demo-field">
          <q-input-otp
            v-model="code"
            :length="6"
            label="Complete to fire the event"
            @complete="lastComplete = $event"
          />
          <p class="demo-p demo-value">Last complete: {{ lastComplete || "—" }}</p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QInputOtp API</h2>
      <docs-api :comp="inputOtp" :source="inputOtpSource" />
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

.docs-demo + h3 {
  margin-top: 32px;
}
.demo-field {
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
}
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 440px;
  margin: 0 auto;
}
.demo-value {
  margin-top: 10px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
kbd {
  background: rgb(0 0 0 / 0.06);
  border: 1px solid rgb(0 0 0 / 0.12);
  border-bottom-width: 2px;
  border-radius: 5px;
  padding: 1px 5px;
  font-size: 0.85em;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  color: var(--foreground);
}
</style>
