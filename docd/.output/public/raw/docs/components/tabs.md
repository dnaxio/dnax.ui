# Tabs

> A horizontal tab bar with a sliding indicator — align, icons, counts, animated transitions, collapse and route tabs.

A horizontal tab bar with a sliding indicator, following the Quasar API
(`v-model`, `align`, `active-color`…). The tab buttons are provided by
**<q-tab>** — documented below — and the matching content panels by
**<q-tab-panels>**.

## QTabs — the tab bar

Manages the selection state and renders the sliding indicator under the active
**<q-tab>**. The `v-model` holds the active tab `name`; `align` distributes the
tabs (left, center, right, justify), `active-color` colors the active tab and
`indicator-color` the indicator, `no-caps` keeps the original casing and `dense`
reduces the height.

### Basic

<prose-show-case>
<dnax-demo-tabs demo="basic">



</dnax-demo-tabs>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tab = ref("one")
</script>

<template>
  <q-tabs v-model="tab" active-color="primary" indicator-color="primary" switch-indicator-position>
    <q-tab name="one" label="One" />
    <q-tab name="two" label="Two" />
    <q-tab name="three" label="Three" />
  </q-tabs>
  <p class="demo-p demo-tabs-meta">Selected tab: {{ tab }}</p>
</template>
```

</template>
</prose-show-case>

### Align & size

`align` distributes the tabs — `left`, `center`, `right` (natural width) or
`justify` (equal width). `stretch` makes the bar fill the whole parent width
**and** gives every tab an equal share (like `justify`), even inside a flex
container.

<prose-show-case>
<dnax-demo-tabs demo="align">



</dnax-demo-tabs>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tabAlign = ref("home")
const align = ref("center")
const stretch = ref(false)
</script>

<template>
  <q-tabs
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
  </q-tabs>
</template>
```

</template>
</prose-show-case>

### Icons & alerts

<prose-show-case>
<dnax-demo-tabs demo="icons">



</dnax-demo-tabs>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tabIcons = ref("inbox")
</script>

<template>
  <q-tabs v-model="tabIcons" inline-label no-caps active-color="primary" switch-indicator-position>
    <q-tab name="inbox" icon="lucide:inbox" label="Inbox" alert="negative" />
    <q-tab name="sent" icon="lucide:send" label="Sent" />
    <q-tab name="drafts" icon="lucide:file-text" label="Drafts" />
  </q-tabs>
</template>
```

</template>
</prose-show-case>

### Notification counts

`count` renders a numeric badge (unread messages…) — hidden when 0. `count-color`
sets the badge color (token or hex; defaults to the `alert` color, then
`negative`), and `count-max` caps the display as `N+` (default 99).

<prose-show-case>
<dnax-demo-tabs demo="counts">



</dnax-demo-tabs>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tabCounts = ref("inbox")
</script>

<template>
  <q-tabs v-model="tabCounts" no-caps active-color="primary" switch-indicator-position>
    <q-tab name="inbox" icon="lucide:inbox" label="Inbox" :count="12" />
    <q-tab name="social" icon="lucide:users" label="Social" :count="5" count-color="info" />
    <q-tab name="spam" icon="lucide:shield-alert" label="Spam" :count="125" count-color="warning" />
    <q-tab name="sent" icon="lucide:send" label="Sent" />
  </q-tabs>
</template>
```

</template>
</prose-show-case>

### Switch indicator position

The indicator is **opt-in**: without `switch-indicator-position` no accent bar is
rendered. With the prop alone it sits at the **bottom** (default position);
`switch-indicator-position="top"` moves it to the **top** (iOS/mobile pattern) —
left edge in vertical mode.

<prose-show-case>
<dnax-demo-tabs demo="switch">



</dnax-demo-tabs>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tab = ref("one")
</script>

<template>
  <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
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
  <!-- Sans prop → aucun indicateur · switch-indicator-position → en bas (défaut) · ="top" → en haut -->
</template>
```

</template>
</prose-show-case>

### Animated transitions

`animated` enables the motion: a tactile press, a springy **indicator** slide and
an entrance for the active tab. The `transition` prop picks the easing — `spring`
(default, slight overshoot), `smooth` (buttery expo-out with a rising label) or
`elastic` (pronounced bounce). `transition-duration` (ms) overrides the speed of
the indicator, the labels and the entrance animations.

<prose-show-case>
<dnax-demo-tabs demo="animated">



</dnax-demo-tabs>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tab = ref("one")
const transitionDemo = ref("spring")
const transitionDuration = ref(350)
</script>

<template>
  <q-select
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
  <p class="demo-p demo-tabs-meta">transition = {{ transitionDemo }} · {{ transitionDuration }}ms</p>
</template>
```

</template>
</prose-show-case>

### Collapse inactive

`collapse-inactive` shrinks every tab to its **icon only**; the active tab
**expands** to reveal the label, with the width animating smoothly — the mobile
bottom-nav pattern. It combines with `animated` and its `transition` presets: the
indicator follows the growing tab and springs to its final position.

<prose-show-case>
<dnax-demo-tabs demo="collapse">



</dnax-demo-tabs>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tab = ref("one")
const transitionDemo = ref("spring")
const transitionDuration = ref(350)
</script>

<template>
  <q-select
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
  <p class="demo-p demo-tabs-meta">Selected tab: {{ tab }}</p>
</template>
```

</template>
</prose-show-case>

### Colors

`active-color` tints the active tab (and the indicator by default),
`active-bg-color` fills it, and `inactive-color` colors the **rest** of the tabs —
token or hex, applied to the label and the icon.

<prose-show-case>
<dnax-demo-tabs demo="colors">



</dnax-demo-tabs>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tab = ref("one")
const activeColor = ref("primary")
const inactiveColor = ref("secondary")
const colorOptions = ["primary", "secondary", "accent", "positive", "negative", "info", "warning", "dark"]
</script>

<template>
  <q-select
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
  <p class="demo-p demo-tabs-meta">active = {{ activeColor }} · inactive = {{ inactiveColor }}</p>
</template>
```

</template>
</prose-show-case>

### API

<dnax-api name="QTabs">



</dnax-api>

## QTab

The tab button rendered by `<q-tab>`. Its `name` is the value compared with the
`v-model` of `q-tabs`; `label`, `icon`, `alert` and `count` shape its content.

<dnax-api name="QTab">



</dnax-api>

## QRouteTab

`q-route-tab` is a `q-tab` bound to the router (Quasar `QRouteTab`): it becomes
**active — with the active-color — when the current route matches** `to`, and
**navigates on click**. No `v-model` needed: the route drives the bar
(internally when no model is bound). Matching is a path prefix by default
(`/docs` matches any docs page); add `exact` to require an exact path (+ hash)
match. Click the tabs below to navigate for real.

<prose-show-case>
<dnax-demo-tabs demo="route">



</dnax-demo-tabs>

<template v-slot:code="">

```vue
<q-tabs active-color="primary" indicator-color="primary" switch-indicator-position>
  <q-route-tab to="/docs" exact icon="lucide:book-open" label="Docs" />
  <q-route-tab to="/mockup" icon="lucide:smartphone" label="Mockup" />
</q-tabs>
<!-- Le tab actif suit la route courante ; cliquer navigue (router.push / replace) -->
```

</template>
</prose-show-case>

### API

<dnax-api name="QRouteTab">



</dnax-api>
