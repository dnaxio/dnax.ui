<script setup lang="ts">
// Dnax UI — landing page : design moderne, dogfooding des composants de la lib.
import { onMounted, ref } from "vue"
import { menuItems } from "~/data/menu"

const componentCount = menuItems.find((g) => g.title === "Components")?.items?.length ?? 0

// — Image du mockup TikTok (héros) —
const TIKTOK_IMG =
  "https://images.unsplash.com/photo-1783628376510-0de24d5b18a5?q=80&w=640&h=1136&auto=format&fit=crop"

// — Démos —
const scrollTo = (sel: string) => {
  const el = document.querySelector<HTMLElement>(sel)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" })
}

// — Bento : accept terms —
const accepted = ref(true)

// — Bento : radius live —
const radiusDemo = ref(10)

// — Bento : mini OTP —
const otp = ref("")

// — Parallax & gallery —
const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=900&auto=format&fit=crop`

const GALLERY = [
  { src: IMG("photo-1786057425168-1f326d4f47b1"), label: "Alpine sunrise", description: "Golden light over the peaks" },
  { src: IMG("photo-1783628376510-0de24d5b18a5"), label: "Coastal cliffs", description: "Wild ocean views" },
  { src: IMG("photo-1567095761054-7a02e69e5c43"), label: "Forest trail", description: "Morning mist between the pines" },
  { src: IMG("photo-1497366754035-f200968a6e72"), label: "Loft office", description: "Brick, steel & light" },
  { src: IMG("photo-1500530855697-b586d89ba3ee"), label: "Lake house", description: "Still water at dusk" },
  { src: IMG("photo-1470071459604-3b5ec3a7fe05"), label: "Misty hills", description: "Fog rolling in" },
]

const PARALLAX_IMG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"

const gallerySel = ref<string[]>([])

// — Bento : icônes avec tooltips —
const bentoIcons = [
  "lucide:zap",
  "lucide:star",
  "lucide:heart",
  "lucide:rocket",
  "lucide:bell",
  "lucide:camera",
  "lucide:inbox",
  "lucide:search",
  "lucide:palette",
  "lucide:shield-check",
  "lucide:moon",
  "lucide:smartphone",
]

// — Code mis en avant —
const heroCode = `import { QBtn } from "@dnax/ui"

<q-btn flat dense rounded no-caps
  color="primary"
  icon="lucide:download"
  label="Export"
/>`

const installCode = `# npm / pnpm / yarn / bun
bun add @dnax/ui`

const nuxtCode = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@dnax/ui"],
})`

const usageCode = `<template>
  <q-btn color="primary" no-caps label="Ship it 🚀" />
</template>`

// — Reveal on scroll —
const landing = ref<HTMLElement | null>(null)
onMounted(() => {
  const els = landing.value?.querySelectorAll(".reveal")
  if (!els || typeof IntersectionObserver === "undefined") return
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in")
          io.unobserve(e.target)
        }
      }
    },
    { threshold: 0.12 },
  )
  els.forEach((el) => io.observe(el))
})
</script>

<template>
  <div ref="landing" class="landing">
    <!-- ═══════════ HERO ═══════════ -->
    <section class="hero">
      <div class="hero-aurora" aria-hidden="true">
        <span class="aurora aurora--1" />
        <span class="aurora aurora--2" />
        <span class="aurora aurora--3" />
      </div>
      <div class="hero-grid" aria-hidden="true" />

      <q-container class="hero-inner">
        <div class="hero-copy">
          <q-badge outline color="white" class="hero-badge">
            <span class="hero-dot" aria-hidden="true" />
            Vue 3 · Nuxt · Capacitor · {{ componentCount }} components
          </q-badge>

          <h1 class="hero-title">
            Simple <span class="grad">syntax</span>,<br />
            total <span class="grad grad--alt">control</span>.
          </h1>

          <p class="hero-sub">
            Dnax UI — the perfect <b>mobile UI kit for Capacitor apps</b>, built on
            <b>Vue 3</b> &amp; <b>Nuxt</b>: expressive syntax
            (<code>&lt;q-btn flat dense&gt;</code>), CSS-token theming, Iconify icons,
            iOS safe-areas and dark mode out of the box.
          </p>

          <div class="hero-actions">
            <q-btn
              size="lg"
              color="primary"
              unelevated
              no-caps
              icon="lucide:rocket"
              label="Get started"
              class="btn-glow"
              @click="scrollTo('#install')"
            />
            <q-btn
              size="lg"
              outline
              color="white"
              no-caps
              icon="lucide:smartphone"
              label="Mobile mockup"
              href="/mockup"
            />
            <q-btn
              size="lg"
              flat
              color="white"
              no-caps
              icon="lucide:component"
              label="Browse components"
              href="/docs"
            />
          </div>

          <div class="hero-stats" aria-label="Key numbers">
            <div class="hero-stat">
              <span class="hero-stat-n">{{ componentCount }}</span>
              <span class="hero-stat-l">components</span>
            </div>
            <span class="hero-stat-sep" aria-hidden="true" />
            <div class="hero-stat">
              <span class="hero-stat-n">200k+</span>
              <span class="hero-stat-l">Iconify icons</span>
            </div>
            <span class="hero-stat-sep" aria-hidden="true" />
            <div class="hero-stat">
              <span class="hero-stat-n">0</span>
              <span class="hero-stat-l">CSS framework</span>
            </div>
          </div>
        </div>

        <div class="hero-phone">
          <span class="hero-phone__glow" aria-hidden="true" />
          <div class="hero-phone__device">
            <span class="hero-phone__btn hero-phone__btn--action" aria-hidden="true" />
            <span class="hero-phone__btn hero-phone__btn--up" aria-hidden="true" />
            <span class="hero-phone__btn hero-phone__btn--down" aria-hidden="true" />
            <span class="hero-phone__btn hero-phone__btn--power" aria-hidden="true" />
            <div class="hero-phone__screen">
              <div class="hero-phone__island" aria-hidden="true"><span class="hero-phone__cam" /></div>
              <div class="hero-phone__status" aria-hidden="true">
                <span class="hero-phone__time">9:41</span>
                <span class="hero-phone__status-icons">
                  <q-icon name="lucide:signal" size="11px" />
                  <q-icon name="lucide:wifi" size="12px" />
                  <q-icon name="lucide:battery-full" size="15px" />
                </span>
              </div>

              <div class="tiktok">
                <img class="tiktok__bg" :src="TIKTOK_IMG" alt="" draggable="false" />
                <div class="tiktok__shade" />

                <!-- Barre du haut : Following | For You -->
                <div class="tiktok__top">
                  <div class="tiktok__tabs">
                    <span class="tiktok__tab">Following</span>
                    <span class="tiktok__tab tiktok__tab--on">For You</span>
                  </div>
                  <q-icon name="lucide:search" size="15px" class="tiktok__search" />
                </div>

                <!-- Rail d'actions à droite -->
                <div class="tiktok__rail">
                  <div class="tiktok__rail-item">
                    <span class="tiktok__rail-btn"><q-icon name="lucide:heart" size="16px" /></span>
                    <span class="tiktok__rail-n">1.2M</span>
                  </div>
                  <div class="tiktok__rail-item">
                    <span class="tiktok__rail-btn"><q-icon name="lucide:message-circle" size="16px" /></span>
                    <span class="tiktok__rail-n">48.3K</span>
                  </div>
                  <div class="tiktok__rail-item">
                    <span class="tiktok__rail-btn"><q-icon name="lucide:bookmark" size="16px" /></span>
                    <span class="tiktok__rail-n">9,102</span>
                  </div>
                  <div class="tiktok__rail-item">
                    <span class="tiktok__rail-btn"><q-icon name="lucide:share-2" size="16px" /></span>
                    <span class="tiktok__rail-n">Share</span>
                  </div>
                  <span class="tiktok__rail-avatar">D</span>
                </div>

                <!-- Info du bas -->
                <div class="tiktok__bottom">
                  <p class="tiktok__handle">@dnax.ui</p>
                  <p class="tiktok__desc">Building a design system — one component at a time ✨</p>
                  <p class="tiktok__song">
                    <span class="tiktok__disc"><q-icon name="lucide:music" size="10px" /></span>
                    original sound — Dnax UI
                  </p>
                </div>
              </div>

              <span class="hero-phone__home" aria-hidden="true" />
            </div>
          </div>
          <span class="hero-phone__floor" aria-hidden="true" />
        </div>
      </q-container>

      <button class="hero-scroll" aria-label="Scroll down" @click="scrollTo('#code')">
        <q-icon name="lucide:chevron-down" size="20px" />
      </button>
    </section>

    <!-- ═══════════ CODE BAND ═══════════ -->
    <section id="code" class="band">
      <q-container>
        <div class="code-card reveal">
          <div class="code-glow" aria-hidden="true" />
          <q-syntax :code="heroCode" lang="vue" filename="App.vue" copy />
        </div>
      </q-container>
    </section>

    <!-- ═══════════ BENTO FEATURES ═══════════ -->
    <section id="features" class="lp-section">
      <q-container>
        <div class="lp-head reveal">
          <q-badge outline color="primary" label="Why Dnax UI?" />
          <h2 class="lp-title">One library, every use case</h2>
          <p class="lp-sub">
            Every card below is built with the real components — go ahead, play with them.
          </p>
        </div>

        <div class="bento">
          <!-- Syntax -->
          <div class="bento-card bento-card--wide reveal">
            <div class="bento-head">
              <q-icon name="lucide:wand-sparkles" color="primary" size="22px" />
              <h3 class="bento-title">Expressive API</h3>
            </div>
            <p class="bento-text">
              Boolean modifiers, v-model and slots — a concise, readable, predictable API
              inspired by the best.
            </p>
            <div class="bento-demo">
              <q-btn unelevated no-caps color="primary" label="Solid" />
              <q-btn outline no-caps color="primary" label="Outline" />
              <q-btn flat no-caps color="primary" label="Flat" />
              <q-btn
                round
                color="primary"
                unelevated
                icon="lucide:sparkles"
                aria-label="Magic"
              />
            </div>
          </div>

          <!-- Theming live -->
          <div class="bento-card reveal">
            <div class="bento-head">
              <q-icon name="lucide:palette" color="secondary" size="22px" />
              <h3 class="bento-title">Live theming</h3>
            </div>
            <p class="bento-text">
              CSS tokens everywhere — drag to reshape these buttons.
            </p>
            <div class="theme-demo" :style="{ '--q-radius': radiusDemo + 'px' }">
              <q-btn unelevated no-caps color="secondary" label="Radius" />
              <q-btn outline no-caps color="secondary" icon="lucide:shapes" aria-label="Shape" />
            </div>
            <q-slider v-model="radiusDemo" :min="0" :max="16" color="secondary" />
            <span class="bento-caption">--q-radius: {{ radiusDemo }}px</span>
          </div>

          <!-- Mobile : vrai simulateur iPhone -->
          <div class="bento-card reveal">
            <div class="bento-head">
              <q-icon name="lucide:smartphone" color="positive" size="22px" />
              <h3 class="bento-title">Mobile-first</h3>
            </div>
            <p class="bento-text">
              A true iOS simulator — Dynamic Island, status bar, safe-areas &amp; home
              indicator. Ship the exact same UI into a Capacitor app on iOS &amp;
              Android.
            </p>

            <div class="iphone" aria-hidden="true">
              <span class="iphone__btn iphone__btn--action" />
              <span class="iphone__btn iphone__btn--v1" />
              <span class="iphone__btn iphone__btn--v2" />
              <span class="iphone__btn iphone__btn--power" />

              <div class="iphone__screen">
                <div class="iphone__island"><span class="iphone__cam" /></div>

                <div class="iphone__status">
                  <span class="iphone__time">9:41</span>
                  <span class="iphone__status-icons">
                    <q-icon name="lucide:signal" size="10px" />
                    <q-icon name="lucide:wifi" size="10px" />
                    <q-icon name="lucide:battery-full" size="13px" />
                  </span>
                </div>

                <div class="iphone__app">
                  <span class="iphone__caption">Now Playing</span>
                  <div class="iphone__art">
                    <q-icon name="lucide:music" size="22px" />
                    <span class="iphone__eq"><i /><i /><i /></span>
                  </div>
                  <span class="iphone__track">Midnight City</span>
                  <span class="iphone__artist">M83 · Hurry Up, We're Dreaming</span>
                  <div class="iphone__progress"><span class="iphone__progress-fill" /></div>
                  <div class="iphone__times"><span>1:24</span><span>-2:19</span></div>
                  <div class="iphone__controls">
                    <q-icon name="lucide:skip-back" size="15px" />
                    <span class="iphone__play"><q-icon name="lucide:pause" size="13px" /></span>
                    <q-icon name="lucide:skip-forward" size="15px" />
                  </div>
                </div>

                <div class="iphone__tabbar">
                  <q-icon name="lucide:house" size="14px" class="iphone__tab--active" />
                  <q-icon name="lucide:search" size="14px" />
                  <q-icon name="lucide:library" size="14px" />
                </div>

                <span class="iphone__home" />
              </div>
            </div>
          </div>

          <!-- Icons -->
          <div class="bento-card reveal">
            <div class="bento-head">
              <q-icon name="lucide:icons" color="warning" size="22px" />
              <h3 class="bento-title">Iconify inside</h3>
            </div>
            <p class="bento-text">200k+ icons, one prop. Hover them.</p>
            <div class="icon-grid">
              <span v-for="ic in bentoIcons" :key="ic" class="icon-cell">
                <q-icon :name="ic" size="19px" />
                <q-tooltip :type="ic === 'lucide:star' ? 'warning' : 'info'" show-arrow>
                  {{ ic.replace('lucide:', '') }}
                </q-tooltip>
              </span>
            </div>
          </div>

          <!-- Forms -->
          <div class="bento-card reveal">
            <div class="bento-head">
              <q-icon name="lucide:keyboard" color="accent" size="22px" />
              <h3 class="bento-title">Forms ready</h3>
            </div>
            <p class="bento-text">Inputs, OTP, checkboxes… batteries included.</p>
            <q-input-otp v-model="otp" :length="4" numeric size="sm" />
            <q-checkbox v-model="accepted" label="Accept terms" color="accent" />
          </div>
        </div>
      </q-container>
    </section>

    <!-- ═══════════ PARALLAX ═══════════ -->
    <section class="lp-parallax reveal">
      <q-parallax :src="PARALLAX_IMG" :height="340" :speed="0.5">
        <div class="lp-parallax__content">
          <q-badge color="primary" label="✦ Parallax" />
          <h2 class="lp-parallax__title">Scroll, and the world moves slower</h2>
          <p class="lp-parallax__sub">
            A <code>&lt;q-parallax&gt;</code> keeps the image drifting behind your
            content — instant depth on every scroll.
          </p>
        </div>
      </q-parallax>
    </section>

    <!-- ═══════════ GALLERY ═══════════ -->
    <section id="gallery" class="lp-section">
      <q-container>
        <div class="lp-head reveal">
          <q-badge outline color="warning" label="Gallery" />
          <h2 class="lp-title">Pick your favorites</h2>
          <p class="lp-sub">
            A <code>&lt;q-gallery&gt;</code> with labels and multi-select — click to
            toggle, hover to preview.
          </p>
        </div>

        <q-gallery
          v-model="gallerySel"
          :images="GALLERY"
          labels
          multiple
          :max-selected="4"
          :cols="3"
          hover
          class="lp-gallery reveal"
        />
        <p class="lp-gallery__meta reveal">{{ gallerySel.length }} selected (max 4)</p>
      </q-container>
    </section>

    <!-- ═══════════ INSTALL ═══════════ -->
    <section id="install" class="lp-section">
      <q-container>
        <div class="lp-head reveal">
          <q-badge outline color="positive" label="Quick start" />
          <h2 class="lp-title">Up and running in a minute</h2>
        </div>

        <div class="steps">
          <div class="step reveal">
            <span class="step-n">1</span>
            <h3 class="step-title">Install</h3>
            <q-syntax :code="installCode" lang="bash" filename="terminal" copy />
          </div>
          <div class="step reveal">
            <span class="step-n">2</span>
            <h3 class="step-title">Register the module</h3>
            <q-syntax :code="nuxtCode" lang="ts" filename="nuxt.config.ts" copy />
          </div>
          <div class="step reveal">
            <span class="step-n">3</span>
            <h3 class="step-title">Use any component</h3>
            <q-syntax :code="usageCode" lang="vue" filename="App.vue" copy />
          </div>
        </div>
      </q-container>
    </section>

    <!-- ═══════════ CTA ═══════════ -->
    <section id="cta" class="lp-section lp-cta">
      <q-container>
        <div class="cta-card reveal">
          <span class="cta-orb cta-orb--1" aria-hidden="true" />
          <span class="cta-orb cta-orb--2" aria-hidden="true" />
          <q-icon name="lucide:sparkles" color="primary" size="38px" />
          <h2 class="cta-title">Ready to build your UI?</h2>
          <p class="cta-text">
            {{ componentCount }} components, one API, zero friction — on the web, in
            Nuxt, or inside a Capacitor mobile app. Explore the docs and ship
            something beautiful.
          </p>
          <div class="cta-actions">
            <q-btn size="lg" color="primary" unelevated no-caps icon="lucide:book-open" label="Read the documentation" href="/docs" />
            <q-btn size="lg" flat no-caps color="primary" icon="lucide:github" label="GitHub" />
          </div>
        </div>
      </q-container>
    </section>
  </div>
</template>

<style scoped>
/* ═══════════ Tokens (dark overrides dans assets/css/main.css) ═══════════ */
.landing {
  --lp-bg: #fff;
  --lp-bg-alt: #f5f7fa;
  --lp-surface: #fff;
  --lp-border: rgb(0 0 0 / 0.08);
  --lp-border-strong: rgb(0 0 0 / 0.14);
  --lp-text: #101623;
  --lp-muted: #5b6472;
  background: var(--lp-bg);
  color: var(--lp-text);
}

/* ═══════════ Hero ═══════════ */
.hero {
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse 90% 60% at 50% -10%, #17345f 0%, #0b1526 55%, #070b13 100%);
  color: #fff;
  padding: 150px 0 120px;
}
.hero-aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.5;
  animation: aurora-float 16s ease-in-out infinite alternate;
}
.aurora--1 {
  width: 520px;
  height: 520px;
  background: #1976d2;
  top: -180px;
  left: -80px;
}
.aurora--2 {
  width: 460px;
  height: 460px;
  background: #7c3aed;
  top: -120px;
  right: -60px;
  animation-delay: -5s;
}
.aurora--3 {
  width: 380px;
  height: 380px;
  background: #0e7490;
  bottom: -200px;
  left: 35%;
  animation-delay: -9s;
}
@keyframes aurora-float {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(40px, 30px) scale(1.12); }
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(ellipse 75% 65% at 50% 10%, #000 30%, transparent 100%);
}
.hero-inner {
  position: relative;
  display: grid;
  grid-template-columns: 1.06fr 0.94fr;
  gap: 56px;
  align-items: center;
}
.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}
.hero-badge {
  margin-bottom: 28px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  font-weight: 600;
  font-size: 12.5px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
}
.hero-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6);
  animation: dot-pulse 2s ease-out infinite;
}
@keyframes dot-pulse {
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}
.hero-title {
  margin: 0;
  font-size: clamp(38px, 6.5vw, 68px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.025em;
}
.grad {
  background: linear-gradient(90deg, #4fc3f7, #7e9bff, #b39ddb);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: grad-shift 7s ease-in-out infinite alternate;
}
.grad--alt {
  animation-delay: -3.5s;
}
@keyframes grad-shift {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}
.hero-sub {
  margin: 18px 0 0;
  max-width: 560px;
  font-size: 17px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
}
.hero-sub code {
  background: rgba(255, 255, 255, 0.12);
  padding: 1px 7px;
  border-radius: 6px;
  font-size: 0.9em;
  color: #dbe7ff;
}
.hero-actions {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.btn-glow {
  box-shadow: 0 8px 30px rgba(25, 118, 210, 0.45);
}
.hero-stats {
  margin-top: 44px;
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.hero-stat-n {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.hero-stat-l {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.6);
}
.hero-stat-sep {
  width: 1px;
  height: 34px;
  background: rgba(255, 255, 255, 0.15);
}
.hero-scroll {
  display: flex;
  margin: 48px auto 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}
.hero-scroll:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(2px);
}

/* — Mockup iPhone dans le hero — */
.hero-phone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-phone__glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 560px;
  height: 700px;
  background: radial-gradient(ellipse at center, rgb(25 118 210 / 0.4) 0%, rgb(124 58 237 / 0.16) 45%, transparent 72%);
  filter: blur(46px);
  z-index: 0;
}
.hero-phone__device {
  position: relative;
  z-index: 1;
  width: 340px;
  padding: 8px;
  border-radius: 68px;
  background: linear-gradient(150deg, #565d67 0%, #23272e 38%, #0b0d11 100%);
  box-shadow:
    0 60px 110px rgb(2 8 23 / 0.55),
    0 24px 48px rgb(2 8 23 / 0.35),
    inset 0 2px 2px rgb(255 255 255 / 0.35),
    inset 0 -2px 3px rgb(0 0 0 / 0.7);
  animation: phone-float 6s ease-in-out infinite alternate;
}
.hero-phone__device::before {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 64px;
  border: 1px solid rgb(255 255 255 / 0.09);
  pointer-events: none;
}
.hero-phone__btn {
  position: absolute;
  width: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #3a4048, #0d0f13);
}
.hero-phone__btn--action { left: -4px; top: 110px; height: 26px; }
.hero-phone__btn--up { left: -4px; top: 152px; height: 46px; }
.hero-phone__btn--down { left: -4px; top: 210px; height: 46px; }
.hero-phone__btn--power { right: -4px; top: 180px; height: 68px; }
.hero-phone__screen {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 710px;
  border-radius: 60px;
  background: linear-gradient(180deg, #14171f 0%, #0b0f16 100%);
  overflow: hidden;
}
.hero-phone__screen::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(118deg, rgb(255 255 255 / 0.14) 0%, transparent 30%);
  pointer-events: none;
  z-index: 2;
}
.hero-phone__island {
  position: absolute;
  top: 13px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 104px;
  height: 29px;
  padding-right: 8px;
  border-radius: 999px;
  background: #05070a;
}
.hero-phone__cam {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #33456b, #0a0f18 65%);
}
.hero-phone__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 58px;
  padding: 20px 32px 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #fff;
  flex-shrink: 0;
}
.hero-phone__status-icons {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #fff;
}
.hero-phone__home {
  width: 112px;
  height: 5px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.9);
  margin: 6px auto 11px;
  flex-shrink: 0;
}
.hero-phone__floor {
  width: 270px;
  height: 28px;
  margin-top: 32px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgb(3 10 26 / 0.5) 0%, transparent 70%);
  filter: blur(12px);
}
@keyframes phone-float {
  from { transform: translateY(-8px); }
  to { transform: translateY(10px); }
}

/* — Écran TikTok (héros) — */
.tiktok {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.tiktok__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.tiktok__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0.55) 0%,
    transparent 26%,
    transparent 55%,
    rgb(0 0 0 / 0.78) 100%
  );
}
.tiktok__top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px 0;
  color: #fff;
}
.tiktok__tabs {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12.5px;
  font-weight: 700;
}
.tiktok__tab {
  color: rgb(255 255 255 / 0.65);
}
.tiktok__tab--on {
  color: #fff;
}
.tiktok__tab--on::after {
  content: "";
  display: block;
  width: 18px;
  height: 3px;
  margin: 3px auto 0;
  border-radius: 999px;
  background: #fff;
}
.tiktok__search {
  position: absolute;
  right: 16px;
  color: #fff;
}
.tiktok__rail {
  position: absolute;
  right: 8px;
  bottom: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: #fff;
}
.tiktok__rail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.tiktok__rail-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgb(255 255 255 / 0.18);
  backdrop-filter: blur(4px);
}
.tiktok__rail-n {
  font-size: 9px;
  font-weight: 700;
}
.tiktok__rail-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(145deg, #1976d2, #7c3aed);
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 0 0 2px #fff;
}
.tiktok__bottom {
  position: absolute;
  left: 14px;
  right: 58px;
  bottom: 12px;
  color: #fff;
  z-index: 1;
}
.tiktok__handle {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
}
.tiktok__desc {
  margin: 3px 0 0;
  font-size: 10.5px;
  line-height: 1.45;
  color: rgb(255 255 255 / 0.92);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}
.tiktok__song {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 7px 0 0;
  font-size: 10px;
  font-weight: 600;
  color: rgb(255 255 255 / 0.85);
}
.tiktok__disc {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  color: #101623;
  animation: tiktok-spin 3s linear infinite;
}
@keyframes tiktok-spin {
  to { transform: rotate(360deg); }
}

/* ═══════════ Code band ═══════════ */
.band {
  background: transparent;
  margin-top: -64px;
  position: relative;
  z-index: 2;
  padding-bottom: 8px;
}
.code-card {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
  border-radius: 14px;
  box-shadow: 0 24px 70px rgba(3, 10, 24, 0.5);
}
.code-glow {
  position: absolute;
  inset: -2px;
  border-radius: 16px;
  background: linear-gradient(90deg, #1976d2, #7c3aed, #06b6d4, #1976d2);
  background-size: 300% 100%;
  opacity: 0.35;
  filter: blur(14px);
  z-index: -1;
  animation: grad-shift 8s linear infinite;
}
.code-card :deep(.q-syntax) {
  border-radius: 14px;
  overflow: hidden;
}

/* ═══════════ Sections ═══════════ */
.lp-section {
  padding: 88px 0;
  background: var(--lp-bg);
}
.lp-head {
  text-align: center;
  max-width: 620px;
  margin: 0 auto 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.lp-title {
  margin: 0;
  font-size: clamp(26px, 4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--lp-text);
}
.lp-sub {
  margin: 0;
  color: var(--lp-muted);
  font-size: 15.5px;
  line-height: 1.6;
}

/* ═══════════ Bento ═══════════ */
.bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 18px;
}
.bento-card {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border: 1px solid var(--lp-border);
  border-radius: 18px;
  background: var(--lp-surface);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
.bento-card:hover {
  transform: translateY(-3px);
  border-color: rgb(25 118 210 / 0.35);
  box-shadow: 0 14px 40px rgb(25 118 210 / 0.12);
}
.bento-card--wide {
  grid-column: span 4;
}
.bento-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bento-title {
  margin: 0;
  font-size: 16.5px;
  font-weight: 700;
  color: var(--lp-text);
}
.bento-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--lp-muted);
}
.bento-demo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 8px;
}
.bento-caption {
  margin-top: 10px;
  font-size: 12.5px;
  color: var(--lp-muted);
}

/* ═══════════ Parallax ═══════════ */
.lp-parallax {
  position: relative;
}
.lp-parallax__content {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  color: #fff;
  pointer-events: none;
}
.lp-parallax__title {
  margin: 0;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 20px rgb(0 0 0 / 0.4);
}
.lp-parallax__sub {
  margin: 0;
  max-width: 540px;
  font-size: 15px;
  line-height: 1.65;
  color: rgb(255 255 255 / 0.85);
  text-shadow: 0 1px 10px rgb(0 0 0 / 0.4);
}
.lp-parallax__sub code {
  background: rgb(255 255 255 / 0.18);
  color: #fff;
  padding: 1px 6px;
  border-radius: 5px;
  font-size: 0.9em;
}

/* ═══════════ Gallery ═══════════ */
.lp-gallery {
  max-width: 860px;
  margin: 0 auto;
}
.lp-gallery__meta {
  margin: 14px 0 0;
  text-align: center;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--lp-muted);
}
.theme-demo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0 2px;
}

/* — Simulateur iPhone — */
.iphone {
  position: relative;
  width: 186px;
  margin: 12px auto 6px;
  padding: 9px;
  border-radius: 42px;
  background: linear-gradient(150deg, #3c4149 0%, #171a1f 42%, #0a0c0f 100%);
  box-shadow:
    0 20px 44px rgb(5 10 20 / 0.35),
    inset 0 1px 1px rgb(255 255 255 / 0.28),
    inset 0 -1px 2px rgb(0 0 0 / 0.65);
}
.iphone__btn {
  position: absolute;
  width: 3.5px;
  border-radius: 2px;
  background: linear-gradient(90deg, #2c3037, #101317);
}
.iphone__btn--action { left: -3px; top: 52px; height: 16px; }
.iphone__btn--v1 { left: -3px; top: 78px; height: 26px; }
.iphone__btn--v2 { left: -3px; top: 110px; height: 40px; }
.iphone__btn--power { right: -3px; top: 94px; height: 48px; }

.iphone__screen {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 366px;
  border-radius: 33px;
  background: linear-gradient(180deg, #fdfdfe 0%, #f2f4f8 100%);
  overflow: hidden;
}
.iphone__screen::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, rgb(255 255 255 / 0.3) 0%, transparent 32%);
  pointer-events: none;
}

.iphone__island {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 62px;
  height: 17px;
  padding-right: 5px;
  border-radius: 999px;
  background: #05070a;
}
.iphone__cam {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #2b3a55, #0a0f18 65%);
}

.iphone__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 14px 20px 0;
  font-size: 11px;
  font-weight: 700;
  color: #0b0f16;
}
.iphone__status-icons {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.iphone__app {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 16px 16px 6px;
}
.iphone__caption {
  font-size: 8.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #8b93a1;
}
.iphone__art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 18px;
  background: linear-gradient(145deg, #1976d2, #7c3aed);
  color: #fff;
  box-shadow: 0 12px 26px rgb(25 118 210 / 0.38);
}
.iphone__eq {
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 10px;
}
.iphone__eq i {
  width: 2.5px;
  border-radius: 1px;
  background: #fff;
  transform-origin: bottom;
  animation: eq-bounce 1s ease-in-out infinite;
}
.iphone__eq i:nth-child(1) { height: 6px; }
.iphone__eq i:nth-child(2) { height: 10px; animation-delay: 0.2s; }
.iphone__eq i:nth-child(3) { height: 4px; animation-delay: 0.4s; }
@keyframes eq-bounce {
  0%, 100% { transform: scaleY(0.45); }
  50% { transform: scaleY(1); }
}
.iphone__track {
  margin-top: 4px;
  font-size: 12.5px;
  font-weight: 800;
  color: #101623;
}
.iphone__artist {
  font-size: 9.5px;
  color: #8b93a1;
}
.iphone__progress {
  width: 100%;
  height: 4px;
  margin-top: 6px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.09);
  overflow: hidden;
}
.iphone__progress-fill {
  display: block;
  width: 62%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #1976d2, #7c3aed);
}
.iphone__times {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 8px;
  font-weight: 600;
  color: #8b93a1;
}
.iphone__controls {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-top: 6px;
  color: #101623;
}
.iphone__play {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #101623;
  color: #fff;
  box-shadow: 0 8px 18px rgb(0 0 0 / 0.28);
}

.iphone__tabbar {
  display: flex;
  justify-content: space-around;
  padding: 8px 26px 5px;
  border-top: 1px solid rgb(0 0 0 / 0.06);
  color: #9aa4b2;
}
.iphone__tab--active {
  color: var(--primary);
}
.iphone__home {
  width: 68px;
  height: 4px;
  border-radius: 999px;
  background: #101623;
  margin: 2px auto 7px;
}

/* — icons grid — */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: auto;
}
.icon-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 10px;
  border: 1px solid var(--lp-border);
  color: var(--lp-text);
  cursor: default;
  transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.icon-cell:hover {
  background: rgb(25 118 210 / 0.1);
  color: var(--primary);
  transform: scale(1.06);
}

/* ═══════════ Steps ═══════════ */
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.step {
  position: relative;
  border: 1px solid var(--lp-border);
  border-radius: 18px;
  background: var(--lp-surface);
  padding: 26px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.step-n {
  position: absolute;
  top: -16px;
  left: 22px;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  color: #fff;
  background: linear-gradient(135deg, #1976d2, #7c3aed);
  box-shadow: 0 6px 18px rgb(25 118 210 / 0.35);
}
.step-title {
  margin: 8px 0 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--lp-text);
}
.step :deep(.q-syntax) {
  margin-top: auto;
  border-radius: 10px;
  font-size: 12.5px;
}

/* ═══════════ CTA ═══════════ */
.lp-cta {
  padding-top: 20px;
}
.cta-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(25 118 210 / 0.16);
  border-radius: 24px;
  padding: 64px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background:
    radial-gradient(ellipse 70% 120% at 50% -20%, rgb(25 118 210 / 0.14), transparent 70%),
    linear-gradient(135deg, #eef4ff, #f6f1ff);
}
.cta-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}
.cta-orb--1 {
  width: 260px;
  height: 260px;
  background: #7cb8f7;
  top: -120px;
  left: -60px;
}
.cta-orb--2 {
  width: 260px;
  height: 260px;
  background: #c4b5fd;
  bottom: -140px;
  right: -60px;
}
.cta-title {
  margin: 8px 0 0;
  position: relative;
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--lp-text);
}
.cta-text {
  position: relative;
  margin: 0 auto;
  max-width: 520px;
  color: var(--lp-muted);
  font-size: 15.5px;
  line-height: 1.6;
}
.cta-actions {
  position: relative;
  margin-top: 24px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

/* ═══════════ Reveal ═══════════ */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .aurora,
  .grad,
  .hero-dot,
  .code-glow,
  .iphone__eq i,
  .hero-phone__device,
  .tiktok__disc {
    animation: none;
  }
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* ═══════════ Responsive ═══════════ */
@media (max-width: 960px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 44px;
    text-align: center;
  }
  .hero-copy {
    align-items: center;
    text-align: center;
  }
  .hero-sub {
    margin: 18px auto 0;
    text-align: center;
  }
  .hero-actions {
    justify-content: center;
  }
  .hero-stats {
    justify-content: center;
  }
  .bento-card,
  .bento-card--wide {
    grid-column: span 6;
  }
  .steps {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
@media (max-width: 640px) {
  .hero {
    padding: 120px 0 96px;
  }
  .hero-stats {
    gap: 22px;
  }
  .hero-stat-sep {
    display: none;
  }
  .hero-phone__device {
    width: 300px;
    padding: 7px;
  }
  .hero-phone__screen {
    height: 626px;
  }
  .hero-phone__floor {
    width: 230px;
  }
}
</style>
