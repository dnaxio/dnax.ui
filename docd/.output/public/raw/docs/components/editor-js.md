# Editor.js

> A block editor built on Editor.js, storing documents as JSON blocks.

A block editor built on [Editor.js](https://editorjs.io). **<q-editor-js>** holds a
JSON document — `{ time?, blocks: [{ type, data }], version? }` — in its `data` prop
and emits changes through `update:model-value`. It ships with paragraph, header
(H1–H3), list, checklist, quote, code and delimiter blocks, and is SSR-safe (the
Editor.js instance is only created on mount).

## Example

<prose-show-case>
<div className="demo-col">
<q-editor-js placeholder="Tell your story…" min-height="280px">



</q-editor-js>
</div>

<template v-slot:code="">

```vue
<q-editor-js placeholder="Tell your story…" min-height="280px" />
```

</template>
</prose-show-case>

Real props include `data`, `placeholder`, `min-height`, `readonly` / `disable` and
`tools` (extra blocks merged over the defaults). The component emits `ready` and
exposes `save()`, `clear()` and `getEditor()`.

## API

<dnax-api name="QEditorJs">



</dnax-api>
