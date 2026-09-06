// Tables Tiptap pour QTiptap — le nœud « table » est rendu par une NodeView
// Vue (QTiptapTableView) au lieu du rendu DOM/colgroup par défaut. On garde
// les nœuds officiels TableRow/TableHeader/TableCell (schéma, keymaps,
// commandes) ; on ne remplace que le addNodeView de « table ».
import { Table, TableHeader, TableCell, TableRow } from "@tiptap/extension-table"
import { VueNodeViewRenderer } from "@tiptap/vue-3"
import type { NodeViewProps } from "@tiptap/vue-3"
import type { Component } from "vue"
import QTiptapTableView from "../components/internal/QTiptapTableView.vue"

export { TableHeader, TableCell, TableRow }

export const QTipTapTable = Table.extend({
  addNodeView() {
    // defineProps(nodeViewProps) ne fait pas remonter les types vers le renderer
    // → cast vers Component<NodeViewProps>
    return VueNodeViewRenderer(QTiptapTableView as Component<NodeViewProps>)
  },
})
