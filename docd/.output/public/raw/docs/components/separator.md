# Separator

> A thin divider used to visually group content — horizontal and vertical, with spaced, inset and dark modifiers.

A thin divider used to visually group content. It renders a `role="separator"` element, supports horizontal and vertical orientations, and offers `spaced`, `inset` and `dark` modifiers.

## Horizontal

<prose-show-case>

A paragraph before the separator.

<q-separator>



</q-separator>

A paragraph after it.

<q-separator spaced="">



</q-separator>

Spaced adds 8px above and below the line.

<q-separator inset="">



</q-separator>

Inset indents the line by 16px on each side.

<template v-slot:code="">

```vue
<p class="demo-p">A paragraph before the separator.</p>
<q-separator />
<p class="demo-p">A paragraph after it.</p>

<q-separator spaced />

<p class="demo-p">Spaced adds 8px above and below the line.</p>

<q-separator inset />

<p class="demo-p">Inset indents the line by 16px on each side.</p>
```

</template>
</prose-show-case>

Horizontal is the default orientation: a full-width 1px line. `spaced` adds vertical breathing room, `inset` pulls the line away from the edges.

## Vertical

<prose-show-case>
<dnax-demo-separator demo="vertical">



</dnax-demo-separator>

<template v-slot:code="">

```vue
<div class="demo-vbox">
  <span>Drafts</span>
  <q-separator vertical />
  <span>Sent</span>
  <q-separator vertical spaced />
  <span>Archive</span>
</div>
```

</template>
</prose-show-case>

`vertical` renders a 1px column that stretches to the height of its flex container — give the parent a fixed height or let `align-items: stretch` do the work.

## Dark & decorative

<prose-show-case>
<dnax-demo-separator demo="dark">



</dnax-demo-separator>

<template v-slot:code="">

```vue
<div class="demo-dark">
  <p class="demo-p">On a dark surface the default line is barely visible.</p>
  <q-separator dark />
  <p class="demo-p">Use dark for a light-on-dark divider.</p>
</div>
```

</template>
</prose-show-case>

`dark` switches to a light line for dark surfaces. `decorative` removes the ARIA separator role (`role="none"`) when the divider is purely visual.

## API

<dnax-api name="QSeparator">



</dnax-api>
