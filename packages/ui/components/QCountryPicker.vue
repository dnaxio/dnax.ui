<script setup lang="ts">
// QCountryPicker — sélecteur de pays préfait : drapeau, nom, indicatif, recherche.
// <q-country-picker v-model="code" label="Country" mode="sheet" outlined />
// v-model = code ISO 3166-1 alpha-2 (ex. "FR").
// Modes : inline (champ + liste déroulante) | modal (centré) | sheet (bottom sheet) | dialog (plein écran).
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { COUNTRIES, flagOf } from "../lib/countries"
import type { Country } from "../lib/countries"

/** Options spécifiques à un mode d'ouverture (sheet / modal) */
export interface QCountryPickerModeOptions {
  /** Largeur du panneau (remplace width) */
  width?: string
  /** Style appliqué au panneau */
  style?: Record<string, string>
  /** Classes ajoutées au panneau */
  class?: string
  /** Hauteur de la liste scrollable (ex. "45vh", "400px") */
  height?: string
  /** Placeholder du champ de recherche pour ce mode */
  searchPlaceholder?: string
}

interface Props {
  /** Code ISO 3166-1 alpha-2 sélectionné (ex. "FR") — v-model */
  modelValue?: string
  /** Liste des pays proposés (défaut : tous) */
  countries?: Country[]
  /** Langue des noms de pays : "en" | "fr" (défaut en) */
  language?: "en" | "fr"
  /** Mode d'affichage : inline (liste sous le champ) | sheet | modal | dialog */
  mode?: "inline" | "sheet" | "modal" | "dialog"
  /** Libellé du champ vide (défaut "Select a country") */
  placeholder?: string
  /** Champ de recherche dans la liste (défaut true) */
  searchable?: boolean
  /** Affiche l'indicatif téléphonique (défaut true) */
  showDial?: boolean
  /** Label au-dessus du champ */
  label?: string
  /** Titre du panneau (sheet/modal/dialog) — défaut : label ou placeholder */
  title?: string
  /** Largeur du panneau (sheet/modal/dialog) */
  width?: string
  /** Seuil de drag (px) au-delà duquel on ferme en swipant vers le bas (mode sheet, défaut 80) */
  dragThreshold?: number
  /** Options spécifiques au mode sheet (width, style, class, height de la liste, searchPlaceholder) */
  sheetOptions?: QCountryPickerModeOptions
  /** Options spécifiques au mode modal */
  modalOptions?: QCountryPickerModeOptions
  /** Ne se ferme ni au backdrop ni à Échap (le drag ferme toujours) */
  persistent?: boolean
  /** Fond translucide du panneau (frosted glass) : true = 70%, ou valeur % */
  translucent?: boolean | number
  /** Arrondi du panneau : true (défaut) | false | valeur CSS */
  rounded?: boolean | string
  /** Hauteur du panneau (sinon max-height 80vh) */
  height?: string
  /** Style du panneau (variables de thème pour les contenus téléportés) */
  contentStyle?: Record<string, string>
  /** Fond transparent (style des champs Quasar) */
  outlined?: boolean
  /** Fond grisé sans bordure (style Quasar) */
  filled?: boolean
  /** Aucune bordure ni fond */
  borderless?: boolean
  /** Champ compact */
  dense?: boolean
  /** Champ désactivé */
  disable?: boolean
  /** Lecture seule (le popup ne s'ouvre pas) */
  readonly?: boolean
  /** Thème sombre */
  dark?: boolean
  /** Texte quand aucun pays ne correspond (défaut "No matching countries") */
  noOptionsLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  countries: () => COUNTRIES,
  language: "en",
  mode: "inline",
  placeholder: "Select a country",
  searchable: true,
  showDial: true,
  label: "",
  title: "",
  width: "",
  dragThreshold: 80,
  outlined: false,
  filled: false,
  borderless: false,
  dense: false,
  disable: false,
  readonly: false,
  dark: false,
  persistent: false,
  translucent: false,
  rounded: true,
  height: "",
  contentStyle: undefined,
  noOptionsLabel: "No matching countries",
})

const emit = defineEmits<{ "update:modelValue": [value: string] }>()

const isPanelMode = computed(() => props.mode !== "inline")

const rootEl = ref<HTMLElement | null>(null)
const sheetRef = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref("")
const activeIndex = ref(0)

const selected = computed(() =>
  props.countries.find((c) => c.code === props.modelValue),
)

/** Nom du pays dans la langue courante (fallback : nom anglais) */
const countryName = (c: Country): string =>
  props.language === "fr" ? (c.nameFr ?? c.name) : c.name

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.countries
  return props.countries.filter(
    (c) =>
      countryName(c).toLowerCase().includes(q) ||
      (props.language === "fr"
        ? c.name.toLowerCase().includes(q)
        : (c.nameFr ?? "").toLowerCase().includes(q)) ||
      c.code.toLowerCase().includes(q) ||
      c.dial.replace(/\s+/g, "").includes(q.replace(/\s+/g, "")),
  )
})

const select = (c: Country) => {
  emit("update:modelValue", c.code)
  close()
}

const close = () => {
  open.value = false
  query.value = ""
}

const openPopup = () => {
  if (props.disable || props.readonly) return
  open.value = true
}

const onFieldClick = () => {
  if (isPanelMode.value) openPopup()
  else if (open.value) close()
  else openPopup()
}

// — clavier : flèches + entrée (liste ouverte), échap pour fermer —
const onKeydown = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === "Escape") {
    e.preventDefault()
    close()
    return
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault()
    const list = filtered.value
    if (!list.length) return
    const dir = e.key === "ArrowDown" ? 1 : -1
    activeIndex.value = (activeIndex.value + dir + list.length) % list.length
    return
  }
  if (e.key === "Enter" && filtered.value[activeIndex.value]) {
    e.preventDefault()
    select(filtered.value[activeIndex.value]!)
  }
}

// — Fermetures : clic extérieur, Échap, scroll lock (modes panneau) —
const onDocMousedown = (e: MouseEvent) => {
  const target = e.target as Node
  if (rootEl.value?.contains(target)) return
  if (sheetRef.value?.contains(target)) return
  if (isPanelMode.value && props.persistent) return
  close()
}

const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && open.value && !props.persistent) close()
}

watch(open, (v) => {
  activeIndex.value = 0
  if (v) nextTick(() => searchInput.value?.focus())
  if (isPanelMode.value) {
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

const sheetTitle = computed(() => props.title || props.label || props.placeholder)

/** Options du mode courant (sheet → sheetOptions, modal → modalOptions) */
const modeOptions = computed<QCountryPickerModeOptions | undefined>(() => {
  if (props.mode === "sheet") return props.sheetOptions
  if (props.mode === "modal") return props.modalOptions
  return undefined
})

const sheetStyle = computed<Record<string, string> | undefined>(() => {
  const w = modeOptions.value?.width ?? props.width
  const style: Record<string, string> = {}
  if (w) {
    style.width = w
    style.maxWidth = w
  }
  if (props.height) style.height = props.height
  if (typeof props.rounded === "string") style.borderRadius = props.rounded
  if (props.translucent === true || typeof props.translucent === "number") {
    style["--q-translucent-opacity"] = `${typeof props.translucent === "number" ? props.translucent : 70}%`
  }
  return Object.keys(style).length ? style : undefined
})

/** Hauteur de la liste scrollable (options du mode courant) */
const listHeightStyle = computed<Record<string, string> | undefined>(() =>
  modeOptions.value?.height ? { height: modeOptions.value.height } : undefined,
)

/** Classes additionnelles du panneau (options du mode + modifiers bottom-sheet) */
const sheetClass = computed(() =>
  cn(
    modeOptions.value?.class,
    props.rounded === false && "q-country-picker__sheet--square",
    props.dark && "q-country-picker__sheet--dark",
    (props.translucent === true || typeof props.translucent === "number") &&
      "q-country-picker__sheet--translucent",
  ),
)

const searchPlaceholder = computed(
  () => modeOptions.value?.searchPlaceholder ?? props.placeholder,
)

// — Drag vers le bas pour fermer (mode sheet, pattern bottom-sheet) —
const dragging = ref(false)
let startY = 0
let currentDy = 0

const onHandleDown = (e: PointerEvent) => {
  if (props.mode !== "sheet") return
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  startY = e.clientY
  currentDy = 0
  dragging.value = true
}

const onHandleMove = (e: PointerEvent) => {
  if (!dragging.value) return
  currentDy = Math.max(0, e.clientY - startY)
  if (sheetRef.value) sheetRef.value.style.transform = `translateY(${currentDy}px)`
}

const onHandleUp = () => {
  if (!dragging.value) return
  dragging.value = false
  if (currentDy > props.dragThreshold) close()
  else if (sheetRef.value) sheetRef.value.style.transform = ""
  currentDy = 0
}

const fieldClasses = computed(() =>
  cn(
    "q-country-picker q-input",
    props.outlined && "q-field--outlined",
    props.filled && "q-field--filled",
    props.borderless && "q-field--borderless",
    props.dense && "q-field--dense",
    props.disable && "q-field--disabled",
  ),
)
</script>

<template>
  <div ref="rootEl" :class="fieldClasses">
    <label v-if="label" class="q-field__label-stack">{{ label }}</label>
    <div
      class="q-field__control q-country-picker__field"
      :class="{ 'q-country-picker__field--open': open }"
      role="combobox"
      tabindex="0"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="listbox"
      @click="onFieldClick"
      @keydown="onKeydown"
    >
      <span v-if="selected" class="q-country-picker__flag" aria-hidden="true">
        {{ flagOf(selected.code) }}
      </span>
      <span
        class="q-country-picker__label"
        :class="{ 'q-country-picker__label--placeholder': !selected }"
      >
        {{ selected ? countryName(selected) : placeholder }}
      </span>
      <span v-if="selected && showDial" class="q-country-picker__dial">
        {{ selected.dial }}
      </span>
      <Icon
        :icon="icons.chevronDown"
        class="q-country-picker__arrow"
        :class="{ 'q-country-picker__arrow--rotated': open }"
        aria-hidden="true"
      />
    </div>

    <!-- Mode inline : liste sous le champ -->
    <div v-if="open && mode === 'inline'" class="q-country-picker__popup" role="listbox">
      <div v-if="searchable" class="q-country-picker__search">
        <Icon :icon="icons.search" class="q-country-picker__search-icon" aria-hidden="true" />
        <input
          ref="searchInput"
          v-model="query"
          class="q-country-picker__search-input"
          :placeholder="searchPlaceholder"
          @keydown="onKeydown"
        />
      </div>
      <div class="q-country-picker__list" :style="listHeightStyle">
        <button
          v-for="(c, i) in filtered"
          :key="c.code"
          type="button"
          role="option"
          :aria-selected="c.code === modelValue ? 'true' : 'false'"
          class="q-country-picker__option"
          :class="{
            'q-country-picker__option--active': i === activeIndex,
            'q-country-picker__option--selected': c.code === modelValue,
          }"
          @mouseenter="activeIndex = i"
          @mousedown.prevent="select(c)"
        >
          <span class="q-country-picker__flag" aria-hidden="true">{{ flagOf(c.code) }}</span>
          <span class="q-country-picker__name">{{ countryName(c) }}</span>
          <span v-if="showDial" class="q-country-picker__dial">{{ c.dial }}</span>
        </button>
        <div v-if="!filtered.length" class="q-country-picker__empty">
          {{ noOptionsLabel }}
        </div>
      </div>
    </div>

    <!-- Modes panneau : overlay téléporté (modal / sheet / dialog) -->
    <Teleport to="body">
      <Transition name="q-country-modal">
        <div
          v-if="open && mode !== 'inline'"
          class="q-country-picker__overlay"
          :class="`q-country-picker__overlay--${mode}`"
          role="presentation"
        >
          <div
            ref="sheetRef"
            class="q-country-picker__sheet"
            :class="[
              `q-country-picker__sheet--${mode}`,
              sheetClass,
              dragging && 'q-country-picker__sheet--dragging',
            ]"
            :style="[sheetStyle, modeOptions?.style, props.contentStyle]"
            role="dialog"
            aria-modal="true"
            :aria-label="sheetTitle"
          >
            <div
              v-if="mode === 'sheet'"
              class="q-country-picker__handle"
              @pointerdown="onHandleDown"
              @pointermove="onHandleMove"
              @pointerup="onHandleUp"
              @pointercancel="onHandleUp"
            >
              <div class="q-country-picker__handle-bar" />
            </div>
            <div class="q-country-picker__sheet-header">
              <span class="q-country-picker__sheet-title">{{ sheetTitle }}</span>
              <button
                type="button"
                class="q-country-picker__sheet-close"
                :aria-label="`Close ${sheetTitle}`"
                @click="close"
              >
                <Icon :icon="icons.x" aria-hidden="true" />
              </button>
            </div>
            <div class="q-country-picker__sheet-body">
              <div v-if="searchable" class="q-country-picker__search">
                <Icon :icon="icons.search" class="q-country-picker__search-icon" aria-hidden="true" />
                <input
                  ref="searchInput"
                  v-model="query"
                  class="q-country-picker__search-input"
                  :placeholder="searchPlaceholder"
                  @keydown="onKeydown"
                />
              </div>
              <div class="q-country-picker__list" :style="listHeightStyle">
                <button
                  v-for="(c, i) in filtered"
                  :key="c.code"
                  type="button"
                  role="option"
                  :aria-selected="c.code === modelValue ? 'true' : 'false'"
                  class="q-country-picker__option"
                  :class="{
                    'q-country-picker__option--active': i === activeIndex,
                    'q-country-picker__option--selected': c.code === modelValue,
                  }"
                  @mouseenter="activeIndex = i"
                  @mousedown.prevent="select(c)"
                >
                  <span class="q-country-picker__flag" aria-hidden="true">{{ flagOf(c.code) }}</span>
                  <span class="q-country-picker__name">{{ countryName(c) }}</span>
                  <span v-if="showDial" class="q-country-picker__dial">{{ c.dial }}</span>
                </button>
                <div v-if="!filtered.length" class="q-country-picker__empty">
                  {{ noOptionsLabel }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.q-country-picker {
  position: relative;
}

.q-country-picker__field {
  cursor: pointer;
}
.q-country-picker__field--open,
.q-country-picker__field:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
}

.q-country-picker__flag {
  font-size: 18px;
  line-height: 1;
}

.q-country-picker__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: var(--foreground);
}
.q-country-picker__label--placeholder {
  color: #8b93a1;
}

.q-country-picker__dial {
  font-size: 12.5px;
  color: #8b93a1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.q-country-picker__arrow {
  font-size: 16px;
  color: #8b93a1;
  transition: transform 0.2s ease;
}
.q-country-picker__arrow--rotated {
  transform: rotate(180deg);
}

/* — liste inline — */
.q-country-picker__popup {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid rgb(0 0 0 / 0.12);
  border-radius: var(--q-radius);
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.14);
}
.dark .q-country-picker__popup {
  background-color: var(--card);
  border-color: var(--border);
  color: var(--foreground);
}

.q-country-picker__search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid rgb(0 0 0 / 0.08);
}
.dark .q-country-picker__search {
  border-bottom-color: var(--border);
}
.q-country-picker__search-icon {
  color: #8b93a1;
  font-size: 15px;
}
.q-country-picker__search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--foreground);
  font-size: 13.5px;
}

.q-country-picker__list {
  max-height: 260px;
  overflow-y: auto;
  padding: 4px;
}
.q-country-picker__option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--foreground);
  font-size: 13.5px;
  text-align: left;
  cursor: pointer;
}
.q-country-picker__option--active {
  background: rgb(25 118 210 / 0.08);
}
.q-country-picker__option--selected {
  color: var(--primary);
  font-weight: 600;
}
.q-country-picker__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.q-country-picker__empty {
  padding: 14px 10px;
  font-size: 13px;
  color: #8b93a1;
  text-align: center;
}
</style>
