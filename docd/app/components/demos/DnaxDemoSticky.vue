<script setup lang="ts">
// Live demos for the Sticky page (per-page state).
import { ref } from "vue"

defineProps<{
  /** Identifier of the demo to render */
  demo: "basic" | "offset" | "bound" | "bottom" | "events"
}>()

// — Demo container refs —
const boxBound = ref<HTMLElement>()
const boxBottom = ref<HTMLElement>()
const boxEvents = ref<HTMLElement>()

// — Demo state —
const stuck = ref(false)
const stuckOffset = ref(false)
const evScrollTop = ref(0)
const evFixed = ref(false)
const evChanges = ref(0)
</script>

<template>
  <div v-if="demo === 'basic'">
    <q-sticky @change="stuck = $event">
      <div class="demo-bar">Sticky bar <span v-if="stuck" class="demo-chip">stuck</span></div>
    </q-sticky>
    <p v-for="i in 24" :key="i" class="demo-line">
      Line {{ i }} — keep scrolling…
    </p>
  </div>

  <div v-else-if="demo === 'offset'">
    <q-sticky :offset-top="16" @change="stuckOffset = $event">
      <div class="demo-bar demo-bar--soft">Pinned 16px from the top</div>
    </q-sticky>
    <p v-for="i in 24" :key="i" class="demo-line">
      Line {{ i }} — keep scrolling…
    </p>
  </div>

  <div v-else-if="demo === 'bound'" ref="boxBound" class="demo-viewport">
    <q-sticky :container="boxBound">
      <div class="demo-bar demo-bar--accent">Stays inside its container</div>
    </q-sticky>
    <p v-for="i in 14" :key="i" class="demo-line">
      Line {{ i }} — the bar stops at the container's bottom edge…
    </p>
  </div>

  <div v-else-if="demo === 'bottom'" ref="boxBottom" class="demo-viewport">
    <p v-for="i in 14" :key="i" class="demo-line">
      Line {{ i }} — the action stays pinned to the bottom…
    </p>
    <q-sticky position="bottom" :offset-bottom="16" :container="boxBottom">
      <q-btn
        color="primary"
        unelevated
        no-caps
        icon="lucide:shopping-cart"
        label="Add to cart"
        class="demo-buy"
      />
    </q-sticky>
  </div>

  <div v-else-if="demo === 'events'" ref="boxEvents" class="demo-viewport">
    <q-sticky
      :container="boxEvents"
      @scroll="({ scrollTop, isFixed }) => { evScrollTop = scrollTop; evFixed = isFixed }"
      @change="evChanges++"
    >
      <div class="demo-bar demo-bar--outline">
        scrollTop {{ evScrollTop }} · fixed {{ evFixed }} · changes {{ evChanges }}
      </div>
    </q-sticky>
    <p v-for="i in 14" :key="i" class="demo-line">
      Line {{ i }} — watch the counters update as you scroll…
    </p>
  </div>
</template>

<style scoped>
/* — sticky bar — */
.demo-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgb(25 118 210 / 0.28);
}
.demo-bar--soft {
  background: #7c3aed;
  box-shadow: 0 8px 20px rgb(124 58 237 / 0.28);
}
.demo-bar--accent {
  background: #0e7490;
  box-shadow: 0 8px 20px rgb(14 116 144 / 0.28);
}
.demo-bar--outline {
  background: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border, rgb(0 0 0 / 0.12));
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.1);
  font-variant-numeric: tabular-nums;
}
.demo-chip {
  padding: 1px 8px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.22);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* — filler lines — */
.demo-line {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #8b93a1;
}

/* — demo container (the sticky stays bounded inside) — */
.demo-viewport {
  position: relative;
  height: 380px;
  padding: 16px;
  overflow: hidden;
  border: 1px dashed var(--border, rgb(0 0 0 / 0.16));
  border-radius: 12px;
  background: var(--muted);
}
.demo-viewport .demo-line {
  color: #5b6472;
}

.demo-buy {
  width: 100%;
}
</style>
