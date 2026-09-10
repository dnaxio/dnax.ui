<script setup lang="ts">
// Démos live de la page Action Sheet (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "options" | "events"
}>()

const open = ref(false)
const openPlan = ref(false)
const result = ref("")
const last = ref("")

const shareOptions = ref([
  { label: "Copy link", icon: "lucide:link", value: "copy" },
  { label: "Email", icon: "lucide:mail", value: "email", description: "Send a message" },
  { label: "Messages", icon: "lucide:message-circle", value: "messages" },
  { label: "More options", icon: "lucide:ellipsis", description: "No value — the option itself is emitted" },
])

const planOptions = ref([
  { label: "Free", value: "free", icon: "lucide:gift" },
  { label: "Pro", value: "pro", icon: "lucide:zap", color: "primary", description: "Best value" },
  { label: "Enterprise", value: "enterprise", icon: "lucide:building-2", color: "#d97706" },
])

const onSelect = (value: any) => {
  result.value = typeof value === "string" ? value : (value?.label ?? JSON.stringify(value))
}
</script>

<template>
  <div v-if="demo === 'options'" class="demo-action">
    <q-btn color="primary" icon="lucide:share-2" label="Share" @click="open = true" />

    <q-action-sheet
      v-model="open"
      title="Share to"
      :options="shareOptions"
      @select="onSelect"
    />
    <p v-if="result" class="demo-action-result">Selected: <code>{{ result }}</code></p>
  </div>

  <div v-else-if="demo === 'events'" class="demo-action">
    <q-btn outline label="Choose a plan" @click="openPlan = true" />

    <q-action-sheet
      v-model="openPlan"
      title="Upgrade plan"
      cancel="Dismiss"
      :options="planOptions"
      @select="last = 'select: ' + $event"
      @cancel="last = 'cancel'"
    />
    <p v-if="last" class="demo-action-result">Last event: <code>{{ last }}</code></p>
  </div>
</template>

<style scoped>
.demo-action {
  width: 100%;
  max-width: 560px;
}
.demo-action-result {
  margin: 10px 0 0;
  font-size: 13px;
  color: #8b93a1;
}
.demo-action-result code {
  background: rgb(25 118 210 / 0.08);
  color: var(--primary, #1976d2);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}
</style>
