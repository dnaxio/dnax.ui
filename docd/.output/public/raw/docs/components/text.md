# Text

> A paragraph element with multi-line truncation and animated transitions — generate, highlight and breathing effects.

A paragraph element with built-in **multi-line truncation** and **animated
transitions**: set `lines` to clamp the text to that many lines with an ellipsis
(full content on hover via `title`), pass `transition` (fade, zoom, slide…) to
animate the text each time it changes, `breathing` for a soft word-by-word pulse,
`generate` to reveal it word by word, or `highlight` to draw a marker over a
substring. For captions overlaid on images, see
[QTextCaption](/docs/components/text-caption).

## Basic

Pass the text through the `text` prop, or use the default slot for rich content.

<prose-show-case>
<dnax-demo-text demo="basic">



</dnax-demo-text>

<template v-slot:code="">

```vue
<q-text text="The quick brown fox jumps over the lazy dog." />

<!-- Le slot remplace la prop text (tout contenu) -->
<q-text>
  Slots accept <b>rich content</b> — <em>markup</em>, components, anything.
</q-text>
```

</template>
</prose-show-case>

## Line clamping

`lines` truncates to 1, 2, 3… lines with an ellipsis. Hover a truncated
paragraph: the `title` attribute reveals the full text.

<prose-show-case>
<dnax-demo-text demo="lines">



</dnax-demo-text>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const LONG = "The quick brown fox jumps over the lazy dog and keeps running through the fields, past the river and into the woods where the tall pines sway in the evening breeze."
</script>

<template>
  <div class="col">
    <q-text :lines="1" :text="LONG" />
    <q-text :lines="2" :text="LONG" />
    <q-text :lines="3" :text="LONG" />
  </div>
  <!-- Hover a truncated line: the full text appears in the tooltip (title). -->
</template>
```

</template>
</prose-show-case>

## Element tag

`tag` changes the rendered element (default `p`) — useful for headings or inline
text.

<prose-show-case>
<dnax-demo-text demo="tag">



</dnax-demo-text>

<template v-slot:code="">

```vue
<q-text tag="h3" text="Rendered as an h3" />
<q-text tag="span" text="Inline span element" />
<q-text tag="p" text="Default paragraph tag" />
```

</template>
</prose-show-case>

## Transitions

`transition` replays an animation whenever the `text` prop changes: `fade`,
directional fades, `zoom`, `blur` or `slide-*` — tune the speed with
`transition-duration`. Animations respect `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-text demo="transitions">



</dnax-demo-text>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const effect = ref("fade")
const effects = [
  { label: "Fade", value: "fade" },
  { label: "Fade up", value: "fade-up" },
  { label: "Fade down", value: "fade-down" },
  { label: "Fade left", value: "fade-left" },
  { label: "Fade right", value: "fade-right" },
  { label: "Zoom", value: "zoom" },
  { label: "Blur", value: "blur" },
  { label: "Slide up", value: "slide-up" },
  { label: "Slide down", value: "slide-down" },
  { label: "Slide left", value: "slide-left" },
  { label: "Slide right", value: "slide-right" },
]
const phrases = ["Hello, world!", "Build amazing UIs.", "Transitions make text alive.", "Stay curious ✨"]
const i = ref(0)
const phrase = ref(phrases[0])
const next = () => {
  i.value = (i.value + 1) % phrases.length
  phrase.value = phrases[i.value]
}
</script>

<template>
  <q-select
    v-model="effect"
    :options="effects"
    emit-value
    option-label="label"
    option-value="value"
    outlined
    dense
    label="Effect"
  />
  <q-btn flat no-caps icon="refresh-cw" label="Change text" @click="next()" />

  <q-text :text="phrase" :transition="effect" :transition-duration="400" tag="h3" />
</template>
```

</template>
</prose-show-case>

## Generate

`generate` reveals the words one by one — blur + fade + a slight rise — like text
being generated live (Inspira text-generate style). Replays when `text` changes;
respects `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-text demo="generate">



</dnax-demo-text>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const LONG = "The quick brown fox jumps over the lazy dog and keeps running through the fields, past the river and into the woods where the tall pines sway in the evening breeze."
</script>

<template>
  <q-text :text="LONG" generate />
  <!-- Chaque mot se révèle en séquence : blur + fondu + translation, une seule fois. -->
</template>
```

</template>
</prose-show-case>

## Highlight

`highlight` marks a substring of `text` with a marker that draws itself from left
to right (Inspira highlight-text style). Tune the color with the
`--q-highlight-color` CSS variable; respects `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-text demo="highlight">



</dnax-demo-text>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const LONG = "The quick brown fox jumps over the lazy dog and keeps running through the fields, past the river and into the woods where the tall pines sway in the evening breeze."
</script>

<template>
  <q-text :text="LONG" highlight="fox" />
  <!-- Le marqueur se dessine de gauche à droite — couleur via --q-highlight-color. -->
</template>
```

</template>
</prose-show-case>

## Breathing

`breathing` makes each word fade out and back in a gentle, continuous loop with
a cascade delay — the Inspira breathing-text look. Tune the cycle with the
`--q-breathe-duration` CSS variable; respects `prefers-reduced-motion`.

<prose-show-case>
<dnax-demo-text demo="breathing">



</dnax-demo-text>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const LONG = "The quick brown fox jumps over the lazy dog and keeps running through the fields, past the river and into the woods where the tall pines sway in the evening breeze."
</script>

<template>
  <q-text :text="LONG" breathing />
  <!-- Chaque mot s'estompe en cascade, en boucle — durée via --q-breathe-duration. -->
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QText">



</dnax-api>
