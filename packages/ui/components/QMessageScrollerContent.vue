<script setup lang="ts">
// QMessageScrollerContent — contenu du log (équivalent MessageScrollerContent).
// role="log" + aria-relevant="additions" : les lecteurs d'écran annoncent les nouveaux messages.
import { inject, ref, watch } from "vue"
import { qMessageScrollerKey } from "./QMessageScrollerProvider.vue"

interface Props {
  /** État de streaming (aria-busy) */
  ariaBusy?: boolean
}

const props = defineProps<Props>()
const ctx = inject(qMessageScrollerKey, null)
const el = ref<HTMLElement | null>(null)

watch(el, (v) => {
  if (ctx) ctx.contentEl.value = v
}, { immediate: true })
</script>

<template>
  <div
    ref="el"
    class="q-msg-scroller__content"
    role="log"
    aria-relevant="additions"
    :aria-busy="ariaBusy || undefined"
  >
    <slot />
  </div>
</template>
