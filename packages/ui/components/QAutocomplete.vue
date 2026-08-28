<script setup lang="ts">
// QAutocomplete — Combobox type shadcn-vue, API Quasar (QSelect use-input) :
// <q-autocomplete v-model="val" :options="opts" option-value="id" option-label="name" clearable dense outlined />
// Filtre client par défaut ; @filter → mode serveur (le parent met à jour :options).
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"

interface Props {
  /** Valeur sélectionnée */
  modelValue?: any
  /** Options candidates */
  options?: any[]
  /** Propriété ou fonction donnant la valeur d'une option (défaut "value") */
  optionValue?: string | ((opt: any) => any)
  /** Propriété ou fonction donnant le label d'une option (défaut "label") */
  optionLabel?: string | ((opt: any) => any)
  /** Texte saisi (v-model:input-value) */
  inputValue?: string
  label?: string
  stackLabel?: boolean
  hint?: string
  error?: boolean
  errorMessage?: string
  placeholder?: string
  /** Variantes de champ (mêmes styles que QInput) */
  outlined?: boolean
  filled?: boolean
  borderless?: boolean
  /** Coins arrondis : true = pilule, ou échelle xs|sm|md|lg (none = carré) */
  radius?: RadiusProp
  dense?: boolean
  clearable?: boolean
  disable?: boolean
  readonly?: boolean
  loading?: boolean
  noOptionsLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  optionValue: "value",
  optionLabel: "label",
  stackLabel: false,
  error: false,
  outlined: false,
  filled: false,
  borderless: false,
  dense: false,
  clearable: false,
  disable: false,
  readonly: false,
  loading: false,
  noOptionsLabel: "No options to display",
})

const emit = defineEmits<{
  "update:modelValue": [value: any]
  "update:inputValue": [value: string]
  filter: [value: string, update: (fn: () => void) => void]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

defineSlots<{
  default?: (props: Record<string, any>) => any // option : { option, index, selected, active }
  noOptions?: () => any
  error?: () => any
  hint?: () => any
}>()

const instance = getCurrentInstance()
const hasFilter = computed(() => !!instance?.vnode.props?.onFilter)

const rootEl = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const focused = ref(false)
const open = ref(false)
const query = ref(props.inputValue ?? "")
const activeIndex = ref(0)

// — Valeurs des options —
const getValue = (opt: any): any =>
  typeof props.optionValue === "function" ? props.optionValue(opt) : opt?.[props.optionValue]

const getLabel = (opt: any): string => {
  const v = typeof props.optionLabel === "function" ? props.optionLabel(opt) : opt?.[props.optionLabel]
  return v === undefined || v === null ? "" : String(v)
}

const selectedLabel = computed(() => {
  if (props.modelValue === undefined || props.modelValue === null) return ""
  const opt = props.options.find((o) => getValue(o) === props.modelValue)
  return opt ? getLabel(opt) : String(props.modelValue)
})

// — Filtre client (sauté en mode serveur @filter) —
const filtered = computed(() => {
  if (hasFilter.value) return props.options
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((o) => getLabel(o).toLowerCase().includes(q))
})

// — Affichage du champ —
const inputDisplay = computed(() => (query.value !== "" ? query.value : selectedLabel.value))

const floatActive = computed(
  () => focused.value || query.value !== "" || props.modelValue !== undefined || props.stackLabel,
)

const fieldClasses = computed(() =>
  cn(
    "q-autocomplete q-input",
    props.outlined && "q-field--outlined",
    props.filled && "q-field--filled",
    props.borderless && "q-field--borderless",
    effectiveRadius.value === true && "q-field--rounded",
    props.dense && "q-field--dense",
    props.error && "q-field--error",
    props.disable && "q-field--disabled",
    floatActive.value && "q-field--float",
  ),
)

// radius : prop explicite > composantProps.QAutocomplete > composantProps.default
const effectiveRadius = useRadius("QAutocomplete", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

// — Interactions —
const openPopup = () => {
  if (props.disable || props.readonly) return
  activeIndex.value = 0
  open.value = true
}

const onInput = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  query.value = v
  if (v !== selectedLabel.value) emit("update:modelValue", undefined)
  emit("update:inputValue", v)
  activeIndex.value = 0
  open.value = true
  if (hasFilter.value) emit("filter", v, (fn) => fn())
}

const onSelect = (opt: any) => {
  const label = getLabel(opt)
  emit("update:modelValue", getValue(opt))
  emit("update:inputValue", label)
  query.value = label
  open.value = false
}

const onClear = () => {
  emit("update:modelValue", undefined)
  emit("update:inputValue", "")
  query.value = ""
  emit("clear")
}

const isSelected = (opt: any) => getValue(opt) === props.modelValue

const onFocus = (e: FocusEvent) => {
  focused.value = true
  openPopup()
  emit("focus", e)
}

const onBlur = (e: FocusEvent) => {
  focused.value = false
  open.value = false
  emit("blur", e)
}

const onKeydown = (e: KeyboardEvent) => {
  if (!open.value) {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault()
      openPopup()
    }
    return
  }
  if (e.key === "ArrowDown") {
    e.preventDefault()
    if (filtered.value.length) activeIndex.value = (activeIndex.value + 1) % filtered.value.length
  }
  else if (e.key === "ArrowUp") {
    e.preventDefault()
    if (filtered.value.length) {
      activeIndex.value = (activeIndex.value - 1 + filtered.value.length) % filtered.value.length
    }
  }
  else if (e.key === "Enter") {
    e.preventDefault()
    const opt = filtered.value[activeIndex.value]
    if (opt) onSelect(opt)
  }
  else if (e.key === "Escape") {
    e.preventDefault()
    open.value = false
  }
}

// Item actif visible au scroll
watch(activeIndex, async () => {
  await nextTick()
  const items = popupRef.value?.querySelectorAll(".q-autocomplete__item")
  const el = items?.[activeIndex.value] as HTMLElement | undefined
  el?.scrollIntoView({ block: "nearest" })
})

// Fermeture au clic extérieur
const onDocMousedown = (e: MouseEvent) => {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) open.value = false
}

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("mousedown", onDocMousedown)
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.removeEventListener("mousedown", onDocMousedown)
})
</script>

<template>
  <div ref="rootEl" class="q-autocomplete" :class="fieldClasses" :style="roundedStyle">
    <label v-if="label && stackLabel" class="q-field__label-stack">{{ label }}</label>
    <div class="q-field__control">
      <input
        class="q-field__native"
        :value="inputDisplay"
        :placeholder="placeholder"
        :disabled="disable || undefined"
        :readonly="readonly || undefined"
        role="combobox"
        :aria-expanded="open ? 'true' : 'false'"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />
      <span v-if="loading" class="q-spinner q-autocomplete__spinner" aria-hidden="true" />
      <button
        v-if="clearable && modelValue !== undefined && !disable"
        class="q-field__clear"
        type="button"
        aria-label="Effacer"
        @click="onClear"
      >
        <Icon :icon="icons.x" aria-hidden="true" />
      </button>
    </div>
    <div v-if="error" class="q-field__bottom">
      <div class="q-field__error">
        <slot name="error">{{ errorMessage }}</slot>
      </div>
    </div>
    <div v-else-if="hint || $slots.hint" class="q-field__bottom">
      <div class="q-field__hint">
        <slot name="hint">{{ hint }}</slot>
      </div>
    </div>

    <div
      v-if="open"
      ref="popupRef"
      class="q-autocomplete__popup"
      role="listbox"
      @mousedown.prevent
    >
      <template v-if="filtered.length">
        <div
          v-for="(opt, i) in filtered"
          :key="String(getValue(opt))"
          role="option"
          :aria-selected="i === activeIndex ? 'true' : 'false'"
          class="q-autocomplete__item"
          :class="{
            'q-autocomplete__item--active': i === activeIndex,
            'q-autocomplete__item--selected': isSelected(opt),
          }"
          @mouseenter="activeIndex = i"
          @mousedown.prevent="onSelect(opt)"
        >
          <slot :option="opt" :index="i" :selected="isSelected(opt)" :active="i === activeIndex">
            <span class="q-autocomplete__label">{{ getLabel(opt) }}</span>
          </slot>
        </div>
      </template>
      <div v-else class="q-autocomplete__empty">
        <slot name="noOptions">{{ noOptionsLabel }}</slot>
      </div>
    </div>
  </div>
</template>
