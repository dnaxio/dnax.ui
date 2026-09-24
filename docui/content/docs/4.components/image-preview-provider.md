---
title: Image Preview Provider
description: Renders the stack of programmatic fullscreen image viewers opened
  through the $q.imagePreview plugin.
navigation:
  icon: lucide:images
seo:
  title: Image Preview Provider (QImagePreviewProvider)
  description: QImagePreviewProvider — renders the viewer stack opened via the $q.imagePreview plugin.
---

The renderer of programmatic image viewers. **`<q-image-preview-provider>`** keeps
the stack of viewers opened with `$q.imagePreview.open()` and renders one
`<q-image-preview>` per entry, forwarding the opening options; when a viewer closes
its entry is removed from the stack and its `onDismiss` callback fires. The
provider is already included in `QConfigProvider` (rendered automatically by the
outermost one), so it is only needed standalone when an app does not use
`QConfigProvider`. It exposes a default slot, so it can wrap the app content.

## Example

::prose-show-case
<q-image-preview-provider>
  <p class="demo-p">App content — call <code>$q.imagePreview.open()</code> to display a viewer.</p>
</q-image-preview-provider>

#code

```vue
<q-image-preview-provider>
  <p>App content</p>
</q-image-preview-provider>
```
::

## API

<dnax-api name="QImagePreviewProvider"></dnax-api>
