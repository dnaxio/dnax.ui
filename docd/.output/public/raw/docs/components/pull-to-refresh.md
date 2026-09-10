# Pull To Refresh

> Pull down from the top of a scrollable container to refresh, with custom colors, thresholds, indicators and a controlled v-model.

Pull down from the top of a scrollable container to refresh — the gesture works with
**mouse and touch** (pointer events). **<q-pull-to-refresh>** shows a rotating
indicator while pulling and a spinner while `refresh(done)` runs; call `done()` when
the fetch finishes.

## Basic

Drag down from the top (mouse or touch), release past the threshold: the spinner
shows, `refresh(done)` fires and a fresh item is prepended once `done()` is called.

<prose-show-case>
<dnax-demo-pull-to-refresh demo="basic">



</dnax-demo-pull-to-refresh>

<template v-slot:code="">

```vue
<script setup>
import { ref } from "vue"

const items = ref(Array.from({ length: 12 }, (_, i) => "Item " + (i + 1)))
const refreshed = ref(0)

const onRefresh = (done) => {
  setTimeout(() => {
    refreshed.value++
    items.value = ["Fresh item " + refreshed.value, ...items.value].slice(0, 12)
    done()
  }, 1200)
}
</script>

<template>
  <q-pull-to-refresh @refresh="onRefresh" style="height: 320px">
    <div v-for="it in items" :key="it" class="row">{{ it }}</div>
  </q-pull-to-refresh>
  <p class="demo-p demo-meta">Refreshed {{ refreshed }}× — pull down (mouse or touch) to trigger.</p>
</template>
```

</template>
</prose-show-case>

## Color & threshold

`color` styles the indicator (token or hex); `pull-back` sets the drag distance before
triggering (default 40 px) and `size` the icon/spinner size (default 28 px).

<prose-show-case>
<dnax-demo-pull-to-refresh demo="custom">



</dnax-demo-pull-to-refresh>

<template v-slot:code="">

```vue
<script setup>
import { ref } from "vue"

const items = ref(Array.from({ length: 12 }, (_, i) => "Item " + (i + 1)))
const refreshed = ref(0)

const onRefresh = (done) => {
  setTimeout(() => {
    refreshed.value++
    items.value = ["Fresh item " + refreshed.value, ...items.value].slice(0, 12)
    done()
  }, 1200)
}
</script>

<template>
  <q-pull-to-refresh
    @refresh="onRefresh"
    color="secondary"
    :pull-back="70"
    size="20px"
    style="height: 260px"
  >
    <div v-for="it in items" :key="it" class="row">{{ it }}</div>
  </q-pull-to-refresh>
  <!-- pull-back : distance de traction avant déclenchement (défaut 40 px).
       size : taille de l'icône / du spinner (défaut 28 px). -->
</template>
```

</template>
</prose-show-case>

## Custom indicators

`#pulling` (receives `position` — the drag distance) replaces the rotating icon while
dragging; `#refreshing` replaces the spinner while loading.

<prose-show-case>
<dnax-demo-pull-to-refresh demo="slots">



</dnax-demo-pull-to-refresh>

<template v-slot:code="">

```vue
<script setup>
import { ref } from "vue"

const items = ref(Array.from({ length: 12 }, (_, i) => "Item " + (i + 1)))
const refreshed = ref(0)

const onRefresh = (done) => {
  setTimeout(() => {
    refreshed.value++
    items.value = ["Fresh item " + refreshed.value, ...items.value].slice(0, 12)
    done()
  }, 1200)
}
</script>

<template>
  <q-pull-to-refresh @refresh="onRefresh" style="height: 260px">
    <template #pulling="{ position }">
      <span class="pull-label">↓ Pull to refresh ({{ Math.round(position) }}px)</span>
    </template>
    <template #refreshing>
      <span class="refresh-label">Syncing…</span>
    </template>
    <div v-for="it in items" :key="it" class="row">{{ it }}</div>
  </q-pull-to-refresh>
</template>
```

</template>
</prose-show-case>

## Controlled (v-model)

With `v-model` the parent owns the refreshing state — the pull gesture still works,
and the indicator can also be triggered programmatically (here via the button).

<prose-show-case>
<dnax-demo-pull-to-refresh demo="controlled">



</dnax-demo-pull-to-refresh>

<template v-slot:code="">

```vue
<script setup>
import { ref } from "vue"

const items = ref(Array.from({ length: 12 }, (_, i) => "Item " + (i + 1)))
const refreshed = ref(0)
const refreshing = ref(false)

const onRefresh = (done) => {
  setTimeout(() => { refreshed.value++; items.value = ["Fresh " + refreshed.value, ...items.value].slice(0, 12); done() }, 1000)
}

const trigger = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    refreshed.value++
    items.value = ["Fresh " + refreshed.value, ...items.value].slice(0, 12)
  }, 1000)
}
</script>

<template>
  <q-btn label="Trigger refresh" color="primary" @click="trigger" />
  <q-pull-to-refresh v-model="refreshing" @refresh="onRefresh" style="height: 240px">
    <div v-for="it in items" :key="it" class="row">{{ it }}</div>
  </q-pull-to-refresh>
  <!-- v-model pilote l'indicateur : pull OU bouton déclenchent le refresh. -->
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QPullToRefresh">



</dnax-api>
