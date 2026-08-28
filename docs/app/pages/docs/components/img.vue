<script setup lang="ts">
// Img — QImg : image responsive (ratio, object-fit) avec loading, placeholder et erreur.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const img = useComponent(() => "QImg")
const imgSource = componentSource("QImg")
const tag = componentTag("QImg")

const photo =
  "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
// Même image en basse résolution (blur-up) : w=40 & q=40
const thumb =
  "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=40&w=40&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

// — Démos —
const forcedLoading = ref(false)
const toggleLoading = () => {
  forcedLoading.value = true
  setTimeout(() => (forcedLoading.value = false), 2200)
}

const basicCode = `<q-img src="https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ratio="16/9" />`

const loadingCode = `<q-img
  src="https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ratio="16/9"
  :loading="loading"
  spinner-color="primary"
  spinner-size="42px"
/>`

const placeholderCode = `<q-img
  src="https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  placeholder-src="https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=40&w=40&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ratio="16/9"
/>
<!-- the low-res placeholder shows while the full image loads, then fades out -->`

const captionCode = `<q-img
  src="https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ratio="16/9"
  alt="Workspace"
>
  <q-text-caption position="bottom" absolute fit title="Morning workspace" subtitle="Unsplash · free to use" />
</q-img>`

const errorCode = `<q-img src="https://example.com/broken.jpg" ratio="16/9">
  <template #error>
    <div class="q-img__error">
      <q-icon name="lucide:image-off" size="28px" />
      <span>Failed to load</span>
    </div>
  </template>
</q-img>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Image</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A responsive image container. <b>&lt;q-img&gt;</b> keeps a
      <code>ratio</code> (aspect-ratio), fits the picture with
      <code>object-fit</code> (<code>cover</code> / <code>contain</code>), and
      handles the full loading lifecycle: spinner, low-res
      <code>placeholder-src</code> and an <code>#error</code> slot.
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        <code>ratio="16/9"</code> fixes the box before the image arrives —
        no layout shift.
      </p>

      <docs-demo :code="basicCode" lang="html" filename="App.vue">
        <div class="demo-img">
          <q-img :src="photo" ratio="16/9" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Loading ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Loading</h2>
      <p class="doc-note">
        A spinner (or a custom <code>#loading</code> slot) appears automatically
        while the image loads. The <code>loading</code> prop forces the state —
        useful for skeletons and optimistic UIs.
      </p>

      <docs-demo :code="loadingCode" lang="html" filename="App.vue">
        <div class="demo-img">
          <q-img
            :src="photo"
            ratio="16/9"
            :loading="forcedLoading"
            spinner-color="primary"
            spinner-size="42px"
          />
          <p class="demo-p demo-p--action">
            <q-btn size="sm" outline color="primary" no-caps :loading="forcedLoading" label="Simulate loading" @click="toggleLoading" />
          </p>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Placeholder ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Placeholder</h2>
      <p class="doc-note">
        <code>placeholder-src</code> displays a low-resolution image while the full
        image loads — the classic blur-up pattern. On a fast connection it flashes
        briefly; the main image fades in when ready.
      </p>

      <docs-demo :code="placeholderCode" lang="html" filename="App.vue">
        <div class="demo-img">
          <q-img :src="photo" :placeholder-src="thumb" ratio="16/9" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Overlay & caption ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Overlay &amp; caption</h2>
      <p class="doc-note">
        The default slot is an overlay on top of the image — ideal for captions,
        badges and actions pinned to the bottom edge.
      </p>

      <docs-demo :code="captionCode" lang="html" filename="App.vue">
        <div class="demo-img">
          <q-img :src="photo" ratio="16/9" alt="Workspace">
            <q-text-caption
              position="bottom"
              absolute
              fit
              title="Morning workspace"
              subtitle="Unsplash · free to use"
            />
          </q-img>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Error ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Error</h2>
      <p class="doc-note">
        When <code>src</code> fails to load, the <code>#error</code> slot replaces
        the spinner — any content works.
      </p>

      <docs-demo :code="errorCode" lang="html" filename="App.vue">
        <div class="demo-img">
          <q-img src="https://example.com/broken.jpg" ratio="16/9">
            <template #error>
              <div class="demo-img__error">
                <q-icon name="lucide:image-off" size="28px" />
                <span>Failed to load</span>
              </div>
            </template>
          </q-img>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QImg</h2>
      <docs-api :comp="img" :source="imgSource" />
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

.demo-img {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}
.demo-img :deep(.q-img) {
  border-radius: 12px;
  overflow: hidden;
}
.demo-p--action {
  margin: 14px 0 0;
  text-align: center;
}
.demo-img__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #8b93a1;
  font-size: 13px;
}
</style>
