# Date Picker

> A date selector with inline, sheet, modal and fullscreen dialog modes, plus min/max and disabled-date restrictions.

A date selector with four display modes. **<q-date-picker>** binds a `Date` (or
`null`) via `v-model` — `mode="inline"` renders the calendar in place, while
`sheet` / `modal` / `dialog` show a field trigger that opens a panel.

## Inline

The calendar is rendered directly in the page — no field, no overlay. Useful for
filters, widgets and small forms.

<prose-show-case>
<dnax-demo-date-picker demo="inline">



</dnax-demo-date-picker>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const fmt = (d) => (d ? d.toLocaleDateString("en-GB") : "—")

const dateInline = ref(null)
</script>

<template>
  <q-date-picker v-model="dateInline" mode="inline" />
</template>
```

</template>
</prose-show-case>

## Sheet

A field trigger (label, placeholder, clear button — same variants as `q-input`)
opens a bottom sheet anchored to the bottom edge, with the safe-area handled.

<prose-show-case>
<dnax-demo-date-picker demo="sheet">



</dnax-demo-date-picker>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const fmt = (d) => (d ? d.toLocaleDateString("en-GB") : "—")

const dateSheet = ref(null)
</script>

<template>
  <q-date-picker
    v-model="dateSheet"
    mode="sheet"
    label="Due date"
    placeholder="Pick a date"
    outlined
    clearable
  />
</template>
```

</template>
</prose-show-case>

## Modal

A centered dialog panel with an optional `title` — the `width` prop controls the
panel size.

<prose-show-case>
<dnax-demo-date-picker demo="modal">



</dnax-demo-date-picker>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const fmt = (d) => (d ? d.toLocaleDateString("en-GB") : "—")

const dateModal = ref(null)
</script>

<template>
  <q-date-picker
    v-model="dateModal"
    mode="modal"
    label="Appointment"
    title="Select a date"
    outlined
  />
</template>
```

</template>
</prose-show-case>

## Dialog

A fullscreen panel — ideal for mobile-first flows where the calendar needs the
whole screen (safe-area top & bottom handled).

<prose-show-case>
<dnax-demo-date-picker demo="dialog">



</dnax-demo-date-picker>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const fmt = (d) => (d ? d.toLocaleDateString("en-GB") : "—")

const dateDialog = ref(null)
</script>

<template>
  <q-date-picker
    v-model="dateDialog"
    mode="dialog"
    label="Departure"
    title="When do you leave?"
    outlined
  />
</template>
```

</template>
</prose-show-case>

## Restrictions

`min-date` / `max-date` bound the selectable window and `disabled-dates` disables
arbitrary days (here: weekends).

<prose-show-case>
<dnax-demo-date-picker demo="restrictions">



</dnax-demo-date-picker>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const fmt = (d) => (d ? d.toLocaleDateString("en-GB") : "—")

const dateRange = ref(null)
</script>

<template>
  <q-date-picker
    v-model="dateRange"
    mode="inline"
    :min-date="new Date(2026, 7, 1)"
    :max-date="new Date(2026, 7, 28)"
    :disabled-dates="(d) => d.getDay() === 0 || d.getDay() === 6"
  />
  <!-- window limited to August 2026, weekends disabled -->
</template>
```

</template>
</prose-show-case>

## Custom format

The `format` prop customizes how the selected date is displayed in the field
(default: `dd MMM yyyy`).

<prose-show-case>
<dnax-demo-date-picker demo="custom-format">



</dnax-demo-date-picker>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const fmt = (d) => (d ? d.toLocaleDateString("en-GB") : "—")

const dateFormat = ref(new Date(1990, 4, 12))
</script>

<template>
  <q-date-picker
    v-model="dateFormat"
    mode="sheet"
    label="Birthday"
    :format="(d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })"
    outlined
  />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QDatePicker">



</dnax-api>
