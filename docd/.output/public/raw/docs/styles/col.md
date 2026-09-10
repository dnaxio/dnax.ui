# Col

> The grid cell — span and offset, each with responsive variants, inside a QGrid or QRow.

The grid cell. **<q-col>** lives inside **<q-grid>** (or **<q-row>**) and
takes `span` columns out of the total (12 by default), with an optional `offset`.
Every span/offset has a responsive variant — `-sm / -md / -lg / -xl` — applied at
each breakpoint.

## Spans

`span` is a number of columns (1–12). Spans that add up to 12 fill a row; a cell
without `span` defaults to `auto` (shares the free space).

<prose-show-case>
<dnax-demo-col demo="span">



</dnax-demo-col>

<template v-slot:code="">

```vue
<q-grid :cols="12" gap="12px">
  <q-col :span="12"><div class="cell">12</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="6"><div class="cell">6</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
  <q-col :span="3"><div class="cell">3</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
  <q-col :span="2"><div class="cell">2</div></q-col>
</q-grid>
```

</template>
</prose-show-case>

### Auto

Without `span`, the cell sizes to its content and the remaining space is split
equally among `auto` cells.

<prose-show-case>
<dnax-demo-col demo="auto">



</dnax-demo-col>

<template v-slot:code="">

```vue
<q-grid :cols="12" gap="12px">
  <q-col><div class="cell">auto</div></q-col>
  <q-col><div class="cell">auto</div></q-col>
  <q-col :span="8"><div class="cell">span 8</div></q-col>
</q-grid>
```

</template>
</prose-show-case>

## Offset

`offset` shifts the cell to the right by a number of columns — handy to center a
block or leave an empty gutter.

<prose-show-case>
<dnax-demo-col demo="offset">



</dnax-demo-col>

<template v-slot:code="">

```vue
<q-grid :cols="12" gap="12px">
  <q-col :span="6" :offset="3"><div class="cell">span 6, offset 3</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="4"><div class="cell">4</div></q-col>
  <q-col :span="2" :offset="2"><div class="cell">2, offset 2</div></q-col>
</q-grid>
```

</template>
</prose-show-case>

## Responsive spans

Mobile-first: the base `span` applies on small screens, and `span-md` / `span-lg`
(etc.) override at each breakpoint. Offsets follow the same pattern (`offset-md`,
`offset-lg`…). Resize the window to see the layout adapt.

<prose-show-case>
<dnax-demo-col demo="responsive">



</dnax-demo-col>

<template v-slot:code="">

```vue
<q-grid :cols="12" gap="12px">
  <!-- mobile : empilé (12) ; md : 8 + 4 ; lg : 6 + 6 -->
  <q-col :span="12" :span-md="8" :span-lg="6"><div class="cell">Main</div></q-col>
  <q-col :span="12" :span-md="4" :span-lg="6"><div class="cell">Side</div></q-col>

  <!-- 6 cartes : 2 par ligne mobile, 3 à md, 6 à lg -->
  <q-col v-for="i in 6" :key="i" :span="6" :span-md="4" :span-lg="2">
    <div class="cell">Card {{ i }}</div>
  </q-col>
</q-grid>
```

</template>
</prose-show-case>

## Align self

`align-self` overrides the row's vertical `align` for a single cell (`start`,
`center`, `end`, `stretch`).

<prose-show-case>
<dnax-demo-col demo="alignSelf">



</dnax-demo-col>

<template v-slot:code="">

```vue
<q-grid :cols="12" gap="12px" align="center" style="height: 140px">
  <q-col :span="4"><div class="cell">default (center)</div></q-col>
  <q-col :span="4" align-self="start"><div class="cell">start</div></q-col>
  <q-col :span="4" align-self="end"><div class="cell">end</div></q-col>
</q-grid>
```

</template>
</prose-show-case>

## API

<dnax-api name="QCol">



</dnax-api>
