<script setup lang="ts">
// Démo live de $q.wakeLock : garde l'écran allumé tant que le verrou est demandé.
// Le navigateur le relâche en quittant l'onglet ; le plugin le redemande au retour.
import { usePlugin } from "@dnax/ui/runtime"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "status"
}>()

const $q = usePlugin()

const toggle = async () => {
  try {
    if ($q.wakeLock.isActive) await $q.wakeLock.release()
    else await $q.wakeLock.request()
  }
  catch {
    // Refusé : page masquée, économiseur de batterie, iframe sans Permissions-Policy…
    // Échec doux : l'écran reprend simplement son délai habituel.
  }
}
</script>

<template>
  <div v-if="demo === 'status'" class="demo-wake-lock">
    <div
      class="demo-wake-lock__status"
      :class="$q.wakeLock.isActive ? 'demo-wake-lock__status--on' : 'demo-wake-lock__status--off'"
    >
      <span class="demo-wake-lock__dot" aria-hidden="true" />
      <strong>
        {{ $q.wakeLock.isActive ? "Screen kept awake" : "Normal screen timeout" }}
      </strong>
      <code>isActive = {{ $q.wakeLock.isActive }}</code>
    </div>

    <div class="demo-wake-lock__actions">
      <q-btn
        no-caps
        color="primary"
        :disable="!$q.wakeLock.isCapable"
        :label="$q.wakeLock.isActive ? 'release()' : 'request()'"
        @click="toggle"
      />
      <span class="demo-wake-lock__cap">
        <code>isCapable = {{ $q.wakeLock.isCapable }}</code>
      </span>
    </div>

    <p class="demo-wake-lock__hint">
      Switching tabs releases the lock: the browser does it on its own. It is
      re-requested when the page becomes visible again, until you call
      <code>release()</code>.
    </p>
  </div>
</template>

<style scoped>
.demo-wake-lock {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 640px;
}

.demo-wake-lock__status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
}

.demo-wake-lock__status code,
.demo-wake-lock__cap code {
  font-size: 12px;
  color: var(--muted-foreground);
}

.demo-wake-lock__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.demo-wake-lock__status--on {
  border-color: color-mix(in srgb, var(--positive) 35%, transparent);
  background: color-mix(in srgb, var(--positive) 10%, transparent);
}

.demo-wake-lock__status--on .demo-wake-lock__dot {
  background: var(--positive);
}

.demo-wake-lock__status--off .demo-wake-lock__dot {
  background: var(--muted-foreground);
}

.demo-wake-lock__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.demo-wake-lock__hint {
  margin: 0;
  font-size: 13px;
  color: var(--muted-foreground);
}
</style>
