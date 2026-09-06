<script setup lang="ts">
// QTiptapTaskItemView — NodeView Vue du nœud « taskItem » : rend une vraie
// <q-checkbox> dnax.ui (au lieu du <input> natif du DOM par défaut).
// Le nœud est fourni par l'extension officielle TaskItem (schéma, keymap
// Enter/Tab, input rules "[ ]" / "[x]") dont on ne remplace que addNodeView.
//
// ⚠ NodeView Vue : la RACINE DOIT être <node-view-wrapper> (erreur Tiptap
// « Please use the NodeViewWrapper component » sinon). En v3 ce wrapper ne
// propage pas les attrs → data-checked/class cochée portés par le div interne
// qui contient <node-view-content> (le contentDOM peut être imbriqué).
import { nodeViewProps, NodeViewContent, NodeViewWrapper } from "@tiptap/vue-3"
import QCheckbox from "../QCheckbox.vue"

// nodeViewProps : descripteurs runtime officiels (editor, node, updateAttributes,
// getPos…) — pattern documenté pour les NodeViews Vue dans Tiptap.
const props = defineProps(nodeViewProps)

const checked = () => !!props.node.attrs.checked
const isEditable = () => props.editor.isEditable

const onToggle = (value: unknown) => {
  if (!isEditable()) return
  if (typeof props.getPos !== "function") return
  props.editor.chain().focus().command(({ tr }) => {
    const position = props.getPos()
    if (typeof position !== "number") return false
    const current = tr.doc.nodeAt(position)
    tr.setNodeMarkup(position, undefined, { ...current?.attrs, checked: Boolean(value) })
    return true
  }).run()
}
</script>

<template>
  <node-view-wrapper as="li">
    <label class="q-tiptap__task-check" contenteditable="false" @mousedown.prevent>
      <q-checkbox
        :model-value="checked()"
        dense
        :disable="!isEditable()"
        aria-label="Task done"
        @update:model-value="onToggle"
      />
    </label>
    <div class="q-tiptap__task-content" :class="{ 'q-tiptap__task-content--checked': checked() }">
      <node-view-content />
    </div>
  </node-view-wrapper>
</template>
