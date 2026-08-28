<script setup lang="ts">
// QTabPanel — panneau d'onglet : visible quand son `name` correspond au v-model des QTabPanels.
// v-show (en flux) : le switch est fiable ; `animated` ajoute un fondu à l'activation.
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { qTabPanelsKey, type QTabPanelsAnimation } from "./QTabPanels.vue"

interface Props {
  /** Nom du panneau (comparé au v-model des QTabPanels) */
  name: string | number
  /** Ne monte le contenu qu'à la première activation */
  lazyRender?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  lazyRender: false,
})

const panels = inject(qTabPanelsKey, null)
const el = ref<HTMLElement | null>(null)

onMounted(() => panels?.register({ name: props.name, el }))
onBeforeUnmount(() => panels?.unregister(props.name))

const isActive = computed(() => panels?.activeName.value === props.name)

// lazyRender : monté après la première activation
const activated = ref(false)
watch(isActive, (v) => {
  if (v) activated.value = true
})

// Classe d'animation : q-tab-panel--fade | --slide-right | … (quand animated + actif)
const animationClass = computed<QTabPanelsAnimation | "">(() =>
  panels?.animated.value && isActive.value ? (panels.animation.value ?? "fade") : "",
)
</script>

<template>
  <div
    v-if="!lazyRender || activated"
    v-show="isActive"
    ref="el"
    class="q-tab-panel"
    :class="animationClass && `q-tab-panel--${animationClass}`"
    role="tabpanel"
    :aria-hidden="isActive ? undefined : 'true'"
  >
    <slot />
  </div>
</template>
