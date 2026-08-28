<script setup lang="ts">
// Nav Menu — documentation complète de la famille :
// QNavMenu + QNavMenuTrigger + QNavMenuContent + QNavMenuItem.
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const navMenu = useComponent(() => "QNavMenu")
const navMenuTrigger = useComponent(() => "QNavMenuTrigger")
const navMenuContent = useComponent(() => "QNavMenuContent")
const navMenuItem = useComponent(() => "QNavMenuItem")

const navMenuSource = componentSource("QNavMenu")
const navMenuTriggerSource = componentSource("QNavMenuTrigger")
const navMenuContentSource = componentSource("QNavMenuContent")
const navMenuItemSource = componentSource("QNavMenuItem")

const tag = componentTag("QNavMenu")

const usageMain = `<q-nav-menu>
  <q-nav-menu-trigger name="products" label="Products" icon="lucide:package">
    <q-nav-menu-content>
      <q-nav-menu-item label="Overview" />
      <q-nav-menu-item label="Pricing" />
      <q-nav-menu-item label="Changelog" />
    </q-nav-menu-content>
  </q-nav-menu-trigger>

  <q-nav-menu-trigger name="resources" label="Resources" icon="lucide:book-open">
    <q-nav-menu-content>
      <q-nav-menu-item label="Documentation" />
      <q-nav-menu-item label="Blog" />
      <q-nav-menu-item label="Community" />
    </q-nav-menu-content>
  </q-nav-menu-trigger>

  <q-nav-menu-item label="Contact" />
  <q-nav-menu-item label="GitHub" icon="lucide:github" />
</q-nav-menu>`

const usageCustom = `<q-nav-menu>
  <q-nav-menu-trigger name="account" label="Account" icon="lucide:user">
    <q-nav-menu-content>
      <q-nav-menu-item label="Profile" icon="lucide:user-round" />
      <q-nav-menu-item label="Settings" icon="lucide:settings" active />
      <q-nav-menu-item label="Log out" icon="lucide:log-out" />
    </q-nav-menu-content>
  </q-nav-menu-trigger>

  <q-nav-menu-trigger name="help">
    <template #trigger>
      <q-icon name="lucide:circle-help" />
      <span>Need help?</span>
    </template>
    <q-nav-menu-content>
      <q-nav-menu-item label="Documentation" />
      <q-nav-menu-item label="Report an issue" />
    </q-nav-menu-content>
  </q-nav-menu-trigger>
</q-nav-menu>`

const usageTrigger = `<q-nav-menu-trigger name="resources" label="Resources">
  <q-nav-menu-content>
    <q-nav-menu-item label="Blog" />
    <q-nav-menu-item label="Community" />
  </q-nav-menu-content>
</q-nav-menu-trigger>`

const usageContent = `<q-nav-menu-trigger name="products" label="Products">
  <q-nav-menu-content>
    <q-nav-menu-item label="Overview" />
    <q-nav-menu-item label="Pricing" />
  </q-nav-menu-content>
</q-nav-menu-trigger>`

const usageItem = `<q-nav-menu-item label="Docs" icon="lucide:book-open" href="/docs" active />
<q-nav-menu-item label="GitHub" icon="lucide:github" href="https://github.com" />`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Nav Menu</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A top navigation bar with dropdown menus, modeled on shadcn-vue's
      NavigationMenu. The family comprises four components: <b>&lt;q-nav-menu&gt;</b>
      (the bar), <b>&lt;q-nav-menu-trigger&gt;</b> (the dropdown button),
      <b>&lt;q-nav-menu-content&gt;</b> (the dropdown panel) and
      <b>&lt;q-nav-menu-item&gt;</b> (a link or button). The dropdowns open on
      hover or click and close on outside click or <kbd>Escape</kbd>; arrow keys
      navigate the items.
    </p>

    <!-- ═══════ QNavMenu ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QNavMenu — the bar</h2>
      <p class="doc-note">
        A <code>&lt;nav&gt;</code> that provides the context (which trigger is
        open, trigger registration) to its children. Dropdowns close on outside
        click; arrow keys / <kbd>Home</kbd> / <kbd>End</kbd> move the focus,
        <kbd>Escape</kbd> closes.
      </p>

      <h3 class="doc-h3">Dropdowns</h3>
      <docs-demo :code="usageMain" lang="html" filename="App.vue">
        <div class="demo-nav">
          <q-nav-menu>
            <q-nav-menu-trigger name="products" label="Products" icon="lucide:package">
              <q-nav-menu-content>
                <q-nav-menu-item label="Overview" />
                <q-nav-menu-item label="Pricing" />
                <q-nav-menu-item label="Changelog" />
              </q-nav-menu-content>
            </q-nav-menu-trigger>

            <q-nav-menu-trigger name="resources" label="Resources" icon="lucide:book-open">
              <q-nav-menu-content>
                <q-nav-menu-item label="Documentation" />
                <q-nav-menu-item label="Blog" />
                <q-nav-menu-item label="Community" />
              </q-nav-menu-content>
            </q-nav-menu-trigger>

            <q-nav-menu-item label="Contact" />
            <q-nav-menu-item label="GitHub" icon="lucide:github" />
          </q-nav-menu>
        </div>
      </docs-demo>

      <h3 class="doc-h3">Icons &amp; custom trigger</h3>
      <docs-demo :code="usageCustom" lang="html" filename="App.vue">
        <div class="demo-nav">
          <q-nav-menu>
            <q-nav-menu-trigger name="account" label="Account" icon="lucide:user">
              <q-nav-menu-content>
                <q-nav-menu-item label="Profile" icon="lucide:user-round" />
                <q-nav-menu-item label="Settings" icon="lucide:settings" active />
                <q-nav-menu-item label="Log out" icon="lucide:log-out" />
              </q-nav-menu-content>
            </q-nav-menu-trigger>

            <q-nav-menu-trigger name="help">
              <template #trigger>
                <q-icon name="lucide:circle-help" />
                <span>Need help?</span>
              </template>
              <q-nav-menu-content>
                <q-nav-menu-item label="Documentation" />
                <q-nav-menu-item label="Report an issue" />
              </q-nav-menu-content>
            </q-nav-menu-trigger>
          </q-nav-menu>
        </div>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="navMenu" :source="navMenuSource" />
    </section>

    <!-- ═══════ QNavMenuTrigger ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QNavMenuTrigger — the dropdown button</h2>
      <p class="doc-note">
        A button that opens its dropdown panel (the default slot) on hover or
        click, with a rotating chevron. The <code>name</code> identifies the
        trigger (auto-generated if absent) and the <code>trigger</code> slot
        replaces the button content.
      </p>
      <q-syntax :code="usageTrigger" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="navMenuTrigger" :source="navMenuTriggerSource" />
    </section>

    <!-- ═══════ QNavMenuContent ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QNavMenuContent — the dropdown panel</h2>
      <p class="doc-note">
        The floating panel positioned under the trigger — place it in the default
        slot of a <b>&lt;q-nav-menu-trigger&gt;</b>. A white card with border,
        shadow and rounded corners, listing <b>&lt;q-nav-menu-item&gt;</b>
        children.
      </p>
      <q-syntax :code="usageContent" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="navMenuContent" :source="navMenuContentSource" />
    </section>

    <!-- ═══════ QNavMenuItem ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QNavMenuItem — the link</h2>
      <p class="doc-note">
        Renders a <code>&lt;button&gt;</code>, or a native <code>&lt;a&gt;</code>
        when <code>href</code> is set. Accepts an Iconify <code>icon</code> and an
        <code>active</code> state (<code>aria-current="page"</code> + primary
        color); clicking it closes any open dropdown.
      </p>
      <q-syntax :code="usageItem" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="navMenuItem" :source="navMenuItemSource" />
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

/* — styles des démos — */
.demo-nav {
  display: flex;
  align-items: center;
  padding: 10px 14px 240px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 8px;
  background: #fff;
}
</style>
