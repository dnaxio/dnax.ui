# Select

> A dropdown selector for single or multiple values — inline, modal, sheet and dialog modes, fuzzy search, chips and primitive options.

A dropdown selector for single or multiple values. **<q-select>** renders an inline dropdown by default, with `modal`, `sheet` and `dialog` modes for mobile, plus client-side fuzzy search (`use-search`), selected chips (`use-chips`) and `emit-value` to bind the option value instead of the whole object.

## Basic usage

<prose-show-case>
<dnax-demo-select demo="basic">



</dnax-demo-select>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const colors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
]

const color = ref(null)
</script>

<template>
  <q-select
    v-model="color"
    :options="colors"
    label="Color"
    placeholder="Pick a color"
  />
</template>
```

</template>
</prose-show-case>

### Custom option keys

By default the option `label` and `value` keys are used. With `option-label` / `option-value` you can map any object shape, and `emit-value` binds the raw value instead of the option object.

<prose-show-case>
<dnax-demo-select demo="customKeys">



</dnax-demo-select>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const country = ref(null)

const countries = [
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
  { id: "us", name: "United States" },
]
</script>

<template>
  <q-select
    v-model="country"
    :options="countries"
    option-label="name"
    option-value="id"
    label="Country"
    emit-value
  />
</template>
```

</template>
</prose-show-case>

## Outlined & clearable

<prose-show-case>
<dnax-demo-select demo="outlined">



</dnax-demo-select>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const framework = ref(null)

const frameworks = [
  { id: "vue", name: "Vue" },
  { id: "react", name: "React" },
  { id: "svelte", name: "Svelte" },
]
</script>

<template>
  <q-select
    v-model="framework"
    :options="frameworks"
    option-label="name"
    option-value="id"
    label="Framework"
    placeholder="Select…"
    outlined
    clearable
    dense
  />
</template>
```

</template>
</prose-show-case>

## Multiple selection

With `multiple` the `v-model` becomes an array; `use-chips` displays each selection as a removable chip.

<prose-show-case>
<dnax-demo-select demo="multiple">



</dnax-demo-select>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const colors = [
  { value: "red", label: "Red" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
]

const multi = ref([])
</script>

<template>
  <q-select
    v-model="multi"
    :options="colors"
    label="Favorite colors"
    multiple
    use-chips
    emit-value
    clearable
  />
</template>
```

</template>
</prose-show-case>

## Primitive options

Passing plain strings or numbers as `options` works out of the box: each value is automatically normalized into `{ value, label }` (same value, stringified label), and the `v-model` keeps the original value.

<prose-show-case>
<dnax-demo-select demo="primitives">



</dnax-demo-select>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const size = ref("")
const level = ref(0)
</script>

<template>
  <q-select
    v-model="size"
    :options="['S', 'M', 'L', 'XL']"
    label="Size"
  />

  <q-select
    v-model="level"
    :options="[1, 2, 3, 4, 5]"
    label="Level"
  />
  <!-- Les options string/number sont normalisées automatiquement en
       { value: x, label: x } — le v-model garde la valeur d'origine. -->
</template>
```

</template>
</prose-show-case>

## Modes — inline, modal, sheet

`mode` picks the panel that hosts the options: **inline** (default dropdown),
**modal** (centered box) or **sheet** (bottom sheet, iOS safe-area built in) —
plus **dialog** for a full-screen panel. The panel shows a title (the field
`label`), its own search field when `use-search` is on, and closes on backdrop /
× / Esc / browser back.

Per-mode tuning goes in `inline-options` / `modal-options` / `sheet-options`
(`width`, `height`, `rounded`, `offset`, `position`, `search-placeholder`, `style`,
`class`) — they override the direct props, e.g. `sheet-options="{ width: '100%' }"`
for a full-width sheet.

<prose-show-case>
<dnax-demo-select demo="panel">



</dnax-demo-select>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const mode = ref("inline")
const country = ref(null)
</script>

<template>
  <q-select v-model="mode" :options="['inline', 'modal', 'sheet']" label="mode" outlined dense />

  <q-select
    v-model="country"
    :options="countries"
    option-label="name"
    option-value="id"
    label="Country"
    emit-value
    :mode="mode"
    use-search
    outlined
    clearable
    :sheet-options="{ width: '100%', searchPlaceholder: 'Search countries…' }"
    :modal-options="{ height: '360px' }"
  />
  <!-- mode : inline (dropdown) | modal (boîte centrée) | sheet (bottom sheet) | dialog (plein écran) -->
</template>
```

</template>
</prose-show-case>

## Inline popup placement

In `inline` mode the popup is placed **automatically** (`position="auto"`, the
default) against the viewport. The position is recomputed when it opens, then on
every resize/scroll while it stays open:

<table>
<thead>
  <tr>
    <th>
      Situation
    </th>
    
    <th>
      Behaviour
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Enough room below (≥ <code>
        96px
      </code>
      
      )
    </td>
    
    <td>
      Opens <strong>
        below
      </strong>
      
       the field, gap <code>
        offset
      </code>
      
       (default <code>
        8px
      </code>
      
      ) measured from the <strong>
        control
      </strong>
      
       bottom.
    </td>
  </tr>
  
  <tr>
    <td>
      Not enough room below, more room above
    </td>
    
    <td>
      Flips <strong>
        above
      </strong>
      
       the field (the entry animation comes from the bottom, via <code>
        q-select__popup--up
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      The roomier side is still tight
    </td>
    
    <td>
      The gap shrinks down to <code>
        0px
      </code>
      
       so the list keeps the space.
    </td>
  </tr>
  
  <tr>
    <td>
      Any case
    </td>
    
    <td>
      <code>
        max-height
      </code>
      
       is capped to the room actually available (never more than the historical <code>
        240px
      </code>
      
      ), so the popup never overflows the window edge — the list scrolls inside.
    </td>
  </tr>
</tbody>
</table>

The anchor is the **field control**, not the field root: `.q-field__bottom` reserves a
~24px band for the hint/error line even when it is empty, which used to push the
popup far from the field. As soon as a `hint` or an `error` is shown, the popup is
placed below that text instead (the anchor becomes the field root).

### Offset

`offset` (in px, default `8`) sets the gap between the field and the popup, and
`inline-options.offset` overrides it:

<prose-show-case>
<dnax-demo-select demo="offset">



</dnax-demo-select>

<template v-slot:code="">

```vue
<q-select v-model="a" :options="colors" label="offset 0" emit-value />
<q-select v-model="b" :options="colors" label="offset 8 (default)" emit-value />
<q-select v-model="c" :options="colors" label="offset 16" :offset="16" emit-value />
```

</template>
</prose-show-case>

The value is only a **starting** gap: on the chosen side it is clamped to
`clamp(0, offset, available - 96px)`, so it shrinks when the field sits close to a
window edge. `0` sticks the popup to the field.

If you need to escape the automatic placement entirely, `inline-options.style` is
applied **after** the computed style and wins — but the position is expressed in
`px` relative to the field, so prefer `offset` for the gap:

```html
<!-- hauteur libre (le style passe après le style calculé) -->
<q-select v-model="v" :options="opts" :inline-options="{ offset: 0, style: { maxHeight: '420px' } }" />
```

### Direction

`position` forces the side instead of following the available room. It reuses the
dropdown vocabulary (`DropdownPosition` from `QBtnActions`), minus the lateral
placements — a select popup always opens above or below its field:

<table>
<thead>
  <tr>
    <th>
      Value
    </th>
    
    <th>
      Effect
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        auto
      </code>
      
       <em>
        (default)
      </em>
    </td>
    
    <td>
      Below when there is room (≥ <code>
        96px
      </code>
      
      ), flips above otherwise.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        bottom
      </code>
      
       / <code>
        top
      </code>
    </td>
    
    <td>
      Always below / above — no flip.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        bottom-start
      </code>
      
       / <code>
        top-start
      </code>
    </td>
    
    <td>
      Same, anchored on the field's <strong>
        left
      </strong>
      
       edge.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        bottom-end
      </code>
      
       / <code>
        top-end
      </code>
    </td>
    
    <td>
      Same, anchored on the field's <strong>
        right
      </strong>
      
       edge.
    </td>
  </tr>
</tbody>
</table>

With no custom width the popup spans the field, so `-start` and `-end` look
identical to `bottom` / `top`; they become visible as soon as the popup has its own
width (`inline-options="{ width: '240px' }"`):

<prose-show-case>
<dnax-demo-select demo="direction">



</dnax-demo-select>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const position = ref("auto")
const country = ref(null)
</script>

<template>
  <q-select
    v-model="position"
    :options="['auto', 'bottom', 'top', 'bottom-start', 'bottom-end', 'top-start', 'top-end']"
    label="position"
    outlined
    dense
  />

  <q-select
    v-model="country"
    :options="countries"
    option-label="name"
    option-value="id"
    label="Country"
    emit-value
    :position="position"
    :inline-options="{ width: '240px' }"
    outlined
  />
</template>
```

</template>
</prose-show-case>

Like `offset`, `position` can be overridden per mode:
`inline-options="{ position: 'top' }"`. A forced side never flips — the popup just
shrinks its `max-height` to the room available on that side.

## API

<dnax-api name="QSelect">



</dnax-api>
