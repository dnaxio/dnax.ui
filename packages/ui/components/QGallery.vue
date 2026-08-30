<script setup lang="ts">
// QGallery — galerie d'images avec sélection : <q-gallery v-model="sel" :images="imgs" multiple labels />
// images : URLs (string) ou objets { src, label, description }.
// v-model : item/URL (simple) ou tableau (multiple) ; la valeur renvoyée est l'item brut
// passé dans `images` (string ou objet). Props : labels (nom + description sous l'image),
// selectable, cols, max-selected, rounded, dense.
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { icons } from "../lib/icons"
import { cn } from "../lib/utils"

/** Une image normalisée de la galerie : URL + nom/description optionnels */
export interface GalleryImage {
  /** URL de l'image */
  src: string
  /** Nom affiché sous l'image (si labels) */
  label?: string
  /** Description affichée sous le nom (si labels) */
  description?: string
}

type GalleryValue = string | GalleryImage

interface Props {
  /** Sélection : URL/item (simple) ou tableau (multiple) — v-model */
  modelValue?: GalleryValue | GalleryValue[] | null
  /** Liste des images : URLs ou objets JSON (les champs sont donnés par src-key/label-key/description-key) */
  images?: (string | Record<string, unknown>)[]
  /** Sélection multiple (v-model = tableau) */
  multiple?: boolean
  /** Affiche le nom et la description sous les images */
  labels?: boolean
  /** Champ des objets contenant l'URL de l'image (défaut "src") */
  srcKey?: string
  /** Champ des objets contenant le nom (défaut "label") */
  labelKey?: string
  /** Champ des objets contenant la description (défaut "description") */
  descriptionKey?: string
  /** Désactive la sélection (affichage seul) */
  selectable?: boolean
  /** Nombre de colonnes (défaut 4) */
  cols?: number
  /** Nombre max de sélections en mode multiple (0 = illimité) */
  maxSelected?: number
  /** Coins arrondis (défaut true) */
  rounded?: boolean
  /** Espacement réduit entre les images */
  dense?: boolean
  /** Animation au survol : zoom de l'image + ombre portée */
  hover?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  images: () => [],
  multiple: false,
  labels: false,
  srcKey: "src",
  labelKey: "label",
  descriptionKey: "description",
  selectable: true,
  cols: 4,
  maxSelected: 0,
  rounded: true,
  dense: false,
  hover: false,
  class: "",
})

const emit = defineEmits<{
  "update:modelValue": [value: GalleryValue | GalleryValue[] | null]
  select: [payload: { image: GalleryValue; index: number; selected: boolean }]
}>()

interface NormalizedImage extends GalleryImage {
  /** L'objet brut original (renvoyé dans le v-model et @select) */
  raw: GalleryValue
}

/** Normalise chaque entrée : extrait src/label/description via les clés, garde le brut */
const items = computed<NormalizedImage[]>(() =>
  props.images.map((img): NormalizedImage =>
    typeof img === "string"
      ? { src: img, raw: img }
      : {
          src: String(img[props.srcKey] ?? ""),
          label: (img[props.labelKey] as string | undefined) ?? undefined,
          description: (img[props.descriptionKey] as string | undefined) ?? undefined,
          raw: img as unknown as GalleryValue,
        },
  ),
)

/** Comparaison entre une valeur du v-model et une image normalisée */
const sameValue = (a: unknown, b: NormalizedImage): boolean =>
  typeof a === "string" ? a === b.src : a === b.raw

const selection = computed<GalleryValue[]>(() =>
  props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : []) : [],
)

const isSelected = (item: NormalizedImage): boolean =>
  props.multiple
    ? selection.value.some((v) => sameValue(v, item))
    : sameValue(props.modelValue, item)

const isMaxed = computed(
  () =>
    props.multiple &&
    props.maxSelected > 0 &&
    selection.value.length >= props.maxSelected,
)

const toggle = (item: NormalizedImage, index: number) => {
  if (!props.selectable) return
  const wasSelected = isSelected(item)
  let next: GalleryValue | GalleryValue[] | null

  if (props.multiple) {
    const arr = [...selection.value]
    const i = arr.findIndex((v) => sameValue(v, item))
    if (i >= 0) arr.splice(i, 1)
    else if (!isMaxed.value) arr.push(item.raw)
    next = arr
  } else {
    next = wasSelected ? null : item.raw
  }

  emit("update:modelValue", next)
  emit("select", { image: item.raw, index, selected: !wasSelected })
}
</script>

<template>
  <div
    class="q-gallery"
    :class="cn(
      !selectable && 'q-gallery--viewer',
      dense && 'q-gallery--dense',
      props.class,
    )"
    :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }"
  >
    <div
      v-for="(item, i) in items"
      :key="`${item.src}-${i}`"
      class="q-gallery__item"
      :class="{
        'q-gallery__item--rounded': rounded,
        'q-gallery__item--selected': selectable && isSelected(item),
        'q-gallery__item--disabled': !isSelected(item) && isMaxed,
        'q-gallery__item--hover': hover,
      }"
      role="option"
      :aria-selected="selectable && isSelected(item) ? 'true' : 'false'"
      @click="toggle(item, i)"
    >
      <img
        class="q-gallery__img"
        :src="item.src"
        :alt="item.label ?? `Image ${i + 1}`"
        loading="lazy"
      />
      <span v-if="selectable && isSelected(item)" class="q-gallery__check" aria-hidden="true">
        <Icon :icon="icons.check" />
      </span>
      <div v-if="labels" class="q-gallery__caption">
        <div v-if="item.label" class="q-gallery__label">{{ item.label }}</div>
        <div v-if="item.description" class="q-gallery__desc">{{ item.description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.q-gallery {
  display: grid;
  gap: 10px;
}
.q-gallery--dense {
  gap: 4px;
}

.q-gallery__item {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
  border: 2px solid transparent;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;
}
.q-gallery__item--rounded {
  border-radius: 12px;
}
.q-gallery__item--selected {
  border-color: var(--primary);
}
.q-gallery__item--disabled {
  cursor: default;
  opacity: 0.55;
}
.q-gallery--viewer .q-gallery__item {
  cursor: default;
}

.q-gallery__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* animation au survol : zoom doux + ombre (prop hover) */
.q-gallery__item--hover .q-gallery__img {
  transition: transform 0.3s ease;
}
.q-gallery__item--hover:hover {
  box-shadow: 0 10px 24px rgb(0 0 0 / 0.18);
}
.q-gallery__item--hover:hover .q-gallery__img {
  transform: scale(1.06);
}
@media (prefers-reduced-motion: reduce) {
  .q-gallery__item--hover .q-gallery__img {
    transition: none;
  }
}

/* coche de sélection (coin haut droit) */
.q-gallery__check {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--primary-foreground);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.3);
}
.q-gallery__check svg {
  width: 13px;
  height: 13px;
}

/* légende (nom + description) en bas de l'image */
.q-gallery__caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 10px 8px;
  background: linear-gradient(to top, rgb(0 0 0 / 0.72), transparent);
  color: #fff;
}
.q-gallery__label {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.q-gallery__desc {
  font-size: 11.5px;
  line-height: 1.35;
  opacity: 0.85;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
