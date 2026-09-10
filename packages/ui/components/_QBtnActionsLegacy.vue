<script lang="ts">
// QBtnActions — LEGACY (motif cassé) : v-for + DEUX frères v-if indépendants.
// Copie temporaire pour harnais de test — ne pas utiliser.

export interface BtnAction {
  label?: string
  value?: any
  icon?: string
  iconRight?: string
  color?: string
  description?: string
  separator?: boolean
  disable?: boolean
  onClick?: (action: BtnAction) => void
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { Icon } from "@iconify/vue"
import { colorValue } from "../lib/colors"
import { icons } from "../lib/icons"
import { radiusStyle, useRadius } from "../lib/useComponentProps"
import type { RadiusProp } from "../lib/useComponentProps"
import QBtn from "./QBtn.vue"

interface Props {
  actions?: BtnAction[]
  label?: string
  icon?: string
  noCaret?: boolean
  dropdownIcon?: string
  align?: "left" | "right"
  menuWidth?: string
  color?: string
  textColor?: string
  size?: string
  radius?: RadiusProp
  flat?: boolean
  outline?: boolean
  unelevated?: boolean
  dense?: boolean
  round?: boolean
  square?: boolean
  noCaps?: boolean
  stretch?: boolean
  loading?: boolean
  disable?: boolean
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  noCaret: false,
  dropdownIcon: "lucide:chevron-down",
  align: "right",
  menuWidth: "180px",
  size: "md",
  color: "primary",
  flat: false,
  outline: false,
  unelevated: false,
  dense: false,
  round: false,
  square: false,
  noCaps: false,
  stretch: false,
  loading: false,
  disable: false,
  dark: false,
})

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)
const panelPos = ref({ top: 0, left: 0, transform: "" })

const canOpen = computed(() => !props.disable && !props.loading && props.actions.length > 0)
const triggerIcon = computed(() => props.icon ?? (props.label ? undefined : icons.ellipsis))
const showCaret = computed(() => !props.noCaret && !!props.label)

const triggerClasses = computed(() => [
  "q-btn-actions__trigger",
  open.value && "q-btn-actions__trigger--open",
])

const effectiveRadius = useRadius("QBtnActions", () => props.radius)
const roundedStyle = computed(() => radiusStyle(effectiveRadius.value))

const panelStyle = computed<Record<string, string>>(() => ({
  top: `${panelPos.value.top}px`,
  left: `${panelPos.value.left}px`,
  transform: panelPos.value.transform,
  minWidth: props.menuWidth,
  ...(roundedStyle.value ?? {}),
}))

const placePanel = () => {
  const el = rootEl.value
  if (!el || typeof document === "undefined") return
  const rect = el.getBoundingClientRect()
  if (props.align === "left") {
    panelPos.value = { top: rect.bottom + 4, left: rect.left, transform: "none" }
  }
  else {
    panelPos.value = { top: rect.bottom + 4, left: rect.right, transform: "translateX(-100%)" }
  }
}

const enableTracking = () => {
  window.addEventListener("resize", placePanel)
  window.addEventListener("scroll", placePanel, true)
}
const disableTracking = () => {
  window.removeEventListener("resize", placePanel)
  window.removeEventListener("scroll", placePanel, true)
}

const toggle = () => (open.value ? close() : openMenu())

const openMenu = async () => {
  if (!canOpen.value) return
  placePanel()
  open.value = true
  enableTracking()
  await nextTick()
  ;(panelEl.value?.querySelector(".q-btn-actions__item:not(:disabled)") as HTMLElement | null)?.focus()
}

const close = () => {
  if (!open.value) return
  open.value = false
  disableTracking()
}

const onDocMousedown = (e: MouseEvent) => {
  if (!open.value) return
  const target = e.target as Node
  if (rootEl.value?.contains(target) || panelEl.value?.contains(target)) return
  close()
}

const onKeydown = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === "Escape") {
    e.preventDefault()
    close()
    ;(rootEl.value?.querySelector(".q-btn-actions__trigger") as HTMLElement | null)?.focus()
    return
  }
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return
  const items = Array.from(
    panelEl.value?.querySelectorAll(".q-btn-actions__item:not(:disabled)") ?? [],
  ) as HTMLElement[]
  if (!items.length) return
  const current = items.indexOf(document.activeElement as HTMLElement)
  let next = current
  if (e.key === "ArrowDown") next = (current + 1) % items.length
  else if (e.key === "ArrowUp") next = (current - 1 + items.length) % items.length
  else if (e.key === "Home") next = 0
  else if (e.key === "End") next = items.length - 1
  e.preventDefault()
  items[next]?.focus()
}

const onSelect = (action: BtnAction) => {
  if (action.disable) return
  action.onClick?.(action)
  close()
}

const isSeparatorOnly = (action: BtnAction): boolean =>
  !!action.separator && !action.label && !action.icon && !action.iconRight && !action.description

const itemStyle = (action: BtnAction) =>
  action.color ? { color: colorValue(action.color) } : undefined

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("mousedown", onDocMousedown)
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.removeEventListener("mousedown", onDocMousedown)
  disableTracking()
})
</script>

<template>
  <div ref="rootEl" class="q-btn-actions" :class="dark && 'dark'" @keydown="onKeydown">
    <QBtn
      class="q-btn-actions__trigger"
      :class="triggerClasses"
      :label="label"
      :icon="triggerIcon"
      :color="color"
      :text-color="textColor"
      :size="size"
      :radius="radius"
      :flat="flat"
      :outline="outline"
      :unelevated="unelevated"
      :dense="dense"
      :round="round"
      :square="square"
      :no-caps="noCaps"
      :stretch="stretch"
      :loading="loading"
      :disable="disable"
      @click="toggle"
    >
      <Icon
        v-if="showCaret"
        :icon="dropdownIcon"
        class="q-btn-actions__caret"
        :class="{ 'q-btn-actions__caret--open': open }"
        aria-hidden="true"
      />
    </QBtn>

    <Teleport to="body">
      <Transition name="q-popup">
        <div
          v-if="open"
          ref="panelEl"
          class="q-btn-actions__panel"
          role="menu"
          :aria-label="label ?? 'Actions'"
          :style="panelStyle"
          @keydown="onKeydown"
        >
          <template v-for="(action, i) in actions" :key="i">
            <div v-if="action.separator" class="q-btn-actions__separator" role="separator" />
            <button
              v-if="!isSeparatorOnly(action)"
              type="button"
              role="menuitem"
              class="q-btn-actions__item"
              :class="{ 'q-btn-actions__item--disabled': action.disable }"
              :disabled="action.disable"
              :style="itemStyle(action)"
              @click="onSelect(action)"
            >
              <Icon :icon="action.icon" v-if="action.icon" class="q-btn-actions__item-icon" aria-hidden="true" />
              <span class="q-btn-actions__item-text">
                <span class="q-btn-actions__item-label">{{ action.label }}</span>
                <span v-if="action.description" class="q-btn-actions__item-desc">{{ action.description }}</span>
              </span>
              <Icon :icon="action.iconRight" v-if="action.iconRight" class="q-btn-actions__item-icon" aria-hidden="true" />
            </button>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
