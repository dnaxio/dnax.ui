# Dialog

> A modal overlay family — dialog, header, content, footer, trigger and programmatic provider.

A modal overlay that focuses the user's attention on a single task. The family
comprises five components: **<q-dialog>** (the overlay + panel),
**<q-dialog-header>** (title and close button), **<q-dialog-footer>**
(actions), **<q-dialog-trigger>** (declarative opener) and
**<q-dialog-provider>** (renders the programmatic `$q.dialog` stack).

## QDialog — the modal

<prose-show-case>
<dnax-demo-dialog demo="simple">



</dnax-demo-dialog>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const open = ref(false)

const eventLog = ref("")
</script>

<template>
  <q-btn color="primary" label="Open dialog" @click="open = true" />
  <p v-if="eventLog" class="demo-dialog-log">Last event: <code>{{ eventLog }}</code></p>

  <q-dialog v-model="open" @show="eventLog = 'show'" @hide="eventLog = 'hide'">
    <div class="demo-dialog-body">
      <h3 class="demo-dialog-title">Welcome</h3>
      <p class="demo-p">
        This dialog is driven by a boolean <code>v-model</code>. Click the backdrop,
        press <code>Escape</code>, or use the buttons below to close it.
      </p>
      <div class="demo-dialog-actions">
        <q-btn flat label="Cancel" @click="open = false" />
        <q-btn color="primary" label="Got it" @click="open = false" />
      </div>
    </div>
  </q-dialog>
</template>
```

</template>
</prose-show-case>

### Header + footer

<prose-show-case>
<dnax-demo-dialog demo="header-footer">



</dnax-demo-dialog>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openConfirm = ref(false)
</script>

<template>
  <q-btn color="negative" outline label="Delete account" @click="openConfirm = true" />

  <q-dialog v-model="openConfirm">
    <q-dialog-header title="Confirm deletion" description="This action cannot be undone." show-close />
    <div class="demo-dialog-body">
      <p class="demo-p">
        QDialogHeader renders the title, an optional description and a close button;
        QDialogFooter hosts the action buttons at the bottom of the panel.
      </p>
    </div>
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="openConfirm = false" />
      <q-btn color="negative" label="Delete" @click="openConfirm = false" />
      <q-btn flat round dense icon="lucide:x" v-close aria-label="Close (v-close)" />
    </q-dialog-footer>
  </q-dialog>
</template>
```

</template>
</prose-show-case>

### Transitions

`transition` accepts `fade`, `zoom`, the four slide directions, `sheet-up` /
`sheet-down` (same glide as slide but the opening slows down at the end) and the
two swipe directions — try them all on the same dialog. Fine-tune the motion with
`transition-duration` and custom cubic-bezier curves via
`transition-easing-enter` / `transition-easing-leave` (any CSS easing, e.g.
`cubic-bezier(0.16, 1, 0.3, 1)`).

<prose-show-case>
<dnax-demo-dialog demo="transitions">



</dnax-demo-dialog>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const open = ref(false)
const transition = ref("fade")
const transitions = ["fade", "zoom", "slide-up", "slide-down", "sheet-up", "sheet-down", "slide-left", "slide-right", "swipe-left", "swipe-right"]

const openWith = (t) => {
  transition.value = t
  open.value = true
}
</script>

<template>
  <div class="row">
    <q-btn v-for="t in transitions" :key="t" outline color="primary" no-caps :label="t" @click="openWith(t)" />
  </div>

  <q-dialog v-model="open" :transition="transition">
    <q-dialog-header :title="'Transition: ' + transition" description="Click the backdrop or press Escape to close." />
    <div class="body">
      <p class="demo-p">Same dialog, different <code>transition</code> each time.</p>
    </div>
  </q-dialog>
</template>
```

</template>
</prose-show-case>

### Position & transition

<prose-show-case>
<dnax-demo-dialog demo="position">



</dnax-demo-dialog>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openBottom = ref(false)
</script>

<template>
  <q-btn outline label="Bottom dialog" @click="openBottom = true" />

  <q-dialog v-model="openBottom" position="bottom" transition="slide-up">
    <q-dialog-header title="Now playing" description="A sheet-like dialog anchored to the bottom edge" />
    <div class="demo-dialog-body">
      <p class="demo-p">
        <code>position</code> accepts <code>standard | top | right | bottom | left</code>;
        the transition follows the position automatically unless <code>transition</code>
        overrides it (<code>fade | zoom | slide-up | …</code>).
      </p>
    </div>
  </q-dialog>
</template>
```

</template>
</prose-show-case>

### Maximized (fullscreen)

<prose-show-case>
<dnax-demo-dialog demo="maximized">



</dnax-demo-dialog>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openMax = ref(false)
</script>

<template>
  <q-btn color="primary" label="Fullscreen dialog" @click="openMax = true" />

  <q-dialog v-model="openMax" maximized>
    <q-dialog-header title="Settings" description="A maximized dialog covers the whole screen" />
    <div class="demo-dialog-body">
      <p class="demo-p">
        <code>maximized</code> stretches the panel edge-to-edge (100vw × 100dvh) with
        square corners — the iOS fullscreen pattern. The header and footer respect
        the safe-area insets.
      </p>
    </div>
    <q-dialog-footer>
      <q-btn flat label="Close" @click="openMax = false" />
      <q-btn color="primary" label="Save" @click="openMax = false" />
    </q-dialog-footer>
  </q-dialog>
</template>
```

</template>
</prose-show-case>

### Maximized + transitions

<prose-show-case>
<dnax-demo-dialog demo="maximized-transitions">



</dnax-demo-dialog>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openMaxT = ref(false)
const maxTransition = ref("fade")
const maxDuration = ref(200)
const durations = [100, 200, 350, 500, 800]
const transitions = ["fade", "zoom", "slide-up", "slide-down", "sheet-up", "sheet-down", "slide-left", "slide-right", "swipe-left", "swipe-right"]

const openMaxWith = (t) => {
  maxTransition.value = t
  openMaxT.value = true
}
</script>

<template>
  <div class="row">
    <q-btn v-for="t in transitions" :key="t" outline color="primary" no-caps :label="t" @click="openMaxWith(t)" />
  </div>

  <div class="row">
    <q-btn v-for="d in durations" :key="d" flat color="primary" no-caps :label="d + 'ms'" :class="{ 'active': d === maxDuration }" @click="maxDuration = d" />
  </div>

  <q-dialog v-model="openMaxT" maximized :transition="maxTransition" :transition-duration="maxDuration">
    <q-dialog-header :title="'Maximized · ' + maxTransition + ' · ' + maxDuration + 'ms'" description="Fullscreen + transition + duration" />
    <div class="demo-dialog-body">
      <p class="demo-p">
        Combine <code>maximized</code>, any <code>transition</code> and a
        <code>transition-duration</code> in ms — each click re-opens the fullscreen
        panel with the chosen entrance animation and speed.
      </p>
    </div>
    <q-dialog-footer>
      <q-btn flat label="Close" @click="openMaxT = false" />
      <q-btn color="primary" label="Done" @click="openMaxT = false" />
    </q-dialog-footer>
  </q-dialog>
</template>
```

</template>
</prose-show-case>

Set `persistent` (or `no-backdrop-dismiss` / `no-esc-dismiss`) to prevent closing,
`maximized` for a fullscreen dialog, `full-width` / `full-height` for edge-to-edge
panels, and `radius` / `square` to control the corner rounding. The width can be
tuned with `content-style`.

### API

<dnax-api name="QDialog">



</dnax-api>

## QDialogHeader — title & close

Sticky bar rendered like the app `q-header` (embedded `q-toolbar`) with a `title`
and an optional `description`. The close button is **opt-in**: it only renders when
`show-close` is present — or bind any button with the `v-close` directive (closes
the closest dialog / sheet). Custom content can be passed through the `#title` and
`#description` slots, and `no-padding` flushes the content to the edges.

```vue
<q-dialog-header title="Settings" description="Tune your preferences" show-close />

<!-- or with custom slots -->
<q-dialog-header>
  <template #title>
    <q-icon name="lucide:sparkles" color="primary" />
    <span>Custom title</span>
  </template>
  <template #description>Custom description</template>
</q-dialog-header>
```

### API

<dnax-api name="QDialogHeader">



</dnax-api>

## QDialogContent — body section

The body of the panel between header and footer. With the `scrollable` modifier it
takes the remaining height and scrolls internally between the two fixed bars —
required in `maximized` dialogs, where the panel itself never scrolls.

```vue
<q-dialog v-model="open">
  <q-dialog-header title="Terms of service" description="Scroll to read the full agreement" show-close />
  <q-dialog-content scrollable>
    <p>Long body — scrolls between the fixed header and footer.</p>
  </q-dialog-content>
  <q-dialog-footer>
    <q-btn flat label="Cancel" @click="open = false" />
    <q-btn color="primary" label="Accept" @click="open = false" />
  </q-dialog-footer>
</q-dialog>
```

<prose-show-case>
<dnax-demo-dialog demo="content">



</dnax-demo-dialog>

<template v-slot:code="">

```vue
<q-dialog v-model="open">
  <q-dialog-header title="Terms of service" description="Scroll to read the full agreement" show-close />
  <q-dialog-content scrollable>
    <p>Long body — scrolls between the fixed header and footer.</p>
  </q-dialog-content>
  <q-dialog-footer>
    <q-btn flat label="Cancel" @click="open = false" />
    <q-btn color="primary" label="Accept" @click="open = false" />
  </q-dialog-footer>
</q-dialog>
```

</template>
</prose-show-case>

### API

<dnax-api name="QDialogContent">



</dnax-api>

## QDialogFooter — actions

Sticky bar rendered like the app `q-footer` (embedded `q-toolbar`) hosting the
action buttons, aligned **right**. The toolbar adds a 12px horizontal padding —
`no-padding` removes it to flush the actions to the edges.

```vue
<q-dialog-footer>
  <q-btn flat label="Cancel" @click="open = false" />
  <q-btn color="primary" label="Confirm" @click="open = false" />
</q-dialog-footer>
```

### API

<dnax-api name="QDialogFooter">



</dnax-api>

## QDialogTrigger — declarative opener

A button that calls `setOpen(true)` on its parent `<q-dialog>`. Since the dialog
content only mounts while open, the trigger is placed **inside** the dialog — for
opening from the page, bind `v-model` to a regular button instead.

<prose-show-case>
<dnax-demo-dialog demo="trigger">



</dnax-demo-dialog>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const open = ref(false)
</script>

<template>
  <q-btn color="primary" label="Open dialog" @click="open = true" />

  <q-dialog v-model="open">
    <q-dialog-header title="Trigger demo" description="QDialogTrigger renders inside the dialog slot" />
    <div class="demo-dialog-body">
      <p class="demo-p">
        The trigger calls <code>setOpen(true)</code> on its parent dialog. Because the
        dialog content only mounts while open, it is typically placed inside the dialog
        (for example to open a nested confirmation) — for opening from the page, bind
        <code>v-model</code> to a regular button.
      </p>
      <q-dialog-trigger label="Trigger button" />
    </div>
  </q-dialog>
</template>
```

</template>
</prose-show-case>

### API

<dnax-api name="QDialogTrigger">



</dnax-api>

## QDialogProvider — programmatic dialogs

Renders the stack of programmatic dialogs pushed with `$q.dialog.open()`. It is
mounted automatically by the outermost `<q-config-provider>` — no extra setup
needed. The component passed in `component` is rendered **as-is**: it must start
with a `<q-dialog>` root (Quasar-style) and drive it with
`useDialogPluginComponent()`. Closing (backdrop, Esc, ×, `onDialogOK`,
`onDialogCancel`) calls the matching resolver (`onOK`, `onCancel`, `onDismiss`) and
removes the entry. Legacy components emitting `ok / cancel / dismiss / close` still
work.

```ts
import { $q } from "@dnax/ui"

// Push a dialog onto the stack — <q-dialog-provider> renders it.
const confirm = $q.dialog.open({
  component: ConfirmDialog,      // SFC import or global component name
  title: "Confirm deletion",
  description: "This action cannot be undone.",
  persistent: true,
})

confirm
  .onOK(() => deleteAccount())
  .onCancel(() => console.log("cancelled"))
```

### The dialog component

```vue
<script setup lang="ts">
import { useDialogPluginComponent } from "@dnax/ui"

const { open, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>

<template>
  <!-- Le composant passé à $q.dialog.open() doit commencer par <q-dialog> -->
  <q-dialog v-model="open" @hide="onDialogHide">
    <q-dialog-header title="Confirm deletion" description="This action cannot be undone." show-close />
    <div class="body">…</div>
    <q-dialog-footer>
      <q-btn flat label="Cancel" @click="onDialogCancel" />
      <q-btn color="negative" label="Delete" @click="onDialogOK" />
    </q-dialog-footer>
  </q-dialog>
</template>
```

### API

<dnax-api name="QDialogProvider">



</dnax-api>
