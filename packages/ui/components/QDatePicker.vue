<script setup lang="ts">
// QDatePicker — sélecteur de date type DatePicker shadcn-vue, API Quasar :
// <q-date-picker v-model="date" mode="sheet" label="Échéance" clearable outlined />
// Modes : inline (calendrier en place) | popover (panneau ancré sous le champ) |
// modal (centré) | sheet (bottom sheet) | dialog (plein écran).
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"
import { useOverlayBack } from "../lib/overlayBack"
import { placePopover, type PopoverPlacement } from "../lib/datePicker"
import QDateCalendar from "./internal/QDateCalendar.vue"

interface Props {
  /** Date sélectionnée */
  modelValue?: Date | null
  /** Mode d'affichage */
  mode?: "inline" | "popover" | "sheet" | "modal" | "dialog"
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
  /** Largeur du panneau (popover/sheet/modal) */
  width?: string
  /** Titre du panneau (modes à voile : sheet/modal/dialog) */
  title?: string
  /** Raccourci « Today » sous le calendrier (tous les modes) */
  todayBtn?: boolean
  /** En-tête : libellé cliquable ouvrant le choix du mois (tous les modes) */
  monthDropdown?: boolean
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
  todayBtn: false,
  monthDropdown: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: Date | null]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

/** Champ déclencheur (tout sauf `inline`) */
const isPanelMode = computed(() => props.mode !== "inline")
/** Panneau ancré au champ : ni voile, ni blocage du scroll, ni retour navigateur */
const isPopover = computed(() => props.mode === "popover")
/** Modes à voile sombre (sheet/modal/dialog) */
const isOverlayMode = computed(
  () => props.mode === "sheet" || props.mode === "modal" || props.mode === "dialog",
)

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const sheetRef = ref<HTMLElement | null>(null)

// « Retour » navigateur → ferme le panneau au voile (sheet/modal/dialog) au lieu de
// naviguer. Le popover, lui, reste un menu : clic extérieur / Échap suffisent.
const panelOpen = computed(() => isOverlayMode.value && open.value)
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

// — Popover : panneau ancré au champ, position calculée en `fixed` (téléporté) —
// Le calcul vit dans un helper pur (`lib/datePicker.ts`) : ici on ne fait que
// mesurer les rectangles et sérialiser le résultat.
const popoverPlacement = ref<PopoverPlacement | null>(null)
// Conserve le dernier emplacement à la fermeture : l'animation de sortie en dépend.
const popoverStyle = computed<Record<string, string>>(() => {
  const p = popoverPlacement.value
  if (!p) return { visibility: "hidden" }
  return {
    top: p.top === null ? "auto" : `${p.top}px`,
    bottom: p.bottom === null ? "auto" : `${p.bottom}px`,
    left: `${p.left}px`,
    "--q-date-picker-caret": `${p.caret}px`,
  }
})

/** Le panneau borne sa hauteur à l'espace visible ; la liste scrolle au-delà. */
const popoverPanelStyle = computed<Record<string, string | undefined>>(() => ({
  ...sheetStyle.value,
  maxHeight: popoverPlacement.value ? `${popoverPlacement.value.maxHeight}px` : undefined,
}))

const positionPopover = () => {
  const el = rootEl.value
  if (!el || typeof window === "undefined") return

  // Ancre = bas du CHAMP : `.q-field__bottom` réserve ~24px même vide, ce qui
  // éloignerait le panneau. Quand un hint / une erreur est affiché, on prend la
  // racine pour ne pas recouvrir le texte (même règle que le popup de QSelect).
  const control = el.querySelector<HTMLElement>(".q-field__control")
  const hasBottomText = !!el.querySelector(".q-field__hint, .q-field__error")
  const anchor = (!hasBottomText && control ? control : el).getBoundingClientRect()

  popoverPlacement.value = placePopover({
    anchor: { top: anchor.top, bottom: anchor.bottom, left: anchor.left, width: anchor.width },
    viewport: { width: window.innerWidth, height: window.innerHeight },
    // Largeur mesurée après rendu (le champ `width` peut être en %, vw…)
    panelWidth: sheetRef.value?.getBoundingClientRect().width,
  })
}

const onViewportChange = () => {
  if (open.value && isPopover.value) positionPopover()
}

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

watch(open, async (v) => {
  // Le voile bloque le scroll de la page ; le popover le laisse vivre.
  if (typeof document !== "undefined" && isOverlayMode.value) {
    document.body.style.overflow = v ? "hidden" : ""
  }
  if (v && isPopover.value) {
    await nextTick()
    positionPopover()
  }
})

onMounted(() => {
  if (typeof document !== "undefined") {
    // Phase de CAPTURE : un `@mousedown.stop` parent (contenu de QDialog…) bloque
    // sinon l'événement avant `document` → calendrier jamais fermé au clic extérieur.
    document.addEventListener("mousedown", onDocMousedown, true)
    document.addEventListener("keydown", onDocKeydown)
    // Le champ peut bouger (scroll) ou la fenêtre changer de taille : on repositionne
    window.addEventListener("scroll", onViewportChange, true)
    window.addEventListener("resize", onViewportChange)
  }
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("mousedown", onDocMousedown, true)
    document.removeEventListener("keydown", onDocKeydown)
    window.removeEventListener("scroll", onViewportChange, true)
    window.removeEventListener("resize", onViewportChange)
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
        :today-btn="todayBtn"
        :month-dropdown="monthDropdown"
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
      <div class="q-field__bottom">
        <div v-if="error" class="q-field__error">{{ errorMessage }}</div>
        <div v-else-if="hint" class="q-field__hint">{{ hint }}</div>
      </div>

      <Teleport to="body">
        <Transition :name="isPopover ? 'q-date-popover' : 'q-date-modal'">
          <div
            v-if="open"
            class="q-date-picker__overlay"
            :class="[
              `q-date-picker__overlay--${mode}`,
              isPopover && popoverPlacement?.direction === 'up' && 'q-date-picker__overlay--popover-up',
            ]"
            :style="isPopover ? popoverStyle : undefined"
            role="presentation"
            @mousedown.self="closePopup"
          >
            <div
              ref="sheetRef"
              class="q-date-picker__sheet"
              :class="`q-date-picker__sheet--${mode}`"
              :style="isPopover ? popoverPanelStyle : sheetStyle"
              role="dialog"
              :aria-modal="isOverlayMode ? 'true' : undefined"
              :aria-label="sheetTitle"
            >
              <!-- En-tête (titre + fermeture) réservé aux modes à voile : un popover
                   n'a ni titre ni bouton de fermeture, il se ferme au clic extérieur. -->
              <div v-if="isOverlayMode" class="q-date-picker__sheet-header">
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
                  :today-btn="todayBtn"
                  :month-dropdown="monthDropdown"
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
