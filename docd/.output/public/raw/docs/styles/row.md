# Row

> A semantic alias of QGrid — the same 12-column system, reading better when the container is a row in your mental model.

A semantic alias of **<q-grid>** — same props, same 12-column system, reads
better in markup: **<q-row>** wraps **<q-col>** cells. Perfect when the
container is a row in your mental model; use `q-grid` when it's a generic grid area.

## Basic

Identical usage to `q-grid`: `cols` (12 by default), `gap` and `q-col` children.

<prose-show-case>
<dnax-demo-row demo="basic">



</dnax-demo-row>

<template v-slot:code="">

```vue
<q-row gap="12px">
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
</q-row>
```

</template>
</prose-show-case>

## Row & column gaps

`gap` sets both directions; `row-gap` and `column-gap` override each axis
independently.

<prose-show-case>
<dnax-demo-row demo="gap">



</dnax-demo-row>

<template v-slot:code="">

```vue
<q-row gap="8px" column-gap="28px">
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
</q-row>
```

</template>
</prose-show-case>

## Responsive columns

Each `q-col` takes its own `span` at every breakpoint: `span` (mobile base),
`span-sm / -md / -lg / -xl` override it when the viewport reaches the breakpoint
(600 / 1024 / 1440 / 1920px) — pure CSS, no JS. The grid stays on 12 columns;
`cols-*` on the row changes the total instead.

<prose-show-case>
<dnax-demo-row demo="responsive">



</dnax-demo-row>

<template v-slot:code="">

```vue
<q-row gap="12px">
  <q-col :span="12" :span-md="6" :span-lg="3"><div class="cell">12 · 6 · 3</div></q-col>
  <q-col :span="12" :span-md="6" :span-lg="3"><div class="cell">12 · 6 · 3</div></q-col>
  <q-col :span="12" :span-md="6" :span-lg="3"><div class="cell">12 · 6 · 3</div></q-col>
  <q-col :span="12" :span-md="6" :span-lg="3"><div class="cell">12 · 6 · 3</div></q-col>
</q-row>
<!-- mobile : 1 par ligne (12/12) · md (≥1024) : 2 par ligne (6/12) · lg (≥1440) : 4 par ligne (3/12) -->
```

</template>
</prose-show-case>

Spans can differ per column — here a mixed layout at each breakpoint:

<prose-show-case>
<dnax-demo-row demo="responsiveMixed">



</dnax-demo-row>

<template v-slot:code="">

```vue
<q-row gap="12px">
  <q-col :span="12" :span-md="6" :span-lg="3"><div class="cell">12·6·3</div></q-col>
  <q-col :span="12" :span-md="6" :span-lg="3"><div class="cell">12·6·3</div></q-col>
  <q-col :span="12" :span-md="4" :span-lg="6"><div class="cell">12·4·6</div></q-col>
  <q-col :span="12" :span-md="4" :span-lg="6"><div class="cell">12·4·6</div></q-col>
  <q-col :span="12" :span-md="4" :span-lg="12"><div class="cell">12·4·12</div></q-col>
</q-row>
<!-- md : 6+6 sur une ligne puis 4+4+4 → 2 lignes · lg : 3+3, 6+6, 12 → 3 lignes -->
```

</template>
</prose-show-case>

## Vertical alignment

`align` (start, center, end, stretch) aligns every cell in the row; a cell can
override with `align-self`.

<prose-show-case>
<dnax-demo-row demo="align">



</dnax-demo-row>

<template v-slot:code="">

```vue
<q-row gap="12px" align="center" style="height: 140px">
  <q-col :span="4"><div class="cell">center</div></q-col>
  <q-col :span="4" align-self="end"><div class="cell">end (per cell)</div></q-col>
</q-row>
```

</template>
</prose-show-case>

## API

QRow is a thin wrapper around QGrid — the API below is the same as
[QGrid](/docs/styles/grid).

<dnax-api name="QRow">



</dnax-api>
