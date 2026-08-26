<script lang="ts">
// QActionSheet — action sheet type iOS : <q-action-sheet v-model="open" :options="opts" @select="onSelect" />
// Options passées en props, événement select à la sélection (ferme puis émet).
import type { Component } from "vue"

export interface ActionSheetOption {
  /** Libellé affiché */
  label: string
  /** Valeur émise par @select ; si absente, l'option elle-même est émise */
  value?: any
  /** Icône Lucide à gauche */
  icon?: Component
  /** Icône Lucide à droite */
  iconRight?: Component
  /** Couleur du texte (token ou hex) */
  color?: string
  /** Sous-texte descriptif */
  description?: string
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue"
import { colorValue } from "../lib/colors"

interface Props {
  /** Ouvert (v-model) */
  modelValue?: boolean
  /** Options de l'action sheet */
  options?: ActionSheetOption[]
  /** Titre discret au-dessus des options */
  title?: string
  /** Bouton Annuler : false pour masquer, string pour le libellé */
  cancel?: boolean | string
  /** Ne se ferme ni au backdrop ni à Échap */
  persistent?: boolean
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  options: () => [],
  cancel: true,
  persistent: false,
  dark: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  /** Valeur de l'option sélectionnée (ou l'option si pas de value) */
  select: [value: any]
  /** Fermeture sans sélection (backdrop, Échap, Annuler) */
  cancel: []
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
})

const cancelLabel = computed(() => (typeof props.cancel === "string" ? props.cancel : "Annuler"))

// Échap + verrouillage du scroll du body
const onDocKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && open.value && !props.persistent) dismiss()
}

watch(open, (v) => {
  if (typeof document !== "undefined") document.body.style.overflow = v ? "hidden" : ""
})

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("keydown", onDocKeydown)
})
onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", onDocKeydown)
    document.body.style.overflow = ""
  }
})

const onSelect = (opt: ActionSheetOption) => {
  open.value = false
  emit("select", opt.value !== undefined ? opt.value : opt)
}

const dismiss = () => {
  open.value = false
  emit("cancel")
}

const onOverlayClick = () => {
  if (!props.persistent) dismiss()
}

const getKey = (opt: ActionSheetOption, i: number) => String(opt.value ?? `opt-${i}`)

const optionStyle = (opt: ActionSheetOption) =>
  opt.color ? { color: colorValue(opt.color) } : undefined

const panelClasses = computed(() => [
  "q-action-sheet__panel",
  props.dark && "q-action-sheet__panel--dark",
])
</script>

<template>
  <Teleport to="body">
    <Transition name="q-bs">
      <div
        v-if="open"
        class="q-action-sheet__overlay"
        @click="onOverlayClick"
      >
        <div
          class="q-action-sheet__panel"
          :class="panelClasses"
          role="dialog"
          aria-modal="true"
          @click.stop
        >
          <h2 v-if="title" class="q-action-sheet__title">{{ title }}</h2>

          <div class="q-action-sheet__options" role="listbox">
            <button
              v-for="(opt, i) in options"
              :key="getKey(opt, i)"
              type="button"
              role="option"
              class="q-action-sheet__option"
              :style="optionStyle(opt)"
              @click="onSelect(opt)"
            >
              <component :is="opt.icon" v-if="opt.icon" class="q-action-sheet__option-icon" aria-hidden="true" />
              <span class="q-action-sheet__option-text">
                <span class="q-action-sheet__option-label">{{ opt.label }}</span>
                <span v-if="opt.description" class="q-action-sheet__option-description">{{ opt.description }}</span>
              </span>
              <component :is="opt.iconRight" v-if="opt.iconRight" class="q-action-sheet__option-icon" aria-hidden="true" />
            </button>
          </div>

          <button
            v-if="cancel !== false"
            type="button"
            class="q-action-sheet__cancel"
            @click="dismiss"
          >
            {{ cancelLabel }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
