---
title: Input Currency
description: A currency field — the amount is formatted as you type (grouping, locale
  decimals and symbol) while the v-model stays a plain number.
navigation:
  icon: lucide:circle-dollar-sign
seo:
  title: Input Currency (QInputCurrency)
  description: QInputCurrency — a formatted amount field (grouping, locale decimals, currency symbol, min/max, arrow-key stepping) whose v-model is a number.
---

A currency field. **`<q-input-currency>`** formats the amount as you type — grouping, the
locale's decimal separator and the currency symbol — and its `v-model` is a **number**
(`number | null`), never the displayed string. The value is never “raw text”: the field
cannot hold letters, and a second decimal separator is ignored.

The symbol is a **decoration**: its place and spacing come from `Intl`, so it renders
`1 234,56 €` in `fr-FR` and `$1,234.56` in `en-US` without a line of configuration. The
locale defaults to the app language (`QConfigProvider`'s `lang`: `fr` → `fr-FR`,
`en` → `en-US`), the currency to `EUR`, and the number of decimals to the currency's own
(2 for `EUR`, 0 for `JPY`).

## Basic

::prose-show-case
<dnax-demo-input-currency demo="basic"></dnax-demo-input-currency>

#code

```vue
<script setup lang="ts">
import { computed, ref } from "vue"

const price = ref<number | null>(1234.56)
const tax = ref<number | null>(null)
const total = computed(() => (price.value ?? 0) * 1.2)
</script>

<template>
  <q-input-currency v-model="price" label="Unit price" clearable outlined />
  <q-input-currency v-model="tax" label="VAT (optional)" placeholder="Empty means 0" outlined dense />

  <p>price = {{ price }} · vat = {{ tax }} · total = {{ total.toFixed(2) }}</p>
</template>
```
::

An empty field emits `null` — `0` is a real amount, `null` is “nothing typed”.

## Currency & locale

`currency` is an ISO 4217 code and `locale` a BCP-47 tag: both feed `Intl`, so the symbol,
its side and its spacing follow the conventions of the market.

::prose-show-case
<dnax-demo-input-currency demo="currencies"></dnax-demo-input-currency>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const currency = ref("EUR")
const locale = ref("fr-FR")
const amount = ref<number | null>(9999.5)
</script>

<template>
  <q-input-currency v-model="amount" :currency="currency" :locale="locale" label="Amount" outlined />
</template>
```
::

| | `fr-FR` + `EUR` | `en-US` + `USD` | `fr-FR` + `JPY` |
| --- | --- | --- | --- |
| display | `1 234,56 €` | `$1,234.56` | `1 235` |
| decimal | `,` | `.` | — |
| decimals | 2 | 2 | 0 |

`decimals` overrides the currency's count, `currency-display` switches the decoration to
the ISO code (`EUR`) or the localized name, and `currency=""` renders a bare number (for a
field whose unit is given elsewhere).

## Limits, rounding & keyboard

`min` / `max` and the currency rounding are applied when the field is left — typing is never
interrupted, so `5000` in a field bounded to `1000` is only corrected on blur. `↑` / `↓`
step by `step` (`Shift` steps by ten times as much).

::prose-show-case
<dnax-demo-input-currency demo="limits"></dnax-demo-input-currency>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const budget = ref<number | null>(150)
const refund = ref<number | null>(null)
</script>

<template>
  <q-input-currency v-model="budget" label="Budget (0 – 1000 €)" :min="0" :max="1000" :step="10" outlined />

  <!-- avoirs, corrections : montants négatifs autorisés, 3 décimales -->
  <q-input-currency v-model="refund" label="Refund" allow-negative :decimals="3" outlined />
</template>
```
::

Rounding goes through the decimal exponent (`1.005 → 1.01`), not `value * 100`, so the
half-cent cases land where you expect them.

## Forms & states

`name` adds a hidden input carrying the raw number: a plain form submits a value a backend
can parse, while the visible field keeps its formatted rendering.

::prose-show-case
<dnax-demo-input-currency demo="form"></dnax-demo-input-currency>

#code

```vue
<template>
  <form @submit.prevent>
    <q-input-currency v-model="amount" name="amount" label="Amount due" outlined />
    <q-btn type="submit" label="Send" />
  </form>
</template>
```
::

`readonly` and `disable` behave like the other fields, and `error` / `error-message` (or
the `#error` slot) report a validation failure decided by the app — the field itself only
checks types, decimals and bounds.

## Recipes

**Editing an existing amount.** Give the model a number (`amount.value = row.price`) — the
field formats it and keeps it as-is until the user edits it.

**Reading the final value.** `v-model` emits on every keystroke (partial values included),
`@blur` fires once the rounding and the bounds are applied:

```ts
const onBlur = () => console.log(amount.value) // 1000 — clamped, rounded, or null
```

**Amounts in a calculation.** The model is a number: no parsing, no `replace(",", ".")`.

```ts
const total = computed(() => (price.value ?? 0) * quantity.value + (shipping.value ?? 0))
```

**What the field refuses.** Letters, currency symbols typed by hand, a second decimal
separator and digits beyond `decimals` are dropped as they are typed — the model can never
receive a malformed amount.

## API

<dnax-api name="QInputCurrency"></dnax-api>
