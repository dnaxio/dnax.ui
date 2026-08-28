<script setup lang="ts">
// Card — documentation complète de la famille :
// QCard + QCardContent + QCardActions.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const card = useComponent(() => "QCard")
const cardContent = useComponent(() => "QCardContent")
const cardActions = useComponent(() => "QCardActions")

const cardSource = componentSource("QCard")
const cardContentSource = componentSource("QCardContent")
const cardActionsSource = componentSource("QCardActions")

const tag = componentTag("QCard")

const usageBasic = `<q-card class="demo-card">
  <q-card-content>
    <h3 class="demo-card-title">Getting started</h3>
    <p class="demo-p">
      A card is a flexible container that groups related content and actions.
      The <code>media</code> slot takes an image, the default slot the body,
      and the <code>actions</code> slot a <code>q-card-actions</code> row.
    </p>
  </q-card-content>
</q-card>`

const usageBordered = `<div class="demo-card-row">
  <q-card bordered radius="lg" class="demo-card">
    <q-card-content>
      <h3 class="demo-card-title">Bordered</h3>
      <p class="demo-p">A subtle 1px border with <code>bordered</code>.</p>
    </q-card-content>
  </q-card>

  <q-card elevated class="demo-card">
    <q-card-content>
      <h3 class="demo-card-title">Elevated</h3>
      <p class="demo-p">
        Cards are flat by default — add <code>elevated</code> for a shadow,
        or <code>flat</code> to remove it explicitly.
      </p>
    </q-card-content>
  </q-card>
</div>`

const usageActions = `<q-card bordered class="demo-card">
  <q-card-content>
    <h3 class="demo-card-title">Draft release</h3>
    <p class="demo-p">
      Actions are grouped in the <code>actions</code> slot of the card and
      aligned with <code>q-card-actions</code>.
    </p>
  </q-card-content>
  <template #actions>
    <q-card-actions align="right">
      <q-btn flat label="Cancel" />
      <q-btn label="Save" />
    </q-card-actions>
  </template>
</q-card>`

const usageContent = `<q-card bordered class="demo-card">
  <q-card-content align="center">
    <h3 class="demo-card-title">Centered content</h3>
    <p class="demo-p">
      QCardContent wraps its slot in a padded block with an optional
      <code>align</code> (left | center | right) and a custom <code>padding</code>.
    </p>
  </q-card-content>
</q-card>`

const usageActionsOnly = `<q-card bordered class="demo-card">
  <q-card-content>
    <p class="demo-p">Vertical actions with space between:</p>
  </q-card-content>
  <template #actions>
    <q-card-actions align="between" vertical>
      <q-btn flat label="Delete" color="negative" />
      <q-btn label="Duplicate" />
    </q-card-actions>
  </template>
</q-card>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Card</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Cards are flexible, extensible content containers that group information
      and actions related to a single subject. The family is made of three
      components: <b>&lt;q-card&gt;</b> (the container),
      <b>&lt;q-card-content&gt;</b> (a padded content block) and
      <b>&lt;q-card-actions&gt;</b> (an action row). Cards are flat by default —
      add <code>elevated</code>, <code>bordered</code> or a <code>radius</code>
      to tune the look.
    </p>

    <!-- ═══════ QCard ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCard — container</h2>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <q-card class="demo-card">
          <q-card-content>
            <h3 class="demo-card-title">Getting started</h3>
            <p class="demo-p">
              A card is a flexible container that groups related content and actions.
              The <code>media</code> slot takes an image, the default slot the body,
              and the <code>actions</code> slot a <code>q-card-actions</code> row.
            </p>
          </q-card-content>
        </q-card>
      </docs-demo>

      <h3 class="doc-h3">Bordered, radius &amp; elevation</h3>
      <docs-demo :code="usageBordered" lang="html" filename="App.vue">
        <div class="demo-card-row">
          <q-card bordered radius="lg" class="demo-card">
            <q-card-content>
              <h3 class="demo-card-title">Bordered</h3>
              <p class="demo-p">A subtle 1px border with <code>bordered</code>.</p>
            </q-card-content>
          </q-card>

          <q-card elevated class="demo-card">
            <q-card-content>
              <h3 class="demo-card-title">Elevated</h3>
              <p class="demo-p">
                Cards are flat by default — add <code>elevated</code> for a shadow,
                or <code>flat</code> to remove it explicitly.
              </p>
            </q-card-content>
          </q-card>
        </div>
      </docs-demo>

      <h3 class="doc-h3">Actions</h3>
      <docs-demo :code="usageActions" lang="html" filename="App.vue">
        <q-card bordered class="demo-card">
          <q-card-content>
            <h3 class="demo-card-title">Draft release</h3>
            <p class="demo-p">
              Actions are grouped in the <code>actions</code> slot of the card and
              aligned with <code>q-card-actions</code>.
            </p>
          </q-card-content>
          <template #actions>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" />
              <q-btn label="Save" />
            </q-card-actions>
          </template>
        </q-card>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="card" :source="cardSource" />
    </section>

    <!-- ═══════ QCardContent ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCardContent — content block</h2>
      <p class="doc-note">
        The padded body of the card (Quasar's <code>QCardSection</code> equivalent).
        Use <code>align</code> for text alignment and <code>padding</code> to
        override the default 20px spacing.
      </p>
      <q-syntax :code="usageContent" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="cardContent" :source="cardContentSource" />
    </section>

    <!-- ═══════ QCardActions ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCardActions — action row</h2>
      <p class="doc-note">
        Groups the buttons of a card. Use it inside the <code>actions</code> slot
        of <code>&lt;q-card&gt;</code> (or anywhere). Seven alignments are
        available (<code>left</code>, <code>center</code>, <code>right</code>,
        <code>between</code>, <code>around</code>, <code>evenly</code>,
        <code>stretch</code>) plus a <code>vertical</code> stacking mode.
      </p>
      <q-syntax :code="usageActionsOnly" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="cardActions" :source="cardActionsSource" />
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

/* espace entre les deux blocs docs-demo (single / multiple) */
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

/* — démos Card — */
.demo-card {
  min-width: 240px;
  flex: 1;
}
.demo-card-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.demo-card-title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
}
</style>
