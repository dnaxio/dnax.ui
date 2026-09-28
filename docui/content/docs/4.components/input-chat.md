---
title: Input chat
description: A chat composer — an auto-growing textarea with a built-in send button, Enter to send and safe-area padding.
navigation:
  icon: lucide:send
seo:
  title: Input chat (QInputChat)
  description: QInputChat — a v-model:message chat textarea with an integrated send button, Enter to send and safe-area support.
---

A chat composer — a **multi-line textarea** that grows with its content and carries a
**built-in send button**. **`<q-input-chat>`** keeps the field vocabulary of `q-input`
(`outlined`, `filled`, `borderless`, `dense`, `error`, `radius`) and adds the composer
behaviours: `Enter` sends (`Shift+Enter` inserts a newline), the value is emitted through
`v-model:message`, the send button is disabled while the field is empty, and the whole field pads
itself for the iOS home indicator since a composer normally sits at the bottom of the
screen.

## Basic

The `v-model:message` is a string. Typing grows the textarea up to `max-rows` lines; the `send`
event fires with the trimmed text when the user presses `Enter` or clicks the button.

::prose-show-case
:dnax-demo-input-chat{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const message = ref("")
const lastSent = ref("")
</script>

<template>
  <q-input-chat
    v-model:message="message"
    label="Message"
    placeholder="Type a message, then press Enter…"
    outlined
    @send="lastSent = $event"
  />
  <p>Last sent: {{ lastSent || "—" }}</p>
</template>
```
::

### Auto-grow

By default the textarea starts at `rows` lines and grows with the content until `max-rows`,
after which it scrolls instead of pushing the layout. Set `:autogrow="false"` for a fixed
`rows`-line box, or `:max-rows="0"` to lift the cap.

::prose-show-case
:dnax-demo-input-chat{demo="autogrow"}

#code

```vue
<template>
  <q-input-chat v-model:message="long" :rows="2" :max-rows="8" outlined />
  <!-- autogrow (default) sizes the box to the content, capped at 8 lines -->
</template>
```
::

## Sending

`send` carries the **trimmed** text — a blank value emits nothing. With the default
`clear-on-send`, the field is cleared (emitting `update:modelValue` = `''` and `clear`),
brought back to its base height and focused again for the next message. Turn it off to
keep the text (drafts, reusable templates).

::prose-show-case
:dnax-demo-input-chat{demo="basic"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const message = ref("")

const onSend = (text: string) => console.log("send:", text)
</script>

<template>
  <!-- Enter sends · Shift+Enter inserts a newline (send-on-enter, default) -->
  <q-input-chat v-model:message="message" @send="onSend" />

  <!-- keep the text after sending -->
  <q-input-chat v-model:message="message" :clear-on-send="false" @send="onSend" />

  <!-- Enter inserts a newline; send only with the button -->
  <q-input-chat v-model:message="message" :send-on-enter="false" @send="onSend" />
</template>
```
::

`Enter` only sends when no modifier is held — `Shift`, `Alt`, `Ctrl` and `Meta` all fall
back to their native behaviour — and never while an **IME composition** is in progress
(Chinese, Japanese, Korean), so confirming a candidate with `Enter` does not fire `send`.

## Variants

The composer reuses the field variants: `outlined` (transparent background), `filled`,
`borderless`, `dense` and `radius` (a `true` pill or the `xs|sm|md|lg` scale).

::prose-show-case
:dnax-demo-input-chat{demo="variants"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const outlined = ref("")
const filled = ref("")
const borderless = ref("")
const rounded = ref("")
</script>

<template>
  <q-input-chat v-model:message="outlined" placeholder="Outlined" outlined />
  <q-input-chat v-model:message="filled" placeholder="Filled" filled />
  <q-input-chat v-model:message="borderless" placeholder="Borderless" borderless />
  <q-input-chat v-model:message="rounded" placeholder="Rounded (pill)" radius outlined />
</template>
```
::

## States

`disable` locks the whole composer (field and button), `readonly` keeps the text
selectable while disabling the send button, `loading` shows a spinner inside the button
(and blocks sending), and `error` / `error-message` report a validation failure decided by
the app. `counter` follows `maxlength`.

::prose-show-case
:dnax-demo-input-chat{demo="states"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const readonly = ref("Read-only value")
const message = ref("")
</script>

<template>
  <q-input-chat v-model:message="message" disable outlined placeholder="Disabled" />

  <q-input-chat v-model:message="readonly" readonly outlined placeholder="Read-only" />

  <!-- waiting for the server: spinner in the send button -->
  <q-input-chat v-model:message="message" loading outlined placeholder="Sending…" />

  <q-input-chat
    v-model:message="message"
    :maxlength="40"
    counter
    error
    error-message="This message is too long."
    outlined
  />
</template>
```
::

## Options

`options` renders the toggle pills of the bar (icon + label). The selection lives in the
component: clicking a pill emits `update:options` with a **new array** in which the target's
`active` key is toggled, so `v-model:options` stays in sync — the option is matched by `_id`
when present, otherwise by its index. The composer also works **without** `v-model:options`
(it keeps the toggled state internally), and a `disable`d option is inert.

::prose-show-case
:dnax-demo-input-chat{demo="options"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const message = ref("")
const lastOption = ref("")

// `active` is updated by the composer and written back through v-model:options.
const options = ref([
  { _id: "think", label: "DeepThink", icon: "lucide:brain", active: false },
  { _id: "search", label: "Search", icon: "lucide:globe", active: true },
  { _id: "code", label: "Code", icon: "lucide:code", active: false },
])

const onOption = ({ option, active }) => {
  lastOption.value = `${option.label} = ${active}`
}
</script>

<template>
  <q-input-chat v-model:message="message" v-model:options="options" outlined @option="onOption" />
  <p>{{ options.map((o) => `${o.label}:${o.active}`).join(" · ") }}</p>
</template>
```
::

Each toggle also emits `option` with `{ option, active }` — handy for side effects without
rewriting the whole array.

## Files

With `accept`, the `+` menu gains an **“Add file”** entry that opens a hidden file input
(`multiple` allows several at once). Picked files are emitted through `v-model:files` and
shown above the textarea as removable chips (name + readable size); the ✕ emits the new
array. `show-files` hides the chips, and `attach` renames the entry (a string) or removes it
(`attach=false`).

::prose-show-case
:dnax-demo-input-chat{demo="files"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const message = ref("")
const files = ref([])
</script>

<template>
  <q-input-chat
    v-model:message="message"
    v-model:files="files"
    accept="image/*,.pdf"
    placeholder="Attach a file with the + button…"
    outlined
  />

  <!-- chips hidden, files still tracked through v-model:files -->
  <q-input-chat v-model:message="message" v-model:files="files" accept="image/*" :show-files="false" outlined />

  <!-- custom label for the menu entry -->
  <q-input-chat v-model:message="message" v-model:files="files" accept="image/*" attach="Add a picture" outlined />
</template>
```
::

## Actions

`actions` are the entries of the **`+` menu** — the button is provided by the composer and
rendered by `q-btn-actions` (teleported panel, keyboard navigation, outside-click). Its icon
comes from `actions-icon` and its accessible name from `actions-label`; `#actions` replaces
the button and its menu entirely. Selecting an entry emits `action` with `{ action, value }`
(`value` is the action's own `value`, or the action itself) and calls the entry's local
`onClick`.

The bar shows up as soon as an `option`, an action, `#actions`/`#tools` or an attach entry
exists; the send button then moves into it.

::prose-show-case
:dnax-demo-input-chat{demo="actions"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const message = ref("")
const files = ref([])
const lastAction = ref("")

// Menu entries of the + button; `accept` adds the "Add file" entry.
const actions = [
  { label: "Web search", icon: "lucide:search" },
  { label: "New chat", icon: "lucide:message-circle" },
]

const onAction = ({ action }) => {
  lastAction.value = action.label ?? action.icon
}
</script>

<template>
  <q-input-chat
    v-model:message="message"
    v-model:files="files"
    :actions="actions"
    accept="image/*,.pdf"
    placeholder="Ask a question, or pick an action from the + menu…"
    outlined
    @action="onAction"
  />
</template>
```
::

## Slots & methods

`#prepend` renders before the textarea and `#append` after it. The bar exposes `#options`
(replaces the pills), `#actions` (replaces the `+` button and its menu) and `#tools` (the
right zone, before the send), while `#files` replaces the file chips and `#send` replaces the
send button entirely (it receives `send`, `disabled` and `loading`). The component also
exposes `focus()`, `blur()`, `clear()` and `send()` through its template ref.

::prose-show-case
:dnax-demo-input-chat{demo="slots"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const text = ref("")

// the send button (or #prepend) triggers these
const composer = ref()
composer.value?.focus()
composer.value?.send()
composer.value?.clear()
</script>

<template>
  <!-- attachment button via #prepend, default send button -->
  <q-input-chat v-model:message="text" outlined>
    <template #prepend>
      <q-btn flat round dense icon="lucide:paperclip" aria-label="Attach a file" />
    </template>
  </q-input-chat>

  <!-- custom send button via #send -->
  <q-input-chat ref="composer" v-model:message="text" outlined>
    <template #send="{ send, disabled }">
      <q-btn no-caps :disable="disabled" label="Send" icon-right="lucide:send" @click="send" />
    </template>
  </q-input-chat>
</template>
```
::

### Tools

`#tools` fills the right side of the bar, next to the send button — a mic, a token counter,
anything.

::prose-show-case
:dnax-demo-input-chat{demo="tools"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const message = ref("")
const options = ref([{ _id: "search", label: "Search", icon: "lucide:globe", active: true }])
</script>

<template>
  <q-input-chat v-model:message="message" v-model:options="options" outlined>
    <template #tools>
      <q-btn round flat dense icon="lucide:mic" aria-label="Voice input" />
    </template>
  </q-input-chat>
</template>
```
::

## Safe area

A composer is normally pinned to the bottom of the screen, so `safe-area` (on by default)
pads its bottom edge with the home indicator inset using the mandatory three-level
fallback chain `0` → `constant()` → `env()`. On desktop the insets are `0`, so nothing
changes. Set `:safe-area="false"` when the field is used inline in a page.

::prose-show-case
:dnax-demo-input-chat{demo="basic"}

#code

```vue
<template>
  <!-- pinned to the bottom of the screen (default) -->
  <q-input-chat v-model:message="message" placeholder="Message…" />

  <!-- inline in a page: no safe-area padding -->
  <q-input-chat v-model:message="message" placeholder="Message…" :safe-area="false" />
</template>
```
::

As with every safe-area component, the insets only take effect when the viewport opts in
with `viewport-fit=cover`.

## Full composer

Two complete reproductions of real chat composers. Both build the rounded container with
the surrounding element and make the composer itself `borderless`; `padding` sets the
control's padding for the airy look. Add `dark` (or use the app's dark theme) for the dark
surface.

### DeepSeek-like

A tall box: the toggle pills on the left of the bar, the `+` menu (Web search, Add file) and
the round arrow send button on the right.

::prose-show-case
:dnax-demo-input-chat{demo="deepseek"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const message = ref("")
const files = ref([])

const options = ref([
  { _id: "think", label: "DeepThink", icon: "lucide:brain", active: false },
  { _id: "search", label: "Search", icon: "lucide:globe", active: true },
])

const actions = [{ label: "Web search", icon: "lucide:search" }]
</script>

<template>
  <div class="composer dark">
    <q-input-chat
      v-model:message="message"
      v-model:options="options"
      v-model:files="files"
      :actions="actions"
      accept="image/*,.pdf"
      placeholder="Send a message…"
      :padding="'16px 16px 6px'"
      padding-options="16px"
      send-icon="lucide:arrow-up"
      borderless
    />
  </div>
</template>

<style scoped>
.composer {
  padding: 4px;
  background: #1a1a1f;
  border-radius: 22px;
}
</style>
```
::

### Vibe-like

A compact bar: the `+` comes from the composer (`actions` + `accept`), while the model
dropdown (« Rapide ⌄ ») and the mic stay inline through `#append`.

::prose-show-case
:dnax-demo-input-chat{demo="vibe"}

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const message = ref("")
const files = ref([])
const actions = [{ label: "Web search", icon: "lucide:search" }]

const model = ref("fast")
const models = [
  { label: "Rapide", value: "fast" },
  { label: "Approfondi", value: "deep" },
]
</script>

<template>
  <div class="composer dark">
    <q-input-chat
      v-model:message="message"
      v-model:files="files"
      :actions="actions"
      accept="image/*"
      placeholder="Ask anything…"
      :padding="'8px 10px'"
      padding-options="10px"
      borderless
    >
      <template #append>
        <q-btn-actions
          flat
          dense
          no-caps
          :label="model === 'fast' ? 'Rapide' : 'Approfondi'"
          :actions="models"
          dropdown-icon="lucide:chevron-down"
          @select-action="(value) => (model = value)"
        />
        <q-btn round flat dense icon="lucide:mic" aria-label="Voice input" />
      </template>
    </q-input-chat>
  </div>
</template>

<style scoped>
.composer {
  padding: 4px;
  background: #1a1a1f;
  border-radius: 26px;
}
</style>
```
::

## API

:dnax-api{name="QInputChat"}
