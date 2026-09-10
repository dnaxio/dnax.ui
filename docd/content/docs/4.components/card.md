---
title: Card
description: Flexible content containers — bordered, elevated, glassmorphism and hover variants.
navigation:
  icon: lucide:square
seo:
  title: Card (QCard)
  description: QCard family — container, padded content block and action row.
---

Cards are flexible, extensible content containers that group information and actions
related to a single subject. The family is made of three components: **`<q-card>`**
(the container), **`<q-card-content>`** (a padded content block) and
**`<q-card-actions>`** (an action row). Cards are flat by default — add `elevated`,
`bordered`, a `radius`, the `glass` glassmorphism effect or the `hover` lift
animation to tune the look.

## QCard — container

::prose-show-case
<dnax-demo-card demo="basic"></dnax-demo-card>

#code

```vue
<q-card class="demo-card">
  <q-card-content>
    <h3 class="demo-card-title">Getting started</h3>
    <p class="demo-p">
      A card is a flexible container that groups related content and actions.
      The <code>media</code> slot takes an image, the default slot the body,
      and the <code>actions</code> slot a <code>q-card-actions</code> row.
    </p>
  </q-card-content>
</q-card>
```
::

### Bordered, radius & elevation

::prose-show-case
<dnax-demo-card demo="bordered"></dnax-demo-card>

#code

```vue
<div class="demo-card-row">
  <q-card bordered radius="lg" class="demo-card">
    <q-card-content>
      <h3 class="demo-card-title">Bordered</h3>
      <p class="demo-p">A subtle 1px border with <code>bordered</code>.</p>
    </q-card-content>
  </q-card>

  <q-card elevated class="demo-card">
    <q-card-content>
      <h3 class="demo-card-title">Elevated</h3>
      <p class="demo-p">
        Cards are flat by default — add <code>elevated</code> for a shadow,
        or <code>flat</code> to remove it explicitly.
      </p>
    </q-card-content>
  </q-card>
</div>
```
::

### Actions

::prose-show-case
<dnax-demo-card demo="actions"></dnax-demo-card>

#code

```vue
<q-card bordered class="demo-card">
  <q-card-content>
    <h3 class="demo-card-title">Draft release</h3>
    <p class="demo-p">
      Actions are grouped in the <code>actions</code> slot of the card and
      aligned with <code>q-card-actions</code>.
    </p>
  </q-card-content>
  <template #actions>
    <q-card-actions align="right">
      <q-btn flat label="Cancel" />
      <q-btn label="Save" />
    </q-card-actions>
  </template>
</q-card>
```
::

### Glassmorphism

`glass` gives the card a translucent, blurred background (backdrop-filter) that
picks up whatever is behind it — the classic frosted-glass look. Tune it with the
`--q-card-glass-bg`, `--q-card-glass-border` and `--q-card-glass-blur` CSS
variables.

::prose-show-case
<dnax-demo-card demo="glass"></dnax-demo-card>

#code

```vue
<div class="stage">
  <span class="blob blob--a"></span>
  <span class="blob blob--b"></span>
  <span class="blob blob--c"></span>

  <q-card glass class="card glass-card">
    <q-card-content>
      <h3 class="glass-title">Glass card</h3>
      <p class="glass-text">blur(14px) + translucent background — try the hover one.</p>
    </q-card-content>
  </q-card>

  <q-card glass hover class="card glass-card">
    <q-card-content>
      <h3 class="glass-title">Glass + hover</h3>
      <p class="glass-text">Same card with the hover animation enabled.</p>
    </q-card-content>
  </q-card>
</div>
```
::

### Hover animation

`hover` adds a smooth lift (4px up) with a strengthened shadow on mouse-over —
ideal for clickable cards. It works with any other modifier (`elevated`,
`bordered`, `glass`…) and respects `prefers-reduced-motion`.

::prose-show-case
<dnax-demo-card demo="hover"></dnax-demo-card>

#code

```vue
<div class="row">
  <q-card hover elevated class="card">
    <q-card-content>
      <h3 class="demo-card-title">Elevated + hover</h3>
      <p class="demo-p">Lifts 4px and strengthens the shadow on hover.</p>
    </q-card-content>
  </q-card>
  <q-card hover bordered class="card">
    <q-card-content>
      <h3 class="demo-card-title">Bordered + hover</h3>
      <p class="demo-p">The border stays, the card lifts smoothly.</p>
    </q-card-content>
  </q-card>
</div>
```
::

### API

<dnax-api name="QCard"></dnax-api>

## QCardContent — content block

The padded body of the card (Quasar's `QCardSection` equivalent). Use `align` for
text alignment and `padding` to override the default 20px spacing.

```html
<q-card bordered class="demo-card">
  <q-card-content align="center">
    <h3 class="demo-card-title">Centered content</h3>
    <p class="demo-p">
      QCardContent wraps its slot in a padded block with an optional
      <code>align</code> (left | center | right) and a custom <code>padding</code>.
    </p>
  </q-card-content>
</q-card>
```

### API

<dnax-api name="QCardContent"></dnax-api>

## QCardActions — action row

Groups the buttons of a card. Use it inside the `actions` slot of `<q-card>` (or
anywhere). Seven alignments are available (`left`, `center`, `right`, `between`,
`around`, `evenly`, `stretch`) plus a `vertical` stacking mode.

```html
<q-card bordered class="demo-card">
  <q-card-content>
    <p class="demo-p">Vertical actions with space between:</p>
  </q-card-content>
  <template #actions>
    <q-card-actions align="between" vertical>
      <q-btn flat label="Delete" color="negative" />
      <q-btn label="Duplicate" />
    </q-card-actions>
  </template>
</q-card>
```

### API

<dnax-api name="QCardActions"></dnax-api>
