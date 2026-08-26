<script setup lang="ts">
// QTab — API Quasar (source officielle) :
// <q-tab name="a" icon="…" label="Accueil" alert="negative" alert-icon="…" no-caps />
// alert : true = point de notification ; string = couleur du point (token ou hex).
// name : auto-généré (t_1, t_2…) si absent, comme chez Quasar.
import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue"
import type { Component } from "vue"
import { cn } from "../lib/utils"
import { qTabsKey } from "./QTabs.vue"

const TOKEN_COLORS = ["primary", "secondary", "accent", "dark", "positive", "negative", "info", "warning"] as const

/** Token → var(--token), sinon valeur directe (hex, rgb(), nom CSS) */
const colorValue = (c: string) =>
  (TOKEN_COLORS as readonly string[]).includes(c) ? `var(--${c})` : c

let tabSeq = 0

interface Props {
  /** Identifiant du tab (comparé au v-model du QTabs) */
  name?: string | number
  /** Icône Lucide */
  icon?: Component
  /** Texte ou nombre */
  label?: string | number
  /** true = point de notification ; string = couleur du point */
  alert?: boolean | string
  /** Icône Lucide remplaçant le point de notification */
  alertIcon?: Component
  /** Pas de mise en majuscules */
  noCaps?: boolean
  tabindex?: string | number
  /** Désactive le tab */
  disable?: boolean
  /** Classe du contenu interne */
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  alert: false,
  noCaps: false,
  disable: false,
})

const emit = defineEmits<{ click: [event: MouseEvent]; keydown: [event: KeyboardEvent] }>()

const tabs = inject(qTabsKey, null)

const resolvedName = props.name ?? `t_${tabSeq++}`

const el = ref<HTMLElement | null>(null)

onMounted(() => tabs?.register({ name: resolvedName, el }))
onBeforeUnmount(() => tabs?.unregister(resolvedName))

const isActive = computed(() => tabs?.activeName.value === resolvedName)

// Roving tabindex (WAI-ARIA) : seul le tab actif est dans le tab order
const tabIndex = computed(() =>
  props.disable ? -1 : (props.tabindex ?? (isActive.value ? 0 : -1)),
)

const alertColor = computed(() => (typeof props.alert === "string" ? props.alert : undefined))
const alertStyle = computed<Record<string, string>>((): Record<string, string> =>
  alertColor.value ? { backgroundColor: colorValue(alertColor.value) } : {},
)
const alertIconStyle = computed<Record<string, string>>((): Record<string, string> =>
  alertColor.value ? { color: colorValue(alertColor.value) } : {},
)

const tabClasses = computed(() =>
  cn(
    "q-tab",
    isActive.value && "q-tab--active",
    isActive.value && tabs?.activeClass.value,
    (props.noCaps || tabs?.noCaps.value) && "q-tab--no-caps",
    props.disable && "q-tab--disabled",
    tabs?.inlineLabel.value && "q-tab--inline-label",
  ),
)

const activate = () => {
  if (!props.disable) tabs?.setActive(resolvedName)
}

const onClick = (e: MouseEvent) => {
  activate()
  emit("click", e)
}

// Clavier (WAI-ARIA) : Entrée/Espace active, flèches/Home/End déplacent le focus
const onKeydown = (e: KeyboardEvent) => {
  emit("keydown", e)
  if (e.defaultPrevented || props.disable) return

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    activate()
    return
  }

  const root = el.value?.parentElement
  if (!root) return
  const list = Array.from(root.querySelectorAll(".q-tab")) as HTMLElement[]
  const index = list.indexOf(el.value as HTMLElement)
  let target: HTMLElement | undefined
  if (e.key === "ArrowRight") target = list[(index + 1) % list.length]
  else if (e.key === "ArrowLeft") target = list[(index - 1 + list.length) % list.length]
  else if (e.key === "Home") target = list[0]
  else if (e.key === "End") target = list[list.length - 1]
  if (target) {
    e.preventDefault()
    target.focus()
  }
}
</script>

<template>
  <div
    ref="el"
    role="tab"
    :aria-selected="isActive ? 'true' : 'false'"
    :aria-disabled="disable || undefined"
    :tabindex="tabIndex"
    class="q-tab"
    :class="tabClasses"
    @click="onClick"
    @keydown="onKeydown"
  >
    <div class="q-tab__content" :class="contentClass">
      <component :is="icon" v-if="icon" class="q-tab__icon" aria-hidden="true" />
      <span v-if="label !== undefined" class="q-tab__label">{{ label }}</span>
      <slot v-else />
      <span
        v-if="alert && !alertIcon"
        class="q-tab__alert"
        :style="alertStyle"
        aria-label="Notification"
      />
      <component
        :is="alertIcon"
        v-if="alertIcon"
        class="q-tab__alert-icon"
        :style="alertIconStyle"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
