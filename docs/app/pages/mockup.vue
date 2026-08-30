<script setup lang="ts">
// Mobile Mockup — chaque composant Dnax UI présenté dans un vrai cadre iPhone (design iOS).
import { computed, ref } from "vue"

const screens = [
  { id: "home", label: "Home", icon: "lucide:house" },
  { id: "buttons", label: "Buttons", icon: "lucide:mouse-pointer-click" },
  { id: "forms", label: "Forms", icon: "lucide:keyboard" },
  { id: "list", label: "Swipe list", icon: "lucide:list" },
  { id: "gallery", label: "Gallery", icon: "lucide:images" },
  { id: "uploader", label: "Uploader", icon: "lucide:upload" },
  { id: "feedback", label: "Feedback", icon: "lucide:star" },
  { id: "accordion", label: "Accordion", icon: "lucide:chevrons-down-up" },
  { id: "tabs", label: "Tabs", icon: "lucide:panels-top-left" },
  { id: "sheets", label: "Sheets", icon: "lucide:panel-bottom" },
  { id: "avatar", label: "Avatars", icon: "lucide:user-round" },
  { id: "skeleton", label: "Skeleton", icon: "lucide:scan-line" },
  { id: "marquee", label: "Marquee", icon: "lucide:move-horizontal" },
  { id: "rolling", label: "Rolling text", icon: "lucide:list-numbers" },
  { id: "countdown", label: "Count down", icon: "lucide:timer" },
  { id: "swiper", label: "Swiper", icon: "lucide:gallery-horizontal" },
  { id: "chat", label: "Chat", icon: "lucide:message-square" },
]

const active = ref("home")
const activeScreen = computed(() => screens.find((s) => s.id === active.value))

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=600&auto=format&fit=crop`

const GALLERY = [
  { src: IMG("photo-1786057425168-1f326d4f47b1"), label: "Alpine sunrise", description: "Golden light over the peaks" },
  { src: IMG("photo-1783628376510-0de24d5b18a5"), label: "Coastal cliffs", description: "Wild ocean views" },
  { src: IMG("photo-1567095761054-7a02e69e5c43"), label: "Forest trail", description: "Morning mist between the pines" },
  { src: IMG("photo-1497366754035-f200968a6e72"), label: "Loft office", description: "Brick, steel & light" },
  { src: IMG("photo-1500530855697-b586d89ba3ee"), label: "Lake house", description: "Still water at dusk" },
  { src: IMG("photo-1470071459604-3b5ec3a7fe05"), label: "Misty hills", description: "Fog rolling in" },
]

const PRESET = [
  { url: GALLERY[0]!.src, name: "Peaks.jpg", size: 128_000 },
  { url: GALLERY[1]!.src, name: "Coast.jpg", size: 210_000 },
  { url: GALLERY[2]!.src, name: "Forest.jpg", size: 96_000 },
]

const CONTACTS = [
  { name: "Alice Martin", role: "Product designer", emoji: "🎨" },
  { name: "Bruno Lefèvre", role: "Backend engineer", emoji: "⚙️" },
  { name: "Chloé Dubois", role: "Frontend engineer", emoji: "🧑‍💻" },
  { name: "David Chen", role: "Data analyst", emoji: "📊" },
]

const FEED = [
  { img: GALLERY[0]!.src, title: "Alpine sunrise", text: "Golden light over the peaks — shot this morning." },
  { img: GALLERY[1]!.src, title: "Coastal cliffs", text: "Wild ocean views, no filter needed." },
  { img: GALLERY[2]!.src, title: "Forest trail", text: "Morning mist between the pines." },
]

// — Données des écrans bonus —
const NEWS =
  "Dnax UI — Vue 3 · Nuxt · Capacitor · 200k+ icons · dark mode & safe-areas included ✦"

const FEATURES = [
  { label: "Vue 3", icon: "lucide:zap" },
  { label: "Nuxt", icon: "lucide:rocket" },
  { label: "Capacitor", icon: "lucide:smartphone" },
  { label: "Dark mode", icon: "lucide:moon" },
  { label: "Safe areas", icon: "lucide:shield-check" },
]

const ROLLING_WORDS = ["Dnax UI", "Vue 3", "Nuxt", "Capacitor", "Ready!"]

const CHAT_MSGS = [
  { id: "1", text: "Hey! Did you see the new design system?", from: "them" },
  { id: "2", text: "Yes — the bubbles are so clean 🫧", from: "me" },
  { id: "3", text: "And the swipe cell works on Capacitor too.", from: "them" },
  { id: "4", text: "Perfect, let's ship it 🚀", from: "me" },
]

// — États par écran —
const email = ref("")
const password = ref("")
const plan = ref("pro")
const accepted = ref(true)
const newsletter = ref(false)
const volume = ref(60)
const plans = [
  { label: "Discovery", value: "free" },
  { label: "Pro", value: "pro" },
  { label: "Team", value: "team" },
]
const otp = ref("")
const rating = ref(4)
const progress = ref(0.72)
const loadingBtn = ref(false)
const simulate = () => {
  loadingBtn.value = true
  setTimeout(() => (loadingBtn.value = false), 1600)
}
const selected = ref<any[]>([])
const uploads = ref<any[]>(PRESET.map((p) => ({ ...p })))
const faq = ref("refund")
const tab = ref("chats")
const sheet = ref<null | "action" | "bottom" | "dialog">(null)
const lastAction = ref("—")
const actionOptions = [
  { label: "Share", icon: "lucide:share-2" },
  { label: "Copy link", icon: "lucide:link" },
  { label: "Save to device", icon: "lucide:download" },
]

const pickScreen = (id: string) => {
  active.value = id
  sheet.value = null
}
</script>

<template>
  <div class="mock">
    <!-- ═══════════ Bandeau ═══════════ -->
    <section class="mock-hero">
      <div class="mock-hero__inner">
        <q-badge outline color="white" class="mock-hero__badge">
          <q-icon name="lucide:smartphone" size="12px" />
          Mobile first · Capacitor ready
        </q-badge>
        <h1 class="mock-hero__title">
          Components, <span class="mock-hero__grad">on device</span>.
        </h1>
        <p class="mock-hero__sub">
          Every Dnax UI component rendered inside a true iOS frame — status bar,
          Dynamic Island and home indicator included. Pick a screen on the left,
          then play with the real components inside the phone.
        </p>
        <div class="mock-hero__actions">
          <q-btn unelevated no-caps color="primary" icon="lucide:book-open" label="Read the docs" href="/docs" />
          <q-btn flat no-caps color="white" icon="lucide:arrow-left" label="Back home" href="/" />
        </div>
      </div>
    </section>

    <!-- ═══════════ Studio ═══════════ -->
    <section class="mock-studio">
      <aside class="mock-nav">
        <p class="mock-nav__label">Screens</p>
        <button
          v-for="s in screens"
          :key="s.id"
          type="button"
          class="mock-nav__item"
          :class="{ 'mock-nav__item--active': active === s.id }"
          @click="pickScreen(s.id)"
        >
          <q-icon :name="s.icon" size="16px" />
          <span>{{ s.label }}</span>
        </button>
      </aside>

      <div class="mock-stage">
        <div class="mock-phone">
          <span class="mock-phone__btn mock-phone__btn--action" aria-hidden="true" />
          <span class="mock-phone__btn mock-phone__btn--v1" aria-hidden="true" />
          <span class="mock-phone__btn mock-phone__btn--v2" aria-hidden="true" />
          <span class="mock-phone__btn mock-phone__btn--power" aria-hidden="true" />

          <div class="mock-phone__screen">
            <div class="mock-phone__island" aria-hidden="true"><span class="mock-phone__cam" /></div>
            <div class="mock-phone__status" aria-hidden="true">
              <span class="mock-phone__time">9:41</span>
              <span class="mock-phone__icons">
                <q-icon name="lucide:signal" size="10px" />
                <q-icon name="lucide:wifi" size="10px" />
                <q-icon name="lucide:battery-full" size="13px" />
              </span>
            </div>

            <div class="mock-phone__content">
              <div class="mock-screen-tag">{{ activeScreen?.label }}</div>

              <!-- ═══ Home ═══ -->
              <div v-if="active === 'home'" class="mock-app">
                <div class="mock-app__bar">
                  <span class="mock-app__avatar">D</span>
                  <div class="mock-app__titles">
                    <b>Dnax Social</b>
                    <span>3 new posts</span>
                  </div>
                  <q-btn flat round dense icon="lucide:bell" aria-label="Notifications" />
                </div>
                <q-input dense rounded outlined placeholder="Search people &amp; posts" class="mock-search" />
                <article v-for="(post, i) in FEED" :key="i" class="mock-card">
                  <img :src="post.img" :alt="post.title" class="mock-card__img" loading="lazy" />
                  <div class="mock-card__body">
                    <b>{{ post.title }}</b>
                    <p>{{ post.text }}</p>
                    <div class="mock-card__actions">
                      <q-btn flat round dense color="negative" icon="lucide:heart" size="sm" aria-label="Like" />
                      <q-btn flat round dense color="primary" icon="lucide:message-circle" size="sm" aria-label="Comment" />
                      <q-btn flat round dense icon="lucide:share-2" size="sm" aria-label="Share" />
                    </div>
                  </div>
                </article>
                <q-btn round color="primary" unelevated icon="lucide:plus" class="mock-fab" aria-label="New post" />
              </div>

              <!-- ═══ Buttons ═══ -->
              <div v-else-if="active === 'buttons'" class="mock-screen-body">
                <p class="mock-sec">Solid</p>
                <div class="mock-btns">
                  <q-btn unelevated no-caps color="primary" label="Primary" />
                  <q-btn unelevated no-caps color="secondary" label="Secondary" />
                  <q-btn unelevated no-caps color="negative" label="Negative" />
                </div>
                <p class="mock-sec">Outline &amp; flat</p>
                <div class="mock-btns">
                  <q-btn outline no-caps color="primary" label="Outline" />
                  <q-btn flat no-caps color="primary" label="Flat" />
                  <q-btn flat rounded no-caps color="primary" icon="lucide:download" label="Rounded" />
                </div>
                <p class="mock-sec">Icon buttons</p>
                <div class="mock-btns">
                  <q-btn round color="primary" unelevated icon="lucide:plus" aria-label="Add" />
                  <q-btn round outline color="secondary" icon="lucide:heart" aria-label="Favorite" />
                  <q-btn round flat color="negative" icon="lucide:trash-2" aria-label="Delete" />
                  <q-btn round flat color="warning" icon="lucide:star" aria-label="Star" />
                </div>
                <p class="mock-sec">Sizes &amp; loading</p>
                <div class="mock-btns mock-btns--wrap">
                  <q-btn size="sm" unelevated no-caps color="primary" label="Small" />
                  <q-btn unelevated no-caps color="primary" label="Default" />
                  <q-btn size="lg" unelevated no-caps color="primary" label="Large" />
                  <q-btn
                    :loading="loadingBtn"
                    unelevated
                    no-caps
                    color="primary"
                    icon="lucide:refresh-cw"
                    label="Loading"
                    @click="simulate"
                  />
                </div>
              </div>

              <!-- ═══ Forms ═══ -->
              <div v-else-if="active === 'forms'" class="mock-screen-body mock-form">
                <q-input v-model="email" type="email" label="Email" outlined dense placeholder="you@example.com" />
                <q-input-password v-model="password" label="Password" outlined dense />
                <q-select
                  v-model="plan"
                  :options="plans"
                  option-label="label"
                  option-value="value"
                  emit-value
                  label="Plan"
                  outlined
                  dense
                />
                <q-checkbox v-model="accepted" label="I accept the terms" color="primary" dense />
                <q-radio v-model="newsletter" :val="true" label="Receive the newsletter" color="secondary" dense />
                <div class="mock-slider">
                  <span class="mock-slider__label">Volume · {{ volume }}%</span>
                  <q-slider v-model="volume" :min="0" :max="100" color="primary" markers />
                </div>
                <p class="mock-sec">One-time code</p>
                <q-input-otp v-model="otp" :length="4" numeric size="sm" />
                <q-btn unelevated no-caps color="primary" label="Create account" class="mock-submit" />
              </div>

              <!-- ═══ Swipe list ═══ -->
              <div v-else-if="active === 'list'" class="mock-app">
                <div class="mock-app__bar">
                  <span class="mock-app__avatar">M</span>
                  <div class="mock-app__titles">
                    <b>Messages</b>
                    <span>Swipe a row to reveal actions</span>
                  </div>
                </div>
                <div class="mock-list">
                  <q-swipe-cell v-for="(c, i) in CONTACTS" :key="i" :right-width="130" lock-on-open>
                    <div class="mock-cell">
                      <span class="mock-cell__emoji">{{ c.emoji }}</span>
                      <div class="mock-cell__info">
                        <b>{{ c.name }}</b>
                        <span>{{ c.role }}</span>
                      </div>
                    </div>
                    <template #right>
                      <button type="button" class="mock-action mock-action--fav">
                        <q-icon name="lucide:archive" size="14px" /> Archive
                      </button>
                      <button type="button" class="mock-action mock-action--del">
                        <q-icon name="lucide:trash-2" size="14px" /> Delete
                      </button>
                    </template>
                  </q-swipe-cell>
                </div>
                <p class="mock-hint">
                  <code>lock-on-open</code> keeps the actions open while you decide;
                  a click outside closes the cell.
                </p>
              </div>

              <!-- ═══ Gallery ═══ -->
              <div v-else-if="active === 'gallery'" class="mock-screen-body">
                <p class="mock-sec">Gallery · {{ selected.length }} selected</p>
                <q-gallery
                  v-model="selected"
                  :images="GALLERY"
                  labels
                  multiple
                  :max-selected="4"
                  :cols="2"
                  hover
                />
              </div>

              <!-- ═══ Uploader ═══ -->
              <div v-else-if="active === 'uploader'" class="mock-screen-body">
                <p class="mock-sec">Uploader</p>
                <q-uploader v-model="uploads" multiple label="Add photos" />
              </div>

              <!-- ═══ Feedback ═══ -->
              <div v-else-if="active === 'feedback'" class="mock-screen-body mock-feedback">
                <p class="mock-sec">Rating</p>
                <q-rating v-model="rating" :max="5" color="warning" size="lg" />
                <p class="mock-sec">Progress</p>
                <div class="mock-progress-row">
                  <q-circular-progress :value="progress" size="64px" :thickness="8" color="positive" show-value />
                  <q-linear-progress :value="progress" color="primary" size="10px" rounded class="mock-linear" />
                </div>
                <p class="mock-sec">Badges &amp; chips</p>
                <div class="mock-chips">
                  <q-badge color="primary" label="Primary" />
                  <q-badge color="positive" label="Success" />
                  <q-badge outline color="negative" label="Outline" />
                  <q-chip icon="lucide:zap" label="Chip" color="secondary" outline removable />
                </div>
              </div>

              <!-- ═══ Accordion ═══ -->
              <div v-else-if="active === 'accordion'" class="mock-screen-body">
                <p class="mock-sec">FAQ</p>
                <q-accordion v-model="faq" type="single" collapsible>
                  <q-accordion-item value="refund">
                    <q-accordion-trigger>How do refunds work?</q-accordion-trigger>
                    <q-accordion-content>
                      <p class="mock-p">Full refund within 30 days, no questions asked.</p>
                    </q-accordion-content>
                  </q-accordion-item>
                  <q-accordion-item value="sync">
                    <q-accordion-trigger>Is my data synced?</q-accordion-trigger>
                    <q-accordion-content>
                      <p class="mock-p">Everything syncs in real time across all your devices.</p>
                    </q-accordion-content>
                  </q-accordion-item>
                  <q-accordion-item value="offline">
                    <q-accordion-trigger>Does it work offline?</q-accordion-trigger>
                    <q-accordion-content>
                      <p class="mock-p">Yes — the app queues changes and uploads them when you reconnect.</p>
                    </q-accordion-content>
                  </q-accordion-item>
                </q-accordion>
              </div>

              <!-- ═══ Tabs ═══ -->
              <div v-else-if="active === 'tabs'" class="mock-app">
                <q-tabs v-model="tab" no-caps dense active-color="primary" indicator-color="primary" align="justify">
                  <q-tab name="chats" icon="lucide:message-circle" label="Chats" />
                  <q-tab name="calls" icon="lucide:phone" label="Calls" />
                  <q-tab name="settings" icon="lucide:settings" label="Settings" />
                </q-tabs>
                <div class="mock-tab-body">
                  <div v-if="tab === 'chats'" class="mock-tab-list">
                    <div v-for="(c, i) in CONTACTS" :key="i" class="mock-tab-row">
                      <span class="mock-tab-row__emoji">{{ c.emoji }}</span>
                      <span>{{ c.name }}</span>
                    </div>
                  </div>
                  <div v-else-if="tab === 'calls'" class="mock-tab-list">
                    <div v-for="(c, i) in CONTACTS.slice(0, 3)" :key="i" class="mock-tab-row">
                      <q-icon name="lucide:phone-call" size="14px" color="positive" />
                      <span>{{ c.name }}</span>
                    </div>
                  </div>
                  <div v-else class="mock-tab-list">
                    <div class="mock-tab-row"><q-icon name="lucide:bell" size="14px" /><span>Notifications</span></div>
                    <div class="mock-tab-row"><q-icon name="lucide:palette" size="14px" /><span>Appearance</span></div>
                    <div class="mock-tab-row"><q-icon name="lucide:shield-check" size="14px" /><span>Privacy</span></div>
                  </div>
                </div>
              </div>

              <!-- ═══ Sheets & dialogs ═══ -->
              <div v-else-if="active === 'sheets'" class="mock-screen-body mock-sheets">
                <p class="mock-sec">Sheets &amp; dialogs</p>
                <div class="mock-btns mock-btns--wrap">
                  <q-btn unelevated no-caps color="primary" icon="lucide:share-2" label="Action sheet" @click="sheet = 'action'" />
                  <q-btn outline no-caps color="primary" icon="lucide:panel-bottom" label="Bottom sheet" @click="sheet = 'bottom'" />
                  <q-btn flat no-caps color="negative" icon="lucide:alert-circle" label="Dialog" @click="sheet = 'dialog'" />
                </div>
                <p class="mock-hint">
                  Overlays rendered inside the frame — the real ones are also
                  available as <code>$q</code> plugins (bottom sheet, dialog, notify…).
                </p>
                <p class="mock-hint">Last action: <code>{{ lastAction }}</code></p>
              </div>

              <!-- ═══ Avatars ═══ -->
              <div v-else-if="active === 'avatar'" class="mock-screen-body">
                <p class="mock-sec">Sizes</p>
                <div class="mock-avatars">
                  <q-avatar size="sm" color="primary" alt="Alex" />
                  <q-avatar size="md" color="secondary" alt="Sam" />
                  <q-avatar size="lg" :src="GALLERY[0]!.src" alt="Lena" />
                  <q-avatar size="xl" :src="GALLERY[1]!.src" alt="Max" />
                </div>
                <p class="mock-sec">Icons &amp; colors</p>
                <div class="mock-avatars">
                  <q-avatar icon="lucide:user" color="primary" />
                  <q-avatar icon="lucide:rocket" color="secondary" />
                  <q-avatar icon="lucide:zap" color="warning" />
                  <q-avatar icon="lucide:star" color="positive" />
                  <q-avatar icon="lucide:heart" color="#7c3aed" />
                </div>
                <p class="mock-sec">Shapes</p>
                <div class="mock-avatars">
                  <q-avatar size="lg" :src="GALLERY[2]!.src" alt="Cam" />
                  <q-avatar size="lg" :src="GALLERY[2]!.src" alt="Cam" rounded />
                  <q-avatar size="lg" :src="GALLERY[2]!.src" alt="Cam" square />
                </div>
              </div>

              <!-- ═══ Skeleton ═══ -->
              <div v-else-if="active === 'skeleton'" class="mock-screen-body">
                <p class="mock-sec">Component shapes</p>
                <div class="mock-skel-grid">
                  <q-skeleton type="QBtn" />
                  <q-skeleton type="QAvatar" />
                  <q-skeleton type="QBadge" />
                  <q-skeleton type="QInput" />
                  <q-skeleton type="QCheckbox" />
                  <q-skeleton type="QSlider" />
                </div>
                <p class="mock-sec">Loading card</p>
                <div class="mock-skel-card">
                  <div class="mock-skel-row">
                    <q-skeleton type="QAvatar" />
                    <div class="mock-skel-lines">
                      <q-skeleton type="text" width="60%" />
                      <q-skeleton type="text" width="40%" />
                    </div>
                  </div>
                  <q-skeleton type="text" />
                  <q-skeleton type="text" width="85%" />
                  <div class="mock-skel-row mock-skel-row--end">
                    <q-skeleton type="QBtn" />
                    <q-skeleton type="QBtn" />
                  </div>
                </div>
              </div>

              <!-- ═══ Marquee ═══ -->
              <div v-else-if="active === 'marquee'" class="mock-screen-body">
                <p class="mock-sec">Marquee · news ticker</p>
                <q-marquee :text="NEWS" :duration="18" />
                <p class="mock-sec">Rich slot</p>
                <q-marquee :duration="14" :pause-on-hover="true">
                  <span v-for="f in FEATURES" :key="f.label" class="mock-marquee-chip">
                    <q-icon :name="f.icon" size="13px" /> {{ f.label }}
                  </span>
                </q-marquee>
                <p class="mock-hint">
                  <code>direction</code>, <code>duration</code>, <code>gap</code> and
                  <code>pause-on-hover</code> are all tunable.
                </p>
              </div>

              <!-- ═══ Rolling text ═══ -->
              <div v-else-if="active === 'rolling'" class="mock-screen-body">
                <p class="mock-sec">Counters</p>
                <div class="mock-rolling">
                  <q-rolling-text :start-num="0" :target-num="12345" :height="44" />
                  <q-rolling-text :start-num="0" :target-num="987" direction="up" :duration="1.5" :height="44" />
                </div>
                <p class="mock-sec">Word wheel</p>
                <q-rolling-text :text-list="ROLLING_WORDS" :duration="1" :height="36" />
              </div>

              <!-- ═══ Count down ═══ -->
              <div v-else-if="active === 'countdown'" class="mock-screen-body">
                <p class="mock-sec">Count down</p>
                <q-count-down :time="600" format="mm:ss" class="mock-time" />
                <p class="mock-sec">Flash sale</p>
                <div class="mock-flash">
                  <q-count-down :time="3661" format="HH:mm:ss" class="mock-time mock-time--white" />
                </div>
                <p class="mock-sec">With progress</p>
                <q-count-down :time="30" class="mock-time">
                  <template #default="{ formatted, progress }">
                    <div class="mock-countbar">
                      <div class="mock-countbar__fill" :style="{ width: progress * 100 + '%' }" />
                    </div>
                    <span>{{ formatted }}</span>
                  </template>
                </q-count-down>
              </div>

              <!-- ═══ Swiper ═══ -->
              <div v-else-if="active === 'swiper'" class="mock-screen-body">
                <p class="mock-sec">Swiper · drag to browse</p>
                <div class="mock-swiper-box">
                  <q-swiper :slides-per-view="1.1" :space-between="10" loop centered-slides>
                    <q-swiper-slide v-for="(img, i) in GALLERY" :key="i">
                      <div class="mock-swipe-slide">
                        <img :src="img.src" :alt="img.label" loading="lazy" />
                        <span>{{ img.label }}</span>
                      </div>
                    </q-swiper-slide>
                  </q-swiper>
                </div>
              </div>

              <!-- ═══ Chat ═══ -->
              <div v-else-if="active === 'chat'" class="mock-app">
                <div class="mock-app__bar">
                  <span class="mock-app__avatar">M</span>
                  <div class="mock-app__titles">
                    <b>Design system</b>
                    <span>4 people · online</span>
                  </div>
                </div>
                <q-message-scroller-provider auto-scroll default-scroll-position="end">
                  <q-message-scroller class="mock-chat">
                    <q-message-scroller-viewport>
                      <q-message-scroller-content>
                        <q-message-scroller-item
                          v-for="m in CHAT_MSGS"
                          :key="m.id"
                          :message-id="m.id"
                          animation-preset="slide-up"
                        >
                          <q-bubble
                            :align="m.from === 'me' ? 'end' : 'start'"
                            :variant="m.from === 'me' ? 'default' : 'secondary'"
                          >
                            <q-bubble-content>{{ m.text }}</q-bubble-content>
                          </q-bubble>
                        </q-message-scroller-item>
                      </q-message-scroller-content>
                    </q-message-scroller-viewport>
                  </q-message-scroller>
                </q-message-scroller-provider>
              </div>
            </div>

            <!-- overlay au niveau de l'écran (fixe pendant le scroll) -->
            <Transition name="mock-fade">
              <div v-if="sheet" class="mock-overlay" @click.self="sheet = null">
                <Transition name="mock-up" appear>
                  <div v-if="sheet === 'action'" class="mock-sheet-panel">
                    <p class="mock-sheet-title">Share to</p>
                    <button
                      v-for="o in actionOptions"
                      :key="o.label"
                      type="button"
                      class="mock-sheet-option"
                      @click="lastAction = o.label; sheet = null"
                    >
                      <q-icon :name="o.icon" size="16px" color="primary" />
                      <span>{{ o.label }}</span>
                    </button>
                    <button type="button" class="mock-sheet-cancel" @click="sheet = null">Dismiss</button>
                  </div>
                </Transition>
                <Transition name="mock-up" appear>
                  <div v-if="sheet === 'bottom'" class="mock-sheet-panel mock-sheet-panel--bottom">
                    <span class="mock-sheet-handle" />
                    <p class="mock-sheet-title">Settings</p>
                    <p class="mock-sheet-desc">Drag the handle down or tap the backdrop to close.</p>
                    <div class="mock-sheet-row"><q-icon name="lucide:bell" size="15px" /><span>Notifications</span></div>
                    <div class="mock-sheet-row"><q-icon name="lucide:moon" size="15px" /><span>Dark mode</span></div>
                  </div>
                </Transition>
                <Transition name="mock-pop" appear>
                  <div v-if="sheet === 'dialog'" class="mock-dialog">
                    <p class="mock-sheet-title">Delete photo?</p>
                    <p class="mock-sheet-desc">This action cannot be undone.</p>
                    <div class="mock-dialog-actions">
                      <button type="button" class="mock-btn-ghost" @click="sheet = null">Cancel</button>
                      <button type="button" class="mock-btn-danger" @click="sheet = null">Delete</button>
                    </div>
                  </div>
                </Transition>
              </div>
            </Transition>

            <span class="mock-phone__home" aria-hidden="true" />
          </div>
        </div>

        <p class="mock-stage__note">
          {{ activeScreen?.label }} — built with the real components, try them inside the frame.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ═══════════ Page ═══════════ */
.mock {
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
}

/* — Bandeau — */
.mock-hero {
  position: relative;
  overflow: hidden;
  padding: 124px 0 88px;
  background: radial-gradient(ellipse 90% 60% at 50% -10%, #17345f 0%, #0b1526 55%, #070b13 100%);
  color: #fff;
}
.mock-hero__inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}
.mock-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 24px;
  padding: 7px 14px;
  font-weight: 700;
  font-size: 11.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.mock-hero__title {
  margin: 0;
  font-size: clamp(34px, 5vw, 54px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.08;
}
.mock-hero__grad {
  background: linear-gradient(90deg, #4fc3f7, #7e9bff, #b39ddb);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: mock-grad 7s ease-in-out infinite alternate;
}
@keyframes mock-grad {
  from { background-position: 0% 50%; }
  to { background-position: 100% 50%; }
}
.mock-hero__sub {
  margin: 20px auto 0;
  max-width: 620px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.8);
}
.mock-hero__actions {
  margin-top: 30px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* — Studio — */
.mock-studio {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
  max-width: 1180px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  align-items: start;
}
.mock-nav {
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mock-nav__label {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #8b93a1;
}
.mock-nav__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}
.mock-nav__item:hover {
  background: var(--muted);
}
.mock-nav__item--active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 8px 20px rgb(25 118 210 / 0.3);
}

.mock-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.mock-stage__note {
  margin: 0;
  font-size: 13px;
  color: #8b93a1;
}
.mock-stage__note code,
.mock-hint code {
  background: rgb(25 118 210 / 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

/* — iPhone — */
.mock-phone {
  position: relative;
  width: 310px;
  padding: 12px;
  border-radius: 60px;
  background: linear-gradient(150deg, #3c4149 0%, #171a1f 42%, #0a0c0f 100%);
  box-shadow:
    0 40px 90px rgb(5 10 20 / 0.45),
    inset 0 1px 1px rgb(255 255 255 / 0.28),
    inset 0 -1px 2px rgb(0 0 0 / 0.65);
}
.mock-phone__btn {
  position: absolute;
  width: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #2c3037, #101317);
}
.mock-phone__btn--action { left: -4px; top: 60px; height: 18px; }
.mock-phone__btn--v1 { left: -4px; top: 90px; height: 30px; }
.mock-phone__btn--v2 { left: -4px; top: 128px; height: 46px; }
.mock-phone__btn--power { right: -4px; top: 110px; height: 56px; }
.mock-phone__screen {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 640px;
  border-radius: 48px;
  background: #f2f4f8;
  overflow: hidden;
}
.mock-phone__island {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 84px;
  height: 24px;
  padding-right: 7px;
  border-radius: 999px;
  background: #05070a;
}
.mock-phone__cam {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #2b3a55, #0a0f18 65%);
}
.mock-phone__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 18px 26px 0;
  font-size: 13px;
  font-weight: 700;
  color: #0b0f16;
  flex-shrink: 0;
}
.mock-phone__icons {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.mock-phone__content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  position: relative;
  scrollbar-width: none;
}
.mock-phone__content::-webkit-scrollbar {
  display: none;
}
.mock-phone__home {
  width: 110px;
  height: 5px;
  border-radius: 999px;
  background: #101623;
  margin: 6px auto 10px;
  flex-shrink: 0;
}

.mock-screen-tag {
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  justify-content: center;
  padding: 6px;
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #8b93a1;
  background: linear-gradient(180deg, #f2f4f8 70%, rgb(242 244 248 / 0));
}

/* — App bar / écrans — */
.mock-app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0 14px 10px;
}
.mock-app__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 2px 10px;
}
.mock-app__avatar {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #1976d2, #7c3aed);
  color: #fff;
  font-weight: 800;
  font-size: 15px;
  flex-shrink: 0;
}
.mock-app__titles {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.mock-app__titles b {
  font-size: 14px;
  color: #101623;
}
.mock-app__titles span {
  font-size: 10.5px;
  color: #8b93a1;
}
.mock-search {
  margin-bottom: 10px;
}
.mock-search :deep(.q-field__control) {
  border-radius: 999px;
  background: #fff;
}
.mock-card {
  margin-bottom: 10px;
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.06);
}
.mock-card__img {
  display: block;
  width: 100%;
  height: 110px;
  object-fit: cover;
}
.mock-card__body {
  padding: 10px 12px 8px;
}
.mock-card__body b {
  font-size: 13px;
  color: #101623;
}
.mock-card__body p {
  margin: 3px 0 0;
  font-size: 11px;
  line-height: 1.45;
  color: #5b6472;
}
.mock-card__actions {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}
.mock-fab {
  position: sticky;
  bottom: 8px;
  margin: 0 0 4px auto;
  box-shadow: 0 10px 24px rgb(25 118 210 / 0.4);
}

/* — Corps d'écran générique — */
.mock-screen-body {
  padding: 0 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mock-sec {
  margin: 6px 0 2px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #8b93a1;
}
.mock-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.mock-hint {
  margin: 10px 0 0;
  font-size: 10.5px;
  line-height: 1.5;
  color: #8b93a1;
}
.mock-p {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.55;
  color: #5b6472;
}
.mock-form {
  gap: 10px;
}
.mock-slider {
  display: flex;
  flex-direction: column;
}
.mock-slider__label {
  font-size: 11px;
  color: #5b6472;
}
.mock-submit {
  width: 100%;
}

/* — Liste swipe — */
.mock-list {
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.06);
}
.mock-list > * + * {
  border-top: 1px solid rgb(0 0 0 / 0.05);
}
.mock-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  background: #fff;
}
.mock-cell__emoji {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgb(25 118 210 / 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.mock-cell__info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
  min-width: 0;
}
.mock-cell__info b {
  font-size: 12.5px;
  color: #101623;
}
.mock-cell__info span {
  font-size: 10.5px;
  color: #8b93a1;
}
.mock-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex: 1;
  border: none;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
}
.mock-action--fav {
  background: #f59e0b;
}
.mock-action--del {
  background: #c62828;
}

/* — Feedback — */
.mock-feedback {
  gap: 10px;
}
.mock-progress-row {
  display: flex;
  align-items: center;
  gap: 14px;
}
.mock-linear {
  flex: 1;
}
.mock-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

/* — Avatars — */
.mock-avatars {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* — Skeleton — */
.mock-skel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.mock-skel-card {
  border-radius: 16px;
  background: #fff;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.06);
}
.mock-skel-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mock-skel-row--end {
  justify-content: flex-end;
}
.mock-skel-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* — Marquee — */
.mock-marquee-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-right: 20px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgb(25 118 210 / 0.1);
  color: var(--primary);
  font-size: 11px;
  font-weight: 700;
}

/* — Rolling text — */
.mock-rolling {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

/* — Count down — */
.mock-time {
  font-size: 26px;
  font-weight: 800;
  text-align: center;
  color: #101623;
}
.mock-flash {
  border-radius: 14px;
  padding: 12px;
  text-align: center;
  background: linear-gradient(135deg, #1976d2, #7c3aed);
}
.mock-time--white {
  color: #fff;
}
.mock-countbar {
  height: 6px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.1);
  overflow: hidden;
  margin-bottom: 8px;
}
.mock-countbar__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--primary);
  transition: width 0.3s ease;
}

/* — Swiper — */
.mock-swiper-box {
  width: 100%;
}
.mock-swiper-box :deep(.swiper) {
  height: 190px;
}
.mock-swipe-slide {
  position: relative;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.1);
}
.mock-swipe-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.mock-swipe-slide span {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px 10px 8px;
  font-size: 10.5px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(180deg, transparent, rgb(0 0 0 / 0.65));
}

/* — Chat — */
.mock-chat {
  flex: 1;
  min-height: 0;
}

/* — Tabs — */
.mock-tab-body {
  flex: 1;
  padding: 8px 0 12px;
}
.mock-tab-list {
  display: flex;
  flex-direction: column;
}
.mock-tab-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 12.5px;
  color: #101623;
  background: #fff;
}
.mock-tab-row + .mock-tab-row {
  border-top: 1px solid rgb(0 0 0 / 0.05);
}
.mock-tab-row__emoji {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgb(25 118 210 / 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

/* — Overlays (sheets & dialogs simulés dans le cadre) — */
.mock-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 10px 10px;
  background: rgb(0 0 0 / 0.45);
}
.mock-sheet-panel {
  width: 100%;
  border-radius: 22px;
  background: #fff;
  padding: 10px 0 8px;
  box-shadow: 0 20px 50px rgb(0 0 0 / 0.3);
}
.mock-sheet-handle {
  display: block;
  width: 40px;
  height: 5px;
  border-radius: 999px;
  background: rgb(0 0 0 / 0.15);
  margin: 0 auto 10px;
}
.mock-sheet-title {
  margin: 0 0 4px;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 800;
  color: #101623;
}
.mock-sheet-desc {
  margin: 0 0 8px;
  padding: 0 16px;
  font-size: 11px;
  line-height: 1.5;
  color: #5b6472;
}
.mock-sheet-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #101623;
  cursor: pointer;
}
.mock-sheet-option:hover {
  background: #f4f6f9;
}
.mock-sheet-cancel {
  display: block;
  width: calc(100% - 20px);
  margin: 8px auto 2px;
  padding: 11px;
  border: none;
  border-radius: 14px;
  background: #f4f6f9;
  color: #101623;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.mock-sheet-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #101623;
}
.mock-dialog {
  width: 100%;
  max-width: 240px;
  margin: auto;
  border-radius: 18px;
  background: #fff;
  padding: 18px 16px 14px;
  text-align: center;
  box-shadow: 0 20px 50px rgb(0 0 0 / 0.35);
}
.mock-dialog-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.mock-btn-ghost,
.mock-btn-danger {
  flex: 1;
  padding: 9px;
  border: none;
  border-radius: 12px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}
.mock-btn-ghost {
  background: #f4f6f9;
  color: #101623;
}
.mock-btn-danger {
  background: #c62828;
  color: #fff;
}

/* — Transitions overlays — */
.mock-fade-enter-active,
.mock-fade-leave-active {
  transition: opacity 0.2s ease;
}
.mock-fade-enter-from,
.mock-fade-leave-to {
  opacity: 0;
}
.mock-up-enter-active {
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
}
.mock-up-enter-from {
  transform: translateY(100%);
}
.mock-pop-enter-active {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.mock-pop-enter-from {
  transform: scale(0.85);
  opacity: 0;
}

/* ═══════════ Responsive ═══════════ */
@media (max-width: 960px) {
  .mock-studio {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .mock-nav {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }
  .mock-nav__label {
    width: 100%;
  }
  .mock-nav__item {
    padding: 8px 12px;
    font-size: 13px;
  }
}
@media (max-width: 480px) {
  .mock-phone {
    width: 100%;
    max-width: 320px;
  }
  .mock-phone__screen {
    height: 560px;
  }
}
</style>
