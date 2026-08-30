<script setup lang="ts">
// Swipe Cell — documentation du composant QSwipeCell : glisser pour révéler des actions.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const swipeCell = useComponent(() => "QSwipeCell")
const swipeCellSource = componentSource("QSwipeCell")
const tag = componentTag("QSwipeCell")

const ITEMS = [
  { name: "Alice Martin", role: "Product designer", emoji: "🎨" },
  { name: "Bruno Lefèvre", role: "Backend engineer", emoji: "⚙️" },
  { name: "Chloé Dubois", role: "Frontend engineer", emoji: "🧑‍💻" },
  { name: "David Chen", role: "Data analyst", emoji: "📊" },
]

// — État démos —
const lastEvent = ref("—")
const denied = ref(0)
const beforeClose = () => {
  denied.value++
  return false // refuse toujours la fermeture dans cette démo
}

const usageBasic = `<div class="list">
  <q-swipe-cell v-for="(item, i) in items" :key="i" :right-width="140">
    <div class="cell">
      <div class="avatar">{{ item.emoji }}</div>
      <div class="info"><b>{{ item.name }}</b><span>{{ item.role }}</span></div>
    </div>
    <template #right>
      <button class="action action--fav">★</button>
      <button class="action action--del">🗑</button>
    </template>
  </q-swipe-cell>
</div>
<!-- Glissez une cellule vers la gauche pour révéler les actions. -->`

const usageBoth = `<div class="list">
  <q-swipe-cell v-for="(item, i) in items" :key="i" :left-width="90" :right-width="90">
    <div class="cell">
      <div class="avatar">{{ item.emoji }}</div>
      <div class="info"><b>{{ item.name }}</b><span>{{ item.role }}</span></div>
    </div>
    <template #left>
      <button class="action action--read">Read</button>
    </template>
    <template #right>
      <button class="action action--del">Delete</button>
    </template>
  </q-swipe-cell>
</div>
<!-- Glissez vers la droite → action de gauche, vers la gauche → action de droite. -->`

const usageLock = `<div class="list">
  <q-swipe-cell :right-width="140" lock-on-open>
    <div class="cell">
      <div class="avatar">🔐</div>
      <div class="info"><b>Locked cell</b><span>Once open, you cannot swipe it again</span></div>
    </div>
    <template #right>
      <button class="action action--fav" @click="fav()">★ Fav</button>
      <button class="action action--del" @click="remove()">🗑 Delete</button>
    </template>
  </q-swipe-cell>
</div>
<!-- lock-on-open : le swipe est bloqué une fois ouvert — cliquez un bouton
     d'action (Fav ou Delete), la cellule, ou n'importe où en dehors pour fermer. -->`

const usageBefore = `<div class="list">
  <q-swipe-cell :right-width="110" :before-close="beforeClose">
    <div class="cell">
      <div class="avatar">🔒</div>
      <div class="info"><b>Protected cell</b><span>before-close returns false → stays open</span></div>
    </div>
    <template #right>
      <button class="action action--del">Delete</button>
    </template>
  </q-swipe-cell>
</div>
<p class="demo-p demo-meta">close attempts denied: {{ denied }}</p>`

const usageEvents = `<div class="list">
  <q-swipe-cell
    :right-width="120"
    @open="log('open ' + $event.position)"
    @close="log('close ' + $event.position)"
    @click="log('click ' + $event.position)"
  >
    <div class="cell">
      <div class="avatar">📣</div>
      <div class="info"><b>Tracked cell</b><span>open / close / click events</span></div>
    </div>
    <template #right>
      <button class="action action--fav">Archive</button>
    </template>
  </q-swipe-cell>
</div>
<p class="demo-p demo-meta">last event: {{ last }}</p>`

const scriptBasic = `import { ref } from "vue"

const items = [
  { name: "Alice Martin", role: "Product designer", emoji: "🎨" },
  { name: "Bruno Lefèvre", role: "Backend engineer", emoji: "⚙️" },
  { name: "Chloé Dubois", role: "Frontend engineer", emoji: "🧑‍💻" },
  { name: "David Chen", role: "Data analyst", emoji: "📊" },
]`

const scriptBefore = `import { ref } from "vue"

const denied = ref(0)
const beforeClose = () => {
  denied.value++
  return false // refuse toujours la fermeture
}`

const scriptEvents = `import { ref } from "vue"

const last = ref("—")
const log = (e: string) => (last.value = e)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Swipe Cell</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
      <span class="demo-mobile-badge">📱 Mobile-ready · Capacitor</span>
    </div>

    <p class="doc-lead">
      A list cell that reveals actions when swiped (Vant-style):
      <b>&lt;q-swipe-cell&gt;</b> drags horizontally to uncover
      <code>#left</code> / <code>#right</code> action panels
      (<code>left-width</code> / <code>right-width</code>), snaps open past half
      the width, and supports a <code>before-close</code> hook,
      <code>lock-on-open</code>, events
      (<code>@open</code>, <code>@close</code>, <code>@click</code>) and
      exposed <code>open()</code> / <code>close()</code> methods.
      Built <b>mobile-first</b> (Pointer Events + native vertical scroll via
      <code>touch-action: pan-y</code>) — ready for
      <b>Capacitor</b> applications.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic (right actions)</h2>
      <p class="doc-note">
        Swipe a row to the left to reveal the actions — click one to trigger it
        and close the cell.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-list">
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
      </docs-demo>
    </section>

    <!-- ═══════ Left & right ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Left &amp; right actions</h2>
      <p class="doc-note">
        Swipe left or right to reveal each side's actions.
      </p>

      <docs-demo :code="usageBoth" lang="html" filename="App.vue" :script="scriptBasic">
        <div class="demo-list">
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
      </docs-demo>
    </section>

    <!-- ═══════ Lock on open ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Lock on open</h2>
      <p class="doc-note">
        <code>lock-on-open</code> freezes the drag once the actions are
        revealed. Each action button keeps its own handler; close by clicking
        an action, the cell, or <b>anywhere outside</b> the cell.
      </p>

      <docs-demo :code="usageLock" lang="html" filename="App.vue" :script="scriptBasic">
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
      </docs-demo>
    </section>

    <!-- ═══════ Before close ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Before close</h2>
      <p class="doc-note">
        <code>before-close</code> can veto the close of an <b>action</b> (useful
        for confirmations) — clicking the cell itself always closes. Here
        <code>before-close</code> returns <code>false</code>, so “Delete” stays
        open while tapping the cell closes it.
      </p>

      <docs-demo :code="usageBefore" lang="html" filename="App.vue" :script="scriptBefore">
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
      </docs-demo>
    </section>

    <!-- ═══════ Events ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Events</h2>
      <p class="doc-note">
        <code>@open</code>, <code>@close</code> and <code>@click</code> carry
        <code>{ name, position }</code>.
      </p>

      <docs-demo :code="usageEvents" lang="html" filename="App.vue" :script="scriptEvents">
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
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSwipeCell API</h2>
      <docs-api :comp="swipeCell" :source="swipeCellSource" />
    </section>
  </div>
</template>

<style scoped>
.doc {
  max-width: 860px;
}
.doc-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.doc-title {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--foreground);
}
.doc-tag {
  font-size: 13px;
  color: var(--primary);
  background: rgba(25, 118, 210, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}
.demo-mobile-badge {
  font-size: 12px;
  font-weight: 700;
  color: #0e7490;
  background: rgb(14 116 144 / 0.12);
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.doc-lead {
  margin: 0 0 32px;
  font-size: 15px;
  line-height: 1.7;
  color: #5b6472;
  max-width: 720px;
}
.doc-section {
  margin-bottom: 44px;
}
.doc-h2 {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 700;
  color: var(--foreground);
}
.doc-note {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
  max-width: 700px;
}
.doc-note code,
.demo-p code,
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

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

/* — liste de cellules — */
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

/* — actions des panneaux — */
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
