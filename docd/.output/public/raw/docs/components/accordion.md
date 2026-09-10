# Accordion

> Collapsible sections — a container, items, triggers and animated content, with one or several sections open at once.

A list of collapsible sections — one or several open at once. The family has four
components: **<q-accordion>** (the container), **<q-accordion-item>** (a
section), **<q-accordion-trigger>** (the toggle button) and
**<q-accordion-content>** (the animated content).

## QAccordion — container

The container drives its state through `v-model`: a string in `single` mode, an
array in `multiple` mode.

<prose-show-case>
<dnax-demo-accordion demo="single">



</dnax-demo-accordion>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const open = ref("intro")
</script>

<template>
  <q-accordion v-model="open" type="single" collapsible class="demo-acc">
    <q-accordion-item value="intro">
      <q-accordion-trigger>Introduction</q-accordion-trigger>
      <q-accordion-content>
        <p>Le contenu de la section, repliable avec animation.</p>
      </q-accordion-content>
    </q-accordion-item>
  </q-accordion>
</template>
```

</template>
</prose-show-case>

### Multiple

<prose-show-case>
<dnax-demo-accordion demo="multiple">



</dnax-demo-accordion>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openMultiple = ref(["a"])
</script>

<template>
  <q-accordion v-model="openMultiple" type="multiple">
    <q-accordion-item value="a">…</q-accordion-item>
    <q-accordion-item value="b">…</q-accordion-item>
  </q-accordion>
</template>
```

</template>
</prose-show-case>

### API

<dnax-api name="QAccordion">



</dnax-api>

## QAccordionItem — a section

Provides the `value` (compared with the container's `v-model`) and a unique id
to its children (for `aria-controls`).

```html
<q-accordion-item value="intro">
  <q-accordion-trigger>Introduction</q-accordion-trigger>
  <q-accordion-content>Contenu…</q-accordion-content>
</q-accordion-item>
```

### API

<dnax-api name="QAccordionItem">



</dnax-api>

## QAccordionTrigger — the button

The toggle button: a label or a custom slot, a configurable chevron
(`expand-icon`), and a managed `aria-expanded` state.

```html
<q-accordion-trigger label="Introduction" expand-icon="lucide:chevrons-down" />
<!-- ou avec un slot custom -->
<q-accordion-trigger>
  <q-icon name="lucide:sparkles" color="primary" />
  <span>Introduction</span>
</q-accordion-trigger>
```

### API

<dnax-api name="QAccordionTrigger">



</dnax-api>

## QAccordionContent — the animated content

The content always stays mounted in the DOM — the open/close animation is done
in CSS (`grid-template-rows: 0fr → 1fr`).

```html
<q-accordion-content>
  <p>Le contenu reste monté (caché par CSS grid 0fr → 1fr).</p>
</q-accordion-content>
```

### API

<dnax-api name="QAccordionContent">



</dnax-api>
