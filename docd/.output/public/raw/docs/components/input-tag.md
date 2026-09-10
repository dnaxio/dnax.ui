# Input Tag

> A text field that collects tags as chips — Enter to add, × to remove, editing and pasting built in.

A text field that collects **tags** as chips — inspired by the reka-ui TagsInput
pattern. Press `Enter` (or a comma) to add the current text, `Backspace` on an empty
field to remove the last tag, use the arrows to navigate between tags,
**double-click** a tag to edit it, or **paste** a comma/semicolon-separated list to
add several at once. **<q-input-tag>** keeps the same field vocabulary as
`q-input` (`outlined`, `filled`, `dense`, `error`…).

## Basic

The `v-model` is an array of strings. Add with Enter/comma, remove with `×`,
Backspace or Delete, navigate with the arrows, double-click a tag to edit it, or
paste a list — try pasting `vue, nuxt, tailwind` in the field below.

<prose-show-case>
<dnax-demo-input-tag demo="basic">



</dnax-demo-input-tag>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tags = ref(["ada@dnax.dev", "grace@dnax.dev"])
</script>

<template>
  <q-input-tag
    v-model="tags"
    label="Emails"
    placeholder="Type and press Enter"
    outlined
  />
</template>
```

</template>
</prose-show-case>

## Events

`add` and `remove` fire with the affected tag — useful for validation or backend
sync.

<prose-show-case>
<dnax-demo-input-tag demo="events">



</dnax-demo-input-tag>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tags = ref(["ada@dnax.dev", "grace@dnax.dev"])
</script>

<template>
  <q-input-tag
    v-model="tags"
    label="Features"
    placeholder="Add a feature…"
    outlined
    @add="lastEvent = 'added: ' + $event"
    @remove="lastEvent = 'removed: ' + $event"
  />
  <p class="demo-p demo-event">Last event: {{ lastEvent }}</p>
</template>
```

</template>
</prose-show-case>

## Max, variants & states

`max-tags` limits the count, `filled`/`dense` change the look, `disable` locks the
field.

<prose-show-case>
<dnax-demo-input-tag demo="states">



</dnax-demo-input-tag>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const tags = ref(["ada@dnax.dev", "grace@dnax.dev"])
</script>

<template>
  <q-input-tag v-model="tags" label="Max 3 tags" :max-tags="3" outlined />
  <q-input-tag v-model="tags" label="Filled & dense" filled dense />
  <q-input-tag v-model="tags" label="Disabled" disable outlined />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QInputTag">



</dnax-api>
