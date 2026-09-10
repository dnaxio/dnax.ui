# Image Preview Provider

> Renders the stack of programmatic fullscreen image viewers opened through the $q.imagePreview plugin.

The renderer of programmatic image viewers. **<q-image-preview-provider>** keeps
the stack of viewers opened with `$q.imagePreview.open()` and renders one
`<q-image-preview>` per entry, forwarding the opening options; when a viewer closes
its entry is removed from the stack and its `onDismiss` callback fires. The
provider is already included in `QConfigProvider` (rendered automatically by the
outermost one), so it is only needed standalone when an app does not use
`QConfigProvider`. It exposes a default slot, so it can wrap the app content.

## Example

<prose-show-case>
<q-image-preview-provider>

App content — call `$q.imagePreview.open()` to display a viewer.

</q-image-preview-provider>

<template v-slot:code="">

```vue
<q-image-preview-provider>
  <p>App content</p>
</q-image-preview-provider>
```

</template>
</prose-show-case>

## API

<dnax-api name="QImagePreviewProvider">



</dnax-api>
