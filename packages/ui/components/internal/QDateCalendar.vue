<script setup lang="ts">
// QDateCalendar — calendrier interne (non exporté) utilisé par QDatePicker (inline + panneau).
import { computed, ref, watch } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../../lib/icons"
import { cn } from "../../lib/utils"
import { useConfigLang } from "../../lib/useComponentProps"
import {
  dateLabels,
  dateLocale,
  monthShortNames,
  monthYearLabel,
  weekdayShortNames,
} from "../../lib/dateI18n"

interface Props {
  modelValue?: Date | null
  /** Date minimale sélectionnable */
  minDate?: Date | string
  /** Date maximale sélectionnable */
  maxDate?: Date | string
  /** Désactive des dates arbitraires */
  disabledDates?: (d: Date) => boolean
  /** Premier jour de la semaine : 0 = dimanche, 1 = lundi (défaut) */
  firstDayOfWeek?: number
  /** Libellé du raccourci « aujourd'hui » (texte selon `lang`) */
  todayBtn?: boolean
  /** En-tête : libellé cliquable ouvrant le choix du mois (et de l'année) */
  monthDropdown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  firstDayOfWeek: 1,
  todayBtn: false,
  monthDropdown: false,
})

const emit = defineEmits<{ select: [date: Date] }>()

// Langue de l'app (`QConfigProvider lang`) : mois, jours et libellés suivent.
const configLang = useConfigLang()
const locale = computed(() => dateLocale(configLang.value))
const labels = computed(() => dateLabels(configLang.value))

const today = new Date()
const viewYear = ref(props.modelValue?.getFullYear() ?? today.getFullYear())
const viewMonth = ref(props.modelValue?.getMonth() ?? today.getMonth())
/** Choix du mois ouvert (en-tête) — remplace la grille des jours */
const monthPickerOpen = ref(false)

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      viewYear.value = v.getFullYear()
      viewMonth.value = v.getMonth()
    }
  },
)

const toDate = (d: Date | string) => (d instanceof Date ? d : new Date(d))
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const weekdayLabels = computed(() => weekdayShortNames(locale.value, props.firstDayOfWeek))

const weeks = computed<(Date | null)[][]>(() => {
  const y = viewYear.value
  const m = viewMonth.value
  const offset = (new Date(y, m, 1).getDay() - props.firstDayOfWeek + 7) % 7
  const dim = new Date(y, m + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= dim; d++) cells.push(new Date(y, m, d))
  while (cells.length % 7 !== 0) cells.push(null)
  const result: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7))
  return result
})

const monthLabel = computed(() => monthYearLabel(locale.value, viewYear.value, viewMonth.value))

/** Noms courts des 12 mois, dans la langue de l'app (comme `monthLabel`) */
const monthNames = computed(() => monthShortNames(locale.value))

const prevMonth = () => {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  }
  else {
    viewMonth.value--
  }
}

const nextMonth = () => {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  }
  else {
    viewMonth.value++
  }
}

const prevYear = () => viewYear.value--
const nextYear = () => viewYear.value++

/** Choix d'un mois dans l'en-tête : on saute au mois, la grille revient */
const onPickMonth = (month: number) => {
  viewMonth.value = month
  monthPickerOpen.value = false
}

const isSelected = (d: Date) => !!props.modelValue && sameDay(props.modelValue, d)
const isToday = (d: Date) => sameDay(d, new Date())

const isDisabled = (d: Date) => {
  if (props.minDate && d < startOfDay(toDate(props.minDate))) return true
  if (props.maxDate && d > startOfDay(toDate(props.maxDate))) return true
  return !!props.disabledDates?.(d)
}

const onSelectDate = (d: Date) => {
  if (isDisabled(d)) return
  emit("select", d)
}

/** Raccourci « aujourd'hui » : désactivé quand aujourd'hui est hors bornes / désactivé */
const todaySelectable = computed(() => !isDisabled(startOfDay(new Date())))

const selectToday = () => {
  if (!todaySelectable.value) return
  emit("select", startOfDay(new Date()))
}
</script>

<template>
  <div class="q-date-calendar">
    <div class="q-date-calendar__nav">
      <button
        type="button"
        class="q-date-calendar__nav-btn"
        :aria-label="labels.prevMonth"
        @click="prevMonth"
      >
        <Icon :icon="icons.chevronLeft" aria-hidden="true" />
      </button>
      <button
        v-if="monthDropdown"
        type="button"
        class="q-date-calendar__nav-label q-date-calendar__nav-label--button"
        :class="{ 'q-date-calendar__nav-label--open': monthPickerOpen }"
        :aria-expanded="monthPickerOpen"
        :aria-label="labels.chooseMonth"
        @click="monthPickerOpen = !monthPickerOpen"
      >
        <span class="q-date-calendar__nav-text">{{ monthLabel }}</span>
        <Icon :icon="icons.chevronDown" class="q-date-calendar__nav-caret" aria-hidden="true" />
      </button>
      <span v-else class="q-date-calendar__nav-label">{{ monthLabel }}</span>
      <button
        type="button"
        class="q-date-calendar__nav-btn"
        :aria-label="labels.nextMonth"
        @click="nextMonth"
      >
        <Icon :icon="icons.chevronRight" aria-hidden="true" />
      </button>
    </div>

    <!-- Choix du mois / de l'année (en-tête cliquable) -->
    <div v-if="monthDropdown && monthPickerOpen" class="q-date-calendar__picker">
      <div class="q-date-calendar__picker-year">
        <button
          type="button"
          class="q-date-calendar__nav-btn"
          :aria-label="labels.prevYear"
          @click="prevYear"
        >
          <Icon :icon="icons.chevronLeft" aria-hidden="true" />
        </button>
        <span class="q-date-calendar__picker-year-label">{{ viewYear }}</span>
        <button
          type="button"
          class="q-date-calendar__nav-btn"
          :aria-label="labels.nextYear"
          @click="nextYear"
        >
          <Icon :icon="icons.chevronRight" aria-hidden="true" />
        </button>
      </div>
      <div class="q-date-calendar__picker-months">
        <button
          v-for="(name, index) in monthNames"
          :key="name"
          type="button"
          class="q-date-calendar__picker-month"
          :class="{ 'q-date-calendar__picker-month--current': index === viewMonth }"
          :aria-current="index === viewMonth ? 'true' : undefined"
          @click="onPickMonth(index)"
        >
          {{ name }}
        </button>
      </div>
    </div>

    <template v-else>
      <div class="q-date-calendar__weekdays">
        <span v-for="(d, i) in weekdayLabels" :key="i" class="q-date-calendar__weekday">{{ d }}</span>
      </div>

      <div class="q-date-calendar__weeks">
        <div v-for="(week, wi) in weeks" :key="wi" class="q-date-calendar__week">
          <button
            v-for="(d, di) in week"
            :key="di"
            type="button"
            class="q-date-calendar__day"
            :class="cn(
              !d && 'q-date-calendar__day--empty',
              !!d && isToday(d) && 'q-date-calendar__day--today',
              !!d && isSelected(d) && 'q-date-calendar__day--selected',
            )"
            :disabled="!d || isDisabled(d)"
            :aria-selected="!!d && isSelected(d) ? 'true' : 'false'"
            @click="d && onSelectDate(d)"
          >
            {{ d ? d.getDate() : "" }}
          </button>
        </div>
      </div>
    </template>

    <div v-if="todayBtn" class="q-date-calendar__footer">
      <button
        type="button"
        class="q-date-calendar__today"
        :disabled="!todaySelectable"
        @click="selectToday"
      >
        {{ labels.today }}
      </button>
    </div>
  </div>
</template>
