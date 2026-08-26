<script setup lang="ts">
// QNavMenuItem — lien/bouton de navigation (équivalent NavigationMenuLink).
import { computed, inject } from "vue"
import type { Component } from "vue"
import { cn } from "../lib/utils"
import { qNavMenuKey } from "./QNavMenu.vue"

interface Props {
  label?: string
  /** Icône Lucide */
  icon?: Component
  /** Lien natif (<a>) ; sinon bouton */
  href?: string
  /** État actif (aria-current="page") */
  active?: boolean
  activeClass?: string
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  activeClass: "",
  disable: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const menu = inject(qNavMenuKey, null)

const onClick = (e: MouseEvent) => {
  if (props.disable) return
  menu?.setOpen(null) // ferme les dropdowns après navigation
  emit("click", e)
}

const itemClasses = computed(() =>
  cn(
    "q-nav-menu__item",
    props.active && "q-nav-menu__item--active",
    props.active && props.activeClass,
    props.disable && "q-nav-menu__item--disabled",
  ),
)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href || undefined"
    :disabled="href ? undefined : disable"
    class="q-nav-menu__item"
    :class="itemClasses"
    :aria-current="active ? 'page' : undefined"
    @click="onClick"
  >
    <component :is="icon" v-if="icon" class="q-nav-menu__item-icon" aria-hidden="true" />
    <span v-if="label" class="q-nav-menu__item-label">{{ label }}</span>
    <slot v-else />
  </component>
</template>
