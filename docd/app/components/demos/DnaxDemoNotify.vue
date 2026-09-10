<script setup lang="ts">
// Démos live de la page Plugin Notify ($q.notify : toasts programmatiques).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { usePlugin } from "@dnax/ui/runtime"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "live"
}>()

const $q = usePlugin()

type NotifyType = "success" | "error" | "warning" | "info" | "positive" | "negative"

const fire = (type: NotifyType, message: string) => {
  $q.notify.show({ type, message, caption: "via $q.notify.show", position: "top-right", timeout: 2500 })
}
</script>

<template>
  <div v-if="demo === 'live'" class="demo-row">
    <q-btn no-caps color="positive" label="Success" @click="fire('success', 'Saved')" />
    <q-btn no-caps color="negative" label="Error" @click="fire('error', 'Failed')" />
    <q-btn no-caps color="warning" label="Warning" @click="fire('warning', 'Careful')" />
    <q-btn no-caps color="info" label="Info" @click="fire('info', 'Heads up')" />
  </div>
</template>
