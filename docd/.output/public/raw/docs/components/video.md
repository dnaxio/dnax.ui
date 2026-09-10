# Video

> A Video.js-powered player for mp4, webm, HLS and YouTube — poster, ratio, placeholder and playback events.

A full-featured video player powered by **Video.js**: **<q-video>** plays `mp4`,
`webm`, HLS (`.m3u8`), **YouTube** and more with a poster, a configurable `ratio`
(16/9 by default), a loading `placeholder` and standard `controls` / `autoplay` /
`loop` / `muted` props. Emits playback events (`@play`, `@pause`, `@ended`,
`@timeupdate`, `@loadedmetadata`, `@volumechange`, `@ready`) and exposes player
methods (`play`, `pause`, `seek`…).

## Basic

A `src` and an optional `poster` — the file type is detected from the URL.

<prose-show-case>
<dnax-demo-video demo="basic">



</dnax-demo-video>

<template v-slot:code="">

```vue
<script setup lang="ts">
const PEXELS_BASIC = "https://www.pexels.com/download/video/7313654/"
</script>

<template>
  <q-video :src="PEXELS_BASIC" />
</template>
```

</template>
</prose-show-case>

## Pexels

Direct file links (like Pexels downloads) work too — the browser follows the
redirect to the mp4.

<prose-show-case>
<dnax-demo-video demo="pexels">



</dnax-demo-video>

<template v-slot:code="">

```vue
<script setup lang="ts">
const PEXELS = "https://www.pexels.com/download/video/28561463"
</script>

<template>
  <q-video :src="PEXELS" />
</template>
```

</template>
</prose-show-case>

## Ratio & width

`ratio` sets the frame (16/9 default, 4/3, 1/1 or `none`) and `width` caps the
player.

<prose-show-case>
<dnax-demo-video demo="ratio">



</dnax-demo-video>

<template v-slot:code="">

```vue
<script setup lang="ts">
const PEXELS_BASIC = "https://www.pexels.com/download/video/7313654/"
</script>

<template>
  <q-video :src="MP4" :poster="POSTER" ratio="4/3" width="420px" />
</template>
```

</template>
</prose-show-case>

## Autoplay, muted, loop

The classic hero background: `autoplay muted loop` — the default skin still shows
its controls on hover.

<prose-show-case>
<dnax-demo-video demo="autoplay">



</dnax-demo-video>

<template v-slot:code="">

```vue
<script setup lang="ts">
const PEXELS_BASIC = "https://www.pexels.com/download/video/7313654/"
</script>

<template>
  <q-video
    :src="MP4"
    :poster="POSTER"
    autoplay
    muted
    loop
  />
</template>
```

</template>
</prose-show-case>

## YouTube

YouTube URLs (`youtube.com/watch?v=…`, `youtu.be/…`) are detected automatically and
played through the YouTube tech.

<prose-show-case>
<dnax-demo-video demo="youtube">



</dnax-demo-video>

<template v-slot:code="">

```vue
<script setup lang="ts">
const YT = "https://www.youtube.com/watch?v=oTxi562M-Bs&list=RDoTxi562M-Bs&start_radio=1"
</script>

<template>
  <q-video :src="YT" />
</template>
```

</template>
</prose-show-case>

## HLS streaming

Pass an `.m3u8` URL — HLS is handled by Video.js out of the box.

<prose-show-case>
<dnax-demo-video demo="hls">



</dnax-demo-video>

<template v-slot:code="">

```vue
<script setup lang="ts">
const HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
</script>

<template>
  <q-video :src="HLS" :poster="POSTER" />
</template>
```

</template>
</prose-show-case>

## Placeholder

The `#placeholder` slot shows custom content over the player while the video loads
— it disappears once the media is ready, and a click starts playback.

<prose-show-case>
<dnax-demo-video demo="placeholder">



</dnax-demo-video>

<template v-slot:code="">

```vue
<q-video :src="MP4">
  <template #placeholder>
    <div class="loading">Loading video…</div>
  </template>
</q-video>
```

</template>
</prose-show-case>

## Events

`@timeupdate`, `@loadedmetadata`, `@play` / `@pause` keep your UI in sync.

<prose-show-case>
<dnax-demo-video demo="events">



</dnax-demo-video>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const t = ref(0)
const d = ref(0)
const state = ref("idle")
</script>

<template>
  <q-video
    :src="MP4"
    :poster="POSTER"
    @timeupdate="({ currentTime }) => t = currentTime"
    @loadedmetadata="({ duration }) => d = duration"
    @play="state = 'playing'"
    @pause="state = 'paused'"
  />
  <p class="demo-p demo-meta">t = {{ t.toFixed(1) }}s · duration = {{ d.toFixed(1) }}s · state = {{ state }}</p>
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QVideo">



</dnax-api>
