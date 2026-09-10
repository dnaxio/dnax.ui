# Tiptap

> A full-featured rich text editor (Tiptap v3) with a built-in toolbar, bubble menu, drag handle, table of contents and mentions.

A full-featured rich text editor powered by **Tiptap v3** (ProseMirror).
**<q-tiptap>** is a `v-model` component that reads and writes **HTML**. It ships
with everything built-in: a complete toolbar (undo/redo, headings, alignment,
marks, text color, links, bullet / ordered / task lists, blockquote, code blocks,
images), a contextual **bubble menu** on text selection, a **drag handle** to
re-order blocks, and `@mentions` when a list is provided. Styled with the design
tokens in light & dark; SSR-safe (the ProseMirror editor is only created
client-side).

## v-model & content

Bind an HTML string with `v-model`. The editor emits `@update:model-value` on
every change and only rewrites the document when the external value really differs
— no cursor jump, no feedback loop. The value is plain, renderable HTML
(`v-html` safe to display anywhere), ready to store in a database.

<prose-show-case>
<dnax-demo-tiptap demo="model">



</dnax-demo-tiptap>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const html = ref("<p>Hello <strong>Tiptap</strong> — this editor is bound with <em>v-model</em>.</p>")

const mentions = [
  { label: "Ada Lovelace", value: "ada" },
  { label: "Grace Hopper", value: "grace" },
  { label: "Alan Turing", value: "alan" },
]
</script>

<template>
  <q-tiptap v-model="html" :mentions="mentions" />
</template>
```

</template>
</prose-show-case>

On the server (SSR/SSG) or before hydration, the area renders empty — the editor
boots on the client (`onMounted`). `disable` / `readonly` set the document to
read-only and disable the toolbar, bubble menu and drag handle.

## Toolbar

The built-in toolbar (prop `toolbar`, default `true`) covers the everyday
formatting needs, grouped:

- **History** — undo / redo.
- **Blocks** — paragraph, headings H1-H3, alignment left / center / right.
- **Marks** — font size, bold, italic, underline, strike, inline code, link /
remove link, text color (palette), remove color.
- **Blocks & insert** — bullet list, ordered list, task list (with `q-checkbox`),
blockquote, code block, image (URL), horizontal rule.
- **Clear** — remove all formatting from the selection.

Images and links are entered through a proper `q-dialog` with `q-input` fields
(never `window.prompt`); the text color picker opens a small palette with presets,
a **"No color"** swatch to remove the color, and a custom color input.

## Bubble menu & drag handle

No extra code needed:

- **Bubble menu** — select text: a floating bar appears with bold, italic,
underline, strike, inline code, link (dialog), remove color and clear
formatting. Clicks never lose the selection.
- **Drag handle** — hover the **left edge** of any block: a grip appears. Drag to
move paragraphs, headings, list items, images… even nested items (lists,
checklists).

Try it below: hover the left edge of the heading or a list item to drag it, select
the centered paragraph to trigger the bubble menu, check a task box:

<prose-show-case>
<dnax-demo-tiptap demo="context">



</dnax-demo-tiptap>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const richHtml = ref("<h1>…</h1><ul>…</ul>")
</script>

<template>
  <q-tiptap v-model="richHtml" :mentions="mentions" />
</template>
```

</template>
</prose-show-case>

## Table of contents

`<q-tiptap>` tracks every heading and re-emits the list on each change through
`@update:toc` — each item carries `id`, `textContent`, `level`, `originalLevel`,
`itemIndex`, `pos`, `isActive` and `isScrolledOver`. Render the list however you
want (below: live, level-indented, click to scroll):

<prose-show-case>
<dnax-demo-tiptap demo="toc">



</dnax-demo-tiptap>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const toc = ref([])
const tocEditor = ref(null)
const tocHtml = ref("<h1>Intro</h1><p>…</p><h2>Getting started</h2>…")

const onToc = (items) => {
  toc.value = items
}

const scrollTo = (id) => {
  tocEditor.value?.scrollToHeading(id) // scroll interne à l'éditeur
}
</script>

<template>
  <q-tiptap ref="tocEditor" v-model="tocHtml" @update:toc="onToc" />
</template>
```

</template>
</prose-show-case>

## Mentions

Pass a list of `{ label, value }` items with the `mentions` prop — typing `@`
opens a popup anchored at the caret, filtered live on `label` or `value`.
Navigate with `↑`/`↓`, confirm with `Enter`/`Tab`, or click. When the prop is empty
the feature is inactive.

<prose-show-case>
<dnax-demo-tiptap demo="mentions">



</dnax-demo-tiptap>

<template v-slot:code="">

```vue
<script setup lang="ts">
const people = [
  { label: "Ada Lovelace", value: "ada" },
  { label: "Grace Hopper", value: "grace" },
  { label: "Alan Turing", value: "alan" },
]
</script>

<template>
  <q-tiptap v-model="mentionHtml" :mentions="people" />
</template>
```

</template>
</prose-show-case>

The mention is stored as a node with `data-id` / `data-label`, so the HTML
round-trips losslessly:

```html
<span data-type="mention" data-id="ada" data-label="Ada Lovelace">@Ada Lovelace</span>
```

## Variants & states

`min-height` sizes the editing area, `placeholder` shows while the document is
empty, `filled` switches to the soft background variant and `dense` tightens the
toolbar. `padding` (CSS value, default `5%` on all four sides) controls the
padding of the writing area, and everything is tunable per editor.

<prose-show-case>
<dnax-demo-tiptap demo="variants">



</dnax-demo-tiptap>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const html = ref("<p>Hello <strong>Tiptap</strong></p>")
const emptyHtml = ref("")
</script>

<template>
  <q-tiptap v-model="html" min-height="140px" placeholder="Write something…" />

  <q-tiptap v-model="html" filled dense min-height="120px" />

  <q-tiptap v-model="emptyHtml" min-height="140px" placeholder="Type to reveal the placeholder…" />
</template>
```

</template>
</prose-show-case>

### Read-only & disabled

`readonly` keeps the text visible (selection / copy allowed) but disables editing,
the toolbar, bubble menu and drag handle; `disable` additionally greys everything
out and blocks pointer events.

<prose-show-case>
<dnax-demo-tiptap demo="readonly">



</dnax-demo-tiptap>

<template v-slot:code="">

```vue
<q-tiptap
  :model-value="readonlyHtml"
  readonly
  min-height="120px"
/>
```

</template>
</prose-show-case>

### Padding

`padding` accepts any CSS padding for the writing area. The default is `5%` on all
four sides (top, right, bottom, left). Compare the default (top) with a custom
padding (bottom, `18px 22px 6%`):

<prose-show-case>
<dnax-demo-tiptap demo="padding">



</dnax-demo-tiptap>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const paddingHtml = ref("<p>Same content, two paddings.</p>")
</script>

<template>
  <q-tiptap v-model="paddingHtml" />

  <q-tiptap v-model="paddingHtml" padding="18px 22px 6%" />
</template>
```

</template>
</prose-show-case>

### Square, no toolbar & disabled

`square` removes the corner radius, `toolbar="false"` hides the toolbar (content
only), and `disable` greys the whole editor out and blocks pointer events:

<prose-show-case>
<dnax-demo-tiptap demo="states">



</dnax-demo-tiptap>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const stateHtml = ref("<p>An editable <strong>square</strong> editor and a disabled one.</p>")
</script>

<template>
  <q-tiptap v-model="stateHtml" square />

  <q-tiptap v-model="stateHtml" square toolbar disable min-height="140px" />
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QTiptap">



</dnax-api>
