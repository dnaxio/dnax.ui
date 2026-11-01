// useTextareaAutosize — branchement DOM de l'auto-extension d'un <textarea>.
//
// Le calcul de hauteur est pur (`lib/textarea.ts`, testé) ; ici on ne fait que
// mesurer et gérer le cycle de vie : montage, redimensionnement de la fenêtre,
// changement de **largeur** du champ (le texte se replie → la hauteur change).
// Rien n'est mesuré si `enabled()` est faux : la hauteur reste celle du CSS (`rows`).
import { nextTick, onBeforeUnmount, onMounted, watch } from "vue"
import type { Ref } from "vue"
import { textareaMetrics, textareaSizing } from "./textarea"

export interface UseTextareaAutosizeOptions {
  /** Auto-extension active (sinon la hauteur du CSS s'applique) */
  enabled: () => boolean
  /** Plafond en lignes, 0 = illimité */
  maxRows: () => number
  /** États dont le changement impose une re-mesure (valeur, rows, maxRows, mode…) */
  sources?: () => unknown
  /**
   * Re-mesure aussi quand la **largeur** du champ change. À laisser à `false` pour
   * un champ qui bascule `input`/`textarea` : l'élément observé y est remplacé.
   */
  observeWidth?: boolean
}

export interface TextareaAutosize {
  /** Re-mesure immédiatement (après un changement programmatique de valeur) */
  resize: () => Promise<void>
}

/** Élément mesuré : textarea, mais aussi l'`<input>` d'un champ à mode mixte. */
export type AutosizedElement = HTMLTextAreaElement | HTMLInputElement

export const useTextareaAutosize = <T extends AutosizedElement>(
  el: Ref<T | null>,
  options: UseTextareaAutosizeOptions,
): TextareaAutosize => {
  const resize = async () => {
    if (!el.value || !options.enabled()) return
    await nextTick()
    const node = el.value
    if (!node || typeof getComputedStyle !== "function") return
    // Hauteur remise à `auto` avant la mesure : sinon `scrollHeight` inclut déjà
    // la hauteur appliquée précédemment et le champ ne rétrécit jamais.
    node.style.height = "auto"
    const metrics = textareaMetrics(getComputedStyle(node))
    const sizing = textareaSizing(metrics, node.scrollHeight, options.maxRows())
    node.style.height = `${sizing.height}px`
    node.style.overflowY = sizing.overflowY
  }

  if (options.sources) watch(options.sources, () => void resize())

  const onWindowResize = () => void resize()

  let observer: ResizeObserver | null = null
  let observedWidth = 0

  onMounted(() => {
    void resize()
    if (typeof window === "undefined") return
    window.addEventListener("resize", onWindowResize)
    if (options.observeWidth === false || typeof ResizeObserver === "undefined") return
    const node = el.value
    if (!node) return
    // Seule la **largeur** nous intéresse : la hauteur est la conséquence de notre
    // propre écriture de `style.height`, l'observer rebouclerait dessus.
    observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      if (Math.abs(width - observedWidth) < 0.5) return
      observedWidth = width
      void resize()
    })
    observer.observe(node)
  })

  onBeforeUnmount(() => {
    if (typeof window !== "undefined") window.removeEventListener("resize", onWindowResize)
    observer?.disconnect()
    observer = null
  })

  return { resize }
}
