<script setup lang="ts">
// QSidebarMenuButton — bouton/lien de menu (équivalent SidebarMenuButton).
import { computed } from "vue"
import type { Component } from "vue"
import { cn } from "../lib/utils"

interface Props {
  label?: string
  /** Icône Lucide */
  icon?: Component
  /** Lien natif (<a>) ; sinon bouton */
  href?: string
  /** État actif */
  active?: boolean
  activeClass?: string
  disable?: boolean
  /** Badge affiché à droite */
  badge?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  activeClass: "",
  disable: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const buttonClasses = computed(() =>
  cn(
    "q-sidebar__menu-button",
    props.active && "q-sidebar__menu-button--active",
    props.active && props.activeClass,
    props.disable && "q-sidebar__menu-button--disabled",
  ),
)

const onClick = (e: MouseEvent) => {
  if (props.disable) return
  emit("click", e)
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href || undefined"
    :disabled="href ? undefined : disable"
    class="q-sidebar__menu-button"
    :class="buttonClasses"
    :aria-current="active ? 'page' : undefined"
    @click="onClick"
  >
    <component :is="icon" v-if="icon" class="q-sidebar__menu-button-icon" aria-hidden="true" />
    <span v-if="label" class="q-sidebar__menu-button-label">{{ label }}</span>
    <slot v-else />
    <span v-if="badge !== undefined" class="q-sidebar__menu-badge">{{ badge }}</span>
  </component>
</template>
