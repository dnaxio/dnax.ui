<script setup lang="ts">
// Message Scroller — documentation complète de la famille :
// QMessageScrollerProvider + QMessageScroller + QMessageScrollerViewport
// + QMessageScrollerContent + QMessageScrollerItem + QMessageScrollerButton.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const provider = useComponent(() => "QMessageScrollerProvider")
const scroller = useComponent(() => "QMessageScroller")
const viewport = useComponent(() => "QMessageScrollerViewport")
const content = useComponent(() => "QMessageScrollerContent")
const item = useComponent(() => "QMessageScrollerItem")
const button = useComponent(() => "QMessageScrollerButton")

const providerSource = componentSource("QMessageScrollerProvider")
const scrollerSource = componentSource("QMessageScroller")
const viewportSource = componentSource("QMessageScrollerViewport")
const contentSource = componentSource("QMessageScrollerContent")
const itemSource = componentSource("QMessageScrollerItem")
const buttonSource = componentSource("QMessageScrollerButton")

const tag = componentTag("QMessageScroller")

// — Démo interactive : fil de messages avec auto-scroll —
const messages = ref([
  { id: "m1", text: "Welcome to the demo! 👋", from: "them" },
  { id: "m2", text: "Hey! Does the scroller stay pinned to the bottom?", from: "me" },
  { id: "m3", text: "It does — as long as auto-scroll is on and you are at the live edge.", from: "them" },
  { id: "m4", text: "Try sending a message below.", from: "them" },
])
let msgSeq = 4
const sendMessage = () => {
  msgSeq += 1
  messages.value.push({ id: `m${msgSeq}`, text: `Auto-scrolled message #${msgSeq} 🎉`, from: "me" })
}

const usageTranscript = `<q-message-scroller-provider
  auto-scroll
  default-scroll-position="end"
>
  <q-message-scroller class="demo-scroller">
    <q-message-scroller-viewport>
      <q-message-scroller-content>
        <q-message-scroller-item
          v-for="m in messages"
          :key="m.id"
          :message-id="m.id"
        >
          <q-bubble
            :align="m.from === 'me' ? 'end' : 'start'"
            :variant="m.from === 'me' ? 'default' : 'secondary'"
          >
            <q-bubble-content>{{ m.text }}</q-bubble-content>
          </q-bubble>
        </q-message-scroller-item>
      </q-message-scroller-content>
    </q-message-scroller-viewport>
    <q-message-scroller-button direction="end" label="Jump to latest" />
  </q-message-scroller>
</q-message-scroller-provider>`

const usageLive = `<q-message-scroller-provider auto-scroll default-scroll-position="end">
  <q-message-scroller class="demo-scroller">
    <q-message-scroller-viewport>
      <q-message-scroller-content>
        <q-message-scroller-item v-for="m in messages" :key="m.id" :message-id="m.id">
          <q-bubble
            :align="m.from === 'me' ? 'end' : 'start'"
            :variant="m.from === 'me' ? 'default' : 'secondary'"
          >
            <q-bubble-content>{{ m.text }}</q-bubble-content>
          </q-bubble>
        </q-message-scroller-item>
      </q-message-scroller-content>
    </q-message-scroller-viewport>
    <q-message-scroller-button direction="end" label="Jump to latest" />
  </q-message-scroller>

  <!-- messages: ref of { id, text, from } — sendMessage() appends one -->
  <div class="demo-scroller-actions">
    <q-btn icon="lucide:send" label="Send message" @click="sendMessage" />
  </div>
</q-message-scroller-provider>`

const usageAnchor = `<q-message-scroller-provider
  auto-scroll
  default-scroll-position="last-anchor"
  :scroll-previous-item-peek="48"
>
  <q-message-scroller class="demo-scroller">
    <q-message-scroller-viewport>
      <q-message-scroller-content>
        <q-message-scroller-item
          v-for="turn in turns"
          :key="turn.id"
          :message-id="turn.id"
          :scroll-anchor="turn.anchor"
        >
          <q-bubble align="start" variant="secondary">
            <q-bubble-content>{{ turn.text }}</q-bubble-content>
          </q-bubble>
        </q-message-scroller-item>
      </q-message-scroller-content>
    </q-message-scroller-viewport>
    <q-message-scroller-button direction="end" />
  </q-message-scroller>
</q-message-scroller-provider>`

const usageItem = `<q-message-scroller-item message-id="msg-42" :scroll-anchor="false">
  <q-bubble align="end">
    <q-bubble-content>One row of the transcript.</q-bubble-content>
  </q-bubble>
</q-message-scroller-item>`

const usageButton = `<!-- jump to the live edge (bottom) -->
<q-message-scroller-button direction="end" label="Jump to latest" />

<!-- jump back to the top -->
<q-message-scroller-button direction="start" label="Jump to oldest" />`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Message Scroller</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      The Message Scroller keeps a chat transcript pinned to the live edge,
      preserves the reading position when history is prepended, and exposes jump
      controls. The family is made of six components led by
      <b>&lt;q-message-scroller-provider&gt;</b> (the scroll state) and
      <b>&lt;q-message-scroller&gt;</b> (the layout), plus a viewport, a content
      log, per-message items and a floating button. Composables like
      <code>useMessageScroller</code> drive it from outside.
    </p>

    <!-- ═══════ QMessageScrollerProvider ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QMessageScrollerProvider — scroll state</h2>
      <p class="doc-note">
        Owns all scroll state via <code>provide/inject</code>: pinning to the
        live edge (<code>auto-scroll</code>), the opening position
        (<code>default-scroll-position</code>), turn anchoring and visibility.
        It also exports three composables — <code>useMessageScroller()</code>
        (jump commands), <code>useMessageScrollerVisibility()</code> (current
        anchor + visible ids) and <code>useMessageScrollerScrollable()</code>
        (edges still reachable).
      </p>

      <docs-demo :code="usageTranscript" lang="html" filename="App.vue">
        <q-message-scroller-provider auto-scroll default-scroll-position="end">
          <q-message-scroller class="demo-scroller">
            <q-message-scroller-viewport>
              <q-message-scroller-content>
                <q-message-scroller-item v-for="m in messages" :key="m.id" :message-id="m.id">
                  <q-bubble
                    :align="m.from === 'me' ? 'end' : 'start'"
                    :variant="m.from === 'me' ? 'default' : 'secondary'"
                  >
                    <q-bubble-content>{{ m.text }}</q-bubble-content>
                  </q-bubble>
                </q-message-scroller-item>
              </q-message-scroller-content>
            </q-message-scroller-viewport>
            <q-message-scroller-button direction="end" label="Jump to latest" />
          </q-message-scroller>
        </q-message-scroller-provider>
      </docs-demo>

      <h3 class="doc-h3">Live edge</h3>
      <docs-demo :code="usageLive" lang="html" filename="App.vue">
        <q-message-scroller-provider auto-scroll default-scroll-position="end">
          <q-message-scroller class="demo-scroller">
            <q-message-scroller-viewport>
              <q-message-scroller-content>
                <q-message-scroller-item v-for="m in messages" :key="m.id" :message-id="m.id">
                  <q-bubble
                    :align="m.from === 'me' ? 'end' : 'start'"
                    :variant="m.from === 'me' ? 'default' : 'secondary'"
                  >
                    <q-bubble-content>{{ m.text }}</q-bubble-content>
                  </q-bubble>
                </q-message-scroller-item>
              </q-message-scroller-content>
            </q-message-scroller-viewport>
            <q-message-scroller-button direction="end" label="Jump to latest" />
          </q-message-scroller>

          <div class="demo-scroller-actions">
            <q-btn icon="lucide:send" label="Send message" @click="sendMessage" />
          </div>
        </q-message-scroller-provider>
      </docs-demo>

      <h3 class="doc-h3">Turn anchoring</h3>
      <docs-demo :code="usageAnchor" lang="html" filename="App.vue">
        <q-message-scroller-provider auto-scroll default-scroll-position="last-anchor" :scroll-previous-item-peek="48">
          <q-message-scroller class="demo-scroller">
            <q-message-scroller-viewport>
              <q-message-scroller-content>
                <q-message-scroller-item v-for="m in messages" :key="m.id" :message-id="m.id" :scroll-anchor="m.from === 'them'">
                  <q-bubble
                    :align="m.from === 'me' ? 'end' : 'start'"
                    :variant="m.from === 'me' ? 'default' : 'secondary'"
                  >
                    <q-bubble-content>{{ m.text }}</q-bubble-content>
                  </q-bubble>
                </q-message-scroller-item>
              </q-message-scroller-content>
            </q-message-scroller-viewport>
            <q-message-scroller-button direction="end" />
          </q-message-scroller>
        </q-message-scroller-provider>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="provider" :source="providerSource" />
    </section>

    <!-- ═══════ QMessageScroller ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QMessageScroller — the container</h2>
      <p class="doc-note">
        The layout container: a relative flex column that hosts the viewport and
        the floating jump button. The height is up to you — set it via a class or
        let a parent flex context stretch it.
      </p>
      <q-syntax :code="usageTranscript" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="scroller" :source="scrollerSource" />
    </section>

    <!-- ═══════ QMessageScrollerViewport ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QMessageScrollerViewport — scrollable area</h2>
      <p class="doc-note">
        The native scrollable area. It observes the content to keep the reading
        position when history is prepended (<code>preserve-scroll-on-prepend</code>),
        follows the live edge while <code>auto-scroll</code> is on, and applies
        <code>default-scroll-position</code> on mount.
      </p>
      <q-syntax :code="usageTranscript" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="viewport" :source="viewportSource" />
    </section>

    <!-- ═══════ QMessageScrollerContent ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QMessageScrollerContent — the log</h2>
      <p class="doc-note">
        The transcript log with <code>role="log"</code> and
        <code>aria-relevant="additions"</code>, so screen readers announce new
        messages. Pass <code>aria-busy</code> while a message is streaming.
      </p>
      <q-syntax :code="usageTranscript" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="content" :source="contentSource" />
    </section>

    <!-- ═══════ QMessageScrollerItem ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QMessageScrollerItem — one message row</h2>
      <p class="doc-note">
        One row of the transcript. <code>message-id</code> is the stable
        identifier used for anchoring, visibility and jumps (auto-generated when
        omitted); <code>scroll-anchor</code> marks the start of a turn — the
        scroller then positions it near the top with a peek of the previous
        message.
      </p>
      <q-syntax :code="usageItem" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="item" :source="itemSource" />
    </section>

    <!-- ═══════ QMessageScrollerButton ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QMessageScrollerButton — jump button</h2>
      <p class="doc-note">
        A floating button that appears only while content remains in the given
        direction. <code>direction="end"</code> jumps to the live edge,
        <code>direction="start"</code> to the top; the scroll behavior is
        controlled with <code>behavior</code>.
      </p>
      <q-syntax :code="usageButton" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="button" :source="buttonSource" />
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
.doc-h3 {
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8b93a1;
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

/* espace entre les deux blocs docs-demo (single / multiple) */
.docs-demo + h3,
.demo-block + h3 {
  margin-top: 32px;
}
.demo-p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #5b6472;
}

/* — démos Message Scroller — */
.demo-scroller {
  width: 100%;
  max-width: 480px;
  height: 320px;
  border: 1px solid rgb(0 0 0 / 0.08);
  border-radius: 12px;
  background: #fafbfc;
  padding: 12px;
}
.demo-scroller-actions {
  margin-top: 10px;
  max-width: 480px;
}
</style>
