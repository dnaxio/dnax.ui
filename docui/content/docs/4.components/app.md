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

The root wrapper of a Dnax UI page. **`<q-app>`** renders a div holding the default
slot, as a **flex column taking the full width and exactly one screen tall** — the
plain-CSS equivalent of `flex h-screen w-full` (`display: flex; flex-direction: column;
width: 100%; height: 100dvh`), so no utility class is required. The pages, the fixed
bars (`q-header`, `q-footer`, `q-back-header`…) and the fixed-bar offsets are resolved
against it — every fixed bar in its subtree is detected and stacked in document order.

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

Because the wrapper is **exactly one screen tall**, give the content its own scroller
when it can outgrow the screen — a child with `min-height: 0` and `overflow: auto`
(typically the page container). Without it the content overflows the wrapper and the
document scrolls underneath the bars.

## API

<dnax-api name="QApp"></dnax-api>
