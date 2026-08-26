---
title: Safe areas
description: Mandatory rule — iOS insets (notch, home indicator) on every fullscreen component.
navigation:
  icon: lucide:smartphone
---

::prose-lead
Any **fullscreen** component or component pinned to a screen edge must apply the **iOS safe-area insets** so it never slides under the notch or the home indicator. DanxUI ships them natively in `styles/main.css`.
::

## Prerequisite: `viewport-fit=cover`

The `env(safe-area-inset-*)` values only work if the viewport is set to `viewport-fit=cover`:

```ts
// nuxt.config.ts
app: {
  head: {
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    ],
  },
},
```

Never remove this meta, otherwise every safe area becomes `0` on iOS.

## Mandatory fallback chain

Always declare the 3 levels, in this order (old-browser fallback → iOS 11.0–11.2 → iOS 11.2+):

```css
padding-top: 0; /* old-browser fallback */
padding-top: constant(safe-area-inset-top); /* iOS 11.0 – 11.2 */
padding-top: env(safe-area-inset-top); /* iOS 11.2+ */
```

Use `padding-*` for panels/containers, `margin-*` for floating elements (FAB, search field at the bottom of a sheet).

## Components already covered

::prose-icon-list
  ::prose-li
  ---
  icon: lucide:panel-top
  ---
  **`.q-header`** → top + left + right (always applied, not only under `.q-app`).
  ::
  ::prose-li
  ---
  icon: lucide:panel-bottom
  ---
  **`.q-footer`** → bottom + left + right (always applied).
  ::
  ::prose-li
  ---
  icon: lucide:file-text
  ---
  **`.q-page`** → bottom.
  ::
  ::prose-li
  ---
  icon: lucide:panel-bottom-open
  ---
  **`.q-bottom-sheet__panel`** / **`.q-action-sheet__panel`** → bottom.
  ::
  ::prose-li
  ---
  icon: lucide:list
  ---
  **`.q-select__sheet`** — header (top), list (bottom), bottom search field (`--sheet-bottom`).
  ::
  ::prose-li
  ---
  icon: lucide:circle-plus
  ---
  **`.q-fab`** → `calc(16px + env(safe-area-inset-*))`.
  ::
  ::prose-li
  ---
  icon: lucide:calendar
  ---
  **`.q-date-picker__sheet`** (dialog / sheet) → top + bottom.
  ::
  ::prose-li
  ---
  icon: lucide:arrow-left
  ---
  **`.q-back-header`** → top.
  ::
::

## For any new fullscreen component

1. Check which edge it touches (top/bottom/sides) → add the matching insets.
2. Always use the `0` → `constant()` → `env()` chain.
3. On desktop (Windows/macOS) the insets are `0` → the fallback applies, no impact.
