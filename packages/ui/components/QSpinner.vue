<script setup lang="ts">
// QSpinner — indicateur de chargement : <q-spinner size="30px" color="primary" :thickness="4" type="tail" />
// Variantes SVG (type) : tail (défaut), oval, bars, dots, grid, rings, puff, audio.
import { computed } from "vue"
import { colorValue } from "../lib/colors"

type SpinnerType =
  | "tail"
  | "oval"
  | "bars"
  | "dots"
  | "grid"
  | "rings"
  | "puff"
  | "audio"
  | "ios"
  | "radio"
  | "gear"
  | "gears"
  | "cube"

interface Props {
  /** Variante : tail (défaut) | oval | bars | dots | grid | rings | puff | audio | ios | radio | gear | gears | cube */
  type?: SpinnerType
  /** Taille (px ou chaîne CSS) — défaut 32px */
  size?: string | number
  /** Couleur (token ou hex) — défaut primary */
  color?: string
  /** Épaisseur du trait (SVG stroke-width) — défaut 4 */
  thickness?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: "tail",
  size: 32,
  color: "primary",
  thickness: 4,
})

const rootStyle = computed<Record<string, string>>(() => ({
  width: typeof props.size === "number" ? props.size + "px" : props.size,
  height: typeof props.size === "number" ? props.size + "px" : props.size,
  color: colorValue(props.color),
}))
</script>

<template>
  <span class="q-spinner" :class="`q-spinner--${type}`" :style="rootStyle" role="status" aria-label="Loading">
    <!-- Tail : piste + arc qui tourne -->
    <svg v-if="type === 'tail'" viewBox="0 0 44 44" class="q-spinner__svg">
      <circle cx="22" cy="22" r="17" fill="none" stroke="currentColor" :stroke-width="thickness" opacity="0.25" />
      <path
        d="M22 5 a17 17 0 0 1 17 17"
        fill="none"
        stroke="currentColor"
        :stroke-width="thickness"
        stroke-linecap="round"
        class="q-spinner__arc"
      />
    </svg>

    <!-- Oval : cercle hachuré qui tourne -->
    <svg v-else-if="type === 'oval'" viewBox="0 0 44 44" class="q-spinner__svg">
      <circle
        cx="22"
        cy="22"
        r="16"
        fill="none"
        stroke="currentColor"
        :stroke-width="thickness"
        stroke-linecap="round"
        stroke-dasharray="55 120"
        class="q-spinner__oval"
      />
    </svg>

    <!-- Bars : 5 barres qui ondulent -->
    <svg v-else-if="type === 'bars'" viewBox="0 0 44 44" class="q-spinner__svg q-spinner__svg--wide">
      <rect v-for="(y, i) in [18, 12, 6, 12, 18]" :key="i" :x="2 + i * 9" :y="y" width="5" :height="44 - y * 2" rx="2.5" fill="currentColor" class="q-spinner__bar" :class="`q-spinner__bar--${i + 1}`" />
    </svg>

    <!-- Dots : 3 points qui rebondissent -->
    <svg v-else-if="type === 'dots'" viewBox="0 0 80 24" class="q-spinner__svg q-spinner__svg--wide">
      <circle v-for="i in 3" :key="i" :cx="10 + (i - 1) * 30" cy="12" r="6" fill="currentColor" class="q-spinner__dot" :class="`q-spinner__dot--${i}`" />
    </svg>

    <!-- Grid : 3×3 points pulsants -->
    <svg v-else-if="type === 'grid'" viewBox="0 0 44 44" class="q-spinner__svg">
      <circle
        v-for="i in 9"
        :key="i"
        :cx="8 + ((i - 1) % 3) * 14"
        :cy="8 + Math.floor((i - 1) / 3) * 14"
        r="4.5"
        fill="currentColor"
        class="q-spinner__cell"
        :class="`q-spinner__cell--${i}`"
      />
    </svg>

    <!-- Rings : deux anneaux contrarotatifs -->
    <svg v-else-if="type === 'rings'" viewBox="0 0 44 44" class="q-spinner__svg">
      <circle cx="22" cy="22" r="17" fill="none" stroke="currentColor" :stroke-width="thickness" opacity="0.35" class="q-spinner__ring" />
      <circle cx="22" cy="22" r="10" fill="none" stroke="currentColor" :stroke-width="thickness" stroke-linecap="round" class="q-spinner__ring q-spinner__ring--2" />
    </svg>

    <!-- Puff : point qui pulse -->
    <svg v-else-if="type === 'puff'" viewBox="0 0 44 44" class="q-spinner__svg">
      <circle cx="22" cy="22" r="14" fill="currentColor" class="q-spinner__puff" />
    </svg>

    <!-- Audio : égaliseur -->
    <svg v-else-if="type === 'audio'" viewBox="0 0 28 44" class="q-spinner__svg q-spinner__svg--wide">
      <rect v-for="(y, i) in [14, 6, 10]" :key="i" :x="2 + i * 9" :y="y" width="5" :height="44 - y * 2" rx="2.5" fill="currentColor" class="q-spinner__eq" :class="`q-spinner__eq--${i + 1}`" />
    </svg>

    <!-- Ios : 12 segments qui s'estompent en séquence -->
    <svg v-else-if="type === 'ios'" viewBox="0 0 44 44" class="q-spinner__svg">
      <g v-for="i in 12" :key="i" :transform="`rotate(${(i - 1) * 30} 22 22)`">
        <line x1="22" y1="7" x2="22" y2="11" stroke="currentColor" :stroke-width="2.5" stroke-linecap="round" class="q-spinner__seg" :class="`q-spinner__seg--${i}`" />
      </g>
    </svg>

    <!-- Radio : point + ondes qui se propagent -->
    <svg v-else-if="type === 'radio'" viewBox="0 0 44 44" class="q-spinner__svg">
      <circle cx="22" cy="22" r="4" fill="currentColor" class="q-spinner__radio-dot" />
      <circle cx="22" cy="22" r="4" fill="none" stroke="currentColor" :stroke-width="2.5" class="q-spinner__radio-ring" />
      <circle cx="22" cy="22" r="4" fill="none" stroke="currentColor" :stroke-width="2.5" class="q-spinner__radio-ring q-spinner__radio-ring--2" />
    </svg>

    <!-- Gear : un seul engrenage -->
    <svg v-else-if="type === 'gear'" viewBox="0 0 44 44" class="q-spinner__svg">
      <g transform="translate(22 22)">
        <g class="q-spinner__cog">
          <circle r="9.5" fill="none" stroke="currentColor" :stroke-width="9" />
          <g v-for="i in 8" :key="i" :transform="`rotate(${(i - 1) * 45})`">
            <rect x="-1.5" y="-15" width="3" height="8" rx="1.2" fill="currentColor" />
          </g>
        </g>
      </g>
    </svg>

    <!-- Gears : deux engrenages contrarotatifs -->
    <svg v-else-if="type === 'gears'" viewBox="0 0 44 44" class="q-spinner__svg">
      <g transform="translate(15 22)">
        <g class="q-spinner__cog">
          <circle r="9.5" fill="none" stroke="currentColor" :stroke-width="9" />
          <g v-for="i in 8" :key="i" :transform="`rotate(${(i - 1) * 45})`">
            <rect x="-1.5" y="-15" width="3" height="8" rx="1.2" fill="currentColor" />
          </g>
        </g>
      </g>
      <g transform="translate(31 15) scale(0.55)">
        <g class="q-spinner__cog q-spinner__cog--2">
          <circle r="9.5" fill="none" stroke="currentColor" :stroke-width="9" />
          <g v-for="i in 8" :key="i" :transform="`rotate(${(i - 1) * 45})`">
            <rect x="-1.5" y="-15" width="3" height="8" rx="1.2" fill="currentColor" />
          </g>
        </g>
      </g>
    </svg>

    <!-- Cube : cube isométrique qui tourne -->
    <svg v-else viewBox="0 0 44 44" class="q-spinner__svg">
      <g class="q-spinner__cube">
        <path d="M22 4 L40 14 L22 24 L4 14 Z" fill="currentColor" opacity="0.9" />
        <path d="M4 14 L22 24 L22 42 L4 32 Z" fill="currentColor" opacity="0.55" />
        <path d="M40 14 L22 24 L22 42 L40 32 Z" fill="currentColor" opacity="0.3" />
      </g>
    </svg>
  </span>
</template>
