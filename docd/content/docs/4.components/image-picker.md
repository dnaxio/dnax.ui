---
title: Image Picker
description: An image selection field with a thumbnail grid, per-tile removal,
  size/count validation and hint/error slots.
navigation:
  icon: lucide:image-plus
seo:
  title: Image Picker (QImagePicker)
  description: QImagePicker — an image selection grid bound to a File or File[] v-model, with validation.
---

An image selection field. **`<q-image-picker>`** binds a `File` (single) or
`File[]` (`multiple`) via `v-model` and shows the selected images in a thumbnail
grid, each tile removable through a × button; an “Add” tile opens a hidden native
file input restricted to images (`accept` defaults to `image/*`). Validation covers
the accepted types (`accept`), the maximum size (`max-file-size`) and the maximum
count (`max-files`); rejections are reported through the `rejected` event and an
`error` / `hint` slot is rendered under the grid.

## Example

::prose-show-case
<div class="demo-col">
  <q-image-picker label="Photos" multiple hint="Up to 5 images" :max-files="5"></q-image-picker>
</div>

#code

```vue
<q-image-picker label="Photos" multiple hint="Up to 5 images" :max-files="5" />
```
::

## API

<dnax-api name="QImagePicker"></dnax-api>
