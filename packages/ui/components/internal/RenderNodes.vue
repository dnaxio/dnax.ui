<script lang="ts">
// RenderNodes — rend des vnodes bruts passés en prop (usage interne).
// Permet à un composant à template (ex. QBreadcrumbs) de réafficher les vnodes du
// slot par défaut en les enveloppant / les intercalant — impossible en template pur.
import { defineComponent, type PropType, type VNode } from "vue"

export default defineComponent({
  name: "RenderNodes",
  props: {
    nodes: {
      type: [Object, Array] as PropType<VNode | VNode[] | null>,
      default: null,
    },
  },
  setup(props) {
    return () => {
      const nodes = props.nodes
      if (!nodes) return []
      return Array.isArray(nodes) ? nodes : [nodes]
    }
  },
})
</script>
