---
title: Editor.js
description: A block editor built on Editor.js, storing documents as JSON
  blocks.
navigation:
  icon: lucide:square-pen
seo:
  title: Editor.js (QEditorJs)
  description: QEditorJs — a block editor based on Editor.js, with JSON document data.
---

A block editor built on [Editor.js](https://editorjs.io). **`<q-editor-js>`** holds a
JSON document — `{ time?, blocks: [{ type, data }], version? }` — in its `data` prop
and emits changes through `update:model-value`. It ships with paragraph, header
(H1–H3), list, checklist, quote, code and delimiter blocks, and is SSR-safe (the
Editor.js instance is only created on mount).

## Example

::prose-show-case
<div class="demo-col">
  <q-editor-js placeholder="Tell your story…" min-height="280px"></q-editor-js>
</div>

#code

```vue
<q-editor-js placeholder="Tell your story…" min-height="280px" />
```
::

Real props include `data`, `placeholder`, `min-height`, `readonly` / `disable` and
`tools` (extra blocks merged over the defaults). The component emits `ready` and
exposes `save()`, `clear()` and `getEditor()`.

## API

<dnax-api name="QEditorJs"></dnax-api>
