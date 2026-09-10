# Collapse

> A clickable header that smoothly expands or collapses its content, controlled or uncontrolled, with icons and a custom header slot.

A clickable header that expands or collapses its content with a smooth height
animation. **<q-collapse>** supports a controlled `v-model` (or internal state
via `default-opened`), Iconify icons on the left and right of the header, and a
custom `#header` slot.

## Basic

`label` + optional `caption`; the chevron rotates when open. The content stays
mounted and animates via a measured height.

<prose-show-case>
<dnax-demo-collapse demo="basic">



</dnax-demo-collapse>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openBasic = ref(true)
</script>

<template>
  <q-collapse v-model="openBasic" label="Account" caption="Profile, security and preferences">
    <p class="demo-p">
      The content is animated with a measured height (0 → auto) and stays
      mounted in the DOM — hidden with CSS, not unmounted.
    </p>
  </q-collapse>
</template>
```

</template>
</prose-show-case>

## Icons

`icon-left` sits before the title, `icon-right` before the chevron — any Iconify
name.

<prose-show-case>
<dnax-demo-collapse demo="icons">



</dnax-demo-collapse>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openIcons = ref(false)
</script>

<template>
  <q-collapse
    v-model="openIcons"
    label="Security"
    caption="Two-factor authentication"
    icon-left="lucide:shield"
    icon-right="lucide:badge-check"
  >
    <p class="demo-p">Iconify icons on both sides of the header.</p>
  </q-collapse>
</template>
```

</template>
</prose-show-case>

## Uncontrolled

Without a `v-model`, the collapse manages its own state — initialized with
`default-opened`.

<prose-show-case>
<dnax-demo-collapse demo="uncontrolled">



</dnax-demo-collapse>

<template v-slot:code="">

```vue
<q-collapse label="FAQ — What is Dnax UI?" default-opened>
  <p class="demo-p">
    Without a <code>v-model</code>, the collapse keeps its own internal state,
    initialized by <code>default-opened</code>.
  </p>
</q-collapse>
```

</template>
</prose-show-case>

## Dense & disabled

`dense` shrinks the header; `disable` blocks the toggle.

<prose-show-case>
<dnax-demo-collapse demo="states">



</dnax-demo-collapse>

<template v-slot:code="">

```vue
<q-collapse label="Dense" caption="Compact header" dense>
  <p class="demo-p">A smaller header with <code>dense</code>.</p>
</q-collapse>

<q-collapse label="Disabled" disable>
  <p class="demo-p">Clicking the header does nothing.</p>
</q-collapse>
```

</template>
</prose-show-case>

## Custom header

Use the `#header` slot (and optional `header-class`) to build your own header
content — the chevron stays managed by the component.

<prose-show-case>
<dnax-demo-collapse demo="custom">



</dnax-demo-collapse>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openCustom = ref(false)
</script>

<template>
  <q-collapse v-model="openCustom" header-class="q-collapse__header--custom">
    <template #header>
      <q-icon name="lucide:sparkles" color="primary" />
      <span class="q-collapse__label">Custom header</span>
    </template>
    <p class="demo-p">Anything goes inside the <code>#header</code> slot.</p>
  </q-collapse>
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QCollapse">



</dnax-api>
