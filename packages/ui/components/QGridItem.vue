<script setup lang="ts">
// QGridItem — cellule de la grille style Vant : <q-grid-item icon="lucide:photo" text="Photos" badge="3" />
// À utiliser dans <q-grid :column-num="…">. Affiche une icône (ou un slot) + un
// texte, avec badge / point de notification, effet cliquable et navigation (href).
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"

interface Props {
  /** Icône Iconify (ex. : "lucide:home") */
  icon?: string
  /** Texte sous l'icône */
  text?: string
  /** Couleur de l'icône (token ou hex) — sinon celle du QGrid (icon-color) */
  iconColor?: string
  /** Badge numérique (masqué si 0 ou absent) */
  badge?: number | string
  /** Point de notification (sans nombre) */
  dot?: boolean
  /** Lien (navigation) — rend la cellule en <a> */
  href?: string
  /** Ouvre le lien dans un nouvel onglet */
  target?: string
  /** Clic désactivé */
  disable?: boolean
  /** Classe additionnelle sur la cellule */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: "",
  text: "",
  iconColor: "",
  badge: "",
  dot: false,
  href: "",
  target: "",
  disable: false,
  class: "",
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const hasBadge = computed(
  () =>
    typeof props.badge === "number" ? props.badge > 0 : String(props.badge).length > 0,
)
const badgeDisplay = computed(() =>
  typeof props.badge === "number" && props.badge > 99 ? "99+" : String(props.badge),
)

const iconStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.iconColor) style.color = props.iconColor
  return style
})

const cellClasses = computed(() =>
  cn(
    "q-grid-item",
    props.disable && "q-grid-item--disabled",
    props.dot && "q-grid-item--dot",
    hasBadge.value && "q-grid-item--badge",
    props.href && "q-grid-item--link",
    props.class,
  ),
)

const onClick = (e: MouseEvent) => {
  if (props.disable) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  emit("click", e)
}
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :class="cellClasses"
    @click="onClick"
  >
    <span v-if="dot" class="q-grid-item__dot" aria-hidden="true" />
    <span v-if="hasBadge" class="q-grid-item__badge">{{ badgeDisplay }}</span>

    <span class="q-grid-item__content">
      <Icon v-if="icon" :icon="icon" class="q-grid-item__icon" :style="iconStyle" aria-hidden="true" />
      <slot name="icon" v-else />
      <span v-if="text" class="q-grid-item__text">{{ text }}</span>
      <span v-else-if="!icon" class="q-grid-item__text"><slot /></span>
    </span>
  </a>
  <div v-else :class="cellClasses" @click="onClick">
    <span v-if="dot" class="q-grid-item__dot" aria-hidden="true" />
    <span v-if="hasBadge" class="q-grid-item__badge">{{ badgeDisplay }}</span>

    <span class="q-grid-item__content">
      <Icon v-if="icon" :icon="icon" class="q-grid-item__icon" :style="iconStyle" aria-hidden="true" />
      <slot name="icon" v-else />
      <span v-if="text" class="q-grid-item__text">{{ text }}</span>
      <span v-else-if="!icon" class="q-grid-item__text"><slot /></span>
    </span>
  </div>
</template>
