<script setup lang="ts">
// QNavMenuTrigger — bouton de menu avec dropdown ; le contenu du slot par défaut
// est le panneau déroulant (positionné sous le trigger, ouvert au hover/clic).
import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { qNavMenuKey } from "./QNavMenu.vue"

let triggerSeq = 0

interface Props {
  /** Identifiant (auto-généré si absent) */
  name?: string
  label?: string
  /** Icône Iconify à gauche (ex. : "lucide:star") */
  icon?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disable: false,
})

const menu = inject(qNavMenuKey, null)
const resolvedName = props.name ?? `q-nav-${triggerSeq++}`
const el = ref<HTMLElement | null>(null)

onMounted(() => menu?.registerTrigger(resolvedName, el))

const isOpen = computed(() => menu?.openName.value === resolvedName)

const open = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = undefined
  }
  if (!props.disable) menu?.setOpen(resolvedName)
}
const close = () => {
  if (isOpen.value) menu?.setOpen(null)
}
const toggle = () => {
  if (props.disable) return
  menu?.setOpen(isOpen.value ? null : resolvedName)
}

// Fermeture différée : laisse le temps de traverser l'espace (6px) entre le
// trigger et le panneau — le mouseenter (re-entrée via le panneau) l'annule.
let closeTimer: ReturnType<typeof setTimeout> | undefined
const scheduleClose = () => {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    closeTimer = undefined
    close()
  }, 150)
}

onBeforeUnmount(() => {
  if (closeTimer) clearTimeout(closeTimer)
})

const triggerClasses = computed(() =>
  cn("q-nav-menu__trigger", isOpen.value && "q-nav-menu__trigger--open"),
)
</script>

<template>
  <div ref="el" class="q-nav-menu__trigger-wrap" @mouseenter="open" @mouseleave="scheduleClose">
    <button
      type="button"
      class="q-nav-menu__trigger"
      :class="triggerClasses"
      :disabled="disable"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @click="toggle"
    >
      <Icon :icon="icon" v-if="icon" class="q-nav-menu__trigger-icon" aria-hidden="true" />
      <span v-if="label" class="q-nav-menu__trigger-label">{{ label }}</span>
      <slot name="trigger" />
      <Icon
        :icon="icons.chevronDown"
        class="q-nav-menu__trigger-arrow"
        :class="{ 'q-nav-menu__trigger-arrow--rotated': isOpen }"
        aria-hidden="true"
      />
    </button>
    <div
      v-if="$slots.default"
      class="q-nav-menu__content"
      :class="{ 'q-nav-menu__content--open': isOpen }"
    >
      <slot />
    </div>
  </div>
</template>
