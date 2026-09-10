# Back Header

> A navigation bar for detail screens — back button, title and trailing actions, with the iOS safe-area top inset.

A navigation bar for detail screens: a **back button** on the left, the
page `title`, and any actions on the right. It stacks under
other fixed bars automatically and always applies the iOS safe-area top
inset.

## Basic

`title` renders the page name; the back button emits
`@back` — wire it to `router.back()` or any custom
handler.

<prose-show-case>
<dnax-demo-back-header demo="basic">



</dnax-demo-back-header>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const backLog = ref("")
</script>

<template>
  <q-back-header title="Settings" @back="router.back()" />
</template>
```

</template>
</prose-show-case>

## Actions

The default slot renders **on the right**, after the title — the
natural spot for context actions (call, share, more…).

<prose-show-case>
<q-back-header title="Chat · Emma">
<q-btn flat="" round="" dense="" icon="lucide:phone" ariaLabel="Call">



</q-btn>


  <q-btn flat="" round="" dense="" icon="lucide:video" ariaLabel="Video call">



</q-btn>


  <q-btn flat="" round="" dense="" icon="lucide:more-vertical" ariaLabel="More">



</q-btn>
</q-back-header>

<template v-slot:code="">

```vue
<q-back-header title="Chat · Emma">
  <q-btn flat round dense icon="lucide:phone" aria-label="Call" />
  <q-btn flat round dense icon="lucide:video" aria-label="Video call" />
  <q-btn flat round dense icon="lucide:more-vertical" aria-label="More" />
</q-back-header>
```

</template>
</prose-show-case>

## Back button

`back-icon` swaps the default chevron for any Iconify name and
`back-label` sets the accessible label; `show-back`
removes the button entirely (e.g. a root/home bar).

<prose-show-case>
<dnax-demo-back-header demo="custom">



</dnax-demo-back-header>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const backLog = ref("")
</script>

<template>
  <q-back-header
    title="Product details"
    back-icon="lucide:arrow-left"
    back-label="Go back"
    @back="router.back()"
  />
</template>
```

</template>
</prose-show-case>

<prose-show-case>
<dnax-demo-back-header demo="noBack">



</dnax-demo-back-header>

<template v-slot:code="">

```vue
<q-back-header title="Home" :show-back="false" />
```

</template>
</prose-show-case>

## Styles

`dark` inverts the bar (for dark screens),
`translucent` adds a frosted-glass background (true = 70%, or
a percentage), and `fixed` pins the bar to the top of the
viewport — stacking below any previous fixed bar, with the following
page automatically offset.

<prose-show-case>
<dnax-demo-back-header demo="styles">



</dnax-demo-back-header>

<template v-slot:code="">

```vue
<q-back-header title="Fixed translucent" fixed translucent />

<q-back-header title="Dark" dark />

<q-back-header title="Translucent 50" fixed :translucent="50" />
```

</template>
</prose-show-case>

## Title slot

For a richer title (icon + text, badge…), use the `#title`
slot instead of the `title` prop.

<prose-show-case>
<dnax-demo-back-header demo="slot">



</dnax-demo-back-header>

<template v-slot:code="">

```vue
<q-back-header>
  <template #title>
    <span class="custom-title">✦ Custom title</span>
  </template>
  <q-btn flat round dense icon="lucide:share" aria-label="Share" />
</q-back-header>
```

</template>
</prose-show-case>

## API

<dnax-api name="QBackHeader">



</dnax-api>
