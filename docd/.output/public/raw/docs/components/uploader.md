# Uploader

> A file upload zone with thumbnails, a fullscreen preview, count/size limits, filters and custom slots.

A file upload zone (Vant-style, dnax-designed): **<q-uploader>** binds a list of
files (`v-model`), shows image thumbnails (or a file icon for other types), removes
them with a × button, opens a fullscreen **preview on click**, and supports
`multiple`, `max-count`, `max-size` (with `@oversize`), `accept`, a `before-read`
hook, a custom `placeholder` / `upload-icon` / `inline-placeholder` add tile,
`details` (name + size under each tile), and custom `#default` / `#file` slots.

## Basic

Pick images (or any file), see the thumbnails, click one for a fullscreen preview,
× to remove.

<prose-show-case>
<dnax-demo-uploader demo="basic">



</dnax-demo-uploader>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const files = ref<any[]>([])
</script>

<template>
  <q-uploader v-model="files" multiple label="Add photos" />
  <p class="demo-p demo-meta">{{ files.length }} file(s)</p>
</template>
```

</template>
</prose-show-case>

## Max count & size

`max-count` caps the list, `max-size` rejects oversized files and fires
`@oversize`.

<prose-show-case>
<dnax-demo-uploader demo="limit">



</dnax-demo-uploader>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const files = ref<any[]>([])
const oversize = ref(0)
</script>

<template>
  <q-uploader v-model="files" multiple max-count="3" :max-size="2097152" @oversize="oversize++" />
  <p class="demo-p demo-meta">{{ files.length }} / 3 · oversize: {{ oversize }}</p>
</template>
```

</template>
</prose-show-case>

## Placeholder & icon

`placeholder` sets the add-tile text (overrides `label`), `upload-icon` swaps the
icon, and `inline-placeholder` puts icon and text on the same line.

<prose-show-case>
<dnax-demo-uploader demo="placeholder">



</dnax-demo-uploader>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const files = ref<any[]>([])
</script>

<template>
  <q-uploader v-model="files" placeholder="Add photos" />
  <q-uploader v-model="files" placeholder="Choose files" upload-icon="lucide:upload" inline-placeholder />
  <q-uploader v-model="files" placeholder="Attach" upload-icon="lucide:paperclip" />
</template>
```

</template>
</prose-show-case>

## Accept & non-image files

`accept` filters the picker; non-image files render as a file tile with the name.

<prose-show-case>
<dnax-demo-uploader demo="accept">



</dnax-demo-uploader>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const files = ref<any[]>([])
</script>

<template>
  <q-uploader v-model="files" accept=".pdf,image/*" multiple label="Photos & PDFs" />
</template>
```

</template>
</prose-show-case>

## File details

`details` (off by default) shows each file's name and formatted size under its
tile.

<prose-show-case>
<dnax-demo-uploader demo="details">



</dnax-demo-uploader>

<template v-slot:code="">

```vue
<script setup lang="ts">
const PRESET = [
  { url: "img-1.jpg", name: "Peaks.jpg", size: 128000 },
  { url: "img-2.jpg", name: "Coast.jpg", size: 210000 },
  { url: "img-3.jpg", name: "Forest.jpg", size: 96000 },
]
</script>

<template>
  <q-uploader v-model="files" details multiple />
  <!-- Chaque tuile affiche le nom et la taille du fichier en dessous. -->
</template>
```

</template>
</prose-show-case>

## Disabled

`disabled` dims the zone: no add button, no remove, no preview click.

<prose-show-case>
<dnax-demo-uploader demo="disabled">



</dnax-demo-uploader>

<template v-slot:code="">

```vue
<script setup lang="ts">
const PRESET = [
  { url: "img-1.jpg", name: "Peaks.jpg", size: 128000 },
  { url: "img-2.jpg", name: "Coast.jpg", size: 210000 },
  { url: "img-3.jpg", name: "Forest.jpg", size: 96000 },
]
</script>

<template>
  <q-uploader v-model="files" disabled />
</template>
```

</template>
</prose-show-case>

## Custom slots

`#default` replaces the add tile, `#file` replaces each thumbnail
(`{ item, index }`).

<prose-show-case>
<dnax-demo-uploader demo="slots">



</dnax-demo-uploader>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const files = ref<any[]>([])
</script>

<template>
  <q-uploader v-model="files" multiple>
    <template #default>
      <q-btn flat no-caps icon="lucide:image-plus" label="Choose files" />
    </template>
    <template #file="{ item, index }">
      <div class="badge">{{ index + 1 }}</div>
    </template>
  </q-uploader>
</template>
```

</template>
</prose-show-case>

## API

<dnax-api name="QUploader">



</dnax-api>
