<script setup lang="ts">
// Démos live de la page QR Code : rendu SVG, taille/zone de silence, couleurs, correction
// d'erreur (avec logo au centre) et export PNG / SVG.
import { computed, ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "sizes" | "colors" | "ecc" | "export"
}>()

const url = ref("https://dnax.io/docs")

// — tailles —
const sizes = [
  { size: 96, margin: 2, label: "96 px · margin 2" },
  { size: 160, margin: 4, label: "160 px · margin 4 (défaut)" },
  { size: 224, margin: 4, label: "224 px · margin 4" },
]

// — couleurs —
const color = ref("#1976d2")
const background = ref("#ffffff")
const COLORS = ["#1976d2", "#0f172a", "#10b981", "#e91e63"]

// — correction d'erreur —
const payload = ref("https://dnax.io/docs/components/qrcode?source=demo&utm_campaign=qr")
const levels = ["L", "M", "Q", "H"] as const
const ecc = ref<(typeof levels)[number]>("H")

// — export —
const qr = ref<{ svg: () => string; toDataURL: (o?: { pixelSize?: number }) => string | null } | null>(null)
const copied = ref(false)

const downloadPng = () => {
  const dataUrl = qr.value?.toDataURL({ pixelSize: 8 })
  if (!dataUrl) return
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = "qrcode.png"
  link.click()
}

const downloadSvg = () => {
  const markup = qr.value?.svg()
  if (!markup) return
  const blob = new Blob([markup], { type: "image/svg+xml" })
  const href = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = href
  link.download = "qrcode.svg"
  link.click()
  URL.revokeObjectURL(href)
}

const copySvg = async () => {
  const markup = qr.value?.svg()
  if (!markup || !navigator.clipboard) return
  await navigator.clipboard.writeText(markup)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

// Le SVG du QR de la démo « export » (aperçu du code — utile pour un `<img src>`)
const previewSrc = computed(() => {
  const markup = qr.value?.svg()
  return markup ? `data:image/svg+xml;utf8,${encodeURIComponent(markup)}` : ""
})
</script>

<template>
  <!-- 1. L'essentiel : une valeur, un code -->
  <div v-if="demo === 'basic'" class="demo-stack">
    <div class="demo-row">
      <q-qrcode :value="url" />
      <div class="demo-col">
        <q-input v-model="url" dense outlined label="Contenu encodé" />
        <p class="demo-p">
          Tout ce qui tient dans un QR fait l'affaire : une URL, du texte, un vCard, une
          configuration wifi, un paiement… Le rendu est un **SVG** : net à n'importe quelle
          taille et rendu côté serveur.
        </p>
      </div>
    </div>
  </div>

  <!-- 2. Taille et zone de silence -->
  <div v-else-if="demo === 'sizes'" class="demo-stack">
    <div class="demo-row demo-row--start">
      <div v-for="item in sizes" :key="item.label" class="demo-col demo-col--tight">
        <q-qrcode value="https://dnax.io" :size="item.size" :margin="item.margin" />
        <p class="demo-meta">{{ item.label }}</p>
      </div>
    </div>

    <p class="demo-p">
      `size` accepte une longueur CSS (`"100%"`, `"12rem"`). `margin` est la **zone de
      silence** en modules : 4 par défaut, c'est ce qu'un lecteur attend. Le réduire n'est
      sûr que si le fond autour est clair et uni.
    </p>
  </div>

  <!-- 3. Couleurs (le contraste reste la règle) -->
  <div v-else-if="demo === 'colors'" class="demo-stack">
    <div class="demo-row">
      <q-btn-group>
        <q-btn
          v-for="value in COLORS"
          :key="value"
          flat
          no-caps
          :style="{ color: value }"
          :label="value"
          @click="color = value"
        />
      </q-btn-group>
      <q-btn flat no-caps label="fond transparent" @click="background = 'transparent'" />
      <q-btn flat no-caps label="fond blanc" @click="background = '#fff'" />
    </div>

    <div class="demo-row">
      <div class="demo-qr-card">
        <q-qrcode value="https://dnax.io" :color="color" :background="background" :size="160" />
      </div>
      <p class="demo-p">
        <code>color</code> et <code>background</code> prennent n'importe quelle couleur CSS,
        <code>var(--token)</code> compris. Gardez des **modules sombres sur un fond clair** :
        un QR inversé (clair sur sombre) n'est pas lu par tous les appareils.
      </p>
    </div>
  </div>

  <!-- 4. Correction d'erreur (et logo au centre) -->
  <div v-else-if="demo === 'ecc'" class="demo-stack">
    <div class="demo-row">
      <q-btn-group>
        <q-btn
          v-for="level in levels"
          :key="level"
          flat
          no-caps
          :color="ecc === level ? 'primary' : ''"
          :label="level"
          @click="ecc = level"
        />
      </q-btn-group>
      <span class="demo-meta">ecc = {{ ecc }}</span>
    </div>

    <div class="demo-row">
      <div class="demo-qr-logo">
        <q-qrcode :value="payload" :ecc="ecc" :size="180" />
        <q-avatar size="44px" class="demo-qr-logo__badge">
          <q-icon name="lucide:box" size="22px" color="white" />
        </q-avatar>
      </div>

      <p class="demo-p">
        Plus le niveau est élevé, plus le code est dense (et lisible s'il est abîmé). Un
        **logo au centre** ne se pose qu'en <code>ecc="H"</code> : jusqu'à ~30 % des modules
        peuvent être masqués.
      </p>
    </div>
  </div>

  <!-- 5. Export : PNG, SVG, presse-papier -->
  <div v-else class="demo-stack">
    <div class="demo-row">
      <div class="demo-qr-card">
        <q-qrcode ref="qr" :value="url" :size="180" />
      </div>

      <div class="demo-col demo-col--tight">
        <q-input v-model="url" dense outlined label="Contenu encodé" />
        <div class="demo-row">
          <q-btn color="primary" no-caps icon="lucide:download" label="PNG" @click="downloadPng" />
          <q-btn flat no-caps icon="lucide:download" label="SVG" @click="downloadSvg" />
          <q-btn flat no-caps :icon="copied ? 'lucide:check' : 'lucide:copy'" :label="copied ? 'Copié' : 'Copier le SVG'" @click="copySvg" />
        </div>
        <p class="demo-p">
          <code>toDataURL()</code> dessine la matrice dans un canvas (PNG), <code>svg()</code>
          rend le markup complet — de quoi télécharger, coller dans un email ou poser le code
          dans un <code>&lt;img src="data:image/svg+xml…"&gt;</code>.
        </p>
        <img v-if="previewSrc" class="demo-qr-preview" :src="previewSrc" alt="QR en image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-col--tight {
  gap: 6px;
}
.demo-row--start {
  align-items: flex-start;
}
.demo-qr-card {
  padding: 12px;
  border: 1px solid var(--border, rgb(0 0 0 / 0.1));
  border-radius: 14px;
  background: #fff;
}
.demo-qr-logo {
  position: relative;
  display: inline-flex;
}
.demo-qr-logo__badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1976d2;
  border: 3px solid #fff;
}
.demo-qr-preview {
  width: 96px;
  height: 96px;
  border: 1px solid var(--border, rgb(0 0 0 / 0.1));
  border-radius: 10px;
}
</style>
