# Input Password

> A password field with a built-in show/hide toggle, wrapping q-input with the same props and slots.

A password field with a built-in show/hide toggle. **<q-input-password>** wraps
**<q-input>** — same props and slots — and displays `eye-off` by default (hidden
state), switching to `eye` when revealed.

## Basic

A simple password field with the `label` shown above and the visibility toggle on
the right.

<prose-show-case>
<dnax-demo-input-password demo="basic">



</dnax-demo-input-password>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const password = ref("")
</script>

<template>
  <q-input-password v-model="password" label="Password" outlined />
</template>
```

</template>
</prose-show-case>

## Variants

All field variants pass through: `outlined` (default), `filled`, `borderless`,
`dense`, `clearable`…

<prose-show-case>
<dnax-demo-input-password demo="variants">



</dnax-demo-input-password>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const densePwd = ref("")
</script>

<template>
  <q-input-password v-model="password" label="Password" outlined dense clearable />
  <q-input-password v-model="password" label="Password" filled />
  <q-input-password v-model="password" label="Password" borderless />
</template>
```

</template>
</prose-show-case>

## Hint, error & disabled

`hint`, `error` / `error-message` and `disable` behave exactly like `q-input`.

<prose-show-case>
<dnax-demo-input-password demo="states">



</dnax-demo-input-password>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const densePwd = ref("")
</script>

<template>
  <q-input-password v-model="password" label="Password" hint="8+ characters, 1 number" outlined />
  <q-input-password v-model="password" label="Password" error error-message="Too weak" outlined />
  <q-input-password v-model="password" label="Password" disable outlined />
</template>
```

</template>
</prose-show-case>

## Confirmation

A common pattern — password + confirmation fields side by side.

<prose-show-case>
<dnax-demo-input-password demo="confirm">



</dnax-demo-input-password>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const password = ref("")
const confirm = ref("")
</script>

<template>
  <q-input-password v-model="password" label="Password" outlined />
  <q-input-password v-model="confirm" label="Confirm password" outlined />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QInputPassword">



</dnax-api>
