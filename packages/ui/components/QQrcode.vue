<script setup lang="ts">
// QQrcode — code QR : la matrice est encodée par la dépendance `qrcode` (déjà présente) et
// tracée par dnax.ui en **SVG** — un seul chemin, net à toutes les tailles, thémable et
// rendu côté serveur (l'encodage est du JS pur).
//
//   <q-qrcode value="https://dnax.io" />
//   <q-qrcode :value="url" :size="220" :margin="2" color="var(--foreground)" />
//   <q-qrcode value="…" ecc="H" background="transparent" />
//
// Le composant expose `svg()` (SVG sérialisé : téléchargement, presse-papier) et
// `toDataURL()` (PNG, côté client). Le tracé vit dans `lib/qrcode.ts` (pur, testé).
import { computed, watchEffect } from "vue"
import { isDark, encodeQr, qrPath, qrSize, qrSvg, qrTotalSize, qrViewBox, type QrEcc } from "../lib/qrcode"

interface Props {
  /** Contenu encodé (URL, texte, vCard, wifi…) — vide : rien n'est rendu */
  value?: string
  /** Côté du rendu : nombre (px) ou longueur CSS */
  size?: number | string
  /** Correction d'erreur : `L` (~7 %) → `H` (~30 %, pour un QR abîmé ou un logo au centre) */
  ecc?: QrEcc
  /** Zone de silence en modules (défaut 4 : c'est ce qu'attend un lecteur ; 0 pour un QR
   *  collé à son cadre — à ne faire que si le fond autour est clair et uni) */
  margin?: number
  /** Couleur des modules (couleur CSS quelconque, `var(--token)` comprise) */
  color?: string
  /** Couleur du fond — `"transparent"` laisse voir le fond du parent */
  background?: string
  /** Étiquette accessible du SVG (`role="img"`) */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  size: 160,
  ecc: "M",
  margin: 4,
  color: "#000",
  background: "#fff",
  label: "Code QR",
})

/** Matrice de modules — `undefined` si la valeur ne tient pas dans un QR */
const matrix = computed(() => encodeQr(props.value, { ecc: props.ecc }))

watchEffect(() => {
  if (props.value && !matrix.value) {
    console.warn(
      `[q-qrcode] valeur non encodable (trop longue pour ecc="${props.ecc}") : rien n'est rendu`,
    )
  }
})

const total = computed(() => (matrix.value ? qrTotalSize(matrix.value, props.margin) : 0))
const viewBox = computed(() => (matrix.value ? qrViewBox(matrix.value, props.margin) : "0 0 0 0"))
const path = computed(() => (matrix.value ? qrPath(matrix.value, props.margin) : ""))
const cssSize = computed(() => qrSize(props.size))
const transparent = computed(() => props.background === "transparent")

/** SVG sérialisé (téléchargement, presse-papier, `<img src="data:image/svg+xml…">`) */
const svg = (): string =>
  matrix.value
    ? qrSvg(matrix.value, {
        margin: props.margin,
        color: props.color,
        background: props.background,
        label: props.label,
      })
    : ""

/** Couleur résolue en valeur calculée (le canvas ne comprend ni `var()` ni `currentColor`) */
const resolveColor = (value: string, fallback: string): string => {
  if (typeof document === "undefined") return fallback
  const probe = document.createElement("span")
  probe.style.color = value
  probe.style.display = "none"
  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return resolved || fallback
}

/** PNG (data URL) dessiné depuis la matrice — navigateur uniquement, `null` côté serveur */
const toDataURL = (options: { pixelSize?: number; margin?: number } = {}): string | null => {
  const m = matrix.value
  if (!m || typeof document === "undefined") return null

  const pixel = Math.max(1, Math.floor(options.pixelSize ?? 8))
  const margin = Math.max(0, Math.floor(options.margin ?? props.margin))
  const side = qrTotalSize(m, margin)

  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = side * pixel
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  ctx.fillStyle = resolveColor(props.background, "transparent")
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = resolveColor(props.color, "#000")

  for (let y = 0; y < m.size; y++) {
    for (let x = 0; x < m.size; x++) {
      if (isDark(m, x, y)) ctx.fillRect((x + margin) * pixel, (y + margin) * pixel, pixel, pixel)
    }
  }

  return canvas.toDataURL("image/png")
}

defineExpose({
  /** SVG complet du code courant ("" si la valeur n'est pas encodable) */
  svg,
  /** PNG en `data:` URL (nécessite un navigateur) */
  toDataURL,
})
</script>

<template>
  <svg
    v-if="matrix"
    class="q-qrcode"
    :viewBox="viewBox"
    :width="cssSize"
    :height="cssSize"
    role="img"
    :aria-label="label"
    v-bind="$attrs"
  >
    <rect v-if="!transparent" :width="total" :height="total" :fill="background" />
    <path :d="path" :fill="color" shape-rendering="crispEdges" />
  </svg>
</template>
