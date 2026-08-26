<script setup lang="ts">
// QMessageScrollerButton — bouton flottant de retour au live edge (équivalent MessageScrollerButton).
// Visible uniquement quand il reste du contenu à atteindre dans cette direction.
import { computed, inject } from "vue"
import { ChevronDown, ChevronUp } from "@lucide/vue"
import { qMessageScrollerKey } from "./QMessageScrollerProvider.vue"

interface Props {
  /** Direction du saut */
  direction?: "start" | "end"
  label?: string
  behavior?: ScrollBehavior
}

const props = withDefaults(defineProps<Props>(), {
  direction: "end",
  label: "Aller au plus récent",
  behavior: "smooth",
})

const ctx = inject(qMessageScrollerKey, null)

const active = computed(() => {
  const s = ctx?.scrollable.value
  if (!s) return false
  return props.direction === "end" ? s.end : s.start
})

const onClick = () => {
  if (props.direction === "end") ctx?.scrollToEnd({ behavior: props.behavior })
  else ctx?.scrollToStart({ behavior: props.behavior })
}
</script>

<template>
  <button
    type="button"
    class="q-msg-scroller__button"
    :class="{ 'q-msg-scroller__button--active': active }"
    :tabindex="active ? 0 : -1"
    :aria-hidden="active ? undefined : 'true'"
    :aria-label="label"
    @click="onClick"
  >
    <component :is="direction === 'end' ? ChevronDown : ChevronUp" aria-hidden="true" />
  </button>
</template>
