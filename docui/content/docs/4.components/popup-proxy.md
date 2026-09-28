---
title: Popup proxy
description: A popup that becomes a menu on wide screens and a dialog on narrow ones — same content, same API.
navigation:
  icon: lucide:layers
seo:
  title: Popup proxy (QPopupProxy)
  description: QPopupProxy — an anchored popover that turns into a dialog below a breakpoint.
---

**`<q-popup-proxy>`** renders its default slot in an **anchored panel** on wide screens and
in a **centered dialog** on narrow ones — the *same* content and the *same* API in both
modes. Unlike a menu it has **no trigger of its own**: place it inside the element it should
attach to, and open it from that element (usually on click) through its `show()` method.

The panel is teleported to `<body>` (`position: fixed`), so it escapes any overflow or
stacking context, and it is repositioned on `resize` / `scroll`.

## Basic

Place `<q-popup-proxy>` **inside** the target — exactly like `<q-tooltip>`. The panel anchors
to the target's box; below the breakpoint the very same content is shown as a dialog.

::prose-show-case
:dnax-demo-popup-proxy{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const proxy = ref()
const picked = ref("—")

const pick = (label: string) => {
  picked.value = label
  proxy.value?.hide()
}
</script>

<template>
  <q-btn label="Open menu" color="primary" @click="proxy?.show()">
    <!-- The proxy lives INSIDE the target: it anchors the panel to this button -->
    <q-popup-proxy ref="proxy" position="bottom-end">
      <q-list padding>
        <q-item clickable @click="pick('Profile')">
          <q-icon name="lucide:user" left />
          Profile
        </q-item>
        <q-item clickable @click="pick('Settings')">
          <q-icon name="lucide:settings" left />
          Settings
        </q-item>
        <q-item clickable @click="pick('Sign out')">
          <q-icon name="lucide:log-out" left />
          Sign out
        </q-item>
      </q-list>
    </q-popup-proxy>
  </q-btn>

  <p>Picked: {{ picked }}</p>
</template>
```
::

## Position & offset

`position` places the panel around the target with the same vocabulary as
`<q-btn-dropdown>` / `<q-btn-actions>`: a main side (`bottom`, `top`, `left`, `right`) with an
optional alignment (`-start` or `-end`, centered when omitted). `offset` adds a gap in pixels
(default `4`). The panel is kept inside the viewport.

```vue
<q-popup-proxy position="bottom-start">…</q-popup-proxy>
<q-popup-proxy position="top-end" :offset="8">…</q-popup-proxy>
<q-popup-proxy position="left">…</q-popup-proxy>
```

Style the teleported panel from the outside with `content-class` and `content-style` —
`content-style` overrides the computed placement (handy to force a width). `dark` forces the
dark surface for the anchored panel.

## Persistent

`persistent` disables **both** the outside click and `Escape`, just like `<q-dialog>`.
Provide an explicit close action inside the slot.

::prose-show-case
:dnax-demo-popup-proxy{demo="persistent"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const proxy = ref()
</script>

<template>
  <q-btn label="Persistent popup" color="primary" @click="proxy?.show()">
    <q-popup-proxy ref="proxy" persistent>
      <div class="panel">
        <p>Clicking outside or pressing Escape won't close this popup.</p>
        <q-btn flat label="Close" @click="proxy?.hide()" />
      </div>
    </q-popup-proxy>
  </q-btn>
</template>
```
::

## Breakpoint — menu or dialog

`breakpoint` is the window width below which the anchored panel is replaced by a
`<q-dialog>`. The default is `599`: `window.innerWidth >= breakpoint` shows the anchored
panel, anything narrower renders the same slot content in a dialog. The switch is **live** —
resizing the window while the popup is open swaps the rendering and re-anchors (or
re-focuses) automatically. The focus moves to the first focusable element when the popup
opens and returns to the trigger when it closes.

```vue
<!-- Anchored menu from 768px up, dialog below -->
<q-popup-proxy :breakpoint="768">
  <q-list>…</q-list>
</q-popup-proxy>
```

## Methods — show, hide, toggle

Because the proxy has no trigger, you open it imperatively through its exposed methods:
`show()`, `hide()` and `toggle()`. They drive the `v-model` when it is bound, and the
internal state otherwise. The popup also emits `show` and `hide`.

```vue
<script setup lang="ts">
import { ref } from "vue"

const proxy = ref()
const open = ref(false)
</script>

<template>
  <q-btn label="Toggle" @click="proxy?.toggle()" />

  <!-- v-model is optional: show()/hide()/toggle() work without it -->
  <q-popup-proxy ref="proxy" v-model="open" @show="() => {}" @hide="() => {}">
    <q-list>…</q-list>
  </q-popup-proxy>
</template>
```

## API

:dnax-api{name="QPopupProxy"}
