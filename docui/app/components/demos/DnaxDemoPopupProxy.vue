<script setup lang="ts">
// Démos live de la page Popup proxy (état par page).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "basic" | "persistent"
}>()

// API exposée par <q-popup-proxy> (show/hide/toggle) — le proxy n'a pas de
// déclencheur propre : on l'ouvre via son ref, depuis le clic du bouton.
interface PopupProxyApi {
  show: () => void
  hide: () => void
  toggle: () => void
}

const proxyBasic = ref<PopupProxyApi | null>(null)
const proxyPersistent = ref<PopupProxyApi | null>(null)

const picked = ref("—")
const pick = (label: string) => {
  picked.value = label
  proxyBasic.value?.hide()
}
</script>

<template>
  <!-- Basic : un bouton ouvre le panneau ancré (menu sur grand écran, dialogue sur mobile) -->
  <div v-if="demo === 'basic'" class="demo-col">
    <q-btn label="Open menu" color="primary" @click="proxyBasic?.show()">
      <q-popup-proxy ref="proxyBasic" position="bottom-end">
        <q-list padding>
          <q-item clickable @click="pick('Profile')">
            <q-icon name="lucide:user" left />
            Profile
          </q-item>
          <q-item clickable @click="pick('Settings')">
            <q-icon name="lucide:settings" left />
            Settings
          </q-item>
          <q-item clickable @click="pick('Sign out')">
            <q-icon name="lucide:log-out" left />
            Sign out
          </q-item>
        </q-list>
      </q-popup-proxy>
    </q-btn>

    <p class="demo-meta">Picked: <code>{{ picked }}</code></p>
  </div>

  <!-- Persistent : le clic extérieur et Échap ne ferment pas — il faut le bouton Close -->
  <div v-else-if="demo === 'persistent'" class="demo-col">
    <q-btn label="Persistent popup" color="primary" @click="proxyPersistent?.show()">
      <q-popup-proxy ref="proxyPersistent" persistent>
        <div class="panel">
          <p class="panel__title">Persistent</p>
          <p class="panel__text">
            Clicking outside or pressing <kbd>Escape</kbd> won't close this popup — use the
            button below.
          </p>
          <q-btn flat label="Close" @click="proxyPersistent?.hide()" />
        </div>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  max-width: 560px;
  margin: 0 auto;
}

.demo-meta {
  margin: 0;
  font-size: 13px;
  color: #8b93a1;
}

/* Contenu du panneau téléporté (démo « persistent ») */
.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 240px;
  padding: 10px 12px;
}

.panel__title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--foreground);
}

.panel__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--foreground);
  opacity: 0.75;
}

.panel__text kbd {
  padding: 1px 5px;
  border: 1px solid var(--border, rgb(0 0 0 / 0.15));
  border-radius: 4px;
  font-size: 12px;
}
</style>
