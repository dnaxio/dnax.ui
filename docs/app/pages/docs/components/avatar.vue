<script setup lang="ts">
// Avatar — QAvatar : image ronde avec fallback automatique (initiales, icône ou slot).
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const avatar = useComponent(() => "QAvatar")
const avatarSource = componentSource("QAvatar")
const tag = componentTag("QAvatar")

// — Photos de démonstration (Unsplash) —
const photo1 =
  "https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const photo2 =
  "https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const sizesCode = `<q-avatar size="xs" src="photo" alt="Alex" />
<q-avatar size="sm" src="photo" alt="Alex" />
<q-avatar size="md" src="photo" alt="Alex" />
<q-avatar size="lg" src="photo" alt="Alex" />
<q-avatar size="xl" src="photo" alt="Alex" />
<q-avatar size="7rem" src="photo" alt="Alex" />`

const photosCode = `<q-avatar size="xl" :src="photo1" alt="Alex" />
<q-avatar size="xl" :src="photo2" alt="Sam" />`

const colorsCode = `<q-avatar color="primary" alt="Jean Dupont" />
<q-avatar color="secondary" alt="Marie Curie" />
<q-avatar color="positive" alt="Paul Martin" />
<q-avatar color="warning" text-color="dark" alt="Sara Lee" />
<q-avatar color="#7c3aed" alt="Ada Lovelace" />`

const iconsCode = `<q-avatar icon="lucide:user" color="primary" />
<q-avatar icon="lucide:rocket" color="secondary" />
<q-avatar icon="lucide:zap" color="warning" />
<q-avatar icon="lucide:star" color="positive" />`

const shapesCode = `<q-avatar src="photo" alt="Alex" />       <!-- circle (default) -->
<q-avatar src="photo" alt="Alex" rounded />      <!-- rounded corners -->
<q-avatar src="photo" alt="Alex" square />       <!-- square -->`

const fallbackCode = `<q-avatar src="broken.jpg" alt="Jean Dupont" />    <!-- initials from alt -->
<q-avatar src="broken.jpg" icon="lucide:user" color="secondary" /> <!-- icon -->
<q-avatar src="broken.jpg" color="positive">                       <!-- custom slot -->
  <q-icon name="lucide:heart" color="white" size="28px" />
</q-avatar>`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Avatar</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A circular image with an automatic fallback. <b>&lt;q-avatar&gt;</b> renders a
      picture from <code>src</code>; if it fails to load (or is missing), it falls
      back to <b>initials</b> computed from <code>alt</code>, an Iconify
      <code>icon</code>, or a custom slot.
    </p>

    <!-- ═══════ Sizes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Sizes</h2>
      <p class="doc-note">
        Presets <code>xs</code> → <code>xl</code>, or any CSS size
        (<code>size="7rem"</code>). The font scales automatically (40% of the size).
      </p>

      <docs-demo :code="sizesCode" lang="html" filename="App.vue">
        <div class="demo-row demo-row--avatars">
          <q-avatar size="xs" :src="photo1" alt="Alex" />
          <q-avatar size="sm" :src="photo1" alt="Alex" />
          <q-avatar size="md" :src="photo1" alt="Alex" />
          <q-avatar size="lg" :src="photo1" alt="Alex" />
          <q-avatar size="xl" :src="photo1" alt="Alex" />
          <q-avatar size="7rem" :src="photo1" alt="Alex" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Photos ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Photos</h2>
      <p class="doc-note">
        Pass any image URL in <code>src</code> — the avatar is perfectly round and
        keeps its aspect ratio via <code>object-fit: cover</code>.
      </p>

      <docs-demo :code="photosCode" lang="html" filename="App.vue">
        <div class="demo-row demo-row--avatars">
          <q-avatar size="xl" :src="photo1" alt="Alex" />
          <q-avatar size="xl" :src="photo2" alt="Sam" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Colors & initials ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Colors &amp; initials</h2>
      <p class="doc-note">
        Without an image, the background <code>color</code> (token or hex) is applied
        and the initials from <code>alt</code> are shown — the foreground
        (<code>text-color</code>) is computed automatically for contrast.
      </p>

      <docs-demo :code="colorsCode" lang="html" filename="App.vue">
        <div class="demo-row demo-row--avatars">
          <q-avatar color="primary" alt="Jean Dupont" />
          <q-avatar color="secondary" alt="Marie Curie" />
          <q-avatar color="positive" alt="Paul Martin" />
          <q-avatar color="warning" text-color="dark" alt="Sara Lee" />
          <q-avatar color="#7c3aed" alt="Ada Lovelace" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Icons ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Icons</h2>
      <p class="doc-note">
        An Iconify <code>icon</code> as fallback — useful for roles
        (<code>lucide:user</code>) or statuses.
      </p>

      <docs-demo :code="iconsCode" lang="html" filename="App.vue">
        <div class="demo-row demo-row--avatars">
          <q-avatar icon="lucide:user" color="primary" />
          <q-avatar icon="lucide:rocket" color="secondary" />
          <q-avatar icon="lucide:zap" color="warning" />
          <q-avatar icon="lucide:star" color="positive" />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Shapes ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Shapes</h2>
      <p class="doc-note">
        Circle by default; <code>rounded</code> for slightly rounded corners,
        <code>square</code> for sharp edges.
      </p>

      <docs-demo :code="shapesCode" lang="html" filename="App.vue">
        <div class="demo-row demo-row--avatars">
          <q-avatar size="lg" :src="photo2" alt="Sam" />
          <q-avatar size="lg" :src="photo2" alt="Sam" rounded />
          <q-avatar size="lg" :src="photo2" alt="Sam" square />
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ Fallback ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Fallback</h2>
      <p class="doc-note">
        When <code>src</code> is missing or fails to load, the avatar shows — in
        order — a custom slot, the <code>icon</code>, or the initials from
        <code>alt</code>.
      </p>

      <docs-demo :code="fallbackCode" lang="html" filename="App.vue">
        <div class="demo-row demo-row--avatars">
          <q-avatar size="lg" src="broken.jpg" alt="Jean Dupont" />
          <q-avatar size="lg" src="broken.jpg" icon="lucide:user" color="secondary" />
          <q-avatar size="lg" src="broken.jpg" color="positive">
            <q-icon name="lucide:heart" color="white" size="28px" />
          </q-avatar>
        </div>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QAvatar</h2>
      <docs-api :comp="avatar" :source="avatarSource" />
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

.demo-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}
.demo-row--avatars {
  padding: 12px 0;
}
</style>
