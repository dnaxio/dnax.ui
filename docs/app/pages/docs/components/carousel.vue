<script setup lang="ts">
// Carousel — documentation complète de la famille :
// QCarousel + QCarouselContent + QCarouselItem + QCarouselNav.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const carousel = useComponent(() => "QCarousel")
const carouselContent = useComponent(() => "QCarouselContent")
const carouselItem = useComponent(() => "QCarouselItem")
const carouselNav = useComponent(() => "QCarouselNav")

const carouselSource = componentSource("QCarousel")
const carouselContentSource = componentSource("QCarouselContent")
const carouselItemSource = componentSource("QCarouselItem")
const carouselNavSource = componentSource("QCarouselNav")

const tag = componentTag("QCarousel")

// Objet stable : évite de recréer les options Embla à chaque rendu
const loopOpts = { loop: true }

const usageBasic = `<q-carousel class="demo-carousel">
  <q-carousel-content>
    <q-carousel-item>
      <div class="demo-slide demo-slide--1">Slide 1</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--2">Slide 2</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--3">Slide 3</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--4">Slide 4</div>
    </q-carousel-item>
  </q-carousel-content>
  <q-carousel-nav direction="prev" label="Previous slide" />
  <q-carousel-nav direction="next" label="Next slide" />
</q-carousel>`

const usageLoop = `<q-carousel class="demo-carousel" :opts="{ loop: true }">
  <q-carousel-content>
    <q-carousel-item>
      <div class="demo-slide demo-slide--1">Slide 1</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--2">Slide 2</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--3">Slide 3</div>
    </q-carousel-item>
  </q-carousel-content>
  <q-carousel-nav direction="prev" label="Previous slide" />
  <q-carousel-nav direction="next" label="Next slide" />
</q-carousel>`

const usageVertical = `<q-carousel
  class="demo-carousel demo-carousel--vertical"
  orientation="vertical"
>
  <q-carousel-content>
    <q-carousel-item>
      <div class="demo-slide demo-slide--1">Slide 1</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--2">Slide 2</div>
    </q-carousel-item>
    <q-carousel-item>
      <div class="demo-slide demo-slide--3">Slide 3</div>
    </q-carousel-item>
  </q-carousel-content>
  <q-carousel-nav direction="prev" label="Previous slide" />
  <q-carousel-nav direction="next" label="Next slide" />
</q-carousel>`

const usageItem = `<q-carousel-item>
  <div class="demo-slide demo-slide--1">Full width</div>
</q-carousel-item>

<!-- size the slide via class : half, third, … -->
<q-carousel-item class="basis-1/2 md:basis-1/3">
  <div class="demo-slide demo-slide--2">50%</div>
</q-carousel-item>`

const usageNav = `<q-carousel-nav direction="prev" label="Previous slide" />
<q-carousel-nav direction="next" label="Next slide" />`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Carousel</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A carousel displays a collection of items side by side with scroll-snap
      navigation, built on Embla. The family is made of four components:
      <b>&lt;q-carousel&gt;</b> (the provider), <b>&lt;q-carousel-content&gt;</b>
      (the scrollable viewport and track), <b>&lt;q-carousel-item&gt;</b> (one
      slide) and <b>&lt;q-carousel-nav&gt;</b> (previous/next buttons). Pass Embla
      options through <code>opts</code> for looping, alignment or autoplay plugins.
    </p>

    <!-- ═══════ QCarousel ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCarousel — provider</h2>
      <p class="doc-note">
        Owns the Embla instance and shares it with the children through
        <code>provide/inject</code>. The default slot is scoped and exposes
        <code>api</code>, <code>canScrollPrev</code>, <code>canScrollNext</code>,
        <code>scrollPrev</code>, <code>scrollNext</code>, <code>selectedIndex</code>
        and <code>scrollSnaps</code> — handy for custom dots or progress.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue">
        <q-carousel class="demo-carousel">
          <q-carousel-content>
            <q-carousel-item>
              <div class="demo-slide demo-slide--1">Slide 1</div>
            </q-carousel-item>
            <q-carousel-item>
              <div class="demo-slide demo-slide--2">Slide 2</div>
            </q-carousel-item>
            <q-carousel-item>
              <div class="demo-slide demo-slide--3">Slide 3</div>
            </q-carousel-item>
            <q-carousel-item>
              <div class="demo-slide demo-slide--4">Slide 4</div>
            </q-carousel-item>
          </q-carousel-content>
          <q-carousel-nav direction="prev" label="Previous slide" />
          <q-carousel-nav direction="next" label="Next slide" />
        </q-carousel>
      </docs-demo>

      <h3 class="doc-h3">Loop</h3>
      <docs-demo :code="usageLoop" lang="html" filename="App.vue">
        <q-carousel class="demo-carousel" :opts="loopOpts">
          <q-carousel-content>
            <q-carousel-item>
              <div class="demo-slide demo-slide--1">Slide 1</div>
            </q-carousel-item>
            <q-carousel-item>
              <div class="demo-slide demo-slide--2">Slide 2</div>
            </q-carousel-item>
            <q-carousel-item>
              <div class="demo-slide demo-slide--3">Slide 3</div>
            </q-carousel-item>
          </q-carousel-content>
          <q-carousel-nav direction="prev" label="Previous slide" />
          <q-carousel-nav direction="next" label="Next slide" />
        </q-carousel>
      </docs-demo>

      <h3 class="doc-h3">Vertical</h3>
      <docs-demo :code="usageVertical" lang="html" filename="App.vue">
        <q-carousel class="demo-carousel demo-carousel--vertical" orientation="vertical">
          <q-carousel-content>
            <q-carousel-item>
              <div class="demo-slide demo-slide--1">Slide 1</div>
            </q-carousel-item>
            <q-carousel-item>
              <div class="demo-slide demo-slide--2">Slide 2</div>
            </q-carousel-item>
            <q-carousel-item>
              <div class="demo-slide demo-slide--3">Slide 3</div>
            </q-carousel-item>
          </q-carousel-content>
          <q-carousel-nav direction="prev" label="Previous slide" />
          <q-carousel-nav direction="next" label="Next slide" />
        </q-carousel>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="carousel" :source="carouselSource" />
    </section>

    <!-- ═══════ QCarouselContent ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCarouselContent — viewport &amp; track</h2>
      <p class="doc-note">
        The overflow-hidden viewport plus the flex track. The Embla root is
        measured here, and the orientation class is applied automatically when
        the parent is <code>orientation="vertical"</code>.
      </p>
      <q-syntax :code="usageBasic" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="carouselContent" :source="carouselContentSource" />
    </section>

    <!-- ═══════ QCarouselItem ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCarouselItem — one slide</h2>
      <p class="doc-note">
        A slide, <code>basis-full</code> by default. Override the width with a
        class (e.g. <code>basis-1/2</code>, <code>md:basis-1/3</code>) to show
        several slides at once.
      </p>
      <q-syntax :code="usageItem" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="carouselItem" :source="carouselItemSource" />
    </section>

    <!-- ═══════ QCarouselNav ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QCarouselNav — previous / next</h2>
      <p class="doc-note">
        The navigation buttons, positioned over the slides
        (<code>direction="prev"</code> left, <code>direction="next"</code>
        right). They pick the correct chevron automatically for the current
        orientation and disable themselves at the edges.
      </p>
      <q-syntax :code="usageNav" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="carouselNav" :source="carouselNavSource" />
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

/* espace entre les deux blocs docs-demo (single / multiple) */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}

/* — démos Carousel — */
.demo-carousel {
  width: 100%;
  max-width: 560px;
}
.demo-carousel--vertical {
  height: 280px;
}
.demo-carousel--vertical :deep(.q-carousel__viewport) {
  height: 100%;
}
.demo-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  font-size: 17px;
  background: var(--primary);
}
.demo-carousel--vertical .demo-slide {
  height: 100%;
}
.demo-slide--2 {
  background: #4caf50;
}
.demo-slide--3 {
  background: #ff9800;
}
.demo-slide--4 {
  background: #9c27b0;
}
</style>
