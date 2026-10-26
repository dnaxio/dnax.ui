// Historique undo/redo réactif (QSpreadsheet).
//
// Les piles doivent être des `shallowRef` **remplacées** à chaque opération : un `push`
// sur un tableau simple ne déclenche aucune réactivité. C'est exactement le bug qui
// figeait `canUndo`/`canRedo` à `false` (boutons désactivés et Ctrl+Z inerte), même
// quand `pushHistory()` avait bien été appelé (suppression de ligne, tri, remplissage…).
import { computed, shallowRef } from "vue"
import type { ComputedRef, ShallowRef } from "vue"

export interface History<T> {
  readonly undoStack: ShallowRef<T[]>
  readonly redoStack: ShallowRef<T[]>
  readonly canUndo: ComputedRef<boolean>
  readonly canRedo: ComputedRef<boolean>
  /** Enregistre un état **avant** mutation et vide la pile redo. */
  push: (snapshot: T) => void
  /** Dépile undo (et empile `current` dans redo) → instantané à restaurer. */
  undo: (current: T) => T | null
  /** Dépile redo (et empile `current` dans undo) → instantané à restaurer. */
  redo: (current: T) => T | null
  /** Vide les deux piles. */
  clear: () => void
}

/**
 * Piles d'historique bornées (`limit`, la plus ancienne entrée est oubliée).
 * Toutes les opérations renvoient/réaffectent des tableaux **neufs** pour rester réactives.
 */
export function createHistory<T>(limit = 100): History<T> {
  const undoStack = shallowRef<T[]>([])
  const redoStack = shallowRef<T[]>([])

  const push = (snapshot: T) => {
    const next = [...undoStack.value, snapshot]
    undoStack.value = next.length > limit ? next.slice(next.length - limit) : next
    redoStack.value = []
  }

  const undo = (current: T): T | null => {
    const stack = undoStack.value
    if (!stack.length) return null
    const snapshot = stack[stack.length - 1]!
    undoStack.value = stack.slice(0, -1)
    redoStack.value = [...redoStack.value, current]
    return snapshot
  }

  const redo = (current: T): T | null => {
    const stack = redoStack.value
    if (!stack.length) return null
    const snapshot = stack[stack.length - 1]!
    redoStack.value = stack.slice(0, -1)
    undoStack.value = [...undoStack.value, current]
    return snapshot
  }

  const clear = () => {
    undoStack.value = []
    redoStack.value = []
  }

  return {
    undoStack,
    redoStack,
    canUndo: computed(() => undoStack.value.length > 0),
    canRedo: computed(() => redoStack.value.length > 0),
    push,
    undo,
    redo,
    clear,
  }
}
