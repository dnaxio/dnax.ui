# Radio

> Radio options for single-choice groups — colors, label layout, dense and disabled/readonly states.

A radio option for single-choice groups. **<q-radio>** is selected when its `val`
matches the shared `v-model` — radios bound to the same model form a mutually
exclusive group. Colors, `left-label` and `dense` follow the Quasar conventions.

## Radio group

<prose-show-case>
<dnax-demo-radio demo="group">



</dnax-demo-radio>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const transport = ref("car")
</script>

<template>
  <q-radio v-model="transport" val="car" label="Car" />
  <q-radio v-model="transport" val="bike" label="Bike" />
  <q-radio v-model="transport" val="walk" label="Walk" />
</template>
```

</template>
</prose-show-case>

## Colors

<prose-show-case>
<dnax-demo-radio demo="colors">



</dnax-demo-radio>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const theme = ref("dark")
</script>

<template>
  <q-radio v-model="theme" val="dark" label="Dark" color="primary" />
  <q-radio v-model="theme" val="system" label="System" color="secondary" />
  <q-radio v-model="theme" val="light" label="Light" color="teal" />
</template>
```

</template>
</prose-show-case>

## Layout

`left-label` moves the label to the left of the control, and `dense` reduces the
spacing.

<prose-show-case>
<dnax-demo-radio demo="layout">



</dnax-demo-radio>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const transport = ref("car")
</script>

<template>
  <q-radio v-model="transport" val="car" label="Left label" left-label />
  <q-radio v-model="transport" val="bike" label="Dense" dense color="secondary" />
</template>
```

</template>
</prose-show-case>

## Disabled & readonly

<prose-show-case>
<dnax-demo-radio demo="disabled">



</dnax-demo-radio>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const transport = ref("car")
</script>

<template>
  <q-radio v-model="transport" val="car" label="Car (disabled)" disable />
  <q-radio v-model="transport" val="walk" label="Walk (readonly)" readonly />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QRadio">



</dnax-api>
