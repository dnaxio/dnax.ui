---
title: Bubble
description: "Conversation bubble — variants, align. Parts: BubbleContent, BubbleGroup, BubbleReactions."
navigation:
  icon: lucide:message-circle
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QBubble.vue
      title: Bubble
    - path: ../packages/ui/components/QBubbleContent.vue
      title: BubbleContent
    - path: ../packages/ui/components/QBubbleGroup.vue
      title: BubbleGroup
    - path: ../packages/ui/components/QBubbleReactions.vue
      title: BubbleReactions
---

## Example

```vue
<q-bubble-group>
  <q-bubble align="start" variant="muted">
    <q-bubble-content>Hello, how are you?</q-bubble-content>
  </q-bubble>
  <q-bubble align="end" variant="default">
    <q-bubble-content>Very well, thanks!</q-bubble-content>
    <q-bubble-reactions>👍 2</q-bubble-reactions>
  </q-bubble>
</q-bubble-group>
```

## BubbleContent

```vue
<q-bubble-content>Bubble text</q-bubble-content>
```

## BubbleGroup

```vue
<q-bubble-group>
  <q-bubble>Message 1</q-bubble>
  <q-bubble>Message 2</q-bubble>
</q-bubble-group>
```

## BubbleReactions

```vue
<q-bubble-reactions>👍 3 · ❤️ 1</q-bubble-reactions>
```

