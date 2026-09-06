<script setup lang="ts">
// DemoShareSheet — contenu d'un bottom sheet programmatique ($q.bottomSheet.open).
// Le QBottomSheetProvider rend déjà le panneau + header ; ce composant fournit
// le corps et les actions (il émet ok / cancel / dismiss).
import { ref } from "vue"

const emit = defineEmits<{
  ok: [data?: unknown]
  cancel: []
  dismiss: []
}>()

const props = defineProps<{
  file?: string
}>()

const copied = ref(false)

const targets = [
  { icon: "lucide:message-circle", label: "Messages", value: "messages" },
  { icon: "lucide:mail", label: "Email", value: "email" },
  { icon: "lucide:link", label: "Copy link", value: "link" },
  { icon: "lucide:download", label: "Download", value: "download" },
]

const share = (value: string) => {
  if (value === "link") copied.value = true
  emit("ok", { target: value, file: props.file ?? "document.pdf" })
}
</script>

<template>
  <div class="demo-share">
    <p v-if="file" class="demo-share__file">
      <q-icon name="lucide:file" size="16px" aria-hidden="true" />
      <span>{{ file }}</span>
    </p>
    <div class="demo-share__grid">
      <button
        v-for="t in targets"
        :key="t.value"
        type="button"
        class="demo-share__action"
        @click="share(t.value)"
      >
        <q-icon :name="t.icon" size="20px" aria-hidden="true" />
        <span>{{ t.label }}</span>
      </button>
    </div>
    <p v-if="copied" class="demo-share__copied">Link copied — closing…</p>
    <div class="demo-share__actions">
      <q-btn flat label="Cancel" @click="emit('cancel')" />
    </div>
  </div>
</template>

<style scoped>
.demo-share {
  padding: 4px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.demo-share__file {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgb(0 0 0 / 0.05);
  font-size: 13px;
  color: #5b6472;
}
.demo-share__file svg,
.demo-share__action svg {
  color: var(--primary);
}
.demo-share__file .q-icon,
.demo-share__action .q-icon {
  color: var(--primary);
}
.demo-share__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.demo-share__action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 6px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 10px;
  background: transparent;
  color: var(--foreground);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}
.demo-share__action:hover {
  border-color: var(--primary);
  background: rgb(25 118 210 / 0.06);
}
.demo-share__action svg {
  width: 20px;
  height: 20px;
}
.demo-share__copied {
  margin: 0;
  font-size: 12px;
  color: #10b981;
}
.demo-share__actions {
  display: flex;
  justify-content: flex-end;
}
</style>
