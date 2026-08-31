<script setup lang="ts">
// Tabs — documentation du composant QTabs (simple) :
// la barre d'onglets avec indicateur coulissant.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const tabs = useComponent(() => "QTabs")
const tabsSource = componentSource("QTabs")
const tag = componentTag("QTabs")

// — Démo interactive —
const tab = ref("one")
const tabAlign = ref("home")
const tabIcons = ref("inbox")
const tabCounts = ref("inbox")

// — Démo align/stretch —
const alignDemo = ref<"left" | "center" | "right" | "justify">("center")
const stretchDemo = ref(false)

// — Démo transitions animées —
const transitionDemo = ref<"spring" | "smooth" | "elastic">("spring")
const durationDemo = ref(350)
const durations = [100, 200, 350, 500, 800]

// — Démo couleurs —
const activeColorDemo = ref("primary")
const inactiveColorDemo = ref("secondary")
const colorOptions = [
  "primary",
  "secondary",
  "accent",
  "positive",
  "negative",
  "info",
  "warning",
  "dark",
]

const usageBasic = `<q-tabs v-model="tab" active-color="primary" indicator-color="primary" switch-indicator-position>
  <q-tab name="one" label="One" />
  <q-tab name="two" label="Two" />
  <q-tab name="three" label="Three" />
</q-tabs>
<p class="demo-p demo-tabs-meta">Selected tab: {{ tab }}</p>`

const usageAlign = `<q-tabs
  v-model="tabAlign"
  :align="align"
  :stretch="stretch"
  no-caps
  dense
  active-color="secondary"
  indicator-color="secondary"
>
  <q-tab name="home" label="Home" />
  <q-tab name="profile" label="Profile" />
  <q-tab name="messages" label="Messages" />
</q-tabs>`

const usageIcons = `<q-tabs v-model="tabIcons" inline-label no-caps active-color="primary" switch-indicator-position>
  <q-tab name="inbox" icon="lucide:inbox" label="Inbox" alert="negative" />
  <q-tab name="sent" icon="lucide:send" label="Sent" />
  <q-tab name="drafts" icon="lucide:file-text" label="Drafts" />
</q-tabs>`

const usageColors = `<q-select
  v-model="activeColor"
  :options="colorOptions"
  label="active-color"
  outlined
  dense
  class="demo-align-select"
/>
<q-select
  v-model="inactiveColor"
  :options="colorOptions"
  label="inactive-color"
  outlined
  dense
  class="demo-align-select"
/>

<q-tabs
  v-model="tab"
  :active-color="activeColor"
  :inactive-color="inactiveColor"
  switch-indicator-position
>
  <q-tab name="one" label="One" />
  <q-tab name="two" label="Two" />
  <q-tab name="three" label="Three" />
</q-tabs>
<p class="demo-p demo-tabs-meta">active = {{ activeColor }} · inactive = {{ inactiveColor }}</p>`

const scriptColors = `import { ref } from "vue"

const tab = ref("one")
const activeColor = ref("primary")
const inactiveColor = ref("secondary")
const colorOptions = ["primary", "secondary", "accent", "positive", "negative", "info", "warning", "dark"]`

const usageCounts = `<q-tabs v-model="tabCounts" no-caps active-color="primary" switch-indicator-position>
  <q-tab name="inbox" icon="lucide:inbox" label="Inbox" :count="12" />
  <q-tab name="social" icon="lucide:users" label="Social" :count="5" count-color="info" />
  <q-tab name="spam" icon="lucide:shield-alert" label="Spam" :count="125" count-color="warning" />
  <q-tab name="sent" icon="lucide:send" label="Sent" />
</q-tabs>`

const usageSwitch = `<q-tabs v-model="tab" active-color="primary" indicator-color="primary">
  <q-tab name="one" label="One" />
  <q-tab name="two" label="Two" />
  <q-tab name="three" label="Three" />
</q-tabs>

<q-tabs v-model="tab" switch-indicator-position active-color="primary" indicator-color="primary">
  <q-tab name="one" label="One" />
  <q-tab name="two" label="Two" />
  <q-tab name="three" label="Three" />
</q-tabs>

<q-tabs v-model="tab" switch-indicator-position="top" active-color="primary" indicator-color="primary">
  <q-tab name="one" label="One" />
  <q-tab name="two" label="Two" />
  <q-tab name="three" label="Three" />
</q-tabs>
<!-- Sans prop → aucun indicateur · switch-indicator-position → en bas (défaut) · ="top" → en haut -->`

const usageAnimated = `<q-select
  v-model="transitionDemo"
  :options="['spring', 'smooth', 'elastic']"
  label="transition"
  outlined
  dense
  class="demo-align-select"
/>
<q-select
  v-model="transitionDuration"
  :options="[100, 200, 350, 500, 800]"
  label="duration (ms)"
  outlined
  dense
  class="demo-align-select"
/>

<q-tabs
  v-model="tab"
  animated
  :transition="transitionDemo"
  :transition-duration="transitionDuration"
  active-color="primary"
  indicator-color="primary"
  switch-indicator-position
>
  <q-tab name="one" label="One" />
  <q-tab name="two" label="Two" />
  <q-tab name="three" label="Three" />
</q-tabs>
<p class="demo-p demo-tabs-meta">transition = {{ transitionDemo }} · {{ transitionDuration }}ms</p>`

const usageCollapse = `<q-select
  v-model="transitionDemo"
  :options="['spring', 'smooth', 'elastic']"
  label="transition"
  outlined
  dense
  class="demo-align-select"
/>

<q-tabs
  v-model="tab"
  collapse-inactive
  animated
  :transition="transitionDemo"
  active-color="primary"
  indicator-color="primary"
  switch-indicator-position
>
  <q-tab name="home" icon="lucide:home" label="Home" />
  <q-tab name="inbox" icon="lucide:inbox" label="Inbox" />
  <q-tab name="users" icon="lucide:users" label="Users" />
  <q-tab name="settings" icon="lucide:settings" label="Settings" />
</q-tabs>
<p class="demo-p demo-tabs-meta">Selected tab: {{ tab }}</p>`

// — Scripts des démos (onglet "Script setup") —
const scriptBasic = `import { ref } from "vue"

const tab = ref("one")`

const scriptAlign = `import { ref } from "vue"

const tabAlign = ref("home")
const align = ref("center")
const stretch = ref(false)`

const scriptIcons = `import { ref } from "vue"

const tabIcons = ref("inbox")`

const scriptCounts = `import { ref } from "vue"

const tabCounts = ref("inbox")`

const scriptAnimated = `import { ref } from "vue"

const tab = ref("one")
const transitionDemo = ref("spring")
const transitionDuration = ref(350)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Tabs</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A horizontal tab bar with a sliding indicator, following the Quasar API
      (<code>v-model</code>, <code>align</code>, <code>active-color</code>…).
      The tab buttons are provided by <b>&lt;q-tab&gt;</b> — documented on its own
      page — and the matching content panels by <b>&lt;q-tab-panels&gt;</b>.
    </p>

    <!-- ═══════ QTabs ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QTabs — the tab bar</h2>
      <p class="doc-note">
        Manages the selection state and renders the sliding indicator under the
        active <b>&lt;q-tab&gt;</b>. The <code>v-model</code> holds the active tab
        <code>name</code>; <code>align</code> distributes the tabs (left, center,
        right, justify), <code>active-color</code> colors the active tab and
        <code>indicator-color</code> the indicator, <code>no-caps</code> keeps the
        original casing and <code>dense</code> reduces the height.
      </p>

      <h3 class="doc-h3">Basic</h3>
      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-tabs v-model="tab" active-color="primary" indicator-color="primary" switch-indicator-position>
          <q-tab name="one" label="One" />
          <q-tab name="two" label="Two" />
          <q-tab name="three" label="Three" />
        </q-tabs>
        <p class="demo-p demo-tabs-meta">Selected tab: {{ tab }}</p>
      </docs-demo>

      <h3 class="doc-h3">Align &amp; size</h3>
      <p class="doc-note">
        <code>align</code> distributes the tabs — <code>left</code>,
        <code>center</code>, <code>right</code> (natural width) or
        <code>justify</code> (equal width). <code>stretch</code> makes the bar
        fill the whole parent width <b>and</b> gives every tab an equal share
        (like <code>justify</code>), even inside a flex container.
      </p>
      <docs-demo :code="usageAlign" lang="html" filename="App.vue" :script="scriptAlign">
        <div class="demo-row demo-row--align">
          <q-select
            v-model="alignDemo"
            :options="['left', 'center', 'right', 'justify']"
            label="align"
            outlined
            dense
            class="demo-align-select"
          />
          <q-checkbox v-model="stretchDemo" label="stretch" color="secondary" />
        </div>
        <q-tabs
          v-model="tabAlign"
          :align="alignDemo"
          :stretch="stretchDemo"
          no-caps
          dense
          active-color="secondary"
          indicator-color="secondary"
          class="demo-tabs-stretch"
        >
          <q-tab name="home" label="Home" />
          <q-tab name="profile" label="Profile" />
          <q-tab name="messages" label="Messages" />
        </q-tabs>
        <p class="demo-p demo-tabs-meta">
          align = {{ alignDemo }} · stretch = {{ stretchDemo ? "on" : "off" }}
        </p>
      </docs-demo>

      <h3 class="doc-h3">Icons &amp; alerts</h3>
      <docs-demo :code="usageIcons" lang="html" filename="App.vue" :script="scriptIcons">
        <q-tabs v-model="tabIcons" inline-label no-caps active-color="primary" switch-indicator-position>
          <q-tab name="inbox" icon="lucide:inbox" label="Inbox" alert="negative" />
          <q-tab name="sent" icon="lucide:send" label="Sent" />
          <q-tab name="drafts" icon="lucide:file-text" label="Drafts" />
        </q-tabs>
      </docs-demo>

      <h3 class="doc-h3">Notification counts</h3>
      <p class="doc-note">
        <code>count</code> renders a numeric badge (unread messages…) — hidden when
        0. <code>count-color</code> sets the badge color (token or hex; defaults to
        the <code>alert</code> color, then <code>negative</code>), and
        <code>count-max</code> caps the display as <code>N+</code> (default 99).
      </p>
      <docs-demo :code="usageCounts" lang="html" filename="App.vue" :script="scriptCounts">
        <q-tabs v-model="tabCounts" no-caps active-color="primary" switch-indicator-position>
          <q-tab name="inbox" icon="lucide:inbox" label="Inbox" :count="12" />
          <q-tab name="social" icon="lucide:users" label="Social" :count="5" count-color="info" />
          <q-tab name="spam" icon="lucide:shield-alert" label="Spam" :count="125" count-color="warning" />
          <q-tab name="sent" icon="lucide:send" label="Sent" />
        </q-tabs>
      </docs-demo>

      <h3 class="doc-h3">Switch indicator position</h3>
      <p class="doc-note">
        The indicator is <b>opt-in</b>: without <code>switch-indicator-position</code>
        no accent bar is rendered. With the prop alone it sits at the <b>bottom</b>
        (default position); <code>switch-indicator-position="top"</code> moves it to
        the <b>top</b> (iOS/mobile pattern) — left edge in vertical mode.
      </p>
      <docs-demo :code="usageSwitch" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-switch-row">
          <div class="demo-switch-col">
            <p class="demo-p demo-switch-label">no indicator</p>
            <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
              <q-tab name="one" label="One" />
              <q-tab name="two" label="Two" />
              <q-tab name="three" label="Three" />
            </q-tabs>
          </div>
          <div class="demo-switch-col">
            <p class="demo-p demo-switch-label">bottom (default)</p>
            <q-tabs v-model="tab" switch-indicator-position active-color="primary" indicator-color="primary">
              <q-tab name="one" label="One" />
              <q-tab name="two" label="Two" />
              <q-tab name="three" label="Three" />
            </q-tabs>
          </div>
          <div class="demo-switch-col">
            <p class="demo-p demo-switch-label">top</p>
            <q-tabs v-model="tab" switch-indicator-position="top" active-color="primary" indicator-color="primary">
              <q-tab name="one" label="One" />
              <q-tab name="two" label="Two" />
              <q-tab name="three" label="Three" />
            </q-tabs>
          </div>
        </div>
        <p class="demo-p demo-tabs-meta">Selected tab: {{ tab }}</p>
      </docs-demo>

      <h3 class="doc-h3">Animated transitions</h3>
      <p class="doc-note">
        <code>animated</code> enables the motion: a tactile press, a springy
        <b>indicator</b> slide and an entrance for the active tab. The
        <code>transition</code> prop picks the easing — <code>spring</code>
        (default, slight overshoot), <code>smooth</code> (buttery expo-out with a
        rising label) or <code>elastic</code> (pronounced bounce).
        <code>transition-duration</code> (ms) overrides the speed of the
        indicator, the labels and the entrance animations.
      </p>
      <docs-demo :code="usageAnimated" lang="html" filename="App.vue" :script="scriptAnimated">
        <div class="demo-row demo-row--align">
          <q-select
            v-model="transitionDemo"
            :options="['spring', 'smooth', 'elastic']"
            label="transition"
            outlined
            dense
            class="demo-align-select"
          />
          <q-select
            v-model="durationDemo"
            :options="durations"
            label="duration (ms)"
            outlined
            dense
            class="demo-align-select"
          />
        </div>
        <q-tabs
          v-model="tab"
          animated
          :transition="transitionDemo"
          :transition-duration="durationDemo"
          active-color="primary"
          indicator-color="primary"
          switch-indicator-position
        >
          <q-tab name="one" label="One" />
          <q-tab name="two" label="Two" />
          <q-tab name="three" label="Three" />
        </q-tabs>
        <p class="demo-p demo-tabs-meta">
          transition = {{ transitionDemo }} · {{ durationDemo }}ms
        </p>
      </docs-demo>

      <h3 class="doc-h3">Collapse inactive</h3>
      <p class="doc-note">
        <code>collapse-inactive</code> shrinks every tab to its <b>icon only</b>;
        the active tab <b>expands</b> to reveal the label, with the width
        animating smoothly — the mobile bottom-nav pattern. It combines with
        <code>animated</code> and its <code>transition</code> presets: the
        indicator follows the growing tab and springs to its final position.
      </p>
      <docs-demo :code="usageCollapse" lang="html" filename="App.vue" :script="scriptAnimated">
        <div class="demo-row demo-row--align">
          <q-select
            v-model="transitionDemo"
            :options="['spring', 'smooth', 'elastic']"
            label="transition"
            outlined
            dense
            class="demo-align-select"
          />
        </div>
        <q-tabs
          v-model="tab"
          collapse-inactive
          animated
          :transition="transitionDemo"
          active-color="primary"
          indicator-color="primary"
          switch-indicator-position
        >
          <q-tab name="home" icon="lucide:home" label="Home" />
          <q-tab name="inbox" icon="lucide:inbox" label="Inbox" />
          <q-tab name="users" icon="lucide:users" label="Users" />
          <q-tab name="settings" icon="lucide:settings" label="Settings" />
        </q-tabs>
        <p class="demo-p demo-tabs-meta">
          Selected tab: {{ tab }} · transition = {{ transitionDemo }}
        </p>
      </docs-demo>

      <h3 class="doc-h3">Colors</h3>
      <p class="doc-note">
        <code>active-color</code> tints the active tab (and the indicator by
        default), <code>active-bg-color</code> fills it, and
        <code>inactive-color</code> colors the <b>rest</b> of the tabs — token or
        hex, applied to the label and the icon.
      </p>
      <docs-demo :code="usageColors" lang="html" filename="App.vue" :script="scriptColors">
        <div class="demo-row demo-row--align">
          <q-select
            v-model="activeColorDemo"
            :options="colorOptions"
            label="active-color"
            outlined
            dense
            class="demo-align-select"
          />
          <q-select
            v-model="inactiveColorDemo"
            :options="colorOptions"
            label="inactive-color"
            outlined
            dense
            class="demo-align-select"
          />
        </div>
        <q-tabs
          v-model="tab"
          :active-color="activeColorDemo"
          :inactive-color="inactiveColorDemo"
          switch-indicator-position
        >
          <q-tab name="one" label="One" />
          <q-tab name="two" label="Two" />
          <q-tab name="three" label="Three" />
        </q-tabs>
        <p class="demo-p demo-tabs-meta">
          active = {{ activeColorDemo }} · inactive = {{ inactiveColorDemo }}
        </p>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="tabs" :source="tabsSource" />
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

/* — styles des démos — */
.demo-tabs-meta {
  margin-top: 12px;
}
.demo-row--align {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.demo-align-select {
  width: 180px;
}
.demo-switch-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.demo-switch-col {
  flex: 1 1 260px;
  min-width: 0;
}
.demo-switch-label {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #8b93a1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
/* parent flex → vérifie que stretch remplit la largeur */
.demo-tabs-stretch {
  display: flex;
}
</style>
