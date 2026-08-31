<script setup lang="ts">
// Container — documentation du composant QContainer : conteneur centré à largeur max
// + arrière-plans décoratifs (grid / aurora).
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const container = useComponent(() => "QContainer")
const containerSource = componentSource("QContainer")
const tag = componentTag("QContainer")

// — Démo image de fond —
const imgSizeDemo = ref("cover")
const imgSizes = ["cover", "contain", "50%", "400px"]
const imgDirDemo = ref<"alternate" | "alternate-reverse" | "normal" | "reverse">("alternate")
const imgDirs = ["alternate", "alternate-reverse", "normal", "reverse"]

const usageBasic = `<q-container>
  <p>Max-width 1200px by default, 16px horizontal padding.</p>
</q-container>

<q-container max-width="640px" padding="24px">
  <p>A narrower, roomier container.</p>
</q-container>

<q-container fluid>
  <p>Fluid: full width, padding kept.</p>
</q-container>`

const usageGrid = `<q-container
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
</q-container>`

const usageStar = `<q-container
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
</q-container>`

const usageFalling = `<q-container
  background-effect="falling-stars"
  star-color="#f5d76e"
  class="demo-surface demo-surface--dark"
>
  <h3 class="demo-title">Falling stars</h3>
  <p class="demo-text">
    Diagonal streaks with a fading trail that fall in a seamless loop —
    colored with <code>star-color</code>.
  </p>
</q-container>`

const usageFlicker = `<q-container
  background-effect="flickering-grid"
  grid-color="#7dd3fc"
  class="demo-surface demo-surface--dark"
>
  <h3 class="demo-title">Flickering grid</h3>
  <p class="demo-text">
    A grid of small squares where some cells flicker like faulty neon —
    colored with <code>grid-color</code>, spaced with <code>grid-spacing</code>.
  </p>
</q-container>`

const usageInteractive = `<q-container
  background-effect="interactive-grid"
  grid-color="#7dd3fc"
  class="demo-surface demo-surface--dark"
>
  <h3 class="demo-title">Interactive grid</h3>
  <p class="demo-text">
    Move the mouse over the surface — the cells light up around the cursor.
    Colored with <code>grid-color</code>, spaced with <code>grid-spacing</code>.
  </p>
</q-container>`

const usageWave = `<q-container background-effect="wave" class="demo-surface">
  <h3 class="demo-title">Wave background</h3>
  <p class="demo-text">
    Two layered waves that glide seamlessly along the bottom edge —
    colored with <code>wave-color</code> / <code>wave-color-2</code>.
  </p>
</q-container>`

const usageAurora = `<q-container
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
</q-container>`

const usageGlass = `<q-container glass class="demo-surface">
  <h3 class="demo-title">Glass container</h3>
  <p class="demo-text">
    A translucent frosted panel — whatever sits behind it blurs through
    (backdrop-filter).
  </p>
</q-container>`

const usageImage = `<q-container
  glass
  background-animated
  :background-image-size="imgSize"
  :background-animation-direction="imgDir"
  background-image="https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  class="demo-surface"
>
  <h3 class="demo-title">Glass over a moving image</h3>
  <p class="demo-text">
    The background image is glassmorphized (blurred + saturated) and drifts
    with a slow, indeterminate Ken Burns motion.
  </p>
</q-container>`

const scriptImage = `import { ref } from "vue"

const imgSize = ref("cover")
const imgDir = ref("alternate")`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Container</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A centered, max-width wrapper: <b>&lt;q-container&gt;</b> keeps content
      readable on wide screens (<code>max-width</code>, default 1200px), with a
      configurable <code>padding</code> or full-width <code>fluid</code> mode.
      The optional <code>background-effect</code> adds a decorative backdrop —
      a fading <code>grid</code> of squares, a <code>star</code> grid,
      <code>falling-stars</code>, a <code>flickering-grid</code>, an
      <code>interactive-grid</code>, gliding <code>wave</code>s or a drifting
      <code>aurora</code>.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        <code>max-width</code>, <code>padding</code> and <code>fluid</code>
        control the box — the slot holds anything.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <div class="demo-col">
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
      </docs-demo>
    </section>

    <!-- ═══════ Grid ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Grid background</h2>
      <p class="doc-note">
        <code>background-effect="grid"</code> draws a square grid that fades
        towards the edges — set the line color with <code>grid-color</code>
        and the spacing between lines with <code>grid-spacing</code> (any CSS
        size).
      </p>

      <docs-demo :code="usageGrid" lang="html" filename="App.vue">
        <q-container
          background-effect="grid"
          grid-color="rgba(25, 118, 210, 0.3)"
          grid-spacing="48px"
          class="demo-surface"
        >
          <h3 class="demo-title">Grid background</h3>
          <p class="demo-text">
            A square grid that fades out towards the edges — the line color
            and spacing come from <code>grid-color</code> /
            <code>grid-spacing</code>.
          </p>
        </q-container>
      </docs-demo>
    </section>

    <!-- ═══════ Star ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Star grid</h2>
      <p class="doc-note">
        <code>background-effect="star"</code> draws a starfield: small dots on
        a grid with larger twinkling stars, fading towards the edges. Tune the
        color with <code>star-color</code>, the spacing with
        <code>star-spacing</code> and the dot size with
        <code>star-dot-size</code> — perfect over dark surfaces. Animations
        respect <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageStar" lang="html" filename="App.vue">
        <q-container
          background-effect="star"
          star-color="#f5d76e"
          star-spacing="36px"
          star-dot-size="2px"
          class="demo-surface demo-surface--dark"
        >
          <h3 class="demo-title">Star grid</h3>
          <p class="demo-text">
            A starfield of dots that fades towards the edges — the color,
            spacing and dot size come from <code>star-color</code> /
            <code>star-spacing</code> / <code>star-dot-size</code>.
          </p>
        </q-container>
      </docs-demo>
    </section>

    <!-- ═══════ Falling stars ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Falling stars</h2>
      <p class="doc-note">
        <code>background-effect="falling-stars"</code> drops diagonal streaks
        with a fading trail in a seamless loop — perfect over dark surfaces.
        The trail color comes from <code>star-color</code>. Animations respect
        <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageFalling" lang="html" filename="App.vue">
        <q-container
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
      </docs-demo>
    </section>

    <!-- ═══════ Flickering grid ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Flickering grid</h2>
      <p class="doc-note">
        <code>background-effect="flickering-grid"</code> draws a grid of small
        squares where some cells flicker like faulty neon. The square color
        comes from <code>grid-color</code>, the spacing from
        <code>grid-spacing</code>. Animations respect
        <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageFlicker" lang="html" filename="App.vue">
        <q-container
          background-effect="flickering-grid"
          grid-color="#7dd3fc"
          class="demo-surface demo-surface--dark"
        >
          <h3 class="demo-title">Flickering grid</h3>
          <p class="demo-text">
            A grid of small squares where some cells flicker like faulty neon —
            colored with <code>grid-color</code>, spaced with
            <code>grid-spacing</code>.
          </p>
        </q-container>
      </docs-demo>
    </section>

    <!-- ═══════ Interactive grid ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Interactive grid</h2>
      <p class="doc-note">
        <code>background-effect="interactive-grid"</code> dims the grid and
        lights the cells back up in a circle around the mouse cursor. The
        square color comes from <code>grid-color</code>, the spacing from
        <code>grid-spacing</code>.
      </p>

      <docs-demo :code="usageInteractive" lang="html" filename="App.vue">
        <q-container
          background-effect="interactive-grid"
          grid-color="#7dd3fc"
          class="demo-surface demo-surface--dark"
        >
          <h3 class="demo-title">Interactive grid</h3>
          <p class="demo-text">
            Move the mouse over the surface — the cells light up around the
            cursor. Colored with <code>grid-color</code>, spaced with
            <code>grid-spacing</code>.
          </p>
        </q-container>
      </docs-demo>
    </section>

    <!-- ═══════ Wave ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Wave</h2>
      <p class="doc-note">
        <code>background-effect="wave"</code> layers two waves that glide
        seamlessly along the bottom edge. Tune the colors with
        <code>wave-color</code> (first) and <code>wave-color-2</code> (second).
        Animations respect <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageWave" lang="html" filename="App.vue">
        <q-container background-effect="wave" class="demo-surface">
          <h3 class="demo-title">Wave background</h3>
          <p class="demo-text">
            Two layered waves that glide seamlessly along the bottom edge —
            colored with <code>wave-color</code> / <code>wave-color-2</code>.
          </p>
        </q-container>
      </docs-demo>
    </section>

    <!-- ═══════ Aurora ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Aurora background</h2>
      <p class="doc-note">
        <code>background-effect="aurora"</code> adds soft glowing halos that
        drift slowly behind the content. Tune the gradients with
        <code>aurora-color</code> (first halo) and <code>aurora-color-2</code>
        (second). Animations respect <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageAurora" lang="html" filename="App.vue">
        <q-container
          background-effect="aurora"
          aurora-color="#f472b6"
          aurora-color-2="#fb923c"
          class="demo-surface"
        >
          <h3 class="demo-title">Aurora background</h3>
          <p class="demo-text">
            Soft glowing halos that drift slowly behind the content — the
            gradient colors come from <code>aurora-color</code> /
            <code>aurora-color-2</code>.
          </p>
        </q-container>
      </docs-demo>
    </section>

    <!-- ═══════ Glass ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Glass</h2>
      <p class="doc-note">
        <code>glass</code> turns the container into a frosted panel: a
        translucent background with a <code>backdrop-filter</code> blur of
        whatever sits behind it, a light border and a soft shadow. Respects
        dark mode.
      </p>

      <docs-demo :code="usageGlass" lang="html" filename="App.vue">
        <q-container glass class="demo-surface">
          <h3 class="demo-title">Glass container</h3>
          <p class="demo-text">
            A translucent frosted panel — whatever sits behind it blurs through
            (backdrop-filter).
          </p>
        </q-container>
      </docs-demo>
    </section>

    <!-- ═══════ Image background ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Image background</h2>
      <p class="doc-note">
        <code>background-image</code> renders a URL as a full-bleed layer
        behind the content. <code>background-image-size</code> controls the
        box — <code>cover</code> (default), <code>contain</code>, or a CSS
        size (<code>"50%"</code>, <code>"400px"</code> → centered box).
        Combined with <code>glass</code> the image is <b>glassmorphized</b>
        (blurred + saturated) — and <code>background-animated</code> drifts it
        with a slow, indeterminate Ken Burns motion:
        <code>background-animation-direction</code> picks the loop behavior
        (<code>alternate</code> default, <code>alternate-reverse</code>,
        <code>normal</code> restart, <code>reverse</code>) and
        <code>background-animation-duration</code> the speed (default 24s).
        Animations respect <code>prefers-reduced-motion</code>.
      </p>

      <docs-demo :code="usageImage" lang="html" filename="App.vue" :script="scriptImage">
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
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QContainer API</h2>
      <docs-api :comp="container" :source="containerSource" />
    </section>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
