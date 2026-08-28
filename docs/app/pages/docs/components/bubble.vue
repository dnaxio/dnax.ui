<script setup lang="ts">
// Bubble — documentation complète de la famille :
// QBubble + QBubbleContent + QBubbleGroup + QBubbleReactions.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const bubble = useComponent(() => "QBubble")
const bubbleContent = useComponent(() => "QBubbleContent")
const bubbleGroup = useComponent(() => "QBubbleGroup")
const bubbleReactions = useComponent(() => "QBubbleReactions")

const bubbleSource = componentSource("QBubble")
const bubbleContentSource = componentSource("QBubbleContent")
const bubbleGroupSource = componentSource("QBubbleGroup")
const bubbleReactionsSource = componentSource("QBubbleReactions")

const tag = componentTag("QBubble")

const usageChat = `<q-bubble-group class="demo-chat">
  <div class="demo-bubble-meta">Sarah · 14:02</div>
  <q-bubble align="start" variant="secondary">
    <q-bubble-content>Hey! Did you see the new design system?</q-bubble-content>
  </q-bubble>
  <q-bubble align="start" variant="secondary">
    <q-bubble-content>The card components are really nice.</q-bubble-content>
  </q-bubble>

  <div class="demo-bubble-meta demo-bubble-meta--end">You · 14:03</div>
  <q-bubble align="end">
    <q-bubble-content>Yes! I already used them in the dashboard.</q-bubble-content>
  </q-bubble>
</q-bubble-group>`

const usageReactions = `<q-bubble align="end">
  <q-bubble-content>Great work, team! 🎉</q-bubble-content>
  <q-bubble-reactions>
    <button type="button" aria-label="Like">👍</button>
    <button type="button" aria-label="Heart">❤️</button>
    <button type="button" aria-label="Clap">👏</button>
  </q-bubble-reactions>
</q-bubble>`

const usageVariants = `<q-bubble variant="default">
  <q-bubble-content>Default</q-bubble-content>
</q-bubble>
<q-bubble variant="secondary">
  <q-bubble-content>Secondary</q-bubble-content>
</q-bubble>
<q-bubble variant="muted">
  <q-bubble-content>Muted</q-bubble-content>
</q-bubble>
<q-bubble variant="tinted">
  <q-bubble-content>Tinted</q-bubble-content>
</q-bubble>
<q-bubble variant="outline">
  <q-bubble-content>Outline</q-bubble-content>
</q-bubble>
<q-bubble variant="ghost">
  <q-bubble-content>Ghost</q-bubble-content>
</q-bubble>
<q-bubble variant="destructive">
  <q-bubble-content>Destructive</q-bubble-content>
</q-bubble>`

const usageContent = `<q-bubble align="end" variant="outline">
  <q-bubble-content>Rendered as a link with as-child:</q-bubble-content>
</q-bubble>

<q-bubble variant="tinted" as="button" as-child>
  <q-bubble-content>Clickable bubble</q-bubble-content>
</q-bubble>`

const usageReactionsAlign = `<q-bubble align="start">
  <q-bubble-content>Left-aligned reactions:</q-bubble-content>
  <q-bubble-reactions side="bottom" align="start">
    <span>❤️</span>
    <span>😂</span>
  </q-bubble-reactions>
</q-bubble>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Bubble</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      Bubbles render chat messages as rounded containers aligned to the start or
      the end of the conversation. The family is made of four components:
      <b>&lt;q-bubble&gt;</b> (the bubble itself), <b>&lt;q-bubble-content&gt;</b>
      (its content), <b>&lt;q-bubble-group&gt;</b> (consecutive bubbles from the
      same sender) and <b>&lt;q-bubble-reactions&gt;</b> (reactions anchored to a
      bubble edge). Seven variants cover everything from the default to
      destructive.
    </p>

    <!-- ═══════ QBubble ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBubble — the bubble</h2>

      <docs-demo :code="usageChat" lang="html" filename="App.vue">
        <q-bubble-group class="demo-chat">
          <div class="demo-bubble-meta">Sarah · 14:02</div>
          <q-bubble align="start" variant="secondary">
            <q-bubble-content>Hey! Did you see the new design system?</q-bubble-content>
          </q-bubble>
          <q-bubble align="start" variant="secondary">
            <q-bubble-content>The card components are really nice.</q-bubble-content>
          </q-bubble>

          <div class="demo-bubble-meta demo-bubble-meta--end">You · 14:03</div>
          <q-bubble align="end">
            <q-bubble-content>Yes! I already used them in the dashboard.</q-bubble-content>
          </q-bubble>
        </q-bubble-group>
      </docs-demo>

      <h3 class="doc-h3">Variants</h3>
      <docs-demo :code="usageVariants" lang="html" filename="App.vue">
        <div class="demo-variants">
          <q-bubble variant="default">
            <q-bubble-content>Default</q-bubble-content>
          </q-bubble>
          <q-bubble variant="secondary">
            <q-bubble-content>Secondary</q-bubble-content>
          </q-bubble>
          <q-bubble variant="muted">
            <q-bubble-content>Muted</q-bubble-content>
          </q-bubble>
          <q-bubble variant="tinted">
            <q-bubble-content>Tinted</q-bubble-content>
          </q-bubble>
          <q-bubble variant="outline">
            <q-bubble-content>Outline</q-bubble-content>
          </q-bubble>
          <q-bubble variant="ghost">
            <q-bubble-content>Ghost</q-bubble-content>
          </q-bubble>
          <q-bubble variant="destructive">
            <q-bubble-content>Destructive</q-bubble-content>
          </q-bubble>
        </div>
      </docs-demo>

      <h3 class="doc-h3">Reactions</h3>
      <docs-demo :code="usageReactions" lang="html" filename="App.vue">
        <div class="demo-chat">
          <q-bubble align="end">
            <q-bubble-content>Great work, team! 🎉</q-bubble-content>
            <q-bubble-reactions>
              <button type="button" aria-label="Like">👍</button>
              <button type="button" aria-label="Heart">❤️</button>
              <button type="button" aria-label="Clap">👏</button>
            </q-bubble-reactions>
          </q-bubble>
        </div>
      </docs-demo>

      <h3 class="doc-h3">API</h3>
      <docs-api :comp="bubble" :source="bubbleSource" />
    </section>

    <!-- ═══════ QBubbleContent ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBubbleContent — bubble content</h2>
      <p class="doc-note">
        The styled content area of the bubble. With <code>as-child</code>, the
        style is forwarded to the single child (a button or link) — perfect for
        interactive bubbles.
      </p>
      <q-syntax :code="usageContent" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="bubbleContent" :source="bubbleContentSource" />
    </section>

    <!-- ═══════ QBubbleGroup ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBubbleGroup — consecutive bubbles</h2>
      <p class="doc-note">
        A column wrapper for several consecutive bubbles from the same sender,
        with a 4px gap between them. Timestamps or sender names can be rendered
        as siblings inside the group.
      </p>
      <q-syntax :code="usageChat" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="bubbleGroup" :source="bubbleGroupSource" />
    </section>

    <!-- ═══════ QBubbleReactions ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QBubbleReactions — anchored reactions</h2>
      <p class="doc-note">
        A pill anchored to the bubble edge (<code>side</code> top or bottom,
        <code>align</code> start or end). Combined with the bubble's
        <code>position: relative</code> it overlaps the edge — leave a little
        room below the bubble so the pill does not collide with the next message.
      </p>
      <q-syntax :code="usageReactionsAlign" lang="html" filename="App.vue" copy />
      <h3 class="doc-h3">API</h3>
      <docs-api :comp="bubbleReactions" :source="bubbleReactionsSource" />
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

/* — démos Bubble — */
.demo-chat {
  max-width: 480px;
  padding-bottom: 24px; /* place pour les réactions ancrées */
}
.demo-bubble-meta {
  margin: 0 0 2px;
  font-size: 12px;
  color: #8b93a1;
}
.demo-bubble-meta--end {
  margin-top: 14px;
  text-align: right;
}
.demo-variants {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 480px;
}
.demo-variants .q-bubble__reactions button,
.demo-chat .q-bubble__reactions button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 2px;
}
</style>
