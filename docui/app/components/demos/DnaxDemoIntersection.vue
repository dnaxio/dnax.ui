<script setup lang="ts">
// Démos live de la page Intersection (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "transitions" | "toggle" | "chat" | "cards"
}>()

// — Réfs des conteneurs scrollables (root des observers) —
const boxBasic = ref<HTMLElement>()
const boxTransitions = ref<HTMLElement>()
const boxToggle = ref<HTMLElement>()
const boxChat = ref<HTMLElement>()
const boxCards = ref<HTMLElement>()

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=600&auto=format&fit=crop`

const MESSAGES = [
  { who: "me", text: "Hey! Did you see the new dnax components?", time: "09:12" },
  { who: "other", text: "Yes — QIntersection is perfect for scroll reveals!", time: "09:14" },
  { who: "me", text: "And it exposes { active } in the slot 😎", time: "09:15" },
  { who: "other", text: "I'll use it for the chat list and the photo cards.", time: "09:17" },
  { who: "me", text: "Scroll this box and watch each bubble appear.", time: "09:18" },
  { who: "other", text: "The timestamps only render while a bubble is active.", time: "09:20" },
  { who: "me", text: 'Exactly — v-slot="{ active }" does that.', time: "09:21" },
]

const CARDS = [
  { img: IMG("photo-1786057425168-1f326d4f47b1"), title: "Alpine sunrise", desc: "Golden light over the peaks at dawn." },
  { img: IMG("photo-1783628376510-0de24d5b18a5"), title: "Coastal cliffs", desc: "Wild ocean views, salt in the air." },
  { img: IMG("photo-1567095761054-7a02e69e5c43"), title: "Forest trail", desc: "Morning mist between the pines." },
  { img: IMG("photo-1441974231531-c6227db76b6e"), title: "Deep woods", desc: "Where the old trees whisper." },
]

// — État démo toggle —
const shows = ref(0)
const hides = ref(0)
const intersected = ref(false)
</script>

<template>
  <div v-if="demo === 'basic'" ref="boxBasic" class="demo-scroll">
    <div class="demo-spacer"></div>
    <q-intersection :root="boxBasic" transition="fade">
      <div class="demo-card">Fade reveal</div>
    </q-intersection>
    <div class="demo-spacer"></div>
    <q-intersection :root="boxBasic" transition="slide-up">
      <div class="demo-card">Slide up</div>
    </q-intersection>
    <div class="demo-spacer"></div>
    <q-intersection :root="boxBasic" transition="scale">
      <div class="demo-card">Scale</div>
    </q-intersection>
  </div>

  <div v-else-if="demo === 'transitions'" ref="boxTransitions" class="demo-scroll">
    <div class="demo-spacer"></div>
    <q-intersection :root="boxTransitions" transition="fade">
      <div class="demo-card">fade</div>
    </q-intersection>
    <div class="demo-spacer"></div>
    <q-intersection :root="boxTransitions" transition="scale">
      <div class="demo-card">scale</div>
    </q-intersection>
    <div class="demo-spacer"></div>
    <q-intersection :root="boxTransitions" transition="slide-left">
      <div class="demo-card">slide-left</div>
    </q-intersection>
    <div class="demo-spacer"></div>
    <q-intersection :root="boxTransitions" transition="flip">
      <div class="demo-card">flip</div>
    </q-intersection>
  </div>

  <template v-else-if="demo === 'toggle'">
    <div ref="boxToggle" class="demo-scroll">
      <div class="demo-spacer"></div>
      <q-intersection
        v-model="intersected"
        :root="boxToggle"
        :once="false"
        transition="slide-up"
        @show="shows++"
        @hide="hides++"
      >
        <div class="demo-card">Reveals again when scrolled back into view</div>
      </q-intersection>
      <div class="demo-spacer"></div>
      <div class="demo-spacer"></div>
    </div>
    <p class="demo-p demo-meta">
      visible = {{ intersected }} · shows = {{ shows }} · hides = {{ hides }}
    </p>
  </template>

  <div v-else-if="demo === 'chat'" ref="boxChat" class="demo-chat">
    <q-intersection
      v-for="(m, i) in MESSAGES"
      :key="i"
      :root="boxChat"
      transition="slide-up"
    >
      <template #default="{ active }">
        <div class="demo-msg" :class="`demo-msg--${m.who}`">
          <div class="demo-msg__avatar">{{ m.who === "me" ? "🧑" : "🤖" }}</div>
          <div class="demo-msg__bubble">
            <p class="demo-msg__text">{{ m.text }}</p>
            <span v-if="active" class="demo-msg__time">{{ m.time }}</span>
          </div>
        </div>
      </template>
    </q-intersection>
  </div>

  <div v-else-if="demo === 'cards'" ref="boxCards" class="demo-cards">
    <q-intersection
      v-for="(c, i) in CARDS"
      :key="i"
      :root="boxCards"
      transition="slide-up"
    >
      <template #default="{ active }">
        <article class="demo-photo-card" :class="{ 'demo-photo-card--active': active }">
          <img :src="c.img" :alt="c.title" class="demo-photo-card__img" />
          <div class="demo-photo-card__body">
            <h4 class="demo-photo-card__title">{{ c.title }}</h4>
            <p class="demo-photo-card__desc">{{ c.desc }}</p>
          </div>
        </article>
      </template>
    </q-intersection>
  </div>
</template>

<style scoped>
.demo-meta {
  margin-top: 12px;
  text-align: center;
  color: #8b93a1;
  font-variant-numeric: tabular-nums;
}

/* — conteneur scrollable de démo (root de l'observation) — */
.demo-scroll {
  height: 340px;
  overflow-y: auto;
  border: 1px dashed rgb(0 0 0 / 0.16);
  border-radius: 12px;
  padding: 12px;
  background: var(--muted);
}
.demo-spacer {
  height: 180px;
}
.demo-card {
  padding: 24px;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 8px 20px rgb(25 118 210 / 0.25);
}

/* — chat : bulles qui se révèlent au scroll — */
.demo-chat {
  height: 380px;
  overflow-y: auto;
  border: 1px dashed rgb(0 0 0 / 0.16);
  border-radius: 12px;
  padding: 16px;
  background: var(--muted);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.demo-msg {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.demo-msg--me {
  flex-direction: row-reverse;
}
.demo-msg__avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.demo-msg__bubble {
  max-width: 75%;
  padding: 9px 13px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgb(0 0 0 / 0.08);
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.06);
}
.dark .demo-msg__bubble {
  background: var(--card);
  border-color: var(--border);
}
.demo-msg--me .demo-msg__bubble {
  background: var(--primary);
  border-color: transparent;
  color: #fff;
}
.demo-msg__text {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
}
.demo-msg__time {
  display: block;
  margin-top: 4px;
  font-size: 10.5px;
  color: #8b93a1;
  text-align: right;
}
.demo-msg--me .demo-msg__time {
  color: rgb(255 255 255 / 0.7);
}

/* — cartes photo qui se révèlent — */
.demo-cards {
  height: 420px;
  overflow-y: auto;
  border: 1px dashed rgb(0 0 0 / 0.16);
  border-radius: 12px;
  padding: 12px;
  background: var(--muted);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.demo-photo-card {
  border-radius: 12px;
  overflow: hidden;
  background: var(--card);
  border: 1px solid rgb(0 0 0 / 0.08);
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.08);
  transition: box-shadow 0.3s ease;
}
.dark .demo-photo-card {
  border-color: var(--border);
}
.demo-photo-card--active {
  box-shadow: 0 10px 26px rgb(0 0 0 / 0.18);
}
.demo-photo-card__img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.demo-photo-card--active .demo-photo-card__img {
  transform: scale(1.06);
}
.demo-photo-card__body {
  padding: 10px 12px 12px;
}
.demo-photo-card__title {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
  color: var(--foreground);
}
.demo-photo-card__desc {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #5b6472;
}
</style>
