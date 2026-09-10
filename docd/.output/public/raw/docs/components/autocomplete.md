# Autocomplete

> A text field with a filtered suggestion list — inline dropdown, centered modal or bottom sheet, with client-side or server-side filtering.

A text field with a filtered suggestion list. **<q-autocomplete>** binds
the selected value with `v-model` and the typed text with
`v-model:input-value`. Filtering is client-side by default —
pass `@filter` to switch to server-side mode (the parent updates
`:options`).

## Basic usage

Search among `20 countries`. `option-value` and
`option-label` pick the value / label of each option; type to
filter, use arrows + `Enter` to select, `Escape` to close.

<prose-show-case>
<dnax-demo-autocomplete demo="basic">



</dnax-demo-autocomplete>

<template v-slot:code="">

```vue
const countries = [
  { name: "France", code: "FR" },
  // … 20 countries in total …
  { name: "Canada", code: "CA" },
]

<q-autocomplete
  v-model="selected"
  :options="countries"
  option-value="code"
  option-label="name"
  label="Country"
  placeholder="Type to search…"
  outlined
  clearable
/>
```

</template>
</prose-show-case>

## Custom option slot

The default slot receives `{ option, index, selected, active }` —
render any content per suggestion (icon, badge, description…).

<prose-show-case>
<dnax-demo-autocomplete demo="slot">



</dnax-demo-autocomplete>

<template v-slot:code="">

```vue
<q-autocomplete
  v-model="selected"
  :options="countries"
  option-value="code"
  option-label="name"
  label="Pick a country"
  outlined
>
  <template #default="{ option }">
    <q-icon name="lucide:map-pin" color="primary" size="16px" />
    <span class="opt-label">{{ option.name }}</span>
    <span class="opt-code">{{ option.code }}</span>
  </template>
</q-autocomplete>
```

</template>
</prose-show-case>

## Left icon

No template needed — `icon-left` renders an Iconify icon at
the start of the field (with proper spacing from the value). For custom
content, the `#prepend` slot is still available and
overrides the prop.

<prose-show-case>
<dnax-demo-autocomplete demo="icon">



</dnax-demo-autocomplete>

<template v-slot:code="">

```vue
<q-autocomplete
  v-model="selected"
  :options="countries"
  option-value="code"
  option-label="name"
  label="Country"
  icon-left="lucide:map-pin"
  outlined
  clearable
/>
<!-- Le slot #prepend reste disponible pour un contenu custom (il remplace icon-left) -->
```

</template>
</prose-show-case>

## Variants & states

Same field variants as `q-input` (`outlined`,
`filled`, `borderless`, `dense`,
`radius`) plus `loading`, `disable` and
`error` / `error-message`.

<prose-show-case>
<dnax-demo-autocomplete demo="states">



</dnax-demo-autocomplete>

<template v-slot:code="">

```vue
<q-autocomplete v-model="dense" :options="countries" option-value="code" option-label="name" label="Dense & filled" filled dense />
<q-autocomplete v-model="loading" :options="countries" option-value="code" option-label="name" label="Loading" loading outlined />
<q-autocomplete v-model="disabled" :options="countries" option-value="code" option-label="name" label="Disabled" disable outlined />
<q-autocomplete v-model="error" :options="countries" option-value="code" option-label="name" label="Invalid code" error error-message="Choose a valid country" outlined />
```

</template>
</prose-show-case>

## Sheet & modal modes

`mode` switches the suggestion panel: `inline`
(default dropdown), `modal` (centered box) or
`sheet` (bottom sheet, iOS safe-area built in). The panel has
a `title` header, its own search field (the typed text is
shared with the field), and closes on backdrop / × / Esc / browser
back. Per-mode tuning goes in `sheet-options` /
`modal-options` (`width`, `height`,
`title`, `style`, `class`,
`search-placeholder` — they override the direct props) —
e.g. `sheet-options="{ width: '100%' }"` for a full-width
sheet. With `swipe-to-close` (sheet mode), dragging the
header down dismisses the panel.

<prose-show-case>
<dnax-demo-autocomplete demo="panel">



</dnax-demo-autocomplete>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const selected = ref("")
const mode = ref("inline")
</script>

<template>
  <q-autocomplete
    v-model="selected"
    :options="countries"
    option-value="code"
    option-label="name"
    label="Country"
    :mode="mode"
    swipe-to-close
    :sheet-options="{ title: 'Pick a country', width: '100%', searchPlaceholder: 'Search countries…' }"
    :modal-options="{ title: 'Pick a country', height: '400px' }"
    outlined
  />
  <!-- mode : inline (dropdown) | modal (boîte centrée) | sheet (bottom sheet) -->
</template>
```

</template>
</prose-show-case>

## Swipe to close

On the `sheet` mode, `swipe-to-close` turns the
header into a drag handle: pull the panel down and release past the
threshold (80px) to dismiss it, or let go early to spring it back — the
native bottom-sheet gesture. Try it on touch or with the mouse.

<prose-show-case>
<dnax-demo-autocomplete demo="swipe">



</dnax-demo-autocomplete>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const selected = ref("")
</script>

<template>
  <q-autocomplete
    v-model="selected"
    :options="countries"
    option-value="code"
    option-label="name"
    label="Country"
    mode="sheet"
    swipe-to-close
    title="Pick a country"
    outlined
  />
  <!-- Drag the header down to dismiss the sheet (swipe-to-close, sheet mode) -->
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QAutocomplete">



</dnax-api>
