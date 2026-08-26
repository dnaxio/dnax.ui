---
title: Theming
description: Customize DanxUI — colors, per-component default props, radius scale.
navigation:
  icon: lucide:palette
---

::prose-lead
Theming goes through **`QConfigProvider`**, the root container of any DanxUI application. It provides **colors** (CSS variables) and **per-component default props** (`componentProps`) to its whole subtree.
::

## Colors

The provider automatically computes a **readable foreground** (white or dark) for every color:

```vue
<q-config-provider :theme="{
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    positive: '#22c55e',
    negative: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    dark: '#0f172a',
  },
}">
```

Each color becomes a local CSS variable (`--primary`, `--primary-foreground`, …) consumed by every component (`color="primary"`, `color="negative"`, …). Providers **nest**: the closest one wins.

## componentProps — default props

The `componentProps` key provides **per-component default props**, Quasar `$q.config` style:

```vue
<q-config-provider :theme="{
  componentProps: {
    default: { radius: 'md' },          // applied to ALL components
    QBtn:    { radius: 'none' },        // takes precedence: square buttons
    QInput:  { dense: true },           // compact inputs
  },
}">
```

- **`default`** applies to every component.
- A **`<Component>`** key (e.g. `QBtn`) overrides `default`, **prop by prop**.
- An **explicit prop** on the component always wins over the theme.

## Radius scale (`radius`)

The `radius` prop accepts a scale, applied through the `--q-radius` CSS variable:

| Value | Radius |
|---|---|
| `none` | `0px` (default) |
| `xs` | `2px` |
| `sm` | `4px` |
| `md` | `8px` |
| `lg` | `16px` |

```vue
<q-btn radius="lg" />
<q-input radius="sm" />
<q-card radius="md" />
<q-dialog radius="lg" />
```

::prose-show-case
#default
  <div class="flex flex-col gap-4 not-prose">
    <div class="flex flex-wrap items-center gap-3">
      <q-btn v-for="r in ['none', 'xs', 'sm', 'md', 'lg']" :key="r" :radius="r" color="primary" :label="r" />
    </div>
    <q-input radius="lg" label="Input radius lg" outlined stack-label />
  </div>
#code
  ```vue
  <q-btn v-for="r in ['none', 'xs', 'sm', 'md', 'lg']" :key="r" :radius="r" color="primary" :label="r" />
  <q-input radius="lg" label="Input radius lg" outlined stack-label />
  ```
::

### Precedence

1. **Explicit prop** on the component (including when it changes at runtime).
2. **`componentProps.<Component>`** (e.g. `QBtn`).
3. **`componentProps.default`**.
4. Default: `0px` (square).

On buttons and inputs, a bare `radius` (`<q-btn radius />`) keeps the native **pill** shape. `square` / `maximized` / `filled` variants keep their specific corners (they write `border-radius` directly, not the variable).

## Full example

```vue
<q-config-provider :theme="{
  colors: { primary: '#3b82f6', negative: '#ef4444' },
  componentProps: {
    default: { radius: 'md' },
    QBtn: { radius: 'lg' },
  },
}">
  <q-app>
    <q-page>
      <q-btn color="primary" label="Send" />
      <q-input label="Email" outlined stack-label />
    </q-page>
  </q-app>
</q-config-provider>
```
