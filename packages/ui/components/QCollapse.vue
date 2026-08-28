<script setup lang="ts">
// QCollapse — API Quasar (pattern QExpansionItem) : <q-collapse v-model label="…" icon-left="…" icon-right="…" caption dense>
// Équivalent du Collapsible shadcn-vue : animation de hauteur via CSS grid (0fr → 1fr).
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"

let collapseSeq = 0

interface Props {
  /** État ouvert (v-model) ; si absent, état interne initialisé par defaultOpened */
  modelValue?: boolean
  /** Ouvert par défaut (mode non contrôlé) */
  defaultOpened?: boolean
  /** Texte du header */
  label?: string
  /** Sous-titre du header */
  caption?: string
  /** Icône Iconify à gauche du label */
  iconLeft?: string
  /** Icône Iconify à droite du label (avant le chevron) */
  iconRight?: string
  /** Icône Iconify du chevron (défaut : lucide:chevron-down) */
  expandIcon?: string
  headerClass?: string
  /** Hauteur réduite */
  dense?: boolean
  /** Désactivé */
  disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpened: false,
  dense: false,
  disable: false,
  headerClass: "",
})

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()

const uid = `q-collapse-${collapseSeq++}`

const internalOpen = ref(props.defaultOpened)
const open = computed({
  get: () => props.modelValue ?? internalOpen.value,
  set: (v) => {
    internalOpen.value = v
    emit("update:modelValue", v)
  },
})

const toggle = () => {
  if (props.disable) return
  open.value = !open.value
}

const headerClasses = computed(() =>
  cn(
    "q-collapse__header",
    props.dense && "q-collapse__header--dense",
    props.disable && "q-collapse__header--disabled",
    props.headerClass,
  ),
)

// — Contenu repliable : hauteur mesurée (pattern shadcn/reka-ui) —
const rootEl = ref<HTMLElement | null>(null)
const innerEl = ref<HTMLElement | null>(null)
const contentHeight = ref(0)
const measured = ref(false)

const measure = () => {
  const inner = innerEl.value
  if (inner) {
    contentHeight.value = inner.scrollHeight
    measured.value = true
  }
}

const contentStyle = computed<Record<string, string> | undefined>(() => {
  if (!open.value) return { height: "0px" }
  return measured.value ? { height: `${contentHeight.value}px` } : undefined
})

watch(open, async (v) => {
  if (v) {
    await nextTick()
    measure()
  }
})

const onTransitionEnd = () => {
  if (open.value && rootEl.value) rootEl.value.style.height = "auto"
}

onMounted(measure)
</script>

<template>
  <div class="q-collapse">
    <button
      type="button"
      class="q-collapse__header"
      :class="headerClasses"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="uid"
      :disabled="disable"
      @click="toggle"
    >
      <span class="q-collapse__header-inner">
        <slot name="header">
          <Icon :icon="iconLeft" v-if="iconLeft" class="q-collapse__lead-icon" aria-hidden="true" />
          <span class="q-collapse__titles">
            <span v-if="label" class="q-collapse__label">{{ label }}</span>
            <span v-if="caption" class="q-collapse__caption">{{ caption }}</span>
          </span>
          <Icon :icon="iconRight" v-if="iconRight" class="q-collapse__icon-right" aria-hidden="true" />
        </slot>
      </span>
      <Icon
        :icon="expandIcon || icons.chevronDown"
        class="q-collapse__expand"
        :class="{ 'q-collapse__expand--rotated': open }"
        aria-hidden="true"
      />
    </button>
    <div
      ref="rootEl"
      :id="uid"
      class="q-collapse__content"
      :class="{ 'q-collapse__content--open': open }"
      :style="contentStyle"
      @transitionend="onTransitionEnd"
    >
      <div ref="innerEl" class="q-collapse__inner">
        <slot />
      </div>
    </div>
  </div>
</template>
