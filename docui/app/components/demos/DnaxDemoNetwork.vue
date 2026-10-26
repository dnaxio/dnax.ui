<script setup lang="ts">
// Démo live de $q.network : l'état suit `navigator.onLine` et les événements
// `online` / `offline` émis par le navigateur. On peut les simuler ici (les devtools,
// onglet Network → Offline, font exactement la même chose).
import { usePlugin } from "@dnax/ui/runtime"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "status"
}>()

const $q = usePlugin()

/** `navigator.onLine` n'est pas modifiable depuis le code : on émet l'événement. */
const simulate = (kind: "online" | "offline") => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(kind))
}

const refresh = () => $q.network.refresh()
</script>

<template>
  <div v-if="demo === 'status'" class="demo-network">
    <div
      class="demo-network__status"
      :class="$q.network.online ? 'demo-network__status--on' : 'demo-network__status--off'"
    >
      <span class="demo-network__dot" aria-hidden="true" />
      <strong>{{ $q.network.online ? "Online" : "Offline" }}</strong>
      <code>online = {{ $q.network.online }}</code>
      <code>offline = {{ $q.network.offline }}</code>
    </div>

    <div class="demo-network__actions">
      <q-btn no-caps flat label="Simulate offline" @click="simulate('offline')" />
      <q-btn no-caps flat label="Simulate online" @click="simulate('online')" />
      <q-btn no-caps color="primary" label="refresh()" @click="refresh" />
    </div>

    <p class="demo-network__hint">
      A simulated event only flips this demo's state — <code>refresh()</code> re-reads the
      real <code>navigator.onLine</code>.
    </p>
  </div>
</template>

<style scoped>
.demo-network {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 640px;
}

.demo-network__status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
}

.demo-network__status code {
  font-size: 12px;
  color: var(--muted-foreground);
}

.demo-network__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.demo-network__status--on {
  border-color: color-mix(in srgb, var(--positive) 35%, transparent);
  background: color-mix(in srgb, var(--positive) 10%, transparent);
}

.demo-network__status--on .demo-network__dot {
  background: var(--positive);
}

.demo-network__status--off {
  border-color: color-mix(in srgb, var(--negative) 35%, transparent);
  background: color-mix(in srgb, var(--negative) 10%, transparent);
}

.demo-network__status--off .demo-network__dot {
  background: var(--negative);
}

.demo-network__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.demo-network__hint {
  margin: 0;
  font-size: 13px;
  color: var(--muted-foreground);
}
</style>
