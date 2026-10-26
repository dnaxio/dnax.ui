// Flèches de défilement de QTabs (`show-arrows`, comportement Quasar) : décide si les boutons
// de début / fin doivent apparaître, selon la position de défilement et les mesures.
//
// Logique **pure**, testable hors navigateur. Les navigateurs arrondissent `scrollLeft` /
// `scrollTop` (sous-pixels, zoom) : on tolère 1 px pour ne pas faire clignoter une flèche.

const EPSILON = 1

export interface QTabArrowState {
  /** On peut défiler vers le **début** (gauche / haut) */
  canStart: boolean
  /** On peut défiler vers la **fin** (droite / bas) */
  canEnd: boolean
}

/**
 * État des flèches pour un axe donné.
 *
 * @param position   `scrollLeft` / `scrollTop`
 * @param clientSize `clientWidth` / `clientHeight` (partie visible)
 * @param scrollSize `scrollWidth` / `scrollHeight` (contenu total)
 */
export function tabArrowState(
  position: number,
  clientSize: number,
  scrollSize: number,
): QTabArrowState {
  const overflow = scrollSize - clientSize
  return {
    canStart: position > EPSILON,
    canEnd: overflow > EPSILON && position < overflow - EPSILON,
  }
}

/** Déplacement d'un clic sur une flèche : ~60 % de la zone visible (au moins 80 px). */
export function tabArrowStep(clientSize: number): number {
  return Math.max(80, Math.round(clientSize * 0.6))
}
