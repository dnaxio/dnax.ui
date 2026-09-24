<script setup lang="ts">
// Live demos for the Swipe Cell page (per-page state).
import { ref } from "vue"

defineProps<{
  /** Identifier of the demo to render */
  demo: "basic" | "both" | "lock" | "before" | "events"
}>()

const ITEMS = [
  { name: "Alice Martin", role: "Product designer", emoji: "🎨" },
  { name: "Bruno Lefèvre", role: "Backend engineer", emoji: "⚙️" },
  { name: "Chloé Dubois", role: "Frontend engineer", emoji: "🧑‍💻" },
  { name: "David Chen", role: "Data analyst", emoji: "📊" },
]

const lastEvent = ref("—")
const denied = ref(0)
const beforeClose = () => {
  denied.value++
  return false // always refuses to close in this demo
}
</script>

<template>
  <div v-if="demo === 'basic'" class="demo-list">
    <q-swipe-cell v-for="(item, i) in ITEMS" :key="i" :right-width="140">
      <div class="demo-cell">
        <div class="demo-avatar">{{ item.emoji }}</div>
        <div class="demo-info">
          <b>{{ item.name }}</b>
          <span>{{ item.role }}</span>
        </div>
      </div>
      <template #right>
        <button type="button" class="demo-action demo-action--fav">
          <q-icon name="lucide:star" size="16px" /> Fav
        </button>
        <button type="button" class="demo-action demo-action--del">
          <q-icon name="lucide:trash-2" size="16px" /> Delete
        </button>
      </template>
    </q-swipe-cell>
  </div>

  <div v-else-if="demo === 'both'" class="demo-list">
    <q-swipe-cell v-for="(item, i) in ITEMS" :key="i" :left-width="90" :right-width="90">
      <div class="demo-cell">
        <div class="demo-avatar">{{ item.emoji }}</div>
        <div class="demo-info">
          <b>{{ item.name }}</b>
          <span>{{ item.role }}</span>
        </div>
      </div>
      <template #left>
        <button type="button" class="demo-action demo-action--read">Read</button>
      </template>
      <template #right>
        <button type="button" class="demo-action demo-action--del">Delete</button>
      </template>
    </q-swipe-cell>
  </div>

  <div v-else-if="demo === 'lock'">
    <div class="demo-list">
      <q-swipe-cell :right-width="140" lock-on-open>
        <div class="demo-cell">
          <div class="demo-avatar">🔐</div>
          <div class="demo-info">
            <b>Locked cell</b>
            <span>Once open, you cannot swipe it again</span>
          </div>
        </div>
        <template #right>
          <button type="button" class="demo-action demo-action--fav" @click="lastEvent = 'Fav clicked'">
            <q-icon name="lucide:star" size="16px" /> Fav
          </button>
          <button type="button" class="demo-action demo-action--del" @click="lastEvent = 'Delete clicked'">
            <q-icon name="lucide:trash-2" size="16px" /> Delete
          </button>
        </template>
      </q-swipe-cell>
    </div>
    <p class="demo-p demo-meta">last action: {{ lastEvent }}</p>
  </div>

  <div v-else-if="demo === 'before'">
    <div class="demo-list">
      <q-swipe-cell :right-width="110" :before-close="beforeClose">
        <div class="demo-cell">
          <div class="demo-avatar">🔒</div>
          <div class="demo-info">
            <b>Protected cell</b>
            <span>before-close returns false → stays open</span>
          </div>
        </div>
        <template #right>
          <button type="button" class="demo-action demo-action--del">Delete</button>
        </template>
      </q-swipe-cell>
    </div>
    <p class="demo-p demo-meta">close attempts denied: {{ denied }}</p>
  </div>

  <div v-else-if="demo === 'events'">
    <div class="demo-list">
      <q-swipe-cell
        :right-width="120"
        @open="lastEvent = 'open ' + $event.position"
        @close="lastEvent = 'close ' + $event.position"
        @click="lastEvent = 'click ' + ($event.position || 'cell')"
      >
        <div class="demo-cell">
          <div class="demo-avatar">📣</div>
          <div class="demo-info">
            <b>Tracked cell</b>
            <span>open / close / click events</span>
          </div>
        </div>
        <template #right>
          <button type="button" class="demo-action demo-action--fav">Archive</button>
        </template>
      </q-swipe-cell>
    </div>
    <p class="demo-p demo-meta">last event: {{ lastEvent }}</p>
  </div>
</template>

<style scoped>
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}
.demo-meta {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #8b93a1;
  font-variant-numeric: tabular-nums;
}

/* — cell list — */
.demo-list {
  border: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 12px;
  overflow: hidden;
  background: var(--card);
}
.dark .demo-list {
  border-color: var(--border);
}
.demo-list > * + * {
  border-top: 1px solid rgb(0 0 0 / 0.06);
}
.dark .demo-list > * + * {
  border-top-color: var(--border);
}

.demo-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--card);
  color: var(--foreground);
}
.demo-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgb(25 118 210 / 0.1);
  font-size: 19px;
  flex-shrink: 0;
}
.demo-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.demo-info b {
  font-size: 14px;
  color: var(--foreground);
}
.demo-info span {
  font-size: 12.5px;
  color: #8b93a1;
}

/* — panel actions — */
.demo-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  border: none;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.demo-action--fav {
  background: #f59e0b;
}
.demo-action--del {
  background: var(--negative, #c62828);
}
.demo-action--read {
  background: var(--primary);
}
.demo-action:hover {
  filter: brightness(0.95);
}
</style>
