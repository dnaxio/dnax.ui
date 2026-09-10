<script setup lang="ts">
// Démos live de la page Container (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo:
    | "basic"
    | "grid"
    | "star"
    | "falling"
    | "flicker"
    | "interactive"
    | "wave"
    | "aurora"
    | "glass"
    | "image"
}>()

// — Démo image de fond —
const imgSizeDemo = ref("cover")
const imgSizes = ["cover", "contain", "50%", "400px"]
const imgDirDemo = ref<"alternate" | "alternate-reverse" | "normal" | "reverse">("alternate")
const imgDirs = ["alternate", "alternate-reverse", "normal", "reverse"]
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-col">
    <q-container class="demo-box demo-box--default">
      <p>Max-width 1200px by default, 16px horizontal padding.</p>
    </q-container>
    <q-container max-width="640px" padding="24px" class="demo-box">
      <p>A narrower, roomier container.</p>
    </q-container>
    <q-container fluid class="demo-box demo-box--fluid">
      <p>Fluid: full width, padding kept.</p>
    </q-container>
  </div>

  <q-container
    v-else-if="demo === 'grid'"
    background-effect="grid"
    grid-color="rgba(25, 118, 210, 0.3)"
    grid-spacing="48px"
    class="demo-surface"
  >
    <h3 class="demo-title">Grid background</h3>
    <p class="demo-text">
      A square grid that fades out towards the edges — the line color and
      spacing come from <code>grid-color</code> / <code>grid-spacing</code>.
    </p>
  </q-container>

  <q-container
    v-else-if="demo === 'star'"
    background-effect="star"
    star-color="#f5d76e"
    star-spacing="36px"
    star-dot-size="2px"
    class="demo-surface demo-surface--dark"
  >
    <h3 class="demo-title">Star grid</h3>
    <p class="demo-text">
      A starfield of dots that fades towards the edges — the color, spacing and
      dot size come from <code>star-color</code> / <code>star-spacing</code> /
      <code>star-dot-size</code>.
    </p>
  </q-container>

  <q-container
    v-else-if="demo === 'falling'"
    background-effect="falling-stars"
    star-color="#f5d76e"
    class="demo-surface demo-surface--dark"
  >
    <h3 class="demo-title">Falling stars</h3>
    <p class="demo-text">
      Diagonal streaks with a fading trail that fall in a seamless loop —
      colored with <code>star-color</code>.
    </p>
  </q-container>

  <q-container
    v-else-if="demo === 'flicker'"
    background-effect="flickering-grid"
    grid-color="#7dd3fc"
    class="demo-surface demo-surface--dark"
  >
    <h3 class="demo-title">Flickering grid</h3>
    <p class="demo-text">
      A grid of small squares where some cells flicker like faulty neon —
      colored with <code>grid-color</code>, spaced with <code>grid-spacing</code>.
    </p>
  </q-container>

  <q-container
    v-else-if="demo === 'interactive'"
    background-effect="interactive-grid"
    grid-color="#7dd3fc"
    class="demo-surface demo-surface--dark"
  >
    <h3 class="demo-title">Interactive grid</h3>
    <p class="demo-text">
      Move the mouse over the surface — the cells light up around the cursor.
      Colored with <code>grid-color</code>, spaced with <code>grid-spacing</code>.
    </p>
  </q-container>

  <q-container v-else-if="demo === 'wave'" background-effect="wave" class="demo-surface">
    <h3 class="demo-title">Wave background</h3>
    <p class="demo-text">
      Two layered waves that glide seamlessly along the bottom edge —
      colored with <code>wave-color</code> / <code>wave-color-2</code>.
    </p>
  </q-container>

  <q-container
    v-else-if="demo === 'aurora'"
    background-effect="aurora"
    aurora-color="#f472b6"
    aurora-color-2="#fb923c"
    class="demo-surface"
  >
    <h3 class="demo-title">Aurora background</h3>
    <p class="demo-text">
      Soft glowing halos that drift slowly behind the content — the gradient
      colors come from <code>aurora-color</code> / <code>aurora-color-2</code>.
    </p>
  </q-container>

  <q-container v-else-if="demo === 'glass'" glass class="demo-surface">
    <h3 class="demo-title">Glass container</h3>
    <p class="demo-text">
      A translucent frosted panel — whatever sits behind it blurs through
      (backdrop-filter).
    </p>
  </q-container>

  <div v-else-if="demo === 'image'">
    <div class="demo-row demo-row--img">
      <q-select
        v-model="imgSizeDemo"
        :options="imgSizes"
        label="background-image-size"
        outlined
        dense
        class="demo-img-select"
      />
      <q-select
        v-model="imgDirDemo"
        :options="imgDirs"
        label="animation-direction"
        outlined
        dense
        class="demo-img-select"
      />
    </div>
    <q-container
      glass
      background-animated
      :background-image-size="imgSizeDemo"
      :background-animation-direction="imgDirDemo"
      background-image="https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      class="demo-surface demo-surface--img"
    >
      <h3 class="demo-title">Glass over a moving image</h3>
      <p class="demo-text">
        The background image is glassmorphized (blurred + saturated) and
        drifts with a slow, indeterminate Ken Burns motion.
      </p>
    </q-container>
  </div>
</template>

<style scoped>
.demo-col {
  max-width: none;
}

.demo-box {
  border: 1px dashed rgb(0 0 0 / 0.18);
  border-radius: 10px;
  background: var(--muted);
  font-size: 14px;
  color: var(--foreground);
}

.demo-box--default {
  max-width: 1200px;
}

.demo-box p {
  margin: 0;
}

/* — surfaces décorées (grid / aurora) — */
.demo-surface {
  border-radius: 18px;
  padding: 48px 24px;
  text-align: center;
}

.demo-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--foreground);
}

.demo-text {
  margin: 0 auto;
  max-width: 420px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}

.demo-surface--dark {
  background: linear-gradient(135deg, #10141d, #1b2230);
}

.demo-surface--dark .demo-title {
  color: #fff;
}

.demo-surface--dark .demo-text {
  color: rgb(255 255 255 / 0.75);
}

/* surface image de fond : assez haute pour montrer l'image + texte lisible */
.demo-surface--img {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.demo-surface--img .demo-title,
.demo-surface--img .demo-text {
  color: #fff;
  text-shadow: 0 2px 10px rgb(0 0 0 / 0.6);
}

.demo-row--img {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.demo-img-select {
  width: 220px;
}
</style>
