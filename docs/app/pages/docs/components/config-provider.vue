<script setup lang="ts">
// Config Provider — la racine de l'application : thème + providers programmatiques.
// Documente aussi les bonnes pratiques de structure (app shell, dialog, sheets…).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const configProvider = useComponent(() => "QConfigProvider")
const configProviderSource = componentSource("QConfigProvider")
const tag = componentTag("QConfigProvider")

// — Démo thème live —
const mode = ref<"light" | "dark">("light")
const radiusDemo = ref<"none" | "sm" | "md" | "lg">("md")
const RADII: { label: string; value: "none" | "sm" | "md" | "lg" }[] = [
  { label: "none", value: "none" },
  { label: "sm", value: "sm" },
  { label: "md", value: "md" },
  { label: "lg", value: "lg" },
]

const appShell = `<q-config-provider :theme="{ mode: 'system', colors: { primary: '#1976d2' } }">
  <q-app>
    <q-back-header fixed title="Page title" @back="router.back()" />
    <q-header fixed>
      <q-toolbar>
        <q-icon name="lucide:menu" size="22px" />
        <q-space />
        <q-btn flat round dense icon="lucide:search" aria-label="Search" />
      </q-toolbar>
    </q-header>

    <q-page>
      <q-container>
        <!-- le contenu de la page — jamais masqué par les barres fixed -->
      </q-container>
    </q-page>

    <q-footer>
      <q-toolbar>
        <q-icon name="lucide:box" size="20px" />
        <span>Dnax UI</span>
      </q-toolbar>
    </q-footer>
  </q-app>
</q-config-provider>`

const appShellNote = `L'ordre des barres compte :
- <q-back-header fixed> puis <q-header fixed> → la barre de retour se cale
  au-dessus, le header en dessous (empilement automatique).
- <q-page> reçoit automatiquement un padding-top égal à la hauteur cumulée
  des barres fixed qui le précèdent : le contenu ne passe jamais sous elles.
- <q-footer> reste en bas (safe-area bottom appliquée).`

const dialogPattern = `<q-dialog v-model="open" maximized>
  <q-dialog-header title="Title" description="Optional subtitle" />
  <!-- corps scrollable du dialog -->
  <div class="dialog-body">
    <p>Contenu…</p>
  </div>
  <q-dialog-footer>
    <q-btn flat label="Cancel" @click="open = false" />
    <q-btn color="primary" label="Confirm" @click="open = false" />
  </q-dialog-footer>
</q-dialog>`

const bottomSheetPattern = `<q-bottom-sheet v-model="open">
  <template #trigger>
    <q-btn color="primary" icon="lucide:settings" label="Open settings" />
  </template>
  <q-bottom-sheet-header title="Settings" description="Tune your preferences" />
  <div class="sheet-body">
    <p>Contenu du panneau…</p>
  </div>
  <q-bottom-sheet-footer>
    <q-btn flat label="Cancel" @click="open = false" />
    <q-btn color="primary" label="Save" @click="open = false" />
  </q-bottom-sheet-footer>
</q-bottom-sheet>`

const actionSheetPattern = `<q-action-sheet
  v-model="open"
  title="Share to"
  cancel="Dismiss"
  :options="[
    { label: 'Share', icon: 'lucide:share-2' },
    { label: 'Copy link', icon: 'lucide:link' },
    { label: 'Save to device', icon: 'lucide:download' },
  ]"
  @select="onSelect"
/>`

const sidebarPattern = `<q-sidebar v-model="open" side="left" width="280px" bordered>
  <q-sidebar-header>
    <q-icon name="lucide:box" color="primary" size="22px" />
    <b>App</b>
    <q-space />
    <theme-toggle />
  </q-sidebar-header>
  <q-sidebar-content>
    <q-sidebar-menu>
      <q-sidebar-menu-button label="Home" icon="lucide:house" href="/" />
      <q-sidebar-menu-button label="Settings" icon="lucide:settings" href="/settings" />
    </q-sidebar-menu>
  </q-sidebar-content>
</q-sidebar>`

const fieldPickerPattern = `<q-select v-model="plan" :options="plans" label="Plan" mode="sheet" />
<q-date-picker v-model="date" label="Due date" mode="dialog" />
<q-country-picker v-model="code" label="Country" mode="modal" />
<!-- Modes : inline | sheet | modal | dialog — tous gérés par l'overlayBack -->
<!-- sur « retour » navigateur, le panneau se ferme au lieu de naviguer. -->`

const providerPattern = `<q-config-provider>            <!-- le plus externe : monte les providers -->
  <q-app>…</q-app>                       <!-- $q.dialog / $q.bottomSheet / $q.notify / … -->
</q-config-provider>

<script setup lang="ts">
import { $q } from "@dnax/ui"

const confirm = $q.dialog.open({
  component: ConfirmDialog,
  title: "Delete?",
  description: "This cannot be undone.",
})
confirm.onOK(() => remove())
<\/script>

<!-- ConfirmDialog.vue — doit commencer par <q-dialog> (pattern Quasar) -->
<script setup lang="ts">
import { useDialogPluginComponent } from "@dnax/ui"
const { open, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
<\/script>
<template>
  <q-dialog v-model="open" @hide="onDialogHide">
    <q-dialog-header title="Delete?" description="This cannot be undone." />
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn color="negative" label="Delete" @click="onDialogOK" />
    </q-dialog-footer>
  </q-dialog>
</template>`

const scriptAppShell = `import { useRouter } from "vue-router"

const router = useRouter()`

const scriptTheme = `import { ref } from "vue"

const mode = ref("light")
const radius = ref("md")`

const usageTheme = `<q-config-provider
  :theme="{ mode, componentProps: { default: { radius } } }"
>
  <div class="demo-stage">
    <q-btn unelevated no-caps color="primary" label="Button" />
    <q-input label="Field" outlined dense placeholder="…" />
  </div>
</q-config-provider>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Config Provider</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      The application root: <b>&lt;q-config-provider&gt;</b> supplies the theme
      (colors, <code>mode</code> light/dark/system, default component props) to the
      whole subtree through CSS variables, and automatically mounts the
      programmatic providers (<code>$q.dialog</code>, <code>$q.bottomSheet</code>,
      <code>$q.notify</code>, <code>$q.loading</code>, <code>$q.imagePreview</code>).
      It is the first component of every app — see the initialization best
      practice below.
    </p>

    <!-- ═══════ App shell ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Best practice — app initialization</h2>
      <p class="doc-note">
        Wrap the whole app in a single <code>&lt;q-config-provider&gt;</code>: it
        applies the theme to every component and mounts the providers exactly once
        (nested providers do not re-mount them). The canonical shell is:
      </p>
      <docs-demo :code="appShell" lang="html" filename="App.vue" :script="scriptAppShell">
        <div class="demo-stage demo-stage--shell">
          <q-config-provider>
            <q-app>
              <q-back-header fixed title="Page title" class="demo-shell-bar">
                <q-btn flat round dense icon="lucide:more-vertical" aria-label="More" />
              </q-back-header>
              <q-header fixed class="demo-shell-bar">
                <q-toolbar>
                  <q-icon name="lucide:menu" size="22px" />
                  <q-space />
                  <q-btn flat round dense icon="lucide:search" aria-label="Search" />
                </q-toolbar>
              </q-header>

              <q-page class="demo-shell-page">
                <q-container>
                  <p class="demo-p demo-shell-note">
                    The page is automatically offset below the two fixed bars — this
                    text is never hidden behind the header.
                  </p>
                </q-container>
              </q-page>
            </q-app>
          </q-config-provider>
        </div>
      </docs-demo>

      <p class="doc-note">
        {{ appShellNote }}
      </p>
    </section>

    <!-- ═══════ Structure patterns ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Structure patterns</h2>
      <p class="doc-note">
        The canonical structure of each family — copy these skeletons when starting
        a new screen.
      </p>

      <h3 class="doc-h3">Dialog</h3>
      <q-syntax :code="dialogPattern" lang="html" filename="Dialog.vue" copy />

      <h3 class="doc-h3">Bottom sheet</h3>
      <q-syntax :code="bottomSheetPattern" lang="html" filename="SettingsSheet.vue" copy />

      <h3 class="doc-h3">Action sheet</h3>
      <q-syntax :code="actionSheetPattern" lang="html" filename="ShareSheet.vue" copy />

      <h3 class="doc-h3">Sidebar</h3>
      <q-syntax :code="sidebarPattern" lang="html" filename="Sidebar.vue" copy />

      <h3 class="doc-h3">Field pickers (sheet / modal / dialog)</h3>
      <q-syntax :code="fieldPickerPattern" lang="html" filename="Form.vue" copy />

      <h3 class="doc-h3">Programmatic providers</h3>
      <p class="doc-note">
        The <code>$q</code> plugins are available right after installing the module —
        the outermost <code>&lt;q-config-provider&gt;</code> renders their stacks.
      </p>
      <q-syntax :code="providerPattern" lang="html" filename="app.vue" copy />
    </section>

    <!-- ═══════ Theme demo ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Theming</h2>
      <p class="doc-note">
        <code>:theme</code> accepts a mode string (<code>"light" | "dark" |
        "system"</code>) or an object — <code>colors</code> overrides any design
        token, <code>componentProps</code> sets default props per component (a
        <code>default.radius</code> drives the global <code>--q-radius</code>).
        The <code>.dark</code> class is applied to <code>&lt;html&gt;</code> so
        teleported overlays follow the theme too.
      </p>
      <docs-demo :code="usageTheme" lang="html" filename="App.vue" :script="scriptTheme">
        <div class="demo-row">
          <q-btn-group>
            <q-btn
              v-for="m in ['light', 'dark'] as const"
              :key="m"
              flat
              no-caps
              :color="mode === m ? 'primary' : ''"
              :label="m"
              @click="mode = m"
            />
          </q-btn-group>
          <q-select v-model="radiusDemo" :options="RADII" option-label="label" option-value="value" emit-value label="radius" outlined dense class="demo-radius" />
        </div>
        <q-config-provider
          :theme="{ mode, componentProps: { default: { radius: radiusDemo } } }"
        >
          <div class="demo-stage demo-stage--theme">
            <q-btn unelevated no-caps color="primary" label="Button" />
            <q-input label="Field" outlined dense placeholder="Type here…" />
            <q-chip icon="lucide:zap" label="Chip" color="secondary" outline removable />
          </div>
        </q-config-provider>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QConfigProvider API</h2>
      <docs-api :comp="configProvider" :source="configProviderSource" />
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

.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.demo-radius {
  width: 160px;
}

/* — stage d'aperçu du shell — */
.demo-stage {
  border: 1px dashed rgb(0 0 0 / 0.14);
  border-radius: 12px;
  overflow: hidden;
  min-height: 120px;
}
.demo-stage--shell {
  background: #fff;
}
.demo-stage--theme {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: var(--muted);
}
.demo-shell-bar + .demo-shell-bar {
  margin-top: 0;
}
.demo-shell-page {
  padding: 18px;
}
.demo-shell-note {
  color: #5b6472;
}

.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
</style>
