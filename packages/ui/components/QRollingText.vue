<script setup lang="ts">
// QRollingText — compteur à rouleaux (type machine à sous) :
// <q-rolling-text :start-num="0" :target-num="123" />.
// Chaque chiffre défile verticalement de start-num vers target-num (2 tours complets
// entre les deux), avec un effet cascade via stop-order. API inspirée de Vant
// RollingText : start-num / target-num / text-list / duration / direction /
// auto-start / stop-order / height + méthodes exposées start() / reset().
import { computed, ref, watch } from "vue"

type RollingTextDirection = "up" | "down"
type RollingTextStopOrder = "ltr" | "rtl"

interface Props {
  /** Valeur de départ affichée avant l'animation (défaut 0) */
  startNum?: number
  /** Valeur cible — les rouleaux s'arrêtent sur celle-ci */
  targetNum?: number
  /** Texte personnalisé : tableau de chaînes de MÊME longueur — le rouleau défile du premier au dernier élément */
  textList?: string[]
  /** Durée de l'animation, en secondes (défaut 2) */
  duration?: number
  /** Sens de défilement : "up" compte en montant, "down" en descendant (défaut down) */
  direction?: RollingTextDirection
  /** Démarre l'animation automatiquement au montage (défaut true) */
  autoStart?: boolean
  /** Ordre d'arrêt des rouleaux : "ltr" (rang de gauche d'abord) | "rtl" (unités d'abord) */
  stopOrder?: RollingTextStopOrder
  /** Hauteur d'un chiffre, en px (défaut 40) */
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  startNum: 0,
  targetNum: 0,
  textList: () => [],
  duration: 2,
  direction: "down",
  autoStart: true,
  stopOrder: "ltr",
  height: 40,
})

/** Nombre de tours complets entre le chiffre de départ et la cible */
const CIRCLE_NUM = 2

const isCustom = computed(() => props.textList.length > 0)

/** Nombre de colonnes (chiffres) affichées */
const itemLength = computed(() => {
  if (isCustom.value) return props.textList[0]?.length ?? 0
  return String(Math.max(props.startNum, props.targetNum)).length
})

const targetNumArr = computed(() => {
  if (isCustom.value) return new Array(itemLength.value).fill("")
  return String(props.targetNum).padStart(itemLength.value, "0").split("")
})

const startNumArr = computed(() =>
  String(props.startNum).padStart(itemLength.value, "0").split(""),
)

/** Colonne i : la liste des figures qui défilent sous la fenêtre */
const columns = computed<(string | number)[][]>(() => {
  const cols: (string | number)[][] = []
  for (let i = 0; i < itemLength.value; i++) {
    if (isCustom.value) {
      const arr: (string | number)[] = []
      for (let k = 0; k < props.textList.length; k++) {
        arr.push(props.textList[k]?.[i] ?? "")
      }
      cols.push(arr)
    } else {
      const start = Number(startNumArr.value[i])
      const target = Number(targetNumArr.value[i])
      const arr: (string | number)[] = []
      for (let n = start; n <= 9; n++) arr.push(n)
      for (let c = 0; c < CIRCLE_NUM; c++) for (let n = 0; n <= 9; n++) arr.push(n)
      for (let n = 0; n <= target; n++) arr.push(n)
      cols.push(arr)
    }
  }
  // Sens "down" : figures inversées — le rouleau démarre pré-translaté et descend vers la cible
  return props.direction === "down" ? cols.map((c) => c.slice().reverse()) : cols
})

const rolling = ref(props.autoStart)

/** Démarre (ou relance) l'animation */
const start = () => {
  rolling.value = true
}

/** Réinitialise l'animation, puis la relance si auto-start */
const reset = () => {
  rolling.value = false
  if (props.autoStart) requestAnimationFrame(() => start())
}

defineExpose({ start, reset })

watch(
  () => props.autoStart,
  (v) => {
    if (v) start()
  },
)

/** Délai de démarrage par colonne (effet cascade) */
const getDelay = (i: number, len: number) =>
  props.stopOrder === "ltr" ? 0.2 * i : 0.2 * (len - 1 - i)

const digitStyle = computed(() => ({ lineHeight: `${props.height}px` }))

const itemStyle = (i: number) => {
  const col = columns.value[i] ?? []
  return {
    height: `${props.height}px`,
    "--q-translate": `-${props.height * Math.max(0, col.length - 1)}px`,
    "--q-duration": `${props.duration}s`,
    "--q-delay": `${getDelay(i, itemLength.value)}s`,
  } as Record<string, string>
}
</script>

<template>
  <div class="q-rolling-text" :class="`q-rolling-text--${direction}`">
    <div
      v-for="(col, i) in columns"
      :key="i"
      class="q-rolling-text__item"
      :style="itemStyle(i)"
    >
      <div
        class="q-rolling-text__box"
        :class="{ 'q-rolling-text__box--animate': rolling }"
      >
        <div
          v-for="(digit, j) in col"
          :key="j"
          class="q-rolling-text__digit"
          :style="digitStyle"
        >
          <slot
            name="digit"
            :value="digit"
            :index="i"
            :total="columns.length"
            :active="j === col.length - 1"
          >
            {{ digit }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.q-rolling-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--q-rolling-text-color, var(--foreground));
  font-size: var(--q-rolling-text-font-size, 18px);
}

.q-rolling-text__item {
  overflow: hidden;
  width: var(--q-rolling-text-item-width, 1.2em);
  border-radius: var(--q-rolling-text-item-border-radius, 6px);
  background: var(--q-rolling-text-background, transparent);
}
.q-rolling-text__item + .q-rolling-text__item {
  margin-left: var(--q-rolling-text-gap, 2px);
}

.q-rolling-text__box {
  overflow: hidden;
}
.q-rolling-text__box--animate {
  animation: q-rolling-up var(--q-duration, 2s) ease-in-out var(--q-delay, 0s) both;
}

/* Sens "down" : rouleau pré-positionné en bas, il remonte vers la cible */
.q-rolling-text--down .q-rolling-text__box {
  transform: translateY(var(--q-translate, 0px));
}
.q-rolling-text--down .q-rolling-text__box--animate {
  animation-name: q-rolling-down;
}

.q-rolling-text__digit {
  text-align: center;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

@keyframes q-rolling-up {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(var(--q-translate, 0px));
  }
}
@keyframes q-rolling-down {
  from {
    transform: translateY(var(--q-translate, 0px));
  }
  to {
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .q-rolling-text__box--animate {
    animation: none;
    transform: translateY(var(--q-translate, 0px));
  }
  .q-rolling-text--down .q-rolling-text__box--animate {
    transform: translateY(0);
  }
}
</style>
