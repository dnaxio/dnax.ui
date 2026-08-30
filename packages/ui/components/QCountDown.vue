<script setup lang="ts">
// QCountDown — compte à rebours : <q-count-down :time="90" format="mm:ss" @end="…" />
// ou vers une date cible : <q-count-down :to="new Date('2026-12-31')" />
// Format : DD | HH | mm | ss | SSS (défaut "HH:mm:ss"). Slot : données brutes + progress.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

interface Props {
  /** Durée initiale en SECONDES (ignoré si `to` est fourni) */
  time?: number
  /** Date cible : Date | timestamp | chaîne ISO — compte jusqu'à cette date */
  to?: string | number | Date
  /** Démarre automatiquement (défaut true) */
  autoStart?: boolean
  /** Pause / reprise (contrôle externe) */
  pause?: boolean
  /** Format d'affichage : DD, HH, mm, ss, SSS (défaut "HH:mm:ss") */
  format?: string
  /** Élément rendu (défaut span) */
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  time: 0,
  autoStart: true,
  pause: false,
  format: "HH:mm:ss",
  tag: "span",
})

const emit = defineEmits<{ end: [] }>()

const totalMs = ref(0)
const remainingMs = ref(0)
const endAt = ref(0)
const running = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const computeTotal = () => {
  if (props.to !== undefined) {
    const t =
      props.to instanceof Date
        ? props.to.getTime()
        : typeof props.to === "number"
          ? props.to
          : new Date(props.to).getTime()
    totalMs.value = Math.max(0, t - Date.now())
  } else {
    totalMs.value = Math.max(0, props.time * 1000)
  }
}

const stopTimer = () => {
  if (timer) clearInterval(timer)
  timer = null
}

const tick = () => {
  const rem = Math.max(0, endAt.value - Date.now())
  remainingMs.value = rem
  if (rem <= 0) {
    running.value = false
    stopTimer()
    emit("end")
  }
}

/** Démarre (ou reprend) le compte */
const start = () => {
  if (props.pause || remainingMs.value <= 0 || running.value) return
  endAt.value = Date.now() + remainingMs.value
  stopTimer()
  timer = setInterval(tick, 250)
  running.value = true
}

/** Met en pause */
const pauseTimer = () => {
  running.value = false
  stopTimer()
}

/** Réinitialise à la durée initiale (et relance si autoStart) */
const reset = () => {
  computeTotal()
  remainingMs.value = totalMs.value
  if (props.autoStart && !props.pause) start()
  else running.value = false
}

/** Temps restant (ms) */
const getRemaining = () => remainingMs.value
/** Progression écoulée 0 → 1 */
const getProgress = () => (totalMs.value > 0 ? 1 - remainingMs.value / totalMs.value : 0)

defineExpose({ start, pause: pauseTimer, reset, getRemaining, getProgress })

onMounted(() => {
  computeTotal()
  remainingMs.value = totalMs.value
  if (props.autoStart && !props.pause) start()
})
onBeforeUnmount(stopTimer)

watch(
  () => props.pause,
  (v) => {
    if (v) pauseTimer()
    else if (remainingMs.value > 0) start()
  },
)
watch(
  () => [props.time, props.to],
  () => reset(),
)

// — Unitées + format —
const units = computed(() => {
  const rem = remainingMs.value
  const days = Math.floor(rem / 86400000)
  const hours = Math.floor((rem % 86400000) / 3600000)
  const minutes = Math.floor((rem % 3600000) / 60000)
  const seconds = Math.floor((rem % 60000) / 1000)
  const ms = rem % 1000
  return { days, hours, minutes, seconds, ms, remaining: rem }
})

const formatted = computed(() => {
  const { days, hours, minutes, seconds, ms } = units.value
  const totalHours = Math.floor(remainingMs.value / 3600000)
  const h = props.format.includes("D") ? hours : totalHours
  const pad = (n: number, len = 2) => String(n).padStart(len, "0")
  return props.format
    .replace(/SSS/g, pad(ms, 3))
    .replace(/SS/g, pad(Math.floor(ms / 10), 2))
    .replace(/S/g, String(Math.floor(ms / 100)))
    .replace(/DD/g, pad(days))
    .replace(/D/g, String(days))
    .replace(/HH/g, pad(h))
    .replace(/H/g, String(h))
    .replace(/mm/g, pad(minutes))
    .replace(/m/g, String(minutes))
    .replace(/ss/g, pad(seconds))
    .replace(/s/g, String(seconds))
})

const progress = computed(() => (totalMs.value > 0 ? 1 - remainingMs.value / totalMs.value : 0))
</script>

<template>
  <component
    :is="tag"
    class="q-count-down"
    :class="{ 'q-count-down--done': remainingMs <= 0 && totalMs > 0 }"
  >
    <slot
      v-bind="{ ...units, progress, running, formatted }"
      :formatted="formatted"
      :progress="progress"
      :running="running"
    >
      {{ formatted }}
    </slot>
  </component>
</template>
