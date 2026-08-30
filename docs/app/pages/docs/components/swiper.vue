<script setup lang="ts">
// Swiper — documentation de la famille QSwiper + QSwiperSlide : carrousel complet.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const swiper = useComponent(() => "QSwiper")
const swiperSource = componentSource("QSwiper")
const swiperSlide = useComponent(() => "QSwiperSlide")
const swiperSlideSource = componentSource("QSwiperSlide")
const tag = componentTag("QSwiper")

// — Démo événement —
const currentSlide = ref(1)

// — Démo effets —
const effect = ref<"slide" | "fade" | "cube" | "flip" | "coverflow" | "cards" | "creative">("coverflow")
const effectOptions = ["slide", "fade", "cube", "flip", "coverflow", "cards", "creative"]

// — Démo thumbs / controller —
const thumbs = ref<any>(null)
const ctrlA = ref<any>(null)
const ctrlB = ref<any>(null)

// — Images des démos (Unsplash) —
const demoImages = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=927&auto=format&fit=crop",
]

const usageBasic = `<q-swiper :slides-per-view="2" :space-between="16" loop centered-slides>
  <q-swiper-slide v-for="i in 8" :key="i">
    <div class="slide slide--img">
      <img class="slide__img" :src="images[i % images.length]" :alt="'Slide ' + (i + 1)" />
      <span class="slide__caption">Slide {{ i + 1 }}</span>
    </div>
  </q-swiper-slide>
</q-swiper>
<!-- loop exige plus de slides que slides-per-view (ici 8 pour 2 par vue). -->`

const usageNav = `<q-swiper navigation :pagination="{ clickable: true }" @slide-change="current = $event.realIndex + 1">
  <q-swiper-slide v-for="i in 5" :key="i">
    <div class="slide">Slide {{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<p class="demo-p demo-meta">Current slide: {{ current }}</p>`

const usageAutoplay = `<q-swiper :autoplay="{ delay: 1800, disableOnInteraction: false }" loop>
  <q-swiper-slide v-for="i in 5" :key="i">
    <div class="slide">Autoplay {{ i }}</div>
  </q-swiper-slide>
</q-swiper>`

const usageFree = `<q-swiper free-mode mousewheel grab-cursor :slides-per-view="3" :space-between="16">
  <q-swiper-slide v-for="i in 9" :key="i">
    <div class="slide slide--sm">Free {{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- free-mode : défilement libre sans snap · mousewheel · grab-cursor -->`

const usageKeyboard = `<q-swiper keyboard :scrollbar="{ draggable: true }" :slides-per-view="3" :space-between="16">
  <q-swiper-slide v-for="i in 8" :key="i">
    <div class="slide slide--sm">KB {{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- keyboard : flèches ← → après focus · scrollbar draggable -->`

const usageGrid = `<q-swiper :slides-per-view="3" :space-between="16" :grid="{ rows: 2, fill: 'row' }" class="fixed">
  <q-swiper-slide v-for="i in 8" :key="i">
    <div class="slide slide--sm">Grid {{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- grid : 2 rangées × 3 colonnes (hauteur fixe requise) -->`

const usageEffects = `<q-select v-model="effect" :options="effects" outlined dense label="Effect" class="select" />
<q-swiper :effect="effect" class="fixed">
  <q-swiper-slide v-for="(img, i) in images" :key="i">
    <div class="slide slide--img">
      <img class="slide__img" :src="img" :alt="effect" />
      <span class="slide__caption">{{ effect }}</span>
    </div>
  </q-swiper-slide>
</q-swiper>`

const usageParallax = `<q-swiper parallax class="fixed">
  <q-swiper-slide v-for="i in 4" :key="i">
    <div class="parallax">
      <div class="parallax__title" data-swiper-parallax="300">Slide {{ i }}</div>
      <p class="parallax__text" data-swiper-parallax="200">Layers move at different speeds as you drag.</p>
    </div>
  </q-swiper-slide>
</q-swiper>`

const usageZoom = `<q-swiper :zoom="true" :slides-per-view="2" :space-between="16" class="fixed">
  <q-swiper-slide v-for="(img, i) in images" :key="i" zoom>
    <img class="img" :src="img" :alt="'Zoom ' + (i + 1)" />
  </q-swiper-slide>
</q-swiper>
<!-- zoom : double-clic (ou pincement) pour zoomer -->`

const usageThumbs = `<q-swiper :thumbs="{ swiper: thumbs }" :space-between="12" class="fixed">
  <q-swiper-slide v-for="(img, i) in images" :key="i">
    <div class="slide slide--img">
      <img class="slide__img" :src="img" :alt="'Gallery ' + (i + 1)" />
    </div>
  </q-swiper-slide>
</q-swiper>

<q-swiper watch-slides-progress :slides-per-view="4" :space-between="12" class="thumbs" @swiper="(s) => (thumbs = s)">
  <q-swiper-slide v-for="(img, i) in images" :key="i">
    <img class="thumb__img" :src="img" :alt="'Thumb ' + (i + 1)" />
  </q-swiper-slide>
</q-swiper>`

const usageController = `<q-swiper :controller="{ control: second }" :slides-per-view="3" :space-between="12" @swiper="(s) => (first = s)">
  <q-swiper-slide v-for="i in 5" :key="i">
    <div class="slide slide--sm">A {{ i }}</div>
  </q-swiper-slide>
</q-swiper>

<q-swiper :controller="{ control: first }" :slides-per-view="3" :space-between="12" @swiper="(s) => (second = s)">
  <q-swiper-slide v-for="i in 5" :key="i">
    <div class="slide slide--sm">B {{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- Les deux carrousels sont synchronisés dans les deux sens. -->`

const usageHash = `<q-swiper hash-navigation class="fixed">
  <q-swiper-slide v-for="i in 4" :key="i">
    <div class="slide slide--tall">#slide/{{ i }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- hash-navigation : l'URL reflète la slide active (#slide/1…) -->`

const usageLazy = `<q-swiper lazy-preload :slides-per-view="3" :space-between="16">
  <q-swiper-slide v-for="(img, i) in images" :key="i" lazy>
    <img class="img" :src="img" loading="lazy" :alt="'Image ' + (i + 1)" />
  </q-swiper-slide>
</q-swiper>
<!-- lazy : images chargées à l'approche (spinner intégré) -->`

const usageVirtual = `<q-swiper virtual :slides-per-view="3" :space-between="16">
  <q-swiper-slide v-for="(_, i) in 1000" :key="i" :virtual-index="i">
    <div class="slide slide--sm">Slide {{ i + 1 }}</div>
  </q-swiper-slide>
</q-swiper>
<!-- virtual : 1000 slides rendus à la volée. -->`

const scriptImages = `const images = [
  "https://images.unsplash.com/photo-1786057425168-1f326d4f47b1?q=80&w=1287&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?q=80&w=1287&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1671554187530-8f9bd9449193?q=80&w=927&auto=format&fit=crop",
]`

const scriptBasic = scriptImages

const scriptNav = `import { ref } from "vue"

const current = ref(1)`

const scriptEffects = `import { ref } from "vue"

const effect = ref("coverflow")
const effects = ["slide", "fade", "cube", "flip", "coverflow", "cards", "creative"]

${scriptImages}`

const scriptZoom = scriptImages

const scriptLazy = scriptImages

const scriptThumbs = `import { ref } from "vue"

const thumbs = ref(null)

${scriptImages}`

const scriptController = `import { ref } from "vue"

const first = ref(null)
const second = ref(null)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Swiper</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A full-featured carousel: <b>&lt;q-swiper&gt;</b> takes every parameter as a
      prop (<code>slides-per-view</code>, <code>space-between</code>,
      <code>loop</code>, <code>navigation</code>, <code>autoplay</code>,
      <code>effect</code>, <code>virtual</code>…) and emits events
      (<code>@slide-change</code>, <code>@swiper</code>…).
      <b>&lt;q-swiper-slide&gt;</b> is the slide (with <code>virtual-index</code>,
      <code>zoom</code>) exposing <code>isActive</code>/<code>isVisible</code>…
      via its slot. Every module is pre-registered — autoplay, free mode, grid,
      parallax, all effects (fade, coverflow, cards, cube, flip, creative),
      navigation, pagination, scrollbar, keyboard, mousewheel, zoom, virtual,
      thumbs, controller, hash navigation, a11y.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        <code>slides-per-view</code>, <code>space-between</code>,
        <code>loop</code> and <code>centered-slides</code> — drag with the mouse
        or swipe on touch.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-swiper :slides-per-view="2" :space-between="16" loop centered-slides>
          <q-swiper-slide v-for="i in 8" :key="i">
            <div class="demo-slide demo-slide--img">
              <img
                class="demo-slide__img"
                :src="demoImages[i % demoImages.length]"
                :alt="'Slide ' + (i + 1)"
              />
              <span class="demo-slide__caption">Slide {{ i + 1 }}</span>
            </div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
      <p class="doc-note">
        <code>loop</code> needs more slides than <code>slides-per-view</code> —
        here 8 slides for 2 per view (Swiper warns otherwise).
      </p>
    </section>

    <!-- ═══════ Navigation & pagination ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Navigation &amp; pagination</h2>
      <p class="doc-note">
        <code>navigation</code> adds prev/next arrows,
        <code>:pagination="{ clickable: true }"</code> the bullets — both themed
        with the design-system primary color.
      </p>

      <docs-demo :code="usageNav" lang="html" filename="App.vue" :script="scriptNav">
        <q-swiper
          navigation
          :pagination="{ clickable: true }"
          @slide-change="currentSlide = $event.realIndex + 1"
        >
          <q-swiper-slide v-for="i in 5" :key="i">
            <div class="demo-slide">Slide {{ i }}</div>
          </q-swiper-slide>
        </q-swiper>
        <p class="demo-p demo-meta">Current slide: {{ currentSlide }}</p>
      </docs-demo>
    </section>

    <!-- ═══════ Autoplay ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Autoplay</h2>
      <p class="doc-note">
        <code>:autoplay="{ delay: 1800 }"</code> advances automatically;
        <code>disableOnInteraction: false</code> keeps it running after you drag.
      </p>

      <docs-demo :code="usageAutoplay" lang="html" filename="App.vue">
        <q-swiper :autoplay="{ delay: 1800, disableOnInteraction: false }" loop>
          <q-swiper-slide v-for="i in 5" :key="i">
            <div class="demo-slide">Autoplay {{ i }}</div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Free mode ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Free mode &amp; mousewheel</h2>
      <p class="doc-note">
        <code>free-mode</code> removes the snap (scroll freely),
        <code>mousewheel</code> enables wheel scrolling and
        <code>grab-cursor</code> shows a grab hand.
      </p>

      <docs-demo :code="usageFree" lang="html" filename="App.vue">
        <q-swiper free-mode mousewheel grab-cursor :slides-per-view="3" :space-between="16">
          <q-swiper-slide v-for="i in 9" :key="i">
            <div class="demo-slide demo-slide--sm">Free {{ i }}</div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Keyboard & scrollbar ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Keyboard &amp; scrollbar</h2>
      <p class="doc-note">
        <code>keyboard</code> navigates with the arrow keys (focus the carousel
        first); <code>:scrollbar="{ draggable: true }"</code> adds a draggable bar.
      </p>

      <docs-demo :code="usageKeyboard" lang="html" filename="App.vue">
        <q-swiper keyboard :scrollbar="{ draggable: true }" :slides-per-view="3" :space-between="16">
          <q-swiper-slide v-for="i in 8" :key="i">
            <div class="demo-slide demo-slide--sm">KB {{ i }}</div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Grid ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Grid</h2>
      <p class="doc-note">
        <code>:grid="{ rows: 2, fill: 'row' }"</code> arranges the slides on
        several rows (fixed height required).
      </p>

      <docs-demo :code="usageGrid" lang="html" filename="App.vue">
        <q-swiper
          :slides-per-view="3"
          :space-between="16"
          :grid="{ rows: 2, fill: 'row' }"
          class="demo-swiper--grid"
        >
          <q-swiper-slide v-for="i in 8" :key="i">
            <div class="demo-slide demo-slide--sm">Grid {{ i }}</div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Effects ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Effects</h2>
      <p class="doc-note">
        <code>effect</code> switches the transition: <code>slide</code>,
        <code>fade</code>, <code>cube</code>, <code>flip</code>,
        <code>coverflow</code>, <code>cards</code>, <code>creative</code>.
        Non-slide effects require a fixed-height container.
      </p>

      <docs-demo :code="usageEffects" lang="html" filename="App.vue" :script="scriptEffects">
        <q-select
          v-model="effect"
          :options="effectOptions"
          outlined
          dense
          label="Effect"
          class="demo-effect-select"
        />
        <q-swiper :effect="effect" class="demo-swiper--fixed">
          <q-swiper-slide v-for="(img, i) in demoImages" :key="i">
            <div class="demo-slide demo-slide--img">
              <img class="demo-slide__img" :src="img" :alt="effect" />
              <span class="demo-slide__caption">{{ effect }}</span>
            </div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Parallax ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Parallax</h2>
      <p class="doc-note">
        <code>parallax</code> moves elements with <code>data-swiper-parallax</code>
        at different speeds while dragging.
      </p>

      <docs-demo :code="usageParallax" lang="html" filename="App.vue">
        <q-swiper parallax class="demo-swiper--fixed">
          <q-swiper-slide v-for="i in 4" :key="i">
            <div class="demo-parallax">
              <div class="demo-parallax__title" data-swiper-parallax="300">Slide {{ i }}</div>
              <p class="demo-parallax__text" data-swiper-parallax="200">
                Layers move at different speeds as you drag.
              </p>
            </div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Zoom ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Zoom</h2>
      <p class="doc-note">
        <code>:zoom="true"</code> + the slide <code>zoom</code> prop — double-click
        (or pinch on touch) to zoom in.
      </p>

      <docs-demo :code="usageZoom" lang="html" filename="App.vue" :script="scriptZoom">
        <q-swiper :zoom="true" :slides-per-view="2" :space-between="16" class="demo-swiper--fixed">
          <q-swiper-slide v-for="(img, i) in demoImages" :key="i" zoom>
            <img
              class="demo-img"
              :src="img"
              :alt="'Zoom ' + (i + 1)"
            />
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Thumbs ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Thumbs gallery</h2>
      <p class="doc-note">
        A second carousel acts as a thumbnail strip: pass its instance via
        <code>:thumbs="{ swiper }"</code> and set
        <code>watch-slides-progress</code> on it.
      </p>

      <docs-demo :code="usageThumbs" lang="html" filename="App.vue" :script="scriptThumbs">
        <q-swiper :thumbs="{ swiper: thumbs }" :space-between="12" class="demo-swiper--fixed">
          <q-swiper-slide v-for="(img, i) in demoImages" :key="i">
            <div class="demo-slide demo-slide--img">
              <img class="demo-slide__img" :src="img" :alt="'Gallery ' + (i + 1)" />
            </div>
          </q-swiper-slide>
        </q-swiper>

        <q-swiper
          watch-slides-progress
          :slides-per-view="4"
          :space-between="12"
          class="demo-thumbs"
          @swiper="(s: any) => (thumbs = s)"
        >
          <q-swiper-slide v-for="(img, i) in demoImages" :key="i">
            <img class="demo-thumb__img" :src="img" :alt="'Thumb ' + (i + 1)" />
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Controller ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Controller</h2>
      <p class="doc-note">
        Two carousels can drive each other via
        <code>:controller="{ control: otherInstance }"</code>.
      </p>

      <docs-demo :code="usageController" lang="html" filename="App.vue" :script="scriptController">
        <q-swiper
          :controller="{ control: ctrlB }"
          :slides-per-view="3"
          :space-between="12"
          @swiper="(s: any) => (ctrlA = s)"
        >
          <q-swiper-slide v-for="i in 5" :key="i">
            <div class="demo-slide demo-slide--sm">A {{ i }}</div>
          </q-swiper-slide>
        </q-swiper>
        <q-swiper
          :controller="{ control: ctrlA }"
          :slides-per-view="3"
          :space-between="12"
          @swiper="(s: any) => (ctrlB = s)"
        >
          <q-swiper-slide v-for="i in 5" :key="i">
            <div class="demo-slide demo-slide--sm">B {{ i }}</div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Hash navigation ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Hash navigation</h2>
      <p class="doc-note">
        <code>hash-navigation</code> mirrors the active slide in the URL hash
        (<code>#slide/1</code>…) and restores it on load.
      </p>

      <docs-demo :code="usageHash" lang="html" filename="App.vue">
        <q-swiper hash-navigation class="demo-swiper--fixed">
          <q-swiper-slide v-for="i in 4" :key="i">
            <div class="demo-slide demo-slide--tall">#slide/{{ i }}</div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Lazy loading ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Lazy loading</h2>
      <p class="doc-note">
        Lazy images are handled natively: <code>loading="lazy"</code> on the
        images, <code>lazy-preload</code> to preload neighbors, and the slide
        <code>lazy</code> prop for a built-in spinner.
      </p>

      <docs-demo :code="usageLazy" lang="html" filename="App.vue" :script="scriptLazy">
        <q-swiper lazy-preload :slides-per-view="3" :space-between="16">
          <q-swiper-slide v-for="(img, i) in demoImages" :key="i" lazy>
            <img
              class="demo-img"
              :src="img"
              loading="lazy"
              :alt="'Image ' + (i + 1)"
            />
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ Virtual ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Virtual slides</h2>
      <p class="doc-note">
        <code>virtual</code> renders thousands of slides on demand — set
        <code>virtual-index</code> on each slide.
      </p>

      <docs-demo :code="usageVirtual" lang="html" filename="App.vue">
        <q-swiper virtual :slides-per-view="3" :space-between="16">
          <q-swiper-slide v-for="(_, i) in 1000" :key="i" :virtual-index="i">
            <div class="demo-slide demo-slide--sm">Slide {{ i + 1 }}</div>
          </q-swiper-slide>
        </q-swiper>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSwiper API</h2>
      <p class="doc-note">
        QSwiper forwards every carousel parameter and event — breakpoints,
        thumbs, controller, keyboard, scrollbar, zoom, grid, parallax… all as
        props and events on the component.
      </p>
      <docs-api :comp="swiper" :source="swiperSource" />
      <h3 class="doc-h3">QSwiperSlide API</h3>
      <docs-api :comp="swiperSlide" :source="swiperSlideSource" />
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
.doc-h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-meta {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
}
.demo-effect-select {
  max-width: 220px;
  margin-bottom: 14px;
}

/* — slides — */
.demo-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 170px;
  border-radius: 14px;
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  box-shadow: 0 8px 20px rgb(25 118 210 / 0.22);
}
.demo-slide--sm {
  height: 120px;
  font-size: 15px;
}
.demo-slide--tall {
  height: 100%;
  min-height: 180px;
}
.demo-slide:nth-child(3n + 2) {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  box-shadow: 0 8px 20px rgb(124 58 237 / 0.22);
}
.demo-slide:nth-child(3n) {
  background: linear-gradient(135deg, #0e7490, #22d3ee);
  box-shadow: 0 8px 20px rgb(14 116 144 / 0.22);
}

/* — slides avec image — */
.demo-slide--img {
  position: relative;
  overflow: hidden;
  padding: 0;
}
.demo-slide__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.demo-slide__caption {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

/* — hauteurs fixes (effets, grid, zoom) — */
.demo-swiper--fixed {
  height: 220px;
}
.demo-swiper--grid {
  height: 280px;
}
.demo-swiper--fixed :deep(.swiper),
.demo-swiper--grid :deep(.swiper) {
  height: 100%;
}

/* — parallax — */
.demo-parallax {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0e7490, #22d3ee);
  color: #fff;
}
.demo-parallax__title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.demo-parallax__text {
  margin: 0;
  font-size: 14px;
  opacity: 0.85;
}

/* — lazy & zoom images — */
.demo-img {
  display: block;
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
}

/* — thumbs — */
.demo-thumbs {
  height: 64px;
  margin-top: 12px;
}
.demo-thumbs :deep(.swiper) {
  height: 100%;
}
.demo-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  border-radius: 10px;
  border: 2px solid transparent;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.demo-thumb__img {
  display: block;
  width: 100%;
  height: 54px;
  border-radius: 10px;
  border: 2px solid transparent;
  object-fit: cover;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.demo-thumbs :deep(.swiper-slide-thumb-active .demo-thumb),
.demo-thumbs :deep(.swiper-slide-thumb-active .demo-thumb__img) {
  border-color: var(--primary);
}
</style>
