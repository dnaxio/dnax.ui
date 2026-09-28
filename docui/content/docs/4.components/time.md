---
title: Time
description: A time field bound with v-model — 12/24-hour, seconds, now button, keyboard entry.
navigation:
  icon: lucide:clock
seo:
  title: Time (QTime)
  description: QTime — a v-model time field with a popover of hours, minutes and seconds.
---

A time field with `v-model` holding a **`"HH:MM"`** string (or **`"HH:MM:SS"`** when
`with-seconds` is set). **`<q-time>`** always stores the time in 24-hour form; `format24h`
only changes how it is displayed and typed. Clicking the field opens a floating panel of
scrollable columns — hours, minutes and (optionally) seconds — anchored to the field.
Typing also works: `9:5`, `09:05`, `09h05` and `2:30 PM` are all accepted, and the value is
normalized and clamped when the field loses focus or you press Enter.

## Basic usage

`hour-step` and `minute-step` thin out the columns; the current value stays highlighted and
each column scrolls to it when the panel opens.

::prose-show-case
:dnax-demo-time{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const time = ref("09:30")
</script>

<template>
  <q-time v-model="time" label="Start time" hint="24-hour value, HH:MM" />
</template>
```
::

## 12-hour format & now button

With `:format24h="false"` the field shows `h:mm AM/PM`, the hour column lists 1–12 and an
**AM/PM** toggle appears in the panel footer. `now-btn` adds a **Now** shortcut that sets
the current time (snapped to the configured steps). Whatever the display, the value stays
24-hour.

::prose-show-case
:dnax-demo-time{demo="twelve-hour"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const time = ref("17:45")
</script>

<template>
  <q-time v-model="time" :format24h="false" label="Meeting" now-btn />
</template>
```
::

## Seconds

`with-seconds` adds a seconds column and serializes the value as `"HH:MM:SS"`. Seconds
follow `minute-step`.

::prose-show-case
:dnax-demo-time{demo="seconds"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const time = ref("08:15:40")
</script>

<template>
  <q-time v-model="time" with-seconds :minute-step="5" label="Lap time" />
</template>
```
::

## Disabled & readonly

`disable` greys the field out and blocks interaction; `readonly` keeps the field readable
but neither opens the panel nor allows editing.

::prose-show-case
:dnax-demo-time{demo="disabled"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const time = ref("12:00")
</script>

<template>
  <q-time v-model="time" label="Locked" disable />
  <q-time v-model="time" label="Read-only" readonly />
</template>
```
::

When the panel is open, the arrow keys are free for scrolling; when it is closed and the
field is focused, ↑/↓ move by `minute-step` (hold `Shift` for a whole hour).

## API

:dnax-api{name="QTime"}
