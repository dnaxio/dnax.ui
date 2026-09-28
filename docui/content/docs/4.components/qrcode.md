---
title: QR Code
description: A QR code rendered as a single SVG path — any content, any size, themeable
  colors, error-correction level and PNG/SVG export.
navigation:
  icon: lucide:qr-code
seo:
  title: QR Code (QQrcode)
  description: QQrcode — encode any string into a QR code rendered as one crisp SVG path, with size, quiet zone, colours, error correction and PNG/SVG export.
---

A QR code. **`<q-qrcode>`** encodes any string — a URL, a text, a vCard, a wifi
configuration — and renders it as a **single SVG path**, built from the module matrix:
crisp at any size, themeable through ordinary CSS colours, and rendered **on the server**
too (the encoding is pure JavaScript, so the code is already in the HTML for crawlers,
emails and OG images).

```vue
<q-qrcode value="https://dnax.io" />
```

## Content & size

The value is the whole API: change it and the code follows.

::prose-show-case
<dnax-demo-qrcode demo="basic"></dnax-demo-qrcode>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const url = ref("https://dnax.io/docs")
</script>

<template>
  <q-qrcode :value="url" />
  <q-input v-model="url" label="Encoded content" dense outlined />
</template>
```
::

An empty value renders nothing (no empty box), and a value too long for the requested error
correction level logs a warning and renders nothing rather than throwing.

## Size & quiet zone

`size` takes a number (px) or any CSS length — `"100%"` follows its container. `margin` is
the **quiet zone** in modules: 4 by default, because that is what a reader expects around
the code.

::prose-show-case
<dnax-demo-qrcode demo="sizes"></dnax-demo-qrcode>

#code

```vue
<template>
  <q-qrcode value="https://dnax.io" :size="96" :margin="2" />
  <q-qrcode value="https://dnax.io" :size="160" />
  <q-qrcode value="https://dnax.io" size="224px" />
</template>
```
::

Shrinking the quiet zone is only safe when the surrounding background is light and
uniform — a QR needs that breathing room to be found by the scanner.

## Colours

`color` and `background` accept any CSS colour, `var(--token)` included (they are plain
attributes, so a token resolves live — no re-render to follow the theme).

::prose-show-case
<dnax-demo-qrcode demo="colors"></dnax-demo-qrcode>

#code

```vue
<template>
  <q-qrcode value="https://dnax.io" color="var(--primary)" background="#fff" />
  <q-qrcode value="https://dnax.io" color="#0f172a" background="transparent" />
</template>
```
::

Keep **dark modules on a light background**: an inverted code (light modules on a dark
surface) is not read by every device. On a dark theme, either give the code its own light
surface (`background="#fff"`, the default) or keep it on a white card.

## Error correction & a centred logo

| `ecc` | Recovers up to | When |
| --- | --- | --- |
| `L` | ~7 % | clean screen, short payload |
| `M` *(default)* | ~15 % | the usual choice |
| `Q` | ~25 % | printed, a bit of wear |
| `H` | ~30 % | a logo in the middle, outdoor, damaged |

::prose-show-case
<dnax-demo-qrcode demo="ecc"></dnax-demo-qrcode>

#code

```vue
<template>
  <div class="qr-with-logo">
    <q-qrcode :value="url" ecc="H" :size="180" />
    <q-avatar size="44px" class="qr-logo"><q-icon name="lucide:box" /></q-avatar>
  </div>
</template>

<style scoped>
.qr-with-logo {
  position: relative;
  display: inline-flex;
}
.qr-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid #fff; /* liseré : le logo ne touche pas les modules */
}
</style>
```
::

A higher level means a denser code for the same payload: pick the lowest one that still
survives your worst case, and only use `H` when something is really covering the middle.

## Export

The component exposes `svg()` — the complete markup, for a download, the clipboard or an
`<img src="data:image/svg+xml…">` — and `toDataURL()` for a PNG drawn from the matrix
(client only: it needs a canvas).

::prose-show-case
<dnax-demo-qrcode demo="export"></dnax-demo-qrcode>

#code

```vue
<script setup lang="ts">
import { ref } from "vue"

const qr = ref()

const downloadPng = () => {
  const dataUrl = qr.value.toDataURL({ pixelSize: 8 })
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = "qrcode.png"
  link.click()
}

const copySvg = () => navigator.clipboard.writeText(qr.value.svg())
</script>

<template>
  <q-qrcode ref="qr" :value="url" />
  <q-btn label="PNG" @click="downloadPng" />
  <q-btn label="Copy SVG" @click="copySvg" />
</template>
```
::

`toDataURL({ pixelSize })` sets the number of pixels per module (8 by default, 16–20 for a
print-ready file), and `svg()` returns `""` when the value is not encodable.

## Recipes

**Everything is a string.** The field is not limited to URLs — a vCard, a wifi
configuration or a payment string work the same way:

```ts
const wifi = "WIFI:T:WPA;S:MonRéseau;P:motdepasse;;"
const card = ["BEGIN:VCARD", "VERSION:3.0", "N:Doe;Jane", "TEL:+33600000000", "END:VCARD"].join("\n")
```

**A code that follows the app state.** Bind `value` to a computed — the code re-encodes on
every change, and long URLs make it denser:

```ts
const shareUrl = computed(() => `https://app.example/invite/${invite.value.code}`)
```

**Accessibility.** The SVG carries `role="img"`; give it a meaningful `label` (the default
is “Code QR” — the content itself is rarely a good label for a screen reader).

**Print.** Prefer `svg()` (vector, sharp at any size) and a modulo of at least 4 px with a
quiet zone of 4 modules around the code.

## API

<dnax-api name="QQrcode"></dnax-api>
