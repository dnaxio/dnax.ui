# v-close

> Closes the closest overlay (dialog, bottom sheet…) from any element inside it — the Quasar v-close-popup equivalent.

`v-close` closes the closest **overlay** (dialog, bottom sheet…) when the element
is clicked — the Quasar `v-close-popup` equivalent. No `@click`, no `v-model` ref
to reach for: put it on any button or row inside the overlay content.

## Setup

The `@dnax/ui` Nuxt module registers the directive automatically (client-side
only — overlays don't exist during SSR):

```ts
// @dnax/ui Nuxt module → enregistrée automatiquement (mode client) :
// <q-btn v-close /> fonctionne dans toutes les pages.

// Sans le module Nuxt (ou enregistrement manuel) :
import { vClose } from "@dnax/ui"

app.directive("close", vClose)
```

## Usage

Inside a `q-dialog` — header, content or footer:

```html
<q-dialog v-model="open">
  <q-dialog-header title="Delete file?" description="This action cannot be undone." />
  <div class="demo-body">
    <p class="demo-p">
      No @click handler needed — <code>v-close</code> closes the closest
      marked overlay (QDialog, QBottomSheet…).
    </p>
    <div class="guide-row">
      <q-btn color="negative" label="Close (v-close)" v-close />
      <q-btn flat label="Stays open (v-close=false)" v-close="false" />
    </div>
  </div>
</q-dialog>
```

And identically inside a `q-bottom-sheet`:

```html
<q-bottom-sheet v-model="openSheet">
  <q-bottom-sheet-header title="Sheet actions" description="v-close works the same inside a bottom sheet" />
  <div class="demo-body">
    <div class="guide-row">
      <q-btn color="primary" label="Close sheet (v-close)" v-close />
    </div>
  </div>
</q-bottom-sheet>
```

## Live demo

<prose-show-case>
<dnax-demo-close demo="basic">



</dnax-demo-close>

<template v-slot:code="">

```vue
<script setup lang="ts">
import { ref } from "vue"

const openDialog = ref(false)
const openSheet = ref(false)
</script>

<template>
  <div class="guide-row">
    <q-btn no-caps color="primary" label="Open dialog" @click="openDialog = true" />
    <q-btn no-caps color="secondary" label="Open bottom sheet" @click="openSheet = true" />
  </div>

  <q-dialog v-model="openDialog">
    <q-dialog-header title="Delete file?" description="v-close closes this dialog from anywhere inside it." />
    <div class="demo-body">
      <p class="demo-p">
        Both buttons live inside the dialog. The flat one is disabled through
        <code>v-close="false"</code> — clicking it keeps the dialog open.
      </p>
      <div class="guide-row">
        <q-btn color="negative" label="Close (v-close)" v-close />
        <q-btn flat label="Stays open (v-close=false)" v-close="false" />
      </div>
    </div>
  </q-dialog>

  <q-bottom-sheet v-model="openSheet">
    <q-bottom-sheet-header title="Sheet actions" description="v-close works the same inside a bottom sheet" />
    <div class="demo-body">
      <div class="guide-row">
        <q-btn color="primary" label="Close sheet (v-close)" v-close />
      </div>
    </div>
  </q-bottom-sheet>
</template>
```

</template>
</prose-show-case>

## Directive value

<table>
<thead>
  <tr>
    <th>
      Usage
    </th>
    
    <th>
      Effect
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        <q-btn v-close />
      </code>
    </td>
    
    <td>
      On click, closes the closest marked overlay (dialog, bottom sheet…). Works on any element, not only buttons.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <q-btn v-close="false" />
      </code>
    </td>
    
    <td>
      Directive disabled: the click is ignored (only an explicit <code>
        false
      </code>
      
       disables).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        <q-btn v-close="true" />
      </code>
    </td>
    
    <td>
      Same as a bare <code>
        v-close
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

## How it works

Overlays register themselves by marking their root element
(`markOverlayClose`) — currently `q-dialog` and `q-bottom-sheet` (including
their `$q.dialog` / `$q.bottomSheet` hosts). On click, `v-close` walks up from
the clicked element to the closest marker and calls its close handler — so with
nested overlays, the **innermost** one closes. The click listener is removed when
the element unmounts.

<table>
<thead>
  <tr>
    <th>
      Export
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Role
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        markOverlayClose(el, close)
      </code>
    </td>
    
    <td>
      <code>
        function
      </code>
    </td>
    
    <td>
      Internal: marks an element as a closeable overlay (used by <code>
        QDialog
      </code>
      
      , <code>
        QBottomSheet
      </code>
      
      ).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closeParentOverlay(el)
      </code>
    </td>
    
    <td>
      <code>
        function
      </code>
    </td>
    
    <td>
      Closes the closest overlay above <code>
        el
      </code>
      
       — what <code>
        v-close
      </code>
      
       calls on click.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        vClose
      </code>
    </td>
    
    <td>
      <code>
        directive
      </code>
    </td>
    
    <td>
      The <code>
        v-close
      </code>
      
       directive object (mounted/unmounted click handling).
    </td>
  </tr>
</tbody>
</table>
