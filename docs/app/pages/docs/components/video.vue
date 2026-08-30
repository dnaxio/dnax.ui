<script setup lang="ts">
// Video — documentation du composant QVideo : lecteur vidéo basé sur Video.js.
import { ref } from "vue"
import { componentSource, componentTag, useComponent } from "~/composables/useComponentDocs"
import DocsApi from "~/components/DocsApi.vue"
import DocsDemo from "~/components/DocsDemo.vue"

definePageMeta({ layout: "docs" })

const video = useComponent(() => "QVideo")
const videoSource = componentSource("QVideo")
const tag = componentTag("QVideo")

const MP4 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
const POSTER = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
const HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
const YT = "https://www.youtube.com/watch?v=oTxi562M-Bs&list=RDoTxi562M-Bs&start_radio=1"
const PEXELS = "https://www.pexels.com/download/video/28561463"
const PEXELS_BASIC = "https://www.pexels.com/download/video/7313654/"

// — Démo events —
const t = ref(0)
const d = ref(0)
const state = ref("idle")

const usageBasic = `<q-video :src="PEXELS_BASIC" />`

const usagePexels = `<q-video :src="PEXELS" />`

const usageRatio = `<q-video :src="MP4" :poster="POSTER" ratio="4/3" width="420px" />`

const usageAutoplay = `<q-video
  :src="MP4"
  :poster="POSTER"
  autoplay
  muted
  loop
/>`

const usageHls = `<q-video :src="HLS" :poster="POSTER" />`

const usageYoutube = `<q-video :src="YT" />`

const usagePlaceholderSlot = `<q-video :src="MP4">
  <template #placeholder>
    <div class="loading">Loading video…</div>
  </template>
</q-video>`

const usageEvents = `<q-video
  :src="MP4"
  :poster="POSTER"
  @timeupdate="({ currentTime }) => t = currentTime"
  @loadedmetadata="({ duration }) => d = duration"
  @play="state = 'playing'"
  @pause="state = 'paused'"
/>
<p class="demo-p demo-meta">t = {{ t.toFixed(1) }}s · duration = {{ d.toFixed(1) }}s · state = {{ state }}</p>`

const scriptBasic = `const PEXELS_BASIC = "https://www.pexels.com/download/video/7313654/"`

const scriptHls = `const HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"`

const scriptYoutube = `const YT = "https://www.youtube.com/watch?v=oTxi562M-Bs&list=RDoTxi562M-Bs&start_radio=1"`

const scriptPexels = `const PEXELS = "https://www.pexels.com/download/video/28561463"`

const scriptEvents = `import { ref } from "vue"

const t = ref(0)
const d = ref(0)
const state = ref("idle")`
</script>

<template>
  <div class="doc">
    <div class="doc-head">
      <h1 class="doc-title">Video</h1>
      <code class="doc-tag">&lt;{{ tag }}&gt;</code>
    </div>

    <p class="doc-lead">
      A full-featured video player powered by <b>Video.js</b>:
      <b>&lt;q-video&gt;</b> plays <code>mp4</code>, <code>webm</code>, HLS
      (<code>.m3u8</code>), <b>YouTube</b> and more with a poster, a
      configurable <code>ratio</code> (16/9 by default), a loading
      <code>placeholder</code> and standard
      <code>controls</code> / <code>autoplay</code> / <code>loop</code> /
      <code>muted</code> props. Emits playback events
      (<code>@play</code>, <code>@pause</code>, <code>@ended</code>,
      <code>@timeupdate</code>, <code>@loadedmetadata</code>,
      <code>@volumechange</code>, <code>@ready</code>) and exposes player
      methods (<code>play</code>, <code>pause</code>, <code>seek</code>…).
    </p>

    <!-- ═══════ Basic ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Basic</h2>
      <p class="doc-note">
        A <code>src</code> and an optional <code>poster</code> — the file type
        is detected from the URL.
      </p>

      <docs-demo :code="usageBasic" lang="html" filename="App.vue" :script="scriptBasic">
        <q-video :src="PEXELS_BASIC" />
      </docs-demo>
    </section>

    <!-- ═══════ Pexels ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Pexels</h2>
      <p class="doc-note">
        Direct file links (like Pexels downloads) work too — the browser follows
        the redirect to the mp4.
      </p>

      <docs-demo :code="usagePexels" lang="html" filename="App.vue" :script="scriptPexels">
        <q-video :src="PEXELS" />
      </docs-demo>
    </section>

    <!-- ═══════ Ratio & width ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Ratio &amp; width</h2>
      <p class="doc-note">
        <code>ratio</code> sets the frame (16/9 default, 4/3, 1/1 or
        <code>none</code>) and <code>width</code> caps the player.
      </p>

      <docs-demo :code="usageRatio" lang="html" filename="App.vue" :script="scriptBasic">
        <q-video :src="MP4" :poster="POSTER" ratio="4/3" width="420px" />
      </docs-demo>
    </section>

    <!-- ═══════ Autoplay muted loop ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Autoplay, muted, loop</h2>
      <p class="doc-note">
        The classic hero background: <code>autoplay muted loop</code> — the
        default skin still shows its controls on hover.
      </p>

      <docs-demo :code="usageAutoplay" lang="html" filename="App.vue" :script="scriptBasic">
        <q-video :src="MP4" :poster="POSTER" autoplay muted loop />
      </docs-demo>
    </section>

    <!-- ═══════ YouTube ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">YouTube</h2>
      <p class="doc-note">
        YouTube URLs (<code>youtube.com/watch?v=…</code>, <code>youtu.be/…</code>)
        are detected automatically and played through the YouTube tech.
      </p>

      <docs-demo :code="usageYoutube" lang="html" filename="App.vue" :script="scriptYoutube">
        <q-video :src="YT" />
      </docs-demo>
    </section>

    <!-- ═══════ HLS ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">HLS streaming</h2>
      <p class="doc-note">
        Pass an <code>.m3u8</code> URL — HLS is handled by Video.js out of the
        box.
      </p>

      <docs-demo :code="usageHls" lang="html" filename="App.vue" :script="scriptHls">
        <q-video :src="HLS" :poster="POSTER" />
      </docs-demo>
    </section>

    <!-- ═══════ Placeholder ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Placeholder</h2>
      <p class="doc-note">
        The <code>#placeholder</code> slot shows custom content over the player
        while the video loads — it disappears once the media is ready, and a
        click starts playback.
      </p>

      <docs-demo :code="usagePlaceholderSlot" lang="html" filename="App.vue">
        <q-video :src="MP4">
          <template #placeholder>
            <div class="demo-loading">
              <q-spinner size="28px" color="#fff" />
              <span>Loading video…</span>
            </div>
          </template>
        </q-video>
      </docs-demo>
    </section>

    <!-- ═══════ Events ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">Events</h2>
      <p class="doc-note">
        <code>@timeupdate</code>, <code>@loadedmetadata</code>,
        <code>@play</code> / <code>@pause</code> keep your UI in sync.
      </p>

      <docs-demo :code="usageEvents" lang="html" filename="App.vue" :script="scriptEvents">
        <q-video
          :src="MP4"
          :poster="POSTER"
          @timeupdate="({ currentTime }) => t = currentTime"
          @loadedmetadata="({ duration }) => d = duration"
          @play="state = 'playing'"
          @pause="state = 'paused'"
        />
        <p class="demo-p demo-meta">
          t = {{ t.toFixed(1) }}s · duration = {{ d.toFixed(1) }}s · state = {{ state }}
        </p>
      </docs-demo>
    </section>

    <!-- ═══════ API ═══════ -->
    <section class="doc-section">
      <h2 class="doc-h2">QVideo API</h2>
      <docs-api :comp="video" :source="videoSource" />
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

.demo-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
</style>
