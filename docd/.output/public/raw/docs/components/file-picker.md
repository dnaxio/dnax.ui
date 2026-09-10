# File Picker

> A file selection field with image thumbnails, typed file icons, size/count validation and hint/error slots.

A file selection field. **<q-file-picker>** binds a `File` (single) or `File[]`
(`multiple`) via `v-model`, opens a hidden native file input from an “Add” button,
and lists each selection with an image thumbnail for pictures or a typed icon
(video, audio, archive, spreadsheet, code…) with the file name and a formatted
size otherwise. Validation covers the accepted types (`accept`, following the
native file input rules: `image/*`, `.pdf`, a MIME type, or a comma-separated
list), the maximum size (`max-file-size`) and the maximum count (`max-files`); the
component reports rejections through the `rejected` event and renders an `error` /
`hint` slot.

## Example

<prose-show-case>
<div className="demo-col">
<q-file-picker label="Attachments" multiple="true" accept="image/*" hint="Images only">



</q-file-picker>
</div>

<template v-slot:code="">

```vue
<q-file-picker label="Attachments" multiple accept="image/*" hint="Images only" />
```

</template>
</prose-show-case>

## API

<dnax-api name="QFilePicker">



</dnax-api>
