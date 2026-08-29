<script setup lang="ts">
// Bottom Sheet — documentation complète de la famille :
// QBottomSheet + QBottomSheetHeader + QBottomSheetFooter + QBottomSheetTrigger + QBottomSheetProvider.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const sheet = useComponent(() => "QBottomSheet")
const sheetHeader = useComponent(() => "QBottomSheetHeader")
const sheetFooter = useComponent(() => "QBottomSheetFooter")
const sheetTrigger = useComponent(() => "QBottomSheetTrigger")
const sheetProvider = useComponent(() => "QBottomSheetProvider")

const sheetSource = componentSource("QBottomSheet")
const sheetHeaderSource = componentSource("QBottomSheetHeader")
const sheetFooterSource = componentSource("QBottomSheetFooter")
const sheetTriggerSource = componentSource("QBottomSheetTrigger")
const sheetProviderSource = componentSource("QBottomSheetProvider")

const tag = componentTag("QBottomSheet")

// — Démo interactive —
const open = ref(false)
const openTall = ref(false)

const usageSheet = `<q-bottom-sheet v-model="open">
  <template #trigger>
    <q-btn color="primary" icon="lucide:settings" label="Open settings" />
  </template>
  <q-bottom-sheet-header title="Settings" description="Tune your notifications and preferences" />
  <div class="demo-sheet-body">
    <p class="demo-p">
      Drag the handle down, tap the backdrop, or press Escape to close. The panel is
      anchored to the bottom edge and respects the iOS safe area.
    </p>
  </div>
  <q-bottom-sheet-footer>
    <q-btn flat label="Cancel" @click="open = false" />
    <q-btn color="primary" label="Save" @click="open = false" />
  </q-bottom-sheet-footer>
</q-bottom-sheet>`

const usageVariants = `<q-bottom-sheet v-model="open" height="70%" rounded="24px" translucent>
  <template #trigger>
    <q-btn outline label="Tall translucent sheet" />
  </template>
  <q-bottom-sheet-header title="Quick actions" description="height, rounded and translucent" />
  <div class="demo-sheet-body">
    <p class="demo-p">
      <code>height</code> fixes the panel height, <code>rounded</code> accepts a CSS
      value, and <code>translucent</code> enables a frosted-glass background.
    </p>
  </div>
</q-bottom-sheet>`

const usageTrigger = `<q-bottom-sheet v-model="open">
  <template #trigger>
    <q-bottom-sheet-trigger label="Open sheet" />
  </template>
  <q-bottom-sheet-header title="Bottom sheet" description="Component alternative to the #trigger slot" />
  <div class="demo-sheet-body">
    <p class="demo-p">
      QBottomSheetTrigger is the component alternative to the <code>#trigger</code>
      slot — same behavior, rendered as a standalone button.
    </p>
  </div>
</q-bottom-sheet>`

const usageHeader = `<q-bottom-sheet-header title="Settings" description="Tune your preferences" />

<!-- or with custom slots -->
<q-bottom-sheet-header>
  <template #title>
    <q-icon name="lucide:sparkles" color="primary" />
    <span>Custom title</span>
  </template>
  <template #description>Custom description</template>
</q-bottom-sheet-header>`

const usageFooter = `<q-bottom-sheet-footer>
  <q-btn flat label="Cancel" @click="open = false" />
  <q-btn color="primary" label="Save" @click="open = false" />
</q-bottom-sheet-footer>`

const usageProvider = `import { $q } from "@dnax/ui"

const sheet = $q.bottomSheet.open({
  component: ProfileContent,
  title: "Profile",
  description: "Your public information",
  height: "70%",
  rounded: "24px",
  translucent: true,
})

sheet.onOK((data) => console.log("ok", data))
sheet.onCancel(() => console.log("cancelled"))`

// — Scripts des démos (onglet "Script setup") —
const scriptSheet = `import { ref } from "vue"

const open = ref(false)`

const scriptVariants = `import { ref } from "vue"

const openTall = ref(false)`

const scriptTrigger = scriptSheet
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Bottom Sheet</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A bottom sheet slides a panel up from the bottom edge — the mobile pattern for
      contextual actions and quick settings. The family comprises five components:
      <b>&lt;q-bottom-sheet&gt;</b> (the panel, with drag-to-dismiss),
      <b>&lt;q-bottom-sheet-header&gt;</b>, <b>&lt;q-bottom-sheet-footer&gt;</b>,
      <b>&lt;q-bottom-sheet-trigger&gt;</b> and <b>&lt;q-bottom-sheet-provider&gt;</b>
      (for the programmatic <code>$q.bottomSheet</code> stack).
    </p>

    <!-- ═══════ QBottomSheet ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBottomSheet — the panel</h2>

      <docs-demo :code="usageSheet" lang="html" filename="App.vue" :script="scriptSheet">
        <q-bottom-sheet v-model="open">
          <template #trigger>
            <q-btn color="primary" icon="lucide:settings" label="Open settings" />
          </template>
          <q-bottom-sheet-header title="Settings" description="Tune your notifications and preferences" />
          <div class="demo-sheet-body">
            <p class="demo-p">
              Drag the handle down, tap the backdrop, or press Escape to close. The panel is
              anchored to the bottom edge and respects the iOS safe area.
            </p>
          </div>
          <q-bottom-sheet-footer>
            <q-btn flat label="Cancel" @click="open = false" />
            <q-btn color="primary" label="Save" @click="open = false" />
          </q-bottom-sheet-footer>
        </q-bottom-sheet>
      </docs-demo>

      <h3 class="doc-h3">Sizing &amp; look</h3>
      <docs-demo :code="usageVariants" lang="html" filename="App.vue" :script="scriptVariants">
        <q-bottom-sheet v-model="openTall" height="70%" rounded="24px" translucent>
          <template #trigger>
            <q-btn outline label="Tall translucent sheet" />
          </template>
          <q-bottom-sheet-header title="Quick actions" description="height, rounded and translucent" />
          <div class="demo-sheet-body">
            <p class="demo-p">
              <code>height</code> fixes the panel height, <code>rounded</code> accepts a CSS
              value, and <code>translucent</code> enables a frosted-glass background.
            </p>
          </div>
        </q-bottom-sheet>
      </docs-demo>

      <p class="doc-note">
        The opener is declared through the <code>#trigger</code> slot (rendered next to the
        sheet), and <code>v-model</code> keeps the open state in sync. Use
        <code>persistent</code> to disable backdrop / Escape dismissal, and
        <code>drag-threshold</code> to tune how far the handle must be dragged to close.
      </p>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sheet" :source="sheetSource" />
    </section>

    <!-- ═══════ QBottomSheetHeader ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBottomSheetHeader — title &amp; close</h2>
      <p class="doc-note">
        Header of the panel with a <code>title</code>, an optional <code>description</code>
        and a close button that closes the sheet. Custom content can be passed through the
        <code>#title</code> and <code>#description</code> slots.
      </p>
      <q-syntax :code="usageHeader" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sheetHeader" :source="sheetHeaderSource" />
    </section>

    <!-- ═══════ QBottomSheetFooter ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBottomSheetFooter — actions</h2>
      <p class="doc-note">
        Simple container for the action buttons at the bottom of the panel, below the
        scrollable body — typically a dismissive action and a confirming one.
      </p>
      <q-syntax :code="usageFooter" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sheetFooter" :source="sheetFooterSource" />
    </section>

    <!-- ═══════ QBottomSheetTrigger ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBottomSheetTrigger — declarative opener</h2>
      <p class="doc-note">
        A button that opens its parent sheet — the component alternative to the
        <code>#trigger</code> slot. Place it in the <code>#trigger</code> slot (as below)
        or anywhere inside an open sheet, e.g. to open a nested one.
      </p>
      <docs-demo :code="usageTrigger" lang="html" filename="App.vue" :script="scriptTrigger">
        <q-bottom-sheet v-model="open">
          <template #trigger>
            <q-bottom-sheet-trigger label="Open sheet" />
          </template>
          <q-bottom-sheet-header title="Bottom sheet" description="Component alternative to the #trigger slot" />
          <div class="demo-sheet-body">
            <p class="demo-p">
              QBottomSheetTrigger is the component alternative to the <code>#trigger</code>
              slot — same behavior, rendered as a standalone button.
            </p>
          </div>
        </q-bottom-sheet>
      </docs-demo>
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sheetTrigger" :source="sheetTriggerSource" />
    </section>

    <!-- ═══════ QBottomSheetProvider ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBottomSheetProvider — programmatic sheets</h2>
      <p class="doc-note">
        Renders the stack of programmatic sheets pushed with
        <code>$q.bottomSheet.open()</code>. It is mounted automatically by the outermost
        <code>&lt;q-config-provider&gt;</code> — no extra setup needed. Each entry is
        rendered inside a <code>&lt;q-bottom-sheet&gt;</code>; when the content component
        emits <code>ok</code>, <code>cancel</code>, <code>dismiss</code> or
        <code>close</code>, the matching resolver is called and the entry is removed.
      </p>
      <q-syntax :code="usageProvider" lang="ts" filename="app.ts" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sheetProvider" :source="sheetProviderSource" />
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
.demo-sheet {
  width: 100%;
  max-width: 560px;
}

/* contenu du panneau (rendu dans le slot de q-bottom-sheet) */
.demo-sheet-body {
  padding: 16px 20px;
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
