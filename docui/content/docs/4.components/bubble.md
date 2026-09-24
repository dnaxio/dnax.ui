---
title: Bubble
description: Chat bubbles with content, groups and anchored reactions — seven variants.
navigation:
  icon: lucide:message-circle
seo:
  title: Bubble (QBubble)
  description: QBubble family — bubble, content, group and anchored reactions for chat UIs.
---

Bubbles render chat messages as rounded containers aligned to the start or the end
of the conversation. The family is made of four components: **`<q-bubble>`** (the
bubble itself), **`<q-bubble-content>`** (its content), **`<q-bubble-group>`**
(consecutive bubbles from the same sender) and **`<q-bubble-reactions>`** (reactions
anchored to a bubble edge). Seven variants cover everything from the default to
destructive.

## QBubble — the bubble

::prose-show-case
<dnax-demo-bubble demo="chat"></dnax-demo-bubble>

#code

```vue
<q-bubble-group class="demo-chat">
  <div class="demo-bubble-meta">Sarah · 14:02</div>
  <q-bubble align="start" variant="secondary">
    <q-bubble-content>Hey! Did you see the new design system?</q-bubble-content>
  </q-bubble>
  <q-bubble align="start" variant="secondary">
    <q-bubble-content>The card components are really nice.</q-bubble-content>
  </q-bubble>

  <div class="demo-bubble-meta demo-bubble-meta--end">You · 14:03</div>
  <q-bubble align="end">
    <q-bubble-content>Yes! I already used them in the dashboard.</q-bubble-content>
  </q-bubble>
</q-bubble-group>
```
::

### Variants

::prose-show-case
<dnax-demo-bubble demo="variants"></dnax-demo-bubble>

#code

```vue
<q-bubble variant="default">
  <q-bubble-content>Default</q-bubble-content>
</q-bubble>
<q-bubble variant="secondary">
  <q-bubble-content>Secondary</q-bubble-content>
</q-bubble>
<q-bubble variant="muted">
  <q-bubble-content>Muted</q-bubble-content>
</q-bubble>
<q-bubble variant="tinted">
  <q-bubble-content>Tinted</q-bubble-content>
</q-bubble>
<q-bubble variant="outline">
  <q-bubble-content>Outline</q-bubble-content>
</q-bubble>
<q-bubble variant="ghost">
  <q-bubble-content>Ghost</q-bubble-content>
</q-bubble>
<q-bubble variant="destructive">
  <q-bubble-content>Destructive</q-bubble-content>
</q-bubble>
```
::

### Reactions

::prose-show-case
<dnax-demo-bubble demo="reactions"></dnax-demo-bubble>

#code

```vue
<q-bubble align="end">
  <q-bubble-content>Great work, team! 🎉</q-bubble-content>
  <q-bubble-reactions>
    <button type="button" aria-label="Like">👍</button>
    <button type="button" aria-label="Heart">❤️</button>
    <button type="button" aria-label="Clap">👏</button>
  </q-bubble-reactions>
</q-bubble>
```
::

### API

<dnax-api name="QBubble"></dnax-api>

## QBubbleContent — bubble content

The styled content area of the bubble. With `as-child`, the style is forwarded to
the single child (a button or link) — perfect for interactive bubbles.

```html
<q-bubble align="end" variant="outline">
  <q-bubble-content>Rendered as a link with as-child:</q-bubble-content>
</q-bubble>

<q-bubble variant="tinted" as="button" as-child>
  <q-bubble-content>Clickable bubble</q-bubble-content>
</q-bubble>
```

### API

<dnax-api name="QBubbleContent"></dnax-api>

## QBubbleGroup — consecutive bubbles

A column wrapper for several consecutive bubbles from the same sender, with a 4px
gap between them. Timestamps or sender names can be rendered as siblings inside the
group.

```html
<q-bubble-group class="demo-chat">
  <div class="demo-bubble-meta">Sarah · 14:02</div>
  <q-bubble align="start" variant="secondary">
    <q-bubble-content>Hey! Did you see the new design system?</q-bubble-content>
  </q-bubble>
  <q-bubble align="start" variant="secondary">
    <q-bubble-content>The card components are really nice.</q-bubble-content>
  </q-bubble>

  <div class="demo-bubble-meta demo-bubble-meta--end">You · 14:03</div>
  <q-bubble align="end">
    <q-bubble-content>Yes! I already used them in the dashboard.</q-bubble-content>
  </q-bubble>
</q-bubble-group>
```

### API

<dnax-api name="QBubbleGroup"></dnax-api>

## QBubbleReactions — anchored reactions

A pill anchored to the bubble edge (`side` top or bottom, `align` start or end).
Combined with the bubble's `position: relative` it overlaps the edge — leave a little
room below the bubble so the pill does not collide with the next message.

```html
<q-bubble align="start">
  <q-bubble-content>Left-aligned reactions:</q-bubble-content>
  <q-bubble-reactions side="bottom" align="start">
    <span>❤️</span>
    <span>😂</span>
  </q-bubble-reactions>
</q-bubble>
```

### API

<dnax-api name="QBubbleReactions"></dnax-api>
