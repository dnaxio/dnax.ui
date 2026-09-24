<script setup lang="ts">
// Demos live de la page Plugin Dialog ($q.dialog : modales programmatiques).
// Un seul composant par page, la prop `demo` sélectionne la démo à rendre.
import { ref } from "vue"
import { usePlugin } from "@dnax/ui/runtime"
import DemoConfirmDialog from "~/components/demos/DemoConfirmDialog.vue"
import DemoScrollDialog from "~/components/demos/DemoScrollDialog.vue"

defineProps<{
  /** Identifiant de la démo à afficher */
  demo: "live"
}>()

const $q = usePlugin()

const log = ref<string[]>([])

const openDemo = () => {
  $q.dialog
    .open({
      component: DemoConfirmDialog,
      componentProps: {
        title: "Delete account?",
        message: "This action is irreversible — all your data will be removed.",
        confirmLabel: "Delete account",
        color: "negative",
      },
    })
    .onOK((data) => {
      log.value.unshift(`ok → ${data}`)
    })
    .onCancel(() => {
      log.value.unshift("cancel")
    })
    .onDismiss(() => {
      log.value.unshift("dismiss (backdrop / Esc / ×)")
    })
}

const openTerms = () => {
  $q.dialog
    .open({
      component: DemoScrollDialog,
    })
    .onOK(() => {
      log.value.unshift("accepted")
    })
    .onCancel(() => {
      log.value.unshift("cancel (terms)")
    })
    .onDismiss(() => {
      log.value.unshift("dismiss (terms)")
    })
}
</script>

<template>
  <template v-if="demo === 'live'">
    <div class="demo-row">
      <q-btn unelevated no-caps color="negative" icon="lucide:trash-2" label="Delete account…" @click="openDemo" />
      <q-btn unelevated no-caps color="primary" icon="lucide:file-text" label="Terms of service…" @click="openTerms" />
    </div>
    <div v-if="log.length" class="demo-log">
      <p class="demo-log__label">Results</p>
      <p v-for="(entry, i) in log" :key="i" class="demo-log__entry"><code>{{ entry }}</code></p>
    </div>
  </template>
</template>

<style scoped>
.demo-log {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.demo-log__label {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8b93a1;
}
.demo-log__entry {
  margin: 0;
  font-size: 13px;
  color: #5b6472;
}
.demo-log__entry code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 6px;
  border-radius: 5px;
}
</style>
