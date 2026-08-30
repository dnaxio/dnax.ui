<script setup lang="ts">
// QIntersection — révèle son contenu quand il entre dans le viewport (API Quasar) :
// <q-intersection transition="fade" once @show="…">
// IntersectionObserver + transition d'apparition (fade, scale, slide-*, flip…).
// Props : once, threshold, root-margin, margin, root, disable, intersected (v-model).
import { onBeforeUnmount, onMounted, ref, watch } from "vue"

interface Props {
  /** État d'intersection (v-model) — reflète si le contenu est visible */
  modelValue?: boolean
  /** Ne déclenche l'intersection qu'une fois (défaut true) */
  once?: boolean
  /** Transition d'apparition : "fade" (défaut) | "scale" | "slide-up" | "slide-down" |
   *  "slide-left" | "slide-right" | "flip" | "none"/"" (aucune) — ou nom custom
   *  (classes `q-intersection-{nom}-enter-active`…) */
  transition?: string
  /** Seuil de visibilité : 0 = un pixel visible, 1 = entièrement visible */
  threshold?: number
  /** rootMargin de l'IntersectionObserver (ex. "50px 0px") */
  rootMargin?: string
  /** Marge autour de l'élément (agrandit la zone de détection) */
  margin?: string
  /** Désactive l'observation (le contenu reste visible) */
  disable?: boolean
  /** Racine de l'observation (défaut : viewport) */
  root?: Element | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  once: true,
  transition: "fade",
  threshold: 0,
  rootMargin: "",
  margin: "",
  disable: false,
  root: null,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  show: []
  hide: []
}>()

const rootEl = ref<HTMLElement | null>(null)
const visible = ref(props.modelValue)
let observer: IntersectionObserver | null = null
let done = false

const setVisible = (v: boolean) => {
  if (visible.value === v) return
  visible.value = v
  emit("update:modelValue", v)
  if (v) emit("show")
  else emit("hide")
}

const onIntersect: IntersectionObserverCallback = ([entry]) => {
  if (props.disable || !entry) return
  if (entry.isIntersecting) {
    setVisible(true)
    if (props.once) {
      done = true
      observer?.disconnect()
    }
  } else if (!props.once) {
    setVisible(false)
  }
}

const createObserver = () => {
  if (props.disable) return
  if (typeof IntersectionObserver === "undefined" || !rootEl.value) {
    // Environnement sans IntersectionObserver (SSR/vieux) : contenu visible
    setVisible(true)
    return
  }
  observer = new IntersectionObserver(onIntersect, {
    threshold: props.threshold,
    rootMargin: props.rootMargin || undefined,
    root: props.root ?? null,
  })
  observer.observe(rootEl.value)
}

onMounted(() => {
  if (!done) createObserver()
})

watch(
  () => props.disable,
  (d) => {
    if (d) observer?.disconnect()
    else if (!done) createObserver()
  },
)

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="rootEl" class="q-intersection" :style="margin ? { margin } : undefined">
    <slot v-if="!visible && $slots.loading" name="loading" />
    <!-- v-show (contenu toujours rendu) : le slot expose { active } pour
         conditionner l'intérieur selon l'état d'intersection -->
    <Transition
      v-if="transition && transition !== 'none'"
      :name="`q-intersection-${transition}`"
    >
      <div v-show="visible" class="q-intersection__content">
        <slot :active="visible" />
      </div>
    </Transition>
    <div v-else v-show="visible" class="q-intersection__content">
      <slot :active="visible" />
    </div>
  </div>
</template>
