<script setup lang="ts">
// QBackHeader — barre de retour : <q-back-header title="Détails" fixed @back="router.back()" />
// Bouton retour + titre + actions à droite ; safe-area top intégrée.
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"

interface Props {
  /** Titre de la page */
  title?: string
  /** Affiche le bouton retour */
  showBack?: boolean
  /** Icône Iconify du bouton retour (défaut : lucide:chevron-left) */
  backIcon?: string
  /** Libellé accessible du bouton retour */
  backLabel?: string
  /** Barre fixée en haut de l'écran */
  fixed?: boolean
  /** Thème sombre */
  dark?: boolean
  /** Fond translucide (frosted glass) : true = 70%, ou valeur % */
  translucent?: boolean | number
}

const props = withDefaults(defineProps<Props>(), {
  showBack: true,
  backLabel: "Retour",
  fixed: false,
  dark: false,
})

const emit = defineEmits<{ back: [] }>()

const translucentStyle = computed<Record<string, string> | undefined>(() =>
  props.translucent === true || typeof props.translucent === "number"
    ? { "--q-translucent-opacity": `${typeof props.translucent === "number" ? props.translucent : 70}%` }
    : undefined,
)

const headerClasses = computed(() =>
  cn(
    "q-back-header",
    props.fixed && "q-back-header--fixed",
    props.dark && "q-back-header--dark",
    (props.translucent === true || typeof props.translucent === "number") && "q-back-header--translucent",
  ),
)
</script>

<template>
  <header class="q-back-header" :class="headerClasses" :style="translucentStyle">
    <button
      v-if="showBack"
      type="button"
      class="q-back-header__back"
      :aria-label="backLabel"
      @click="emit('back')"
    >
      <Icon :icon="backIcon || icons.chevronLeft" aria-hidden="true" />
    </button>
    <div class="q-back-header__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="q-back-header__actions">
      <slot />
    </div>
  </header>
</template>
