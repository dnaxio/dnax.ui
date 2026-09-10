# Scroll Area

> A scrollable region with a custom, draggable scrollbar thumb.

A scrollable region with a custom scrollbar: the native one is hidden and a slim,
**draggable thumb** appears on scroll. **<q-scroll-area>** takes a constrained
`height` (any CSS value) and exposes `visible`, `delay` and per-part styles
(`bar-style`, `thumb-style`, `content-style`).

## Basic

The content scrolls natively, the custom thumb appears while scrolling and fades
out after `delay` ms. Scroll with the wheel, drag the thumb, or use the keyboard.

<prose-show-case>
<dnax-demo-scroll-area demo="basic">



</dnax-demo-scroll-area>

<template v-slot:code="">

```vue
<q-scroll-area style="height: 240px">
  <div v-for="i in 30" :key="i" class="log">
    Log entry {{ i }} — scrolling hides the native bar and shows a custom thumb.
  </div>
</q-scroll-area>
<!-- La barre custom apparaît au scroll et se masque après delay (350 ms). -->
```

</template>
</prose-show-case>

## Always visible

`visible` keeps the bar on screen at all times (no auto-hide) — useful when the
scrollable region isn't obvious.

<prose-show-case>
<dnax-demo-scroll-area demo="visible">



</dnax-demo-scroll-area>

<template v-slot:code="">

```vue
<q-scroll-area style="height: 200px" visible>
  <div v-for="i in 20" :key="i" class="row">{{ i }}. Visible scrollbar — no need to scroll to see it.</div>
</q-scroll-area>
```

</template>
</prose-show-case>

## Custom styling

`bar-style` / `bar-class` style the track, `thumb-style` / `thumb-class` the thumb
— width, color, radius, anything.

<prose-show-case>
<dnax-demo-scroll-area demo="custom">



</dnax-demo-scroll-area>

<template v-slot:code="">

```vue
<q-scroll-area
  style="height: 200px"
  bar-style="width: 10px; right: 4px"
  thumb-style="background: #1976d2; border-radius: 5px; opacity: 0.9"
>
  <div v-for="i in 20" :key="i" class="row">Custom thumb — {{ i }}.</div>
</q-scroll-area>
```

</template>
</prose-show-case>

## Content padding

`content-style` / `content-class` style the scrollable content itself — padding
included in the scrollable area.

<prose-show-case>
<dnax-demo-scroll-area demo="padding">



</dnax-demo-scroll-area>

<template v-slot:code="">

```vue
<q-scroll-area
  style="height: 220px"
  content-style="padding: 16px 20px"
>
  <p v-for="i in 6" :key="i" class="paragraph">
    Paragraph {{ i }} — the padding is applied to the scrolling content
    (content-style / content-class), so the thumb reflects the full scrollable area.
  </p>
</q-scroll-area>
```

</template>
</prose-show-case>

## Chat-like list

A realistic use: a message list with alternating bubbles — the custom scrollbar
keeps the UI clean.

<prose-show-case>
<dnax-demo-scroll-area demo="chat">



</dnax-demo-scroll-area>

<template v-slot:code="">

```vue
<q-scroll-area style="height: 260px">
  <div v-for="m in 14" :key="m" class="msg" :class="{ 'msg--me': m % 2 === 0 }">
    <div class="msg__bubble">{{ m % 2 === 0 ? 'You' : 'Ada' }} — message {{ m }}: a scrollable chat-like list.</div>
  </div>
</q-scroll-area>
```

</template>
</prose-show-case>

## API

<dnax-api name="QScrollArea">



</dnax-api>
