<script setup lang="ts">
// List — documentation complète de la famille :
// QList (conteneur) + QItem (ligne) + QItemSection (zones avatar/principale/side).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const list = useComponent(() => "QList")
const listSource = componentSource("QList")
const item = useComponent(() => "QItem")
const itemSource = componentSource("QItem")
const itemSection = useComponent(() => "QItemSection")
const itemSectionSource = componentSource("QItemSection")

const tag = componentTag("QList")

// — Démos —
const contacts = [
  { name: "Alex Martin", initials: "AM", caption: "Online now", color: "positive" },
  { name: "Samira Chen", initials: "SC", caption: "Last seen 2h ago", color: "secondary" },
  { name: "Jules Dubois", initials: "JD", caption: "Offline", color: "negative" },
]

const activeMenu = ref("inbox")
const menu = [
  { key: "inbox", label: "Inbox", icon: "lucide:inbox", count: "12" },
  { key: "sent", label: "Sent", icon: "lucide:send", count: "3" },
  { key: "drafts", label: "Drafts", icon: "lucide:file-pen", count: "1" },
]

const thumbnail = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600&auto=format&fit=crop"

const listCode = `<q-list bordered separator>
  <q-item><q-item-section>Bordered + separator</q-item-section></q-item>
  <q-item><q-item-section>Second row</q-item-section></q-item>
</q-list>

<q-list dark>
  <q-item><q-item-section>Dark theme</q-item-section></q-item>
</q-list>`

const basicCode = `<q-list bordered separator class="list">
  <q-item v-for="c in contacts" :key="c.name">
    <q-item-section avatar>
      <q-avatar :color="c.color" text-color="white">{{ c.initials }}</q-avatar>
    </q-item-section>
    <q-item-section>
      <div class="title">{{ c.name }}</div>
      <div class="caption">{{ c.caption }}</div>
    </q-item-section>
    <q-item-section side>
      <q-icon name="lucide:chevron-right" color="grey" />
    </q-item-section>
  </q-item>
</q-list>`

const clickableCode = `<q-list bordered class="list">
  <q-item
    v-for="m in menu"
    :key="m.key"
    clickable
    :active="active === m.key"
    @click="active = m.key"
  >
    <q-item-section avatar>
      <q-icon :name="m.icon" color="primary" />
    </q-item-section>
    <q-item-section>{{ m.label }}</q-item-section>
    <q-item-section side>
      <q-badge :label="m.count" color="primary" />
    </q-item-section>
  </q-item>
</q-list>`

const thumbnailCode = `<q-list bordered class="list">
  <q-item>
    <q-item-section thumbnail>
      <q-img :src="photo" ratio="1" class="thumb" />
    </q-item-section>
    <q-item-section>
      <div class="title">Moraine Lake</div>
      <div class="caption">Banff National Park, Canada</div>
    </q-item-section>
    <q-item-section side>
      <q-icon name="lucide:chevron-right" color="grey" />
    </q-item-section>
  </q-item>
</q-list>`

const alignmentCode = `<q-list bordered class="list">
  <q-item>
    <q-item-section avatar>
      <q-icon name="lucide:bell" color="warning" size="22px" />
    </q-item-section>
    <q-item-section top>
      <div class="title">New update available</div>
      <div class="caption">v2.4.0 · 2 minutes ago · a longer description that wraps onto several lines to demonstrate the top alignment.</div>
    </q-item-section>
    <q-item-section side top>
      <q-icon name="lucide:x" />
    </q-item-section>
  </q-item>
</q-list>`

const statesCode = `<q-list bordered dense class="list">
  <q-item :inset-level="1">
    <q-item-section>Indented item</q-item-section>
  </q-item>
  <q-item dense>
    <q-item-section>Dense item</q-item-section>
  </q-item>
  <q-item disable>
    <q-item-section>Disabled item</q-item-section>
  </q-item>
</q-list>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">List</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      The list family: <b>&lt;q-list&gt;</b> is the container (padding, borders,
      separators, dark), <b>&lt;q-item&gt;</b> is a row — clickable, active, dense,
      disabled — and <b>&lt;q-item-section&gt;</b> splits it into zones:
      <code>avatar</code> / <code>thumbnail</code> on the left, the main flexible
      section, and a <code>side</code> zone on the right.
    </p>

    <!-- ═══════ QList ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QList — container</h2>
      <p class="doc-note">
        <code>bordered</code>, <code>separator</code> (lines between rows),
        <code>dense</code>, <code>padding</code> and <code>dark</code>.
      </p>

      <docs-demo :code="listCode" lang="html" filename="App.vue">
        <div class="demo-stack">
          <q-list bordered separator class="demo-list">
            <q-item><q-item-section>Bordered + separator</q-item-section></q-item>
            <q-item><q-item-section>Second row</q-item-section></q-item>
          </q-list>
          <q-list dark class="demo-list">
            <q-item><q-item-section>Dark theme</q-item-section></q-item>
          </q-list>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ QItem — basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QItem — basic rows</h2>
      <p class="doc-note">
        The classic contact-row layout: avatar, main section (title + caption),
        side chevron.
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <q-list bordered separator class="demo-list">
          <q-item v-for="c in contacts" :key="c.name">
            <q-item-section avatar>
              <q-avatar :color="c.color" text-color="white">{{ c.initials }}</q-avatar>
            </q-item-section>
            <q-item-section>
              <div class="demo-item-title">{{ c.name }}</div>
              <div class="demo-item-caption">{{ c.caption }}</div>
            </q-item-section>
            <q-item-section side>
              <q-icon name="lucide:chevron-right" color="grey" />
            </q-item-section>
          </q-item>
        </q-list>
      </docs-demo>
    </section>

    <!-- ═══════ Clickable & active ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Clickable &amp; active</h2>
      <p class="doc-note">
        <code>clickable</code> adds hover + cursor; <code>active</code> (or
        <code>active-class</code>) highlights the selected row — try clicking.
      </p>

      <docs-demo :code="clickableCode" lang="html" filename="App.vue">
        <q-list bordered class="demo-list">
          <q-item
            v-for="m in menu"
            :key="m.key"
            clickable
            :active="activeMenu === m.key"
            @click="activeMenu = m.key"
          >
            <q-item-section avatar>
              <q-icon :name="m.icon" color="primary" />
            </q-item-section>
            <q-item-section>{{ m.label }}</q-item-section>
            <q-item-section side>
              <q-badge :label="m.count" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>
      </docs-demo>
    </section>

    <!-- ═══════ QItemSection — thumbnail ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QItemSection — thumbnail</h2>
      <p class="doc-note">
        <code>thumbnail</code> reserves a fixed image zone on the left.
      </p>

      <docs-demo :code="thumbnailCode" lang="html" filename="App.vue">
        <q-list bordered class="demo-list">
          <q-item>
            <q-item-section thumbnail>
              <q-img :src="thumbnail" ratio="1" class="demo-thumb" />
            </q-item-section>
            <q-item-section>
              <div class="demo-item-title">Moraine Lake</div>
              <div class="demo-item-caption">Banff National Park, Canada</div>
            </q-item-section>
            <q-item-section side>
              <q-icon name="lucide:chevron-right" color="grey" />
            </q-item-section>
          </q-item>
        </q-list>
      </docs-demo>
    </section>

    <!-- ═══════ Alignment ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Alignment</h2>
      <p class="doc-note">
        <code>top</code> aligns the section to the top; <code>side top</code> pins
        the action icon to the top-right of a multi-line row.
      </p>

      <docs-demo :code="alignmentCode" lang="html" filename="App.vue">
        <q-list bordered class="demo-list">
          <q-item>
            <q-item-section avatar>
              <q-icon name="lucide:bell" color="warning" size="22px" />
            </q-item-section>
            <q-item-section top>
              <div class="demo-item-title">New update available</div>
              <div class="demo-item-caption">v2.4.0 · 2 minutes ago · a longer description that wraps onto several lines to demonstrate the top alignment.</div>
            </q-item-section>
            <q-item-section side top>
              <q-icon name="lucide:x" />
            </q-item-section>
          </q-item>
        </q-list>
      </docs-demo>
    </section>

    <!-- ═══════ Dense, disabled & inset ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Dense, disabled &amp; inset</h2>
      <p class="doc-note">
        <code>dense</code> shrinks rows, <code>disable</code> greys them out,
        <code>inset-level</code> indents by multiples of 8px.
      </p>

      <docs-demo :code="statesCode" lang="html" filename="App.vue">
        <q-list bordered dense class="demo-list">
          <q-item :inset-level="1">
            <q-item-section>Indented item</q-item-section>
          </q-item>
          <q-item dense>
            <q-item-section>Dense item</q-item-section>
          </q-item>
          <q-item disable>
            <q-item-section>Disabled item</q-item-section>
          </q-item>
        </q-list>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QList</h2>
      <docs-api :comp="list" :source="listSource" />
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">QItem</h2>
      <docs-api :comp="item" :source="itemSource" />
    </section>

    <section class="doc-section">
      <h2 class="doc-h2">QItemSection</h2>
      <docs-api :comp="itemSection" :source="itemSectionSource" />
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

.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.demo-list {
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}
.demo-item-title {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--foreground);
}
.demo-item-caption {
  font-size: 12.5px;
  color: #8b93a1;
}
.demo-thumb {
  width: 56px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
