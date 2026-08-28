<script setup lang="ts">
// Dnax UI — home page (landing): dogfooding the library's own components.
import { ref } from "vue"
import { menuItems } from "~/data/menu"

const componentCount = menuItems.flatMap((g) => g.items).length

// — Demo tabs —
const tab = ref<"buttons" | "forms" | "feedback" | "accordion">("buttons")

// — Smooth scroll to an anchor (fixed header) —
const scrollTo = (sel: string) => {
  const el = document.querySelector<HTMLElement>(sel)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" })
}

// — Form demo —
const email = ref("")
const password = ref("")
const plan = ref("pro")
const accepted = ref(true)
const newsletter = ref(false)
const volume = ref(60)

const plans = [
  { label: "Discovery", value: "free" },
  { label: "Pro", value: "pro" },
  { label: "Enterprise", value: "team" },
]

// — Feedback demo —
const rating = ref(4)
const progress = ref(0.72)

// — Accordion demo —
const accordionOpen = ref("intro")

// — Loading button demo —
const loadingDemo = ref(false)
const simulate = () => {
  loadingDemo.value = true
  setTimeout(() => (loadingDemo.value = false), 1800)
}

// — Exemple mis en avant dans la bande de code (rendu par <q-syntax>) —
const heroCode = `import { QBtn } from "@dnax/ui"

<q-btn flat dense rounded no-caps
  color="primary"
  icon="lucide:download"
  label="Export"
/>`
</script>

<template>
  <!-- ═══════════ Hero ═══════════ -->
  <section class="hero">
        <div class="hero-grid" aria-hidden="true" />
        <q-container class="hero-inner">
          <q-badge outline color="white" :label="`✦ Vue 3 design system · ${componentCount} components`" class="hero-badge" />
          <h1 class="hero-title">
            Simple <span class="hero-grad">syntax</span>,<br />
            total <span class="hero-grad hero-grad--alt">control</span>.
          </h1>
          <p class="hero-sub">
            Dnax UI — modern Vue 3 components, mobile-ready: simple, expressive syntax
            (<code>&lt;q-btn flat dense&gt;</code>), CSS-token theming, Iconify icons,
            built-in iOS safe-areas and dark mode.
          </p>
          <div class="hero-actions">
            <q-btn
              size="lg"
              color="primary"
              unelevated
              no-caps
              icon="lucide:rocket"
              label="Get started"
              @click="scrollTo('#cta')"
            />
            <q-btn
              size="lg"
              outline
              color="white"
              no-caps
              icon="lucide:component"
              label="Browse components"
              href="/docs"
            />
          </div>

          <!-- Stats -->
          <div class="hero-stats">
            <div v-for="s in [{ n: String(componentCount), l: 'components' }, { n: '40+', l: 'icons included' }, { n: '0', l: 'UI dependency' }]" :key="s.l" class="hero-stat">
              <span class="hero-stat-n">{{ s.n }}</span>
              <span class="hero-stat-l">{{ s.l }}</span>
            </div>
          </div>
        </q-container>
      </section>

      <!-- ═══════════ Code band ═══════════ -->
      <section class="band">
        <q-container>
          <div class="code-band">
            <q-syntax :code="heroCode" lang="vue" filename="example.vue" copy />
          </div>
        </q-container>
      </section>

      <!-- ═══════════ Features ═══════════ -->
      <section id="features" class="section">
        <q-container>
          <div class="section-head">
            <q-badge outline color="secondary" label="Why Dnax UI?" />
            <h2 class="section-title">One library,<br />every use case</h2>
          </div>

          <div class="features-grid">
            <q-card v-for="f in [
              { icon: 'lucide:wand-sparkles', title: 'Simple syntax', text: 'Boolean modifiers, v-model, slots: a concise, readable and predictable API.' },
              { icon: 'lucide:layers', title: 'Solid foundations', text: 'Style variants, class merging, accessible primitives (dialog, tooltip, tabs…): proven building blocks.' },
              { icon: 'lucide:palette', title: 'CSS-token theming', text: 'HSL variables + <q-config-provider> to override colors and per-component props.' },
              { icon: 'lucide:smartphone', title: 'Mobile-first & safe-area', text: 'Headers, sheets, FABs: iOS insets built in, Capacitor-ready.' },
            ]" :key="f.title" class="feature-card" bordered radius="lg">
              <q-icon :name="f.icon" color="primary" size="28px" class="feature-icon" />
              <h3 class="feature-title">{{ f.title }}</h3>
              <p class="feature-text">{{ f.text }}</p>
            </q-card>
          </div>
        </q-container>
      </section>

      <!-- ═══════════ Interactive showcase ═══════════ -->
      <section id="composants" class="section section--alt">
        <q-container>
          <div class="section-head">
            <q-badge outline color="accent" label="Live demo" />
            <h2 class="section-title">Components, in action</h2>
          </div>

          <q-card class="showcase" bordered radius="lg">
            <q-tabs v-model="tab" no-caps align="left" active-color="primary" indicator-color="primary" inline-label>
              <q-tab name="buttons" icon="lucide:mouse-pointer-click" label="Buttons" />
              <q-tab name="forms" icon="lucide:keyboard" label="Forms" />
              <q-tab name="feedback" icon="lucide:star" label="Feedback" />
              <q-tab name="accordion" icon="lucide:chevrons-down-up" label="Accordion" />
            </q-tabs>
            <q-separator />

            <!-- Buttons -->
            <div v-if="tab === 'buttons'" class="demo">
              <div class="demo-row">
                <q-btn unelevated no-caps color="primary" label="Primary" />
                <q-btn unelevated no-caps color="secondary" label="Secondary" />
                <q-btn unelevated no-caps color="negative" label="Negative" />
              </div>
              <div class="demo-row">
                <q-btn flat no-caps color="primary" label="Flat" />
                <q-btn outline no-caps color="primary" label="Outline" />
                <q-btn flat no-caps rounded color="primary" icon="lucide:download" label="Rounded" />
              </div>
              <div class="demo-row">
                <q-btn round color="primary" unelevated icon="lucide:plus" aria-label="Add" />
                <q-btn round outline color="secondary" icon="lucide:heart" aria-label="Favorite" />
                <q-btn
                  :loading="loadingDemo"
                  color="primary"
                  unelevated
                  no-caps
                  icon="lucide:refresh-cw"
                  label="Load"
                  @click="simulate"
                />
              </div>
            </div>

            <!-- Forms -->
            <div v-else-if="tab === 'forms'" class="demo demo--form">
              <div class="demo-col">
                <q-input v-model="email" type="email" label="Email" outlined clearable placeholder="you@example.com" />
                <q-input-password v-model="password" label="Password" outlined />
                <q-select v-model="plan" :options="plans" option-label="label" option-value="value" label="Plan" outlined />
              </div>
              <div class="demo-col">
                <q-checkbox v-model="accepted" label="I accept the terms" color="primary" />
                <q-radio v-model="newsletter" :val="true" label="Receive the newsletter" color="secondary" />
                <div class="slider-wrap">
                  <span class="slider-label">Volume · {{ volume }}%</span>
                  <q-slider v-model="volume" :min="0" :max="100" label color="primary" markers />
                </div>
              </div>
            </div>

            <!-- Feedback -->
            <div v-else-if="tab === 'feedback'" class="demo">
              <div class="demo-row">
                <q-rating v-model="rating" :max="5" color="warning" size="lg" />
                <q-circular-progress :value="progress" size="72px" :thickness="8" color="positive" show-value />
                <q-linear-progress :value="progress" color="primary" size="10px" rounded class="progress-bar" />
              </div>
              <div class="demo-row">
                <q-badge color="primary" label="Primary" />
                <q-badge color="positive" label="Success" />
                <q-badge color="warning" label="Warning" />
                <q-badge outline color="negative" label="Outline" />
                <q-chip icon="lucide:zap" label="Chip" color="secondary" outline removable />
                <q-chip icon="lucide:tag" label="Tag" color="primary" />
              </div>
            </div>

            <!-- Accordion -->
            <div v-else class="demo">
              <q-accordion v-model="accordionOpen" type="single" collapsible class="demo-accordion">
                <q-accordion-item value="intro">
                  <q-accordion-trigger>Installation</q-accordion-trigger>
                  <q-accordion-content>
                    <p class="demo-p"><code>npm i @dnax/ui</code> then add <code>"@dnax/ui"</code> to the modules of your nuxt.config.</p>
                  </q-accordion-content>
                </q-accordion-item>
                <q-accordion-item value="theme">
                  <q-accordion-trigger>Theming</q-accordion-trigger>
                  <q-accordion-content>
                    <p class="demo-p">Override colors and default props with <code>&lt;q-config-provider :theme="…"&gt;</code>.</p>
                  </q-accordion-content>
                </q-accordion-item>
                <q-accordion-item value="icons">
                  <q-accordion-trigger>Icons</q-accordion-trigger>
                  <q-accordion-content>
                    <p class="demo-p">All icons go through Iconify: <code>icon="lucide:star"</code>.</p>
                  </q-accordion-content>
                </q-accordion-item>
              </q-accordion>
            </div>
          </q-card>
        </q-container>
      </section>

      <!-- ═══════════ CTA ═══════════ -->
      <section id="cta" class="cta">
        <q-container>
          <div class="cta-card">
            <q-icon name="lucide:sparkles" color="primary" size="36px" />
            <h2 class="cta-title">Ready to build your UI?</h2>
            <p class="cta-text">{{ componentCount }} components, one API, zero friction. Explore the docs and get started.</p>
            <div class="cta-actions">
              <q-btn size="lg" color="primary" unelevated no-caps icon="lucide:book-open" label="Read the documentation" href="/docs" />
              <q-btn size="lg" flat no-caps color="primary" icon="lucide:github" label="GitHub" />
            </div>
          </div>
        </q-container>
      </section>
</template>

<style scoped>
/* — Hero — */
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #0b1e33 0%, #123c6b 55%, #1d3f8f 100%);
  color: #fff;
  padding: 96px 0 72px;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, #000 40%, transparent 100%);
}
.hero-inner {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-badge {
  margin-bottom: 24px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 12px;
}
.hero-title {
  margin: 0;
  font-size: clamp(34px, 6vw, 62px);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.hero-grad {
  background: linear-gradient(90deg, #4fc3f7, #7e9bff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-grad--alt {
  background: linear-gradient(90deg, #7e9bff, #b39ddb);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-sub {
  margin: 20px auto 0;
  max-width: 640px;
  font-size: 17px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
}
.hero-sub code,
.demo-p code {
  background: rgba(127, 127, 127, 0.18);
  padding: 1px 6px;
  border-radius: 5px;
  font-size: 0.92em;
}
.hero-actions {
  margin-top: 32px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}
.hero-stats {
  margin-top: 56px;
  display: flex;
  gap: 48px;
  justify-content: center;
  flex-wrap: wrap;
}
.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.hero-stat-n {
  font-size: 30px;
  font-weight: 800;
  color: #fff;
}
.hero-stat-l {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* — Code band — */
.band {
  background: #0d1117;
  padding: 0;
}
.code-band {
  transform: translateY(-32px);
  border-radius: 12px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
}

/* — Sections — */
.section {
  padding: 64px 0;
  background: #fff;
}
.section--alt {
  background: #f4f6f9;
}
.section-head {
  text-align: center;
  margin-bottom: 40px;
}
.section-title {
  margin: 14px 0 0;
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}

/* — Features — */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}
.feature-card {
  padding: 28px 24px;
}
.feature-icon {
  margin-bottom: 14px;
}
.feature-title {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 700;
  color: var(--foreground);
}
.feature-text {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.6;
  color: #5b6472;
}

/* — Showcase — */
.showcase {
  overflow: hidden;
}
.demo {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.demo--form {
  flex-direction: row;
  gap: 32px;
  flex-wrap: wrap;
}
.demo-col {
  flex: 1 1 260px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.demo-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
.progress-bar {
  min-width: 180px;
  flex: 1 1 180px;
}
.slider-wrap {
  padding: 6px 2px;
}
.slider-label {
  font-size: 13px;
  color: #5b6472;
  margin-bottom: 6px;
  display: block;
}
.demo-accordion {
  max-width: 560px;
  margin: 0 auto;
}
.demo-p {
  margin: 0;
  font-size: 14.5px;
  color: #5b6472;
  line-height: 1.6;
}

/* — CTA — */
.cta {
  padding: 64px 0 80px;
  background: #fff;
}
.cta-card {
  background: linear-gradient(135deg, #eef4ff, #f6f1ff);
  border: 1px solid rgba(25, 118, 210, 0.14);
  border-radius: 20px;
  padding: 56px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.cta-title {
  margin: 10px 0 0;
  font-size: clamp(24px, 3.5vw, 34px);
  font-weight: 800;
  color: var(--foreground);
}
.cta-text {
  margin: 0 auto;
  max-width: 520px;
  color: #5b6472;
  font-size: 15.5px;
  line-height: 1.6;
}
.cta-actions {
  margin-top: 22px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 640px) {
  .hero { padding: 72px 0 56px; }
  .hero-stats { gap: 28px; }
}
</style>
