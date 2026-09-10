# Tab Panels

> Animated panels driven by a shared v-model — transitions, animations, swipe and lazy rendering.

Switches between panels driven by a shared `v-model`, with an optional
transition. Pairs with **<q-tabs>** (same value) and renders
**<q-tab-panel>** children — panels stay mounted (`v-show`) so switching is
reliable and state is preserved.

## QTabPanels — the animated panels

Only the panel whose `name` matches the `v-model` is visible. `animated` enables
the entry transition and `animation` picks its direction — `fade` (default),
`slide-right`, `slide-left`, `slide-up` or `slide-down`. `swipeable` lets touch
users flip panels horizontally.

### Coupled with tabs

<prose-show-case>
<dnax-demo-tab-panels demo="basic">



</dnax-demo-tab-panels>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tab = ref("one")
</script>

<template>
  <q-tabs v-model="tab" align="left" no-caps active-color="primary" indicator-color="primary" class="demo-panels-tabs">
    <q-tab name="one" label="One" />
    <q-tab name="two" label="Two" />
    <q-tab name="three" label="Three" />
  </q-tabs>

  <q-tab-panels v-model="tab" animated class="demo-panels">
    <q-tab-panel name="one">
      <p class="demo-p">Panel “One” — fades in when selected.</p>
    </q-tab-panel>
    <q-tab-panel name="two">
      <p class="demo-p">Panel “Two” — shares the v-model with the tabs.</p>
    </q-tab-panel>
    <q-tab-panel name="three">
      <p class="demo-p">Panel “Three” — visibility is driven by v-show.</p>
    </q-tab-panel>
  </q-tab-panels>
</template>
```

</template>
</prose-show-case>

### Animation directions

<prose-show-case>
<dnax-demo-tab-panels demo="animations">



</dnax-demo-tab-panels>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tabAnim = ref("a")
const animation = ref("fade")
const animationOptions = [
  { label: "Fade", value: "fade" },
  { label: "Slide right", value: "slide-right" },
  { label: "Slide left", value: "slide-left" },
  { label: "Slide up", value: "slide-up" },
  { label: "Slide down", value: "slide-down" },
]
</script>

<template>
  <q-select
    v-model="animation"
    :options="animationOptions"
    emit-value
    outlined
    dense
    label="Animation"
    class="demo-panels-select"
  />

  <q-tabs v-model="tabAnim" align="left" no-caps dense active-color="primary" indicator-color="primary">
    <q-tab name="a" label="A" />
    <q-tab name="b" label="B" />
    <q-tab name="c" label="C" />
  </q-tabs>

  <q-tab-panels v-model="tabAnim" animated :animation="animation" swipeable class="demo-panels">
    <q-tab-panel name="a">
      <p class="demo-p">Panel A</p>
    </q-tab-panel>
    <q-tab-panel name="b">
      <p class="demo-p">Panel B</p>
    </q-tab-panel>
    <q-tab-panel name="c">
      <p class="demo-p">Panel C</p>
    </q-tab-panel>
  </q-tab-panels>
</template>
```

</template>
</prose-show-case>

### API

<dnax-api name="QTabPanels">



</dnax-api>

## QTabPanel — the panel

A panel whose `name` is compared to the `v-model` of `q-tab-panels`. Content
stays mounted (`v-show`) so state is preserved; `lazy-render` defers mounting
until the first activation — handy for heavy content.

### Lazy render

<prose-show-case>
<dnax-demo-tab-panels demo="lazy">



</dnax-demo-tab-panels>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tabLazy = ref("a")
</script>

<template>
  <q-tabs v-model="tabLazy" align="left" no-caps active-color="primary" indicator-color="primary">
    <q-tab name="a" label="Light" />
    <q-tab name="b" label="Heavy" />
  </q-tabs>

  <q-tab-panels v-model="tabLazy" animated class="demo-panels">
    <q-tab-panel name="a">
      <p class="demo-p">Light panel — always mounted.</p>
    </q-tab-panel>
    <q-tab-panel name="b" lazy-render>
      <p class="demo-p">Heavy panel — its content only mounts after the first visit.</p>
    </q-tab-panel>
  </q-tab-panels>
</template>
```

</template>
</prose-show-case>

### Rich content

Panels accept anything — lists, forms, images… State inside a panel (inputs,
scroll) survives tab switches because it stays mounted.

<prose-show-case>
<dnax-demo-tab-panels demo="rich">



</dnax-demo-tab-panels>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tabRich = ref("one")
</script>

<template>
  <q-tab-panels v-model="tabRich" animated class="demo-panels">
    <q-tab-panel name="one">
      <q-list bordered>
        <q-item><q-item-section>Row A</q-item-section></q-item>
        <q-item><q-item-section>Row B</q-item-section></q-item>
      </q-list>
    </q-tab-panel>
    <q-tab-panel name="two">
      <q-input label="Name" outlined />
    </q-tab-panel>
  </q-tab-panels>
</template>
```

</template>
</prose-show-case>

### API

<dnax-api name="QTabPanel">



</dnax-api>
