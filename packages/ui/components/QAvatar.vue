<script setup lang="ts">
// QAvatar — avatar : <q-avatar src="…" alt="Jean Dupont" color="primary" size="lg" />
// Image avec fallback automatique (initiales depuis alt, icône, ou slot) en cas d'erreur.
import { computed, ref } from "vue"
import { Icon } from "@iconify/vue"
import { colorValue, foregroundFor } from "../lib/colors"

const SIZE_MAP: Record<string, string> = { xs: "24px", sm: "32px", md: "48px", lg: "64px", xl: "96px" }

interface Props {
  /** URL de l'image */
  src?: string
  /** Texte alternatif (utilisé pour les initiales du fallback) */
  alt?: string
  /** Icône Iconify affichée en fallback (ex. : "lucide:user") */
  icon?: string
  /** Taille : xs | sm | md | lg | xl ou valeur CSS */
  size?: string
  /** Taille de la police (défaut : 40% de la taille) */
  fontSize?: string
  /** Couleur de fond (token ou hex) */
  color?: string
  /** Couleur du texte/icône */
  textColor?: string
  /** Coins légèrement arrondis (au lieu du cercle) */
  rounded?: boolean
  /** Coins droits */
  square?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "",
  textColor: "",
  rounded: false,
  square: false,
})

const imgOk = ref(true)

const avatarSize = computed(() => SIZE_MAP[props.size] ?? props.size)

const avatarStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    "--q-avatar-size": avatarSize.value,
  }
  if (props.color) {
    style.backgroundColor = colorValue(props.color)
    style.color = props.textColor ? colorValue(props.textColor) : foregroundFor(props.color)
  }
  if (props.fontSize) style.fontSize = props.fontSize
  return style
})

// Initiales depuis alt ("Jean Dupont" → "JD")
const initials = computed(() => {
  if (!props.alt) return ""
  const words = props.alt.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase()
  return (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase()
})

const onError = () => {
  imgOk.value = false
}
</script>

<template>
  <div
    class="q-avatar"
    :class="{
      'q-avatar--rounded': rounded,
      'q-avatar--square': square,
    }"
    :style="avatarStyle"
    role="img"
    :aria-label="alt || undefined"
  >
    <img
      v-if="src && imgOk"
      class="q-avatar__img"
      :src="src"
      :alt="alt || ''"
      @error="onError"
    />
    <div v-else class="q-avatar__fallback">
      <Icon :icon="icon" v-if="icon" aria-hidden="true" />
      <slot v-else>{{ initials }}</slot>
    </div>
  </div>
</template>
