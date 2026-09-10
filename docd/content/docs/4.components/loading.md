---
title: Loading
description: The fullscreen loading overlay — a declarative component driven by
  v-model, plus the provider that renders the $q.loading plugin state.
navigation:
  icon: lucide:loader
seo:
  title: Loading (QLoading)
  description: QLoading — the fullscreen loading overlay, driven by v-model or the $q.loading plugin.
---

The fullscreen loading overlay, in two parts: **`<q-loading>`**, the declarative
component driven by a boolean `v-model`, and **`<q-loading-provider>`**, the
component that renders the state of the `$q.loading` plugin — mounted automatically
by `<q-config-provider>`. Both share the same visual options (spinner or icon +
message, transparent or boxed).

## q-loading — declarative, with v-model

Bind a boolean with `v-model` to show or hide the overlay.

### Basic

::prose-show-case
:dnax-demo-loading{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const busyBasic = ref(false)
</script>

<template>
  <q-loading v-model="busyBasic" message="Loading…" />
  <q-btn unelevated color="primary" no-caps label="Show loading" @click="busyBasic = true" />
</template>
```
::

### Custom icon & colors

`icon` replaces the spinner with a rotating Iconify icon on a transparent overlay;
`message`, `spinner-color` and `background-color` style it.

::prose-show-case
:dnax-demo-loading{demo="custom"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const busyCustom = ref(false)
</script>

<template>
  <q-loading
    v-model="busyCustom"
    message="Uploading files…"
    icon="lucide:loader-circle"
    spinner-color="primary"
    background-color="rgb(0 0 0 / 0.45)"
  />
</template>
```
::

### Boxed icon

`boxed` keeps the white card behind the icon (default: transparent).

::prose-show-case
:dnax-demo-loading{demo="boxed"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const busyBoxed = ref(false)
</script>

<template>
  <q-loading
    v-model="busyBoxed"
    message="Saving settings…"
    icon="lucide:loader-circle"
    spinner-color="primary"
    boxed
  />
</template>
```
::

### API

:dnax-api{name="QLoading"}

## q-loading-provider — the plugin overlay

Renders the fullscreen overlay from the `$q.loading` plugin state (`show()` /
`hide()`, plus `delay` and `group` options). Mounted automatically by the outermost
`<q-config-provider>` — standalone usage (app without `QConfigProvider`):

```html
<q-loading-provider />
<!-- renders $q.loading.show({ message: "…" }) — see Plugins API -->
```

### API

:dnax-api{name="QLoadingProvider"}
