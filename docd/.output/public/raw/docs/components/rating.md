# Rating

> A star rating bound with v-model — custom max, Iconify icons, sizes, colors and readonly/disabled states.

A star rating with `v-model` on the current value. **<q-rating>** supports a
custom `max`, any Iconify `icon`, color and `size` tokens, hover preview on
desktop, and dims unselected stars unless `no-dimming` is set.

## Basic usage

<prose-show-case>
<dnax-demo-rating demo="basic">



</dnax-demo-rating>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const note = ref(3)
</script>

<template>
  <q-rating v-model="note" :max="5" />
</template>
```

</template>
</prose-show-case>

## Sizes & colors

`size` accepts `sm` | `md` | `lg` | `xl` or any CSS value; `color` takes a design
token or hex (default `warning`).

<prose-show-case>
<dnax-demo-rating demo="sizes">



</dnax-demo-rating>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const review = ref(4)
</script>

<template>
  <q-rating v-model="review" :max="5" color="secondary" size="sm" />
  <q-rating v-model="review" :max="5" color="warning" size="md" />
  <q-rating v-model="review" :max="5" color="primary" size="xl" />
</template>
```

</template>
</prose-show-case>

## Custom icon

Any Iconify icon can replace the default star, and `no-dimming` keeps unselected
icons at full opacity.

<prose-show-case>
<dnax-demo-rating demo="icons">



</dnax-demo-rating>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const hearts = ref(5)
</script>

<template>
  <q-rating v-model="hearts" :max="5" icon="lucide:heart"
    color="red" no-dimming />
</template>
```

</template>
</prose-show-case>

## Readonly & disabled

<prose-show-case>
<dnax-demo-rating demo="readonly">



</dnax-demo-rating>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const fixed = ref(5)
</script>

<template>
  <q-rating v-model="fixed" :max="5" readonly />
  <q-rating v-model="fixed" :max="5" color="teal" disable />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QRating">



</dnax-api>
