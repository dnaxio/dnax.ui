# Image

> A responsive image container — aspect ratio, object-fit, loading spinner, blur-up placeholder and error slot.

A responsive image container. **<q-img>** keeps a `ratio` (aspect-ratio), fits the
picture with `object-fit` (`cover` / `contain`), and handles the full loading
lifecycle: spinner, low-res `placeholder-src` and an `#error` slot.

## Basic

`ratio="16/9"` fixes the box before the image arrives — no layout shift.

<prose-show-case>
<dnax-demo-img demo="basic">



</dnax-demo-img>

<template v-slot:code="">

```vue
<script setup lang="ts">
const photo = "https://images.unsplash.com/photo-1595411425732-e69c1abe2763"
  + "?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
</script>

<template>
  <q-img :src="photo" ratio="16/9" />
</template>
```

</template>
</prose-show-case>

## Loading

A spinner (or a custom `#loading` slot) appears automatically while the image
loads. The `loading` prop forces the state — useful for skeletons and optimistic
UIs.

<prose-show-case>
<dnax-demo-img demo="loading">



</dnax-demo-img>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const photo = "https://images.unsplash.com/photo-1595411425732-e69c1abe2763"
  + "?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const forcedLoading = ref(false)

const toggleLoading = () => {
  forcedLoading.value = true
  setTimeout(() => (forcedLoading.value = false), 2200)
}
</script>

<template>
  <q-img
    :src="photo"
    ratio="16/9"
    :loading="forcedLoading"
    spinner-color="primary"
    spinner-size="42px"
  />
  <p class="demo-p demo-p--action">
    <q-btn size="sm" outline color="primary" no-caps :loading="forcedLoading" label="Simulate loading" @click="toggleLoading" />
  </p>
</template>
```

</template>
</prose-show-case>

## Placeholder

`placeholder-src` displays a low-resolution image while the full image loads — the
classic blur-up pattern. On a fast connection it flashes briefly; the main image
fades in when ready.

<prose-show-case>
<dnax-demo-img demo="placeholder">



</dnax-demo-img>

<template v-slot:code="">

```vue
<script setup lang="ts">
const photo = "https://images.unsplash.com/photo-1595411425732-e69c1abe2763"
  + "?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const thumb = "https://images.unsplash.com/photo-1595411425732-e69c1abe2763"
  + "?q=40&w=40&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
</script>

<template>
  <q-img
    :src="photo"
    :placeholder-src="thumb"
    ratio="16/9"
  />
  <!-- the low-res placeholder shows while the full image loads, then fades out -->
</template>
```

</template>
</prose-show-case>

## Overlay & caption

The default slot is an overlay on top of the image — ideal for captions, badges
and actions pinned to the bottom edge.

<prose-show-case>
<dnax-demo-img demo="caption">



</dnax-demo-img>

<template v-slot:code="">

```vue
<script setup lang="ts">
const photo = "https://images.unsplash.com/photo-1595411425732-e69c1abe2763"
  + "?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
</script>

<template>
  <q-img
    :src="photo"
    ratio="16/9"
    alt="Workspace"
  >
    <q-text-caption position="bottom" absolute fit title="Morning workspace" subtitle="Unsplash · free to use" />
  </q-img>
</template>
```

</template>
</prose-show-case>

## Error

When `src` fails to load, the `#error` slot replaces the spinner — any content
works.

<prose-show-case>
<dnax-demo-img demo="error">



</dnax-demo-img>

<template v-slot:code="">

```vue
<q-img src="https://example.com/broken.jpg" ratio="16/9">
  <template #error>
    <div class="q-img__error">
      <q-icon name="lucide:image-off" size="28px" />
      <span>Failed to load</span>
    </div>
  </template>
</q-img>
```

</template>
</prose-show-case>

## API

<dnax-api name="QImg">



</dnax-api>
