<script setup lang="ts">
// QText — texte avec troncature multi-lignes + transitions :
// <q-text text="…" :lines="2" transition="fade" :transition-duration="400" />.
// lines > 0 → line-clamp (… à la fin), title = texte complet au survol.
// transition (fade, fade-up, zoom, slide-down…) : l'ancien texte sort et le
// nouveau entre quand la prop `text` change (mode out-in).
import { computed } from "vue"
import { cn } from "../lib/utils"

/** Effets prédéfinis — ou n'importe quel nom custom (classes `q-text-{nom}-enter-active`…) */
type QTextTransition =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom"
  | "blur"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | (string & {})

interface Props {
  /** Texte (sinon slot par défaut) */
  text?: string | number
  /** Nombre de lignes avant troncature (1, 2, 3…) ; absent = pas de clamp */
  lines?: number
  /** Élément rendu (p par défaut) */
  tag?: string
  /** Transition jouée quand `text` change : fade, fade-up, fade-down,
   *  fade-left, fade-right, zoom, blur, slide-up, slide-down, slide-left,
   *  slide-right — ou un nom custom (classes `q-text-{nom}-enter-active`…) */
  transition?: QTextTransition
  /** Durée de la transition en ms (défaut 300) */
  transitionDuration?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: "p",
  transition: "",
  transitionDuration: 300,
})

const clampStyle = computed<Record<string, string> | undefined>(() =>
  props.lines ? { "--q-text-lines": String(props.lines) } : undefined,
)

const transitionStyle = computed<Record<string, string> | undefined>(() =>
  props.transition
    ? { "--q-text-duration": `${props.transitionDuration}ms` }
    : undefined,
)

/** Les effets slide sortent le texte du cadre → masquer le débordement */
const overflow = computed(() => props.transition.startsWith("slide"))
</script>

<template>
  <component
    :is="tag"
    class="q-text"
    :class="cn(
      lines && 'q-text--clamp',
      transition && 'q-text--transition',
      overflow && 'q-text--overflow',
      props.class,
    )"
    :style="[clampStyle, transitionStyle]"
    :title="lines && text !== undefined ? String(text) : undefined"
  >
    <Transition
      v-if="transition"
      :name="`q-text-${transition}`"
      mode="out-in"
      :duration="transitionDuration"
    >
      <span :key="String(text)" class="q-text__content">
        <slot>{{ text }}</slot>
      </span>
    </Transition>
    <slot v-else>{{ text }}</slot>
  </component>
</template>

<style scoped>
/* Contenu animé : inline-block pour que transform fonctionne */
.q-text__content {
  display: inline-block;
}

/* Les effets slide masquent le texte qui sort du cadre */
.q-text--overflow {
  overflow: hidden;
}

/* ─── fade ─── */
.q-text-fade-enter-active,
.q-text-fade-leave-active {
  transition: opacity var(--q-text-duration, 300ms) ease;
}
.q-text-fade-enter-from,
.q-text-fade-leave-to {
  opacity: 0;
}

/* ─── fade + direction ─── */
.q-text-fade-up-enter-active,
.q-text-fade-up-leave-active,
.q-text-fade-down-enter-active,
.q-text-fade-down-leave-active,
.q-text-fade-left-enter-active,
.q-text-fade-left-leave-active,
.q-text-fade-right-enter-active,
.q-text-fade-right-leave-active {
  transition:
    opacity var(--q-text-duration, 300ms) ease,
    transform var(--q-text-duration, 300ms) ease;
}
.q-text-fade-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.q-text-fade-up-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.q-text-fade-down-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.q-text-fade-down-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.q-text-fade-left-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.q-text-fade-left-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
.q-text-fade-right-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.q-text-fade-right-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

/* ─── zoom ─── */
.q-text-zoom-enter-active,
.q-text-zoom-leave-active {
  transition:
    opacity var(--q-text-duration, 300ms) ease,
    transform var(--q-text-duration, 300ms) ease;
}
.q-text-zoom-enter-from {
  opacity: 0;
  transform: scale(0.92);
}
.q-text-zoom-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* ─── blur ─── */
.q-text-blur-enter-active,
.q-text-blur-leave-active {
  transition:
    opacity var(--q-text-duration, 300ms) ease,
    filter var(--q-text-duration, 300ms) ease;
}
.q-text-blur-enter-from {
  opacity: 0;
  filter: blur(6px);
}
.q-text-blur-leave-to {
  opacity: 0;
  filter: blur(6px);
}

/* ─── slide (sans fondu, le texte glisse) ─── */
.q-text-slide-up-enter-active,
.q-text-slide-up-leave-active,
.q-text-slide-down-enter-active,
.q-text-slide-down-leave-active,
.q-text-slide-left-enter-active,
.q-text-slide-left-leave-active,
.q-text-slide-right-enter-active,
.q-text-slide-right-leave-active {
  transition: transform var(--q-text-duration, 300ms) ease;
}
.q-text-slide-up-enter-from {
  transform: translateY(100%);
}
.q-text-slide-up-leave-to {
  transform: translateY(-100%);
}
.q-text-slide-down-enter-from {
  transform: translateY(-100%);
}
.q-text-slide-down-leave-to {
  transform: translateY(100%);
}
.q-text-slide-left-enter-from {
  transform: translateX(100%);
}
.q-text-slide-left-leave-to {
  transform: translateX(-100%);
}
.q-text-slide-right-enter-from {
  transform: translateX(-100%);
}
.q-text-slide-right-leave-to {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .q-text-fade-enter-active,
  .q-text-fade-leave-active,
  .q-text-fade-up-enter-active,
  .q-text-fade-up-leave-active,
  .q-text-fade-down-enter-active,
  .q-text-fade-down-leave-active,
  .q-text-fade-left-enter-active,
  .q-text-fade-left-leave-active,
  .q-text-fade-right-enter-active,
  .q-text-fade-right-leave-active,
  .q-text-zoom-enter-active,
  .q-text-zoom-leave-active,
  .q-text-blur-enter-active,
  .q-text-blur-leave-active,
  .q-text-slide-up-enter-active,
  .q-text-slide-up-leave-active,
  .q-text-slide-down-enter-active,
  .q-text-slide-down-leave-active,
  .q-text-slide-left-enter-active,
  .q-text-slide-left-leave-active,
  .q-text-slide-right-enter-active,
  .q-text-slide-right-leave-active {
    transition: none;
  }
}
</style>
