# Input OTP

> A one-time-password field — one box per character, numeric or masked, grouped and with a complete event.

A one-time-password field: one box per character with automatic advance,
`Backspace` navigation, arrow keys, paste of the full code and a `complete` event.
**<q-input-otp>** reuses the field vocabulary of `q-input` (`label`, `outlined`,
`filled`, `dense`, `error`…).

## Basic

The `v-model` is a string. Type a character to fill a box and jump to the next one;
`Backspace` clears the current box, then the previous one. Click a box to select its
content and type over it.

<prose-show-case>
<dnax-demo-input-otp demo="basic">



</dnax-demo-input-otp>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("")
</script>

<template>
  <q-input-otp v-model="code" :length="6" label="Verification code" />
  <p class="demo-p demo-value">Code: {{ code || "—" }}</p>
</template>
```

</template>
</prose-show-case>

## Numeric & autofocus

`numeric` only accepts digits and sets `inputmode="numeric"` (numeric keypad on
mobile); `autofocus` focuses the first box on mount.

<prose-show-case>
<dnax-demo-input-otp demo="numeric">



</dnax-demo-input-otp>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const phone = ref("")
</script>

<template>
  <q-input-otp
    v-model="phone"
    :length="4"
    numeric
    autofocus
    label="Phone code"
    hint="Enter the 4-digit code sent by SMS"
  />
</template>
```

</template>
</prose-show-case>

## Grouped & masked

`group-every` + `separator` insert a label between groups (promo codes, license
keys); `password` masks the characters.

<prose-show-case>
<dnax-demo-input-otp demo="grouped">



</dnax-demo-input-otp>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const grouped = ref("")
</script>

<template>
  <q-input-otp
    v-model="grouped"
    :length="6"
    :group-every="3"
    separator="-"
    label="Promo code"
  />
</template>
```

</template>
</prose-show-case>

### Masked

<prose-show-case>
<dnax-demo-input-otp demo="masked">



</dnax-demo-input-otp>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const secret = ref("")
</script>

<template>
  <q-input-otp v-model="secret" :length="6" password label="Masked code" />
</template>
```

</template>
</prose-show-case>

## Variants & states

Same look vocabulary as `q-input`: `dense`, `filled`, `size` (sm / md / lg),
`disable`, `readonly`, `error` + `error-message`.

<prose-show-case>
<dnax-demo-input-otp demo="states">



</dnax-demo-input-otp>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("")
const locked = ref("")
</script>

<template>
  <q-input-otp v-model="code" :length="4" dense label="Dense" />
  <q-input-otp v-model="code" :length="4" filled label="Filled" />
  <q-input-otp v-model="code" :length="4" size="sm" label="Small" />
  <q-input-otp v-model="locked" :length="4" disable label="Disabled" />
  <q-input-otp v-model="code" :length="4" readonly label="Readonly" />
  <q-input-otp v-model="code" :length="4" error error-message="Wrong code" />
</template>
```

</template>
</prose-show-case>

## Complete event

`complete` fires as soon as every box is filled — handy to auto-submit the
verification.

<prose-show-case>
<dnax-demo-input-otp demo="complete">



</dnax-demo-input-otp>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const code = ref("")
const lastComplete = ref("")
</script>

<template>
  <q-input-otp
    v-model="code"
    :length="6"
    label="Complete to fire the event"
    @complete="lastComplete = $event"
  />
  <p class="demo-p demo-value">Last complete: {{ lastComplete || "—" }}</p>
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QInputOtp">



</dnax-api>
