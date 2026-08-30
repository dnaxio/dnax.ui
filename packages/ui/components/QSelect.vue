<script lang="ts">
// QSelect — options spécifiques par mode d'ouverture.
// sheetOptions / modalOptions / inlineOptions : style, classes, hauteur, arrondi, placeholder de recherche.
export interface QSelectModeOptions {
  /** Largeur du panneau/popup (remplace width) */
  width?: string
  /** Style appliqué au panneau (sheet/modal) ou au popup (inline) */
  style?: Record<string, string>
  /** Classes ajoutées au panneau/popup */
  class?: string
  /** Hauteur de la liste scrollable (remplace height) */
  height?: string
  /** Arrondi du panneau (remplace rounded) */
  rounded?: boolean | string | { tl?: string | number; tr?: string | number; br?: string | number; bl?: string | number }
  /** Placeholder du champ de recherche pour ce mode */
  searchPlaceholder?: string
}

export interface UseSearchOptions {
  /** Clés à chercher sur les options (ex. ["name", "email"]) — défaut : optionLabel/optionValue */
  keys?: string[]
  /** Seuil fuse.js : 0 = exact, 1 = tout (défaut 0.4) */
  threshold?: number
}
</script>

<script setup lang="ts">
// QSelect — API Quasar : <q-select v-model="val" :options="opts" option-value="id" option-label="name" multiple use-input use-search @filter />
// Sélection unique ou multiple, recherche client (simple ou floue fuse.js, serveur via @filter), chips, emit-value.
// Modes : inline (dropdown) | modal (centré) | sheet (bottom sheet) | dialog (plein écran) — options par mode via sheetOptions/modalOptions/inlineOptions.
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"
import { createSearcher } from "../lib/search"

interface Props {
  /** Valeur sélectionnée : option, valeur (emit-value), ou tableau (multiple) */
  modelValue?: any
  /** Options candidates ({ label, value, … } par défaut) */
  options?: any[]
  /** Propriété ou fonction donnant la valeur d'une option (défaut "value") */
  optionValue?: string | ((opt: any) => any)
  /** Propriété ou fonction donnant le label (défaut "label") */
  optionLabel?: string | ((opt: any) => any)
  /** Sélection multiple */
  multiple?: boolean
  /** Input de recherche dans le champ (filtre client, ou serveur avec @filter) */
  useInput?: boolean
  /** Texte saisi (v-model:input-value) */
  inputValue?: string
  /** Affiche les sélections comme chips (multiple) */
  useChips?: boolean
  /** v-model = option-value au lieu de l'objet option */
  emitValue?: boolean
  /** Masque les options déjà sélectionnées dans le dropdown */
  hideSelected?: boolean
  /** Nombre max de sélections (multiple) */
  maxValues?: number
  /** Affichage custom de la sélection (string ou fonction) */
  displayValue?: string | ((opt: any) => any)
  label?: string
  stackLabel?: boolean
  hint?: string
  error?: boolean
  errorMessage?: string
  placeholder?: string
  outlined?: boolean
  filled?: boolean
  borderless?: boolean
  /** Rayon des coins du champ : true = pilule, ou échelle xs|sm|md|lg (none = carré) */
  fieldRadius?: RadiusProp
  dense?: boolean
  clearable?: boolean
  disable?: boolean
  readonly?: boolean
  loading?: boolean
  noOptionsLabel?: string
  /** Icône Iconify de la flèche (défaut : lucide:chevron-down) */
  dropdownIcon?: string
  /** Recherche floue fuse.js : true (défauts) ou { keys, threshold } — champ de recherche séparé affiché avant la liste */
  useSearch?: boolean | UseSearchOptions
  /** Placeholder du champ de recherche (useSearch) */
  searchPlaceholder?: string
  /** Mode d'ouverture : inline (dropdown) | modal (centré) | sheet (bottom sheet) | dialog (plein écran) */
  mode?: "inline" | "modal" | "sheet" | "dialog"
  /** Largeur du panneau (modal/sheet) : "300px", "80%"… (par défaut : modal 480px / 90% si écran < 768px, sheet 640px) */
  width?: string
  /** Hauteur de la liste scrollable dans les modes panneau (sheet/modal/dialog) : "400px", "50vh"… */
  height?: string
  /** Arrondi du panneau : true (défaut du mode) | false (carré) | valeur CSS | objet { tl, tr, br, bl } */
  rounded?: boolean | string | { tl?: string | number; tr?: string | number; br?: string | number; bl?: string | number }
  /** Options spécifiques au mode sheet (style, class, height, rounded, width, searchPlaceholder) */
  sheetOptions?: QSelectModeOptions
  /** Options spécifiques au mode modal */
  modalOptions?: QSelectModeOptions
  /** Options spécifiques au mode inline (popup) */
  inlineOptions?: QSelectModeOptions
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  optionValue: "value",
  optionLabel: "label",
  multiple: false,
  useInput: false,
  useChips: false,
  emitValue: false,
  hideSelected: false,
  maxValues: 0,
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
  mode: "inline",
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
  default?: (props: Record<string, any>) => any // option : { opt, index, selected }
  option?: (props: Record<string, any>) => any // { opt, index, selected }
  noOption?: () => any
  prepend?: () => any
  append?: () => any
  error?: () => any
  hint?: () => any
}>()

const instance = getCurrentInstance()
const hasFilter = computed(() => !!instance?.vnode.props?.onFilter)

const rootEl = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const sheetRef = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const focused = ref(false)
const open = ref(false)
const query = ref(props.inputValue ?? "")
const activeIndex = ref(0)

// — Options du mode courant (sheet/modal/inline) —
const modeOptions = computed<QSelectModeOptions | undefined>(() => {
  if (props.mode === "sheet") return props.sheetOptions
  if (props.mode === "modal") return props.modalOptions
  if (props.mode === "inline") return props.inlineOptions
  return undefined
})

// — Valeurs des options —
const getOptionValue = (opt: any): any =>
  typeof props.optionValue === "function" ? props.optionValue(opt) : opt?.[props.optionValue]

const getOptionLabel = (opt: any): string => {
  const v = typeof props.optionLabel === "function" ? props.optionLabel(opt) : opt?.[props.optionLabel]
  return v === undefined || v === null ? "" : String(v)
}

// — Sélection (dérivée du modèle) —
const selectedOptions = computed<any[]>(() => {
  if (props.modelValue === undefined || props.modelValue === null) return []
  const list = props.multiple ? (props.modelValue as any[]) : [props.modelValue]
  return list
    .map((v) => {
      if (props.emitValue) return props.options.find((o) => getOptionValue(o) === v)
      return v
    })
    .filter((o) => o !== undefined)
})

const isSelected = (opt: any) =>
  selectedOptions.value.some((o) => getOptionValue(o) === getOptionValue(opt))

const select = (opt: any) => {
  if (props.disable || props.readonly) return
  const value = props.emitValue ? getOptionValue(opt) : opt

  if (props.multiple) {
    if (isSelected(opt)) {
      const next = selectedOptions.value.filter((o) => getOptionValue(o) !== getOptionValue(opt))
      emit("update:modelValue", props.emitValue ? next.map(getOptionValue) : next)
    }
    else if (!props.maxValues || selectedOptions.value.length < props.maxValues) {
      const next = [...selectedOptions.value, opt]
      emit("update:modelValue", props.emitValue ? next.map(getOptionValue) : next)
    }
    if (showInput.value) {
      query.value = ""
      emit("update:inputValue", "")
      inputEl.value?.focus()
    }
  }
  else {
    if (!isSelected(opt)) emit("update:modelValue", value)
    closePopup()
  }
}

const remove = (opt: any) => select(opt)

const clear = () => {
  emit("update:modelValue", props.multiple ? [] : undefined)
  emit("update:inputValue", "")
  query.value = ""
  emit("clear")
  inputEl.value?.focus()
}

const hasValue = computed(() =>
  props.multiple ? (props.modelValue as any[])?.length > 0 : props.modelValue !== undefined && props.modelValue !== null,
)

// — Recherche floue (fuse.js) —
const searchEnabled = computed(() => props.useSearch !== undefined && props.useSearch !== false)

/** Input dans le champ (use-input uniquement) ; useSearch affiche un champ séparé dans la liste */
const showInput = computed(() => props.useInput)

// En mode sheet, le champ de recherche est affiché EN BAS de la liste (au-dessus de la barre d'accueil)
const sheetSearchAtBottom = computed(() => props.mode === "sheet" && searchEnabled.value && !props.useInput)
const showSheetSearchTop = computed(() => searchEnabled.value && !props.useInput && props.mode !== "sheet")
const showSheetSearchBottom = sheetSearchAtBottom

const searchKeys = computed<string[]>(() => {
  if (searchEnabled.value && typeof props.useSearch === "object" && props.useSearch.keys?.length) {
    return props.useSearch.keys
  }
  const keys: string[] = []
  if (typeof props.optionLabel === "string") keys.push(props.optionLabel)
  if (typeof props.optionValue === "string" && !keys.includes(props.optionValue)) keys.push(props.optionValue)
  return keys
})

const searcher = computed(() =>
  createSearcher(props.options, {
    keys: searchKeys.value,
    threshold: typeof props.useSearch === "object" ? (props.useSearch.threshold ?? 0.4) : 0.4,
  }),
)

// — Options affichées (recherche floue, filtre simple, ou serveur) —
const displayOptions = computed(() => {
  let list = props.options
  if (!hasFilter.value) {
    if (searchEnabled.value && searchKeys.value.length > 0) {
      list = searcher.value.search(query.value)
    }
    else if (showInput.value) {
      const q = query.value.trim().toLowerCase()
      if (q) list = list.filter((o) => getOptionLabel(o).toLowerCase().includes(q))
    }
  }
  if (props.hideSelected) {
    list = list.filter((o) => !isSelected(o))
  }
  return list
})

// — Affichage —
const selectedText = computed(() =>
  props.multiple
    ? selectedOptions.value.map(getOptionLabel).join(", ")
    : selectedOptions.value[0] ? getOptionLabel(selectedOptions.value[0]) : "",
)

const displayText = computed(() => {
  if (!selectedOptions.value[0]) return ""
  if (props.displayValue !== undefined) {
    return typeof props.displayValue === "function"
      ? props.displayValue(selectedOptions.value[0])
      : props.displayValue
  }
  return selectedText.value
})

const inputDisplay = computed(() => {
  if (query.value !== "") return query.value
  if (props.multiple) return ""
  return selectedOptions.value[0] ? getOptionLabel(selectedOptions.value[0]) : ""
})

const floatActive = computed(
  () => focused.value || query.value !== "" || selectedOptions.value.length > 0 || props.stackLabel,
)

const fieldClasses = computed(() =>
  cn(
    "q-select q-input",
    props.outlined && "q-field--outlined",
    props.filled && "q-field--filled",
    props.borderless && "q-field--borderless",
    effectiveFieldRadius.value === true && "q-field--rounded",
    props.dense && "q-field--dense",
    props.error && "q-field--error",
    props.disable && "q-field--disabled",
    floatActive.value && "q-field--float",
  ),
)

// radius du champ : prop explicite > composantProps.QSelect > composantProps.default
const effectiveFieldRadius = useRadius("QSelect", () => props.fieldRadius)
const fieldRadiusStyle = computed(() => radiusStyle(effectiveFieldRadius.value))

// — Ouverture / fermeture —
const openPopup = () => {
  if (props.disable || props.readonly) return
  activeIndex.value = 0
  open.value = true
}

const closePopup = () => {
  open.value = false
}

const togglePopup = () => (open.value ? closePopup() : openPopup())

const onControlClick = () => {
  if (props.disable || props.readonly) return
  if (showInput.value) {
    inputEl.value?.focus()
    openPopup()
  }
  else {
    togglePopup()
  }
}

const onInput = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  query.value = v
  emit("update:inputValue", v)
  activeIndex.value = 0
  openPopup()
  if (hasFilter.value) emit("filter", v, (fn) => fn())
}

const onFocus = (e: FocusEvent) => {
  focused.value = true
  emit("focus", e)
}

const onBlur = (e: FocusEvent) => {
  focused.value = false
  closePopup()
  emit("blur", e)
}

// — Clavier —
const move = (dir: number) => {
  if (displayOptions.value.length) {
    activeIndex.value = (activeIndex.value + dir + displayOptions.value.length) % displayOptions.value.length
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (props.disable) return
  if (!open.value) {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault()
      openPopup()
    }
    return
  }
  if (e.key === "ArrowDown") {
    e.preventDefault()
    move(1)
  }
  else if (e.key === "ArrowUp") {
    e.preventDefault()
    move(-1)
  }
  else if (e.key === "Enter") {
    e.preventDefault()
    const opt = displayOptions.value[activeIndex.value]
    if (opt) select(opt)
  }
  else if (e.key === "Escape") {
    e.preventDefault()
    closePopup()
  }
}

watch(activeIndex, async () => {
  await nextTick()
  const items = popupRef.value?.querySelectorAll(".q-select__option")
  const el = items?.[activeIndex.value] as HTMLElement | undefined
  el?.scrollIntoView({ block: "nearest" })
})

// Fermeture au clic extérieur + Échap (mode modal/sheet/dialog)
const onDocMousedown = (e: MouseEvent) => {
  const target = e.target as Node
  if (rootEl.value?.contains(target)) return
  if (sheetRef.value?.contains(target)) return
  closePopup()
}

const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && open.value && props.mode !== "inline") closePopup()
}

// Verrouille le scroll du body quand un panneau modal est ouvert
watch(open, (v) => {
  if (typeof document !== "undefined" && props.mode !== "inline") {
    document.body.style.overflow = v ? "hidden" : ""
  }
})

onMounted(() => {
  if (typeof document !== "undefined") {
    document.addEventListener("mousedown", onDocMousedown)
    document.addEventListener("keydown", onDocKeydown)
  }
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("mousedown", onDocMousedown)
    document.removeEventListener("keydown", onDocKeydown)
    document.body.style.overflow = ""
  }
})

// — Styles du panneau (props globales fusionnées avec les options du mode) —
const sheetTitle = computed(() => props.label || props.placeholder || "Sélection")

const effectiveSearchPlaceholder = computed(() => modeOptions.value?.searchPlaceholder ?? props.searchPlaceholder)

const sheetWidthStyle = computed<Record<string, string> | undefined>(() => {
  if (props.mode === "dialog") return undefined
  const w = modeOptions.value?.width ?? props.width
  if (!w) return undefined
  return { width: w, maxWidth: w }
})

const sheetListStyle = computed<Record<string, string> | undefined>(() => {
  const h = modeOptions.value?.height ?? props.height
  return h ? { height: h } : undefined
})

const sheetRadiusStyle = computed<Record<string, string> | undefined>(() => {
  if (props.mode === "inline" || props.mode === "dialog") return undefined
  const rounded = modeOptions.value?.rounded ?? props.rounded
  if (rounded === false) return { borderRadius: "0" }

  const defaultRadius = props.mode === "modal" ? "20px" : "12px"
  const value = typeof rounded === "string" ? rounded : defaultRadius
  const asPx = (v: string | number) => (typeof v === "number" ? `${v}px` : v)

  if (props.mode === "sheet") {
    if (rounded && typeof rounded === "object") {
      return { borderRadius: `${asPx(rounded.tl ?? value)} ${asPx(rounded.tr ?? value)} 0 0` }
    }
    return { borderRadius: `${value} ${value} 0 0` }
  }

  if (rounded && typeof rounded === "object") {
    return {
      borderRadius: `${asPx(rounded.tl ?? value)} ${asPx(rounded.tr ?? value)} ${asPx(rounded.br ?? value)} ${asPx(rounded.bl ?? value)}`,
    }
  }
  return { borderRadius: value }
})

const sheetStyle = computed<(Record<string, string> | undefined)[]>(() => [
  sheetWidthStyle.value,
  sheetRadiusStyle.value,
  modeOptions.value?.style,
])

const sheetClass = computed(() => [`q-select__sheet--${props.mode}`, modeOptions.value?.class])
</script>

<template>
  <div ref="rootEl" class="q-select" :class="fieldClasses" :style="fieldRadiusStyle">
    <label v-if="label" class="q-field__label-stack">{{ label }}</label>
    <div class="q-field__control" @click="onControlClick">
      <slot name="prepend" />

      <span v-for="(opt, i) in selectedOptions" :key="`${String(getOptionValue(opt))}-${i}`" class="q-select__chip">
        <span class="q-select__chip-label">{{ getOptionLabel(opt) }}</span>
        <button
          v-if="!disable && !readonly"
          type="button"
          class="q-select__chip-remove"
          :aria-label="`Retirer ${getOptionLabel(opt)}`"
          @click.stop="remove(opt)"
        >
          <Icon :icon="icons.x" aria-hidden="true" />
        </button>
      </span>

      <input
        v-if="showInput"
        ref="inputEl"
        class="q-field__native"
        :value="inputDisplay"
        :placeholder="placeholder"
        :disabled="disable || undefined"
        :readonly="readonly || undefined"
        role="combobox"
        :aria-expanded="open ? 'true' : 'false'"
        aria-autocomplete="list"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />
      <span
        v-else
        class="q-select__display"
        :class="{ 'q-select__display--placeholder': !displayText }"
      >
        {{ displayText || placeholder }}
      </span>

      <span v-if="loading" class="q-spinner-ring q-autocomplete__spinner" aria-hidden="true" />
      <button
        v-if="clearable && hasValue && !disable && !readonly"
        class="q-field__clear"
        type="button"
        aria-label="Effacer"
        @click.stop="clear"
      >
        <Icon :icon="icons.x" aria-hidden="true" />
      </button>
      <Icon
        :icon="dropdownIcon || icons.chevronDown"
        class="q-select__arrow"
        :class="{ 'q-select__arrow--rotated': open }"
        aria-hidden="true"
      />
      <slot name="append" />
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

    <!-- Popup inline (mode inline) -->
    <div
      v-if="open && mode === 'inline'"
      ref="popupRef"
      class="q-select__popup"
      :class="inlineOptions?.class"
      :style="inlineOptions?.style"
      role="listbox"
      @mousedown.prevent
    >
      <div v-if="searchEnabled && !useInput" class="q-select__search" @mousedown.stop>
        <Icon :icon="icons.search" class="q-select__search-icon" aria-hidden="true" />
        <input
          class="q-select__search-input"
          :value="query"
          :placeholder="effectiveSearchPlaceholder"
          @input="onInput"
          @keydown="onKeydown"
        />
      </div>
      <template v-if="displayOptions.length">
        <div
          v-for="(opt, i) in displayOptions"
          :key="String(getOptionValue(opt))"
          role="option"
          :aria-selected="isSelected(opt) ? 'true' : 'false'"
          class="q-select__option"
          :class="{
            'q-select__option--active': i === activeIndex,
            'q-select__option--selected': isSelected(opt),
          }"
          @mouseenter="activeIndex = i"
          @mousedown.prevent="select(opt)"
        >
          <slot :opt="opt" :index="i" :selected="isSelected(opt)">
            <span class="q-select__option-label">{{ getOptionLabel(opt) }}</span>
          </slot>
          <Icon :icon="icons.check" v-if="multiple && isSelected(opt)" class="q-select__check" aria-hidden="true" />
        </div>
      </template>
      <div v-else class="q-select__empty">
        <slot name="noOption">{{ noOptionsLabel }}</slot>
      </div>
    </div>

    <!-- Mode modal / sheet / dialog : panneau téléporté -->
    <Teleport to="body">
      <Transition name="q-select-modal">
        <div
          v-if="open && mode !== 'inline'"
          class="q-select__overlay"
          :class="`q-select__overlay--${mode}`"
          role="presentation"
          @mousedown.self="closePopup"
        >
          <div
            ref="sheetRef"
            class="q-select__sheet"
            :class="sheetClass"
            :style="sheetStyle"
            role="dialog"
            aria-modal="true"
            :aria-label="sheetTitle"
          >
            <div class="q-select__sheet-header">
              <span class="q-select__sheet-title">{{ sheetTitle }}</span>
              <button
                type="button"
                class="q-select__sheet-close"
                :aria-label="`Fermer ${sheetTitle}`"
                @click="closePopup"
              >
                <Icon :icon="icons.x" aria-hidden="true" />
              </button>
            </div>
            <div v-if="showSheetSearchTop" class="q-select__search">
              <Icon :icon="icons.search" class="q-select__search-icon" aria-hidden="true" />
              <input
                class="q-select__search-input"
                :value="query"
                :placeholder="effectiveSearchPlaceholder"
                @input="onInput"
                @keydown="onKeydown"
              />
            </div>
            <div
              ref="popupRef"
              class="q-select__sheet-list"
              :class="{ 'q-select__sheet-list--safe-bottom': !sheetSearchAtBottom }"
              :style="sheetListStyle"
              role="listbox"
            >
              <template v-if="displayOptions.length">
                <div
                  v-for="(opt, i) in displayOptions"
                  :key="String(getOptionValue(opt))"
                  role="option"
                  :aria-selected="isSelected(opt) ? 'true' : 'false'"
                  class="q-select__option"
                  :class="{
                    'q-select__option--active': i === activeIndex,
                    'q-select__option--selected': isSelected(opt),
                  }"
                  @mouseenter="activeIndex = i"
                  @mousedown.prevent="select(opt)"
                >
                  <slot :opt="opt" :index="i" :selected="isSelected(opt)">
                    <span class="q-select__option-label">{{ getOptionLabel(opt) }}</span>
                  </slot>
                  <Icon :icon="icons.check" v-if="multiple && isSelected(opt)" class="q-select__check" aria-hidden="true" />
                </div>
              </template>
              <div v-else class="q-select__empty">
                <slot name="noOption">{{ noOptionsLabel }}</slot>
              </div>
            </div>
            <div v-if="showSheetSearchBottom" class="q-select__search q-select__search--sheet-bottom">
              <Icon :icon="icons.search" class="q-select__search-icon" aria-hidden="true" />
              <input
                class="q-select__search-input"
                :value="query"
                :placeholder="effectiveSearchPlaceholder"
                @input="onInput"
                @keydown="onKeydown"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
