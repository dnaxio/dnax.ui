# Page Layout

> The page content zone — automatic offsets for the surrounding fixed bars, plus optional virtual scrolling.

The page content zone. **<q-page>** automatically receives the offsets of the
fixed bars around it: a `padding-top` equal to the height of the fixed bars before
it (`q-header`, `q-back-header`…) and a `padding-bottom` for the ones after it
(`q-footer`) — so the content is never hidden behind them while scrolling. The
`virtual` prop switches it to a windowed renderer (via `QVirtualScroll`) for very
long lists.

## Example

<prose-show-case>
<q-page>



</q-page>

<template v-slot:code="">

```vue
<q-page />
```

</template>
</prose-show-case>

`<q-page>` renders no visible content of its own — the preview above is empty, and
the offsets only matter when fixed bars surround the page. Inside a `<q-app>`,
place the fixed `q-header` / `q-back-header` before it and the fixed `q-footer`
after it; the padding is recomputed automatically (heights are observed, and bars
that mount or unmount are detected too).

For very long lists, pass `virtual` together with `items` to render only the
visible slice — `item-key`, `virtual-scroll-item-size` and the
`virtual-scroll-slice-*` props tune the window, and the `#before` / `#after` slots
receive the sticky start/end content.

## API

<dnax-api name="QPage">



</dnax-api>
