<script setup lang="ts">
// QDatePicker — sélecteur de date type DatePicker shadcn-vue, API Quasar :
// <q-date-picker v-model="date" mode="sheet" label="Échéance" clearable outlined />
// Modes : inline (calendrier en place) | modal (centré) | sheet (bottom sheet) | dialog (plein écran).
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { useOverlayBack } from "../lib/overlayBack"
import QDateCalendar from "./internal/QDateCalendar.vue"

interface Props {
  /** Date sélectionnée */
  modelValue?: Date | null
  /** Mode d'affichage */
  mode?: "inline" | "sheet" | "modal" | "dialog"
  label?: string
  stackLabel?: boolean
  hint?: string
  error?: boolean
  errorMessage?: string
  placeholder?: string
  outlined?: boolean
  filled?: boolean
  borderless?: boolean
  dense?: boolean
  clearable?: boolean
  disable?: boolean
  readonly?: boolean
  /** Formateur d'affichage de la date sélectionnée */
  format?: (d: Date) => string
  /** Date minimale sélectionnable */
  minDate?: Date | string
  /** Date maximale sélectionnable */
  maxDate?: Date | string
  /** Désactive des dates arbitraires */
  disabledDates?: (d: Date) => boolean
  /** Premier jour de la semaine : 0 = dimanche, 1 = lundi (défaut) */
  firstDayOfWeek?: number
  /** Largeur du panneau (modal/sheet) */
  width?: string
  /** Titre du panneau */
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  mode: "inline",
  stackLabel: false,
  error: false,
  outlined: false,
  filled: false,
  borderless: false,
  dense: false,
  clearable: false,
  disable: false,
  readonly: false,
  firstDayOfWeek: 1,
  width: "",
  title: "",
})

const emit = defineEmits<{
  "update:modelValue": [value: Date | null]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

const isPanelMode = computed(() => props.mode !== "inline")

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const sheetRef = ref<HTMLElement | null>(null)

// « Retour » navigateur → ferme le panneau (sheet/modal/dialog) au lieu de naviguer
const panelOpen = computed(() => isPanelMode.value && open.value)
useOverlayBack(panelOpen, () => closePopup(), "QDatePicker")

// — Affichage du champ —
const formatFn = computed(
  () =>
    props.format ??
    ((d: Date) =>
      new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "short", year: "numeric" }).format(d)),
)

const displayText = computed(() => (props.modelValue ? formatFn.value(props.modelValue) : ""))

const floatActive = computed(
  () => open.value || props.modelValue !== null || props.stackLabel,
)

const fieldClasses = computed(() =>
  cn(
    "q-date-picker q-input",
    props.outlined && "q-field--outlined",
    props.filled && "q-field--filled",
    props.borderless && "q-field--borderless",
    props.dense && "q-field--dense",
    props.error && "q-field--error",
    props.disable && "q-field--disabled",
    floatActive.value && "q-field--float",
  ),
)

const onSelect = (d: Date) => {
  emit("update:modelValue", d)
  if (isPanelMode.value) open.value = false
}

const onClear = () => {
  emit("update:modelValue", null)
  emit("clear")
}

const openPopup = () => {
  if (props.disable || props.readonly) return
  open.value = true
}

const closePopup = () => {
  open.value = false
}

const sheetTitle = computed(() => props.title || props.label || "Sélectionner une date")

const sheetStyle = computed<Record<string, string> | undefined>(() =>
  props.width ? { width: props.width, maxWidth: props.width } : undefined,
)

// — Fermetures : clic extérieur (hors panneau téléporté), Échap, scroll lock —
const onDocMousedown = (e: MouseEvent) => {
  const target = e.target as Node
  if (rootEl.value?.contains(target)) return
  if (sheetRef.value?.contains(target)) return
  closePopup()
}

const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && open.value) closePopup()
}

watch(open, (v) => {
  if (typeof document !== "undefined" && isPanelMode.value) {
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
</script>

<template>
  <div ref="rootEl" :class="isPanelMode ? fieldClasses : 'q-date-picker'">
    <!-- Mode inline : calendrier en place -->
    <div v-if="mode === 'inline'">
      <q-date-calendar
        :model-value="modelValue"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-dates="disabledDates"
        :first-day-of-week="firstDayOfWeek"
        @select="onSelect"
      />
    </div>

    <!-- Modes panneau : champ déclencheur -->
    <template v-else>
      <label v-if="label" class="q-field__label-stack">{{ label }}</label>
      <div class="q-field__control" @click="openPopup">
        <Icon :icon="icons.calendarDays" class="q-date-picker__field-icon" aria-hidden="true" />
        <span class="q-select__display" :class="{ 'q-select__display--placeholder': !displayText }">
          {{ displayText || placeholder }}
        </span>
        <button
          v-if="clearable && modelValue && !disable && !readonly"
          class="q-field__clear"
          type="button"
          aria-label="Effacer"
          @click.stop="onClear"
        >
          <Icon :icon="icons.x" aria-hidden="true" />
        </button>
        <ChevronDown class="q-select__arrow" :class="{ 'q-select__arrow--rotated': open }" aria-hidden="true" />
      </div>
      <div v-if="error" class="q-field__bottom">
        <div class="q-field__error">{{ errorMessage }}</div>
      </div>
      <div v-else-if="hint" class="q-field__bottom">
        <div class="q-field__hint">{{ hint }}</div>
      </div>

      <Teleport to="body">
        <Transition name="q-date-modal">
          <div
            v-if="open"
            class="q-date-picker__overlay"
            :class="`q-date-picker__overlay--${mode}`"
            role="presentation"
            @mousedown.self="closePopup"
          >
            <div
              ref="sheetRef"
              class="q-date-picker__sheet"
              :class="`q-date-picker__sheet--${mode}`"
              :style="sheetStyle"
              role="dialog"
              aria-modal="true"
              :aria-label="sheetTitle"
            >
              <div class="q-date-picker__sheet-header">
                <span class="q-date-picker__sheet-title">{{ sheetTitle }}</span>
                <button
                  type="button"
                  class="q-date-picker__sheet-close"
                  :aria-label="`Fermer ${sheetTitle}`"
                  @click="closePopup"
                >
                  <Icon :icon="icons.x" aria-hidden="true" />
                </button>
              </div>
              <div class="q-date-picker__sheet-body">
                <q-date-calendar
                  :model-value="modelValue"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :disabled-dates="disabledDates"
                  :first-day-of-week="firstDayOfWeek"
                  @select="onSelect"
                />
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>
  </div>
</template>
