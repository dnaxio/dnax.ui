---
title: Safe Area
description: The iOS safe-area insets (notch, home indicator) applied as padding
  on the requested sides.
navigation:
  icon: lucide:smartphone
seo:
  title: Safe Area (QSafeArea)
  description: QSafeArea — applies the iOS safe-area insets as padding on the requested sides.
---

Applies the iOS **safe-area insets** (notch, home indicator) as padding on the
requested sides. **`<q-safe-area top bottom>`** wraps content that must not slide
under the notch or the home bar — with the mandatory fallback chain `0` →
`constant()` → `env()`. On desktop the insets are `0`: nothing changes. The phone
mockups below simulate the insets so you can see the effect.

## Top & bottom (portrait)

`top` pads below the notch (status bar area), `bottom` pads above the home
indicator — the two most common sides.

::prose-show-case
:dnax-demo-safe-area{demo="portrait"}

#code

```vue
<div class="phone">
  <q-safe-area top class="phone__status">
    <span class="phone__time">9:41</span>
    <span class="phone__notch" />
  </q-safe-area>

  <div class="phone__content">
    <div class="card" />
    <div class="card" />
    <div class="card" />
  </div>

  <q-safe-area bottom class="phone__home">
    <span class="phone__home-indicator" />
  </q-safe-area>
</div>
<!-- padding-top: env(safe-area-inset-top) pousse le contenu sous l'encoche ;
     padding-bottom: env(safe-area-inset-bottom) au-dessus de la barre d'accueil. -->
```
::

## Left & right (landscape)

In landscape the notch sits on a side — `left` / `right` avoid it for side rails,
drawers or full-bleed content.

::prose-show-case
:dnax-demo-safe-area{demo="landscape"}

#code

```vue
<div class="phone phone--landscape">
  <q-safe-area left class="phone__side">
    <span class="phone__notch-side" />
  </q-safe-area>

  <div class="phone__content">
    <div class="card" />
    <div class="card" />
  </div>
</div>
<!-- En paysage, l'encoche est sur le côté : inset-left l'évite. -->
```
::

## All sides

`all` is a shortcut for `top + right + bottom + left` — for full-bleed content
(modals, splash screens, home pages) that must clear every edge.

::prose-show-case
:dnax-demo-safe-area{demo="all"}

#code

```vue
<div class="phone">
  <q-safe-area all class="phone__full">
    <p class="title">Fullscreen</p>
    <p class="text">This content avoids every edge — top, right, bottom and left.</p>
  </q-safe-area>
</div>
<!-- all = top + right + bottom + left (contenu plein écran : modal, page d'accueil…) -->
```
::

## Prerequisite: viewport-fit=cover

`env(safe-area-inset-*)` is only non-zero when the viewport opts in with
`viewport-fit=cover` — make sure the meta tag is present (it already is in the
mobile app config):

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Each side emits the full fallback chain, so old iOS versions fall back to
`constant()` and ancient browsers to `0`.

## API

:dnax-api{name="QSafeArea"}
