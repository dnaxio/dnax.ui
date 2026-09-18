// Placement pur d'un panneau ancré à un champ — mode `popover` de QDatePicker.
//
// Aucune dépendance au DOM : le SFC mesure les rectangles (champ + fenêtre) et
// sérialise le résultat en `position: fixed` ; ce module décide **où**. La règle est
// la même que celle du popup `inline` de QSelect : ouverture vers le bas, bascule
// au-dessus quand la place manque, écart réduit à mesure que la place se réduit, et
// hauteur bornée à l'espace visible (le panneau scrolle au-delà).

/** Marge conservée avec les bords de la fenêtre */
export const POPOVER_VIEWPORT_MARGIN = 8

/** Écart par défaut entre le champ et le panneau */
export const POPOVER_GAP = 8

/** Espace vertical visé sous le champ — en dessous, on cherche la place au-dessus */
export const POPOVER_MIN_SPACE = 220

/** Largeur de repli tant que le panneau n'a pas été mesuré (1er rendu) */
export const POPOVER_FALLBACK_WIDTH = 360

/** Marge minimale de la flèche avec les coins du panneau */
export const POPOVER_CARET_INSET = 16

/** Rectangle du champ d'ancrage (coordonnées fenêtre) */
export interface PopoverAnchor {
  top: number
  bottom: number
  left: number
  width: number
}

/** Fenêtre visible */
export interface PopoverViewport {
  width: number
  height: number
}

export interface PlacePopoverOptions {
  /** Rectangle du champ auquel le panneau s'ancre */
  anchor: PopoverAnchor
  viewport: PopoverViewport
  /** Largeur réelle du panneau (mesurée après rendu) */
  panelWidth?: number
  /** Écart champ ↔ panneau (8px par défaut) */
  gap?: number
  /** Marge fenêtre (8px par défaut) */
  margin?: number
  /** Espace vertical minimal visé (220px par défaut) */
  minSpace?: number
}

export interface PopoverPlacement {
  /** Côté d'ouverture : `down` sous le champ, `up` au-dessus */
  direction: "down" | "up"
  /** Bord haut en `position: fixed` — `null` quand le panneau s'ouvre au-dessus */
  top: number | null
  /** Bord bas en `position: fixed` — `null` quand le panneau s'ouvre en dessous */
  bottom: number | null
  /** Bord gauche, recadré dans la fenêtre */
  left: number
  /** Hauteur maximale du panneau (au-delà : scroll interne) */
  maxHeight: number
  /** Position de la flèche, depuis le bord gauche du panneau */
  caret: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max))

/**
 * Place un panneau ancré sous un champ et renvoie ses coordonnées `position: fixed`.
 * Le côté (dessous / dessus), l'écart, la hauteur maximale et le recadrage horizontal
 * dépendent de l'espace réellement visible dans la fenêtre.
 */
export function placePopover(options: PlacePopoverOptions): PopoverPlacement {
  const { anchor, viewport, panelWidth = POPOVER_FALLBACK_WIDTH } = options
  const gap0 = options.gap ?? POPOVER_GAP
  const margin = options.margin ?? POPOVER_VIEWPORT_MARGIN
  const minSpace = options.minSpace ?? POPOVER_MIN_SPACE

  const below = viewport.height - anchor.bottom - margin
  const above = anchor.top - margin

  // Sous le champ dès qu'il y a la place ; sinon on prend le côté le plus large.
  const down = below >= minSpace || below >= above
  const available = Math.max(down ? below : above, 0)

  // Écart réduit quand la place manque, pour laisser le maximum au panneau
  const gap = clamp(gap0, 0, Math.max(available - minSpace, 0))

  // Largeur : jamais plus large que la fenêtre (moins les deux marges)
  const width = Math.min(panelWidth, Math.max(viewport.width - margin * 2, 0))

  // Ancre horizontale : bord gauche du champ, recadré dans la fenêtre
  const left = Math.round(clamp(anchor.left, margin, viewport.width - width - margin))

  // Flèche : centrée sur le champ, maintenue à distance des coins
  const caret = Math.round(
    clamp(
      anchor.left + anchor.width / 2 - left,
      POPOVER_CARET_INSET,
      width - POPOVER_CARET_INSET,
    ),
  )

  return {
    direction: down ? "down" : "up",
    top: down ? Math.round(anchor.bottom + gap) : null,
    bottom: down ? null : Math.round(viewport.height - anchor.top + gap),
    left,
    maxHeight: Math.round(Math.max(available - gap, 0)),
    caret,
  }
}
