# Fab

> A floating action button that expands a stack of actions, fixed to the screen edge with safe-areas.

A floating action button (**<q-fab>**) that expands a stack of actions
(**<q-fab-action>**). Fixed to the screen edge with iOS safe-areas built in —
perfect for mobile-first apps.

## QFab — floating action button

The main button toggles the actions (`v-model`), rotates its icon 45° when open,
and exposes `position` (corners), `icon` and `color`. Clicking an action closes it.

<prose-show-case>
<dnax-demo-fab demo="basic">



</dnax-demo-fab>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const lastAction = ref("")

const openBasic = ref(false)
</script>

<template>
  <q-fab v-model="openBasic" color="primary">
    <q-fab-action label="Share" icon="lucide:share-2" color="secondary" @click="lastAction = 'Share'" />
    <q-fab-action label="Camera" icon="lucide:camera" color="positive" @click="lastAction = 'Camera'" />
    <q-fab-action label="Mail" icon="lucide:mail" @click="lastAction = 'Mail'" />
  </q-fab>
  <p class="demo-p demo-p--value">Last action: <code>{{ lastAction || "—" }}</code></p>
</template>
```

</template>
</prose-show-case>

## Positions

`top-left` | `top-right` | `bottom-left` | `bottom-right` (default) — offsets
include the safe-areas.

<prose-show-case>
<dnax-demo-fab demo="positions">



</dnax-demo-fab>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openLeft = ref(false)
const openPositions = ref(false)
</script>

<template>
  <q-fab v-model="openLeft" position="bottom-left" />
  <q-fab v-model="openPositions" position="top-right" />
</template>
```

</template>
</prose-show-case>

## Color & custom icon

The main button accepts any token or hex color and an Iconify `icon` (default
`lucide:plus`).

<prose-show-case>
<dnax-demo-fab demo="colors">



</dnax-demo-fab>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openColors = ref(false)
</script>

<template>
  <q-fab v-model="openColors" color="negative" icon="lucide:message-circle">
    <q-fab-action label="New message" icon="lucide:message-square-plus" />
    <q-fab-action label="Voice note" icon="lucide:mic" color="positive" />
  </q-fab>
</template>
```

</template>
</prose-show-case>

## QFabAction — individual action

Each action shows an optional `label` pill, a round `icon` button and a `color`.
Clicking it emits `click` and closes the parent fab; `disable` greys it out.

<prose-show-case>
<dnax-demo-fab demo="actions">



</dnax-demo-fab>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const lastAction = ref("")

const openActions = ref(false)
</script>

<template>
  <q-fab v-model="openActions">
    <q-fab-action label="Edit" icon="lucide:pencil" @click="lastAction = 'Edit'" />
    <q-fab-action label="Archive" icon="lucide:archive" color="warning" @click="lastAction = 'Archive'" />
    <q-fab-action label="Delete" icon="lucide:trash-2" color="negative" disable />
  </q-fab>
  <p class="demo-p demo-p--value">Last action: <code>{{ lastAction || "—" }}</code></p>
</template>
```

</template>
</prose-show-case>

## QFab

<dnax-api name="QFab">



</dnax-api>

## QFabAction

<dnax-api name="QFabAction">



</dnax-api>
