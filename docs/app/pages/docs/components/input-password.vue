<script setup lang="ts">
// Input Password — QInputPassword : champ mot de passe avec toggle afficher/masquer.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const inputPassword = useComponent(() => "QInputPassword")
const inputPasswordSource = componentSource("QInputPassword")
const tag = componentTag("QInputPassword")

// — Démos —
const password = ref("")
const confirm = ref("")
const densePwd = ref("")

const basicCode = `<q-input-password v-model="password" label="Password" outlined />`

const variantsCode = `<q-input-password v-model="password" label="Password" outlined dense clearable />
<q-input-password v-model="password" label="Password" filled />
<q-input-password v-model="password" label="Password" borderless />`

const statesCode = `<q-input-password v-model="password" label="Password" hint="8+ characters, 1 number" outlined />
<q-input-password v-model="password" label="Password" error error-message="Too weak" outlined />
<q-input-password v-model="password" label="Password" disable outlined />`

const confirmCode = `<q-input-password v-model="password" label="Password" outlined />
<q-input-password v-model="confirm" label="Confirm password" outlined />`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Input Password</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A password field with a built-in show/hide toggle.
      <b>&lt;q-input-password&gt;</b> wraps <b>&lt;q-input&gt;</b> — same props and
      slots — and displays <code>eye-off</code> by default (hidden state), switching
      to <code>eye</code> when revealed.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        A simple password field with the <code>label</code> shown above and the
        visibility toggle on the right.
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <div class="demo-field">
          <q-input-password v-model="password" label="Password" outlined />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Variants ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Variants</h2>
      <p class="doc-note">
        All field variants pass through: <code>outlined</code> (default),
        <code>filled</code>, <code>borderless</code>, <code>dense</code>,
        <code>clearable</code>…
      </p>

      <docs-demo :code="variantsCode" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-input-password v-model="densePwd" label="Password" outlined dense clearable />
          <q-input-password v-model="densePwd" label="Password" filled />
          <q-input-password v-model="densePwd" label="Password" borderless />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ States ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Hint, error &amp; disabled</h2>
      <p class="doc-note">
        <code>hint</code>, <code>error</code> / <code>error-message</code> and
        <code>disable</code> behave exactly like <code>q-input</code>.
      </p>

      <docs-demo :code="statesCode" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-input-password v-model="densePwd" label="Password" hint="8+ characters, 1 number" outlined />
          <q-input-password v-model="densePwd" label="Password" error error-message="Too weak" outlined />
          <q-input-password v-model="densePwd" label="Password" disable outlined />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Confirmation ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Confirmation</h2>
      <p class="doc-note">
        A common pattern — password + confirmation fields side by side.
      </p>

      <docs-demo :code="confirmCode" lang="html" filename="App.vue">
        <div class="demo-col">
          <q-input-password v-model="password" label="Password" outlined />
          <q-input-password v-model="confirm" label="Confirm password" outlined />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QInputPassword</h2>
      <docs-api :comp="inputPassword" :source="inputPasswordSource" />
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
</style>
