---
title: Numeric Keyboard
description: An on-screen numeric keypad — PIN codes, amounts and phone numbers, with
  length and decimal limits, progress dots, a shuffled layout, a clear key and a complete event.
navigation:
  icon: lucide:delete
seo:
  title: Numeric Keyboard (QNumericKeyboard)
  description: QNumericKeyboard — an on-screen keypad (v-model string) with max length, decimals, progress dots, a shuffled layout, a clear key and a complete event for PIN codes and amounts.
---

An on-screen numeric keypad. **`<q-numeric-keyboard>`** edits a **string** — which is what
keeps a code’s leading zeros (`0406`) intact and avoids float rounding on an amount — and
emits it on every key. The display is the application’s job, though the pad can draw its own
progress dots: a PIN field, `1 234,56 €`, a plain string…

```vue
<q-numeric-keyboard v-model="pin" :max-length="6" show-dots @complete="submit" />
<q-numeric-keyboard v-model="amount" mode="decimal" :max-decimals="2" clearable />
<q-numeric-keyboard v-model="code" random @complete="reshuffle" />
<q-numeric-keyboard v-model="pin" error :error-message="msg" />
```

## PIN code

`max-length` counts **digits** (the decimal separator is not one of them); when the value
reaches it, `@complete` fires once — the hook for “send the code as soon as the 6th digit is
typed”.

::prose-show-case
<dnax-demo-numeric-keyboard demo="pin"></dnax-demo-numeric-keyboard>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const pin = ref("")

const submit = (value: string) => {
  // valeur prête : 6 chiffres, zéros de tête compris
  check(value)
  pin.value = ""
}
</script>

<template>
  <q-numeric-keyboard v-model="pin" :max-length="6" show-dots @complete="submit" />
</template>
```
::

In `numeric` mode (the default) a lone `0` is **kept**: `0406` stays `0406`, which is what a
PIN or a phone number needs.

## Progress dots

`show-dots` draws a row of dots **above the keys**, and each dot that gets filled plays a
short “pop” (the animation is dropped under `prefers-reduced-motion`). The row is purely
visual: an `aria-live` region announces the count for screen readers.

The number of dots comes from, in order: **`dots`** (an explicit count), **`max-length`**, or —
when both are `0` — the number of digits entered, so the row simply grows: a masked field
with no fixed length. **`dots-size`** sets their size: a number of **pixels** or any CSS length
(`"1.2rem"`), and it wins over `dense`.

::prose-show-case
<dnax-demo-numeric-keyboard demo="dots"></dnax-demo-numeric-keyboard>

#code

```vue
<template>
  <!-- total imposed: 4 dots, independent of max-length -->
  <q-numeric-keyboard v-model="pin" show-dots :dots="4" />

  <!-- dot size: a number (px) or any CSS length -->
  <q-numeric-keyboard v-model="pin" show-dots :dots="4" :dots-size="18" />

  <!-- growing: one dot per typed digit (a masked field) -->
  <q-numeric-keyboard v-model="secret" show-dots />

  <!-- max-length drives the total (6 dots) -->
  <q-numeric-keyboard v-model="pin" show-dots :max-length="6" />
</template>
```
::

## Error state

`error` paints the dots **red** and shows `error-message` under the pad (`role="alert"`), for
wrong-code / rejected-input feedback. **Deleting everything clears it**: as soon as the value
comes back to empty the pad returns to its initial state, the message disappears and
`update:error` fires with `false` — so `v-model:error` keeps your own flag in sync, and you can
raise the error again on the next attempt. A new error also clears a previous reset.

::prose-show-case
<dnax-demo-numeric-keyboard demo="error"></dnax-demo-numeric-keyboard>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const pin = ref("")
const error = ref(false)
const errorMessage = ref("")

const submit = (value: string) => {
  const ok = value === "123456"
  error.value = !ok
  errorMessage.value = ok ? "" : "Wrong code. Try again."
}
</script>

<template>
  <q-numeric-keyboard
    v-model="pin"
    v-model:error="error"
    show-dots
    :max-length="6"
    :error-message="errorMessage"
    @complete="submit"
  />
</template>
```
::

`error` and `error-message` are independent: with no `error-message`, the dots simply turn red;
and a pad **without** `show-dots` still shows the message (there is just nothing red to paint).

## Random layout

`random` shuffles the **digits** — the editing keys (`separator`, `C`, `⌫`) never move, and
each key still inserts the digit it shows. Useful against shoulder-surfing and smudge
attacks, where the position of a finger would give the code away.

The shuffle is drawn **once on the client** (never during SSR, which would make the server and
the client disagree) and then stays **stable** for the whole entry — a pad that reshuffles on
every keypress would be impossible to use. Call the exposed `shuffle()` to draw a new one: on
`@complete`, on a “Shuffle” button, before each attempt…

::prose-show-case
<dnax-demo-numeric-keyboard demo="random"></dnax-demo-numeric-keyboard>

#code

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from "vue"

const pin = ref("")
const pad = useTemplateRef<{ shuffle: () => void }>("pad")

const submit = (value: string) => {
  check(value)
  pin.value = ""
  pad.value?.shuffle() // fresh layout for the next entry
}
</script>

<template>
  <q-numeric-keyboard ref="pad" v-model="pin" random :max-length="4" @complete="submit" />
</template>
```
::

## Amount

`mode="decimal"` adds the separator key, `max-decimals` bounds what follows it, and the
value stays a string until you decide to parse it.

::prose-show-case
<dnax-demo-numeric-keyboard demo="amount"></dnax-demo-numeric-keyboard>

#code

```vue
<script setup lang="ts">
import { computed, ref } from "vue"

const amount = ref("")
const display = computed(() => {
  const value = Number((amount.value || "0").replace(",", "."))
  return value.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
})
</script>

<template>
  <p>{{ display }}</p>
  <q-numeric-keyboard v-model="amount" mode="decimal" :max-decimals="2" :max-length="7" clearable />
</template>
```
::

In that mode a lone `0` is **replaced** by the next digit (calculator behaviour), the
separator is inserted at most once, and pressing it on an empty field gives `0,`. To go
further on amounts, hand the value to [`q-input-currency`](/docs/components/input-currency)
or parse it with the currency helpers.

## Layout, theme & states

::prose-show-case
<dnax-demo-numeric-keyboard demo="states"></dnax-demo-numeric-keyboard>

#code

```vue
<template>
  <q-numeric-keyboard v-model="code" :columns="4" clearable />
  <q-numeric-keyboard v-model="code" dense dark />
  <q-numeric-keyboard v-model="code" disable />
  <q-numeric-keyboard v-model="amount" mode="decimal" decimal-separator="." />
</template>
```
::

- **`columns`** reflows the grid (4 columns → three rows of four).
- **`dense`** shortens the keys, **`dark`** forces the dark surface (otherwise the document
  theme applies), **`disable`** greys the whole pad.
- **`clearable`** adds a `C` key when a cell is free — in `numeric` mode. In `decimal` mode
  the separator occupies that cell: call `clear()` (exposed) or wire a button next to your
  display.
- **`decimal-separator`** is what the key shows and what gets inserted (`,` by default).
- **`show-dots`** / **`dots`** / **`dots-size`** add the progress row and set the dot size;
  **`random`** shuffles the digits; **`error`** / **`error-message`** paint the dots red and
  show a message (cleared as soon as everything is deleted).

## Recipes

**Physical keyboard.** The pad is a control, not a listener: bind the app’s own numbers to
the exposed `press()` and everything stays in sync.

```vue
<q-numeric-keyboard ref="pad" v-model="pin" :max-length="6" />
```

<script setup lang="ts">
const onKeydown = (e: KeyboardEvent) => {
  if (/^[0-9]$/.test(e.key)) pad.value.press(e.key)
  else if (e.key === "Backspace") pad.value.backspace()
  else if (e.key === "Escape") pad.value.clear()
}
onMounted(() => window.addEventListener("keydown", onKeydown))
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown))
</script>
```

**Fresh layout per attempt.** With `random`, reshuffle wherever a new entry starts — after a
successful code, when a PIN prompt reopens, or from a button. The pad keeps its layout until
you ask, so a code in progress is never scrambled.

```vue
const submit = (value: string) => {
  verify(value).finally(() => {
    pin.value = ""
    pad.value?.shuffle()
  })
}
```

**Accessibility.** The pad is a `role="group"` with a `label`; the non-digit keys carry an
`aria-label` (“Effacer le dernier chiffre”, “Tout effacer”), the keys are real buttons with a
visible focus ring, and the keypad itself is a touch target (`touch-action: manipulation`).
With `show-dots`, the dots are decorative (`aria-hidden`) and an `aria-live` region announces
“3 sur 6” as the value grows.

## API

<dnax-api name="QNumericKeyboard"></dnax-api>
