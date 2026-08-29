<script setup lang="ts">
// Infinite Scroll — QInfiniteScroll : charge plus de contenu en approchant du bas.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const infiniteScroll = useComponent(() => "QInfiniteScroll")
const infiniteScrollSource = componentSource("QInfiniteScroll")
const tag = componentTag("QInfiniteScroll")

// — Démo : 20 items initiaux, +10 à chaque scroll, 60 au total —
const items = ref(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`))
let seq = 20
const total = 60

const loadMore = (index: number, done: () => void) => {
  setTimeout(() => {
    const next = Math.min(seq + 10, total)
    for (let i = seq + 1; i <= next; i++) items.value.push(`Item ${i}`)
    seq = next
    done()
  }, 700)
}

const usageBasic = `<q-infinite-scroll :offset="200" @load="loadMore">
  <div class="item" v-for="it in items" :key="it">{{ it }}</div>
</q-infinite-scroll>

<script setup>
const items = ref(Array.from({ length: 20 }, (_, i) => \`Item \${i + 1}\`))

const loadMore = (index, done) => {
  // fetch the next page…
  done() // done() re-arms the scroller
}
<\/script>`

const usageAnimated = `<q-infinite-scroll :offset="200" animated @load="loadMore">
  <div class="item" v-for="it in items" :key="it">{{ it }}</div>
</q-infinite-scroll>
<!-- animated: each new item fades + slides up on mount -->`

const usageSlot = `<q-infinite-scroll :offset="200" @load="loadMore">
  <div class="item" v-for="it in items" :key="it">{{ it }}</div>
  <template #loading>
    <q-spinner />
  </template>
</q-infinite-scroll>`

const usageSilent = `<q-infinite-scroll :offset="200" hide-loading animated @load="loadMore">
  <div class="item" v-for="it in items" :key="it">{{ it }}</div>
</q-infinite-scroll>
<!-- hide-loading: no spinner — items just appear (TikTok / Instagram style) -->`

const scriptData = `import { ref } from "vue"

const items = ref(Array.from({ length: 20 }, (_, i) => "Item " + (i + 1)))
let seq = 20
const total = 60

const loadMore = (index, done) => {
  setTimeout(() => {
    const next = Math.min(seq + 10, total)
    for (let i = seq + 1; i <= next; i++) items.value.push("Item " + i)
    seq = next
    done()
  }, 700)
}`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Infinite Scroll</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Loads more content automatically when you approach the bottom of the page or
      of a scrollable container. <b>&lt;q-infinite-scroll&gt;</b> emits
      <code>load(index, done)</code> when the scroll position is within
      <code>offset</code> px of the bottom — call <code>done()</code> when your
      fetch finishes to re-arm the scroller.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        20 items are loaded first; scrolling near the bottom appends 10 more (60
        max). The spinner shows while <code>done()</code> hasn't been called.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-scroll">
          <q-infinite-scroll :offset="200" @load="loadMore">
            <div v-for="it in items" :key="it" class="demo-item">
              <q-icon name="lucide:inbox" color="primary" size="16px" />
              <span>{{ it }}</span>
            </div>
          </q-infinite-scroll>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Animated ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Animated</h2>
      <p class="doc-note">
        <code>animated</code> fades + slides each newly appended item up when it
        mounts (0.3s, disabled with <code>prefers-reduced-motion</code>).
      </p>

      <docs-demo :code="usageAnimated" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-scroll">
          <q-infinite-scroll :offset="200" animated @load="loadMore">
            <div v-for="it in items" :key="it" class="demo-item">
              <q-icon name="lucide:inbox" color="primary" size="16px" />
              <span>{{ it }}</span>
            </div>
          </q-infinite-scroll>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Custom loading ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Custom loading</h2>
      <p class="doc-note">
        The <code>#loading</code> slot replaces the default spinner — any content
        works. Combine with <code>disable</code> to stop loading (e.g. no more
        pages).
      </p>

      <docs-demo :code="usageSlot" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-scroll">
          <q-infinite-scroll :offset="200" @load="loadMore">
            <div v-for="it in items" :key="it" class="demo-item">
              <q-icon name="lucide:inbox" color="primary" size="16px" />
              <span>{{ it }}</span>
            </div>
            <template #loading>
              <q-btn unelevated dense color="primary" no-caps :loading="true" label="Loading more…" />
            </template>
          </q-infinite-scroll>
        </div>
      </docs-demo>

      <h3 class="doc-h3">Silent loading</h3>
      <p class="doc-note">
        <code>hide-loading</code> hides the indicator entirely — content just
        appears as you scroll (the TikTok / Instagram feed pattern). Combine with
        <code>animated</code> for a subtle entrance.
      </p>
      <docs-demo :code="usageSilent" lang="html" filename="App.vue" :script="scriptData">
        <div class="demo-scroll">
          <q-infinite-scroll :offset="200" hide-loading animated @load="loadMore">
            <div v-for="it in items" :key="it" class="demo-item">
              <q-icon name="lucide:inbox" color="primary" size="16px" />
              <span>{{ it }}</span>
            </div>
          </q-infinite-scroll>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QInfiniteScroll API</h2>
      <docs-api :comp="infiniteScroll" :source="infiniteScrollSource" />
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

/* — démos — */
.demo-scroll {
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  padding: 8px;
  background: #fff;
}
.demo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--foreground);
}
.demo-item:nth-child(odd) {
  background: rgb(0 0 0 / 0.03);
}
</style>
