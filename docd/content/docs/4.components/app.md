---
title: App
description: The root layout wrapper — a `.q-app` container that scopes pages,
  fixed bars and their offsets.
navigation:
  icon: lucide:app-window
seo:
  title: App (QApp)
  description: QApp — the root layout wrapper that scopes pages and fixed bars.
---

The root wrapper of a Dnax UI page. **`<q-app>`** renders a `.q-app` container:
the pages, the fixed bars (`q-header`, `q-footer`, `q-back-header`…) and the
fixed-bar offsets are resolved against it — every fixed bar in its subtree is
detected and stacked in document order.

## Example

::prose-show-case
<q-app></q-app>

#code

```vue
<q-app />
```
::

`<q-app>` is a thin wrapper — it renders no visible content of its own, which is
why the preview above is empty. Wrap the page inside it so the fixed bars and the
pages stack in the right order.

## API

<dnax-api name="QApp"></dnax-api>
