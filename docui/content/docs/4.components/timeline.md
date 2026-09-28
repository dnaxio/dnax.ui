---
title: Timeline
description: A vertical timeline of dated entries — headings, alternating sides, icons, avatars and colors.
navigation:
  icon: lucide:history
seo:
  title: Timeline (QTimeline)
  description: QTimeline + QTimelineEntry — a vertical timeline with headings, sides, icons and avatars.
---

The timeline family has two components: **`<q-timeline>`** is the container — it
draws the vertical rail and owns the color and the vertical rhythm — and
**`<q-timeline-entry>`** is one entry (a title, an optional subtitle and body),
pinned to the rail by a round dot. Semantic rendering in the shadcn-vue style:
`ul > li` with `role="list"` / `role="listitem"`.

## Basic

Entries alternate **left and right around the centered rail** out of the box —
no prop to set. Just stack `<q-timeline-entry>` inside `<q-timeline>`.

::prose-show-case
:dnax-demo-timeline{demo="basic"}

#code

```vue
<q-timeline>
  <q-timeline-entry title="Project kickoff" subtitle="Jan 12 · 09:30">
    <p>The team meets to scope the first milestone.</p>
  </q-timeline-entry>
  <q-timeline-entry title="Design review" subtitle="Jan 19 · 14:00">
    <p>Wireframes are approved with two adjustments.</p>
  </q-timeline-entry>
  <q-timeline-entry title="First release" subtitle="Feb 02 · 10:15" color="positive">
    <p>Version 1.0 is published to production.</p>
  </q-timeline-entry>
</q-timeline>
```
::

The alternating side is automatic: the entry uses `:nth-child(odd)` for the left
half and `:nth-child(even)` for the right half, relative to the parent. A
`heading` entry counts in that alternation (as in Quasar).

## Headings

`heading` turns an entry into a centered **period title** — no dot, no side. Use
it to separate years, quarters or phases.

::prose-show-case
:dnax-demo-timeline{demo="heading"}

#code

```vue
<q-timeline color="secondary">
  <q-timeline-entry heading title="2024" />
  <q-timeline-entry title="v2.4" subtitle="Q1">
    <p>New timeline, board and chart components.</p>
  </q-timeline-entry>
  <q-timeline-entry title="v2.5" subtitle="Q2">
    <p>Spreadsheet cell types and change tracking.</p>
  </q-timeline-entry>
  <q-timeline-entry heading title="2025" />
  <q-timeline-entry title="v3.0" subtitle="Q1">
    <p>Theming rework and dark mode everywhere.</p>
  </q-timeline-entry>
</q-timeline>
```
::

## Icons, avatars & colors

Put an **Iconify icon** or an **image** in the dot with `icon` / `avatar`
(`avatar` wins over `icon`). `color` tints a single dot; the container `color`
sets the rail and the default dot color.

::prose-show-case
:dnax-demo-timeline{demo="icons"}

#code

```vue
<script setup lang="ts">
const avatar = "https://…/portrait.jpg"
</script>

<template>
  <q-timeline>
    <q-timeline-entry title="Order placed" subtitle="09:12" icon="lucide:shopping-cart" color="primary" />
    <q-timeline-entry title="Payment received" subtitle="09:18" icon="lucide:credit-card" color="positive" />
    <q-timeline-entry title="Handed to courier" subtitle="11:40" :avatar="avatar" color="secondary" />
    <q-timeline-entry title="Out for delivery" subtitle="Tomorrow · 08:00" icon="lucide:truck" color="warning" />
  </q-timeline>
</template>
```
::

## Sides

Set `side="left"` or `side="right"` to pin an entry to one half of the rail and
override the automatic alternation.

::prose-show-case
<div class="demo-stack">
  <q-timeline>
    <q-timeline-entry side="left" title="Left forever" subtitle="Always on the left" icon="lucide:arrow-left"></q-timeline-entry>
    <q-timeline-entry side="left" title="Still left" subtitle="Side is forced" icon="lucide:arrow-left"></q-timeline-entry>
    <q-timeline-entry side="right" title="Then right" subtitle="Automatic alternation bypassed" icon="lucide:arrow-right"></q-timeline-entry>
  </q-timeline>
</div>

#code

```vue
<q-timeline>
  <q-timeline-entry side="left" title="Left forever" subtitle="Always on the left" icon="lucide:arrow-left" />
  <q-timeline-entry side="left" title="Still left" subtitle="Side is forced" icon="lucide:arrow-left" />
  <q-timeline-entry side="right" title="Then right" subtitle="Automatic alternation bypassed" icon="lucide:arrow-right" />
</q-timeline>
```
::

## Layouts

`layout` controls the vertical spacing: `dense`, `comfortable` (default) or
`loose`. It is passed down to the entries.

::prose-show-case
<div class="demo-stack">
  <q-timeline layout="dense" color="primary">
    <q-timeline-entry title="Dense" subtitle="12px between entries" icon="lucide:minus"></q-timeline-entry>
    <q-timeline-entry title="Dense" subtitle="compact rhythm" icon="lucide:minus"></q-timeline-entry>
  </q-timeline>
  <q-timeline layout="loose" color="accent">
    <q-timeline-entry title="Loose" subtitle="42px between entries" icon="lucide:plus"></q-timeline-entry>
    <q-timeline-entry title="Loose" subtitle="airy rhythm" icon="lucide:plus"></q-timeline-entry>
  </q-timeline>
</div>

#code

```vue
<q-timeline layout="dense" color="primary">
  <q-timeline-entry title="Dense" subtitle="12px between entries" icon="lucide:minus" />
  <q-timeline-entry title="Dense" subtitle="compact rhythm" icon="lucide:minus" />
</q-timeline>

<q-timeline layout="loose" color="accent">
  <q-timeline-entry title="Loose" subtitle="42px between entries" icon="lucide:plus" />
  <q-timeline-entry title="Loose" subtitle="airy rhythm" icon="lucide:plus" />
</q-timeline>
```
::

## API

:dnax-api{name="QTimeline"}

## QTimelineEntry

:dnax-api{name="QTimelineEntry"}
