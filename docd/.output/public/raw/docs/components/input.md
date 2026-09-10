# Input

> A single-line text field with a label above, validation states, icons and affixes.

A single-line text field with a label shown above, validation states, icons and
affixes. **<q-input>** implements the Quasar field vocabulary — `outlined`,
`filled`, `borderless`, `clearable`, `counter`, `dense` — plus rounded corners
(`radius`) and an auto-growing textarea (`autogrow`). The label is always rendered
above the field.

## Basic usage

<prose-show-case>
<dnax-demo-input demo="basic">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const text = ref("")
</script>

<template>
  <q-input v-model="text" label="Email" placeholder="you@example.com" />
</template>
```

</template>
</prose-show-case>

### Field types

<prose-show-case>
<dnax-demo-input demo="types">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const email = ref("")
const password = ref("")
const age = ref(null)
</script>

<template>
  <q-input v-model="email" type="email" label="Email" placeholder="you@example.com" />
  <q-input v-model="password" type="password" label="Password" />
  <q-input v-model="age" type="number" label="Age" />
</template>
```

</template>
</prose-show-case>

### Autogrow textarea

<prose-show-case>
<dnax-demo-input demo="autogrow">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const bio = ref("")
</script>

<template>
  <q-input v-model="bio" label="Bio" autogrow placeholder="Write a few lines…" />
</template>
```

</template>
</prose-show-case>

## Variants & density

The default field renders a bordered control with a white background. `outlined`
makes the background transparent, `filled` switches to a gray underline style and
`borderless` removes the border entirely.

<prose-show-case>
<dnax-demo-input demo="variants">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const outlinedVal = ref("")
const filledVal = ref("")
const borderlessVal = ref("")
</script>

<template>
  <q-input v-model="outlinedVal" label="Outlined" outlined />
  <q-input v-model="filledVal" label="Filled" filled />
  <q-input v-model="borderlessVal" label="Borderless" borderless />
</template>
```

</template>
</prose-show-case>

### Dense & radius

<prose-show-case>
<dnax-demo-input demo="dense">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const denseVal = ref("")
</script>

<template>
  <q-input v-model="denseVal" label="Dense pill" dense radius placeholder="Rounded" />
</template>
```

</template>
</prose-show-case>

## Clearable & counter

<prose-show-case>
<dnax-demo-input demo="clear">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const clearMe = ref("Hello Dnax")
const message = ref("")
</script>

<template>
  <q-input v-model="clearMe" label="Clearable" clearable />
  <q-input v-model="message" label="Message" counter :maxlength="20" />
</template>
```

</template>
</prose-show-case>

### Icons & affixes

Leading/trailing icons through the `#prepend` / `#append` slots (which take
precedence), or quicker with the `icon-left` / `icon-right` props; static text via
`prefix` / `suffix`.

<prose-show-case>
<dnax-demo-input demo="affixes">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const username = ref("")
</script>

<template>
  <q-input v-model="username" label="Username" prefix="@">
    <template #prepend><q-icon name="lucide:user" /></template>
    <template #append><q-icon name="lucide:badge-check" /></template>
  </q-input>
</template>
```

</template>
</prose-show-case>

<prose-show-case>
<dnax-demo-input demo="iconProps">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const email = ref("")
</script>

<template>
  <q-input v-model="email" label="Email" icon-left="lucide:mail" icon-right="lucide:check" />
</template>
```

</template>
</prose-show-case>

## Mask

`mask` formats the input while typing — `#` digit, `A` letter, `N` alphanumeric,
`X` any; other characters are inserted automatically. `fill-mask` shows empty slots
as `_`; `unmasked-value` emits the value without the mask characters.

<prose-show-case>
<dnax-demo-input demo="mask">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const phone = ref("")
const code = ref("")
const birthDate = ref("")
</script>

<template>
  <q-input v-model="phone" label="Phone" mask="##-##-##-##" placeholder="12-34-56-78" outlined />
  <q-input v-model="code" label="Code" mask="XX-XX-XX" fill-mask placeholder="AB-CD-EF" outlined />
  <q-input v-model="date" label="Date" mask="##/##/####" placeholder="15/08/1990" outlined />
  <!-- # digit · A letter · N alphanumeric · X any -->
</template>
```

</template>
</prose-show-case>

## Hint & error

<prose-show-case>
<dnax-demo-input demo="hint">



</dnax-demo-input>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const hintEmail = ref("")
const errorEmail = ref("")
</script>

<template>
  <q-input v-model="hintEmail" label="Email" type="email" hint="We never share your email." />
  <q-input v-model="errorEmail" label="Email" type="email" error error-message="Please enter a valid email address." />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QInput">



</dnax-api>
