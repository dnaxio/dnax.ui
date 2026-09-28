<script setup lang="ts">
// QTime — champ heure borné par `v-model`, API Quasar : <q-time v-model="t" format24h now-btn />
// La valeur est TOUJOURS une chaîne 24 h : `"HH:MM"` (ou `"HH:MM:SS"` si `withSeconds`).
// `format24h` ne change que l'AFFICHAGE et la SAISIE (`h:mm AM/PM` en mode 12 h).
// À l'ouverture, un panneau téléporté (colonnes heures / minutes / secondes) est situé
// par `placePopover` par rapport au champ, puis suit le scroll et le redimensionnement.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue"
import { Icon } from "@iconify/vue"
import { cn } from "../lib/utils"
import {
  POPOVER_FALLBACK_WIDTH,
  POPOVER_GAP,
  POPOVER_MIN_SPACE,
  POPOVER_VIEWPORT_MARGIN,
  placePopover,
} from "../lib/datePicker"

type TimePosition = "bottom-start" | "bottom-end" | "top-start" | "top-end"

interface Props {
  /** Heure liée (`"HH:MM"`, ou `"HH:MM:SS"` si `withSeconds`) */
  modelValue?: string
  /** Affichage 24 h (défaut) ; `false` = saisie et affichage `h:mm AM/PM` */
  format24h?: boolean
  /** Ajoute la colonne des secondes et sérialise en `"HH:MM:SS"` */
  withSeconds?: boolean
  /** Pas des minutes (et des secondes) dans le panneau — défaut 1 */
  minuteStep?: number
  /** Pas des heures dans le panneau — défaut 1 */
  hourStep?: number
  /** Libellé affiché au-dessus du champ */
  label?: string
  /** Texte d'aide affiché sous le champ */
  hint?: string
  /** État d'erreur (bordure + message) */
  error?: boolean
  /** Message affiché quand `error` est vrai */
  errorMessage?: string
  /** Désactive le champ (ni ouverture, ni modification) */
  disable?: boolean
  /** Lecture seule (ni ouverture, ni modification) */
  readonly?: boolean
  /** Champ compact (hauteur réduite) */
  dense?: boolean
  /** Thème sombre explicite (sinon hérité de l'ancêtre `.dark`) */
  dark?: boolean
  /** Bouton « Now » plaçant l'heure courante dans le panneau */
  nowBtn?: boolean
  /** Placement du panneau par rapport au champ — défaut `"bottom-start"` */
  position?: TimePosition
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  format24h: true,
  withSeconds: false,
  minuteStep: 1,
  hourStep: 1,
  label: "",
  hint: "",
  error: false,
  errorMessage: "",
  disable: false,
  readonly: false,
  dense: false,
  dark: false,
  nowBtn: false,
  position: "bottom-start",
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  open: []
  close: []
}>()

const inputId = useId()
const rootEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const isDisabled = computed(() => props.disable || props.readonly)

// ───────────────────────────── Lecture / écriture de la valeur ─────────────────────────────

interface TimeParts {
  h: number
  m: number
  s: number
}

/** Résultat brut du parseur : le suffixe meridiem est conservé à part. */
interface ParsedTime extends TimeParts {
  meridiem: "am" | "pm" | null
}

const pad2 = (n: number) => String(n).padStart(2, "0")
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

/**
 * Analyse tolérante d'une heure : `9:5`, `09:05`, `09h05`, `9h5`, `9.05`, `9 05`,
 * `2:30 PM` (ou `am`/`p.m.`…) sont acceptés. Renvoie `null` si aucun nombre exploitable.
 */
const parseTime = (raw: string): ParsedTime | null => {
  let text = String(raw ?? "")
    .trim()
    .toLowerCase()
  if (!text) return null

  let meridiem: "am" | "pm" | null = null
  const mer = text.match(/(a\.?m\.?|p\.?m\.?)\s*$/)
  if (mer) {
    meridiem = mer[1]!.startsWith("p") ? "pm" : "am"
    text = text.slice(0, mer.index).trim()
  }

  // Sépare par `h`, espace, point, virgule… et retire les séparateurs de fin (`9h`).
  const norm = text.replace(/[h\s.,·]+/g, ":").replace(/:+$/g, "")
  const match = norm.match(/^(\d{1,2})(?::(\d{1,2})(?::(\d{1,2}))?)?$/)
  if (!match) return null

  return {
    h: Number(match[1]),
    m: match[2] !== undefined ? Number(match[2]) : 0,
    s: match[3] !== undefined ? Number(match[3]) : 0,
    meridiem,
  }
}

/**
 * Borne les composantes et résout le meridiem. La valeur stockée étant toujours en 24 h,
 * un suffixe AM/PM est converti ; en mode 12 h sans suffixe, on reprend le meridiem courant.
 */
const normalizeParts = (p: ParsedTime, fallbackMeridiem: "am" | "pm"): TimeParts => {
  let h = p.h
  if (props.format24h) {
    if (p.meridiem) h = (h % 12) + (p.meridiem === "pm" ? 12 : 0)
    h = clamp(h, 0, 23)
  } else {
    const meridiem = p.meridiem ?? fallbackMeridiem
    h = (clamp(h, 1, 12) % 12) + (meridiem === "pm" ? 12 : 0)
  }
  return { h, m: clamp(p.m, 0, 59), s: clamp(p.s, 0, 59) }
}

/** Valeur courante (toujours bornée) ; `null` tant qu'aucune heure n'a été saisie. */
const parsed = computed<TimeParts | null>(() => {
  const p = parseTime(props.modelValue)
  return p ? normalizeParts(p, "am") : null
})

/** Heure de travail : sert d'état pour les colonnes quand aucune valeur n'est posée. */
const working = computed<TimeParts>(() => parsed.value ?? { h: 0, m: 0, s: 0 })

const isPm = computed(() => working.value.h >= 12)

const h12 = (h: number) => (h % 12 === 0 ? 12 : h % 12)
const fromH12 = (hour12: number, pm: boolean) => (hour12 % 12) + (pm ? 12 : 0)

/** Sérialise en `"HH:MM"` (ou `"HH:MM:SS"`) — toujours en 24 h. */
const toModel = (p: TimeParts): string =>
  `${pad2(p.h)}:${pad2(p.m)}${props.withSeconds ? `:${pad2(p.s)}` : ""}`

/** Formate pour l'affichage du champ / du panneau (12 h seulement si `format24h` est faux). */
const formatParts = (p: TimeParts): string => {
  let hour = p.h
  let suffix = ""
  if (!props.format24h) {
    const pm = hour >= 12
    hour = h12(hour)
    suffix = pm ? " PM" : " AM"
  }
  const base = `${props.format24h ? pad2(hour) : hour}:${pad2(p.m)}${props.withSeconds ? `:${pad2(p.s)}` : ""}`
  return base + suffix
}

const displayText = computed(() => (parsed.value ? formatParts(parsed.value) : ""))
const placeholder = computed(() => (props.withSeconds ? "--:--:--" : "--:--"))

// ─────────────────────────────────── Colonnes du panneau ───────────────────────────────────

const stepOf = (value: number) => Math.max(1, Math.floor(value) || 1)
const hourStep = computed(() => stepOf(props.hourStep))
const minuteStep = computed(() => stepOf(props.minuteStep))

const hours = computed<number[]>(() => {
  const out: number[] = []
  if (props.format24h) for (let h = 0; h < 24; h += hourStep.value) out.push(h)
  else for (let h = 1; h <= 12; h += hourStep.value) out.push(h)
  return out
})

const minutes = computed<number[]>(() => {
  const out: number[] = []
  for (let m = 0; m < 60; m += minuteStep.value) out.push(m)
  return out
})

/** Les secondes suivent le pas des minutes (aucune prop `second-step` dans l'API). */
const seconds = computed<number[]>(() => minutes.value)

const hourLabel = (h: number) => (props.format24h ? pad2(h) : String(h))
const isHourSelected = (h: number) =>
  props.format24h ? working.value.h === h : h12(working.value.h) === h
const isMinuteSelected = (m: number) => working.value.m === m
const isSecondSelected = (s: number) => working.value.s === s

// ───────────────────────────────────────── Sélection ─────────────────────────────────────────

// `h` est TOUJOURS une heure 24 h : les colonnes et les conversions AM/PM ont déjà résolu
// le meridiem, on ne fait donc que borner avant de sérialiser.
const commit = (h: number, m: number, s: number) => {
  emit(
    "update:modelValue",
    toModel({ h: clamp(h, 0, 23), m: clamp(m, 0, 59), s: clamp(s, 0, 59) }),
  )
  nextTick(scrollSelectedIntoView)
}

const selectHour = (value: number) => {
  const hour = props.format24h ? value : fromH12(value, isPm.value)
  commit(hour, working.value.m, working.value.s)
}
const selectMinute = (value: number) => commit(working.value.h, value, working.value.s)
const selectSecond = (value: number) => commit(working.value.h, working.value.m, value)
const setMeridiem = (pm: boolean) =>
  commit(fromH12(h12(working.value.h), pm), working.value.m, working.value.s)

const snapTo = (value: number, step: number, max: number) => Math.min(Math.round(value / step) * step, max)

const setNow = () => {
  const now = new Date()
  commit(
    snapTo(now.getHours(), hourStep.value, 23),
    snapTo(now.getMinutes(), minuteStep.value, 59),
    snapTo(now.getSeconds(), minuteStep.value, 59),
  )
}

const scrollSelectedIntoView = () => {
  const panel = panelRef.value
  if (!panel) return
  panel.querySelectorAll<HTMLElement>('[aria-selected="true"]').forEach((el) => {
    el.scrollIntoView({ block: "nearest" })
  })
}

// ───────────────────────── Ouverture / fermeture / positionnement ─────────────────────────

const open = ref(false)

const show = () => {
  if (isDisabled.value || open.value) return
  open.value = true
}
const hide = () => {
  if (open.value) open.value = false
}
const toggle = () => (open.value ? hide() : show())

const onControlClick = () => {
  if (isDisabled.value) return
  show()
  inputEl.value?.focus()
}

const onDocMousedown = (e: MouseEvent) => {
  const target = e.target as Node
  if (rootEl.value?.contains(target) || panelRef.value?.contains(target)) return
  hide()
}
const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && open.value) hide()
}

interface PanelPlacement {
  direction: "down" | "up"
  top: number | null
  bottom: number | null
  left: number
  maxHeight: number
}

/** Espace vertical minimal pour honorer le côté demandé plutôt que la bascule automatique. */
const MIN_FORCED_SPACE = 120

const placement = ref<PanelPlacement | null>(null)

/**
 * Mesure le champ puis délègue le calcul à `placePopover` (bascule, écart rogné, hauteur
 * bornée). Le côté demandé par `position` est honoré quand la place le permet, sinon la
 * bascule automatique du helper reprend la main ; le suffixe `-start` / `-end` choisit
 * l'alignement horizontal du panneau. La mesure se fait APRÈS rendu (largeur réelle).
 */
const positionPanel = () => {
  const el = rootEl.value
  if (!el || typeof window === "undefined") return

  // Ancre = bas du CHAMP : la zone hint/erreur sous le contrôle ne doit pas éloigner le panneau.
  const control = el.querySelector<HTMLElement>(".q-time__control")
  const hasBottomText = props.error || !!props.hint
  const anchor = (!hasBottomText && control ? control : el).getBoundingClientRect()
  const viewport = { width: window.innerWidth, height: window.innerHeight }

  const panelWidth = panelRef.value?.getBoundingClientRect().width
  const base = placePopover({
    anchor: { top: anchor.top, bottom: anchor.bottom, left: anchor.left, width: anchor.width },
    viewport,
    panelWidth,
  })

  const wantsUp = props.position.startsWith("top")
  const spaceAbove = anchor.top - POPOVER_VIEWPORT_MARGIN
  const spaceBelow = viewport.height - anchor.bottom - POPOVER_VIEWPORT_MARGIN
  const room = wantsUp ? spaceAbove : spaceBelow
  const direction: "down" | "up" =
    room >= MIN_FORCED_SPACE ? (wantsUp ? "up" : "down") : base.direction

  const available = Math.max(direction === "down" ? spaceBelow : spaceAbove, 0)
  const gap = Math.max(0, Math.min(POPOVER_GAP, available - POPOVER_MIN_SPACE))

  const width = panelWidth ?? POPOVER_FALLBACK_WIDTH
  const alignEnd = props.position.endsWith("end")
  const left = alignEnd
    ? Math.round(
        clamp(anchor.left + anchor.width - width, POPOVER_VIEWPORT_MARGIN, viewport.width - width - POPOVER_VIEWPORT_MARGIN),
      )
    : base.left

  placement.value = {
    direction,
    top: direction === "down" ? Math.round(anchor.bottom + gap) : null,
    bottom: direction === "up" ? Math.round(viewport.height - anchor.top + gap) : null,
    left,
    maxHeight: Math.round(Math.max(available - gap, 0)),
  }
}

// Le dernier emplacement est conservé à la fermeture : l'animation de sortie en dépend.
const panelStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  const p = placement.value
  if (!p) {
    style.visibility = "hidden"
    return style
  }
  style.top = p.top === null ? "auto" : `${p.top}px`
  style.bottom = p.bottom === null ? "auto" : `${p.bottom}px`
  style.left = `${p.left}px`
  style.maxHeight = `${p.maxHeight}px`
  return style
})

const panelClasses = computed(() =>
  cn(
    "q-time__panel",
    props.dark && "q-time__panel--dark",
    placement.value?.direction === "up" && "q-time__panel--up",
  ),
)

const onViewportChange = () => {
  if (open.value) positionPanel()
}

watch(open, async (v) => {
  if (v) emit("open")
  else emit("close")
  if (v) {
    await nextTick()
    positionPanel()
    scrollSelectedIntoView()
  }
})

watch(
  () => props.position,
  () => {
    if (open.value) positionPanel()
  },
)

// ───────────────────────────────────── Saisie clavier ─────────────────────────────────────

const draft = ref("")
watch(displayText, (v) => (draft.value = v), { immediate: true })

const onInput = (e: Event) => {
  draft.value = (e.target as HTMLInputElement).value
}

/** Valide la saisie : normalise et borne ; une saisie illisible est ignorée (retour). */
const commitDraft = () => {
  const raw = draft.value.trim()
  const p = raw ? parseTime(raw) : null
  if (!p) {
    draft.value = displayText.value
    return
  }
  const parts = normalizeParts(p, isPm.value ? "pm" : "am")
  emit("update:modelValue", toModel(parts))
  draft.value = formatParts(parts)
}

const onFocus = () => {
  draft.value = displayText.value
}
const onBlur = () => commitDraft()
const onEnter = () => {
  commitDraft()
  hide()
}

/** Flèches ↑/↓ : ± `minuteStep` (panneau fermé), ou ± 1 h avec `Shift`. */
const onArrow = (direction: 1 | -1, shift: boolean) => {
  if (isDisabled.value || open.value) return
  const step = (shift ? 60 : minuteStep.value) * direction
  const total = working.value.h * 60 + working.value.m
  const next = (((total + step) % 1440) + 1440) % 1440
  commit(Math.floor(next / 60), next % 60, working.value.s)
}

// ────────────────────────────────────────── Cycle de vie ──────────────────────────────────────────

onMounted(() => {
  if (typeof document === "undefined") return
  // Phase de CAPTURE : un `@mousedown.stop` parent ne doit pas empêcher la fermeture au clic extérieur.
  document.addEventListener("mousedown", onDocMousedown, true)
  document.addEventListener("keydown", onDocKeydown)
  window.addEventListener("scroll", onViewportChange, true)
  window.addEventListener("resize", onViewportChange)
})

onBeforeUnmount(() => {
  if (typeof document === "undefined") return
  document.removeEventListener("mousedown", onDocMousedown, true)
  document.removeEventListener("keydown", onDocKeydown)
  window.removeEventListener("scroll", onViewportChange, true)
  window.removeEventListener("resize", onViewportChange)
})

const rootClasses = computed(() =>
  cn(
    "q-time",
    props.dark && "q-time--dark",
    props.dense && "q-time--dense",
    props.error && "q-time--error",
    isDisabled.value && "q-time--disabled",
    props.readonly && "q-time--readonly",
    open.value && "q-time--open",
  ),
)

const dialogLabel = computed(() => props.label || "Time")

// Forme explicite `clé: valeur` : l'analyse statique des docs détecte les méthodes
// exposées en lisant les clés de `defineExpose` (cf. `scripts/component-parse.ts`).
defineExpose({ show: show, hide: hide, toggle: toggle })
</script>

<template>
  <div ref="rootEl" :class="rootClasses" v-bind="$attrs">
    <label v-if="label || $slots.label" class="q-time__label" :for="inputId">
      <slot name="label">{{ label }}</slot>
    </label>

    <div
      class="q-time__control"
      :class="{ 'q-time__control--open': open }"
      role="group"
      aria-haspopup="dialog"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :aria-expanded="open ? 'true' : 'false'"
      @click="onControlClick"
    >
      <input
        :id="inputId"
        ref="inputEl"
        class="q-time__native"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        spellcheck="false"
        :value="draft"
        :placeholder="placeholder"
        :disabled="disable || undefined"
        :readonly="readonly || undefined"
        :aria-label="label || undefined"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.enter.prevent="onEnter"
        @keydown.up.prevent="onArrow(1, $event.shiftKey)"
        @keydown.down.prevent="onArrow(-1, $event.shiftKey)"
      />
      <Icon icon="lucide:clock" class="q-time__icon" aria-hidden="true" />
    </div>

    <div class="q-time__bottom">
      <div v-if="error" class="q-time__error">{{ errorMessage }}</div>
      <div v-else-if="hint" class="q-time__hint">{{ hint }}</div>
    </div>

    <Teleport to="body">
      <Transition name="q-popup">
        <div
          v-if="open"
          ref="panelRef"
          :class="panelClasses"
          :style="panelStyle"
          role="dialog"
          :aria-label="dialogLabel"
          @mousedown.prevent
        >
          <div class="q-time__columns">
            <div class="q-time__column" role="listbox" aria-label="Hour">
              <button
                v-for="h in hours"
                :key="`h-${h}`"
                type="button"
                role="option"
                class="q-time__item"
                :class="{ 'q-time__item--active': isHourSelected(h) }"
                :aria-selected="isHourSelected(h) ? 'true' : 'false'"
                @click="selectHour(h)"
              >
                {{ hourLabel(h) }}
              </button>
            </div>

            <div class="q-time__column" role="listbox" aria-label="Minute">
              <button
                v-for="m in minutes"
                :key="`m-${m}`"
                type="button"
                role="option"
                class="q-time__item"
                :class="{ 'q-time__item--active': isMinuteSelected(m) }"
                :aria-selected="isMinuteSelected(m) ? 'true' : 'false'"
                @click="selectMinute(m)"
              >
                {{ pad2(m) }}
              </button>
            </div>

            <div v-if="withSeconds" class="q-time__column" role="listbox" aria-label="Second">
              <button
                v-for="s in seconds"
                :key="`s-${s}`"
                type="button"
                role="option"
                class="q-time__item"
                :class="{ 'q-time__item--active': isSecondSelected(s) }"
                :aria-selected="isSecondSelected(s) ? 'true' : 'false'"
                @click="selectSecond(s)"
              >
                {{ pad2(s) }}
              </button>
            </div>
          </div>

          <div v-if="nowBtn || !format24h" class="q-time__footer">
            <div v-if="!format24h" class="q-time__meridiem" role="group" aria-label="AM/PM">
              <button
                type="button"
                class="q-time__meridiem-btn"
                :class="{ 'q-time__meridiem-btn--active': !isPm }"
                :aria-pressed="!isPm ? 'true' : 'false'"
                @click="setMeridiem(false)"
              >
                AM
              </button>
              <button
                type="button"
                class="q-time__meridiem-btn"
                :class="{ 'q-time__meridiem-btn--active': isPm }"
                :aria-pressed="isPm ? 'true' : 'false'"
                @click="setMeridiem(true)"
              >
                PM
              </button>
            </div>
            <button v-if="nowBtn" type="button" class="q-time__now" @click="setNow">Now</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.q-time {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-size: 14px;
}

/* — libellé — */
.q-time__label {
  display: block;
  margin-bottom: 2px;
  font-size: 12px;
  color: var(--muted-foreground, rgb(0 0 0 / 0.6));
}

/* — contrôle cliquable — */
.q-time__control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 12px;
  background-color: var(--card, #fff);
  border: 1px solid var(--border, rgb(0 0 0 / 0.22));
  border-radius: var(--radius, var(--q-radius, 4px));
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}
.q-time--dense .q-time__control {
  min-height: 32px;
}
.q-time__control:focus-within,
.q-time__control--open {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
}
.q-time--error .q-time__control {
  border-color: var(--negative);
}
.q-time--error .q-time__control:focus-within,
.q-time--error .q-time__control--open {
  box-shadow: 0 0 0 1px var(--negative);
}
.q-time--disabled {
  opacity: 0.5;
  pointer-events: none;
}
.q-time--disabled .q-time__control {
  cursor: default;
}

/* — champ de saisie — */
.q-time__native {
  flex: 1;
  min-width: 0;
  height: 38px;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: var(--foreground, inherit);
  font: inherit;
  line-height: 20px;
  font-variant-numeric: tabular-nums;
}
.q-time--dense .q-time__native {
  height: 30px;
}
.q-time__native::placeholder {
  color: var(--muted-foreground, rgb(0 0 0 / 0.45));
}

.q-time__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  color: var(--muted-foreground, rgb(0 0 0 / 0.45));
}

/* — aide / erreur — */
.q-time__bottom {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-height: 20px;
  padding: 4px 12px 0;
  font-size: 12px;
  line-height: 1.3;
}
.q-time__error {
  flex: 1;
  color: var(--negative);
}
.q-time__hint {
  flex: 1;
  color: var(--muted-foreground, rgb(0 0 0 / 0.55));
}

/* — panneau (téléporté dans <body>, `position: fixed`) — */
.q-time__panel {
  position: fixed;
  z-index: var(--q-z-popup, 3500);
  display: flex;
  flex-direction: column;
  min-width: 152px;
  overflow: hidden;
  background-color: var(--card, #fff);
  color: var(--foreground, #1d1d1d);
  border: 1px solid var(--border, rgb(0 0 0 / 0.12));
  border-radius: var(--radius, var(--q-radius, 8px));
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.18);
}

.q-time__columns {
  display: flex;
  flex: 1;
  align-items: stretch;
  min-height: 0;
  overflow: hidden;
}
.q-time__column {
  flex: 1;
  min-height: 0;
  max-height: 208px;
  padding: 4px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.q-time__column + .q-time__column {
  border-left: 1px solid var(--border, rgb(0 0 0 / 0.08));
}
.q-time__item {
  display: block;
  width: 100%;
  min-width: 44px;
  padding: 6px 10px;
  border: none;
  border-radius: calc(var(--radius, var(--q-radius, 8px)) - 4px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-variant-numeric: tabular-nums;
  text-align: center;
  cursor: pointer;
}
.q-time__item:hover {
  background-color: var(--muted, rgb(0 0 0 / 0.06));
}
.q-time__item--active {
  background-color: var(--primary);
  color: var(--primary-foreground, #fff);
  font-weight: 600;
}
.q-time__item--active:hover {
  background-color: var(--primary);
}

/* — pied de panneau : AM/PM et « Now » — */
.q-time__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-top: 1px solid var(--border, rgb(0 0 0 / 0.08));
}
.q-time__meridiem {
  display: inline-flex;
  flex: 1;
  padding: 2px;
  background-color: var(--muted, rgb(0 0 0 / 0.05));
  border-radius: calc(var(--radius, var(--q-radius, 8px)) - 4px);
}
.q-time__meridiem-btn {
  flex: 1;
  padding: 4px 8px;
  border: none;
  border-radius: calc(var(--radius, var(--q-radius, 8px)) - 6px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.q-time__meridiem-btn--active {
  background-color: var(--primary);
  color: var(--primary-foreground, #fff);
  font-weight: 600;
}
.q-time__now {
  padding: 6px 10px;
  border: none;
  border-radius: calc(var(--radius, var(--q-radius, 8px)) - 4px);
  background: transparent;
  color: var(--primary);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.q-time__now:hover {
  background-color: var(--muted, rgb(0 0 0 / 0.06));
}

/* — mode sombre : ancêtre `.dark` ou prop `dark` (classe `--dark`) — */
.dark .q-time__label,
.q-time--dark .q-time__label,
.dark .q-time__hint,
.q-time--dark .q-time__hint {
  color: var(--muted-foreground, rgb(255 255 255 / 0.65));
}
.dark .q-time__icon,
.q-time--dark .q-time__icon {
  color: var(--muted-foreground, rgb(255 255 255 / 0.55));
}
.dark .q-time__native::placeholder,
.q-time--dark .q-time__native::placeholder {
  color: rgb(255 255 255 / 0.4);
}
.dark .q-time__control,
.q-time--dark .q-time__control {
  background-color: var(--muted, #1c2128);
  border-color: var(--border);
  color: var(--foreground);
}
.dark .q-time__panel,
.q-time__panel--dark {
  background-color: var(--card);
  color: var(--foreground);
  border-color: var(--border);
}
.dark .q-time__item:hover,
.q-time__panel--dark .q-time__item:hover {
  background-color: rgb(255 255 255 / 0.08);
}
.dark .q-time__item--active:hover,
.q-time__panel--dark .q-time__item--active:hover {
  background-color: var(--primary);
}
.dark .q-time__column + .q-time__column,
.q-time__panel--dark .q-time__column + .q-time__column,
.dark .q-time__footer,
.q-time__panel--dark .q-time__footer {
  border-color: var(--border);
}
.dark .q-time__meridiem,
.q-time__panel--dark .q-time__meridiem {
  background-color: rgb(255 255 255 / 0.08);
}
</style>
