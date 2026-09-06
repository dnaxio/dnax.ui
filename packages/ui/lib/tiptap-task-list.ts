// Task list Tiptap pour QTiptap — l'élément de liste est rendu par une
// NodeView Vue (q-checkbox dnax.ui) : on garde l'extension officielle
// TaskItem (schéma, parse/render, keymap, input rules) et on ne remplace que
// son addNodeView par VueNodeViewRenderer(QTiptapTaskItemView).
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import { VueNodeViewRenderer } from "@tiptap/vue-3"
import QTiptapTaskItemView from "../components/internal/QTiptapTaskItemView.vue"

export { TaskList }

export const QTipTapTaskItem = TaskItem.extend({
  addNodeView() {
    return VueNodeViewRenderer(QTiptapTaskItemView)
  },
})
