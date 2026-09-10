# Message Scroller

> A chat transcript pinned to the live edge — auto-scroll, turn anchoring, preserved reading position and jump controls.

The Message Scroller keeps a chat transcript pinned to the live edge, preserves the
reading position when history is prepended, and exposes jump controls. The family is
made of six components led by **<q-message-scroller-provider>** (the scroll state)
and **<q-message-scroller>** (the layout), plus a viewport, a content log,
per-message items and a floating button. Composables like `useMessageScroller` drive
it from outside.

## QMessageScrollerProvider — scroll state

Owns all scroll state via `provide/inject`: pinning to the live edge (`auto-scroll`),
the opening position (`default-scroll-position`), turn anchoring and visibility. It
also exports three composables — `useMessageScroller()` (jump commands),
`useMessageScrollerVisibility()` (current anchor + visible ids) and
`useMessageScrollerScrollable()` (edges still reachable).

<prose-show-case>
<dnax-demo-message-scroller demo="transcript">



</dnax-demo-message-scroller>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const messages = ref([
  { id: "m1", text: "Welcome to the demo! 👋", from: "them" },
  { id: "m2", text: "Hey! Does the scroller stay pinned to the bottom?", from: "me" },
  { id: "m3", text: "It does — as long as auto-scroll is on and you are at the live edge.", from: "them" },
  { id: "m4", text: "Try sending a message below.", from: "them" },
])
let msgSeq = 4
const sendMessage = () => {
  msgSeq += 1
  messages.value.push({ id: "m" + msgSeq, text: "Auto-scrolled message #" + msgSeq + " 🎉", from: "me" })
}
</script>

<template>
  <q-message-scroller-provider
    auto-scroll
    default-scroll-position="end"
  >
    <q-message-scroller class="demo-scroller">
      <q-message-scroller-viewport>
        <q-message-scroller-content>
          <q-message-scroller-item
            v-for="m in messages"
            :key="m.id"
            :message-id="m.id"
            animation-preset="slide-up"
          >
            <q-bubble
              :align="m.from === 'me' ? 'end' : 'start'"
              :variant="m.from === 'me' ? 'default' : 'secondary'"
            >
              <q-bubble-content>{{ m.text }}</q-bubble-content>
            </q-bubble>
          </q-message-scroller-item>
        </q-message-scroller-content>
      </q-message-scroller-viewport>
      <q-message-scroller-button direction="end" label="Jump to latest" />
    </q-message-scroller>
  </q-message-scroller-provider>
</template>
```

</template>
</prose-show-case>

### Live edge

<prose-show-case>
<dnax-demo-message-scroller demo="live">



</dnax-demo-message-scroller>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const messages = ref([
  { id: "m1", text: "Welcome to the demo! 👋", from: "them" },
  { id: "m2", text: "Hey! Does the scroller stay pinned to the bottom?", from: "me" },
  { id: "m3", text: "It does — as long as auto-scroll is on and you are at the live edge.", from: "them" },
  { id: "m4", text: "Try sending a message below.", from: "them" },
])
let msgSeq = 4
const sendMessage = () => {
  msgSeq += 1
  messages.value.push({ id: "m" + msgSeq, text: "Auto-scrolled message #" + msgSeq + " 🎉", from: "me" })
}

const presets = [
  { label: "Fade", value: "fade" },
  { label: "Slide up", value: "slide-up" },
  { label: "Slide side", value: "slide-side" },
  { label: "Pop", value: "pop" },
  { label: "Spring bounce", value: "spring-bounce" },
  { label: "Blur fade", value: "blur-fade" },
  { label: "Scale fade", value: "scale-fade" },
]
const preset = ref("slide-up")
</script>

<template>
  <q-message-scroller-provider auto-scroll default-scroll-position="end">
    <q-message-scroller class="demo-scroller">
      <q-message-scroller-viewport>
        <q-message-scroller-content>
          <q-message-scroller-item v-for="m in messages" :key="m.id" :message-id="m.id" :animation-preset="preset">
            <q-bubble
              :align="m.from === 'me' ? 'end' : 'start'"
              :variant="m.from === 'me' ? 'default' : 'secondary'"
            >
              <q-bubble-content>{{ m.text }}</q-bubble-content>
            </q-bubble>
          </q-message-scroller-item>
        </q-message-scroller-content>
      </q-message-scroller-viewport>
      <q-message-scroller-button direction="end" label="Jump to latest" />
    </q-message-scroller>

    <!-- messages: ref of { id, text, from } — sendMessage() appends one -->
    <div class="demo-scroller-actions">
      <q-select v-model="preset" :options="presets" option-label="label" option-value="value" label="Animation" outlined dense />
      <q-btn icon="lucide:send" label="Send message" @click="sendMessage" />
    </div>
  </q-message-scroller-provider>
</template>
```

</template>
</prose-show-case>

### Turn anchoring

<prose-show-case>
<dnax-demo-message-scroller demo="anchor">



</dnax-demo-message-scroller>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const messages = ref([
  { id: "m1", text: "Welcome to the demo! 👋", from: "them" },
  { id: "m2", text: "Hey! Does the scroller stay pinned to the bottom?", from: "me" },
  { id: "m3", text: "It does — as long as auto-scroll is on and you are at the live edge.", from: "them" },
  { id: "m4", text: "Try sending a message below.", from: "them" },
])
let msgSeq = 4
const sendMessage = () => {
  msgSeq += 1
  messages.value.push({ id: "m" + msgSeq, text: "Auto-scrolled message #" + msgSeq + " 🎉", from: "me" })
}
</script>

<template>
  <q-message-scroller-provider
    auto-scroll
    default-scroll-position="last-anchor"
    :scroll-previous-item-peek="48"
  >
    <q-message-scroller class="demo-scroller">
      <q-message-scroller-viewport>
        <q-message-scroller-content>
          <q-message-scroller-item
            v-for="m in messages"
            :key="m.id"
            :message-id="m.id"
            :scroll-anchor="m.from === 'them'"
            animation-preset="fade"
          >
            <q-bubble
              :align="m.from === 'me' ? 'end' : 'start'"
              :variant="m.from === 'me' ? 'default' : 'secondary'"
            >
              <q-bubble-content>{{ m.text }}</q-bubble-content>
            </q-bubble>
          </q-message-scroller-item>
        </q-message-scroller-content>
      </q-message-scroller-viewport>
      <q-message-scroller-button direction="end" />
    </q-message-scroller>
  </q-message-scroller-provider>
</template>
```

</template>
</prose-show-case>

### API

<dnax-api name="QMessageScrollerProvider">



</dnax-api>

## QMessageScroller — the container

The layout container: a relative flex column that hosts the viewport and the
floating jump button. The height is up to you — set it via a class or let a parent
flex context stretch it.

```html
<q-message-scroller-provider
  auto-scroll
  default-scroll-position="end"
>
  <q-message-scroller class="demo-scroller">
    <q-message-scroller-viewport>
      <q-message-scroller-content>
        <q-message-scroller-item
          v-for="m in messages"
          :key="m.id"
          :message-id="m.id"
          animation-preset="slide-up"
        >
          <q-bubble
            :align="m.from === 'me' ? 'end' : 'start'"
            :variant="m.from === 'me' ? 'default' : 'secondary'"
          >
            <q-bubble-content>{{ m.text }}</q-bubble-content>
          </q-bubble>
        </q-message-scroller-item>
      </q-message-scroller-content>
    </q-message-scroller-viewport>
    <q-message-scroller-button direction="end" label="Jump to latest" />
  </q-message-scroller>
</q-message-scroller-provider>
```

### API

<dnax-api name="QMessageScroller">



</dnax-api>

## QMessageScrollerViewport — scrollable area

The native scrollable area. It observes the content to keep the reading position when
history is prepended (`preserve-scroll-on-prepend`), follows the live edge while
`auto-scroll` is on, and applies `default-scroll-position` on mount.

```html
<q-message-scroller-provider
  auto-scroll
  default-scroll-position="end"
>
  <q-message-scroller class="demo-scroller">
    <q-message-scroller-viewport>
      <q-message-scroller-content>
        <q-message-scroller-item
          v-for="m in messages"
          :key="m.id"
          :message-id="m.id"
          animation-preset="slide-up"
        >
          <q-bubble
            :align="m.from === 'me' ? 'end' : 'start'"
            :variant="m.from === 'me' ? 'default' : 'secondary'"
          >
            <q-bubble-content>{{ m.text }}</q-bubble-content>
          </q-bubble>
        </q-message-scroller-item>
      </q-message-scroller-content>
    </q-message-scroller-viewport>
    <q-message-scroller-button direction="end" label="Jump to latest" />
  </q-message-scroller>
</q-message-scroller-provider>
```

### API

<dnax-api name="QMessageScrollerViewport">



</dnax-api>

## QMessageScrollerContent — the log

The transcript log with `role="log"` and `aria-relevant="additions"`, so screen
readers announce new messages. Pass `aria-busy` while a message is streaming.

```html
<q-message-scroller-provider
  auto-scroll
  default-scroll-position="end"
>
  <q-message-scroller class="demo-scroller">
    <q-message-scroller-viewport>
      <q-message-scroller-content>
        <q-message-scroller-item
          v-for="m in messages"
          :key="m.id"
          :message-id="m.id"
          animation-preset="slide-up"
        >
          <q-bubble
            :align="m.from === 'me' ? 'end' : 'start'"
            :variant="m.from === 'me' ? 'default' : 'secondary'"
          >
            <q-bubble-content>{{ m.text }}</q-bubble-content>
          </q-bubble>
        </q-message-scroller-item>
      </q-message-scroller-content>
    </q-message-scroller-viewport>
    <q-message-scroller-button direction="end" label="Jump to latest" />
  </q-message-scroller>
</q-message-scroller-provider>
```

### API

<dnax-api name="QMessageScrollerContent">



</dnax-api>

## QMessageScrollerItem — one message row

One row of the transcript. `message-id` is the stable identifier used for anchoring,
visibility and jumps (auto-generated when omitted); `scroll-anchor` marks the start
of a turn — the scroller then positions it near the top with a peek of the previous
message.

```html
<q-message-scroller-item message-id="msg-42" :scroll-anchor="false">
  <q-bubble align="end">
    <q-bubble-content>One row of the transcript.</q-bubble-content>
  </q-bubble>
</q-message-scroller-item>
```

### API

<dnax-api name="QMessageScrollerItem">



</dnax-api>

## QMessageScrollerButton — jump button

A floating button that appears only while content remains in the given direction.
`direction="end"` jumps to the live edge, `direction="start"` to the top; the scroll
behavior is controlled with `behavior`.

```html
<!-- jump to the live edge (bottom) -->
<q-message-scroller-button direction="end" label="Jump to latest" />

<!-- jump back to the top -->
<q-message-scroller-button direction="start" label="Jump to oldest" />
```

### API

<dnax-api name="QMessageScrollerButton">



</dnax-api>
