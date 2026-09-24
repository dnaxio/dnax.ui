<script setup lang="ts">
// QApp — conteneur racine de l'application : une div + le slot, en colonne flex sur
// toute la largeur et une hauteur d'écran. C'est le pendant **pur CSS** de
// `flex h-screen w-full` (cf. `styles/main.css` : `display: flex; flex-direction: column;
// width: 100%; height: 100dvh`) — les classes sont aussi posées sur la div pour les
// apps Tailwind.
// Les barres (`fixed` ou non) et leurs offsets sont résolus dans son sous-arbre par
// `lib/fixedLayout.ts`, d'où le `<slot />` qui doit rester son unique enfant.
</script>

<template>
  <div class="q-app flex h-screen w-full" v-bind="$attrs">
    <slot />
  </div>
</template>
