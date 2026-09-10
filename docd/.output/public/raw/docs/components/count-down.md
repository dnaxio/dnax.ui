# Count Down

> A countdown timer from a duration or to a target date, with formatting tokens, an end event, controls and a raw-data slot.

A countdown timer: **<q-count-down>** counts down from a duration (`time`, in
seconds) or to a target date (`to`), formatted with `DD / HH / mm / ss / SSS`
tokens. It supports pause/resume/reset (via `pause` or exposed methods), an `end`
event and a raw-data slot for custom renders.

## Basic

`:time="90"` starts automatically (default `auto-start`) and fires `@end` at zero.

<prose-show-case>
<dnax-demo-count-down demo="basic">



</dnax-demo-count-down>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const done = ref(false)
</script>

<template>
  <q-count-down :time="90" @end="done = true" />
  <p class="demo-p demo-meta">{{ done ? 'Done!' : 'Counting down…' }}</p>
</template>
```

</template>
</prose-show-case>

## Formats

`format` accepts `DD` (days), `HH` / `mm` / `ss` (zero-padded) or single letters,
plus `SSS` for milliseconds.

<prose-show-case>
<dnax-demo-count-down demo="formats">



</dnax-demo-count-down>

<template v-slot:code="">

```vue
<q-count-down :time="90061" format="DD:HH:mm:ss" />
<q-count-down :time="3661" format="mm:ss" color? class="sub" />
```

</template>
</prose-show-case>

## Target date

`:to` accepts a `Date`, a timestamp or an ISO string — the countdown runs until
that instant.

<prose-show-case>
<dnax-demo-count-down demo="target">



</dnax-demo-count-down>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const target = ref(Date.now() + 15 * 60 * 1000)
</script>

<template>
  <q-count-down :to="target" format="HH:mm:ss" />
  <!-- Counts down to a target date (Date, timestamp or ISO). -->
</template>
```

</template>
</prose-show-case>

## Custom render

The slot exposes `days / hours / minutes / seconds / ms / remaining / progress / running / formatted` — build your own layout, here a progress bar.

<prose-show-case>
<dnax-demo-count-down demo="slot">



</dnax-demo-count-down>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const done = ref(false)
</script>

<template>
  <q-count-down :time="30" class="block">
    <template #default="{ formatted, progress, remaining }">
      <div class="bar"><div class="bar__fill" :style="{ width: progress * 100 + '%' }" /></div>
      <span class="text">{{ formatted }} · {{ remaining }} ms left</span>
    </template>
  </q-count-down>
</template>
```

</template>
</prose-show-case>

## Controls

The instance exposes `start()`, `pause()`, `reset()`, `getRemaining()` and
`getProgress()` — plus the reactive `pause` prop.

<prose-show-case>
<dnax-demo-count-down demo="controls">



</dnax-demo-count-down>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const cd = ref(null)
const ended = ref(false)
</script>

<template>
  <q-count-down ref="cd" :time="10" format="ss" @end="ended = true" />
  <div class="row">
    <q-btn dense outline no-caps label="Pause" @click="cd?.pause()" />
    <q-btn dense outline no-caps label="Resume" @click="cd?.start()" />
    <q-btn dense outline no-caps label="Reset" @click="cd?.reset()" />
  </div>
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QCountDown">



</dnax-api>
