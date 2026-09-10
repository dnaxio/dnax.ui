---
title: Action Sheet
description: An iOS-style sheet that presents a list of options on top of the
  current screen, with select and cancel events.
navigation:
  icon: lucide:panel-bottom
seo:
  title: Action Sheet (QActionSheet)
  description: QActionSheet — an iOS-style option list with @select / @cancel and the Quasar API.
---

An iOS-style action sheet presents a list of options on top of the current screen.
The options are passed as a prop array, the selection is emitted through
`@select`, and the component also exposes `@cancel` with a customizable cancel button.

## QActionSheet — options list

::prose-show-case
<dnax-demo-action-sheet demo="options"></dnax-demo-action-sheet>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const open = ref(false)
const result = ref("")

const shareOptions = ref([
  { label: "Copy link", icon: "lucide:link", value: "copy" },
  { label: "Email", icon: "lucide:mail", value: "email", description: "Send a message" },
  { label: "Messages", icon: "lucide:message-circle", value: "messages" },
  { label: "More options", icon: "lucide:ellipsis", description: "No value — the option itself is emitted" },
])

const onSelect = (value) => {
  result.value = typeof value === "string" ? value : (value?.label ?? JSON.stringify(value))
}
</script>

<template>
  <q-btn color="primary" icon="lucide:share-2" label="Share" @click="open = true" />

  <q-action-sheet
    v-model="open"
    title="Share to"
    :options="shareOptions"
    @select="onSelect"
  />
  <p v-if="result" class="demo-action-result">Selected: <code>{{ result }}</code></p>
</template>
```
::

### Select & cancel events

::prose-show-case
<dnax-demo-action-sheet demo="events"></dnax-demo-action-sheet>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const openPlan = ref(false)
const last = ref("")

const planOptions = ref([
  { label: "Free", value: "free", icon: "lucide:gift" },
  { label: "Pro", value: "pro", icon: "lucide:zap", color: "primary", description: "Best value" },
  { label: "Enterprise", value: "enterprise", icon: "lucide:building-2", color: "#d97706" },
])
</script>

<template>
  <q-btn outline label="Choose a plan" @click="openPlan = true" />

  <q-action-sheet
    v-model="openPlan"
    title="Upgrade plan"
    cancel="Dismiss"
    :options="planOptions"
    @select="last = 'select: ' + $event"
    @cancel="last = 'cancel'"
  />
  <p v-if="last" class="demo-action-result">Last event: <code>{{ last }}</code></p>
</template>
```
::

Each option supports an `icon` (left), an `icon-right`, a `color` for the label
and a `description`. On selection the sheet closes and emits `@select` with the
option's `value` — or the option object itself when no `value` is set. The cancel
button emits `@cancel`; its default label is `Annuler` — pass a string to change
it (e.g. `cancel="Dismiss"`) or `cancel="false"` to hide it.

### API

<dnax-api name="QActionSheet"></dnax-api>
