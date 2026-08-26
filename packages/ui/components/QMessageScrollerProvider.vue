<script lang="ts">
// QMessageScrollerProvider — possède l'état de scroll (équivalent MessageScrollerProvider shadcn-vue).
// Contexte : autoScroll, ancrage des tours, visibilité, commandes de scroll.
import { computed, inject } from "vue"
import type { InjectionKey, Ref } from "vue"

export interface MessageScrollerItemReg {
  id: string
  el: Ref<HTMLElement | null>
  anchor: boolean
}

export interface ScrollToOptions {
  align?: "start" | "center" | "end"
  behavior?: ScrollBehavior
  scrollMargin?: number
}

export interface MessageScrollerContext {
  autoScroll: Readonly<Ref<boolean>>
  defaultPosition: Readonly<Ref<"start" | "end" | "last-anchor">>
  peek: Readonly<Ref<number>>
  margin: Readonly<Ref<number>>
  threshold: Readonly<Ref<number>>
  viewportEl: Ref<HTMLElement | null>
  contentEl: Ref<HTMLElement | null>
  pinned: Readonly<Ref<boolean>>
  scrollable: Readonly<Ref<{ start: boolean; end: boolean }>>
  currentAnchorId: Readonly<Ref<string | null>>
  visibleIds: Readonly<Ref<string[]>>
  items: Readonly<Ref<MessageScrollerItemReg[]>>
  registerItem: (item: MessageScrollerItemReg) => void
  unregisterItem: (id: string) => void
  updateScrollState: () => void
  scrollToEnd: (opts?: { behavior?: ScrollBehavior }) => void
  scrollToStart: (opts?: { behavior?: ScrollBehavior }) => void
  scrollToMessage: (id: string, opts?: ScrollToOptions) => boolean
}

export const qMessageScrollerKey: InjectionKey<MessageScrollerContext> = Symbol("q-message-scroller")

/** Commande le transcript depuis l'extérieur (saut vers un message, début, fin). */
export function useMessageScroller() {
  const ctx = inject(qMessageScrollerKey, null)
  if (!ctx) throw new Error("useMessageScroller doit être utilisé dans un QMessageScrollerProvider")
  return {
    scrollToMessage: ctx.scrollToMessage,
    scrollToEnd: ctx.scrollToEnd,
    scrollToStart: ctx.scrollToStart,
  }
}

/** Position du lecteur : anchor courant + messages visibles. */
export function useMessageScrollerVisibility() {
  const ctx = inject(qMessageScrollerKey, null)
  return computed(() => ({
    currentAnchorId: ctx?.currentAnchorId.value ?? null,
    visibleMessageIds: ctx?.visibleIds.value ?? [],
  }))
}

/** Bords encore scrollables (lecture du scroll en JS). */
export function useMessageScrollerScrollable() {
  const ctx = inject(qMessageScrollerKey, null)
  return computed(() => ctx?.scrollable.value ?? { start: false, end: false })
}
</script>

<script setup lang="ts">
// QMessageScrollerProvider — :auto-scroll :default-scroll-position :scroll-previous-item-peek :scroll-margin
import { nextTick, provide, ref, shallowRef } from "vue"

interface Props {
  /** Suit le live edge tant que le lecteur est en bas */
  autoScroll?: boolean
  /** Position d'ouverture : start | end | last-anchor */
  defaultScrollPosition?: "start" | "end" | "last-anchor"
  /** Distance (px) d'un bord avant d'être considéré scrollable */
  scrollEdgeThreshold?: number
  /** Aperçu (px) du message précédent gardé visible lors de l'ancrage */
  scrollPreviousItemPeek?: number
  /** Décalage (px) appliqué en plus lors d'un scrollToMessage */
  scrollMargin?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoScroll: false,
  defaultScrollPosition: "end",
  scrollEdgeThreshold: 8,
  scrollPreviousItemPeek: 64,
  scrollMargin: 0,
})

const viewportEl = ref<HTMLElement | null>(null)
const contentEl = ref<HTMLElement | null>(null)
const pinned = ref(true)
const scrollable = ref({ start: false, end: false })
// shallowRef : ne pas dé-unwrappe les Ref internes des enregistrements
const items = shallowRef<MessageScrollerItemReg[]>([])
const currentAnchorId = ref<string | null>(null)
const visibleIds = ref<string[]>([])

const updateScrollState = () => {
  const v = viewportEl.value
  if (!v) return
  const atEnd = v.scrollHeight - v.scrollTop - v.clientHeight <= props.scrollEdgeThreshold
  pinned.value = atEnd
  scrollable.value = {
    start: v.scrollTop > props.scrollEdgeThreshold,
    end: !atEnd,
  }
  // Visibilité (coordonnées relatives au content, positionné)
  const top = v.scrollTop
  const bottom = top + v.clientHeight
  const vis: string[] = []
  let lastAnchor: string | null = null
  for (const it of items.value) {
    const el = it.el.value
    if (!el) continue
    const t = el.offsetTop
    const b = t + el.offsetHeight
    if (b >= top && t <= bottom) vis.push(it.id)
    if (it.anchor && t <= bottom) lastAnchor = it.id
  }
  visibleIds.value = vis
  if (lastAnchor) currentAnchorId.value = lastAnchor
}

const scrollToEnd = (opts: { behavior?: ScrollBehavior } = {}) => {
  const v = viewportEl.value
  if (!v) return
  v.scrollTo({ top: v.scrollHeight, behavior: opts.behavior ?? "smooth" })
}

const scrollToStart = (opts: { behavior?: ScrollBehavior } = {}) => {
  const v = viewportEl.value
  if (!v) return
  v.scrollTo({ top: 0, behavior: opts.behavior ?? "smooth" })
}

const scrollToMessage = (id: string, opts: ScrollToOptions = {}): boolean => {
  const v = viewportEl.value
  const reg = items.value.find((i) => i.id === id)
  const el = reg?.el.value
  if (!v || !el) return false
  const margin = opts.scrollMargin ?? props.scrollMargin
  let top = el.offsetTop - margin
  if (opts.align === "center") top = el.offsetTop - (v.clientHeight - el.offsetHeight) / 2
  else if (opts.align === "end") top = el.offsetTop + el.offsetHeight - v.clientHeight
  v.scrollTo({ top, behavior: opts.behavior ?? "smooth" })
  return true
}

// Ancrage d'un tour : quand un nouvel item scrollAnchor est ajouté (pas au montage initial),
// le viewport le place près du haut avec un aperçu du message précédent.
const registerItem = (item: MessageScrollerItemReg) => {
  const wasEmpty = items.value.length === 0
  items.value = [...items.value, item]
  if (!wasEmpty && item.anchor) {
    nextTick(() => {
      const v = viewportEl.value
      const el = item.el.value
      if (v && el) {
        v.scrollTo({ top: Math.max(0, el.offsetTop - props.scrollPreviousItemPeek), behavior: "auto" })
      }
    })
  }
}

const unregisterItem = (id: string) => {
  items.value = items.value.filter((i) => i.id !== id)
}

provide<MessageScrollerContext>(qMessageScrollerKey, {
  autoScroll: computed(() => props.autoScroll),
  defaultPosition: computed(() => props.defaultScrollPosition),
  peek: computed(() => props.scrollPreviousItemPeek),
  margin: computed(() => props.scrollMargin),
  threshold: computed(() => props.scrollEdgeThreshold),
  viewportEl,
  contentEl,
  pinned,
  scrollable,
  currentAnchorId,
  visibleIds,
  items,
  registerItem,
  unregisterItem,
  updateScrollState,
  scrollToEnd,
  scrollToStart,
  scrollToMessage,
})
</script>

<template>
  <slot />
</template>
