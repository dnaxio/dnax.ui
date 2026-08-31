<script setup lang="ts">
// QNotifyProvider — notifications $q.notify (vue-sonner / shadcn Sonner).
// Intégré dans QConfigProvider (rendu automatiquement par le plus externe),
// mais utilisable aussi en autonome : <q-notify-provider />.
import { Toaster } from "vue-sonner"
import "vue-sonner/style.css" // styles du Toaster (sinon les toasts sont rendus mais invisibles)

interface Props {
  /** Position des toasts (défaut : bottom-right) */
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  /** Couleurs riches par type (success/error/…) */
  richColors?: boolean
  /** Bouton fermer sur chaque toast */
  closeButton?: boolean
  /** Thème (défaut : light) */
  theme?: "light" | "dark" | "system"
}

const props = withDefaults(defineProps<Props>(), {
  position: "bottom-right",
  richColors: true,
  closeButton: true,
  theme: "light",
})
</script>

<template>
  <Toaster
    :position="props.position"
    :rich-colors="props.richColors"
    :close-button="props.closeButton"
    :theme="props.theme"
  />
</template>
