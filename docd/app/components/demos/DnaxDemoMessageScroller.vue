<script setup lang="ts">
// Démos live de la page Message Scroller (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "transcript" | "live" | "anchor"
}>()

// — Fil de messages avec auto-scroll —
const messages = ref([
  { id: "m1", text: "Welcome to the demo! 👋", from: "them" },
  { id: "m2", text: "Hey! Does the scroller stay pinned to the bottom?", from: "me" },
  { id: "m3", text: "It does — as long as auto-scroll is on and you are at the live edge.", from: "them" },
  { id: "m4", text: "Try sending a message below.", from: "them" },
])
let msgSeq = 4
const sendMessage = () => {
  msgSeq += 1
  messages.value.push({ id: `m${msgSeq}`, text: `Auto-scrolled message #${msgSeq} 🎉`, from: "me" })
}

// — Presets d'animation —
type AnimPreset =
  | "fade"
  | "slide-up"
  | "slide-side"
  | "pop"
  | "spring-bounce"
  | "blur-fade"
  | "scale-fade"

const presets: { label: string; value: AnimPreset }[] = [
  { label: "Fade", value: "fade" },
  { label: "Slide up", value: "slide-up" },
  { label: "Slide side", value: "slide-side" },
  { label: "Pop", value: "pop" },
  { label: "Spring bounce", value: "spring-bounce" },
  { label: "Blur fade", value: "blur-fade" },
  { label: "Scale fade", value: "scale-fade" },
]
const preset = ref<AnimPreset>("slide-up")
</script>

<template>
  <q-message-scroller-provider
    v-if="demo === 'transcript'"
    auto-scroll
    default-scroll-position="end"
  >
    <q-message-scroller class="demo-scroller">
      <q-message-scroller-viewport>
        <q-message-scroller-content>
          <q-message-scroller-item
            v-for="m in messages"
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
      <q-message-scroller-button direction="end" label="Jump to latest" />
    </q-message-scroller>
  </q-message-scroller-provider>

  <q-message-scroller-provider
    v-else-if="demo === 'live'"
    auto-scroll
    default-scroll-position="end"
  >
    <q-message-scroller class="demo-scroller">
      <q-message-scroller-viewport>
        <q-message-scroller-content>
          <q-message-scroller-item
            v-for="m in messages"
            :key="m.id"
            :message-id="m.id"
            :animation-preset="preset"
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
      <q-message-scroller-button direction="end" label="Jump to latest" />
    </q-message-scroller>

    <div class="demo-scroller-actions demo-scroller-actions--row">
      <q-select
        v-model="preset"
        :options="presets"
        option-label="label"
        option-value="value"
        label="Animation"
        outlined
        dense
        class="demo-preset"
      />
      <q-btn icon="lucide:send" label="Send message" @click="sendMessage" />
    </div>
  </q-message-scroller-provider>

  <q-message-scroller-provider
    v-else-if="demo === 'anchor'"
    auto-scroll
    default-scroll-position="last-anchor"
    :scroll-previous-item-peek="48"
  >
    <q-message-scroller class="demo-scroller">
      <q-message-scroller-viewport>
        <q-message-scroller-content>
          <q-message-scroller-item
            v-for="m in messages"
            :key="m.id"
            :message-id="m.id"
            :scroll-anchor="m.from === 'them'"
            animation-preset="fade"
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
      <q-message-scroller-button direction="end" />
    </q-message-scroller>
  </q-message-scroller-provider>
</template>

<style scoped>
.demo-scroller {
  width: 100%;
  max-width: 480px;
  height: 320px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  background: #fafbfc;
  padding: 12px;
}
.demo-scroller-actions {
  margin-top: 10px;
  max-width: 480px;
}
.demo-scroller-actions--row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.demo-preset {
  flex: 1;
}
</style>
