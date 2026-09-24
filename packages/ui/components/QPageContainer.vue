<script setup lang="ts">
// QPageContainer — zone de contenu du QLayout (modèle Quasar) : l'élément qui
// enveloppe la ou les pages, typiquement le <router-view />.
//
//   <q-layout view="hHh LpR fFf">
//     <q-header>…</q-header>
//     <q-sidebar side="left" show-if-above>…</q-sidebar>
//     <q-page-container>
//       <q-page padding>…</q-page>
//     </q-page-container>
//   </q-layout>
//
// Il occupe la cellule « page » du QLayout (règle `.q-layout > *`) et sert de colonne
// flex : la page qu'il contient remplit la zone (cf. styles/main.css).
//
// Compensation des barres `fixed` : le conteneur ne l'applique que s'il **ne contient
// pas** de q-page — dans ce cas c'est la page qui s'en charge (règle `:has()` du CSS,
// donc jamais de double padding). Les hauteurs sont mesurées et publiées en variables
// par `lib/fixedLayout.ts`, exactement comme pour q-page.
import { ref } from "vue"
import { useFixedBarOffset } from "../lib/fixedLayout"

const rootEl = ref<HTMLElement | null>(null)

useFixedBarOffset(rootEl, "page")
</script>

<template>
  <div ref="rootEl" class="q-page-container" v-bind="$attrs">
    <slot />
  </div>
</template>
