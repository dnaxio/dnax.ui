import { cloneVNode, defineComponent, h, mergeProps } from "vue"
import type { PropType } from "vue"

/**
 * Rendu polymorphe façon reka-ui Primitive : `as` (élément/composant) ou
 * `as-child` (fusion des attributs/classes sur l'enfant du slot par défaut).
 * Les classes/listeners passent par les attrs et sont fusionnés.
 */
export const QPrimitive = defineComponent({
  name: "QPrimitive",
  props: {
    as: { type: [String, Object] as PropType<string | object>, default: "div" },
    asChild: Boolean,
  },
  setup(props, { slots, attrs }) {
    return () => {
      const children = slots.default?.()
      if (props.asChild && children && children.length > 0) {
        const node = children[0]!
        return cloneVNode(node, mergeProps(node.props ?? {}, attrs))
      }
      return h(props.as as never, { ...attrs }, children)
    }
  },
})
