<script setup lang="ts">
// Sidebar — documentation complète de la famille :
// QSidebar + QSidebarHeader + QSidebarContent + QSidebarFooter
// + QSidebarMenu + QSidebarMenuButton + QSidebarMenuItem + QSidebarTrigger.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const sidebar = useComponent(() => "QSidebar")
const sidebarHeader = useComponent(() => "QSidebarHeader")
const sidebarContent = useComponent(() => "QSidebarContent")
const sidebarFooter = useComponent(() => "QSidebarFooter")
const sidebarMenu = useComponent(() => "QSidebarMenu")
const sidebarMenuButton = useComponent(() => "QSidebarMenuButton")
const sidebarMenuItem = useComponent(() => "QSidebarMenuItem")
const sidebarTrigger = useComponent(() => "QSidebarTrigger")

const sidebarSource = componentSource("QSidebar")
const sidebarHeaderSource = componentSource("QSidebarHeader")
const sidebarContentSource = componentSource("QSidebarContent")
const sidebarFooterSource = componentSource("QSidebarFooter")
const sidebarMenuSource = componentSource("QSidebarMenu")
const sidebarMenuButtonSource = componentSource("QSidebarMenuButton")
const sidebarMenuItemSource = componentSource("QSidebarMenuItem")
const sidebarTriggerSource = componentSource("QSidebarTrigger")

const tag = componentTag("QSidebar")

// — Démo interactive —
const open = ref(false)
const openStatic = ref(false)

const usageOffcanvas = `<div class="demo-toolbar">
  <q-btn color="primary" icon="lucide:menu" label="Open sidebar" @click="open = true" />
</div>

<q-sidebar v-model="open" width="280px" bordered elevated>
  <q-sidebar-header class="demo-side-head">
    <q-icon name="lucide:box" color="primary" size="22px" />
    <b class="demo-brand">Dnax UI</b>
    <q-space />
    <q-sidebar-trigger label="Close sidebar">
      <q-icon name="lucide:x" />
    </q-sidebar-trigger>
  </q-sidebar-header>

  <q-sidebar-content>
    <q-sidebar-menu>
      <q-sidebar-menu-item>
        <q-sidebar-menu-button label="Dashboard" icon="lucide:layout-dashboard" active />
      </q-sidebar-menu-item>
      <q-sidebar-menu-item>
        <q-sidebar-menu-button label="Projects" icon="lucide:folder-kanban" badge="3" />
      </q-sidebar-menu-item>
      <q-sidebar-menu-item>
        <q-sidebar-menu-button label="Analytics" icon="lucide:chart-line" />
      </q-sidebar-menu-item>
      <q-sidebar-menu-item>
        <q-sidebar-menu-button label="Settings" icon="lucide:settings" />
      </q-sidebar-menu-item>
    </q-sidebar-menu>
  </q-sidebar-content>

  <q-sidebar-footer>
    <q-sidebar-menu-button label="Log out" icon="lucide:log-out" />
  </q-sidebar-footer>
</q-sidebar>`

const usageStatic = `<div class="demo-layout">
  <q-sidebar show-if-above sticky height="70vh" width="240px" bordered v-model="openStatic">
    <q-sidebar-header class="demo-side-head">
      <q-icon name="lucide:box" color="primary" size="22px" />
      <b class="demo-brand">Dnax UI</b>
    </q-sidebar-header>

    <q-sidebar-content>
      <q-sidebar-menu>
        <q-sidebar-menu-item>
          <q-sidebar-menu-button label="Dashboard" icon="lucide:layout-dashboard" active />
        </q-sidebar-menu-item>
        <q-sidebar-menu-item>
          <q-sidebar-menu-button label="Projects" icon="lucide:folder-kanban" badge="3" />
        </q-sidebar-menu-item>
        <q-sidebar-menu-item>
          <q-sidebar-menu-button label="Settings" icon="lucide:settings" />
        </q-sidebar-menu-item>
      </q-sidebar-menu>
    </q-sidebar-content>

    <q-sidebar-footer>
      <div class="demo-user">
        <q-icon name="lucide:user-round" />
        <span>Ada Lovelace</span>
      </div>
    </q-sidebar-footer>
  </q-sidebar>

  <div class="demo-main">
    <h4>Page content</h4>
    <p class="demo-p">
      On wide screens the panel is part of the layout; below the
      breakpoint it collapses into an offcanvas drawer.
    </p>
  </div>
</div>`

const usageHeader = `<q-sidebar-header>
  <q-icon name="lucide:box" color="primary" size="22px" />
  <b>Dnax UI</b>
</q-sidebar-header>`

const usageContent = `<q-sidebar-content>
  <q-sidebar-menu>
    <q-sidebar-menu-item>…</q-sidebar-menu-item>
  </q-sidebar-menu>
</q-sidebar-content>`

const usageFooter = `<q-sidebar-footer>
  <q-sidebar-menu-button label="Log out" icon="lucide:log-out" />
</q-sidebar-footer>`

const usageMenu = `<q-sidebar-menu>
  <q-sidebar-menu-item>
    <q-sidebar-menu-button label="Dashboard" icon="lucide:layout-dashboard" active />
  </q-sidebar-menu-item>
  <q-sidebar-menu-item>
    <q-sidebar-menu-button label="Projects" icon="lucide:folder-kanban" badge="3" />
  </q-sidebar-menu-item>
</q-sidebar-menu>`

const usageMenuButton = `<q-sidebar-menu-button label="Dashboard" icon="lucide:layout-dashboard" active />
<q-sidebar-menu-button label="Projects" icon="lucide:folder-kanban" badge="3" />
<q-sidebar-menu-button label="Settings" icon="lucide:settings" href="/settings" />`

const usageMenuItem = `<q-sidebar-menu-item>
  <q-sidebar-menu-button label="Dashboard" icon="lucide:layout-dashboard" />
</q-sidebar-menu-item>`

const usageTrigger = `<q-sidebar-trigger label="Toggle sidebar" />

<!-- or with custom content (e.g. a close icon) -->
<q-sidebar-trigger label="Close sidebar">
  <q-icon name="lucide:x" />
</q-sidebar-trigger>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Sidebar</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A collapsible side panel for application navigation, modeled on shadcn-vue's
      Sidebar with a QDrawer-style API. The family is made of eight components:
      <b>&lt;q-sidebar&gt;</b> (the panel), the three layout zones
      <b>&lt;q-sidebar-header&gt;</b>, <b>&lt;q-sidebar-content&gt;</b> and
      <b>&lt;q-sidebar-footer&gt;</b>, the navigation pieces
      <b>&lt;q-sidebar-menu&gt;</b>, <b>&lt;q-sidebar-menu-item&gt;</b>,
      <b>&lt;q-sidebar-menu-button&gt;</b>, and the toggle button
      <b>&lt;q-sidebar-trigger&gt;</b>.
    </p>

    <!-- ═══════ QSidebar ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSidebar — the panel</h2>
      <p class="doc-note">
        Drives the state via <code>v-model</code> (offcanvas mode) or stays
        visible in the layout with <code>show-if-above</code> +
        <code>breakpoint</code> (static mode). <code>sticky</code> keeps the
        static panel pinned while the page scrolls; <code>width</code> and
        <code>height</code> size the panel. <code>side</code> places it on the
        left (default) or right edge, and the panel provides the toggle context
        to child <b>&lt;q-sidebar-trigger&gt;</b> components.
      </p>

      <h3 class="doc-h3">Offcanvas</h3>
      <docs-demo :code="usageOffcanvas" lang="html" filename="App.vue">
        <div class="demo-toolbar">
          <q-btn color="primary" icon="lucide:menu" label="Open sidebar" @click="open = true" />
        </div>

        <q-sidebar v-model="open" width="280px" bordered elevated>
          <q-sidebar-header class="demo-side-head">
            <q-icon name="lucide:box" color="primary" size="22px" />
            <b class="demo-brand">Dnax UI</b>
            <q-space />
            <q-sidebar-trigger label="Close sidebar">
              <q-icon name="lucide:x" />
            </q-sidebar-trigger>
          </q-sidebar-header>

          <q-sidebar-content>
            <q-sidebar-menu>
              <q-sidebar-menu-item>
                <q-sidebar-menu-button label="Dashboard" icon="lucide:layout-dashboard" active />
              </q-sidebar-menu-item>
              <q-sidebar-menu-item>
                <q-sidebar-menu-button label="Projects" icon="lucide:folder-kanban" badge="3" />
              </q-sidebar-menu-item>
              <q-sidebar-menu-item>
                <q-sidebar-menu-button label="Analytics" icon="lucide:chart-line" />
              </q-sidebar-menu-item>
              <q-sidebar-menu-item>
                <q-sidebar-menu-button label="Settings" icon="lucide:settings" />
              </q-sidebar-menu-item>
            </q-sidebar-menu>
          </q-sidebar-content>

          <q-sidebar-footer>
            <q-sidebar-menu-button label="Log out" icon="lucide:log-out" />
          </q-sidebar-footer>
        </q-sidebar>
      </docs-demo>

      <h3 class="doc-h3">Static &amp; sticky</h3>
      <docs-demo :code="usageStatic" lang="html" filename="App.vue">
        <div class="demo-layout">
          <q-sidebar
            show-if-above
            sticky
            height="70vh"
            width="240px"
            bordered
            v-model="openStatic"
          >
            <q-sidebar-header class="demo-side-head">
              <q-icon name="lucide:box" color="primary" size="22px" />
              <b class="demo-brand">Dnax UI</b>
            </q-sidebar-header>

            <q-sidebar-content>
              <q-sidebar-menu>
                <q-sidebar-menu-item>
                  <q-sidebar-menu-button label="Dashboard" icon="lucide:layout-dashboard" active />
                </q-sidebar-menu-item>
                <q-sidebar-menu-item>
                  <q-sidebar-menu-button label="Projects" icon="lucide:folder-kanban" badge="3" />
                </q-sidebar-menu-item>
                <q-sidebar-menu-item>
                  <q-sidebar-menu-button label="Settings" icon="lucide:settings" />
                </q-sidebar-menu-item>
              </q-sidebar-menu>
            </q-sidebar-content>

            <q-sidebar-footer>
              <div class="demo-user">
                <q-icon name="lucide:user-round" />
                <span>Ada Lovelace</span>
              </div>
            </q-sidebar-footer>
          </q-sidebar>

          <div class="demo-main">
            <h4>Page content</h4>
            <p class="demo-p">
              On wide screens the panel is part of the layout; below the
              breakpoint it collapses into an offcanvas drawer.
            </p>
          </div>
        </div>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sidebar" :source="sidebarSource" />
    </section>

    <!-- ═══════ QSidebarHeader ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSidebarHeader — top zone</h2>
      <p class="doc-note">
        The top area of the panel, typically holding the logo or the brand.
        Renders a <code>div</code> with a bottom border — pass a class to
        arrange its content (flex row, spacing…).
      </p>
      <q-syntax :code="usageHeader" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sidebarHeader" :source="sidebarHeaderSource" />
    </section>

    <!-- ═══════ QSidebarContent ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSidebarContent — scrollable middle</h2>
      <p class="doc-note">
        The central zone of the panel: it grows to fill the remaining height and
        scrolls its content when it overflows (thin scrollbar). Put the
        <code>q-sidebar-menu</code> here.
      </p>
      <q-syntax :code="usageContent" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sidebarContent" :source="sidebarContentSource" />
    </section>

    <!-- ═══════ QSidebarFooter ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSidebarFooter — bottom zone</h2>
      <p class="doc-note">
        The bottom area of the panel, separated by a top border — ideal for the
        user card, the logout button or version information.
      </p>
      <q-syntax :code="usageFooter" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sidebarFooter" :source="sidebarFooterSource" />
    </section>

    <!-- ═══════ QSidebarMenu ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSidebarMenu — the navigation list</h2>
      <p class="doc-note">
        A <code>&lt;ul&gt;</code> wrapper for the navigation items; each child
        should be a <b>&lt;q-sidebar-menu-item&gt;</b> containing a
        <b>&lt;q-sidebar-menu-button&gt;</b>.
      </p>
      <q-syntax :code="usageMenu" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sidebarMenu" :source="sidebarMenuSource" />
    </section>

    <!-- ═══════ QSidebarMenuButton ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSidebarMenuButton — the entry</h2>
      <p class="doc-note">
        Renders a <code>&lt;button&gt;</code>, or a native <code>&lt;a&gt;</code>
        when <code>href</code> is set. Accepts an Iconify <code>icon</code>, an
        <code>active</code> state (filled with the primary color), a right-aligned
        <code>badge</code> and a <code>disable</code> flag. Without a label, the
        default slot is rendered instead.
      </p>
      <q-syntax :code="usageMenuButton" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sidebarMenuButton" :source="sidebarMenuButtonSource" />
    </section>

    <!-- ═══════ QSidebarMenuItem ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSidebarMenuItem — the list wrapper</h2>
      <p class="doc-note">
        A <code>&lt;li&gt;</code> wrapper that structures the menu; the button
        is placed inside it.
      </p>
      <q-syntax :code="usageMenuItem" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sidebarMenuItem" :source="sidebarMenuItemSource" />
    </section>

    <!-- ═══════ QSidebarTrigger ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSidebarTrigger — the toggle button</h2>
      <p class="doc-note">
        A small icon button that toggles the enclosing sidebar. It must be placed
        inside the <code>q-sidebar</code> subtree (it reads the context via
        <code>inject</code>); override the default hamburger icon with the default
        slot.
      </p>
      <q-syntax :code="usageTrigger" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="sidebarTrigger" :source="sidebarTriggerSource" />
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

/* espace entre les deux blocs docs-demo (offcanvas / static) */
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

/* — styles des démos — */
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.demo-side-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.demo-brand {
  font-size: 15px;
  font-weight: 700;
  color: var(--foreground);
  white-space: nowrap;
}
.demo-layout {
  display: flex;
  align-items: stretch;
  min-height: 320px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  overflow: hidden;
}
.demo-main {
  flex: 1 1 auto;
  min-width: 0;
  padding: 20px 24px;
  background: #fafbfc;
}
.demo-main h4 {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 700;
  color: var(--foreground);
}
.demo-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
}
</style>
