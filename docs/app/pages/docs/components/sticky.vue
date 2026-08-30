<script setup lang="ts">
// Sticky — documentation du composant QSticky : contenu épinglé au viewport pendant le scroll.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const sticky = useComponent(() => "QSticky")
const stickySource = componentSource("QSticky")
const tag = componentTag("QSticky")

// — Réfs des conteneurs de démo —
const boxBound = ref<HTMLElement>()
const boxBottom = ref<HTMLElement>()
const boxEvents = ref<HTMLElement>()

// — États des démos —
const stuck = ref(false)
const stuckOffset = ref(false)
const stuckBound = ref(false)
const stuckBottom = ref(false)
const evScrollTop = ref(0)
const evFixed = ref(false)
const evChanges = ref(0)

const usageBasic = `<q-sticky @change="stuck = $event">
  <div class="bar">Sticky bar <span v-if="stuck">· stuck</span></div>
</q-sticky>
<p v-for="i in 24" :key="i" class="line">Line {{ i }} — keep scrolling…</p>`

const usageOffset = `<q-sticky :offset-top="16" @change="stuck = $event">
  <div class="bar">Pinned 16px from the top</div>
</q-sticky>
<p v-for="i in 24" :key="i" class="line">Line {{ i }} — keep scrolling…</p>`

const usageBound = `<div ref="box" class="viewport">
  <q-sticky :container="box">
    <div class="bar bar--accent">Stays inside its container</div>
  </q-sticky>
  <p v-for="i in 14" :key="i" class="line">Line {{ i }} — the bar stops at the container's bottom edge…</p>
</div>`

const usageBottom = `<div ref="box" class="viewport">
  <p v-for="i in 14" :key="i" class="line">Line {{ i }} — the action stays pinned to the bottom…</p>
  <q-sticky position="bottom" :offset-bottom="16" :container="box">
    <q-btn color="primary" unelevated no-caps icon="shopping-cart" label="Add to cart" class="buy" />
  </q-sticky>
</div>`

const usageEvents = `<div ref="box" class="viewport">
  <q-sticky
    :container="box"
    @scroll="({ scrollTop, isFixed }) => { ev = scrollTop; fixed = isFixed }"
    @change="changes++"
  >
    <div class="bar bar--outline">
      scrollTop {{ ev }} · fixed {{ fixed }} · changes {{ changes }}
    </div>
  </q-sticky>
  <p v-for="i in 14" :key="i" class="line">Line {{ i }} — watch the counters update as you scroll…</p>
</div>`

const scriptBasic = `import { ref } from "vue"

const stuck = ref(false)`

const scriptBound = `import { ref } from "vue"

const box = ref<HTMLElement>()`

const scriptEvents = `import { ref } from "vue"

const box = ref<HTMLElement>()
const ev = ref(0)
const fixed = ref(false)
const changes = ref(0)`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Sticky</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Pins content to the <b>top</b> or <b>bottom</b> of the viewport while you
      scroll: <b>&lt;q-sticky&gt;</b> keeps its place in the layout (a same-size
      placeholder reserves the space) and switches to <code>fixed</code> once it
      reaches <code>offset-top</code> / <code>offset-bottom</code>. Pass a
      <code>container</code> to keep it inside that element — it then stops at
      the container's edge instead of following the scroll forever. Emits
      <code>@scroll</code> (<code>{ scrollTop, isFixed }</code>) and
      <code>@change</code> (<code>isFixed</code>).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        Scroll down the page: the bar pins to the top of the viewport and the
        <code>@change</code> event flips the badge.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-sticky @change="stuck = $event">
          <div class="demo-bar">Sticky bar <span v-if="stuck" class="demo-chip">stuck</span></div>
        </q-sticky>
        <p v-for="i in 24" :key="i" class="demo-line">
          Line {{ i }} — keep scrolling…
        </p>
      </docs-demo>
    </section>

    <!-- ═══════ Offset ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Offset</h2>
      <p class="doc-note">
        <code>:offset-top="16"</code> leaves a 16&nbsp;px gap between the pinned
        bar and the top of the viewport.
      </p>

      <docs-demo :code="usageOffset" lang="html" filename="App.vue" :script="scriptBasic">
        <q-sticky :offset-top="16" @change="stuckOffset = $event">
          <div class="demo-bar demo-bar--soft">Pinned 16px from the top</div>
        </q-sticky>
        <p v-for="i in 24" :key="i" class="demo-line">
          Line {{ i }} — keep scrolling…
        </p>
      </docs-demo>
    </section>

    <!-- ═══════ Container ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Container bounds</h2>
      <p class="doc-note">
        With <code>:container="box"</code> the bar is pushed down when it reaches
        the bottom edge of the container — it never escapes it.
      </p>

      <docs-demo :code="usageBound" lang="html" filename="App.vue" :script="scriptBound">
        <div ref="boxBound" class="demo-viewport">
          <q-sticky :container="boxBound">
            <div class="demo-bar demo-bar--accent">Stays inside its container</div>
          </q-sticky>
          <p v-for="i in 14" :key="i" class="demo-line">
            Line {{ i }} — the bar stops at the container's bottom edge…
          </p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Bottom ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Bottom position</h2>
      <p class="doc-note">
        <code>position="bottom"</code> pins the action to the bottom of the
        viewport — the classic sticky “add to cart” button.
      </p>

      <docs-demo :code="usageBottom" lang="html" filename="App.vue" :script="scriptBound">
        <div ref="boxBottom" class="demo-viewport">
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
      </docs-demo>
    </section>

    <!-- ═══════ Events ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Events</h2>
      <p class="doc-note">
        <code>@scroll</code> fires on every scroll with
        <code>{ scrollTop, isFixed }</code>; <code>@change</code> fires once per
        state switch.
      </p>

      <docs-demo :code="usageEvents" lang="html" filename="App.vue" :script="scriptEvents">
        <div ref="boxEvents" class="demo-viewport">
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
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QSticky API</h2>
      <docs-api :comp="sticky" :source="stickySource" />
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
.doc-lead code {
  background: rgba(25, 118, 210, 0.08);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 5px;
  font-size: 0.92em;
}

/* — barre collante — */
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

/* — lignes de remplissage — */
.demo-line {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #8b93a1;
}

/* — conteneur de démo (le sticky y reste borné) — */
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
