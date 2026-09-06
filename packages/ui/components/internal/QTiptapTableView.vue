<script setup lang="ts">
// QTiptapTableView — NodeView Vue du nœud « table » : rend un vrai <table>
// avec le contentDOM ProseMirror dans le <tbody>. Les rangées/cellules restent
// du contenu ProseMirror classique (sélection, merge/split, clavier).
// Ajouts maison : colgroup + poignées de redimensionnement de colonnes
// (drag), appliqué localement via des largeurs en % (non persistées dans le
// document — pour persister il faudrait écrire les attrs colwidth des cellules).
import { computed, onBeforeUnmount, ref, watch } from "vue"
import { nodeViewProps, NodeViewContent, NodeViewWrapper } from "@tiptap/vue-3"

const props = defineProps(nodeViewProps)

// Nombre de colonnes = largeur de la première rangée (les suivantes suivent
// les rowspans/colspans du schéma).
const cols = computed(() => {
  const first = props.node?.firstChild
  return first ? first.childCount : 0
})

// Largeurs en % (initialement égales) ; recalculees quand le nombre de
// colonnes change (ajout/suppression).
const widths = ref<number[]>([])
watch(
  cols,
  (count) => {
    if (count === widths.value.length) return
    const each = count > 0 ? 100 / count : 0
    widths.value = Array.from({ length: count }, () => each)
  },
  { immediate: true },
)

// — Drag de redimensionnement (poignées entre colonnes) —
const tableEl = ref<HTMLElement | null>(null)
let dragging = false
let boundary = 0
let startX = 0
let leftStart = 0
let rightStart = 0
let tableWidth = 0

const onMove = (event: PointerEvent) => {
  if (!dragging) return
  const delta = event.clientX - startX
  const minPx = 48
  let leftPx = leftStart + delta
  let rightPx = rightStart - delta
  if (leftPx < minPx) {
    rightPx -= minPx - leftPx
    leftPx = minPx
  }
  if (rightPx < minPx) {
    leftPx -= minPx - rightPx
    rightPx = minPx
  }
  if (leftPx < minPx || rightPx < minPx) return
  const total = tableWidth || 1
  const next = [...widths.value]
  next[boundary - 1] = (leftPx / total) * 100
  next[boundary] = (rightPx / total) * 100
  widths.value = next
}

const onUp = () => {
  dragging = false
  window.removeEventListener("pointermove", onMove)
  window.removeEventListener("pointerup", onUp)
}

const startResize = (event: PointerEvent, boundaryIndex: number) => {
  if (!props.editor.isEditable) return
  event.preventDefault()
  const table = tableEl.value
  if (!table) return
  const row = table.querySelector("tr")
  if (!row) return
  const leftCell = row.children[boundaryIndex - 1] as HTMLElement | undefined
  const rightCell = row.children[boundaryIndex] as HTMLElement | undefined
  if (!leftCell || !rightCell) return
  tableWidth = table.getBoundingClientRect().width || 1
  leftStart = leftCell.getBoundingClientRect().width
  rightStart = rightCell.getBoundingClientRect().width
  startX = event.clientX
  boundary = boundaryIndex
  dragging = true
  window.addEventListener("pointermove", onMove)
  window.addEventListener("pointerup", onUp)
}

onBeforeUnmount(() => {
  window.removeEventListener("pointermove", onMove)
  window.removeEventListener("pointerup", onUp)
})

// Position d'une poignée (bord droit de la colonne index) en %
const boundaryLeft = (index: number) => {
  const acc = widths.value.slice(0, index).reduce((sum, w) => sum + w, 0)
  return Math.min(acc, 99.5)
}
</script>

<template>
  <node-view-wrapper as="div" class="q-tiptap__table-wrapper">
    <table ref="tableEl" class="q-tiptap__table" :class="{ 'q-tiptap__table--resizable': editor.isEditable }">
      <colgroup v-if="widths.length">
        <col v-for="(width, i) in widths" :key="i" :style="{ width: width + '%' }" />
      </colgroup>
      <node-view-content as="tbody" />
    </table>

    <!-- Poignées de redimensionnement entre les colonnes (éditable seulement) -->
    <span
      v-for="index in Math.max(cols - 1, 0)"
      :key="'handle-' + index"
      class="q-tiptap__resize-handle"
      :style="{ left: boundaryLeft(index) + '%' }"
      role="separator"
      aria-orientation="vertical"
      :aria-label="'Resize column ' + index"
      @pointerdown.prevent.stop="startResize($event, index)"
    />
  </node-view-wrapper>
</template>
