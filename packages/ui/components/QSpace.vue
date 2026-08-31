<script setup lang="ts">
// QSpace — API Quasar : <q-space />
// Remplit l'espace restant dans un conteneur flex (push les éléments à gauche/droite).
</script>

<template>
  <div class="q-space" aria-hidden="true" v-bind="$attrs">
    <slot />
  </div>
</template>
