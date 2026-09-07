<script setup lang="ts">
// QBar — barre fine façon Quasar : ligne compacte en haut d'une fenêtre /
// d'une app (contrôles fenêtre, menus, statut…). Utile pour Electron
// frameless, entêtes de dialogs desktop, etc. API : <q-bar dense dark>…
import type { Component } from "vue"

interface Props {
  /** Compact (hauteur réduite) */
  dense?: boolean
  /** Force le style sombre (fond foncé, texte clair) */
  dark?: boolean
  /** Balise rendue (défaut : div) */
  as?: Component | string
  /** Rôle ARIA (défaut : toolbar) — passer "" pour aucun */
  role?: string
  /** aria-label du toolbar */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  dense: false,
  dark: false,
  as: "div",
  role: "toolbar",
  label: "Bar",
})
</script>

<template>
  <component
    :is="props.as"
    class="q-bar"
    :class="{
      'q-bar--dense': dense,
      'q-bar--dark': dark,
    }"
    :role="role || undefined"
    :aria-label="role === 'toolbar' ? label : undefined"
  >
    <slot />
  </component>
</template>
