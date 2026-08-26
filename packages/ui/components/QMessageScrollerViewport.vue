<script setup lang="ts">
// QMessageScrollerViewport — zone scrollable native (équivalent MessageScrollerViewport).
// Preserve la position quand l'historique est prépandu (MutationObserver), suit le live edge
// quand autoScroll est actif, applique la position d'ouverture par défaut.
import { inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { qMessageScrollerKey } from "./QMessageScrollerProvider.vue"

interface Props {
  /** Garde la vue quand des messages sont ajoutés au-dessus */
  preserveScrollOnPrepend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  preserveScrollOnPrepend: true,
})

const ctx = inject(qMessageScrollerKey, null)
const viewportRef = ref<HTMLElement | null>(null)

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let preservedScrollHeight = 0

const onScroll = () => ctx?.updateScrollState()

// Prépend (historique chargé au-dessus) : garde le lecteur en place.
const onMutation = (records: MutationRecord[]) => {
  const content = ctx?.contentEl.value
  const viewport = ctx?.viewportEl.value
  if (!content || !viewport || !ctx) return

  const prepend = records.some(
    (r) => r.addedNodes.length > 0 && r.previousSibling === null && r.target === content,
  )

  if (prepend) {
    preservedScrollHeight = content.scrollHeight
    requestAnimationFrame(() => {
      if (ctx.pinned.value && ctx.autoScroll.value) {
        ctx.scrollToEnd({ behavior: "auto" })
      }
      else if (props.preserveScrollOnPrepend) {
        const delta = content.scrollHeight - preservedScrollHeight
        if (delta > 0) viewport.scrollTop += delta
      }
      ctx.updateScrollState()
    })
  }
  else if (ctx.pinned.value && ctx.autoScroll.value) {
    viewport.scrollTop = viewport.scrollHeight
    ctx.updateScrollState()
  }
}

// Position d'ouverture par défaut (start / end / last-anchor)
const applyDefaultPosition = async () => {
  await nextTick()
  requestAnimationFrame(() => {
    if (!ctx) return
    const pos = ctx.defaultPosition.value
    if (pos === "end") ctx.scrollToEnd({ behavior: "auto" })
    else if (pos === "start") ctx.scrollToStart({ behavior: "auto" })
    else if (pos === "last-anchor") {
      const anchors = ctx.items.value.filter((i) => i.anchor)
      const last = anchors[anchors.length - 1]
      if (last) ctx.scrollToMessage(last.id, { align: "start", behavior: "auto", scrollMargin: ctx.margin.value })
    }
    ctx.updateScrollState()
  })
}

onMounted(() => {
  if (!ctx) return
  ctx.viewportEl.value = viewportRef.value
  applyDefaultPosition()

  watch(
    () => ctx.contentEl.value,
    (el) => {
      if (!el) return
      resizeObserver = new ResizeObserver(() => {
        if (ctx && ctx.pinned.value && ctx.autoScroll.value) ctx.scrollToEnd({ behavior: "auto" })
        ctx?.updateScrollState()
      })
      resizeObserver.observe(el)
      mutationObserver = new MutationObserver(onMutation)
      mutationObserver.observe(el, { childList: true })
    },
  )
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
})
</script>

<template>
  <div
    ref="viewportRef"
    class="q-msg-scroller__viewport"
    role="region"
    aria-label="Messages"
    tabindex="0"
    @scroll="onScroll"
  >
    <slot />
  </div>
</template>
