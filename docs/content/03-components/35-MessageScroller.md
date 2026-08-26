---
title: MessageScroller
description: "Message log — anchored scrolling, streaming. Parts: MessageScrollerButton, MessageScrollerContent, MessageScrollerItem, MessageScrollerProvider, MessageScrollerViewport."
navigation:
  icon: lucide:messages-square
componentApi:
  heading: API
  components:
    - path: ../packages/ui/components/QMessageScroller.vue
      title: MessageScroller
    - path: ../packages/ui/components/QMessageScrollerButton.vue
      title: MessageScrollerButton
    - path: ../packages/ui/components/QMessageScrollerContent.vue
      title: MessageScrollerContent
    - path: ../packages/ui/components/QMessageScrollerItem.vue
      title: MessageScrollerItem
    - path: ../packages/ui/components/QMessageScrollerProvider.vue
      title: MessageScrollerProvider
    - path: ../packages/ui/components/QMessageScrollerViewport.vue
      title: MessageScrollerViewport
---

## Example

```vue
<q-message-scroller-provider auto-scroll>
  <q-message-scroller class="h-[400px]">
    <q-message-scroller-viewport>
      <q-message-scroller-content>
        <q-message-scroller-item v-for="m in messages" :key="m.id" :message-id="m.id">
          <q-bubble :align="m.from === me ? 'end' : 'start'">{{ m.body }}</q-bubble>
        </q-message-scroller-item>
      </q-message-scroller-content>
    </q-message-scroller-viewport>
    <q-message-scroller-button direction="end" />
  </q-message-scroller>
</q-message-scroller-provider>
```

## MessageScrollerButton

```vue
<q-message-scroller-button direction="end" />
```

## MessageScrollerContent

```vue
<q-message-scroller-content>
  <q-message-scroller-item :message-id="m.id">…</q-message-scroller-item>
</q-message-scroller-content>
```

## MessageScrollerItem

```vue
<q-message-scroller-item :message-id="m.id">
  <q-bubble>Message</q-bubble>
</q-message-scroller-item>
```

## MessageScrollerProvider

```vue
<q-message-scroller-provider auto-scroll>
  <!-- scroller content -->
</q-message-scroller-provider>
```

## MessageScrollerViewport

```vue
<q-message-scroller-viewport>
  <q-message-scroller-content>…</q-message-scroller-content>
</q-message-scroller-viewport>
```

