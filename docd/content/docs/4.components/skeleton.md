---
title: Skeleton
description: Loading placeholders that mimic the final layout — text, rect and
  circle shapes, whole component silhouettes and seven animations.
navigation:
  icon: lucide:square-dashed
seo:
  title: Skeleton (QSkeleton)
  description: QSkeleton — loading placeholders with the Quasar API (shapes, component types, animations).
---

Loading placeholders that mimic the final layout. **`<q-skeleton>`** offers simple shapes (`text`, `rect`, `circle`), whole component shapes (`QBtn`, `QInput`, `QAvatar`…) and seven animations — the equivalent of the shadcn-vue Skeleton with a Quasar API.

## Basic shapes

`text` (one line of text, `size` = font-size), `rect` (image/block, `width`/`height`) and `circle` (`size` = diameter).

::prose-show-case
:dnax-demo-skeleton{demo="shapes"}

#code

```vue
<q-skeleton type="text" width="100%" />
<q-skeleton type="text" width="80%" />
<q-skeleton type="text" width="55%" />
<q-skeleton type="rect" width="100%" height="120px" />
<q-skeleton type="circle" size="64px" />
```
::

## Component shapes

The `type` mimics the silhouette of a whole component — handy to skeleton a form, a toolbar or a list.

::prose-show-case
:dnax-demo-skeleton{demo="types"}

#code

```vue
<q-skeleton type="QBtn" />
<q-skeleton type="QAvatar" />
<q-skeleton type="QBadge" />
<q-skeleton type="QChip" />
<q-skeleton type="QInput" />
<q-skeleton type="QToggle" />
<q-skeleton type="QCheckbox" />
<q-skeleton type="QRadio" />
<q-skeleton type="QSlider" />
```
::

## Composed layout

Combine skeletons to reproduce the real page structure — here a profile card (avatar + lines + actions).

::prose-show-case
:dnax-demo-skeleton{demo="card"}

#code

```vue
<div class="card">
  <div class="card__row">
    <q-skeleton type="QAvatar" />
    <div class="card__lines">
      <q-skeleton type="text" width="60%" />
      <q-skeleton type="text" width="40%" />
    </div>
  </div>
  <q-skeleton type="text" />
  <q-skeleton type="text" width="90%" />
  <div class="card__row card__row--end">
    <q-skeleton type="QBtn" />
    <q-skeleton type="QBtn" />
  </div>
</div>
```
::

## Animations

`animation`: `wave` (default, sweeping highlight), `pulse` / `pulse-x` / `pulse-y`, `blink`, `fade` or `none`.

::prose-show-case
:dnax-demo-skeleton{demo="anims"}

#code

```vue
<div class="row">
  <q-skeleton type="text" width="110px" animation="wave" />
  <q-skeleton type="text" width="110px" animation="pulse" />
  <q-skeleton type="text" width="110px" animation="blink" />
  <q-skeleton type="text" width="110px" animation="fade" />
  <q-skeleton type="text" width="110px" animation="none" />
</div>
<!-- wave (défaut) · pulse · pulse-x · pulse-y · blink · fade · none -->
```
::

## Dark

`dark` switches to light-on-dark colors — for skeletons inside dark panels, cards or images.

::prose-show-case
:dnax-demo-skeleton{demo="dark"}

#code

```vue
<div class="panel-dark">
  <q-skeleton type="QAvatar" dark />
  <div class="lines">
    <q-skeleton type="text" width="100%" dark />
    <q-skeleton type="text" width="70%" dark />
  </div>
</div>
```
::

## API

:dnax-api{name="QSkeleton"}
